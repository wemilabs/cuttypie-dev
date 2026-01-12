import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function getSession() {
  try {
    if (
      process.env.NEXT_PHASE === "phase-production-build" ||
      (process.env.NODE_ENV === "development" &&
        typeof window === "undefined" &&
        !process.env.NEXT_RUNTIME)
    ) {
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    if (!payload || !payload.id || !payload.email || !payload.name) return null;

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedHashBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, suppliedHashBuffer);
}
