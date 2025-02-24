"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/app/actions/comment";
import { useSession } from "@/components/providers/session-provider";
import { useComments } from "@/components/providers/comments-provider";

interface CommentFormProps {
  postSlug: string;
  parentId?: string;
  onSuccess?: () => void;
}

export function CommentForm({ postSlug, parentId, onSuccess }: CommentFormProps) {
  const { session } = useSession();
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
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
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
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
