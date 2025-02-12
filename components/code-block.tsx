"use client";

import { useEffect, useRef } from "react";

import { CopyCodeButton } from "./copy-code-button";

interface CodeBlockProps {
  html: string;
}

export function CodeBlock({ html }: CodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find all pre elements and add copy button
    const container = containerRef.current;
    if (!container) return;

    const codeBlocks = container.querySelectorAll("pre");
    codeBlocks.forEach((pre) => {
      // Get the actual code content
      const code = pre.querySelector("code");
      if (!code) return;

      // Add relative positioning to pre if not already set
      if (pre.style.position !== "relative") {
        pre.style.position = "relative";
      }

      // Create copy button if it doesn't exist
      if (!pre.querySelector(".copy-button-wrapper")) {
        const root = document.createElement("div");
        root.className = "copy-button-wrapper";
        root.style.position = "absolute";
        root.style.top = "1rem";
        root.style.right = "1rem";

        // Create React root and render copy button
        const button = document.createElement("div");
        root.appendChild(button);
        pre.appendChild(root);

        // Get the code content and create the copy button
        const codeContent = code.textContent || "";
        const copyButton = <CopyCodeButton code={codeContent} />;

        // @ts-ignore - React 18 types
        const reactRoot = require("react-dom/client").createRoot(button);
        reactRoot.render(copyButton);
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
