import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import Error from "./error";

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
    metadataBase: new URL("https://cuttypiedev.vercel.app/blog/"),
    keywords: post.tags,
    authors: [
      {
        name: "cuttypie",
        url: "https://cuttypiedev.vercel.app/",
      },
    ],
    creator: "cuttypie",
    // openGraph: {
    //   type: "website",
    //   locale: "en_US",
    //   url: "https://cuttypiedev.vercel.app/",
    //   title: "Matheo (cuttypie)",
    //   description: "cuttypie's blog.",
    //   siteName: "Matheo (cuttypie)",
    //   images: [
    //     {
    //       url: "https://cuttypiedev.vercel.app/avatar.webp",
    //       width: 1200,
    //       height: 630,
    //       alt: "Matheo (cuttypie)",
    //     },
    //   ],
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title: "Matheo (cuttypie)",
    //   description: "cuttypie's blog.",
    //   images: ["https://cuttypiedev.vercel.app/avatar.webp"],
    //   creator: "@DorianTho5",
    // },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  !post && <Error />;

  return (
    <article className="max-w-4xl mx-auto px-6 py-24 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-white/60 hover:text-white mb-8 transition"
      >
        <svg
          className="mr-2 size-4"
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

      <header className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <time dateTime={post.date} className="text-sm text-white/60 shrink-0">
            {formatDate(post.date)}
          </time>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-white/10 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-base text-white/70">{post.description}</p>
      </header>

      <div
        className="prose dark:prose-invert max-w-none
          prose-headings:font-semibold
          prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-0
          prose-p:text-base prose-p:leading-7 prose-p:my-2
          prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-yellow-500 prose-strong:font-semibold
          prose-code:text-yellow-500 prose-code:bg-gray-800/50 prose-code:rounded prose-code:px-1
          prose-pre:bg-gray-800/50 prose-pre:rounded-lg prose-pre:p-4
          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
          prose-li:my-2
          prose-blockquote:border-l-4 prose-blockquote:border-yellow-500 prose-blockquote:pl-4 prose-blockquote:italic
          prose-img:rounded-lg prose-img:mt-12 prose-img:mb-4"
      >
        <CodeBlock html={post.content} />
      </div>
    </article>
  );
}
