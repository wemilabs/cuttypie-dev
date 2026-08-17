import { listDrafts } from "../lib/posts";

async function main() {
  try {
    const drafts = await listDrafts();

    if (drafts.length === 0) {
      console.log("📝 No drafts found");
      process.exit(0);
    }

    console.log("\n📝 Draft posts:");
    drafts.forEach((draft) => {
      console.log(`\n${draft.title}`);
      console.log(`  Slug: ${draft.slug}`);
      console.log(`  Description: ${draft.description}`);
      console.log(`  Last edited: ${draft.lastEdited.toLocaleString()}`);
    });
    console.log(); // Empty line for readability
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Failed to list drafts:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
