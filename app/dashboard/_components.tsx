"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

export function MainChart({ data }: { data: any[] }) {
  const params = useSearchParams();

  const key = params.get("key") ?? "total";

  const config = {
    [`${key}.anterior`]: {
      color: "var(--chart-1)",
    },
    [`${key}.corrente`]: {
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={{}} className="max-h-80 w-full">
      <BarChart data={data}>
        <Bar dataKey={`${key}.anterior`} fill={`var(--chart-3)`} radius={4} />
        <Bar dataKey={`${key}.corrente`} fill={`var(--chart-5)`} radius={4} />
        <YAxis
          tickFormatter={(t) => Number(t / 1000 / 1000).toFixed(1) + "M"}
          type="number"
          axisLine={false}
          tickLine={false}
        />
        <XAxis dataKey={"mes"} axisLine={false} tickLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <ChartLegend />
      </BarChart>
      <XAxis dataKey={"mes"} axisLine={false} tickLine={false} />
    </ChartContainer>
  );
}
