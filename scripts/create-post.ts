import { createNewPost } from "../lib/utils";

// Get command line arguments
const [, , slug, title, description = "", ...tags] = process.argv;

if (!slug || !title) {
  console.error(
    "Usage: pnpm create-post <slug> <title> [description] [tags...]"
  );
  process.exit(1);
}

try {
  createNewPost(
    slug,
    {
      title,
      description,
      tags: tags.length > 0 ? tags : ["uncategorized"],
    },
    "Start writing your post here...\n"
  );

  console.log(`✅ Created new post: ${slug}`);
} catch (error) {
  if (error instanceof Error) {
    console.error("❌ Error:", error.message);
  } else {
    console.error("❌ An unexpected error occurred");
  }
  process.exit(1);
}
