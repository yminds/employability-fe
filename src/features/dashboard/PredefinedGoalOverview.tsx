import React from 'react';
import { useGetMultipleSkillsNameQuery } from '@/api/predefinedGoalsApiSlice';
import EntryImg from '@/assets/dashboard/entry.svg';
import DemandImg from '@/assets/dashboard/demand.svg';
import DifficultImg from '@/assets/dashboard/difficult.svg';
import EstimateImg from '@/assets/dashboard/estimate.svg';
import EngineeringImg from '@/assets/dashboard/engineering.svg';
import PuzzlePieceImg from '@/assets/dashboard/puzzle_piece.svg';

interface Props {
    goalId: string | null;
    description: string | null;
    jobMarketDemand: string | null;
    minSalaryRange: number | null;
    maxSalaryRange: number | null;
    difficultyLevel: string | null;
    learningTime: string | null;
}

const PredefinedGoalOverview: React.FC<Props> = ({ goalId, description, jobMarketDemand, minSalaryRange, maxSalaryRange, difficultyLevel, learningTime }) => {
    const { data: skillsName, error, isLoading } = useGetMultipleSkillsNameQuery(String(goalId), {
        skip: !goalId,
    });

    return <>
        <div className="flex flex-col items-start gap-8 flex-1 self-stretch">
            <p className="text-black text-opacity-80 text-base font-normal leading-6 tracking-[0.24px]">
                {description}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-5 xl:grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-4">
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#DBFFEA]">
                    <img
                        src={EntryImg}
                        alt="Entry"
                        className="w-4"
                    />
                    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
                        <p className="text-gray-500 text-sm font-medium leading-5 tracking-tight">Entry level salary</p>
                        <p className="text-[#03963F] text-[20px] font-bold leading-[24px] tracking-[0.3px]">{minSalaryRange !== null && maxSalaryRange !== null ? formatSalaryRange(minSalaryRange, maxSalaryRange) : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex w-[160px] p-3 py-3 px-4 flex-col items-start gap-3 rounded-lg bg-[#FFF2DB]">
                    <img
                        src={DemandImg}
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
                        src={DifficultImg}
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
                        src={EstimateImg}
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
                        src={EngineeringImg}
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
                        src={PuzzlePieceImg}
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
                            skillsName?.data.skill_pool_id.map((item: any) => {
                                let skill = item.skills_pool;
                                return (
                                    <span
                                        key={skill._id}
                                        className="flex p-3 px-5 justify-center items-center gap-2.5 border rounded border-green-600/30 bg-[#EFFBF4] text-black/80 text-base font-normal leading-6 tracking-[0.24px]"
                                    >
                                        {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5" />}
                                        {skill.name}
                                    </span>
                                );
                            })
                        ) : (
                            <p className="p-3">No skills found.</p>
                        )
                    }
                </div>
            </div>
        </div>
    </>
};

export default PredefinedGoalOverview;

const formatSalaryRange = (minSalary: number, maxSalary: number) => {
    const formatToLPA = (amount: number) => `${(amount / 100000).toFixed(0)}`; // Convert to LPA without decimals
    return `${formatToLPA(minSalary)}-${formatToLPA(maxSalary)} LPA`;
};