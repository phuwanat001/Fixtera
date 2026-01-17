"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableBlockProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function DraggableBlock({
  id,
  children,
  disabled = false,
}: DraggableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`
          absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center
          cursor-grab active:cursor-grabbing
          opacity-0 group-hover:opacity-100 transition-opacity
          text-slate-500 hover:text-slate-300
          ${disabled ? "hidden" : ""}
        `}
      >
        <i className="ph ph-dots-six-vertical text-lg" />
      </div>

      {/* Content with padding for drag handle */}
      <div className={disabled ? "" : "pl-8"}>{children}</div>
    </div>
  );
}
