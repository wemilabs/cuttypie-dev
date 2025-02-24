"use client";

import { useEffect } from "react";
import { SingleComment } from "./single-comment";
import { useComments } from "@/components/providers/comments-provider";

interface CommentListProps {
  postSlug: string;
}

export function CommentList({ postSlug }: CommentListProps) {
  const { comments, isLoading, error, fetchComments } = useComments();

  useEffect(() => {
    fetchComments(postSlug);
  }, [postSlug, fetchComments]);

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <SingleComment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
