"use client";

import React from "react";
import { LayoutType, getLayoutColumns } from "./LayoutPicker";

export interface SectionBlock {
  id: string;
  type: "section";
  layoutType: LayoutType;
  columns: {
    id: string;
    blocks: ContentBlock[];
  }[];
}

export interface ContentBlock {
  id: string;
  type: "text" | "image" | "code" | "file-tree" | "quote" | "divider";
  content: string;
  imageUrl?: string;
  caption?: string;
  language?: string;
}

export type BlogBlockType = SectionBlock | ContentBlock;

// Helper to create an empty section with the given layout
export function createSection(layoutType: LayoutType): SectionBlock {
  const columns = getLayoutColumns(layoutType);
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "section",
    layoutType,
    columns: columns.map((_, index) => ({
      id: `col-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: [],
    })),
  };
}

// Helper to create a content block
export function createContentBlock(
  type: ContentBlock["type"],
  content: string = "",
): ContentBlock {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    ...(type === "image" && { imageUrl: "", caption: "" }),
    ...(type === "code" && { language: "typescript" }),
  };
}

interface SectionBlockEditorProps {
  section: SectionBlock;
  onUpdate: (section: SectionBlock) => void;
  onDelete: () => void;
  renderBlock: (
    block: ContentBlock,
    onUpdate: (block: ContentBlock) => void,
    onDelete: () => void,
  ) => React.ReactNode;
}

export default function SectionBlockEditor({
  section,
  onUpdate,
  onDelete,
  renderBlock,
}: SectionBlockEditorProps) {
  const columns = getLayoutColumns(section.layoutType);

  const handleBlockUpdate = (
    colIndex: number,
    blockIndex: number,
    updatedBlock: ContentBlock,
  ) => {
    const newSection = { ...section };
    newSection.columns = section.columns.map((col, ci) => {
      if (ci === colIndex) {
        return {
          ...col,
          blocks: col.blocks.map((block, bi) =>
            bi === blockIndex ? updatedBlock : block,
          ),
        };
      }
      return col;
    });
    onUpdate(newSection);
  };

  const handleBlockDelete = (colIndex: number, blockIndex: number) => {
    const newSection = { ...section };
    newSection.columns = section.columns.map((col, ci) => {
      if (ci === colIndex) {
        return {
          ...col,
          blocks: col.blocks.filter((_, bi) => bi !== blockIndex),
        };
      }
      return col;
    });
    onUpdate(newSection);
  };

  const handleAddBlock = (colIndex: number, type: ContentBlock["type"]) => {
    const newSection = { ...section };
    newSection.columns = section.columns.map((col, ci) => {
      if (ci === colIndex) {
        return {
          ...col,
          blocks: [...col.blocks, createContentBlock(type)],
        };
      }
      return col;
    });
    onUpdate(newSection);
  };

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50 relative group">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <i className="ph ph-grid-four text-blue-400" />
          <span className="uppercase tracking-wider">
            {section.layoutType === "full"
              ? "Full Width"
              : section.layoutType === "two-equal"
                ? "2 Columns (50/50)"
                : section.layoutType === "two-left"
                  ? "2 Columns (70/30)"
                  : section.layoutType === "two-right"
                    ? "2 Columns (30/70)"
                    : "3 Columns"}
          </span>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 hover:text-red-400 text-slate-400 transition-colors"
          title="Delete section"
        >
          <i className="ph ph-trash" />
        </button>
      </div>

      {/* Grid Columns */}
      <div
        className="grid gap-3 p-4"
        style={{
          gridTemplateColumns: columns.map((w) => `${w}fr`).join(" "),
        }}
      >
        {section.columns.map((column, colIndex) => (
          <div
            key={column.id}
            className="min-h-[120px] rounded-lg border border-dashed border-slate-700/50 bg-slate-900/30 p-3"
          >
            {column.blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-slate-500">
                <i className="ph ph-plus-circle text-2xl mb-2" />
                <span className="text-xs mb-3">Add content</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleAddBlock(colIndex, "text")}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    title="Add text"
                  >
                    <i className="ph ph-text-aa text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock(colIndex, "image")}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    title="Add image"
                  >
                    <i className="ph ph-image text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock(colIndex, "code")}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    title="Add code"
                  >
                    <i className="ph ph-code text-sm" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {column.blocks.map((block, blockIndex) => (
                  <div key={block.id}>
                    {renderBlock(
                      block,
                      (updated) =>
                        handleBlockUpdate(colIndex, blockIndex, updated),
                      () => handleBlockDelete(colIndex, blockIndex),
                    )}
                  </div>
                ))}
                {/* Add more blocks button */}
                <div className="flex justify-center pt-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleAddBlock(colIndex, "text")}
                      className="p-1 rounded bg-slate-800/50 hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
                      title="Add text"
                    >
                      <i className="ph ph-plus text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
