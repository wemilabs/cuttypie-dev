import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AboutSectionProps {
  children: ReactNode;
  className?: string;
  title: string;
  sectionNumber: number;
}

const AboutSection = ({
  title,
  className,
  children,
  sectionNumber,
}: AboutSectionProps) => (
  <section className={cn("space-y-6", className)}>
    <div className="flex items-center gap-3 border-primary/20 border-b pb-3">
      <span className="font-mono text-primary text-xs" aria-hidden="true">
        {sectionNumber.toString().padStart(2, "0")}
      </span>
      <h2 className="font-bold font-display text-2xl uppercase tracking-wider">
        {title}
      </h2>
      <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent" />
    </div>
    {children}
  </section>
);

export default AboutSection;
