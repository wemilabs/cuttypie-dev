"use client";

import { useState } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { signIn, signUp } from "@/lib/auth-client";
import { useAuth } from "./auth-context";

export function AuthForm() {
  const { mode, switchMode, closeAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    try {
      const result =
        mode === "signup"
          ? await signUp.email({ email, password, name })
          : await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Something went wrong");
        return;
      }

      closeAuth();
    } catch (err) {
      console.error("Auth error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-destructive text-xs"
          role="alert"
        >
          {error}
        </div>
      )}

      {mode === "signup" && (
        <div className="space-y-2">
          <Label
            className="font-mono text-xs uppercase tracking-wider"
            htmlFor="name"
          >
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            minLength={2}
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label
          className="font-mono text-xs uppercase tracking-wider"
          htmlFor="email"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label
          className="font-mono text-xs uppercase tracking-wider"
          htmlFor="password"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="w-full font-mono text-xs uppercase tracking-widest"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {mode === "signin" ? "Signing in..." : "Creating account..."}
          </div>
        ) : mode === "signin" ? (
          "Sign In"
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center font-mono text-muted-foreground text-xs">
        {mode === "signin"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          type="button"
          className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          onClick={switchMode}
          disabled={isSubmitting}
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </form>
  );
}
