import { ExternalLink } from "lucide-react";
import Image from "next/image";

import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

export type BadgeType =
  | "os contribution"
  | "current"
  | "in progress"
  | "paused"
  | "done";

export function ProjectCard({
  title,
  description,
  image,
  link,
  badge,
  className,
}: Project) {
  return (
    <div
      className={cn(
        "group flex flex-col h-full rounded-xl overflow-hidden border border-border bg-linear-to-b from-muted/50 to-muted/20 backdrop-blur-sm transition-all duration-300 hover:border-brand/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:-translate-y-1",
        className,
        badge === "paused" && "opacity-50",
      )}
    >
      <div className="relative h-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <Image
          src={
            image ??
            "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIIU0MlBPxpbxQUqOZN6A0LHBjPY4Vlwumcioz"
          }
          alt={title}
          width={800}
          height={450}
          loading="eager"
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <div
            className={cn(
              "absolute top-3 left-3 z-20 px-2.5 py-1 text-xs font-medium text-white rounded-full",
              badge === "paused"
                ? "bg-red-500/90"
                : badge === "current"
                  ? "bg-cyan-500/90"
                  : badge === "done"
                    ? "bg-green-500/90"
                    : badge === "in progress"
                      ? "bg-amber-500/90"
                      : "bg-background/90 text-foreground",
            )}
          >
            {badge}
          </div>
        )}
      </div>
      <div className="flex flex-col grow p-5 space-y-3">
        <div className="flex items-start justify-between">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <h3 className="text-xl font-bold group-hover:text-brand transition-colors">
              {title}
            </h3>
          </a>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4 text-muted-foreground group-hover:text-brand transition-colors" />
          </a>
        </div>
        <p className="text-muted-foreground text-sm grow">{description}</p>
        <div className="pt-2">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <span className="text-xs font-medium text-brand/80 group-hover:text-brand transition-colors inline-flex items-center">
              View project
              <svg
                className="w-3.5 h-3.5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
