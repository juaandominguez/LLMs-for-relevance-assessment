"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, Cell, Pie, PieChart, Sector } from "recharts"
import { Comparison } from '@/types'

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']
// eslint-disable-next-line
const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    )
}

interface DataDashboardProps {
    data: Comparison[]
}

const DataDashboard: React.FC<DataDashboardProps> = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    const totalGolden = data.reduce((sum, item) => sum + item.golden, 0)
    const totalLLM = data.reduce((sum, item) => sum + item.llm, 0)

    const comparisonData = [
        { name: 'Golden > LLM', value: data.filter(item => item.golden > item.llm).length },
        { name: 'LLM > Golden', value: data.filter(item => item.llm > item.golden).length },
        { name: 'Equal', value: data.filter(item => item.golden === item.llm).length },
    ]

    const onPieEnter = (_: undefined, index: number) => {
        setActiveIndex(index)
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 w-full place-items-center pt-10 lg:p-10">
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Golden vs LLM Trend</CardTitle>
                    <CardDescription>Comparison of Golden and LLM values across all pairs</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{
                        golden: { label: "Golden", color: "hsl(var(--chart-1))" },
                        llm: { label: "LLM", color: "hsl(var(--chart-2))" },
                    }} className="">
                        <ResponsiveContainer width="25%" height="25%">
                            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="pair" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line type="monotone" dataKey="golden" stroke="var(--color-golden)" />
                                <Line type="monotone" dataKey="llm" stroke="var(--color-llm)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Golden vs LLM Correlation</CardTitle>
                    <CardDescription>Scatter plot showing the relationship between Golden and LLM values</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{
                        golden: { label: "Golden", color: "hsl(var(--chart-1))" },
                        llm: { label: "LLM", color: "hsl(var(--chart-2))" },
                    }} className="">
                        <ResponsiveContainer width="25%" height="25%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="golden" name="Golden" />
                                <YAxis type="number" dataKey="llm" name="LLM" />
                                <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                                <Scatter name="Golden vs LLM" data={data} fill="var(--color-golden)" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Total Golden vs LLM</CardTitle>
                    <CardDescription>Comparison of total Golden and LLM values</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{
                        golden: { label: "Golden", color: "hsl(var(--chart-1))" },
                        llm: { label: "LLM", color: "hsl(var(--chart-2))" },
                    }} className="">
                        <ResponsiveContainer width="25%" height="25%">
                            <BarChart data={[{ name: 'Total', golden: totalGolden, llm: totalLLM }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="golden" fill="var(--color-golden)" />
                                <Bar dataKey="llm" fill="var(--color-llm)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Comparison Distribution</CardTitle>
                    <CardDescription>Distribution of pairs where Golden is greater, LLM is greater, or they are equal</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{
                        golden: { label: "Golden > LLM", color: "hsl(var(--chart-1))" },
                        llm: { label: "LLM > Golden", color: "hsl(var(--chart-2))" },
                        equal: { label: "Equal", color: "hsl(var(--chart-3))" },
                    }} className="">
                        <ResponsiveContainer width="25%" height="25%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={comparisonData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                >
                                    {comparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default DataDashboard