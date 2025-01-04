import React, { useEffect, useState } from 'react';
import GoalList from "./GoalList";
import GoalFormDialog from "./GoalFormDialog";
import { useGetSearchGoalQuery } from "@/api/predefinedGoalsApiSlice";
import SetGoalFilter from './SetGoalFilter';
import ExperienceComponent from './ExperienceComponent';

interface Goal {
    title: string;
    _id: string;
    name: string;
    description: string;
    image?: string;
    skill_pool_id: string[]; // Array of skill IDs associated with the goal
    predefined_goal_id: string;
}

const SetGoalCard: React.FC<{ setJourneyDialog: any; }> = ({ setJourneyDialog }) => {
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); // State to store selected goal
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

    const handleLinkClick = () => {
        setSelectedGoal(null); // Set the selected goal
        setIsDialogOpen(true); // Open the dialog
    };

    const [searchGoal, setSearchGoal] = useState("");
    const [callAPI, setCallAPI] = useState(false);
    const { data: searchGoals } = useGetSearchGoalQuery(searchGoal, {
        skip: !callAPI,
    });

    useEffect(() => {
        if (searchGoal.trim() === "") {
            setCallAPI(false); // Don't call API for empty search
        }
        else {
            setCallAPI(true); // Call API when there's a valid search term
        }
    }, [searchGoal]);

    return <>
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 flex flex-col gap-6 shrink-0 border-r max-h-[80vh] overflow-y-auto minimal-scrollbar">
                <SetGoalFilter />
            </div>

            {/* Goals */}
            <div className="col-span-3 flex flex-col items-start gap-6 flex-1 max-h-[80vh] overflow-y-auto minimal-scrollbar">
                <div className="flex items-center gap-5 self-stretch relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <img src="./src/assets/set-goal/mail.svg" alt="Search" />
                    </span>
                    <input
                        type="text"
                        id="tech-stack"
                        placeholder="Search"
                        value={searchGoal}
                        onChange={(e) => setSearchGoal(e.target.value)}
                        autoComplete="off"
                        className="flex h-[50px] p-2 px-12 justify-between items-center flex-[1_0_0] rounded-[6px] border border-black/10 bg-[#FAFBFE] focus:outline-none"
                    />
                    <button className="flex p-3 px-6 py-3 gap-3 rounded bg-[#00183D] hover:bg-[#062549] text-white text-base font-medium leading-6 font-sf-pro" onClick={() => handleLinkClick()}>
                        <img
                            src="./src/assets/dashboard/add.svg"
                            className="w-3 h-3 mt-1"
                        />
                        Create Custom Goal</button>
                    {isDialogOpen && (
                        <GoalFormDialog
                            isOpen={isDialogOpen}
                            setIsOpen={setIsDialogOpen}
                            selectedGoal={selectedGoal}
                            setJourneyDialog={setJourneyDialog}
                        />
                    )}
                </div>

                <section className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex flex-start gap-2.5">
                        {ExperienceComponent({ selectedOption: "Entry Level" })}
                    </div>

                    <GoalList isLoading={false} error={false} setJourneyDialog={setJourneyDialog} searchGoals={searchGoals} displayTitle={true} />
                </section>
            </div>
        </div>
    </>
};

export default SetGoalCard;