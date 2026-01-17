import React from "react";
import CodeBlock from "./CodeBlock";

// Types matching the admin editor
interface ContentBlock {
  id: string;
  type: "text" | "image" | "code" | "file-tree" | "quote" | "divider";
  content: string;
  imageUrl?: string;
  caption?: string;
  language?: string;
}

type LayoutType =
  | "full"
  | "two-equal"
  | "two-left"
  | "two-right"
  | "three-equal";

interface SectionBlock {
  id: string;
  type: "section";
  layoutType: LayoutType;
  columns: {
    id: string;
    blocks: ContentBlock[];
  }[];
}

// Get grid template columns based on layout type
function getGridColumns(layoutType: LayoutType): string {
  switch (layoutType) {
    case "full":
      return "1fr";
    case "two-equal":
      return "1fr 1fr";
    case "two-left":
      return "7fr 3fr";
    case "two-right":
      return "3fr 7fr";
    case "three-equal":
      return "1fr 1fr 1fr";
    default:
      return "1fr";
  }
}

// Render a single content block
function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className="prose prose-invert prose-lg max-w-none">
          {block.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="text-xl font-semibold text-white mt-6 mb-3"
                >
                  {line.replace("### ", "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="text-slate-300 ml-4 mb-2">
                  {line.replace("- ", "")}
                </li>
              );
            }
            if (line.trim() === "") {
              return null;
            }
            return (
              <p key={i} className="text-slate-300 leading-relaxed mb-4">
                {line}
              </p>
            );
          })}
        </div>
      );

    case "image":
      if (!block.imageUrl) return null;
      return (
        <figure className="my-6">
          <img
            src={block.imageUrl}
            alt={block.caption || "Image"}
            className="w-full rounded-xl border border-slate-800 shadow-lg"
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-slate-500 mt-3 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "code":
      return (
        <div className="my-6">
          <CodeBlock
            code={block.content}
            language={block.language || "text"}
            filename={block.language}
          />
        </div>
      );

    case "quote":
      return (
        <blockquote className="my-6 border-l-4 border-blue-500 pl-6 py-2 bg-slate-900/30 rounded-r-lg">
          <p className="text-slate-300 italic text-lg">{block.content}</p>
        </blockquote>
      );

    case "divider":
      return <hr className="my-8 border-slate-700" />;

    case "file-tree":
      return (
        <div className="my-6 bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-sm">
          <pre className="text-slate-300 whitespace-pre-wrap">
            {block.content}
          </pre>
        </div>
      );

    default:
      return null;
  }
}

// Section Renderer - renders a single section with its grid layout
function SectionRenderer({ section }: { section: SectionBlock }) {
  const isSingleColumn =
    section.layoutType === "full" || section.columns.length === 1;

  return (
    <div
      className="grid gap-6 md:gap-8"
      style={{
        gridTemplateColumns: getGridColumns(section.layoutType),
      }}
    >
      {section.columns.map((column) => (
        <div key={column.id} className="space-y-4">
          {column.blocks.map((block) => (
            <ContentBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Main Blog Sections Renderer (Server Component)
export default function BlogSectionsRenderer({
  sections,
}: {
  sections: SectionBlock[];
}) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}

// Export types for use in other components
export type { SectionBlock, ContentBlock, LayoutType };
