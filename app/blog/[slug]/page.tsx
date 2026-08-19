import { CalendarDays, Clock3, LockKeyhole, Mail, Share2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentAvatar } from "@/components/agent-avatar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/button";
import { CommentsSection } from "@/components/comments";
import { GlowContainer } from "@/components/glow-container";
import { Input } from "@/components/input";
import { PostCover } from "@/components/posts/post-cover";
import { PostItem } from "@/components/posts/post-item";
import { TableOfContents } from "@/components/posts/table-of-contents";
import { Skeleton } from "@/components/skeleton";
import { Tag } from "@/components/tag";
import { CodeBlock } from "@/components/ui/code-block";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

const SITE_URL = "https://lisham.dev";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: `${post.title} - Blog | Lisham.`,
    description: post.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: canonicalPath },
    keywords: post.tags,
    authors: [{ name: "Lisham", url: SITE_URL }],
    creator: "Lisham",
    openGraph: {
      type: "article",
      locale: "en_US",
      url: canonicalPath,
      title: post.title,
      description: post.description,
      siteName: "Lisham.",
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
      creator: "@mthlish",
    },
  };
}

function ShareLinks({ slug, title }: { slug: string; title: string }) {
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Share2 className="size-3.5 text-primary" aria-hidden="true" />
        Share
      </span>
      <Button asChild size="sm" variant="outline">
        <a
          href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true" className="font-mono">
            X
          </span>
          Post
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>
          <Mail aria-hidden="true" />
          Email
        </a>
      </Button>
    </div>
  );
}

function NewsletterPlaceholder() {
  return (
    <GlowContainer
      className="grid-surface relative overflow-hidden border-dashed p-6 md:p-8"
      hover={false}
      intensity="sm"
    >
      <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Coming soon
          </div>
          <h2 className="text-xl font-semibold">Newsletter</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A low-frequency digest of new posts. Subscription is not yet
            enabled.
          </p>
        </div>
        <div aria-disabled="true" className="flex w-full gap-2 md:w-96">
          <Input
            aria-label="Email address for future newsletter"
            disabled
            placeholder="you@example.com"
            type="email"
          />
          <Button disabled type="button">
            Subscribe
          </Button>
        </div>
      </div>
    </GlowContainer>
  );
}

async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const relatedPosts = await getRelatedPosts(post);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8">
      <BreadcrumbNav
        className="mb-8"
        items={[
          { href: "/", label: "Home" },
          { href: "/blog", label: "Blog" },
          { active: true, label: post.title },
        ]}
      />

      <article>
        <header className="mx-auto mb-10 max-w-5xl space-y-6 text-center md:mb-14">
          <div className="flex flex-wrap justify-center gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} variant="outline">
                {tag}
              </Tag>
            ))}
          </div>
          <h1 className="text-balance text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
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
            <span>By Lisham</span>
          </div>
        </header>

        <PostCover
          className="mb-12 aspect-16/8 min-h-64 w-full rounded border border-primary/20 md:mb-16"
          image={post.coverImage}
          priority
          title={post.title}
        />

        <div className="mx-auto mb-10 max-w-6xl rounded border border-primary/20 bg-card/60 p-5 lg:hidden">
          <TableOfContents items={post.tableOfContents} />
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <div className="min-w-0">
            <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-8 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-pre:rounded prose-pre:border prose-pre:border-border prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-img:rounded prose-img:border prose-img:border-border">
              <CodeBlock html={post.content} />
            </div>

            <div className="mt-12 border-y border-border py-6">
              <ShareLinks slug={post.slug} title={post.title} />
            </div>
          </div>

          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <TableOfContents items={post.tableOfContents} />
          </aside>
        </div>
      </article>

      <div className="mx-auto mt-16 max-w-6xl space-y-12 md:mt-24">
        <GlowContainer
          className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center md:p-8"
          intensity="sm"
        >
          <AgentAvatar animated hue={48} seed="Lisham / Athena" size={72} />
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Written by
            </div>
            <h2 className="text-xl font-semibold">Lisham</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A self-taught Gabonese full-stack developer who has been coding
              professionally since 2019, researching and writing about the
              technologies shaping modern systems.
            </p>
          </div>
        </GlowContainer>

        <NewsletterPlaceholder />

        {relatedPosts.length > 0 ? (
          <section
            aria-labelledby="related-posts-heading"
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <h2
                className="font-mono text-xs uppercase tracking-[0.24em] text-primary"
                id="related-posts-heading"
              >
                Related posts
              </h2>
              <span className="h-px grow bg-linear-to-r from-primary/40 to-transparent" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostItem key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="border-t border-primary/20 pt-10" id="comments">
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            }
          >
            <CommentsSection postSlug={post.slug} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function BlogPostSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-8 w-64" />
      <div className="mx-auto max-w-5xl space-y-5 py-6 text-center">
        <Skeleton className="mx-auto h-6 w-48" />
        <Skeleton className="mx-auto h-14 w-full max-w-3xl" />
        <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
      </div>
      <Skeleton className="aspect-16/8 min-h-64 w-full" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <Skeleton className="hidden h-72 lg:block" />
      </div>
    </main>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}
