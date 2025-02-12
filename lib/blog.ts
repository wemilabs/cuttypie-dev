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

  // Handle the date - it's already an ISO string in the frontmatter
  const date =
    typeof data.date === "string"
      ? data.date
      : new Date(data.date).toISOString();

  // Combine the data with the slug
  return {
    slug,
    content: contentHtml,
    title: data.title,
    description: data.description,
    date,
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
