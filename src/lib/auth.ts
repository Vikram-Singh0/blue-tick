import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "session_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev_insecure_secret_change_me";

export async function hashPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

export function signSessionJwt(payload: { userId: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionJwt(token: string): { userId: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

export async function setSessionCookie(userId: string) {
    const token = signSessionJwt({ userId });
    cookies().set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export function clearSessionCookie() {
    cookies().delete(SESSION_COOKIE);
}

export async function getSessionUser() {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifySessionJwt(token);
    if (!payload) return null;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
}


