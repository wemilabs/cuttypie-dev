import prompts from "prompts";
import { createNewPost } from "../lib/utils";

interface PostData {
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  postOfTheDay?: boolean;
}

async function main() {
  try {
    // Get command line arguments
    const [, , ...args] = process.argv;
    let title = args[1];
    let description = args[2];
    let coverImage = args[3];
    let tags = args.slice(4);
    let postOfTheDay = false;

    // If any required arguments are missing, prompt for them
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

    if (!coverImage) {
      const response = await prompts({
        type: "text",
        name: "coverImage",
        message: "Enter the cover image URL:",
        initial: "Cover Image URL",
        validate: (value: string) =>
          value.length > 0 ? true : "Cover image URL is required",
      });

      if (!response.coverImage) {
        throw new Error("ABORTED");
      }
      coverImage = response.coverImage;
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

    if (!postOfTheDay) {
      const response = await prompts({
        type: "confirm",
        name: "postOfTheDay",
        message: "Is this a Post of the Day?",
        initial: false,
      });

      postOfTheDay = response.postOfTheDay;
    }

    // Create the post
    const postData: PostData = {
      title,
      description,
      coverImage,
      tags: tags.map((tag: string) => tag.trim()),
      postOfTheDay,
    };

    const boilerplateContent = `<p align="center"><img src="${
      coverImage === "Cover Image URL" ? "" : coverImage
    }" alt="Alt text" class="rounded-md" /></p>

  <div class="flex justify-center mb-20">
    <span class="text-sm text-center text-white/70"><em>Alt text</em></span>
  </div>

  Start writing your post here...`;

    const slug = await createNewPost(postData, boilerplateContent);
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
