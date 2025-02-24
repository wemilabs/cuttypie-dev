"use client";

import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { useAuth } from "@/components/auth";
import { useSession } from "@/components/providers/session-provider";
import { CommentsProvider } from "@/components/providers/comments-provider";

interface CommentsSectionProps {
  postSlug: string;
}

function CommentsContent({ postSlug }: CommentsSectionProps) {
  const { openAuth } = useAuth();
  const { session, isLoading } = useSession();

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8">Comments</h2>

      <div className="space-y-8">
        {/* Comment Form */}
        <div className="border rounded-lg p-4 bg-card">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            </div>
          ) : session ? (
            <CommentForm postSlug={postSlug} />
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Sign in to leave a comment
              </p>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => openAuth("signin")}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          <CommentList postSlug={postSlug} />
        </div>
      </div>
    </div>
  );
}

export function CommentsSection(props: CommentsSectionProps) {
  return (
    <CommentsProvider>
      <CommentsContent {...props} />
    </CommentsProvider>
  );
}
