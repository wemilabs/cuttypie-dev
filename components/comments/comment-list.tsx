"use client";

import { MessageSquareDashedIcon } from "lucide-react";
import { useEffect } from "react";
import { EmptyState } from "@/components/empty-state";
import { useComments } from "@/components/providers/comments-provider";
import { SingleComment } from "./single-comment";

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
      <div className="py-8 text-center text-muted-foreground">
        <div className="mx-auto size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="sr-only">Loading comments</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded border border-destructive/30 bg-destructive/10 px-4 py-6 text-center font-mono text-destructive text-xs"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        className="py-10"
        description="No transmissions recorded for this post."
        icon={<MessageSquareDashedIcon className="size-8" />}
        title="Conversation channel idle"
      />
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
