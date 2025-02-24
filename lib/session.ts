import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function getSession() {
  try {
    const token = (await cookies()).get("auth-token")?.value;

    if (!token) return null;

    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
