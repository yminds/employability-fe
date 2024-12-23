import { Card, CardContent } from "@/components/ui/card";
import ReactPlayer from 'react-player';

// Importing the icons
import strengthsIcon from '@/assets/skills/strengths.svg';
import areasIcon from '@/assets/skills/areas.svg';

interface skillSummaryProps {
    summary: string;
    strengths: string[];
    areas: string[]
}

const SkillSummary: React.FC<skillSummaryProps> = ({ summary, strengths,areas }) => {
    return (
        <Card className="border-none shadow-sm h-full">
            <CardContent className="p-6">
                <div className="rounded-sm">
                    <ReactPlayer
                        url="https://www.w3schools.com/html/mov_bbb.mp4"
                        controls
                        width="100%"
                        height="100%"
                        playing={true}
                        muted={true}
                    />
                </div>

                <div className="flex p-2 flex-col gap-2">
                    <h2 className="font-ubuntu text-sm font-bold">Summary</h2>
                    <p className="text-sm font-ubuntu align-start font-normal">
                        {summary}
                    </p>
                </div>

                {/* Cards for Scorecard, Strengths, and Areas of Improvement */}
                <div className="container flex flex-row gap-4 text-sm">
                    <Card className="bg-[#F7F7F7] p-4 w-1/2 border-none">
                        <h3>Scorecard</h3>
                        <div>
                            <canvas id="scorecard-chart"></canvas>
                        </div>
                    </Card>

                    <Card className="bg-[#F7F7F7] p-4 text-xs w-1/2 border-none">
                        {/* Strengths Section */}
                        <div className="flex items-center gap-2 pb-2">
                            <img src={strengthsIcon} alt="Strengths Icon" className="w-6 h-6" />
                            <h4 className="font-medium">Strengths</h4>
                        </div>
                        <ul className="pl-6 text-xs list-disc">
                            {strengths.map((strength: string,index:number) => {
                                return <li key={index} className="pb-1">{strength}</li>;
                            })}
                        </ul>


                        {/* Areas of Improvement Section */}
                        <div className="flex items-center gap-2 mt-4  pb-2">
                            <img src={areasIcon} alt="Areas Icon" className="w-6 h-6" />
                            <h4 className="font-medium">Areas for Improvement</h4>
                        </div>
                        <ul className="pl-6 text-xs list-disc">
                            {areas.map((area: string,index:number) => {
                                return <li key={index} className="pb-1">{area}</li>;
                            })}
                        </ul>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
};

export default SkillSummary;
