import { Card, CardHeader, CardContent } from "@/components/ui/card";
import SkillSummary from "./SkillSummary";
import SkillConcepts from "./SkillConcepts";
import Transcript from "./Transcript";
import arrow from '@/assets/skills/arrow.svg';
import { useGetUserSkillDetailsQuery } from "@/api/skillsApiSlice";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserSkill, UserSkillsIntialValues } from "@/types/userSkillsType";

const SkillDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data} = useGetUserSkillDetailsQuery(id!);
    const [skillDetails, setSkillDetails] = useState<UserSkill>(UserSkillsIntialValues);

    useEffect(() => {
        if (data) {
            setSkillDetails(data.data);
            console.log(data.data)
        }

    }, [data]);

    return (

        <div className="h-[90vh] w-[88vw] pl-[25%]">
            {/* Title Section */}
            <div className="flex items-center space-x-4 pl-4 mb-2">
                <button
                    className="w-6 h-6 flex items-center justify-center bg-white shadow-sm rounded-full border border-gray-200"
                    aria-label="Back"
                >
                    <img src={arrow} alt="Back" className="w-3 h-3" />
                </button>
                <h2 className="text-md font-ubuntu font-medium text-black">
                    React Skill Report
                </h2>
            </div>

            {/* Main Content Section */}
            <div className="flex h-[calc(90vh-40px)]">
                <div
                    className="flex-1 overflow-y-auto pr-5"
                    style={{
                        scrollbarWidth: "none",
                    }}
                >
                    <div
                        className="h-full"
                    >
                        <div className="p-5 space-y-4">
                            {/* Skill Summary */}
                            <SkillSummary summary={skillDetails.summary!} strengths={skillDetails.strengths!} areas={skillDetails.areas_for_improvement!} />

                            {/* Core Skill Details */}
                            <SkillConcepts  areas={skillDetails.areas!}/>

                            {/* Transcript */}
                            <Transcript  transcription={skillDetails.latest_interview?.transcription!}/>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <aside className="hidden lg:block w-[35%] bg-[#F7F7F7] p-5">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Skill Breakdown</h2>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li>
                                    <div className="flex justify-between">
                                        <span>React Fundamentals</span>
                                        <span>70%</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-between">
                                        <span>React Hooks</span>
                                        <span>70%</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-between">
                                        <span>Redux</span>
                                        <span>85%</span>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>

    );
};

export default SkillDetails;
