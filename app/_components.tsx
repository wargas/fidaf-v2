'use client'
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function MainChart({ data }: { data: any[] }) {

    const [key, setKey] = useState('total')

    const config = {
        [`${key}.anterior`]: {
          color: 'var(--chart-1)'
        },
        [`${key}.corrente`]: {
          color: 'var(--chart-2)'
        }
      } satisfies ChartConfig

    return <ChartContainer config={{}} className="max-h-80 w-full" >
        <BarChart data={data}>
            <Bar dataKey={`${key}.anterior`} fill={`var(--chart-2)`} radius={4} />
            <Bar dataKey={`${key}.corrente`} fill={`var(--chart-4)`} radius={4} />
            <YAxis tickFormatter={t => Number(t / 1000 / 1000).toFixed(1) + "M"} type="number" axisLine={false} tickLine={false} />
            <XAxis dataKey={'mes'} axisLine={false} tickLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <ChartLegend />
        </BarChart>
        <XAxis dataKey={"mes"} axisLine={false} tickLine={false} />
    </ChartContainer>

}