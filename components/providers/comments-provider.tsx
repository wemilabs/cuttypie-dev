"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { getComments } from "@/app/actions/comment";

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

interface CommentsContextType {
  comments: CommentWithAuthor[];
  isLoading: boolean;
  error: string | null;
  fetchComments: (postSlug: string) => Promise<void>;
  addComment: (comment: CommentWithAuthor) => void;
  removeComment: (commentId: string) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (postSlug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getComments(postSlug);
      if (result.error) {
        setError(result.error);
      } else if (result.comments) {
        setComments(result.comments);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addComment = useCallback((newComment: CommentWithAuthor) => {
    setComments(prevComments => {
      if (newComment.parentId) {
        // Add reply to existing comment
        return prevComments.map(comment => {
          if (comment.id === newComment.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        });
      }
      // Add new top-level comment
      return [newComment, ...prevComments];
    });
  }, []);

  const removeComment = useCallback((commentId: string) => {
    setComments(prevComments => 
      prevComments.filter(comment => {
        // Remove comment or its replies
        if (comment.id === commentId) return false;
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply.id !== commentId);
        }
        return true;
      })
    );
  }, []);

  return (
    <CommentsContext.Provider 
      value={{ 
        comments, 
        isLoading, 
        error, 
        fetchComments, 
        addComment, 
        removeComment 
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within CommentsProvider");
  }
  return context;
}
