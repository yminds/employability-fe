import React, { useEffect, useState } from "react";
import { useGetAllPreDefinedGoalsQuery } from "@/api/predefinedGoalsApiSlice";
import PredefinedGoalDialog from "./PredefinedGoalDialog"; // Import GoalFormDialog

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
    searchGoals: any[] | undefined;
    displayTitle: boolean;
}

const GoalList: React.FC<Props> = ({ setJourneyDialog, searchGoals, displayTitle }) => {
    const { data: predefinedGoals, error, isLoading } = useGetAllPreDefinedGoalsQuery();
    const [data, setData] = useState<any[]>([]); // State to store the final data
    const [searchTitle, setSearchTitle] = useState("");
    
    useEffect(() => {
        if (searchGoals && searchGoals.data.length > 0) {
            setData(searchGoals);
            setSearchTitle(`${searchGoals.data.length} "Stack" results`);
        }
        else if (searchGoals && searchGoals.data.length == 0) {
            setData([]);
            setSearchTitle("No Goals Found");
        }
        else if (predefinedGoals) {
            setData(predefinedGoals);
            setSearchTitle("All Goals");
        }
    }, [searchGoals, predefinedGoals]);

    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); // State to store selected goal
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

    // Function to open the dialog with selected goal
    const handleGoalClick = (goal: Goal) => {
        setSelectedGoal(goal); // Set the selected goal
        setIsDialogOpen(true); // Open the dialog
    };

    const [hoveredCard, setHoveredCard] = useState(null); // Track the hovered card by ID

    return (
        <>
            {isDialogOpen && selectedGoal && (
                <PredefinedGoalDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    selectedGoal={selectedGoal} // Pass the selected goal as a prop
                    setJourneyDialog={setJourneyDialog}
                />
            )}

            <h5 className={`text-[20px] font-medium leading-[26px] tracking[-0.2px] ${displayTitle ? "" : "hidden"}`}>{searchTitle}</h5>
            
            {/* Grid displaying the list of goals */}
            <div className="grid grid-cols-3 gap-6 w-full">
                {/* Loading and Error States */}
                {isLoading && <p>Loading trending goals, please wait...</p>}
                {error && <p>Oops! Something went wrong while loading goals.</p>}

                {/* Render Goal Cards */}
                {data?.data?.map((goal) => (
                    <div
                        key={goal._id}
                        className="relative cursor-pointer"
                        onMouseEnter={() => setHoveredCard(goal._id)} // Set hovered card ID
                        onMouseLeave={() => setHoveredCard(null)} // Reset hover state
                        onClick={() => handleGoalClick(goal)} // Handle card click
                    >
                        {/* Default Block */}
                        <div className={`inset-0 rounded-[9px] border border-black/10 bg-white transition-opacity duration-300 shadow-sm ${hoveredCard === goal._id ? "opacity-0" : "opacity-100"}`}
                        >
                            {/* Add an Image or Placeholder */}
                            <img
                                src={goal.image || "./src/assets/dashboard/jobs_banner.png"}
                                alt={goal.title}
                                className="rounded-tl-[9px] rounded-tr-[9px] w-full"
                            />

                            <div className="flex flex-col gap-6 p-4 pt-4 pb-4 pl-3 self-stretch">
                                <h3 className="text-[#414447] text-[20px] font-medium leading-[24px] tracking-[0.3px]">{goal.title}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex p-1 px-3 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">₹6L - ₹24L</div>
                                    <div className="flex p-1 px-3.5 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">High Demand</div>
                                    <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-wide">Entry-level</div>
                                    <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">Difficulty: Easy</div>
                                </div>
                            </div>
                        </div>

                        {/* Hovered Block */}
                        <div
                            className={`absolute inset-0 bg-gray-50 rounded-[9px] transition-transform duration-300 flex flex-col p-4 pt-4 pb-4 pl-3 ${hoveredCard === goal._id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                }`}
                        >
                            <h3 className="text-[#414447] leading-[24px] tracking-[0.3px] mb-4">{goal.title}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex p-1 px-3 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">₹6L - ₹24L</div>
                                <div className="flex p-1 px-3.5 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">High Demand</div>
                                <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-wide">Entry-level</div>
                                <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">Difficulty: Easy</div>
                            </div>
                            <div className="mt-10">
                                <button className="py-2 text-sm w-[100px] font-medium text-[#001630] rounded-md border border-solid border-[#001630] float-end absolute end-5 bottom-5">
                                    View Goal
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </>
    );
};

export default GoalList;