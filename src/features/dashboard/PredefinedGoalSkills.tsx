import React from 'react';

// SKills
const skillsData = [
    { skill: "JavaScript", proficiency: "Intermediate", importance: "High" },
    { skill: "HTML", proficiency: "Basic", importance: "Medium" },
    { skill: "CSS", proficiency: "Basic", importance: "Low" },
    { skill: "Node.js", proficiency: "Intermediate", importance: "Medium" },
    { skill: "MongoDB", proficiency: "Advanced", importance: "Medium" },
    { skill: "React.js", proficiency: "Intermediate", importance: "High" },
    { skill: "Express.js", proficiency: "Advanced", importance: "Medium" },
    { skill: "Git Version Control", proficiency: "Basic", importance: "Medium" },
    { skill: "Agile Methodology", proficiency: "Intermediate", importance: "High" },
    { skill: "Communication", proficiency: "Basic", importance: "High" },
    { skill: "Problem Solving", proficiency: "Basic", importance: "High" },
];

const getBadgeColor = (type: string, value: string) => {
    if (type === "proficiency") {
        return value === "Basic"
            ? "bg-blue-100 text-blue-600"
            : value === "Intermediate"
                ? "bg-purple-100 text-purple-600"
                : "bg-indigo-100 text-indigo-600";
    }
    if (type === "importance") {
        return value === "Low"
            ? "bg-green-100 text-green-600"
            : value === "Medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-orange-100 text-orange-600";
    }
};

const PredefinedGoalSkills: React.FC = () => {
    return <>
        <div className="flex flex-col items-start gap-8 flex-1 self-stretch">
            <div className="w-full mx-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-[12px]">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b">
                                <th className="p-3 px-6 text-left text-gray-500 text-sm font-medium leading-5 tracking-tight">Skills</th>
                                <th className="p-3 px-6 text-left text-gray-500 text-sm font-medium leading-5 tracking-tight">Proficiency Required</th>
                                <th className="p-3 px-6 text-left text-gray-500 text-sm font-medium leading-5 tracking-tight">Importance</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {skillsData.map((item, index) => (
                                <tr
                                    key={index}
                                >
                                    <td className="p-3 px-6 text-gray-600 text-base font-medium leading-6 tracking-wide">{item.skill}</td>
                                    <td className="p-3 px-6">
                                        <span
                                            className={`p-1 px-4 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px]" ${getBadgeColor(
                                                "proficiency",
                                                item.proficiency
                                            )}`}
                                        >
                                            {item.proficiency}
                                        </span>
                                    </td>
                                    <td className="p-3 px-6">
                                        <span
                                            className={`p-1 px-4 rounded-[40px] text-base font-medium leading-6 tracking-[0.24px]" ${getBadgeColor(
                                                "importance",
                                                item.importance
                                            )}`}
                                        >
                                            {item.importance}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
};

export default PredefinedGoalSkills;