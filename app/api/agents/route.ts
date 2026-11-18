import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentConfig } from "@/db/schema";

/** GET /api/agents: list the signed-in user's agents (newest first). */
export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const agents = await db
            .select()
            .from(agentConfig)
            .where(eq(agentConfig.userId, userId))
            .orderBy(desc(agentConfig.createdAt));

        return NextResponse.json({ agents });
    } catch (e) {
        console.error("[agents] list failed:", e);
        return NextResponse.json({ error: "Could not load agents" }, { status: 500 });
    }
}

/** POST /api/agents: save an AI-generated config as a new agent. Body: { config } */
export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { config?: Record<string, any> };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const c = body.config;
    if (!c || typeof c.name !== "string" || !c.name.trim() || typeof c.instructions !== "string") {
        return NextResponse.json({ error: "Invalid agent config" }, { status: 400 });
    }

    const scheduleType = c.schedule?.type === "recurring" ? "recurring" : "on_demand";

    try {
        const [agent] = await db
            .insert(agentConfig)
            .values({
                userId,
                agentName: c.name.trim(),
                description: c.description ?? null,
                objective: c.objective ?? null,
                instructions: c.instructions,
                tools: Array.isArray(c.tools) ? c.tools.map(String) : [],
                skills: Array.isArray(c.skills) ? c.skills.map(String) : [],
                scheduleType,
                scheduleFrequency: String(c.schedule?.frequency ?? "none"),
                scheduleTime: String(c.schedule?.time ?? ""),
                outputFormat: c.outputFormat ?? null,
            })
            .returning();

        return NextResponse.json({ agent }, { status: 201 });
    } catch (e) {
        console.error("[agents] create failed:", e);
        return NextResponse.json({ error: "Could not save agent" }, { status: 500 });
    }
}