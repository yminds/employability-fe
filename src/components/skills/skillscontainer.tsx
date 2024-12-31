import React, { useEffect, useState } from "react";
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice";
import SkillsHeader from "@/components/skills/skillsheader";
import SkillList from "@/components/skills/skillslist";
import SuggestedSkills from "@/components/skills/suggestedskills";
import EmployabilityScore from "@/components/skills/employabiltyscore";
import SkillSummary from "@/components/skills/skillssummary";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkillsContainer: React.FC = () => {
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const { data: goalData, isLoading: goalLoading } = useGetGoalsbyuserQuery(userId);

  const [getUserSkills, { data: skillsData, isLoading: skillsLoading, isError, error }] =
    useGetUserSkillsMutation();

  useEffect(() => {
    if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

  useEffect(() => {
    if (userId && selectedGoalId) {
      fetchSkills(userId, selectedGoalId);
    }
  }, [userId, selectedGoalId]);

  const fetchSkills = async (userId: string, goalId: string) => {
    try {
      await getUserSkills({ userId, goalId }).unwrap();
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  useEffect(() => {
    if (isUpdated && userId && selectedGoalId) {
      fetchSkills(userId, selectedGoalId);
      setIsUpdated(false);
    }
  }, [isUpdated, userId, selectedGoalId]);

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const renderSkeleton = () => (
    <div className="w-full">
      <Skeleton height={50} width="100%" count={1} className="mb-4" />
      <Skeleton height={120} width="100%" className="mb-4" />
      <Skeleton height={120} width="100%" className="mb-4" />
    </div>
  );

  const skills = skillsData ? skillsData.data : [];

  return (
    <section className="w-full h-full flex bg-[#F5F5F5] justify-center">
      <div className="flex w-full max-w-[1300px] gap-6">
        {/* Left Section */}
        <div className="flex-[7] w-full h-full overflow-y-auto scrollbar-hide">
          <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5]">
            {goalLoading || skillsLoading ? (
              <Skeleton height={80} width="100%" />
            ) : (
              <SkillsHeader
                userId={userId}
                goals={goalData}
                skills={skillsData}
                selectedGoalName={goalData?.data.find((goal) => goal._id === selectedGoalId)?.name || ""}
                onSkillsStatusChange={setIsUpdated}
                onGoalChange={handleGoalChange}
              />
            )}
          </div>
          <div className="mt-[110px]">
            {skillsLoading ? renderSkeleton() : <SkillList isDashboard={false} goalId={selectedGoalId} />}
            {skillsLoading ? renderSkeleton() : <SuggestedSkills />}
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-[3] w-full space-y-4">
          {skillsLoading ? (
            <Skeleton height={200} width="100%" />
          ) : (
            <EmployabilityScore skills={skillsData} />
          )}
          {skillsLoading ? (
            <Skeleton height={300} width="100%" />
          ) : (
            <SkillSummary isSkillsUpdated={isUpdated} />
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsContainer;
