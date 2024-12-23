import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllPreDefinedGoalsQuery } from "@/api/predefinedGoalsApiSlice";

interface Goal {
    _id: string
    name: string
    description: string
    image?: string
}

interface GoalsData {
    data: Goal[] // Array of Goal objects
}

interface Props {
    isLoading: boolean
    error: boolean
    data?: GoalsData // The data could be undefined if the API request hasn't completed yet
}

const GoalList: React.FC<Props> = () => {
    const { data, error, isLoading } = useGetAllPreDefinedGoalsQuery(); // Fetch all predefined goals
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
    }, [data, error, isLoading]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading && <p>Loading trending goals, please wait...</p>}
            {error && <p>Oops! Something went wrong while loading goals.</p>}
            {data?.data?.map((goal: any) => (
                <div
                    key={goal._id}
                    className="rounded-[9px] border border-black/10 bg-[#FCFCFC] hover:border-[#1FD167] cursor-pointer"
                    onClick={() => navigate(`/goals/${goal._id}`)}
                >
                    <img
                        src={goal.image || "./src/assets/dashboard/jobs_banner.png"}
                        alt={goal.title}
                        className="rounded-e-none-[9px] rounded-s-none-[9px] w-full"
                    />
                    <div className="flex flex-col p-6 justify-center items-start gap-2 self-stretch">
                        <h3 className="text-gray-800 text-base font-medium leading-5">
                            {goal.title}
                        </h3>
                        <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">
                            {goal.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GoalList;
