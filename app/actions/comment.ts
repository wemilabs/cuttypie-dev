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
    return { comment };

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
 * Gets all comments for a post
 */
export async function getComments(postSlug: string): Promise<CommentResponse> {
  try {
    // Get all comments for the post
    const comments = await prisma.comment.findMany({
      where: {
        postSlug,
        parentId: null, // Get top-level comments only
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { comments };
  } catch (error) {
    console.error("Get comments error:", error);
    return { error: "Failed to load comments" };
  }
}
