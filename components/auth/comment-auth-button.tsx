"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuth } from "./auth-context";

interface CommentAuthButtonProps extends ButtonProps {
  isAuthenticated: boolean;
  onAuthenticated: () => void;
}

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
      openAuth("signin");
    }
  };

  return <Button onClick={handleClick} {...props} />;
}
