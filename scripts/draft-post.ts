import prompts from "prompts";
import { createDraft } from "../lib/utils";

async function main() {
  try {
    // Get command line arguments
    const [, , title] = process.argv;

    let postTitle = title;

    // If no title provided, prompt for it
    if (!postTitle) {
      const response = await prompts({
        type: "text",
        name: "title",
        message: "Enter the draft title:",
        validate: (value) => (value.length > 0 ? true : "Title is required"),
      });

      if (!response.title) {
        throw new Error("ABORTED");
      }

      postTitle = response.title;
    }

    // Get additional details
    const details = await prompts([
      {
        type: "text",
        name: "description",
        message: "Enter a description:",
      },
      {
        type: "list",
        name: "tags",
        message: "Enter tags (comma-separated):",
        initial: "draft",
        separator: ",",
      },
      {
        type: "confirm",
        name: "postOfTheDay",
        message: "Is this a Post of the Day?",
        initial: false,
      },
    ]);

    // Create the draft
    const slug = await createDraft(postTitle, {
      description: details.description || "",
      tags: details.tags || ["draft"],
      postOfTheDay: details.postOfTheDay,
    });

    console.log("✅ Created new draft:", slug);
    console.log("💡 Edit your draft in content/_drafts/", `${slug}.draft.md`);
    console.log("💡 Use 'pnpm publish-draft", slug, "' when ready to publish");
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Draft creation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to create draft:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
