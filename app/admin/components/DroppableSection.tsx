"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface DroppableSectionProps {
  id: string;
  children: React.ReactNode;
  items: string[];
  columnIndex?: number;
  isEmpty?: boolean;
}

export default function DroppableSection({
  id,
  children,
  items,
  columnIndex,
  isEmpty = false,
}: DroppableSectionProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { columnIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[100px] rounded-lg transition-all
        ${isOver ? "bg-blue-500/10 border-blue-500/50" : "bg-slate-900/30 border-slate-700/50"}
        ${isEmpty ? "border-2 border-dashed" : "border"}
      `}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-slate-500">
            <i className="ph ph-plus-circle text-2xl mb-2" />
            <span className="text-xs">Drop blocks here</span>
          </div>
        ) : (
          <div className="space-y-3 p-3">{children}</div>
        )}
      </SortableContext>
    </div>
  );
}
