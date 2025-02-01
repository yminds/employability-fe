import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import ProjectListing from "./project-listing";
import ProjectInsights from "@/components/projects/ProjectInsights";
import GoalDialog from "@/components/skills/setGoalDialog";
import UploadProjectSVG from "@/assets/projects/upload-local.svg";
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg";
import backgroundImageSVG from "@/assets/projects/background.svg";

// Types
interface Tech {
  _id: string;
  name: string;
  icon: string;
}

interface Goal {
  _id: string;
  name: string;
  experience?: string;
}

interface GoalResponse {
  data: Goal[];
}

interface ProjectResponse {
  data: Project[];
}

interface Project {
  _id: string;
  name: string;
  description: string;
  tech: Tech[];
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

export const ProjectListingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F5F5]">
      <div className="h-full flex justify-center">
        <div className="w-full flex gap-6 p-6">
          <div className="flex-[7] flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 sm:mt-3">
              <div className="flex items-center space-x-2 gap-3">
                <Skeleton circle width={30} height={30} />
                <Skeleton width={100} height={26} />
              </div>
            </div>
            
            <div className="sticky top-0 bg-[#F5F5F5] z-10">
              <Skeleton height={50} />
            </div>

            <div className="mt-[70px] sm:min-w-[100%] sm:mt-4 overflow-y-auto scrollbar-hide">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-full h-48 bg-white rounded-lg shadow">
                    <Skeleton height="100%" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-[3] w-full space-y-4">
            <div className="flex flex-col gap-6 sticky top-[70px]">
              <Skeleton height={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyProjectState: React.FC<{
  onUploadClick: () => void;
  goalId: string | null;
  userId: string;
  goalDetails: Goal[] | undefined;
}> = ({ onUploadClick, goalId, userId, goalDetails }) => (
  <div className="flex h-screen w-full overflow-hidden">
    <div className="flex-1 flex">
      <div className="flex-[7] relative">
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImageSVG || "/placeholder.svg"}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-ubuntu font-bold text-gray-900">
              No Projects Yet
            </h1>
            <p className="text-gray-500 font-sf-pro">
              Start showcasing your skills by adding your first project.
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
      {/* {goalId && goalDetails && (
        <div className="flex-[3] p-6">
          <div className="sticky top-[70px]">
            <ProjectInsights
              goalId={goalId}
              userId={userId}
              goalDetails={goalDetails}
            />
          </div>
        </div>
      )} */}
    </div>
  </div>
);

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const navigate = useNavigate();

  const { data: goalData, isLoading: isGoalLoading } = useGetGoalsbyuserQuery(userId) as {
    data?: GoalResponse;
    isLoading: boolean;
  };
  const goalDetails = goalData?.data;

  const {
    data: projectsData,
    isLoading: isProjectLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery(userId ?? "");

  useEffect(() => {
    if (goalData?.data && Array.isArray(goalData.data)) {
      if (goalData.data.length === 0) {
        setIsGoalModalOpen(true);
      } else if (goalData.data.length > 0 && selectedGoalId === null) {
        setSelectedGoalId(goalData.data[0]._id);
      }
    }
  }, [goalData, selectedGoalId]);

  const handleModalClose = async () => {
    setIsModalOpen(false);
    await refetchProjects();
  };

  const handleProjectSuccess = async () => {
    await refetchProjects();
    setIsModalOpen(false);
  };

  const handleGoalModal = () => {
    setIsGoalModalOpen(false);
    navigate("/projects");
  };

  // Show loading skeleton while either goals or projects are loading
  if (isGoalLoading || isProjectLoading) {
    return <ProjectListingSkeleton />;
  }

  if (projectsError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading projects
      </div>
    );
  }

  if (isGoalModalOpen) {
    return <GoalDialog isOpen={isGoalModalOpen} onClose={handleGoalModal} />;
  }

  if (projectsData?.data && Array.isArray(projectsData.data) && projectsData.data.length > 0) {
    return <ProjectListing />;
  }

  return (
    <>
      <ProjectUploadModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={handleProjectSuccess}
        selectedGoalId={selectedGoalId || ""}
      />
      <EmptyProjectState
        onUploadClick={() => setIsModalOpen(true)}
        goalId={selectedGoalId}
        userId={userId || ""}
        goalDetails={goalDetails}
      />
    </>
  );
};

export default ProjectsPage;