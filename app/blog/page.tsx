import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Matheo (cuttypie)",
  description: "Read my latest blog posts about web development, programming, and more.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-12">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative bg-white/5 rounded-lg p-6 hover:bg-white/10 transition"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-4">
                <time
                  dateTime={post.date}
                  className="text-sm text-white/60"
                >
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
              <h2 className="text-2xl font-bold group-hover:text-yellow-200 transition">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-white/70">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-yellow-200 hover:text-yellow-300 transition mt-4"
              >
                Read more
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
