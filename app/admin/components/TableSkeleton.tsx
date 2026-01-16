import React from "react";
import { Skeleton } from "@/app/components/ui/Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-5">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-5">
                    <div className="flex items-center gap-3">
                      {colIndex === 0 && (
                        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                      )}
                      <div className="space-y-2 w-full">
                        <Skeleton
                          className={`h-4 ${
                            colIndex === 0 ? "w-3/4" : "w-full"
                          }`}
                        />
                        {colIndex === 0 && <Skeleton className="h-3 w-1/2" />}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
