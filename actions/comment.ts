"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { commentSchema } from "@/lib/validations/comment";
import prisma from "@/lib/prisma";

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

/**
 * Creates a new comment
 */
export async function createComment(data: CommentInput): Promise<CommentResponse> {
  try {
    // Validate input
    const validatedData = commentSchema.parse(data);

    // Check authentication
    const session = await getSession();
    if (!session) {
      return { error: "You must be signed in to comment" };
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postSlug: validatedData.postSlug,
        parentId: validatedData.parentId,
        authorId: session.id,
        isPinned: false, // Default to not pinned
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate the blog post page
    revalidatePath(`/blog/${data.postSlug}`);
    return { comment: { ...comment, isPinned: comment.isPinned } };

  } catch (error) {
    console.error("Create comment error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to create comment" };
  }
}

/**
 * Deletes a comment
 */
export async function deleteComment(commentId: string, postSlug: string): Promise<CommentResponse> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return { error: "You must be signed in to delete comments" };
    }

    // Get comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.authorId !== session.id) {
      return { error: "You can only delete your own comments" };
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Revalidate the blog post page
    revalidatePath(`/blog/${postSlug}`);
    return {};

  } catch (error) {
    console.error("Delete comment error:", error);
    return { error: "Failed to delete comment" };
  }
}

/**
 * Edits an existing comment
 */
export async function editComment(
  commentId: string,
  content: string,
  postSlug: string
): Promise<CommentResponse> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return { error: "You must be signed in to edit comments" };
    }

    // Get comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.authorId !== session.id) {
      return { error: "You can only edit your own comments" };
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate the blog post page
    revalidatePath(`/blog/${postSlug}`);
    return { comment: { ...updatedComment, isPinned: updatedComment.isPinned } };

  } catch (error) {
    console.error("Edit comment error:", error);
    return { error: "Failed to edit comment" };
  }
}

// Helper function to build comment tree
const buildCommentTree = (comments: CommentWithAuthor[], parentId: string | null = null): CommentWithAuthor[] => {
  return comments
    .filter(comment => comment.parentId === parentId)
    .map(comment => ({
      ...comment,
      replies: buildCommentTree(comments, comment.id)
    }))
    .sort((a, b) => {
      // First sort by pinned status (pinned comments first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

/**
 * Gets all comments for a post with nested replies
 */
export async function getComments(postSlug: string): Promise<CommentResponse> {
  try {
    const allComments = await prisma.comment.findMany({
      where: { postSlug },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Ensure all comments have the isPinned property
    const commentsWithPinned = allComments.map(comment => ({
      ...comment,
      isPinned: comment.isPinned
    }));

    const threadedComments = buildCommentTree(commentsWithPinned);
    return { comments: threadedComments };
  } catch (error) {
    console.error("Get comments error:", error);
    return { error: "Failed to get comments" };
  }
}

/**
 * Pins or unpins a comment
 */
export async function togglePinComment(
  commentId: string,
  postSlug: string,
  isPinned: boolean
): Promise<CommentResponse> {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return { error: "You must be signed in to pin comments" };
    }

    // Only allow pinning top-level comments (no replies)
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { parentId: true },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.parentId) {
      return { error: "Only top-level comments can be pinned" };
    }

    // Update comment pin status
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { isPinned },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate the blog post page
    revalidatePath(`/blog/${postSlug}`);
    return { comment: updatedComment };

  } catch (error) {
    console.error("Toggle pin comment error:", error);
    return { error: "Failed to update comment pin status" };
  }
}
