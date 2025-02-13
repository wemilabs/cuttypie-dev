import prompts from "prompts";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { spawn } from "child_process";
import { generateSlug } from "../lib/utils";

const postsDirectory = path.join(process.cwd(), "content/blog");

/**
 * Opens a temporary file in the user's preferred editor
 * @param content Initial content
 * @returns Updated content or null if unchanged
 */
async function editInEditor(content: string): Promise<string | null> {
  const tmpFile = path.join(
    process.cwd(),
    "content/temp",
    `edit-${Date.now()}.md`
  );

  try {
    // Create temp directory if it doesn't exist
    await fs.mkdir(path.dirname(tmpFile), { recursive: true });

    // Write content to temp file
    await fs.writeFile(tmpFile, content, "utf8");

    // Get editor command from environment or use default
    const editor =
      process.env.EDITOR ||
      process.env.VISUAL ||
      (process.platform === "win32" ? "notepad" : "nano");

    // Open editor and wait for it to close
    await new Promise<void>((resolve, reject) => {
      const child = spawn(editor, [tmpFile], {
        stdio: "inherit",
        shell: true,
      });

      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Editor exited with code ${code}`));
        }
      });

      child.on("error", reject);
    });

    // Read updated content
    const updatedContent = await fs.readFile(tmpFile, "utf8");

    // Check if content was changed
    if (updatedContent !== content) {
      return updatedContent;
    }

    return null;
  } finally {
    // Clean up temp file
    if (existsSync(tmpFile)) {
      await fs.unlink(tmpFile);
    }
  }
}

async function main() {
  try {
    // Get command line arguments
    const [, , slug] = process.argv;

    let targetSlug = slug;

    // If no slug provided, list available posts and prompt for selection
    if (!targetSlug) {
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
        message: "Select a post to update:",
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

    // Read existing post
    const postPath = path.join(postsDirectory, `${targetSlug}.md`);
    const fileContent = await fs.readFile(postPath, "utf8");
    const { data: existingData, content: existingContent } =
      matter(fileContent);

    // Get updated metadata
    const updates = await prompts([
      {
        type: "text",
        name: "title",
        message: "Enter new title (leave empty to keep current):",
        initial: existingData.title,
      },
      {
        type: "text",
        name: "description",
        message: "Enter new description (leave empty to keep current):",
        initial: existingData.description,
      },
      {
        type: "list",
        name: "tags",
        message:
          "Enter new tags (comma-separated, leave empty to keep current):",
        initial: existingData.tags.join(","),
        separator: ",",
      },
      {
        type: "confirm",
        name: "editContent",
        message: "Would you like to edit the content?",
        initial: false,
      },
    ]);

    if (
      !updates.title &&
      !updates.description &&
      !updates.tags &&
      !updates.editContent
    ) {
      console.log("❌ No changes made");
      process.exit(0);
    }

    // Only include fields that were actually changed
    const metadata: Record<string, any> = {
      ...existingData,
      lastEdited: new Date().toISOString(),
    };

    // Check if title changed and generate new slug
    let newSlug: string | undefined;
    if (updates.title && updates.title !== existingData.title) {
      metadata.title = updates.title;
      newSlug = generateSlug(updates.title);
      const newPath = path.join(postsDirectory, `${newSlug}.md`);

      // Check if new slug would conflict with existing file
      if (existsSync(newPath) && newPath !== postPath) {
        throw new Error(`A post with slug "${newSlug}" already exists`);
      }
    }

    if (
      updates.description &&
      updates.description !== existingData.description
    ) {
      metadata.description = updates.description;
    }
    if (
      updates.tags &&
      updates.tags.join(",") !== existingData.tags.join(",")
    ) {
      metadata.tags = updates.tags;
    }

    // Handle content update if requested
    let finalContent = existingContent;
    if (updates.editContent) {
      console.log("\n📝 Opening content in your editor...");
      const updatedContent = await editInEditor(existingContent);
      if (updatedContent !== null) {
        finalContent = updatedContent;
      }
    }

    // Create new file content
    const newContent = matter.stringify(finalContent, metadata);

    if (newSlug) {
      // Write to new location and delete old file
      const newPath = path.join(postsDirectory, `${newSlug}.md`);
      await fs.writeFile(newPath, newContent, "utf8");
      await fs.unlink(postPath);
      console.log("✅ Updated post:", targetSlug);
      console.log("📝 Slug updated to:", newSlug);
    } else {
      // Update existing file
      await fs.writeFile(postPath, newContent, "utf8");
      console.log("✅ Updated post:", targetSlug);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to update post:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
