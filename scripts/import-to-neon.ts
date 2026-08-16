import fs from "node:fs/promises";
import path from "node:path";
import { db } from "../lib/db";
import { comment, user } from "../lib/db/schema";

interface ExportedUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
}

interface ExportedComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  postSlug: string;
  isPinned: boolean;
  authorId: string;
  parentId: string | null;
}

async function main() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "old-db-export.json"),
    "utf8",
  );
  const data = JSON.parse(raw) as {
    users: ExportedUser[];
    comments: ExportedComment[];
  };

  await db
    .insert(user)
    .values(
      data.users.map((u) => ({
        id: u.id,
        name: u.name ?? "Anonymous",
        email: u.email,
        emailVerified: u.emailVerified !== null,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      })),
    )
    .onConflictDoNothing();

  // Insert parents before replies to satisfy the self-referencing FK
  const sorted = [...data.comments].sort((a, b) =>
    a.parentId === null && b.parentId !== null
      ? -1
      : a.parentId !== null && b.parentId === null
        ? 1
        : 0,
  );

  for (const c of sorted) {
    await db
      .insert(comment)
      .values({
        id: c.id,
        content: c.content,
        postSlug: c.postSlug,
        isPinned: c.isPinned,
        authorId: c.authorId,
        parentId: c.parentId,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      })
      .onConflictDoNothing();
  }

  const userCount = await db.$count(user);
  const commentCount = await db.$count(comment);
  console.log(
    `Imported. Neon now has ${userCount} users, ${commentCount} comments`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
