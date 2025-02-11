import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/blog";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: `${post.title} - Blog | Matheo (cuttypie)`,
    description: post.description,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <article className="max-w-4xl mx-auto px-6 py-24">
      {/* Back to blog link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-white/60 hover:text-white mb-8 transition"
      >
        <svg
          className="mr-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to blog
      </Link>

      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4">
          <time dateTime={post.date} className="text-white/60">
            {formatDate(post.date)}
          </time>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-white/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Article content */}
      <div
        className="prose prose-invert prose-yellow max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
