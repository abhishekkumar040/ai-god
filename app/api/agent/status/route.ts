import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentConfig } from "@/db/schema";

const STATUSES = ["active", "paused", "draft", "archived"] as const;

export async function PATCH(req: NextRequest) {
  const { agentId, userId, status } = await req.json().catch(() => ({}));

  if (!agentId || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "agentId and a valid status are required" }, { status: 400 });
  }

  const [updated] = await db
    .update(agentConfig)
    .set({ status, isActive: status === "active" })
    .where(and(eq(agentConfig.id, Number(agentId)), eq(agentConfig.userId, userId || "anonymous")))
    .returning();

  if (!updated) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  return NextResponse.json({ agent: updated });
}
