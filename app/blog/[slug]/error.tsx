"use client";

import Link from "next/link";

export default function error() {
  return (
    <article className="max-w-4xl mx-auto px-6 py-36">
      <h1 className="text-4xl font-bold mb-6">Not Found</h1>
      <p className="text-white/70 mb-2">
        The post you're looking for does not exist or has been moved.
      </p>
      <p>
        Go back to{" "}
        <Link href="/blog" className="underline hover:underline-offset-4">
          blog
        </Link>
        .
      </p>
    </article>
  );
}
