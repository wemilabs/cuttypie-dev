"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { comment } from "@/lib/db/schema";
import { commentSchema } from "@/lib/validations/comment";

interface CommentInput {
  content: string;
  postSlug: string;
  parentId?: string;
}

interface CommentAuthor {
  name: string | null;
  email: string;
}

interface CommentWithAuthor {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  postSlug: string;
  parentId: string | null;
  isPinned: boolean;
  author: CommentAuthor;
  replies?: CommentWithAuthor[];
}

interface CommentResponse {
  comment?: CommentWithAuthor;
  comments?: CommentWithAuthor[];
  error?: string;
}

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function createComment(
  data: CommentInput,
): Promise<CommentResponse> {
  try {
    const validatedData = commentSchema.parse(data);

    const user = await getSessionUser();
    if (!user) return { error: "You must be signed in to comment" };

    const [created] = await db
      .insert(comment)
      .values({
        content: validatedData.content,
        postSlug: validatedData.postSlug,
        parentId: validatedData.parentId,
        authorId: user.id,
        isPinned: false,
      })
      .returning();

    revalidatePath(`/blog/${data.postSlug}`);
    return {
      comment: {
        ...created,
        author: { name: user.name, email: user.email },
      },
    };
  } catch (error) {
    console.error("Create comment error:", error);
    if (error instanceof z.ZodError) return { error: error.issues[0].message };

    return { error: "Failed to create comment" };
  }
}

export async function deleteComment(
  commentId: string,
  postSlug: string,
): Promise<CommentResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "You must be signed in to delete comments" };

    const existing = await db.query.comment.findFirst({
      where: eq(comment.id, commentId),
      columns: { authorId: true },
    });

    if (!existing) return { error: "Comment not found" };

    if (existing.authorId !== user.id)
      return { error: "You can only delete your own comments" };

    await db.delete(comment).where(eq(comment.id, commentId));

    revalidatePath(`/blog/${postSlug}`);
    return {};
  } catch (error) {
    console.error("Delete comment error:", error);
    return { error: "Failed to delete comment" };
  }
}

export async function editComment(
  commentId: string,
  content: string,
  postSlug: string,
): Promise<CommentResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "You must be signed in to edit comments" };

    const existing = await db.query.comment.findFirst({
      where: eq(comment.id, commentId),
      columns: { authorId: true },
    });

    if (!existing) return { error: "Comment not found" };

    if (existing.authorId !== user.id)
      return { error: "You can only edit your own comments" };

    const [updated] = await db
      .update(comment)
      .set({ content })
      .where(eq(comment.id, commentId))
      .returning();

    revalidatePath(`/blog/${postSlug}`);
    return {
      comment: {
        ...updated,
        author: { name: user.name, email: user.email },
      },
    };
  } catch (error) {
    console.error("Edit comment error:", error);
    return { error: "Failed to edit comment" };
  }
}

const buildCommentTree = (
  comments: CommentWithAuthor[],
  parentId: string | null = null,
): CommentWithAuthor[] => {
  return comments
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      ...c,
      replies: buildCommentTree(comments, c.id),
    }))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

export async function getComments(postSlug: string): Promise<CommentResponse> {
  try {
    const allComments = await db.query.comment.findMany({
      where: eq(comment.postSlug, postSlug),
      with: {
        author: {
          columns: { name: true, email: true },
        },
      },
      orderBy: desc(comment.createdAt),
    });

    const threadedComments = buildCommentTree(allComments);
    return { comments: threadedComments };
  } catch (error) {
    console.error("Get comments error:", error);
    return { error: "Failed to get comments" };
  }
}

export async function togglePinComment(
  commentId: string,
  postSlug: string,
  isPinned: boolean,
): Promise<CommentResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "You must be signed in to pin comments" };

    const existing = await db.query.comment.findFirst({
      where: eq(comment.id, commentId),
      columns: { parentId: true, authorId: true },
    });

    if (!existing) return { error: "Comment not found" };

    if (existing.parentId)
      return { error: "Only top-level comments can be pinned" };

    if (existing.authorId !== user.id)
      return { error: "You can only pin your own comments" };

    const [updated] = await db
      .update(comment)
      .set({ isPinned })
      .where(eq(comment.id, commentId))
      .returning();

    const author = await db.query.user.findFirst({
      where: (u, { eq: whereEq }) => whereEq(u.id, updated.authorId),
      columns: { name: true, email: true },
    });

    revalidatePath(`/blog/${postSlug}`);
    return {
      comment: {
        ...updated,
        author: author ?? { name: null, email: "" },
      },
    };
  } catch (error) {
    console.error("Toggle pin comment error:", error);
    return { error: "Failed to update comment pin status" };
  }
}
