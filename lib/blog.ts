import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { getHighlighter } from "shikiji";
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
];

// Theme configuration
const THEME: BuiltinTheme = "github-dark";

// Singleton highlighter instance and initialization promise
let highlighterInstance: Awaited<ReturnType<typeof getHighlighter>> | undefined;
let highlighterPromise:
  | Promise<Awaited<ReturnType<typeof getHighlighter>>>
  | undefined;

/**
 * Get the singleton highlighter instance
 */
const getHighlighterInstance = async () => {
  if (highlighterInstance) return highlighterInstance;

  // If we're already initializing, return the existing promise
  if (highlighterPromise) return highlighterPromise;

  // Create new initialization promise
  highlighterPromise = getHighlighter({
    themes: [THEME],
    langs: SUPPORTED_LANGUAGES,
  });

  try {
    // Wait for initialization and store the instance
    highlighterInstance = await highlighterPromise;
    return highlighterInstance;
  } finally {
    // Clear the promise after initialization (success or failure)
    highlighterPromise = undefined;
  }
};

/**
 * Get all blog posts metadata
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // Get all .md files from the posts directory
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map((fileName) => getPostBySlug(fileName.replace(/\.md$/, "")))
  );

  // Sort posts by date in descending order (newest first)
  // For posts on the same day, use the file's last modified time as a tiebreaker
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (dateA.toDateString() === dateB.toDateString()) {
      // If same day, use file's last modified time
      const statsA = fs.statSync(path.join(postsDirectory, `${a.slug}.md`));
      const statsB = fs.statSync(path.join(postsDirectory, `${b.slug}.md`));
      return statsB.mtimeMs - statsA.mtimeMs;
    }
    
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get a specific blog post by its slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

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

  // Combine the data with the slug
  return {
    slug,
    content: contentHtml,
    title: data.title,
    description: data.description,
    date: data.date.toISOString(),
    tags: data.tags,
  };
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
