import React from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

// Market Trend
const chartData = [
    { month: "Jan", jobs: 1200 },
    { month: "Feb", jobs: 1600 },
    { month: "Mar", jobs: 1500 },
    { month: "Apr", jobs: 1400 },
    { month: "May", jobs: 1300 },
    { month: "Jun", jobs: 1400 },
    { month: "Jul", jobs: 1500 },
    { month: "Aug", jobs: 1800 },
    { month: "Sep", jobs: 2200 },
    { month: "Oct", jobs: 2400 },
    { month: "Nov", jobs: 2600 },
    { month: "Dec", jobs: 2800 },
];

const chartConfig = {
    jobs: {
        label: "Jobs",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const PredefinedGoalMarketTrend: React.FC = () => {
    return <>
        <div className="flex flex-col items-start gap-6 flex-1 self-stretch">
            <div className="flex flex-col items-start gap-3 self-stretch">
                <h5 className="text-black text-opacity-80 text-base font-medium leading-5 font-ubuntu">Demand</h5>
                <p className="text-gray-500 text-base font-normal leading-6 tracking-[0.24px]">Full Stack Developers rank among the top 10 most in-demand roles, valued for their front-end and back-end versatility. Demand has risen by 30% in the last three years, driven by startups and large enterprises.</p>
            </div>

            <div className="flex justify-center items-center w-full bg-white rounded-lg border">
                <div className="w-full">
                    <div className="flex flex-col justify-center items-start gap-5 self-stretch border-b border-b-[rgba(0,0,0,0.10)] bg-[#FAFAFA] p-5 px-6 rounded-tl-[9px] rounded-tr-[9px]">
                        <h2 className="flex items-center gap-4 self-stretch text-gray-600 text-base font-medium leading-5 font-ubuntu">
                            <img
                                src={"./src/assets/dashboard/work.svg"}
                                alt=""
                                className="w-5 h-5"
                            />Job Demand Over Time</h2>
                    </div>
                    <div className="p-6 pt-8 pl-3">
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={14}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={14}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                                />
                                <Area
                                    dataKey="jobs"
                                    type="linear"
                                    fillOpacity={0.4}
                                    stroke="#007BFF"
                                    fill="rgba(0, 123, 255, 0.4)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center w-full bg-white rounded-lg border">
                <div className="w-full">
                    <div className="flex flex-col justify-center items-start gap-5 self-stretch border-b border-b-[rgba(0,0,0,0.10)] bg-[#FAFAFA] p-5 px-6 rounded-tl-[9px] rounded-tr-[9px]">
                        <h2 className="flex items-center gap-4 self-stretch text-gray-600 text-base font-medium leading-5 font-ubuntu">
                            <img
                                src={"./src/assets/dashboard/work.svg"}
                                alt=""
                                className="w-5 h-5"
                            />Interest Over Time</h2>
                    </div>
                    <div className="p-6 pt-8 pl-3">
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={14}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={14}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                                />
                                <Area
                                    dataKey="jobs"
                                    type="linear"
                                    fillOpacity={0.4}
                                    stroke="#007BFF"
                                    fill="rgba(0, 123, 255, 0.4)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>
            </div>

        </div>
    </>
};

export default PredefinedGoalMarketTrend;