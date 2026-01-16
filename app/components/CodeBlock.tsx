"use client";

import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export default function CodeBlock({
  code,
  language,
  filename,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Simple syntax highlighting
  const highlightCode = (code: string, lang: string) => {
    // Keywords
    // Keywords to highlight (removed 'class' to handle separately)
    const keywords = [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "async",
      "await",
      "import",
      "export",
      "from",
      "default",
      "extends",
      "new",
      "this",
      "try",
      "catch",
      "throw",
      "typeof",
      "interface",
      "type",
      "enum",
    ];

    let highlighted = code
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Strings (single and double quotes)
      .replace(
        /(['"`])((?:(?!\1)[^\\]|\\.)*?)(\1)/g,
        '<span class="text-green-400">$1$2$3</span>'
      )
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
      // Functions
      .replace(
        /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
        '<span class="text-yellow-400">$1</span>('
      )
      // Type annotations (after colon)
      .replace(
        /:\s*([A-Z][a-zA-Z0-9_]*)/g,
        ': <span class="text-green-400">$1</span>'
      )
      // Arrow functions
      .replace(/=&gt;/g, '<span class="text-purple-400">=&gt;</span>')
      // Safe 'class' keyword highlighting (ignore class= for HTML attributes)
      .replace(/\bclass\b(?!=)/g, '<span class="text-purple-400">class</span>');

    // Other Keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        '<span class="text-purple-400">$1</span>'
      );
    });

    return highlighted;
  };

  // Split code into lines for line numbers
  const codeLines = code.split("\n");

  return (
    <div className="my-8 code-block-dev rounded-2xl shadow-2xl overflow-hidden group transition-all duration-300 hover:shadow-cyan-500/10">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-cyan-500/20">
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
        </div>

        {/* Filename */}
        <div className="flex items-center gap-2 text-cyan-400/70 font-mono text-xs">
          <i className="fas fa-terminal text-[10px]"></i>
          <span>{filename || `code.${language}`}</span>
        </div>

        {/* Live indicator & Copy button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              live
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md hover:bg-slate-800/50"
          >
            {isCopied ? (
              <>
                <i className="fas fa-check text-green-400"></i>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <i className="far fa-copy"></i>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="p-6 overflow-x-auto">
        <div className="font-mono text-sm md:text-base">
          {codeLines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlightedLine =
              line.includes("FixTera") ||
              (line.includes("return") && line.includes("solve"));

            return (
              <div
                key={index}
                className={`flex ${
                  isHighlightedLine
                    ? "bg-cyan-500/5 -mx-6 px-6 border-l-2 border-cyan-400"
                    : ""
                }`}
              >
                {/* Line number */}
                <span
                  className={`w-8 select-none ${
                    isHighlightedLine ? "text-cyan-400" : "text-slate-600"
                  }`}
                >
                  {lineNumber}
                </span>
                {/* Code line */}
                <span
                  className="flex-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(line, language) || "&nbsp;",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
