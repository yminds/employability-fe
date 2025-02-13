import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAddUserGoalMutation } from "@/api/predefinedGoalsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from '@/store/store';
import PredefinedGoalSkills from "./PredefinedGoalSkills";
import PredefinedGoalMarketTrend from "./PredefinedGoalMarketTrend";
import PredefinedGoalActiveJobs from "./PredefinedGoalActiveJobs";
import PredefinedGoalOverview from "./PredefinedGoalOverview";
import { DialogDescription } from "@radix-ui/react-dialog";
import BackImg from '@/assets/dashboard/back.svg';
import BannerSkillsIcons from "@/components/setgoals/BannerSkillsIcon";
import { useNavigate } from "react-router-dom";

interface Goal {
    _id: string;
    title: string;
    description: string;
    skill_pool_id: string[]; // Assuming the selected skills are passed here
    predefined_goal_id: string;
    job_market_demand: string;
    min_salary_range: number;
    max_salary_range: number;
    difficulty_level: string;
    learning_time: string;
    experience_level: string;
}

interface GoalFormDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGoal: Goal | null; // Goal data passed as a prop
    setJourneyDialog: React.Dispatch<React.SetStateAction<boolean>>;
    isSetGoalsPage: boolean; 
    bannerColor:string
}

const jobsMarketDemandObj = {1: "High", 2: "Mid", 3: "Low"};
const experienceLevelObj = {1: "Entry-level", 2: "Mid-level", 3: "Senior-level"};
const difficultyLevelObj = {1: "Easy", 2: "Medium", 3: "High"};
const learningTimeObj = {1: "1-3 Months", 2: "3-6 Months", 3: "6-12 Months", 4: "Over 1 Year"};

const tabs = ["Overview", "Skills", "Market Trend", "Active Jobs"];

const PredefinedGoalDialog: React.FC<GoalFormDialogProps> = ({ isOpen, setIsOpen, selectedGoal, isSetGoalsPage, bannerColor, setJourneyDialog}) => { 
    const user_id = useSelector((state: RootState) => state.auth.user?._id || "");
    const [goalId] = useState(selectedGoal ? selectedGoal._id : "");
    const [goal] = useState(selectedGoal ? selectedGoal.title : "");
    const [description] = useState(selectedGoal ? selectedGoal.description : "");
    const [jobMarketDemand] = useState(selectedGoal ? jobsMarketDemandObj[Number(selectedGoal.job_market_demand) as keyof typeof jobsMarketDemandObj] : "");
    const [minSalaryRange] = useState(selectedGoal ? selectedGoal.min_salary_range : 0);
    const [maxSalaryRange] = useState(selectedGoal ? selectedGoal.max_salary_range : 0);
    const [difficultyLevel] = useState(selectedGoal ? difficultyLevelObj[Number(selectedGoal.difficulty_level) as keyof typeof difficultyLevelObj] : "");
    const [learningTime] = useState(selectedGoal ? learningTimeObj[Number(selectedGoal.learning_time) as keyof typeof learningTimeObj] : "");
    const [experienceLevel] = useState(selectedGoal ? experienceLevelObj[Number(selectedGoal.experience_level) as keyof typeof experienceLevelObj] : "");
    
    const [isSaved, setIsSaved] = useState(false); // State to handle success message visibility
    const [isSaving, setIsSaving] = useState(false); // State to handle saving/loading state

    const [createGoal] = useAddUserGoalMutation();
    const navigate = useNavigate();
    

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
            setJourneyDialog(false);
            navigate("/");
            
        } catch (err) {
            console.error("Failed to save goal:", err);
        }
    };

    const handleCloseGoals = () => {
        setIsOpen(false);
    };

    const [activeTab, setActiveTab] = useState("Overview");
    const dialogClassName = `p-0 max-w-[1400px] h-[90vh] overflow-y-auto minimal-scrollbar rounded-[12px] font-ubuntu [&>button:last-child]:hidden lg:max-w-full md:max-w-lg ${
        isSetGoalsPage ? 'fixed w-[] h-[100vh] transition-all duration-300 border-none rounded-none ' + (isOpen ? 'translate-x-0' : 'translate-x-full') : ''
    }`;

    return (
        <div className=" relative  w-screen h-screen">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className={dialogClassName}>
                    <DialogTitle className="hidden">Predefined Goals</DialogTitle>
                    <DialogDescription className="hidden">Select a predefined goal to set your journey</DialogDescription>
                    <div>
                        {/* Header Section */}
                        <div className="flex flex-col items-start justify-center gap-5 p-6 px-8 h-[245px] relative ">
                            <button className="flex items-center gap-4 text-gray-600 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro z-[9999]"
                                onClick={handleCloseGoals}>
                                <img
                                    src={BackImg}
                                    alt=""
                                    className="w-4 z-[9999]"
                                /> Back to Goals
                            </button>

                            <div className="flex flex-col items-start gap-5 z-[9999]">
                                <div className="flex-col items-end gap-3 self-stretch inline-block">
                                    <span className="text-[#414447] text-[32px] font-medium leading-[42px] tracking-[-0.5px]">{goal}</span>
                                    <span className="p-2 px-4 ml-3 justify-center items-center gap-2 rounded-[42px] bg-[#DBFFEA] text-[#10B754] text-[16px] font-medium leading-[25.6px] tracking-[-0.5px]">
                                        {experienceLevel}
                                    </span>
                                </div>
                                <button className="flex w-[196px] h-[44px] p-4 px-8 justify-center items-center gap-2 rounded bg-[#00183D] text-white text-[16px] font-medium leading-[150%] font-sf-pro" onClick={handleSubmit}>
                                    Set This Goal
                                </button>
                            </div>
                            <div className=" bg-green-200">
                                <BannerSkillsIcons data={selectedGoal} color={bannerColor} isGoalsList={false} />                                
                            </div>

                        </div>

                        <div className="p-6 px-8 font-sf-pro">
                            {/* Tab Navigation */}
                            <div className="flex pb-5">
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
                                <PredefinedGoalOverview goalId={goalId} description={description} jobMarketDemand={jobMarketDemand} minSalaryRange={minSalaryRange} maxSalaryRange={maxSalaryRange} difficultyLevel={difficultyLevel} learningTime={learningTime} />
                            )}

                            {/* Skills Tabs */}
                            {activeTab === "Skills" && (
                                <PredefinedGoalSkills goalId={goalId} />
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
        </div>
    );
};

export default PredefinedGoalDialog;