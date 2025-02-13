import prompts from "prompts";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { unpublishPost } from "../lib/utils";

const postsDirectory = path.join(process.cwd(), "content/blog");

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
        message: "Select a post to convert to draft:",
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
      message: `Convert "${targetSlug}" to draft? It will be moved to the drafts folder.`,
      initial: false,
    });

    if (!confirmation.value) {
      throw new Error("ABORTED");
    }

    // Unpublish the post
    const draftSlug = await unpublishPost(targetSlug);
    console.log("✅ Converted post to draft:", draftSlug);
    console.log("💡 Edit your draft in content/_drafts/", `${draftSlug}.draft.md`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to convert post to draft:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
