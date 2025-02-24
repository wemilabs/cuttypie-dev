"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentForm } from "./comment-form";
import { useSession } from "@/components/providers/session-provider";
import { useComments } from "@/components/providers/comments-provider";
import { deleteComment, editComment } from "@/actions/comment";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  level?: number;
}

export function SingleComment({ comment, level = 0 }: SingleCommentProps) {
  const { session } = useSession();
  const { removeComment, updateComment } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;

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

      const result = await editComment(
        comment.id,
        editContent.trim(),
        comment.postSlug
      );

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
    <div className={`group relative ${level > 0 ? "pl-12" : ""}`}>
      {level > 0 && (
        <div className="absolute left-0 top-8 bottom-0 border-l-2 border-slate-200 dark:border-slate-800" />
      )}

      <div className="relative space-y-3">
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          {/* Collapse Toggle */}
          {hasReplies && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-1.5 flex size-4 items-center justify-center rounded-sm hover:bg-accent"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="size-3" />
              ) : (
                <ChevronDownIcon className="size-3" />
              )}
            </button>
          )}

          <div className="flex-1 space-y-3">
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-200/90 flex items-center justify-center text-xs font-bold text-black">
                  {(comment.author.name || "A")[0].toUpperCase()}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-yellow-500">
                    {comment.author.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-300/70">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Actions Menu */}
              {session?.id === comment.authorId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0"
                      disabled={isDeleting || isEditing}
                    >
                      {isDeleting ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <MoreHorizontalIcon className="size-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Comment Content */}
            {isEditing ? (
              <div className="space-y-2">
                {error && <div className="text-sm text-red-500">{error}</div>}
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px] bg-muted/50"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={isSubmitting || !editContent.trim()}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
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
              <div className="prose-sm max-w-none text-sm text-foreground/90">
                {comment.content}
              </div>
            )}

            {/* Comment Actions */}
            {session && !isEditing && (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  {showReplyForm ? "Cancel" : "Reply"}
                </Button>
                {hasReplies && (
                  <span className="text-xs text-muted-foreground">
                    {replyCount} {replyCount === 1 ? "reply" : "replies"}
                  </span>
                )}
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && (
              <div className="pt-2">
                <CommentForm
                  postSlug={comment.postSlug}
                  parentId={comment.id}
                  onSuccess={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {!isCollapsed && hasReplies && (
          <div className="space-y-3">
            {comment.replies?.map((reply) => (
              <SingleComment key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
