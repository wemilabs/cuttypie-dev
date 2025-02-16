import Link from "next/link";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PostItemProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    postOfTheDay?: boolean;
  };
}

const PostItem = ({ post }: PostItemProps) => {
  const { slug, title, description, date, tags, postOfTheDay } = post;

  return (
    <article className="group relative bg-white/5 rounded-lg p-6 hover:bg-white/10 transition">
      {postOfTheDay && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-2 shadow-lg">
          <Star className="size-4" />
        </div>
      )}
      <div className="flex flex-col space-y-2">
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
        <h2 className="text-2xl font-bold group-hover:text-yellow-200 transition">
          <Link href={`/blog/${slug}`}>
            {title}
            {postOfTheDay && (
              <span className="ml-2 text-sm text-yellow-500">(potd)</span>
            )}
          </Link>
        </h2>
        <p className="text-white/70">{description}</p>
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center text-yellow-200 hover:text-yellow-300 transition mt-4"
        >
          Read more
          <svg
            className="ml-2 size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default PostItem;
