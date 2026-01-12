import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import type { Theme } from "rehype-pretty-code";
import { connection } from "next/server";

export interface BlogPost {
  slug: string;
  title: string;
  coverImage: string;
  description: string;
  date: string;
  tags: string[];
  postOfTheDay?: boolean;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/blog");

const THEME: Theme = "github-dark";

function safeToISOString(date: string | Date | undefined): string {
  if (!date) {
    connection();
    return new Date().toISOString();
  }

  try {
    if (typeof date === "string") {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(date))
        return date;

      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) return parsedDate.toISOString();
    } else if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    const err = error as Error;
    console.error("Error converting date to ISO string:", err);
  }

  connection();
  return new Date().toISOString();
}

export async function getAllPosts(): Promise<BlogPost[]> {
  await connection();

  // Get all .md files from the posts directory
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map((fileName) => getPostBySlug(fileName.replace(/\.md$/, "")))
  );

  // Sort posts by date and time in descending order (newest first)
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const date = safeToISOString(data.date);

    const prettyCodeOptions: Partial<Parameters<typeof rehypePrettyCode>[0]> = {
      theme: THEME,
      keepBackground: true,
      onVisitLine(node) {
        if (node.children.length === 0)
          node.children = [{ type: "text", value: " " }];
      },
      onVisitHighlightedLine(node) {
        // Each line node by default has `class="line"`. Here we're adding
        // the `highlighted` class to the lines that have been marked with
        // `//!` in the markdown.
        node.properties?.className?.push("highlighted");
      },
    };

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypePrettyCode, prettyCodeOptions)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);

    const contentHtml = processedContent.toString();

    return {
      slug: realSlug,
      title: data.title,
      coverImage: data.coverImage,
      description: data.description,
      date,
      content: contentHtml,
      tags: data.tags || [],
      postOfTheDay: data.postOfTheDay || false,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw error;
  }
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
