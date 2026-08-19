"use client";

import { useAuth } from "@/components/auth";
import { Button } from "@/components/button";
import { GlowContainer } from "@/components/glow-container";
import { CommentsProvider } from "@/components/providers/comments-provider";
import { signOut, useSession } from "@/lib/auth-client";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

interface CommentsSectionProps {
  postSlug: string;
}

function CommentsContent({ postSlug }: CommentsSectionProps) {
  const { openAuth } = useAuth();
  const { data: session, isPending } = useSession();

  return (
    <section className="mx-auto max-w-2xl py-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="size-1.5 rounded-full bg-primary glow-sm" />
        <h2 className="font-mono text-xl uppercase tracking-wider">Comments</h2>
        <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent" />
      </div>

      <div className="space-y-8">
        {/* Comment Form */}
        <GlowContainer
          className="border-primary/20 bg-card/60 p-5"
          hover={false}
        >
          {isPending ? (
            <div className="text-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            </div>
          ) : session ? (
            <div className="space-y-3">
              <CommentForm postSlug={postSlug} />
              <p className="text-xs text-muted-foreground text-right">
                Signed in as {session.user.name}
                {" · "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-wider">
                Sign in to leave a comment
              </p>
              <Button
                variant="outline"
                className="w-full font-mono text-xs uppercase tracking-widest sm:w-auto"
                onClick={() => openAuth("signin")}
              >
                Sign In
              </Button>
            </div>
          )}
        </GlowContainer>

        {/* Comments List */}
        <div className="space-y-6">
          <CommentList postSlug={postSlug} />
        </div>
      </div>
    </section>
  );
}

export function CommentsSection(props: CommentsSectionProps) {
  return (
    <CommentsProvider>
      <CommentsContent {...props} />
    </CommentsProvider>
  );
}
