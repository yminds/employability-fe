import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import InterviewHeader from "./InterviewHeader";
import InterviewList from "./InterviewList";
import arrow from "@/assets/skills/arrow.svg";

const InterviewContainer: React.FC = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const { data: goalData } = useGetGoalsbyuserQuery(userId);

  useEffect(() => {
    if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  // Find the selected goal
  const selectedGoal = goalData?.data.find(
    (goal) => goal._id === selectedGoalId
  );
  const selectedGoalExperienceLevel = selectedGoal
    ? selectedGoal.experience
    : null;

  return (
    <>
      <div className="flex justify-between items-center mb-4 sm:mt-3">
        <div className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackToDashboard}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img
              className="w-[10px] h-[10px]"
              src={arrow || "/placeholder.svg"}
              alt="Back"
            />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">
            Interview
          </h1>
        </div>
      </div>
      <section className="w-full h-[90vh] flex bg-[#F5F5F5] justify-center">
        <div className="flex w-full max-w-[1800px] gap-6 md:flex-col-reverse md:overflow-y-auto md:space-y-6 md:gap-0 md:scrollbar-hide sm:flex-col-reverse sm:overflow-y-auto sm:space-y-6 sm:gap-0 sm:scrollbar-hide sm:scroll-align-top">
          {/* Left Section */}
          <div className="w-full xl:h-full lg:h-full xl:overflow-y-auto 2xl:h-full 2xl:overflow-y-auto lg:overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5] sm:min-w-[200px] sm:relative">
              <InterviewHeader
                userId={userId}
                goals={goalData}
                selectedGoalName={selectedGoal?.name || ""}
                onGoalChange={handleGoalChange}
                selectedGoalExperienceLevel={selectedGoalExperienceLevel}
              />
            </div>
            <div className="mt-[70px] sm:min-w-[100%] space-y-4 overflow-y-auto sm:mt-4">
              <InterviewList goalId={selectedGoalId} />
            </div>
          </div>
          {/* Right Section */}
          <div className="flex-[2.5] w-full space-y-4 sm:my-0">
            <div className="flex flex-col gap-6">
              {/* Add any right sidebar components here */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InterviewContainer;
