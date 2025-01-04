import React from 'react';
import { useGetMultipleSkillsNameQuery } from '@/api/predefinedGoalsApiSlice';

interface Props {
    goalId: string | null;
    description: string | null;
    jobMarketDemand: string | null;
    salaryRange: string | null;
    difficultyLevel: string | null;
    learningTime: string | null;
}

const PredefinedGoalOverview: React.FC<Props> = ({ goalId, description, jobMarketDemand, salaryRange, difficultyLevel, learningTime }) => {
    const { data: skillsName, error, isLoading } = useGetMultipleSkillsNameQuery(String(goalId), {
        skip: !goalId,
    });

    return <>
        <div className="flex flex-col items-start gap-8 flex-1 self-stretch">
            <p className="text-black text-opacity-80 text-base font-normal leading-6 tracking-[0.24px]">
                {description}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-2 gap-4">
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#DBFFEA]">
                    <img
                        src={"./src/assets/dashboard/entry.svg"}
                        alt="Entry"
                        className="w-4"
                    />
                    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                        <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Entry level salary</p>
                        <p className="text-[#03963F] text-[20px] font-bold leading-[24px] tracking-[0.3px]">{salaryRange}</p>
                    </div>
                </div>
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#FFF2DB]">
                    <img
                        src={"./src/assets/dashboard/demand.svg"}
                        alt="Demand"
                        className="w-4"
                    />
                    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                        <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Demand</p>
                        <p className="text-[#D48A0C] text-[20px] font-bold leading-[24px] tracking-[0.3px]">{jobMarketDemand}</p>
                    </div>
                </div>
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#E5F0FF]">
                    <img
                        src={"./src/assets/dashboard/difficult.svg"}
                        alt="Difficult"
                        className="w-4"
                    />
                    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                        <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Difficulty Level</p>
                        <p className="text-[#3888FF] text-[20px] font-bold leading-[24px] tracking-[0.3px]">{difficultyLevel}</p>
                    </div>
                </div>
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#EEEBFF]">
                    <img
                        src={"./src/assets/dashboard/estimate.svg"}
                        alt="Estimate"
                        className="w-4"
                    />
                    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                        <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Est. Learning Time</p>
                        <p className="text-[#8C76FB] text-[20px] font-bold leading-[24px] tracking-[0.3px]">{learningTime}</p>
                    </div>
                </div>
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#E5F6FF]">
                    <img
                        src={"./src/assets/dashboard/engineering.svg"}
                        alt="Engineering"
                        className="w-4"
                    />
                    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                        <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Engineering</p>
                        <p className="text-[#1FB4FF] text-[20px] font-bold leading-[24px] tracking-[0.3px]">NO!</p>
                    </div>
                </div>
            </div>

            <div className="h-px self-stretch bg-[#D9D9D9]"></div>

            {/* Skills Section */}
            <div className="flex flex-col items-start gap-6 self-stretch">
                <h2 className="flex items-center gap-2 text-gray-600 text-base font-medium leading-5 font-ubuntu">
                    <img
                        src={"./src/assets/dashboard/puzzle_piece.svg"}
                        alt=""
                        className="w-5 h-5"
                    />Skills required</h2>
                <div className="flex flex-wrap gap-2">
                    {/* Handle skillsName */}
                    {isLoading && <p>Loading skills...</p>}
                    {error && <p className="text-red-500 text-sm">Failed to load skills.</p>}
                    {
                        // Ensure skillsName is properly accessed and handled
                        skillsName?.data?.skill_pool_id?.length > 0 ? (
                            skillsName.data.skill_pool_id.map((skill: any) => (
                                <span
                                    key={skill._id}
                                    className="flex p-3 px-5 justify-center items-center gap-2.5 border rounded border-green-600/30 bg-[#EFFBF4] text-black/80 text-base font-normal leading-6 tracking-[0.24px]"
                                >
                                    {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                    {skill.name}
                                </span>
                            ))
                        ) : (
                            <p></p>
                        )
                    }
                </div>
            </div>
        </div>
    </>
};

export default PredefinedGoalOverview;