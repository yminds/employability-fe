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
import flags from "react-phone-number-input/flags";

const SkillsContainer: React.FC = () => {
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: goalData, isLoading: goalLoading } = useGetGoalsbyuserQuery(userId);
  
  useEffect(() => {
    if(goalData?.data && goalData.data.length === 0) {
      setIsModalOpen(true);
    }
    else if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

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
  };

  return (
    (isModalOpen) ? <GoalDialog isOpen={isModalOpen} onClose={handleGoalModal} /> :(
    <section className="w-full h-full flex bg-[#F5F5F5] justify-center">
      <div className="flex w-full max-w-[1300px] gap-6">
        {/* Left Section */}
        <div className="flex-[7] w-full h-full overflow-y-auto scrollbar-hide">
          <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5]">
            <SkillsHeader
              userId={userId}
              goals={goalData}
              selectedGoalName={goalData?.data.find((goal) => goal._id === selectedGoalId)?.name || ""}
              onSkillsStatusChange={setIsUpdated}
              onGoalChange={handleGoalChange}
            />
          </div>
          <div className="mt-[110px]">
            <SkillList isDashboard={false} goalId={selectedGoalId} isSkillsUpdated={isUpdated}/>
            <SuggestedSkills />
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-[3] w-full space-y-4">
          <div className=" flex flex-col gap-6" >
          <EmployabilityScore 
              goalId={goalData?.data.find((goal) => goal._id === selectedGoalId)?._id || ""}
              goalName={goalData?.data.find((goal) => goal._id === selectedGoalId)?.name || ""}
              isSkillsUpdated={isUpdated}
            />
            <SkillSummary
              isSkillsUpdated={isUpdated}
              selectedGoalId={goalData?.data.find((goal) => goal._id === selectedGoalId)?._id || ""}
            />
          </div>
        </div>
      </div>
    </section>)
  );
};

export default SkillsContainer;
