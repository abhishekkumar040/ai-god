import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentConfig, agentRun } from "@/db/schema";
import { runTools } from "@/lib/agent-tools";

const MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  const { agentId, userId } = await req.json().catch(() => ({}));
  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const [agent] = await db
    .select()
    .from(agentConfig)
    .where(and(eq(agentConfig.id, Number(agentId)), eq(agentConfig.userId, userId || "anonymous")));

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  if (agent.status !== "active") {
    return NextResponse.json({ error: `Agent is ${agent.status}` }, { status: 409 });
  }

  const [run] = await db
    .insert(agentRun)
    .values({ agentConfigId: agent.id, status: "running" })
    .returning();

  try {
    const toolData = await runTools(agent.tools);

    const prompt = `You are the agent "${agent.agentName}".
Objective: ${agent.objective ?? ""}

Instructions:
${agent.instructions ?? ""}

Tool data (JSON):
${JSON.stringify(toolData).slice(0, 60000)}

Output format: ${agent.outputFormat ?? "Markdown"}
Use only the tool data above. Do not invent posts or links.`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
    const text = response.text ?? "";

    const [done] = await db
      .update(agentRun)
      .set({ status: "completed", output: { text }, logs: `Tools used: ${agent.tools.join(", ")}` })
      .where(eq(agentRun.id, run.id))
      .returning();

    await db.update(agentConfig).set({ lastRunAt: new Date() }).where(eq(agentConfig.id, agent.id));

    return NextResponse.json({ run: done });
  } catch (e) {
    console.error("[run] failed:", e);
    await db
      .update(agentRun)
      .set({ status: "failed", logs: String(e) })
      .where(eq(agentRun.id, run.id));
    return NextResponse.json({ error: "Run failed", runId: run.id }, { status: 500 });
  }
}
