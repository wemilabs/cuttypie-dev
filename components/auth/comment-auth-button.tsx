"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/button";
import { useAuth } from "./auth-context";

type CommentAuthButtonProps = ComponentProps<typeof Button> & {
  isAuthenticated: boolean;
  onAuthenticated: () => void;
};

export function CommentAuthButton({
  isAuthenticated,
  onAuthenticated,
  ...props
}: CommentAuthButtonProps) {
  const { openAuth } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      onAuthenticated();
    } else {
      openAuth();
    }
  };

  return <Button onClick={handleClick} {...props} />;
}
