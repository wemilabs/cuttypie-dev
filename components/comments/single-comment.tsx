"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";
import { useSession } from "@/components/providers/session-provider";
import { useComments } from "@/components/providers/comments-provider";
import { deleteComment } from "@/app/actions/comment";
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
  const { removeComment } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!session || isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      const result = await deleteComment(comment.id, comment.postSlug);
      if (result.error) {
        console.error("Failed to delete comment:", result.error);
      } else {
        // Only remove from UI after successful server operation
        removeComment(comment.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author.name || "Anonymous"}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        
        {session?.id === comment.authorId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              "Delete"
            )}
          </Button>
        )}
      </div>

      {/* Reply button */}
      {session && !comment.parentId && (
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
