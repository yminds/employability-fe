import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateGoalMutation } from "@/api/predefinedGoalsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from '@/store/store';
import PredefinedGoalSkills from "./PredefinedGoalSkills";
import PredefinedGoalMarketTrend from "./PredefinedGoalMarketTrend";
import PredefinedGoalActiveJobs from "./PredefinedGoalActiveJobs";
import PredefinedGoalOverview from "./PredefinedGoalOverview";

interface Goal {
    _id: string;
    title: string;
    description: string;
    skill_pool_id: string[]; // Assuming the selected skills are passed here
    predefined_goal_id: string;
}

interface GoalFormDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGoal: Goal | null; // Goal data passed as a prop
    setJourneyDialog: boolean;
}

const PredefinedGoalDialog: React.FC<GoalFormDialogProps> = ({ isOpen, setIsOpen, selectedGoal }) => {
    const user_id = useSelector((state: RootState) => state.auth.user?._id || "");
    const [goalId] = useState(selectedGoal ? selectedGoal._id : "");
    const [goal] = useState(selectedGoal ? selectedGoal.title : "");
    const [description] = useState(selectedGoal ? selectedGoal.description : "");
    const [isSaved, setIsSaved] = useState(false); // State to handle success message visibility
    const [isSaving, setIsSaving] = useState(false); // State to handle saving/loading state

    const [createGoal] = useCreateGoalMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare goal data
        const goalData = {
            user_id: user_id,
            name: goal || '',
            skill_pool_ids: selectedGoal?.skill_pool_id || [],
            description: description || '',
            predefined_goal_id: selectedGoal?._id || '',
        };
        setIsSaving(true); // Set saving state to true when submitting
        try {
            await createGoal(goalData).unwrap();
            setIsSaved(false);
            setIsOpen(false);
            //setJourneyDialog(false);
        } catch (err) {
            console.error("Failed to save goal:", err);
        }
    };

    const handleCloseGoals = () => {
        setIsOpen(false);
    };

    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Skills", "Market Trend", "Active Jobs"];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 max-w-5xl h-[80vh] overflow-y-auto minimal-scrollbar rounded-[12px] font-ubuntu [&>button:last-child]:hidden lg:max-w-4xl md:max-w-lg">
                <DialogTitle className="hidden">Predefined Goals</DialogTitle>
                <div>
                    {/* Header Section */}
                    <div className="flex flex-col items-start justify-center gap-5 p-6 px-8 relative h-[245px] ">
                        <button className="flex items-center gap-4 text-gray-600 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro z-[9999]"
                            onClick={handleCloseGoals}>
                            <img
                                src={"./src/assets/dashboard/back.svg"}
                                alt=""
                                className="w-4 z-[9999]"
                            /> Back to Goals
                        </button>

                        <div className="flex flex-col items-start gap-5 z-[9999]">
                            <div className="flex-col items-end gap-3 self-stretch inline-block">
                                <span className="text-[#414447] text-[32px] font-medium leading-[42px] tracking-[-0.5px]">{goal}</span>
                                <span className="p-2 px-4 ml-3 justify-center items-center gap-2 rounded-[42px] bg-[#DBFFEA] text-[#10B754] text-[16px] font-medium leading-[25.6px] tracking-[-0.5px]">
                                    Entry Level
                                </span>
                            </div>
                            <button className="flex w-[196px] h-[44px] p-4 px-8 justify-center items-center gap-2 rounded bg-[#00183D] text-white text-[16px] font-medium leading-[150%] font-sf-pro" onClick={handleSubmit}>
                                Set This Goal
                            </button>
                        </div>

                        <img
                            src={"./src/assets/dashboard/goal_banner.png"}
                            alt="Fullstack Developer"
                            className="rounded-tl-[9px] rounded-tr-[9px] w-full absolute top-0 right-0 h-[245px] object-cover"
                        />
                    </div>

                    <div className="p-6 px-8 font-sf-pro">
                        {/* Tab Navigation */}
                        <div className="flex pb-10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex h-[36px] justify-center items-center gap-[10px] flex-[1_0_0] text-center text-base font-normal leading-6 tracking-wide ${activeTab === tab
                                        ? "border-b-2 border-[#00183D] text-[#00183D]"
                                        : "text-[#909091] hover:text-[#00183D]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Section */}
                        {activeTab === "Overview" && (
                            <PredefinedGoalOverview goalId={goalId} description={description}/>
                        )}

                        {/* Skills Tabs */}
                        {activeTab === "Skills" && (
                            <PredefinedGoalSkills />
                        )}

                        {/* Market Trend Tabs */}
                        {activeTab === "Market Trend" && (
                           <PredefinedGoalMarketTrend />
                        )}

                        {/* Active Jobs Tabs */}
                        {activeTab === "Active Jobs" && (
                            <PredefinedGoalActiveJobs />
                        )}

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PredefinedGoalDialog;