import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { tools, agentConfig } from "@/db/schema";
import { AgentConfigSystemPrompt } from "@/data/prompt";
import { buildAgentConfigRespSchema, TOOL_SLUGS } from "@/data/responseschema";

type Answer = { question: string; answer: string };

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getStatus(e: unknown): number | undefined {
  const status = (e as { status?: number })?.status;
  if (typeof status === "number") return status;
  const respStatus = (e as { response?: { status?: number } })?.response?.status;
  if (typeof respStatus === "number") return respStatus;
  const httpStatus = (e as { httpStatus?: number })?.httpStatus;
  if (typeof httpStatus === "number") return httpStatus;
  return undefined;
}

let cachedAvailableModels: string[] | null = null;
let lastCacheTime = 0;

const NON_TEXT_PATTERNS = [
  "tts",
  "live",
  "audio",
  "image",
  "embedding",
  "transcribe",
  "robotics",
  "computer-use",
  "banana",
  "lyria",
  "decision",
];

function isTextModel(name: string): boolean {
  const lower = name.toLowerCase();
  if (NON_TEXT_PATTERNS.some((p) => lower.includes(p))) return false;
  return lower.includes("flash") || lower.includes("pro") || lower.includes("gemini");
}

async function getAvailableModels(ai: GoogleGenAI): Promise<string[]> {
  const now = Date.now();
  if (cachedAvailableModels && cachedAvailableModels.length > 0 && now - lastCacheTime < 300000) {
    return cachedAvailableModels;
  }
  try {
    const list = await ai.models.list();
    const discovered: string[] = [];
    for await (const m of list) {
      const name = m.name?.replace(/^models\//, "");
      if (name && isTextModel(name)) {
        discovered.push(name);
      }
    }
    if (discovered.length > 0) {
      cachedAvailableModels = discovered;
      lastCacheTime = now;
      console.log("[configure] Discovered text models from API:", discovered);
      return discovered;
    }
  } catch (e) {
    console.warn("[configure] Failed to query model list dynamically:", e);
  }

  // Fallback prioritized text models
  return [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
    process.env.GEMINI_FALLBACK_MODEL,
  ].filter((m): m is string => Boolean(m && m.trim()));
}

async function generateWithTimeout(
  ai: GoogleGenAI,
  params: Parameters<typeof ai.models.generateContent>[0],
  timeoutMs = 12000
) {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Model ${params.model} timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  try {
    return await Promise.race([ai.models.generateContent(params), timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

export async function POST(req: NextRequest) {
  // The signed-in user comes from Clerk, never from the request body
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { prompt?: string; answers?: Answer[] };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, answers } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_CLOUD_GEMINI_API_KEY / GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // Append clarification answers so the model doesn't re-ask them
  const context =
    Array.isArray(answers) && answers.length
      ? `${prompt}\n\nCLARIFICATION ANSWERS:\n` +
      answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n")
      : prompt;

  // Load the available tools from the database (with fallback to default tools)
  let aiTools: { slug: string; name: string | null; category: string | null }[] = [];
  try {
    aiTools = await db
      .select({ slug: tools.slug, name: tools.name, category: tools.category })
      .from(tools);
  } catch (e) {
    console.warn("[configure] failed to load tools from DB, using fallback:", e);
  }

  if (!aiTools || aiTools.length === 0) {
    aiTools = TOOL_SLUGS.map((slug) => ({
      slug,
      name: slug,
      category: "general",
    }));
  }

  const slugs = aiTools.map((t) => t.slug);
  const toolList = aiTools
    .map(
      (t) =>
        `- ${t.slug}${t.name ? `: ${t.name}` : ""}${t.category ? ` [${t.category}]` : ""}`
    )
    .join("\n");

  const ai = new GoogleGenAI({ apiKey });

  const availableModels = await getAvailableModels(ai);

  // Prioritize active flash text models that support fast structured JSON
  const preferredTextModels = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-3.1-pro-preview",
  ].filter((m): m is string => Boolean(m && m.trim()));

  const allFiltered = [...new Set([...preferredTextModels, ...availableModels])];
  const modelsToTry = allFiltered.slice(0, 6);

  // Replace both {AVAILABLE_PLATFORM_TOOLS} and {USER_PROMPT} placeholders
  const contents = AgentConfigSystemPrompt
    .replace("{AVAILABLE_PLATFORM_TOOLS}", () => toolList)
    .replace("AVAILABLE_PLATFORM_TOOLS", () => toolList)
    .replace("{USER_PROMPT}", () => context);

  // Schema's tools enum is built from the same database slugs
  const responseSchema = buildAgentConfigRespSchema(slugs);

  let lastError: unknown;
  let aiOutput: any = null;

  outer: for (const model of modelsToTry) {
    try {
      const response = await generateWithTimeout(
        ai,
        {
          model,
          contents,
          config: {
            responseMimeType: "application/json",
            responseSchema,
          },
        },
        10000
      );

      const cleaned = (response.text ?? "")
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

      if (!cleaned) {
        throw Object.assign(new Error("Empty response from model"), { status: 502 });
      }

      aiOutput = JSON.parse(cleaned);
      break outer; // valid response, stop trying
    } catch (e) {
      lastError = e;
      const status = getStatus(e);
      console.warn(
        `[configure] model ${model} failed (status ${status ?? "n/a"}, err: ${(e as Error)?.message}), trying next model...`
      );
    }
  }

  if (!aiOutput) {
    console.error("[configure] all models failed:", lastError);

    const status = getStatus(lastError);
    if (status === 503 || status === 429) {
      return NextResponse.json(
        { error: "The AI service is temporarily busy. Please wait a moment and try again." },
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
      const scheduleType =
        config.schedule?.type?.toLowerCase() === "recurring" ? "recurring" : "on_demand";

      const [insertedAgent] = await db
        .insert(agentConfig)
        .values({
          userId,
          agentName: config.name?.trim() || "Untitled Agent",
          agentImage,
          description: config.description ?? null,
          objective: config.objective ?? null,
          instructions: config.instructions ?? "",
          tools: Array.isArray(config.tools) ? config.tools : [],
          skills: Array.isArray(config.skills) ? config.skills : [],
          scheduleType,
          scheduleFrequency: String(config.schedule?.frequency ?? "none"),
          scheduleTime: String(config.schedule?.time ?? ""),
          outputFormat: config.outputFormat ?? null,
          isActive: true,
          status: "active",
        })
        .returning();

      return NextResponse.json({ ...aiOutput, agent: insertedAgent });
    } catch (e) {
      console.error("[configure] failed to save agent:", e);
      // Return the generated config anyway so user does not lose generated agent
      return NextResponse.json({
        ...aiOutput,
        saveWarning: "Agent generated but could not be saved to database. You can save from the review screen.",
      });
    }
  }

  // Not ready yet (e.g. clarification questions): pass through as-is
  return NextResponse.json(aiOutput);
}