import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing && existing.passwordHash) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.upsert({
            where: { email },
            update: { passwordHash, name: name ?? null, profileComplete: true },
            create: { email, passwordHash, name: name ?? null, profileComplete: true },
        });

        await setSessionCookie(user.id);
        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


