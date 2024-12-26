import React, { useState } from "react";
import { useGetAllPreDefinedGoalsQuery } from "@/api/predefinedGoalsApiSlice";
import PredefinedGoalDialog from "@/features/dashboard/PredefinedGoalDialog"; // Import GoalFormDialog

interface Goal {
    title: string;
    _id: string;
    name: string;
    description: string;
    image?: string;
    skill_pool_id: string[]; // Array of skill IDs associated with the goal
    predefined_goal_id: string;
}

interface GoalsData {
    data: Goal[]; // Array of Goal objects
}

interface Props {
    isLoading: boolean;
    error: boolean;
    data?: GoalsData; // The data could be undefined if the API request hasn't completed yet
    setJourneyDialog: boolean;
}

const GoalList: React.FC<Props> = (setJourneyDialog:any) => {
    const { data, error, isLoading } = useGetAllPreDefinedGoalsQuery(); // Fetch all predefined goals
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); // State to store selected goal
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

    // Function to open the dialog with selected goal
    const handleGoalClick = (goal: Goal) => {
        setSelectedGoal(goal); // Set the selected goal
        setIsDialogOpen(true); // Open the dialog
    };

    return (
        <div>
            {isDialogOpen && selectedGoal && (
                <PredefinedGoalDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    selectedGoal={selectedGoal} // Pass the selected goal as a prop
                    setJourneyDialog={setJourneyDialog}
                />
            )}

            {/* Grid displaying the list of goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading && <p>Loading trending goals, please wait...</p>}
                {error && <p>Oops! Something went wrong while loading goals.</p>}
                {data?.data?.map((goal: Goal) => (
                    <div
                        key={goal._id}
                        className="rounded-[9px] border border-black/10 bg-[#FCFCFC] hover:border-[#1FD167] cursor-pointer"
                        onClick={() => handleGoalClick(goal)} // Open the dialog with the clicked goal data
                    >
                        <img
                            src={goal.image || "./src/assets/dashboard/jobs_banner.png"}
                            alt={goal.title}
                            className="rounded-tl-[9px] rounded-tr-[9px] w-full"
                        />
                        <div className="flex flex-col p-6 justify-center items-start gap-2 self-stretch">
                            <h3 className="text-gray-800 text-base font-medium leading-5">{goal.title}</h3>
                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide line-clamp-2">{goal.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalList;
