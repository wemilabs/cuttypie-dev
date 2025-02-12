import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

interface PostMetadata {
  title: string;
  description: string;
  tags: string[];
}

/**
 * Creates a new blog post with automatic timestamp
 * @param slug The URL-friendly name of the post
 * @param metadata Post metadata (title, description, tags)
 * @param content Initial content of the post
 */
export function createNewPost(
  slug: string,
  metadata: PostMetadata,
  content: string = ""
): void {
  // Ensure slug is URL-friendly
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const filePath = path.join(postsDirectory, `${safeSlug}.md`);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    throw new Error(`A post with slug "${safeSlug}" already exists`);
  }

  // Create frontmatter with automatic timestamp
  const frontmatter = {
    ...metadata,
    date: new Date().toISOString(), // Automatically set creation date
  };

  // Combine frontmatter and content
  const fileContent = matter.stringify(content, frontmatter);

  // Create the posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, fileContent, "utf8");
}

/**
 * Updates a blog post's content while preserving its original creation date
 * @param slug The URL-friendly name of the post
 * @param content New content for the post
 * @param metadata Optional metadata updates (won't update the date)
 */
export function updatePost(
  slug: string,
  content: string,
  metadata?: Partial<PostMetadata>
): void {
  const filePath = path.join(postsDirectory, `${slug}.md`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post "${slug}" not found`);
  }

  // Read existing file
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: existingFrontmatter, content: existingContent } =
    matter(fileContent);

  // Merge metadata, keeping the original date
  const newFrontmatter = {
    ...existingFrontmatter,
    ...metadata,
    date: existingFrontmatter.date, // Preserve original date
  };

  // Create new file content
  const newFileContent = matter.stringify(
    content || existingContent,
    newFrontmatter
  );

  // Write back to file
  fs.writeFileSync(filePath, newFileContent, "utf8");
}

/**
 * Formats a date string into a human-readable format
 * @param date The date string to format
 * @returns A string representing the date in the format "Month Day, Year"
 */
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
