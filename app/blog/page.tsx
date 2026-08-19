import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/hero-section";
import { PostGrid } from "@/components/posts/post-grid";
import { Skeleton } from "@/components/skeleton";

export const metadata: Metadata = {
  title: "Blog | Lisham.",
  description:
    "Technical transmissions on software systems, cybersecurity, networking, IoT, and artificial intelligence.",
  metadataBase: new URL("https://lisham.dev"),
  alternates: { canonical: "/blog" },
  keywords: [
    "blog",
    "tech",
    "cybersecurity",
    "networking",
    "typescript",
    "javascript",
    "react",
    "next.js",
    "fullstack",
    "developer",
  ],
};

function PostGridSkeleton() {
  return (
    <div className="space-y-14 md:space-y-20">
      <section className="space-y-5">
        <Skeleton className="h-4 w-52" />
        <div className="overflow-hidden rounded border border-border lg:grid lg:grid-cols-[1.2fr_1fr]">
          <Skeleton className="h-64 rounded-none lg:h-96" />
          <div className="space-y-5 p-6 md:p-8">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-5">
        <Skeleton className="h-4 w-44" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {["alpha", "beta", "gamma", "delta", "epsilon", "zeta"].map((key) => (
            <div
              className="overflow-hidden rounded border border-border"
              key={key}
            >
              <Skeleton className="h-48 rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8">
      <HeroSection
        align="left"
        className="mb-14 md:mb-20"
        description="Read my latest blog posts about tech trends, projects, and things I learn along the way."
        title={
          <>
            Latest <span className="text-primary">Posts</span>
          </>
        }
      />

      <Suspense fallback={<PostGridSkeleton />}>
        <PostGrid />
      </Suspense>
    </main>
  );
}
