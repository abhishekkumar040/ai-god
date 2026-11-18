import { db } from '@/db';
import { users } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    let user;
    try {
        user = await currentUser();
    } catch (e) {
        // Clerk's API could not be reached (network problem): fail softly
        console.error("[users] could not reach Clerk:", e);
        return NextResponse.json({ message: "Auth service unreachable, try again" }, { status: 503 });
    }

    if (!user || !user.primaryEmailAddress?.emailAddress) {
        return NextResponse.json({ message: "No authenticated user found" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;

    // If user already exist in DB
    const userResult = await db.select().from(users)
        .where(eq(users.email, email));

    // if not then insert new user
    if (userResult.length == 0) {
        const result = await db.insert(users).values({
            userId: user.id,
            name: user.fullName,
            email: email,
            imageUrl: user.imageUrl,
        }).returning();
        return NextResponse.json(result[0]);
    }
    return NextResponse.json(userResult[0]);
}
