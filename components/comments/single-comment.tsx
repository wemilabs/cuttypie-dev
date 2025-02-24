"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentForm } from "./comment-form";
import { useSession } from "@/components/providers/session-provider";
import { useComments } from "@/components/providers/comments-provider";
import { deleteComment, editComment } from "@/actions/comment";
import { formatDistanceToNow } from "date-fns";

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

interface SingleCommentProps {
  comment: CommentWithAuthor;
}

export function SingleComment({ comment }: SingleCommentProps) {
  const { session } = useSession();
  const { removeComment, updateComment } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!session || isDeleting) return;

    try {
      setIsDeleting(true);

      const result = await deleteComment(comment.id, comment.postSlug);
      if (result.error) {
        console.error("Failed to delete comment:", result.error);
      } else {
        removeComment(comment.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!session || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await editComment(comment.id, editContent.trim(), comment.postSlug);
      
      if (result.error) {
        setError(result.error);
      } else if (result.comment) {
        updateComment(comment.id, result.comment);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Failed to edit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {comment.author.name || "Anonymous"}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isSubmitting || !editContent.trim()}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                    setError(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
        </div>

        {session?.id === comment.authorId && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isDeleting || isEditing}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting || isEditing}
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Reply button - Now available for any comment */}
      {session && !isEditing && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? "Cancel Reply" : "Reply"}
          </Button>
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <div className="pl-4 border-l-2">
          <CommentForm
            postSlug={comment.postSlug}
            parentId={comment.id}
            onSuccess={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 space-y-4 border-l-2">
          {comment.replies.map((reply) => (
            <SingleComment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
