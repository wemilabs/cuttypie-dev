import { ArrowUpRight, CalendarDays, Clock3, Star } from "lucide-react";
import Link from "next/link";
import { GlowContainer } from "@/components/glow-container";
import { Tag } from "@/components/tag";
import type { BlogPost } from "@/lib/blog";
import { cn, formatDate } from "@/lib/utils";
import { PostCover } from "./post-cover";

interface PostItemProps {
  featured?: boolean;
  post: BlogPost;
}

export function PostItem({ featured = false, post }: PostItemProps) {
  return (
    <GlowContainer
      className={cn(
        "group h-full overflow-hidden rounded p-0",
        featured && "border-primary/35",
      )}
      intensity="sm"
    >
      <article
        className={cn(
          "flex h-full flex-col",
          featured && "lg:grid lg:grid-cols-[1.2fr_1fr]",
        )}
      >
        <Link
          aria-label={`Read ${post.title}`}
          className="block overflow-hidden"
          href={`/blog/${post.slug}`}
        >
          <PostCover
            className={cn(
              "h-48 w-full transition-transform duration-500 group-hover:scale-[1.02]",
              featured && "h-64 lg:h-full lg:min-h-96",
            )}
            image={post.coverImage}
            priority={featured}
            title={post.title}
          />
        </Link>

        <div
          className={cn(
            "flex grow flex-col gap-4 p-5 md:p-6",
            featured && "justify-center md:p-8",
          )}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                className="size-3.5 text-primary"
                aria-hidden="true"
              />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
              {post.readingTime} min read
            </span>
          </div>

          {featured ? (
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              <Star className="size-3.5 fill-current" aria-hidden="true" />
              Post of the day
            </div>
          ) : null}

          <div className="space-y-3">
            <h2
              className={cn(
                "text-xl font-semibold leading-tight transition-colors group-hover:text-primary md:text-2xl",
                featured && "text-2xl md:text-3xl",
              )}
            >
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, featured ? 5 : 3).map((tag) => (
              <Tag key={tag} variant="outline">
                {tag}
              </Tag>
            ))}
          </div>

          <Link
            className="mt-auto inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground"
            href={`/blog/${post.slug}`}
          >
            Read post
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </GlowContainer>
  );
}
