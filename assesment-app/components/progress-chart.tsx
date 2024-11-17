"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface ProgressChartProps {
    completed: number,
    total: number
}

const chartConfig = {
    done: {
        label: "Completed",
    },
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-1))",
    },
    remaining: {
        label: "Remaining",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig

const ProgressChart: React.FC<ProgressChartProps> = ({ completed, total }) => {

    const chartData = [
        { assessment: "completed", done: completed, fill: "var(--color-completed)" },
        { assessment: "remaining", done: total - completed, fill: "var(--color-remaining)" },
    ]

    const completedPercentage = completed / total * 100
    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-40"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="done"
                    nameKey="assessment"
                    innerRadius={50}
                    strokeWidth={5}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {completedPercentage.toLocaleString()}%
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Completed
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}

export default ProgressChart