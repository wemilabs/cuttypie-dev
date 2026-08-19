import { RadioTowerIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Signal Lost | Lisham",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-2xl overflow-hidden rounded border border-primary/20 border-dashed bg-card/40 px-8 py-16 text-center backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary glow-sm">
          <RadioTowerIcon aria-hidden="true" className="size-7" />
        </div>

        <p className="mb-3 font-mono text-[10px] text-primary uppercase tracking-[0.3em]">
          Error 404 · Connection terminated
        </p>
        <h1 className="font-mono text-3xl uppercase tracking-wider sm:text-4xl">
          Signal lost
        </h1>
        <p className="mx-auto mt-4 max-w-md font-mono text-muted-foreground text-xs leading-relaxed">
          The requested coordinate is unavailable or has moved beyond range.
          Re-establish a connection from the primary node.
        </p>

        <Button
          asChild
          className="mt-8 font-mono text-xs uppercase tracking-widest"
        >
          <Link href="/">Return to base</Link>
        </Button>

        <div className="pointer-events-none absolute top-2 left-2 size-3 border-primary/30 border-t border-l" />
        <div className="pointer-events-none absolute top-2 right-2 size-3 border-primary/30 border-t border-r" />
        <div className="pointer-events-none absolute bottom-2 left-2 size-3 border-primary/30 border-b border-l" />
        <div className="pointer-events-none absolute right-2 bottom-2 size-3 border-primary/30 border-r border-b" />
      </div>
    </main>
  );
}
