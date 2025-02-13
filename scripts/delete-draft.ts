import prompts from "prompts";
import { listDrafts } from "../lib/utils";
import fs from "fs/promises";
import path from "path";

const draftsDirectory = path.join(process.cwd(), "content/_drafts");

async function main() {
  try {
    // Get command line arguments
    const [, , slug] = process.argv;

    let targetSlug = slug;

    // If no slug provided, list available drafts and prompt for selection
    if (!targetSlug) {
      const drafts = await listDrafts();

      if (drafts.length === 0) {
        console.log("📝 No drafts found");
        process.exit(0);
      }

      const response = await prompts({
        type: "select",
        name: "slug",
        message: "Select a draft to delete:",
        choices: drafts.map((draft) => ({
          title: `${draft.title} (last edited ${draft.lastEdited.toLocaleString()})`,
          value: draft.slug,
          description: draft.description,
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
      message: `Delete draft "${targetSlug}"? This cannot be undone.`,
      initial: false,
    });

    if (!confirmation.value) {
      throw new Error("ABORTED");
    }

    // Delete the draft file
    await fs.unlink(path.join(draftsDirectory, `${targetSlug}.draft.md`));
    console.log("✅ Deleted draft:", targetSlug);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to delete draft:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
