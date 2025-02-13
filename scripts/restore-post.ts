import prompts from "prompts";
import { listTrash, restoreFromTrash } from "../lib/utils";

async function main() {
  try {
    // Get command line arguments
    const [, , filename] = process.argv;

    let targetFile = filename;

    // If no filename provided, list available trash items and prompt for selection
    if (!targetFile) {
      const trashItems = await listTrash();

      if (trashItems.length === 0) {
        console.log("📂 Trash is empty");
        process.exit(0);
      }

      const response = await prompts({
        type: "select",
        name: "filename",
        message: "Select a post to restore:",
        choices: trashItems.map((item) => ({
          title: `${item.title} (deleted ${item.deletedAt.toLocaleString()})`,
          value: item.filename,
        })),
      });

      if (!response.filename) {
        throw new Error("ABORTED");
      }

      targetFile = response.filename;
    }

    // Get confirmation
    const confirmation = await prompts({
      type: "confirm",
      name: "value",
      message: `Restore this post? It will be moved back to the blog folder.`,
      initial: true,
    });

    if (!confirmation.value) {
      throw new Error("ABORTED");
    }

    // Restore the post
    const restoredSlug = await restoreFromTrash(targetFile);
    console.log("✅ Restored post:", restoredSlug);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to restore post:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
