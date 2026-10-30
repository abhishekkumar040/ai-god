import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { tools, agentConfig } from "@/db/schema";
import { AgentConfigSystemPrompt } from "@/data/prompt";
import { buildAgentConfigRespSchema } from "@/data/responseschema";

type Answer = { question: string; answer: string };

// Models are tried in order. Edit this list, or set the env vars below.
const PRIMARY_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.7-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-2.5-flash";

const MAX_ATTEMPTS_PER_MODEL = 3; // 1 try + 2 retries
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getStatus(e: unknown): number | undefined {
  const status = (e as { status?: number })?.status;
  return typeof status === "number" ? status : undefined;
}

export async function POST(req: NextRequest) {
  let body: { prompt?: string; answers?: Answer[]; userId?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, answers, userId } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_CLOUD_GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // Append clarification answers so the model doesn't re-ask them
  const context =
    Array.isArray(answers) && answers.length
      ? `${prompt}\n\nCLARIFICATION ANSWERS:\n` +
      answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n")
      : prompt;

  // Load the available tools from the database
  let aiTools: { slug: string; name: string | null; category: string | null }[];
  try {
    aiTools = await db
      .select({ slug: tools.slug, name: tools.name, category: tools.category })
      .from(tools);
  } catch (e) {
    console.error("[configure] failed to load tools:", e);
    return NextResponse.json({ error: "Could not load tools" }, { status: 500 });
  }

  if (!aiTools.length) {
    return NextResponse.json({ error: "No tools configured" }, { status: 500 });
  }

  const slugs = aiTools.map((t) => t.slug);
  const toolList = aiTools
    .map(
      (t) =>
        `- ${t.slug}${t.name ? `: ${t.name}` : ""}${t.category ? ` [${t.category}]` : ""}`
    )
    .join("\n");

  const ai = new GoogleGenAI({ apiKey });

  // Function replacers keep "$&" or "$1" in user text from being treated as patterns
  const contents = AgentConfigSystemPrompt
    .replace("AVAILABLE_PLATFORM_TOOLS", () => toolList)
    .replace("{USER_PROMPT}", () => context);

  // Schema's tools enum is built from the same database slugs
  const responseSchema = buildAgentConfigRespSchema(slugs);

  const models = [...new Set([PRIMARY_MODEL, FALLBACK_MODEL])];
  let lastError: unknown;
  let aiOutput: any = null;

  outer: for (const model of models) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            // Only the primary model gets thinking config; fallbacks may not support it
            ...(model === PRIMARY_MODEL
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM } }
              : {}),
            responseMimeType: "application/json",
            responseSchema,
          },
        });

        const cleaned = (response.text ?? "")
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        if (!cleaned) {
          throw Object.assign(new Error("Empty response from model"), { status: 502 });
        }

        aiOutput = JSON.parse(cleaned);
        break outer; // valid response, stop retrying
      } catch (e) {
        lastError = e;
        const status = getStatus(e);
        console.error(
          `[configure] ${model} attempt ${attempt} failed (status ${status ?? "n/a"})`
        );

        // Non-retryable (bad key, bad request, bad model name): try next model right away
        if (status === undefined || !RETRYABLE_STATUS.has(status)) break;

        // Wait before retrying: 1s, then 2s
        if (attempt < MAX_ATTEMPTS_PER_MODEL) await sleep(1000 * attempt);
      }
    }
  }

  if (!aiOutput) {
    console.error("[configure] all models failed:", lastError);

    const status = getStatus(lastError);
    if (status === 503 || status === 429) {
      return NextResponse.json(
        { error: "The AI is busy right now. Please try again in a minute." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  // Model says the config is ready: save the agent
  if (aiOutput.status === "ready" && aiOutput.config) {
    const config = aiOutput.config;
    const agentImage = `https://api.dicebear.com/10.x/croodles/svg?seed=${randomUUID()}`;

    try {
      const [insertedAgent] = await db
        .insert(agentConfig)
        .values({
          userId: userId || "anonymous",
          agentName: config.name,
          agentImage,
          description: config.description,
          objective: config.objective,
          instructions: config.instructions,
          tools: config.tools ?? [],
          skills: config.skills ?? [],
          scheduleType: config.schedule?.type ?? "on_demand",
          scheduleFrequency: config.schedule?.frequency ?? "none",
          scheduleTime: config.schedule?.time ?? "",
          outputFormat: config.outputFormat,
          isActive: true,
        })
        .returning();

      return NextResponse.json({ ...aiOutput, agent: insertedAgent });
    } catch (e) {
      console.error("[configure] failed to save agent:", e);
      return NextResponse.json({ error: "Could not save agent" }, { status: 500 });
    }
  }

  // Not ready yet (e.g. clarification questions): pass through as-is
  return NextResponse.json(aiOutput);
}