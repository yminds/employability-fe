import React from 'react';
import { useGetMultipleSkillsNameQuery } from '@/api/predefinedGoalsApiSlice';

const getBadgeColor = (type: string, value: string) => {
    if (type === "proficiency") {
        return value === "Basic"
            ? "bg-blue-100 text-blue-600"
            : value === "Intermediate"
                ? "bg-purple-100 text-purple-600"
                : "bg-[#E5E7FF] text-[#1C2CD8]";
    }
    if (type === "importance") {
        return value === "Low"
            ? "bg-green-100 text-green-600"
            : value === "Medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-[#FFF2DB] text-[#D48A0C]";
    }
};

interface Props {
    goalId: string | null;
}

const PredefinedGoalSkills: React.FC<Props> = ({ goalId }) => {
    const { data: skillsData } = useGetMultipleSkillsNameQuery(String(goalId), {
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
                        <tbody className="">
                            {
                                skillsData?.data?.skill_pool_id?.length > 0 ? (
                                    skillsData.data.skill_pool_id.map((item: any, index: React.Key | null | undefined) => (
                                        <tr
                                            key={index}
                                        >
                                            <td className="p-3 px-6 text-[#414447] text-base font-medium leading-6 tracking-wide">{item.name}</td>
                                            <td className="p-3 px-6">
                                                <span
                                                    className={`p-1 px-4 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px]" ${getBadgeColor(
                                                        "proficiency",
                                                        "Advanced"
                                                    )}`}
                                                >
                                                    Advanced
                                                </span>
                                            </td>
                                            <td className="p-3 px-6">
                                                <span
                                                    className={`p-1 px-4 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px]" ${getBadgeColor(
                                                        "importance",
                                                        "High"
                                                    )}`}
                                                >
                                                    High
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <p>No results</p>
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