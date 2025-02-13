import prompts from "prompts";
import { listDrafts, updateDraft } from "../lib/utils";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

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
        message: "Select a draft to update:",
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

    // Read existing draft
    const draftPath = path.join(draftsDirectory, `${targetSlug}.draft.md`);
    const fileContent = await fs.readFile(draftPath, "utf8");
    const { data: existingData } = matter(fileContent);

    // Get updated details
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
        message: "Enter new tags (comma-separated, leave empty to keep current):",
        initial: existingData.tags.join(","),
        separator: ",",
      },
    ]);

    // Only include fields that were actually changed
    const metadata: Record<string, any> = {};
    if (updates.title && updates.title !== existingData.title) {
      metadata.title = updates.title;
    }
    if (updates.description && updates.description !== existingData.description) {
      metadata.description = updates.description;
    }
    if (updates.tags && updates.tags.join(",") !== existingData.tags.join(",")) {
      metadata.tags = updates.tags;
    }

    if (Object.keys(metadata).length === 0) {
      console.log("❌ No changes made");
      process.exit(0);
    }

    // Update the draft
    const newSlug = await updateDraft(targetSlug, metadata);
    console.log("✅ Updated draft:", targetSlug);
    if (newSlug) {
      console.log("📝 Slug updated to:", newSlug);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ABORTED") {
        console.log("❌ Operation cancelled");
        process.exit(0);
      }
      console.error("❌ Failed to update draft:", error.message);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
