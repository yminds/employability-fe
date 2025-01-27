import React, { useEffect, useState } from "react";
import { useGetAllPreDefinedGoalsQuery, useFilterGoalsMutation } from "@/api/predefinedGoalsApiSlice";
import PredefinedGoalDialog from "./PredefinedGoalDialog";
import GoalListSkeleton from "./GoalListSkeleton";
import { useLocation } from "react-router-dom";
import GoalsBanner from "@/components/setgoals/GoalsBanner";

interface Goal {
    title: string;
    _id: string;
    name: string;
    description: string;
    image?: string;
    skill_pool_id: string[];
    predefined_goal_id: string;
    job_market_demand: string;
    min_salary_range: number;
    max_salary_range: number;
    difficulty_level: string;
    learning_time: string;
    experience_level: string;
}

interface GoalsData {
    data: Goal[];
}

interface Props {
    isLoading: boolean;
    error: boolean;
    data?: GoalsData;
    setJourneyDialog: boolean;
    searchGoals: GoalsData | undefined;
    displayTitle: boolean;
    filters: any;
}

const jobsMarketDemandObj = { 1: "High", 2: "Mid", 3: "Low" };
const experienceLevelObj = { 1: "Entry-level", 2: "Mid-level", 3: "Senior-level" };
const difficultyLevelObj = { 1: "Easy", 2: "Medium", 3: "High" };

const colorPalette = [
    '#D89AFC', '#AA9AFC',  '#7BB0FF', '#FC9A9C', '#7DFDB1', '#FECF7D', '#B4B4B5', '#FF878F', '#DFF794', '#9AFCD5', '#9AEDFC', '#FC9AD3',
];

const GoalList: React.FC<Props> = ({ setJourneyDialog, searchGoals, displayTitle, filters }) => {
    const { data: allGoals, error: fetchError } = useGetAllPreDefinedGoalsQuery() as { data: GoalsData | undefined, error: any, isLoading: boolean };
    const [fetchFilteredGoals, { isLoading: isFetchingFilteredGoals }] = useFilterGoalsMutation();

    const [data, setData] = useState<any[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [bannerColors, setBannerColors] = useState<string[]>([]);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const location = useLocation();
    const isSetGoalsPage = location.pathname === "/setgoal";

    useEffect(() => {
        const fetchData = async () => {
            if (filters && Object.keys(filters).length > 0) {
                try {
                    const filteredGoals = await fetchFilteredGoals(filters).unwrap();
                    if (filteredGoals?.data && filteredGoals.data.length > 0) {
                        setData(filteredGoals.data);
                        setSearchTitle("");
                    } else {
                        setData([]);
                        setSearchTitle("No Goals Found");
                    }
                } catch (err) {
                    console.error("Error fetching filtered goals:", err);
                    setData([]);
                    setSearchTitle("Error Fetching Goals");
                }
            } else if (allGoals?.data) {
                setData(allGoals.data);
                setSearchTitle("");
            }
        };

        fetchData();
    }, [filters, allGoals, fetchFilteredGoals]);

    useEffect(() => {
        if (searchGoals && searchGoals.data.length > 0) {
            setData(searchGoals.data);
            setSearchTitle(`${searchGoals.data.length} results`);
        } else if (searchGoals && searchGoals.data.length === 0) {
            setData([]);
            setSearchTitle("No Goals Found");
        } else if (allGoals) {
            setData(allGoals.data);
            setSearchTitle("");
        }
    }, [searchGoals, allGoals]);

    useEffect(() => {
        if (data.length > 0) {
            const colors = data.map((_, index) => colorPalette[index % colorPalette.length]);
            setBannerColors(colors);
        }
    }, [data]);

    const handleGoalClick = (goal: Goal) => {
        setSelectedGoal(goal);
        setIsDialogOpen(true);
    };

    return (
        <>
            {isDialogOpen && selectedGoal && (
                <PredefinedGoalDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    selectedGoal={selectedGoal}
                    setJourneyDialog={setJourneyDialog}
                    isSetGoalsPage={isSetGoalsPage}
                    bannerColor={bannerColors[data.findIndex(goal => goal._id === selectedGoal._id)] || colorPalette[0]}
                />
            )}

            <h5 className={`text-[20px] font-medium leading-[26px] tracking[-0.2px] ${displayTitle ? "" : "hidden"}`}>{searchTitle}</h5>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                {isFetchingFilteredGoals && <GoalListSkeleton />}
                {!isFetchingFilteredGoals && fetchError && <p>Oops! Something went wrong while loading goals.</p>}

                {!isFetchingFilteredGoals && data?.map((goal, index) => (
                    <div
                        key={goal._id}
                        className="relative cursor-pointer"
                        onMouseEnter={() => setHoveredCard(goal._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => handleGoalClick(goal)}
                    >
                        <div
                            className={`inset-0 rounded-[9px] border border-black/10 bg-white transition-opacity h-full duration-300 shadow-sm ${hoveredCard === goal._id ? "opacity-0" : "opacity-100"}`}
                        >
                            <GoalsBanner
                                className="rounded-tl-[9px] rounded-tr-[9px] w-full h-[90px] object-cover relative"
                                data={goal}
                                color={bannerColors[index] || colorPalette[0]}
                                isGoalsList={true}
                            />

                            <div className="flex flex-col gap-6 p-4 pt-4 pb-4 pl-3 self-stretch">
                                <h3 className="text-[#414447] text-[20px] font-medium leading-[24px] tracking-[0.3px]">{goal.title}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex p-1 px-3 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                                        {formatSalaryRange(goal.min_salary_range, goal.max_salary_range)}
                                    </div>
                                    <div className="flex p-1 px-3.5 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                                        {jobsMarketDemandObj[goal.job_market_demand as keyof typeof jobsMarketDemandObj]}
                                    </div>
                                    <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-wide">
                                        {experienceLevelObj[goal.experience_level as keyof typeof experienceLevelObj]}
                                    </div>
                                    <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                                        Difficulty: {difficultyLevelObj[goal.difficulty_level as keyof typeof difficultyLevelObj]}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Hovered Block */}
                        <div
                            className={`absolute inset-0 bg-gray-50 rounded-[9px] transition-transform duration-300 flex flex-col p-4 pt-4 pb-4 pl-3 ${hoveredCard === goal._id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            <h3 className="text-[#414447] leading-[24px] tracking-[0.3px] mb-4">{goal.title}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex p-1 px-3 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                                    {formatSalaryRange(goal.min_salary_range, goal.max_salary_range)}
                                </div>
                                <div className="flex p-1 px-3.5 justify-center items-center gap-2.5 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                                    {jobsMarketDemandObj[goal.job_market_demand as keyof typeof jobsMarketDemandObj]}
                                </div>
                                <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-wide">
                                    {experienceLevelObj[goal.experience_level as keyof typeof experienceLevelObj]}
                                </div>
                                <div className="flex p-1 px-3 justify-center items-center gap-2 rounded bg-[rgba(234,235,237,0.80)] text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                                    Difficulty: {difficultyLevelObj[goal.difficulty_level as keyof typeof difficultyLevelObj]}
                                </div>
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

const formatSalaryRange = (minSalary: number, maxSalary: number) => {
    const formatToLakh = (amount: number) => `₹${(amount / 100000).toFixed(0)}L`;
    return `${formatToLakh(minSalary)} - ${formatToLakh(maxSalary)}`;
};
