import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import ProjectListing from "./project-listing";
import GoalDialog from "@/components/skills/setGoalDialog";
import { ProjectListingSkeleton } from "./project-listing";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import ProjectInsights from "@/components/projects/ProjectInsights";
import UploadProjectSVG from "@/assets/projects/upload-local.svg";
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg";
import backgroundImageSVG from "@/assets/projects/background.svg";

interface Goal {
  _id: string;
  name: string;
  experience?: string;
}

const EmptyProjectState: React.FC<{
  onUploadClick: () => void;
  goalId: string | null;
  userId: string;
  goalDetails: Goal[] | undefined;
  selectedGoalName: string;
}> = ({ onUploadClick, goalId, userId, goalDetails, selectedGoalName }) => (
  <div className="flex h-screen w-full overflow-hidden">
    <div className="flex-1 flex">
      <div className="flex-[7] relative">
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImageSVG}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-ubuntu font-bold text-gray-900">
              No Projects for {selectedGoalName}
            </h1>
            <p className="text-gray-500 text-body2">
              Start building your portfolio by adding your first project.
            </p>
          </div>

          <div className="w-full max-w-md space-y-4">
            <div
              className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onUploadClick}
            >
              <img
                src={UploadProjectSVG || "/placeholder.svg"}
                alt="Upload Project"
                className="w-auto h-auto"
              />
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

      
        {/* <div className="flex-[3] p-6">
          <div className="sticky top-[70px]">
            <ProjectInsights
              goalId={goalId}
              userId={userId}
              goalDetails={goalDetails}
            />
          </div>
        </div> */}

    </div>
  </div>
);

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const navigate = useNavigate();

  const { data: goalData, isLoading: isGoalLoading } = useGetGoalsbyuserQuery(userId);
  const goalDetails = goalData?.data;

  const {
    data: projectsData,
    isLoading: isProjectLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery({
    userId: userId ?? "",
    goalId: selectedGoalId ?? undefined,
  });

  useEffect(() => {
    if (!goalData?.data) {
      return;
    }
    const hasGoals = goalData.data.length > 0;
    
    if (!hasGoals) {
      setIsGoalModalOpen(true);
      return;
    }
    if (selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id);
    }
  }, [goalData, selectedGoalId]);

  const handleModalClose = async () => {
    setIsModalOpen(false);
    await refetchProjects();
  };

  const handleGoalModal = () => {
    setIsGoalModalOpen(false);
    navigate("/");
  };

  if (isGoalLoading || isProjectLoading) {
    return <ProjectListingSkeleton />;
  }

  if (projectsError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading projects. Please try again later.
      </div>
    );
  }

  if (isGoalModalOpen) {
    return <GoalDialog isOpen={isGoalModalOpen} onClose={handleGoalModal} />;
  }

  const selectedGoal = goalData?.data.find((goal) => goal._id === selectedGoalId);
  const selectedGoalName = selectedGoal?.name || "";

  if (!projectsData?.data?.length) {
    return (
      <>
        <ProjectUploadModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          selectedGoalId={selectedGoalId || ""}
          onSuccess={async () => {
            await refetchProjects();
            setIsModalOpen(false);
          }}
        />
        <EmptyProjectState
          onUploadClick={() => setIsModalOpen(true)}
          goalId={selectedGoalId}
          userId={userId || ""}
          goalDetails={goalDetails}
          selectedGoalName={selectedGoalName}
        />
      </>
    );
  }

  return <ProjectListing />;
};

export default ProjectsPage;