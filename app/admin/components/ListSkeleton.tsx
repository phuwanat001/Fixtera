import React from "react";
import { Skeleton } from "@/app/components/ui/Skeleton";

interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
      <Skeleton className="h-6 w-32 mb-6" /> {/* Title */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 ${
              i < count - 1 ? "pb-4 border-b border-slate-800/50" : ""
            }`}
          >
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full shrink-0" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full mt-6 rounded-xl" /> {/* Button */}
    </div>
  );
}
