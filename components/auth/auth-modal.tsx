"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { useAuth } from "./auth-context";
import { AuthForm } from "./auth-form";

export function AuthModal() {
  const { isOpen, closeAuth, mode } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={closeAuth}>
      <DialogContent className="overflow-hidden border-primary/25 bg-card/95 shadow-[0_0_32px_color-mix(in_oklab,var(--primary)_12%,transparent)] backdrop-blur-xl sm:max-w-106.25">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <DialogHeader className="border-primary/15 border-b pb-4">
          <DialogTitle className="font-mono uppercase tracking-wider">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {mode === "signin"
              ? "Sign in to join the conversation."
              : "Create an account to join the conversation."}
          </DialogDescription>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
