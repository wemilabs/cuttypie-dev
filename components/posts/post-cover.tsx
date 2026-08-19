import { ImageIcon } from "lucide-react";
import { BLOG_COVER_FALLBACK } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface PostCoverProps {
  className?: string;
  image: string;
  priority?: boolean;
  title: string;
}

export function PostCover({
  className,
  image,
  priority = false,
  title,
}: PostCoverProps) {
  const coverImage = image || BLOG_COVER_FALLBACK;

  return (
    <div
      aria-label={`Cover image for ${title}`}
      className={cn(
        "relative overflow-hidden bg-muted bg-cover bg-center",
        className,
      )}
      data-priority={priority || undefined}
      role="img"
      style={{ backgroundImage: `url(${JSON.stringify(coverImage)})` }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10" />
      {coverImage === BLOG_COVER_FALLBACK ? (
        <div className="absolute inset-0 flex items-center justify-center text-primary/50">
          <ImageIcon className="size-10" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
}
