import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetMultipleSkillsNameQuery } from "@/api/predefinedGoalsApiSlice";

interface Goal {
    _id: string;
    title: string;
    description: string;
    skill_pool_id: string[]; // Assuming the selected skills are passed here
}

interface GoalFormDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGoal: Goal; // Goal data passed as a prop
}

const PredefinedGoalDialog: React.FC<GoalFormDialogProps> = ({ isOpen, setIsOpen, selectedGoal }) => {
    const [goalId] = useState(selectedGoal ? selectedGoal._id : "");
    const [goal] = useState(selectedGoal ? selectedGoal.title : "");
    const [description] = useState(selectedGoal ? selectedGoal.description : "");

    const { data: skillsName, error, isLoading } = useGetMultipleSkillsNameQuery(goalId, {
        skip: !goalId,
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 max-w-2xl max-h-[100vh] overflow-y-auto minimal-scrollbar">
                <DialogTitle className="hidden">Predefined Goals</DialogTitle>

                <div className="flex items-center justify-center">
                    <div className="w-full inline-flex p-[42px] flex-col justify-center items-start gap-[40px]">
                        <div>
                            <h2 className="text-gray-900 text-2xl font-medium leading-8 tracking-tight mb-4">{goal}</h2>
                            <p>{description}</p>
                        </div>

                        <div className="flex flex-col items-start gap-3.5">
                            <label htmlFor="goal" className="text-gray-900 text-base font-medium leading-5">
                                Skills
                            </label>
                            <div className="mt-2">
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
                                                    className="flex p-2 px-5 py-2.5 items-center gap-2 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-600 text-xs font-medium leading-5"
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

                        <div className="w-full flex justify-end mt-4">
                            <button type="submit" className="flex w-auto h-[44px] p-4 justify-center items-center gap-2 self-stretch rounded bg-[#10B754] text-white text-[16px] font-medium leading-[24px] tracking-[0.24px]">
                                Set Goal
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PredefinedGoalDialog;