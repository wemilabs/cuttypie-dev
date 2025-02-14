import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");
const draftsDirectory = path.join(process.cwd(), "content/_drafts");
const trashDirectory = path.join(process.cwd(), "content/.trash");

interface PostMetadata {
  title: string;
  description: string;
  tags: string[];
  status?: "draft" | "published";
  lastEdited?: string;
  publishDate?: string | null;
  date?: string;
}

/**
 * Ensures the trash directory exists
 */
async function ensureTrashDirectory(): Promise<void> {
  if (!existsSync(trashDirectory)) {
    mkdirSync(trashDirectory, { recursive: true });
  }
}

/**
 * Ensures the drafts directory exists
 */
async function ensureDraftsDirectory(): Promise<void> {
  if (!existsSync(draftsDirectory)) {
    mkdirSync(draftsDirectory, { recursive: true });
  }
}

/**
 * Generates a timestamped filename for the trash
 * @param originalSlug The original post slug
 * @returns Timestamped filename
 */
function generateTrashFilename(originalSlug: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${timestamp}_${originalSlug}.md`;
}

/**
 * Creates a new blog post with automatic timestamp
 * @param metadata Post metadata (title, description, tags)
 * @param boilerplateContent Initial content of the post
 * @returns The generated slug for the post
 */
export async function createNewPost(
  metadata: PostMetadata,
  boilerplateContent: string = ""
): Promise<string> {
  // Generate slug from title
  const slug = generateSafeSlug(metadata.title);

  const filePath = path.join(postsDirectory, `${slug}.md`);

  // Check if file already exists
  if (existsSync(filePath)) {
    throw new Error(`A post with slug "${slug}" already exists`);
  }

  // Create frontmatter with automatic timestamp
  const frontmatter = {
    ...metadata,
    date: new Date().toISOString(), // Automatically set creation date
  };

  // Combine frontmatter and content
  const fileContent = matter.stringify(boilerplateContent, frontmatter);

  // Create the posts directory if it doesn't exist
  if (!existsSync(postsDirectory)) {
    mkdirSync(postsDirectory, { recursive: true });
  }

  // Write the file asynchronously
  await fs.writeFile(filePath, fileContent, "utf8");

  return slug;
}

/**
 * Updates an existing blog post while preserving its creation date
 * @param slug The URL-friendly name of the post
 * @param metadata Post metadata (title, description, tags)
 * @param updatedContent Updated content of the post
 * @returns Promise that resolves when the post is updated
 */
export async function updatePost(
  slug: string,
  metadata: PostMetadata,
  updatedContent: string = ""
): Promise<void> {
  const filePath = path.join(postsDirectory, `${slug}.md`);

  // Check if file exists
  if (!existsSync(filePath)) {
    throw new Error(`Post "${slug}" not found`);
  }

  // Read existing file to get the original creation date
  const existingContent = await fs.readFile(filePath, "utf8");
  const { data: existingFrontmatter } = matter(existingContent);

  // Create new frontmatter while preserving the original date
  const frontmatter = {
    ...metadata,
    date: existingFrontmatter.date, // Preserve original creation date
  };

  // Combine frontmatter and new content
  const fileContent = matter.stringify(updatedContent, frontmatter);

  // Write the updated file
  await fs.writeFile(filePath, fileContent, "utf8");
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

/**
 * Moves a blog post to the trash
 * @param slug The URL-friendly name of the post to trash
 * @returns Promise that resolves when the post is moved to trash
 */
export async function movePostToTrash(slug: string): Promise<void> {
  const sourceFile = path.join(postsDirectory, `${slug}.md`);

  // Check if file exists
  if (!existsSync(sourceFile)) {
    throw new Error(`Post "${slug}" not found`);
  }

  // Ensure trash directory exists
  await ensureTrashDirectory();

  // Generate unique filename for trash
  const trashFilename = generateTrashFilename(slug);
  const trashFile = path.join(trashDirectory, trashFilename);

  // Move file to trash
  await fs.rename(sourceFile, trashFile);
}

/**
 * Restores a post from the trash
 * @param filename The filename in the trash (including timestamp)
 * @returns Promise that resolves with the restored post's slug
 */
export async function restoreFromTrash(filename: string): Promise<string> {
  const trashFile = path.join(trashDirectory, filename);

  // Check if file exists in trash
  if (!existsSync(trashFile)) {
    throw new Error(`File "${filename}" not found in trash`);
  }

  // Extract original slug from filename
  const originalSlug = filename
    .replace(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z_/, "")
    .replace(/\.md$/, "");
  const targetFile = path.join(postsDirectory, `${originalSlug}.md`);

  // Check if a post with the same slug already exists
  if (existsSync(targetFile)) {
    throw new Error(`A post with slug "${originalSlug}" already exists`);
  }

  // Move file back to posts directory
  await fs.rename(trashFile, targetFile);

  return originalSlug;
}

/**
 * Lists all posts in the trash
 * @returns Promise that resolves with array of trash items
 */
export async function listTrash(): Promise<
  Array<{
    filename: string;
    originalSlug: string;
    title: string;
    deletedAt: Date;
  }>
> {
  // Ensure trash directory exists
  await ensureTrashDirectory();

  // Read trash directory
  const files = await fs.readdir(trashDirectory);

  // Get details for each file
  const trashItems = await Promise.all(
    files.map(async (filename) => {
      const content = await fs.readFile(
        path.join(trashDirectory, filename),
        "utf8"
      );
      const { data } = matter(content);
      const timestamp = filename.match(
        /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)_/
      )?.[1];
      const originalSlug = filename
        .replace(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z_/, "")
        .replace(/\.md$/, "");

      return {
        filename,
        originalSlug,
        title: data.title,
        deletedAt: timestamp
          ? new Date(timestamp.replace(/-/g, ":"))
          : new Date(0),
      };
    })
  );

  // Sort by deletion date (newest first)
  return trashItems.sort(
    (a, b) => b.deletedAt.getTime() - a.deletedAt.getTime()
  );
}

/**
 * Permanently deletes all posts in the trash
 * @returns Promise that resolves with the number of files deleted
 */
export async function emptyTrash(): Promise<number> {
  // Ensure trash directory exists
  await ensureTrashDirectory();

  // Read trash directory
  const files = await fs.readdir(trashDirectory);

  // Delete all files
  await Promise.all(
    files.map((file) => fs.unlink(path.join(trashDirectory, file)))
  );

  return files.length;
}

/**
 * Creates a new draft post
 * @param title The title of the draft
 * @param metadata Additional metadata (description, tags)
 * @param content Initial content
 * @returns The generated slug for the draft
 */
export async function createDraft(
  title: string,
  metadata: Partial<PostMetadata> = {},
  content: string = ""
): Promise<string> {
  // Generate slug from title
  const slug = generateSafeSlug(title);

  // Ensure drafts directory exists
  await ensureDraftsDirectory();

  const filePath = path.join(draftsDirectory, `${slug}.draft.md`);

  // Check if draft already exists
  if (existsSync(filePath)) {
    throw new Error(`A draft with slug "${slug}" already exists`);
  }

  // Create frontmatter
  const frontmatter: PostMetadata = {
    title,
    description: metadata.description || "",
    tags: metadata.tags || ["draft"],
    status: "draft",
    lastEdited: new Date().toISOString(),
    publishDate: null,
  };

  // Combine frontmatter and content
  const fileContent = matter.stringify(content, frontmatter);

  // Write the draft file
  await fs.writeFile(filePath, fileContent, "utf8");

  return slug;
}

/**
 * Lists all draft posts
 * @returns Array of draft posts with metadata
 */
export async function listDrafts(): Promise<
  Array<{
    slug: string;
    title: string;
    description: string;
    lastEdited: Date;
  }>
> {
  // Ensure drafts directory exists
  await ensureDraftsDirectory();

  // Read drafts directory
  const files = await fs.readdir(draftsDirectory);

  // Get details for each draft
  const drafts = await Promise.all(
    files
      .filter((file) => file.endsWith(".draft.md"))
      .map(async (file) => {
        const content = await fs.readFile(
          path.join(draftsDirectory, file),
          "utf8"
        );
        const { data } = matter(content);
        return {
          slug: file.replace(/\.draft\.md$/, ""),
          title: data.title,
          description: data.description,
          lastEdited: new Date(data.lastEdited),
        };
      })
  );

  // Sort by last edited date (newest first)
  return drafts.sort((a, b) => b.lastEdited.getTime() - a.lastEdited.getTime());
}

/**
 * Generates a URL-friendly slug from a title
 * @param title The title to convert to slug
 * @returns URL-friendly slug
 */
export function generateSafeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Updates an existing draft
 * @param slug The draft's slug
 * @param metadata Updated metadata
 * @param content Updated content
 * @returns New slug if title was updated and slug changed, otherwise undefined
 */
export async function updateDraft(
  slug: string,
  metadata?: Partial<PostMetadata>,
  content?: string
): Promise<string | undefined> {
  const filePath = path.join(draftsDirectory, `${slug}.draft.md`);

  // Check if draft exists
  if (!existsSync(filePath)) {
    throw new Error(`Draft "${slug}" not found`);
  }

  // Read existing draft
  const fileContent = await fs.readFile(filePath, "utf8");
  const { data: existingData, content: existingBodyContent } =
    matter(fileContent);

  // Merge metadata
  const newMetadata: PostMetadata = {
    title: existingData.title,
    description: existingData.description,
    tags: existingData.tags,
    ...metadata,
    lastEdited: new Date().toISOString(),
    status: "draft",
  };

  // Generate new slug if title changed
  let newSlug: string | undefined;
  if (metadata?.title && metadata.title !== existingData.title) {
    newSlug = generateSafeSlug(metadata.title);
    const newPath = path.join(draftsDirectory, `${newSlug}.draft.md`);

    // Check if new slug would conflict with existing file
    if (existsSync(newPath) && newPath !== filePath) {
      throw new Error(`A draft with slug "${newSlug}" already exists`);
    }
  }

  // Create new file content
  const newFileContent = matter.stringify(
    content ?? existingBodyContent,
    newMetadata
  );

  if (newSlug) {
    // Write to new location and delete old file
    const newPath = path.join(draftsDirectory, `${newSlug}.draft.md`);
    await fs.writeFile(newPath, newFileContent, "utf8");
    await fs.unlink(filePath);
    return newSlug;
  } else {
    // Update existing file
    await fs.writeFile(filePath, newFileContent, "utf8");
  }
}

/**
 * Publishes a draft to the blog
 * @param slug The draft's slug
 * @returns The published post's slug
 */
export async function publishDraft(slug: string): Promise<string> {
  const draftPath = path.join(draftsDirectory, `${slug}.draft.md`);
  const publishPath = path.join(postsDirectory, `${slug}.md`);

  // Check if draft exists
  if (!existsSync(draftPath)) {
    throw new Error(`Draft "${slug}" not found`);
  }

  // Check if published post already exists
  if (existsSync(publishPath)) {
    throw new Error(`A published post with slug "${slug}" already exists`);
  }

  // Read draft content
  const draftContent = await fs.readFile(draftPath, "utf8");
  const { data: metadata, content } = matter(draftContent);

  const now = new Date().toISOString();

  // Update metadata for publishing
  const publishMetadata: PostMetadata = {
    title: metadata.title,
    description: metadata.description,
    tags: metadata.tags,
    status: "published",
    publishDate: now,
    lastEdited: now,
    date: now, // Add date field for blog compatibility
  };

  // Create published content
  const publishContent = matter.stringify(content, publishMetadata);

  // Write published file
  await fs.writeFile(publishPath, publishContent, "utf8");

  // Delete draft
  await fs.unlink(draftPath);

  return slug;
}

/**
 * Converts a published post back to a draft
 * @param slug The published post's slug
 * @returns The draft's slug
 */
export async function unpublishPost(slug: string): Promise<string> {
  const publishPath = path.join(postsDirectory, `${slug}.md`);
  const draftPath = path.join(draftsDirectory, `${slug}.draft.md`);

  // Check if published post exists
  if (!existsSync(publishPath)) {
    throw new Error(`Published post "${slug}" not found`);
  }

  // Ensure drafts directory exists
  await ensureDraftsDirectory();

  // Check if draft already exists
  if (existsSync(draftPath)) {
    throw new Error(`A draft with slug "${slug}" already exists`);
  }

  // Read published content
  const publishContent = await fs.readFile(publishPath, "utf8");
  const { data: metadata, content } = matter(publishContent);

  // Update metadata for draft
  const draftMetadata: PostMetadata = {
    title: metadata.title,
    description: metadata.description,
    tags: metadata.tags,
    status: "draft",
    lastEdited: new Date().toISOString(),
    publishDate: null,
  };

  // Create draft content
  const draftContent = matter.stringify(content, draftMetadata);

  // Write draft file
  await fs.writeFile(draftPath, draftContent, "utf8");

  // Delete published post
  await fs.unlink(publishPath);

  return slug;
}
