import React, { useEffect, useState, useCallback } from "react";
import { useGetUserSkillsQuery } from "@/api/skillsApiSlice";
import SkillsHeader from "@/components/skills/skillsheader";
import SkillList from "@/components/skills/skillslist";
import SuggestedSkills from "@/components/skills/suggestedskills";
import EmployabilityScore from "@/components/skills/employabiltyscore";
import SkillSummary from "@/components/skills/skillssummary";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SkillsContainer: React.FC = () => {
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const { data: skillsData, error, isLoading, refetch } = useGetUserSkillsQuery(userId ?? "");

  // Re-fetch user skills if `isUpdated` is true
  useEffect(() => {
    if (isUpdated) {
      console.log("Fetching updated data.");
      refetch();
      setIsUpdated(false);
    }
  }, [isUpdated, refetch]);

  const handleGoalChange = (goalId: string) => {
    console.log("Selected Goal ID:", goalId);
    // Perform actions based on the selected goal ID
    setSelectedGoalId(goalId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading skills. Please try again later.</div>;

  const skills = skillsData ? skillsData : [];
  

  return (
    <section className="w-full h-full flex bg-[#F5F5F5] justify-center">
      <div className="flex w-full max-w-[1300px] gap-6">
        {/* Left Section */}
        <div className="flex-[7] w-full h-full overflow-y-auto scrollbar-hide">
          {/* Sticky Header */}
          <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5]">
            <SkillsHeader skills={skills} onSkillsStatusChange={setIsUpdated}  onGoalChange={handleGoalChange} />
          </div>
          <div className="mt-[110px]">
            <SkillList isDashboard={false} />
            <SuggestedSkills />
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-[3] w-full space-y-4">
          <EmployabilityScore skills={skills} />
          <SkillSummary isSkillsUpdated={isUpdated} />
        </div>
      </div>
    </section>
  );
};

export default SkillsContainer;
