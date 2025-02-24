import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

/**
 * Gets the current session from the JWT token in cookies
 * @returns The session data if authenticated, null otherwise
 */
export async function getSession() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    if (!payload || !payload.id || !payload.email || !payload.name) {
      return null;
    }

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

/**
 * Generates a salt and hashes the password using scrypt
 * @param password - The plain text password to hash
 * @returns The hashed password with salt in format: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a hash
 * @param password - The plain text password to verify
 * @param hashedPassword - The stored password hash with salt
 * @returns boolean indicating if the password matches
 */
export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedHashBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, suppliedHashBuffer);
}
