"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { useComments } from "@/components/providers/comments-provider";
import { Textarea } from "@/components/textarea";
import { createComment } from "@/lib/actions/comment";
import { useSession } from "@/lib/auth-client";

interface CommentFormProps {
  postSlug: string;
  parentId?: string;
  onSuccess?: () => void;
}

export function CommentForm({
  postSlug,
  parentId,
  onSuccess,
}: CommentFormProps) {
  const { data: session } = useSession();
  const { addComment } = useComments();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !content.trim()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Send to server first
      const result = await createComment({
        content: content.trim(),
        postSlug,
        parentId,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      // If successful, add to UI and clear form
      if (result.comment) {
        addComment(result.comment);
        setContent("");
        onSuccess?.();
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
      setError("Failed to create comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-destructive text-xs"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={1}
          maxLength={1000}
          disabled={isSubmitting}
          className="min-h-25 border-primary/20 bg-background/50 font-mono text-sm"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="font-mono text-xs uppercase tracking-widest"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Posting...
            </div>
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
    </form>
  );
}
