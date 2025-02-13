import prompts from "prompts";
import { createNewPost } from "../lib/utils";

interface PostData {
  title: string;
  description: string;
  tags: string[];
}

async function main() {
  try {
    // Get command line arguments
    const [, , ...args] = process.argv;
    let slug = args[0];
    let title = args[1];
    let description = args[2];
    let tags = args.slice(3);

    // If any required arguments are missing, prompt for them
    if (!slug) {
      const response = await prompts({
        type: "text",
        name: "slug",
        message: "Enter the post slug (e.g., my-first-post):",
        validate: (value: string) =>
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
            ? true
            : "Slug must be lowercase with hyphens",
      });
      
      if (!response.slug) {
        throw new Error("ABORTED");
      }
      slug = response.slug;
    }

    if (!title) {
      const response = await prompts({
        type: "text",
        name: "title",
        message: "Enter the post title:",
        validate: (value: string) => 
          value.length > 0 ? true : "Title is required",
      });
      
      if (!response.title) {
        throw new Error("ABORTED");
      }
      title = response.title;
    }

    if (!description) {
      const response = await prompts({
        type: "text",
        name: "description",
        message: "Enter the post description:",
        validate: (value: string) =>
          value.length > 0 ? true : "Description is required",
      });
      
      if (!response.description) {
        throw new Error("ABORTED");
      }
      description = response.description;
    }

    if (tags.length === 0) {
      const response = await prompts({
        type: "list",
        name: "tags",
        message: "Enter tags (comma-separated):",
        initial: "uncategorized",
        separator: ",",
        validate: (value: string) =>
          value.length > 0 ? true : "At least one tag is required",
      });
      
      if (!response.tags) {
        throw new Error("ABORTED");
      }
      tags = response.tags;
    }

    // Create the post
    const postData: PostData = {
      title,
      description,
      tags: tags.map((tag: string) => tag.trim()),
    };

    await createNewPost(slug, postData, "Start writing your post here...\n");
    console.log("✅ Created new post:", slug);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Post creation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to create post:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
