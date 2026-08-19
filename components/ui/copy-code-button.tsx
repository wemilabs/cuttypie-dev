"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={copyToClipboard}
      className="size-7 border border-primary/20 bg-primary/5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-primary" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </Button>
  );
}
