import React, { useEffect, useState } from "react";
import SkillsHeader from "@/components/skills/skillsheader";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProjectCard from "@/components/projects/ProjectCard";
import { useGetProjectsByUserIdQuery } from "@/api/projectsApiSlice";

const ProjectListing: React.FC = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const { data: goalData, isLoading: goalLoading } =
    useGetGoalsbyuserQuery(userId);
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useGetProjectsByUserIdQuery(userId);

  useEffect(() => {
    if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  return (
    <section className="w-full h-full flex bg-[#F5F5F5] justify-center">
      <div className="flex w-full max-w-[1300px] gap-6">
        {/* Left Section */}
        <div className="flex-[7] w-full h-full overflow-y-auto scrollbar-hide ms-7 ps-6 mt-5">
          <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5]">
            <SkillsHeader
              userId={userId}
              goals={goalData}
              selectedGoalName={
                goalData?.data.find((goal) => goal._id === selectedGoalId)
                  ?.name || ""
              }
              onSkillsStatusChange={setIsUpdated}
              onGoalChange={handleGoalChange}
            />
          </div>
          <div className="mt-[110px] space-y-4">
            {projectsLoading ? (
              <div>Loading projects...</div>
            ) : projectsError ? (
              <div>Error loading projects</div>
            ) : (
              projectsData?.data.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-[3] w-full space-y-4">
          {/* Your right sidebar content will go here */}
        </div>
      </div>
    </section>
  );
};

export default ProjectListing;
