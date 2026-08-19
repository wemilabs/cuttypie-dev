"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];

        if (visibleEntry?.target.id) setActiveId(visibleEntry.target.id);
      },
      { rootMargin: "-15% 0px -70%", threshold: [0, 1] },
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  let h2Count = 0;
  let h3Count = 0;
  const numberedItems = items.map((item) => {
    const title = item.title.replace(/^\d+\.\s+/, "");
    if (item.level === 2) {
      h2Count += 1;
      h3Count = 0;
      return { ...item, number: `${h2Count}`, title };
    }
    h3Count += 1;
    return { ...item, number: `${h2Count}.${h3Count}`, title };
  });

  return (
    <nav aria-label="Table of contents" className="space-y-4">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        <span className="size-1.5 rounded-full bg-primary glow-sm" />
        On this page
      </div>
      <ol className="space-y-1 border-l border-border">
        {numberedItems.map((item) => (
          <li key={item.id}>
            <a
              aria-current={activeId === item.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pr-2 font-mono text-[10px] leading-relaxed text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
                item.level === 2 ? "pl-4" : "pl-7",
                activeId === item.id && "border-primary text-primary",
              )}
              href={`#${item.id}`}
            >
              <span className="mr-2 text-foreground/30">{item.number}</span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
