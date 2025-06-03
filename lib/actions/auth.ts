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

type AuthResponse = AuthSuccess | AuthError;

/**
 * Safely extracts an error message from any type of error
 * Ensures a string is always returned, never null
 */
function getErrorMessage(error: unknown): string {
  // Handle Zod validation errors
  if (error instanceof ZodError && error.errors.length > 0) {
    return error.errors[0].message;
  }

  // Handle standard Error objects
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  // Handle objects with message property
  if (error && typeof error === "object" && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  // Default error message
  return "An unexpected error occurred";
}

/**
 * Creates a new user account and returns a session if successful
 */
export async function signUp(data: SignUpInput): Promise<AuthResponse> {
  try {
    const validatedData = signUpSchema.parse(data);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Create user with required fields
    const hashedPassword = hashPassword(validatedData.password);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name || "Anonymous", // Provide default name
        password: hashedPassword,
      },
      // Explicitly select non-null fields
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Ensure all required fields are present
    if (!user.id || !user.email || !user.name) {
      throw new Error("Failed to create user with required fields");
    }

    // Create JWT token
    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Revalidate all blog pages since user state changed
    revalidatePath("/blog");

    // Return session with verified non-null fields
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

/**
 * Signs in an existing user and returns a session if successful
 */
export async function signIn(data: SignInInput): Promise<AuthResponse> {
  try {
    const validatedData = signInSchema.parse(data);

    // Find user with required fields
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!user?.id || !user.email || !user.name || !user.password) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isValid = verifyPassword(validatedData.password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create JWT token with verified non-null fields
    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Revalidate all blog pages since user state changed
    revalidatePath("/blog");

    // Return session with verified non-null fields
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

interface SignOutResponse {
  success: true;
}

/**
 * Signs out the current user by removing their session cookie
 */
export async function signOut(): Promise<SignOutResponse> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  revalidatePath("/blog");
  return { success: true };
}
