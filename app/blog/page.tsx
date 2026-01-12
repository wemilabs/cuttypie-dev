import type { Metadata } from "next";

import { PostGrid } from "@/components/posts/post-grid";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Blog - Mr T. ",
  description: "Read my latest blog posts about tech trends and projects.",
  metadataBase: new URL("https://cuttypiedev.vercel.app/blog/"),
  keywords: [
    "blog",
    "tech",
    "trends",
    "projects",
    "typescript",
    "javascript",
    "react",
    "next.js",
    "fullstack",
    "developer",
  ],
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-36">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-52 bg-white/5 rounded-lg p-6 hover:bg-white/10 transition" />
            <Skeleton className="h-52 bg-white/5 rounded-lg p-6 hover:bg-white/10 transition" />
          </div>
        }
      >
        <PostGrid />
      </Suspense>
    </div>
  );
}
