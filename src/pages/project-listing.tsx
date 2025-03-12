import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import SkillsHeader from "@/components/skills/skillsheader";
import ProjectCard, { ProjectCardSkeleton } from "@/components/projects/ProjectCard";
import ProjectInsights from "@/components/projects/ProjectInsights";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import ProjectDeleteModal from "@/components/projects/modal/ProjectDeleteModal";
import arrow from "@/assets/skills/arrow.svg";
import backgroundImageSVG from "@/assets/projects/background.svg";
import UploadProjectSVG from "@/assets/projects/upload-local.svg";
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg";
import Skeleton from "react-loading-skeleton";

interface Project {
  _id: string;
  name: string;
  description: string;
  tech: {
    _id: string;
    name: string;
    icon: string;
  }[];
  githubLink: string[];
  liveLink: string;
  thumbnail?: string;
  images?: string;
  synopsisDoc?: string;
  synopsis?: string;
  status: string;
  score?: number;
  lastCompletedStep?: number;
}

// Skeleton component for the project listings content
export const ProjectContentSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton component for the project insights panel
export const ProjectInsightsSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-lg p-4">
      <Skeleton height={40} className="mb-4" />
      <Skeleton count={3} height={60} className="mb-2" />
      <Skeleton width={150} height={30} />
    </div>
  );
};

// Full page skeleton for initial loading
export const ProjectListingSkeleton = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F5F5]">
      <div className="flex justify-between items-center mt-5 ml-12">
        <div className="flex items-center gap-3">
          <Skeleton circle width={30} height={30} />
          <Skeleton width={80} height={26} />
        </div>
      </div>

      <section className="w-full h-[calc(100vh-2rem)] bg-[#F5F5F5]">
        <div className="h-full flex justify-center mx-6">
          <div className="w-full max-w-[1800px] flex gap-6 p-6 md:flex-col-reverse sm:flex-col-reverse">
            <div className="xl:flex-[7] 2xl:flex-[7] lg:flex-[7] flex flex-col h-full">
              <div className="sticky top-0 left-0 z-10 bg-[#F5F5F5] sm:relative">
                <div className="flex items-center justify-between">
                  <Skeleton width={200} height={40} />
                  <Skeleton width={120} height={40} />
                </div>
              </div>

              <div className="mt-[70px] sm:mt-4 overflow-y-auto scrollbar-hide">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-[2] w-[350px] space-y-4">
              <div className="flex sticky top-[70px] md:relative md:top-0 sm:relative sm:top-0">
                <div className="w-full bg-white rounded-lg p-4">
                  <Skeleton height={40} className="mb-4" />
                  <Skeleton count={3} height={60} className="mb-2" />
                  <Skeleton width={150} height={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Empty state component
const EmptyState: React.FC<{
  selectedGoalName: string;
  onUploadClick: () => void;
}> = ({ selectedGoalName, onUploadClick }) => (
  <div className="relative flex flex-col items-center justify-center min-h-[80vh] p-8">
    <div className="absolute inset-0 z-0">
      <img src={backgroundImageSVG} alt="" className="w-full h-full object-cover opacity-50" />
    </div>

    <div className="relative z-10 text-center space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-ubuntu text-gray-900 mb-2">No Projects Yet for {selectedGoalName}</h1>
        <p className="text-gray-600">Start showcasing your skills by adding your first project.</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity" onClick={onUploadClick}>
          <img src={UploadProjectSVG || "/placeholder.svg"} alt="Upload Project" className="w-auto h-auto" />
        </div>

        <div className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity">
          <img
            src={GetProjectFromMentorSVG || "/placeholder.svg"}
            alt="Get Project from Mentor"
            className="w-auto h-auto"
          />
        </div>
      </div>
    </div>
  </div>
);

// Main ProjectListing component
const ProjectListing = () => {
  const navigate = useNavigate();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [skillsUpdated, setSkillsUpdated] = useState(false);
  const [isChangingGoal, setIsChangingGoal] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const { data: goalData, isLoading: goalsLoading } = useGetGoalsbyuserQuery(userId);
  const goalDetails = goalData?.data;

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery({
    userId: userId ?? "",
    goalId: selectedGoalId ?? undefined,
  });

  // setting the shoudPoll state of any project is "in-review"
  useEffect(() => {
    if (projectsData?.data.some((project) => project.status === "In-review")) {
      setShouldPoll(true);
    } else {
      setShouldPoll(false);
    }
  }, [projectsData]);

  // Polling the projects every 5 seconds if any project is "in-review"
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (shouldPoll) {
      interval = setInterval(() => {
        refetchProjects();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [shouldPoll, refetchProjects]);

  useEffect(() => {
    if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

  useEffect(() => {
    if (selectedGoalId) {
      setIsChangingGoal(true);
      const timer = setTimeout(() => {
        setIsChangingGoal(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedGoalId]);

  const handleOpenUploadModal = (project?: Project) => {
    setSelectedProject(project || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    await refetchProjects();
  };

  const handleOpenDeleteModal = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = async () => {
    setProjectToDelete(null);
    setIsDeleteModalOpen(false);
    await refetchProjects();
  };

  const handleGoalChange = (goalId: string) => {
    if (goalId !== selectedGoalId) {
      setIsChangingGoal(true);
      setSelectedGoalId(goalId);
    }
  };

  const handleBackToDashboard = () => {
    navigate(-1);
  };

  // Only show full page skeleton during initial goals loading
  if (goalsLoading) {
    return <ProjectListingSkeleton />;
  }

  const selectedGoal = goalData?.data.find((goal) => goal._id === selectedGoalId);
  const selectedGoalName = selectedGoal?.name || "";
  const selectedGoalExperience = selectedGoal?.experience || null;

  return (
    <div className="w-[95%] h-screen overflow-hidden max-w-[1800px] p-5 bg-[#F5F5F5] mx-auto">
      <div className="w-full max-w-screen-xl flex flex-col gap-6">
        <ProjectUploadModal
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          selectedGoalId={selectedGoalId || ""}
          existingProject={selectedProject}
          onSuccess={async () => {
            await refetchProjects();
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />

        {projectToDelete && (
          <ProjectDeleteModal
            open={isDeleteModalOpen}
            onOpenChange={handleCloseDeleteModal}
            projectId={projectToDelete}
            onSuccess={async () => {
              await refetchProjects();
              setIsDeleteModalOpen(false);
              setProjectToDelete(null);
            }}
          />
        )}

        <section className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackToDashboard}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.025rem]">
            Projects
          </h1>
        </section>

        <section className="w-full h-[calc(100vh-2rem)]">
          <div className="h-full flex justify-center">
            <div className="w-full flex gap-6 md:flex-col-reverse sm:flex-col-reverse">
              <div className="xl:flex-[7] 2xl:flex-[7] lg:flex-[7] flex flex-col h-full">
                <div className="sticky top-0 left-0 z-10 sm:relative">
                  {goalData && (
                    <SkillsHeader
                      userId={userId}
                      goals={goalData}
                      selectedGoalName={selectedGoalName}
                      onSkillsStatusChange={setSkillsUpdated}
                      onGoalChange={handleGoalChange}
                      selectedGoalExperienceLevel={selectedGoalExperience}
                      hideAddSkillsButton={true}
                      onAddCreate={() => handleOpenUploadModal()}
                    />
                  )}
                </div>

                <div className="mt-[70px] mb-[50px] sm:mt-4 overflow-y-auto scrollbar-hide">
                  {projectsError ? (
                    <div className="text-center text-red-500 py-4">Error loading projects</div>
                  ) : projectsLoading || isChangingGoal ? (
                    <ProjectContentSkeleton />
                  ) : !projectsData?.data.length ? (
                    <EmptyState selectedGoalName={selectedGoalName} onUploadClick={() => handleOpenUploadModal()} />
                  ) : (
                    <div className="space-y-4">
                      {projectsData.data.map((project) => (
                        <ProjectCard
                          key={project._id}
                          project={project}
                          onOpenUploadModal={() => handleOpenUploadModal(project)}
                          onOpenDeleteModal={handleOpenDeleteModal}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-[2] w-[30%] space-y-4">
                <div className="flex sticky md:relative md:top-0 sm:relative sm:top-0">
                  {projectsLoading || isChangingGoal ? (
                    <ProjectInsightsSkeleton />
                  ) : (
                    <ProjectInsights goalId={selectedGoalId || ""} userId={userId || ""} goalDetails={goalDetails} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectListing;
