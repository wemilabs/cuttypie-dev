import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Suspense } from "react";
import { ChevronLeft } from "lucide-react";

import { CommentsSection } from "@/components/comments";
import { CodeBlock } from "@/components/ui/code-block";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: `${post.title} - Blog | Mr T. `,
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
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://cuttypiedev.vercel.app/blog/${slug}`,
      title: `${post.title} - Blog | Mr T. `,
      description: post.description,
      siteName: "Mr T. ",
      images: [
        {
          url:
            post.coverImage === "Cover Image URL"
              ? "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIIU0MlBPxpbxQUqOZN6A0LHBjPY4Vlwumcioz"
              : post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Blog | Mr T. `,
      description: post.description,
      images: [
        post.coverImage === "Cover Image URL"
          ? "https://cuttypiedev.vercel.app/avatar.webp"
          : post.coverImage,
      ],
      creator: "@DorianTho5",
    },
  };
}

async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const { date, tags, title, postOfTheDay, description, content } = post;

  return (
    <>
      <header className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <time dateTime={date} className="text-sm text-white/60 shrink-0">
            {formatDate(date)}
          </time>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-white/10 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold">
          {title}
          <Activity mode={postOfTheDay ? "visible" : "hidden"}>
            <span className="ml-2 text-sm text-yellow-500">(potd)</span>
          </Activity>
        </h1>
        <p className="text-base text-white/70">{description}</p>
      </header>

      <div
        className="prose dark:prose-invert max-w-none
        prose-headings:font-semibold
        prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
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
        <CodeBlock html={content} />
      </div>

      <div className="mt-16 border-t border-white/10 pt-8">
        <Suspense
          fallback={<div className="animate-pulse">Loading comments...</div>}
        >
          <CommentsSection postSlug={slug} />
        </Suspense>
      </div>
    </>
  );
}

export default function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-24">
      <Link
        href="/blog"
        className="inline-flex items-center text-white/60 hover:text-white mb-8 transition"
      >
        <ChevronLeft className="mr-2 size-5" />
        Back to blog
      </Link>

      <Suspense
        fallback={
          <article className="max-w-4xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 mb-8">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-24" />
            </div>

            <header className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-5 w-full max-w-2xl" />
            </header>

            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>

            <div className="mt-16 border-t border-white/10 pt-8">
              <Skeleton className="h-7 w-32 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-11/12" />
              </div>
            </div>
          </article>
        }
      >
        <BlogPostContent params={params} />
      </Suspense>
    </article>
  );
}
