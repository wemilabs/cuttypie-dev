import { GlowContainer } from "@/components/glow-container";
import { Tag } from "@/components/tag";
import type { BadgeType, Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type { BadgeType } from "@/lib/data";

const fallbackImage =
  "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIIU0MlBPxpbxQUqOZN6A0LHBjPY4Vlwumcioz";

const badgeVariants: Record<
  BadgeType,
  "default" | "success" | "warning" | "danger" | "outline"
> = {
  current: "default",
  done: "success",
  "in progress": "warning",
  "os contribution": "outline",
  paused: "danger",
};

function ProjectContent({
  badge,
  description,
  image,
  link,
  title,
}: Pick<Project, "badge" | "description" | "image" | "link" | "title">) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden border-border/60 border-b bg-muted">
        <Image
          src={image ?? fallbackImage}
          alt={`Preview of ${title}`}
          fill
          sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(50vw - 2.5rem), 35rem"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
        <Tag
          variant={badgeVariants[badge]}
          glow={badge !== "os contribution"}
          className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
        >
          {badge}
        </Tag>
      </div>
      <div className="flex grow flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg transition-colors group-hover:text-primary sm:text-xl">
            {title}
          </h3>
          {link ? (
            <ArrowUpRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            />
          ) : null}
        </div>
        <p className="grow text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {link ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            View project
          </span>
        ) : null}
      </div>
    </>
  );
}

function ProjectSurface({
  badge,
  children,
  className,
}: {
  badge: BadgeType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlowContainer
      intensity="sm"
      className={cn(
        "group h-full overflow-hidden rounded p-0",
        badge === "paused" && "opacity-60",
        className,
      )}
    >
      {children}
    </GlowContainer>
  );
}

export function ProjectCard(project: Project) {
  const { badge, className, link, title } = project;

  return (
    <article className="h-full">
      <ProjectSurface badge={badge} className={className}>
        {link ? (
          <Link
            href={link as Route}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} project (opens in a new tab)`}
            className="flex h-full flex-col rounded outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ProjectContent {...project} />
          </Link>
        ) : (
          <div className="flex h-full flex-col">
            <ProjectContent {...project} />
          </div>
        )}
      </ProjectSurface>
    </article>
  );
}
