"use client";

import { useEffect, useRef } from "react";

import { CopyCodeButton } from "@/components/ui/copy-code-button";

interface CodeBlockProps {
  html: string;
}

export function CodeBlock({ html }: CodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find all pre elements and add language bar with copy button
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

      let language = "Plain text";

      if (pre.getAttribute("data-language")) {
        language = pre.getAttribute("data-language") || "Plain text";
      } else if (code.getAttribute("data-language")) {
        language = code.getAttribute("data-language") || "Plain text";
      } else {
        // Fallback to class-based detection used by other processors
        const preClassMatch = pre.className.match(/language-(\w+)/);
        const codeClassMatch = code.className.match(/language-(\w+)/);

        if (codeClassMatch && codeClassMatch[1]) {
          language = codeClassMatch[1];
        } else if (preClassMatch && preClassMatch[1]) {
          language = preClassMatch[1];
        }
      }

      // Remove any existing language bar
      const existingBar = pre.querySelector(".code-language-bar");
      if (existingBar) {
        existingBar.remove();
      }

      // Create language bar
      const languageBar = document.createElement("div");
      languageBar.className = "code-language-bar";
      languageBar.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: rgba(0, 0, 0, .4);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
      `;

      // Add language text
      const languageText = document.createElement("span");
      languageText.textContent = language;
      languageBar.appendChild(languageText);

      // Create copy button container
      const copyButtonContainer = document.createElement("div");
      copyButtonContainer.className = "copy-button-wrapper";
      languageBar.appendChild(copyButtonContainer);

      // Insert the language bar at the top of the pre element
      pre.insertBefore(languageBar, pre.firstChild);

      // Add padding to the top of the pre element to make room for the language bar
      const currentPadding = getComputedStyle(pre).paddingTop;
      const currentPaddingValue = parseFloat(currentPadding);
      pre.style.paddingTop = `${currentPaddingValue + 40}px`;

      // Get the code content and create the copy button
      const codeContent = code.textContent || "";
      const copyButton = <CopyCodeButton code={codeContent} />;

      // @ts-ignore - React 18 types
      const reactRoot =
        require("react-dom/client").createRoot(copyButtonContainer);
      reactRoot.render(copyButton);
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
