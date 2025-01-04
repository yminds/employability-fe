import React from 'react';
import { useGetMultipleSkillsNameQuery } from '@/api/predefinedGoalsApiSlice';

interface Props {
    goalId: string | null;
}

const skillsLevelObj = { 1: "Basic", 2: "Intermediate", 3: "Advanced" };
const skillsImportanceObj = { 1: "Low", 2: "Medium", 3: "High" };

const getBadgeColor = (type: string, value: string) => {
    if (type === "proficiency") {
        return value === "Basic"
            ? "bg-[#E5F6FF] text-[#1C3FAA]"
            : value === "Intermediate"
                ? "bg-[#E5F0FF] text-[#1C2CD8]"
                : "bg-[#E5E7FF] text-[#1C2CD8]";
    }
    if (type === "importance") {
        return value === "Low"
            ? "bg-[#DBFFEA] text-[#10B754]"
            : value === "Medium"
                ? "bg-[#FFF9DB] text-[#D4B30C]"
                : "bg-[#FFF2DB] text-[#D48A0C]";
    }
};

const PredefinedGoalSkills: React.FC<Props> = ({ goalId }) => {
    const { data: skillsName } = useGetMultipleSkillsNameQuery(String(goalId), {
        skip: !goalId,
    });

    return <>
        <div className="flex flex-col items-start gap-8 flex-1 self-stretch">
            <div className="w-full mx-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-[12px]">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b">
                                <th className="p-3 px-6 text-left text-[#68696B] text-sm font-medium leading-5 tracking-tight">Skills</th>
                                <th className="p-3 px-6 text-left text-[#68696B] text-sm font-medium leading-5 tracking-tight">Proficiency Required</th>
                                <th className="p-3 px-6 text-left text-[#68696B] text-sm font-medium leading-5 tracking-tight">Importance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                skillsName?.data?.skill_pool_id?.length > 0 ? (
                                    skillsName.data.skill_pool_id.map((item: { skills_pool: { name: string }, level: 1 | 2 | 3, importance: 1 | 2 | 3 }, index: number) => {
                                        const skill = item.skills_pool; // Declare `skill` properly here
                                        const proficiency = skillsLevelObj[item.level];
                                        const importance = skillsImportanceObj[item.importance];
                                        return (
                                            <tr key={index}>
                                                <td className="p-3 px-6 text-[#414447] text-base font-medium leading-6 tracking-wide">
                                                    {skill.name}
                                                </td>
                                                <td className="p-3 px-6">
                                                    <span
                                                        className={`p-1 px-4 py-2 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px] ${getBadgeColor(
                                                            "proficiency",
                                                            proficiency,
                                                        )}`}
                                                    >
                                                        {proficiency}
                                                    </span>
                                                </td>
                                                <td className="p-3 px-6">
                                                    <span
                                                        className={`p-1 px-4 py-2 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px] ${getBadgeColor(
                                                            "importance",
                                                            importance,
                                                        )}`}
                                                    >
                                                        {importance}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <p className="p-3">No skills found.</p>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
};

export default PredefinedGoalSkills;