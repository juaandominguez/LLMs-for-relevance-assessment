"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// const mockData = [
//     { pair: '1', golden: 1, llm: 7 },
//     { pair: '2', golden: 2, llm: 6 },
//     { pair: '3', golden: 3, llm: 4 },
//     { pair: '4', golden: 1, llm: 6 },
//     { pair: '5', golden: 0, llm: 6 },
//     { pair: '6', golden: 1, llm: 7 },
//     { pair: '7', golden: 2, llm: 6 },
//     { pair: '8', golden: 3, llm: 4 },
//     { pair: '9', golden: 1, llm: 6 },
//     { pair: '10', golden: 0, llm: 6 },
//     { pair: '11', golden: 1, llm: 7 },
//     { pair: '12', golden: 2, llm: 6 },
//     { pair: '13', golden: 3, llm: 4 },
//     { pair: '14', golden: 1, llm: 6 },
//     { pair: '15', golden: 0, llm: 6 },
//     { pair: '16', golden: 1, llm: 7 },
//     { pair: '17', golden: 2, llm: 6 },
//     { pair: '18', golden: 3, llm: 4 },
//     { pair: '19', golden: 1, llm: 6 },
//     { pair: '20', golden: 0, llm: 6 },
//     { pair: '21', golden: 1, llm: 7 },
//     { pair: '22', golden: 2, llm: 6 },
//     { pair: '23', golden: 3, llm: 4 },
//     { pair: '24', golden: 1, llm: 6 },
//     { pair: '25', golden: 0, llm: 6 },
//     { pair: '26', golden: 1, llm: 7 },
//     { pair: '27', golden: 2, llm: 6 },
//     { pair: '28', golden: 3, llm: 4 },
//     { pair: '29', golden: 1, llm: 6 },
//     { pair: '30', golden: 0, llm: 6 },
//     { pair: '31', golden: 1, llm: 7 },
//     { pair: '32', golden: 2, llm: 6 },
//     { pair: '33', golden: 3, llm: 4 },
//     { pair: '34', golden: 1, llm: 6 },
//     { pair: '35', golden: 0, llm: 6 },
//     { pair: '36', golden: 1, llm: 7 },
//     { pair: '37', golden: 2, llm: 6 },
//     { pair: '38', golden: 3, llm: 4 },
//     { pair: '39', golden: 1, llm: 6 },
//     { pair: '40', golden: 0, llm: 6 },
//     { pair: '41', golden: 1, llm: 7 },
//     { pair: '42', golden: 2, llm: 6 },
//     { pair: '43', golden: 3, llm: 4 },
//     { pair: '44', golden: 1, llm: 6 },
//     { pair: '45', golden: 0, llm: 6 },
//     { pair: '46', golden: 1, llm: 7 },
//     { pair: '47', golden: 2, llm: 6 },
//     { pair: '48', golden: 3, llm: 4 },
//     { pair: '49', golden: 1, llm: 6 },
//     { pair: '50', golden: 0, llm: 6 },
// ]

const chartConfig = {
    golden: {
        label: "Assessor",
        color: "#2563eb",
    },
    llm: {
        label: "LLM",
        color: "#60a5fa",
    },
} satisfies ChartConfig

interface ChartData {
    assessment: any
}



const Component: React.FC<ChartData> = ({
    assessment
}) => {
    return (
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={assessment}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="pair"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="golden" fill="var(--color-golden)" radius={4} />
                <Bar dataKey="llm" fill="var(--color-llm)" radius={4} />
            </BarChart>
        </ChartContainer>

    )
}

export default Component