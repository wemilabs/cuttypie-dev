"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/button";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded border border-destructive/30 bg-destructive/10">
        <AlertTriangle className="size-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        There was an error getting this blog post.
      </p>
      <Button onClick={() => reset()} variant="default">
        Try again
      </Button>
    </main>
  );
}
