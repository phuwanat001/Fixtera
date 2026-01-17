"use client";

import React from "react";

export type LayoutType =
  | "full"
  | "two-equal"
  | "two-left"
  | "two-right"
  | "three-equal";

interface LayoutOption {
  type: LayoutType;
  label: string;
  columns: number[];
  icon: React.ReactNode;
}

const layouts: LayoutOption[] = [
  {
    type: "full",
    label: "Full Width",
    columns: [100],
    icon: <div className="w-full h-6 bg-current rounded opacity-60" />,
  },
  {
    type: "two-equal",
    label: "50 / 50",
    columns: [50, 50],
    icon: (
      <div className="flex gap-1 w-full h-6">
        <div className="flex-1 bg-current rounded opacity-60" />
        <div className="flex-1 bg-current rounded opacity-60" />
      </div>
    ),
  },
  {
    type: "two-left",
    label: "70 / 30",
    columns: [70, 30],
    icon: (
      <div className="flex gap-1 w-full h-6">
        <div className="w-[70%] bg-current rounded opacity-60" />
        <div className="w-[30%] bg-current rounded opacity-60" />
      </div>
    ),
  },
  {
    type: "two-right",
    label: "30 / 70",
    columns: [30, 70],
    icon: (
      <div className="flex gap-1 w-full h-6">
        <div className="w-[30%] bg-current rounded opacity-60" />
        <div className="w-[70%] bg-current rounded opacity-60" />
      </div>
    ),
  },
  {
    type: "three-equal",
    label: "3 Columns",
    columns: [33, 34, 33],
    icon: (
      <div className="flex gap-1 w-full h-6">
        <div className="flex-1 bg-current rounded opacity-60" />
        <div className="flex-1 bg-current rounded opacity-60" />
        <div className="flex-1 bg-current rounded opacity-60" />
      </div>
    ),
  },
];

interface LayoutPickerProps {
  onSelect: (layout: LayoutType) => void;
  selectedLayout?: LayoutType;
}

export default function LayoutPicker({
  onSelect,
  selectedLayout,
}: LayoutPickerProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
      <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
        <i className="ph ph-grid-four text-blue-400" />
        Add Section Layout
      </h4>
      <div className="grid grid-cols-5 gap-2">
        {layouts.map((layout) => (
          <button
            key={layout.type}
            type="button"
            onClick={() => onSelect(layout.type)}
            className={`
              p-3 rounded-lg border transition-all flex flex-col items-center gap-2
              ${
                selectedLayout === layout.type
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 text-slate-400"
              }
            `}
            title={layout.label}
          >
            <div className="w-full">{layout.icon}</div>
            <span className="text-[10px] font-medium whitespace-nowrap">
              {layout.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getLayoutColumns(layoutType: LayoutType): number[] {
  const layout = layouts.find((l) => l.type === layoutType);
  return layout?.columns || [100];
}
