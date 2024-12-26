
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Mapping ratings to numerical values
const ratingMapping = {
    Low: 1,
    Average: 2,
    Good: 3,
    Excellent: 4,
};

interface Area {
    name: string;
    rating: string;
    strengths: string[];
    areas_for_improvement: string[];
}

interface AreasRadarCardProps {
    areas: Area[];
}

const AreasRadarCard: React.FC<AreasRadarCardProps> = ({ areas }) => {
    // Prepare chart data based on the areas and ratings
    const chartData = areas.map((area) => ({
        area: area.name,
        rating: ratingMapping[area.rating as keyof typeof ratingMapping] || 0,
    }));

    const chartConfig = {
        desktop: {
            label: "Skills Rating",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <Card className="bg-transparent border-none shadow-none w-full m-0">

            <CardContent className="pb-0 w-full">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="area" tickFormatter={(tick) => {
                            const words = tick.split(" ");
                            return words.length > 1 ? words.join("\n") : tick;
                        }} />
                        <PolarGrid />
                        <Radar
                            dataKey="rating"
                            fill="rgba(3.34, 150.16, 62.71, 0.35)"
                            fillOpacity={0.6}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                            width={"100"}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>

        </Card>
    );
};

export default AreasRadarCard;
