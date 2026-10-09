import { db } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();

    // If user already exist in DB
    const userResult = await db.select().from(users)
        .where(eq(users.email, user?.primaryEmailAddress?.emailAddress ?? ''))

    // if not then insert new user
    if (userResult.length == 0) {
        const result = await db.insert(users).values({
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress ?? '',
        }).returning();

        return NextResponse.json(result);
    }

    return NextResponse.json(userResult[0]);
}