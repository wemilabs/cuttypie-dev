import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Theme } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export interface TableOfContentsItem {
  id: string;
  level: 2 | 3;
  title: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  coverImage: string;
  description: string;
  date: string;
  tags: string[];
  postOfTheDay?: boolean;
  content: string;
  readingTime: number;
  tableOfContents: TableOfContentsItem[];
}

interface HastNode {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
}

const postsDirectory = path.join(process.cwd(), "content/blog");
const THEME: Theme = "github-dark";
const WORDS_PER_MINUTE = 200;

export const BLOG_COVER_FALLBACK =
  "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIIU0MlBPxpbxQUqOZN6A0LHBjPY4Vlwumcioz";

function safeToISOString(date: string | Date | undefined): string {
  if (!date) return new Date(0).toISOString();

  try {
    if (typeof date === "string") {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date)) {
        return date;
      }

      const parsedDate = new Date(date);
      if (!Number.isNaN(parsedDate.getTime())) return parsedDate.toISOString();
    } else if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    const err = error as Error;
    console.error("Error converting date to ISO string:", err);
  }

  return new Date(0).toISOString();
}

function normalizeCoverImage(coverImage: unknown): string {
  if (typeof coverImage !== "string") return BLOG_COVER_FALLBACK;

  const normalized = coverImage.trim();
  if (!normalized || normalized === "Cover Image URL") {
    return BLOG_COVER_FALLBACK;
  }

  return normalized;
}

function getText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return node.children?.map(getText).join("") ?? "";
}

function slugifyHeading(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function headingIdsPlugin(tableOfContents: TableOfContentsItem[]) {
  return () => (tree: HastNode) => {
    const occurrences = new Map<string, number>();

    const visit = (node: HastNode) => {
      const match = node.tagName?.match(/^h([1-6])$/);
      if (match) {
        const title = getText(node).trim();
        const baseId = slugifyHeading(title);
        const occurrence = occurrences.get(baseId) ?? 0;
        occurrences.set(baseId, occurrence + 1);
        const id = occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`;
        node.properties = { ...node.properties, id };

        const level = Number(match[1]);
        if (level === 2 || level === 3) {
          tableOfContents.push({ id, level, title });
        }
      }

      node.children?.forEach(visit);
    };

    visit(tree);
  };
}

function calculateReadingTime(markdown: string): number {
  const readableText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!?\[.*?\]\(.*?\)/g, " ")
    .replace(/[#>*_~|-]+/g, " ");
  const wordCount = readableText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export async function getAllPosts(): Promise<BlogPost[]> {
  "use cache";

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
  const allPostsData = await Promise.all(
    fileNames.map((fileName) => getPostBySlug(fileName.replace(/\.md$/, ""))),
  );

  return allPostsData.sort((a, b) => {
    const dateDifference =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDifference || a.slug.localeCompare(b.slug);
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  "use cache";

  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const tableOfContents: TableOfContentsItem[] = [];
    const prettyCodeOptions: Partial<Parameters<typeof rehypePrettyCode>[0]> = {
      theme: THEME,
      keepBackground: true,
      onVisitLine(node) {
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
      },
      onVisitHighlightedLine(node) {
        node.properties?.className?.push("highlighted");
      },
    };

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(headingIdsPlugin(tableOfContents))
      .use(rehypePrettyCode, prettyCodeOptions)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);

    return {
      slug: realSlug,
      title: String(data.title ?? realSlug),
      coverImage: normalizeCoverImage(data.coverImage),
      description: String(data.description ?? ""),
      date: safeToISOString(data.date),
      content: processedContent.toString(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      postOfTheDay: data.postOfTheDay === true,
      readingTime: calculateReadingTime(content),
      tableOfContents,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw error;
  }
}

export async function getRelatedPosts(
  post: Pick<BlogPost, "date" | "slug" | "tags">,
): Promise<BlogPost[]> {
  "use cache";

  const posts = await getAllPosts();
  const sourceTags = new Set(post.tags.map((tag) => tag.toLowerCase()));
  const sourceDate = new Date(post.date).getTime();

  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      dateDistance: Math.abs(new Date(candidate.date).getTime() - sourceDate),
      sharedTags: candidate.tags.filter((tag) =>
        sourceTags.has(tag.toLowerCase()),
      ).length,
    }))
    .sort(
      (a, b) =>
        b.sharedTags - a.sharedTags ||
        a.dateDistance - b.dateDistance ||
        a.candidate.slug.localeCompare(b.candidate.slug),
    )
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
