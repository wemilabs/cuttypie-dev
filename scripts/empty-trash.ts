import prompts from "prompts";
import { listTrash, emptyTrash } from "../lib/utils";

async function main() {
  try {
    // List trash contents first
    const trashItems = await listTrash();

    if (trashItems.length === 0) {
      console.log("📂 Trash is already empty");
      process.exit(0);
    }

    // Show trash contents
    console.log("\n📂 Trash contents:");
    trashItems.forEach((item) => {
      console.log(`- ${item.title} (deleted ${item.deletedAt.toLocaleString()})`);
    });
    console.log(); // Empty line for readability

    // Get confirmation
    const confirmation = await prompts({
      type: "confirm",
      name: "value",
      message: `Permanently delete ${trashItems.length} post${trashItems.length === 1 ? "" : "s"}? This action cannot be undone.`,
      initial: false,
    });

    if (!confirmation.value) {
      throw new Error("ABORTED");
    }

    // Double confirmation for safety
    const doubleConfirmation = await prompts({
      type: "text",
      name: "value",
      message: `Type "DELETE" to confirm permanent deletion:`,
      validate: (value) => value === "DELETE" || "Please type DELETE to confirm",
    });

    if (!doubleConfirmation.value || doubleConfirmation.value !== "DELETE") {
      throw new Error("ABORTED");
    }

    // Empty the trash
    const deletedCount = await emptyTrash();
    console.log(`✅ Permanently deleted ${deletedCount} post${deletedCount === 1 ? "" : "s"}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to empty trash:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
