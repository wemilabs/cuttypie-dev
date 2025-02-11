import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} - Blog | Matheo (cuttypie)`,
    description: `Read about ${slug} on cuttypie's blog.`,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params before using them
  const { slug } = await params;

  return (
    <article className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-6">Article: {slug}</h1>
      {/* Add your blog post content here */}
    </article>
  );
}
