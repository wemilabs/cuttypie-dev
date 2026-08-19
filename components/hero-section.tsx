import type * as React from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  align?: "left" | "center";
  badge?: string;
  description?: string;
  subtitle?: string;
  title: React.ReactNode;
}

export function HeroSection({
  align = "center",
  badge,
  children,
  className,
  description,
  subtitle,
  title,
  ...props
}: HeroSectionProps) {
  return (
    <section
      data-slot="tron-hero-section"
      className={cn(
        "scanline-surface grid-surface relative overflow-hidden rounded border border-primary/30 bg-card/75 px-6 py-16 md:px-12 md:py-24",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
      <div className="absolute top-0 left-0 size-6 border-primary/70 border-t-2 border-l-2" />
      <div className="absolute top-0 right-0 size-6 border-primary/70 border-t-2 border-r-2" />
      <div className="absolute bottom-0 left-0 size-6 border-primary/70 border-b-2 border-l-2" />
      <div className="absolute right-0 bottom-0 size-6 border-primary/70 border-r-2 border-b-2" />
      <div
        className={cn(
          "relative z-10 flex flex-col gap-4",
          align === "center"
            ? "items-center text-center"
            : "items-start text-left",
        )}
      >
        {badge ? (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-primary glow-sm" />
            {badge}
          </span>
        ) : null}
        {subtitle ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-3xl font-bold md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <div className="flex gap-1">
          <span className="h-px w-12 bg-primary" />
          <span className="h-px w-6 bg-primary/50" />
          <span className="h-px w-3 bg-primary/25" />
        </div>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
