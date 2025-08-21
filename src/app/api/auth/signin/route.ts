import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await setSessionCookie(user.id);
        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


