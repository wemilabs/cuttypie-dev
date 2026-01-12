"use server";

import { cookies } from "next/headers";
import {
  SignInInput,
  SignUpInput,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import { hashPassword, verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as jose from "jose";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

interface Session {
  id: string;
  email: string;
  name: string;
}

interface AuthSuccess {
  success: true;
  session: Session;
}

interface AuthError {
  success: false;
  error: string;
}

interface SignOutResponse {
  success: true;
}

type AuthResponse = AuthSuccess | AuthError;

function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError && error.issues.length > 0)
    return error.issues[0].message;

  if (error instanceof Error && typeof error.message === "string")
    return error.message;

  if (error && typeof error === "object" && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.length > 0) return message;
  }

  return "An unexpected error occurred";
}

export async function signUp(data: SignUpInput): Promise<AuthResponse> {
  try {
    const validatedData = signUpSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser)
      return { success: false, error: "Email already registered" };

    const hashedPassword = hashPassword(validatedData.password);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name || "Anonymous",
        password: hashedPassword,
      },

      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user.id || !user.email || !user.name)
      throw new Error("Failed to create user with required fields");

    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    revalidatePath("/blog");

    return {
      success: true,
      session: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function signIn(data: SignInInput): Promise<AuthResponse> {
  try {
    const validatedData = signInSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!user?.id || !user.email || !user.name || !user.password)
      return { success: false, error: "Invalid email or password" };

    const isValid = verifyPassword(validatedData.password, user.password);
    if (!isValid) return { success: false, error: "Invalid email or password" };

    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    revalidatePath("/blog");

    return {
      success: true,
      session: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function signOut(): Promise<SignOutResponse> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  revalidatePath("/blog");
  return { success: true };
}
