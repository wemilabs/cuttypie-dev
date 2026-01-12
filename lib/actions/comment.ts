"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/comment";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function createComment(
  data: CommentInput
): Promise<CommentResponse> {
  try {
    const validatedData = commentSchema.parse(data);

    const session = await getSession();
    if (!session) return { error: "You must be signed in to comment" };

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postSlug: validatedData.postSlug,
        parentId: validatedData.parentId,
        authorId: session.id,
        isPinned: false,
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

    revalidatePath(`/blog/${data.postSlug}`);
    return { comment: { ...comment, isPinned: comment.isPinned } };
  } catch (error) {
    console.error("Create comment error:", error);
    if (error instanceof z.ZodError) return { error: error.issues[0].message };

    return { error: "Failed to create comment" };
  }
}

export async function deleteComment(
  commentId: string,
  postSlug: string
): Promise<CommentResponse> {
  try {
    const session = await getSession();
    if (!session) return { error: "You must be signed in to delete comments" };

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) return { error: "Comment not found" };

    if (comment.authorId !== session.id)
      return { error: "You can only delete your own comments" };

    await prisma.comment.delete({
      where: { id: commentId },
    });

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
  postSlug: string
): Promise<CommentResponse> {
  try {
    const session = await getSession();
    if (!session) return { error: "You must be signed in to edit comments" };

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) return { error: "Comment not found" };

    if (comment.authorId !== session.id)
      return { error: "You can only edit your own comments" };

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

    revalidatePath(`/blog/${postSlug}`);
    return {
      comment: { ...updatedComment, isPinned: updatedComment.isPinned },
    };
  } catch (error) {
    console.error("Edit comment error:", error);
    return { error: "Failed to edit comment" };
  }
}

const buildCommentTree = (
  comments: CommentWithAuthor[],
  parentId: string | null = null
): CommentWithAuthor[] => {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .map((comment) => ({
      ...comment,
      replies: buildCommentTree(comments, comment.id),
    }))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

export async function getComments(postSlug: string): Promise<CommentResponse> {
  try {
    const allComments = (await prisma.comment.findMany({
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
    })) as unknown as Array<CommentWithAuthor & { updatedAt: Date }>;

    const commentsWithPinned = allComments.map((comment) => ({
      ...comment,
      isPinned: comment.isPinned || false,
    }));

    const threadedComments = buildCommentTree(commentsWithPinned);
    return { comments: threadedComments };
  } catch (error) {
    console.error("Get comments error:", error);
    return { error: "Failed to get comments" };
  }
}

export async function togglePinComment(
  commentId: string,
  postSlug: string,
  isPinned: boolean
): Promise<CommentResponse> {
  try {
    const session = await getSession();
    if (!session) return { error: "You must be signed in to pin comments" };

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { parentId: true },
    });

    if (!comment) return { error: "Comment not found" };

    if (comment.parentId)
      return { error: "Only top-level comments can be pinned" };

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

    revalidatePath(`/blog/${postSlug}`);
    return { comment: updatedComment };
  } catch (error) {
    console.error("Toggle pin comment error:", error);
    return { error: "Failed to update comment pin status" };
  }
}
