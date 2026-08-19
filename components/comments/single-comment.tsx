"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  PinIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { useComments } from "@/components/providers/comments-provider";
import { Textarea } from "@/components/textarea";
import {
  deleteComment,
  editComment,
  togglePinComment,
} from "@/lib/actions/comment";
import { useSession } from "@/lib/auth-client";
import { CommentForm } from "./comment-form";

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

interface SingleCommentProps {
  comment: CommentWithAuthor;
  level?: number;
}

export function SingleComment({ comment, level = 0 }: SingleCommentProps) {
  const { data: session } = useSession();
  const { removeComment, updateComment, togglePinStatus } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;
  const isTopLevel = level === 0;

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
        comment.postSlug,
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

  const handleTogglePin = async () => {
    if (!session || isPinning) return;

    try {
      setIsPinning(true);
      setError(null);

      const result = await togglePinComment(
        comment.id,
        comment.postSlug,
        !comment.isPinned,
      );

      if (result.error) {
        setError(result.error);
      } else if (result.comment) {
        togglePinStatus(comment.id, !comment.isPinned);
      }
    } catch (error) {
      console.error("Error toggling pin status:", error);
      setError("Failed to update pin status");
    } finally {
      setIsPinning(false);
    }
  };

  return (
    <div
      className={`group relative ${level > 0 ? "pl-12" : ""} ${
        comment.isPinned && level === 0
          ? "rounded border border-primary/30 bg-primary/5 p-3 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--primary)_10%,transparent)]"
          : ""
      }`}
    >
      {level > 0 && (
        <div className="absolute top-8 bottom-0 left-0 border-primary/20 border-l" />
      )}

      <div className="relative space-y-3">
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          {/* Collapse Toggle */}
          {hasReplies && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-1.5 flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
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
                <div className="flex size-7 items-center justify-center rounded border border-primary/30 bg-primary/10 font-mono font-bold text-primary text-xs">
                  {(comment.author.name || "A")[0].toUpperCase()}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-medium text-primary text-xs uppercase tracking-wide">
                    {comment.author.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {comment.isPinned && (
                    <span className="flex items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-primary text-[10px] uppercase tracking-wider">
                      <PinIcon className="size-3" />
                      Pinned
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Menu */}
              {session?.user.id === comment.authorId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-primary"
                      disabled={isDeleting || isEditing || isPinning}
                    >
                      {isDeleting || isPinning ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                      ) : (
                        <MoreHorizontalIcon className="size-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      Edit
                    </DropdownMenuItem>
                    {isTopLevel && (
                      <DropdownMenuItem onClick={handleTogglePin}>
                        {comment.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      variant="destructive"
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
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-25 border-primary/20 bg-background/50 font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="font-mono text-xs uppercase tracking-wider"
                    onClick={handleEdit}
                    disabled={isSubmitting || !editContent.trim()}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-mono text-xs uppercase tracking-wider"
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
                  className="h-auto px-0 font-mono text-muted-foreground text-xs uppercase tracking-wider hover:bg-transparent hover:text-primary"
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
