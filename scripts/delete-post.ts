import prompts from "prompts";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { movePostToTrash } from "../lib/utils";

const postsDirectory = path.join(process.cwd(), "content/blog");

/**
 * Deletes a blog post
 * @param slug The URL-friendly name of the post to delete
 * @returns Promise that resolves when the post is deleted
 */
async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(postsDirectory, `${slug}.md`);

  // Check if file exists
  if (!existsSync(filePath)) {
    throw new Error(`Post "${slug}" not found`);
  }

  // Read the post to show confirmation details
  const content = await fs.readFile(filePath, "utf8");
  const { data: frontmatter } = matter(content);

  // Move the file to trash
  await movePostToTrash(slug);
}

async function main() {
  try {
    // Get command line arguments
    const [, , slug] = process.argv;

    let targetSlug = slug;

    // If no slug provided, list available posts and prompt for selection
    if (!targetSlug) {
      // Get list of posts
      const files = await fs.readdir(postsDirectory);
      const posts = await Promise.all(
        files
          .filter((file) => file.endsWith(".md"))
          .map(async (file) => {
            const content = await fs.readFile(
              path.join(postsDirectory, file),
              "utf8"
            );
            const { data } = matter(content);
            return {
              slug: file.replace(/\.md$/, ""),
              title: data.title,
              date: new Date(data.date).toLocaleDateString(),
            };
          })
      );

      // Sort posts by date (newest first)
      posts.sort((a, b) => b.date.localeCompare(a.date));

      const response = await prompts({
        type: "select",
        name: "slug",
        message: "Select a post to move to trash:",
        choices: posts.map((post) => ({
          title: `${post.title} (${post.date})`,
          value: post.slug,
        })),
      });

      if (!response.slug) {
        throw new Error("ABORTED");
      }

      targetSlug = response.slug;
    }

    // Get confirmation
    const confirmation = await prompts({
      type: "confirm",
      name: "value",
      message: `Move "${targetSlug}" to trash? You can restore it later.`,
      initial: false,
    });

    if (!confirmation.value) {
      throw new Error("ABORTED");
    }

    // Move post to trash
    await deletePost(targetSlug);
    console.log("✅ Moved post to trash:", targetSlug);
    console.log("💡 Tip: Use 'pnpm restore-post' to recover it");
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to move post to trash:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();