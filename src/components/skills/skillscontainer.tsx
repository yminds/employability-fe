import React, { useEffect, useState } from "react";

import SkillsHeader from "@/components/skills/skillsheader";
import SkillList from "@/components/skills/skillslist";
import SuggestedSkills from "@/components/skills/suggestedskills";
import EmployabilityScore from "@/components/skills/employabiltyscore";
import SkillSummary from "@/components/skills/skillssummary";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import GoalDialog from "@/components/skills/setGoalDialog";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";

const SkillsContainer: React.FC = () => {
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const user = useSelector((state: RootState) => state.auth.user);
  const goals = user?.goals;
  console.log("User", user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data: goalData, } = useGetGoalsbyuserQuery(userId);
  
  useEffect(() => {
    if(goals && goals?.length === 0) {
      setIsModalOpen(true);
      console.log("Goaldata", goalData)
    }
    else if (goals?.length && selectedGoalId === null) {
      setSelectedGoalId(goals?.[0]._id);
    }
  }, [goals, selectedGoalId]);

  useEffect(() => {
    if (isUpdated && selectedGoalId) {
      setIsUpdated(false);
    }
  }, [isUpdated, selectedGoalId]);

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const handleGoalModal = () => {
    setIsModalOpen(false);
    setIsUpdated(true);
    navigate("/"); 
  };


  const handleBackToDashboard = () => {
    navigate("/"); // Navigate to the dashboard page
  };
  
  // Find the selected goal
  const selectedGoal = goals?.find((goal) => goal._id === selectedGoalId);
  const selectedGoalExperienceLevel = selectedGoal ? selectedGoal.experience : null;

  return (
    (isModalOpen) ? <GoalDialog isOpen={isModalOpen} onClose={handleGoalModal} /> : (
      <>
        <div className="flex justify-between items-center mb-4 sm:mt-3">
          <div className="flex items-center space-x-2 gap-3">
            <button
              onClick={handleBackToDashboard}
              className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
            >
              <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
            </button>
            <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">
              Skills
            </h1>
          </div>
        </div>
        <section className="w-full h-[90vh] flex bg-[#F5F5F5] justify-center">
          <div className="flex w-full max-w-[1800px] gap-6 md:flex-col-reverse md:overflow-y-auto md:space-y-6 md:gap-0 md:scrollbar-hide  sm:flex-col-reverse sm:overflow-y-auto sm:space-y-6 sm:gap-0 sm:scrollbar-hide  sm:scroll-align-top">
            {/* Left Section */}
            <div className="xl:flex-[7.5] 2xl:flex-[7] lg:flex-[7] w-full xl:h-full lg:h-full xl:overflow-y-auto 2xl:h-full 2xl:overflow-y-auto lg:overflow-y-auto scrollbar-hide">
              <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5] sm:min-w-[200px] sm:relative">
                <SkillsHeader
                  userId={userId}
                  goals={goalData}
                  selectedGoalName={selectedGoal?.name || ""}
                  onSkillsStatusChange={setIsUpdated}
                  onGoalChange={handleGoalChange}
                  selectedGoalExperienceLevel={selectedGoalExperienceLevel} // Pass experience level
                />
              </div>
              <div className="mt-[70px] sm:min-w-[100%] space-y-4 overflow-y-auto sm:mt-4">
                <SkillList isDashboard={false} goalId={selectedGoalId} onSkillsUpdate={setIsUpdated} isSkillsUpdated={isUpdated}  goals={goalData} selectedGoalName={selectedGoal?.name || ""}/>
                <SuggestedSkills userId={userId} goalId={selectedGoalId} onSkillsUpdate={setIsUpdated} isSkillsUpdated={isUpdated} goals={goalData}/>
              </div>
            </div>
            {/* Right Section */}
            <div className="flex-[2.5] w-full space-y-4 sm:my-0 ">
              <div className="flex flex-col gap-6">
                <EmployabilityScore 
                  goalId={selectedGoal?._id || ""}
                  goalName={selectedGoal?.name || ""}
                  isSkillsUpdated={isUpdated}
                />
                <SkillSummary
                  isSkillsUpdated={isUpdated}
                  selectedGoalId={selectedGoal?._id || ""}
                />
              </div>
            </div>
          </div>
        </section>
      </>
    )
  );
};

export default SkillsContainer;
