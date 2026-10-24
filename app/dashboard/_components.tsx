"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonChart() {
  return (
    <div className="flex items-baseline gap-4 w-full">
      {Array(30)
        .fill(1)
        .map((_, i) => (
          <Skeleton
            key={i}
            style={{ height: Math.random() * 240 }}
            className="w-8"
          />
        ))}
    </div>
  );
}

export function SkeletonStats() {
  return <div className="grid grid-cols-4 gap-2">
    {Array(4).fill(1).map((_,i) => (
      <Skeleton key={i} className="h-20" />
    ))}
  </div>
}
