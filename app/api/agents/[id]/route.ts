import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentConfig, agentRun } from "@/db/schema";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx): Promise<number | null> {
    const { id } = await ctx.params;
    const n = Number(id);
    return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * PATCH /api/agents/:id
 * Body (all optional): { isActive, agentName, description, instructions }
 */
export async function PATCH(req: NextRequest, ctx: Ctx) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = await parseId(ctx);
    if (!id) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const updates: Partial<typeof agentConfig.$inferInsert> = {};

    if ("isActive" in body) {
        if (typeof body.isActive !== "boolean") {
            return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
        }
        updates.isActive = body.isActive;
    }

    if ("agentName" in body) {
        if (typeof body.agentName !== "string" || !body.agentName.trim()) {
            return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
        }
        updates.agentName = body.agentName.trim();
    }

    if ("description" in body) {
        if (typeof body.description !== "string") {
            return NextResponse.json({ error: "Invalid description" }, { status: 400 });
        }
        updates.description = body.description.trim();
    }

    if ("instructions" in body) {
        if (typeof body.instructions !== "string" || !body.instructions.trim()) {
            return NextResponse.json({ error: "Instructions cannot be empty" }, { status: 400 });
        }
        updates.instructions = body.instructions.trim();
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    try {
        const [agent] = await db
            .update(agentConfig)
            .set(updates)
            .where(and(eq(agentConfig.id, id), eq(agentConfig.userId, userId)))
            .returning();

        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }
        return NextResponse.json({ agent });
    } catch (e) {
        console.error("[agents] update failed:", e);
        return NextResponse.json({ error: "Could not update agent" }, { status: 500 });
    }
}

/** DELETE /api/agents/:id: remove an agent and its run history. */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = await parseId(ctx);
    if (!id) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    try {
        // Only the owner may delete
        const [owned] = await db
            .select({ id: agentConfig.id })
            .from(agentConfig)
            .where(and(eq(agentConfig.id, id), eq(agentConfig.userId, userId)));

        if (!owned) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        // agent_run references agent_config, so remove runs first
        await db.delete(agentRun).where(eq(agentRun.agentConfigId, id));
        await db.delete(agentConfig).where(eq(agentConfig.id, id));

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("[agents] delete failed:", e);
        return NextResponse.json({ error: "Could not delete agent" }, { status: 500 });
    }
}