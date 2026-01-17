"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface BlockType {
  type: string;
  label: string;
  icon: string;
  description: string;
}

const blockTypes: BlockType[] = [
  {
    type: "text",
    label: "Text",
    icon: "ph-text-aa",
    description: "Rich text content with markdown support",
  },
  {
    type: "image",
    label: "Image",
    icon: "ph-image",
    description: "Upload or link an image",
  },
  {
    type: "code",
    label: "Code",
    icon: "ph-code",
    description: "Code block with syntax highlighting",
  },
  {
    type: "file-tree",
    label: "Structure",
    icon: "ph-tree-structure",
    description: "File/folder tree structure",
  },
  {
    type: "quote",
    label: "Quote",
    icon: "ph-quotes",
    description: "Blockquote or callout",
  },
  {
    type: "divider",
    label: "Divider",
    icon: "ph-minus",
    description: "Horizontal line separator",
  },
];

interface DraggablePaletteItemProps {
  block: BlockType;
}

function DraggablePaletteItem({ block }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${block.type}`,
    data: {
      type: "palette",
      blockType: block.type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing
        transition-all select-none
        ${
          isDragging
            ? "border-blue-500 bg-blue-500/20 opacity-50"
            : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
        }
      `}
    >
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
        <i className={`ph ${block.icon} text-lg`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-300">{block.label}</div>
        <div className="text-xs text-slate-500 truncate">
          {block.description}
        </div>
      </div>
      <i className="ph ph-dots-six-vertical text-slate-600" />
    </div>
  );
}

interface BlockPaletteProps {
  onAddBlock?: (type: string) => void;
}

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
      <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
        <i className="ph ph-stack text-purple-400" />
        Block Types
      </h4>
      <div className="space-y-2">
        {blockTypes.map((block) => (
          <div key={block.type} className="relative group">
            <DraggablePaletteItem block={block} />
            {/* Quick add button */}
            {onAddBlock && (
              <button
                type="button"
                onClick={() => onAddBlock(block.type)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                  bg-blue-600 text-white opacity-0 group-hover:opacity-100
                  transition-opacity hover:bg-blue-500"
                title={`Add ${block.label}`}
              >
                <i className="ph ph-plus text-sm" />
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        <i className="ph ph-hand-grabbing mr-1" />
        Drag blocks to add or click + button
      </p>
    </div>
  );
}
