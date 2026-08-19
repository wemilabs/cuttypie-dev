import { getAllPosts } from "@/lib/blog";
import { PostItem } from "./post-item";

export async function PostGrid() {
  const posts = await getAllPosts();
  const featuredPost = posts.find((post) => post.postOfTheDay) ?? posts[0];
  const latestPosts = posts.filter((post) => post.slug !== featuredPost?.slug);

  if (!featuredPost) {
    return (
      <div className="rounded border border-dashed border-primary/30 px-6 py-16 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        No transmissions available
      </div>
    );
  }

  return (
    <div className="space-y-14 md:space-y-20">
      <section aria-labelledby="featured-post-heading" className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-primary glow-sm" />
          <h2
            className="font-mono text-xs uppercase tracking-[0.24em] text-primary"
            id="featured-post-heading"
          >
            Featured post
          </h2>
          <span className="h-px grow bg-linear-to-r from-primary/40 to-transparent" />
        </div>
        <PostItem featured post={featuredPost} />
      </section>

      {latestPosts.length > 0 ? (
        <section aria-labelledby="latest-posts-heading" className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">
              02
            </span>
            <h2
              className="font-mono text-xs uppercase tracking-[0.24em] text-foreground"
              id="latest-posts-heading"
            >
              More posts
            </h2>
            <span className="h-px grow bg-border" />
            <span className="font-mono text-[10px] text-muted-foreground">
              {latestPosts.length.toString().padStart(2, "0")} entries
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post) => (
              <PostItem key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
