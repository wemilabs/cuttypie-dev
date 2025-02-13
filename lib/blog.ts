import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import type { BuiltinLanguage, BuiltinTheme } from "shikiji";

// Types for blog post metadata
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
}

// Directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), "content/blog");

// Common languages we want to support
const SUPPORTED_LANGUAGES: BuiltinLanguage[] = [
  "typescript",
  "javascript",
  "json",
  "bash",
  "markdown",
  "mermaid",
  "css",
  "html",
  "tsx",
  "jsx",
  "python",
  "go",
  "rust",
  "yaml",
  "toml",
  "sql",
  "console",
];

// Theme configuration
const THEME: BuiltinTheme = "github-dark";

/**
 * Safely converts a date value to ISO string
 * @param date The date value to convert
 * @returns ISO string date or current date if invalid
 */
function safeToISOString(date: string | Date | undefined): string {
  if (!date) {
    return new Date().toISOString();
  }

  try {
    if (typeof date === "string") {
      // If it's already an ISO string, return it
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(date)) {
        return date;
      }
      // Try to parse the string to a date
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    } else if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch {
    // If any error occurs, return current date
  }

  return new Date().toISOString();
}

/**
 * Get all blog posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
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

/**
 * Get a specific blog post by its slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Ensure date is a valid ISO string
    const date = safeToISOString(data.date);

    // Configure rehype-pretty-code options
    const prettyCodeOptions: Partial<Parameters<typeof rehypePrettyCode>[0]> = {
      theme: THEME,
      keepBackground: true,
      onVisitLine(node) {
        // Prevent lines from collapsing in `display: grid` mode, and
        // allow empty lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
      },
      onVisitHighlightedLine(node) {
        // Each line node by default has `class="line"`. Here we're adding
        // the `highlighted` class to the lines that have been marked with
        // `//!` in the markdown.
        node.properties?.className?.push("highlighted");
      },
    };

    // Use unified with remark and rehype to convert markdown into HTML string
    const processedContent = await unified()
      .use(remarkParse) // Parse markdown to mdast
      .use(remarkGfm) // Support GFM features
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to hast
      .use(rehypePrettyCode, prettyCodeOptions)
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert to html
      .process(content);

    const contentHtml = processedContent.toString();

    // Combine the data with the slug and format date
    return {
      slug: realSlug,
      title: data.title,
      description: data.description,
      date,
      content: contentHtml,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw error;
  }
}

/**
 * Get all unique tags from blog posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
