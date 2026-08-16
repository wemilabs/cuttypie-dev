"use client";

import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/auth-client";
import { useAuth } from "./auth-context";

type Provider = "github" | "google";

export function AuthModal() {
  const { isOpen, closeAuth } = useAuth();
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);

  const handleSignIn = async (provider: Provider) => {
    setPendingProvider(provider);
    try {
      await signIn.social({
        provider,
        callbackURL: window.location.href,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setPendingProvider(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAuth}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            Sign in with your favorite provider to join the conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            disabled={pendingProvider !== null}
            onClick={() => handleSignIn("github")}
          >
            <Icons.github className="size-4 fill-current" />
            {pendingProvider === "github"
              ? "Redirecting..."
              : "Continue with GitHub"}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            disabled={pendingProvider !== null}
            onClick={() => handleSignIn("google")}
          >
            <Icons.google className="size-4" />
            {pendingProvider === "google"
              ? "Redirecting..."
              : "Continue with Google"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
