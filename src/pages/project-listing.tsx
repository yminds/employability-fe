import React, { useEffect, useState } from "react";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import ProjectCard from "@/components/projects/ProjectCard";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import ProjectDeleteModal from "@/components/projects/modal/ProjectDeleteModal";
import SkillsHeader from "@/components/skills/skillsheader";
import ProjectInsights from "@/components/projects/ProjectInsights";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";


interface Project {
  _id: string;
  name: string;
  description: string;
  tech: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  githubLink: string[];
  liveLink: string;
  thumbnail?: { url: string; fileName: string };
  images?: Array<{ url: string; fileName: string }>;
  synopsisDoc?: { url: string; fileName: string };
  status: "Incomplete" | "In-review" | "Unverified" | "Verified";
  score?: number;
  lastCompletedStep?: number;
}

const ProjectListing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [skillsUpdated, setSkillsUpdated] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const { data: goalData } = useGetGoalsbyuserQuery(userId);

  console.log("goalDetails",goalData?.data)

  const goalDetails = goalData?.data

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery(userId ?? "");

  useEffect(() => {
    if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

  const handleOpenUploadModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
    }
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

  const handleSkillsStatusChange = (isUpdated: boolean) => {
    setSkillsUpdated(isUpdated);
  };

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const selectedGoalName = goalData?.data.find((goal) => goal._id === selectedGoalId)?.name || "";
  const selectedGoalExperience = goalData?.data.find((goal) => goal._id === selectedGoalId)?.experience || null;

  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F5F5]">
      {/* Modals */}
      <ProjectUploadModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        selectedGoalId={selectedGoalId}
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

      {/* Main Content */}
      <div className="h-full flex justify-center">
        <div className="w-full flex gap-6 p-6">
          {/* Left Section - Projects List */}
          <div className="flex-[7] flex flex-col h-full">
            {/* Header with Back Button and Title */}
            <div className="flex justify-between items-center mb-4 sm:mt-3">
              <div className="flex items-center space-x-2 gap-3">
                <button
                  onClick={handleBackToDashboard}
                  className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
                >
                  <img className="w-[10px] h-[10px]" src={arrow || "/placeholder.svg"} alt="Back" />
                </button>
                <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">
                  Projects
                </h1>
              </div>
            </div>

            {/* Goal Selection and Add Project Button */}
            <div className="sticky top-0 bg-[#F5F5F5]  z-10">
              <SkillsHeader
                userId={userId}
                goals={goalData}
                selectedGoalName={selectedGoalName}
                onSkillsStatusChange={handleSkillsStatusChange}
                onGoalChange={handleGoalChange}
                selectedGoalExperienceLevel={selectedGoalExperience}
                hideAddSkillsButton={true}
                onAddCreate={() => handleOpenUploadModal()}
              />
            </div>

            {/* Scrollable Projects List */}
            <div className="mt-[70px] sm:min-w-[100%] sm:mt-4  overflow-y-auto scrollbar-hide">
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="text-center text-gray-500 py-4">Loading projects...</div>
                ) : projectsError ? (
                  <div className="text-center text-red-500 py-4">Error loading projects</div>
                ) : projectsData?.data.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No projects found.
                    <button onClick={() => handleOpenUploadModal()} className="ml-2 text-blue-600 hover:underline">
                      Create your first project
                    </button>
                  </div>
                ) : (
                  projectsData?.data.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onOpenUploadModal={() => handleOpenUploadModal(project)}
                      onOpenDeleteModal={handleOpenDeleteModal}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Project Insights */}
          <div className="flex-[3] w-full space-y-4 sm:mt-0">
            <div className="flex flex-col gap-6">
              <ProjectInsights goalId={selectedGoalId} userId={userId} goalDetails={goalDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListing;
