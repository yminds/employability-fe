import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import ReviewModal from "./modal/ReviewMessageModal";
import verifyImg from "@/assets/skills/verified.svg";
import unVerifyImg from "@/assets/skills/unverifies.svg";
import clockLoader from "@/assets/skills/clock_loader.svg";
import alertCircle from "@/assets/projects/alertCircle.svg";
import SuccessModal from "./modal/steps/SuccessModal";
import { useCreateInterview } from "@/hooks/useCreateInterview";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

interface Tech {
  _id: string;
  name: string;
  icon: string;
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
  status: ProjectStatus;
  score?: number;
  lastCompletedStep?: number;
  goal_id?: string;
  latest_interview_status?: {
    interview_id: string;
    isCompleted: boolean;
  };
}

type ProjectStatus = "Verified" | "In-review" | "Unverified" | "Incomplete";

interface ProjectCardProps {
  project: Project;
  onOpenUploadModal?: (project: Project) => void;
  onOpenDeleteModal?: (projectId: string) => void;
  isDashboard?: boolean;
  isPublic?: boolean;
}

export const ProjectCardSkeleton = () => (
  <Card className="flex flex-col items-start gap-7 p-5 pr-8 pb-7 bg-white rounded-lg border border-black/10 self-stretch mb-4 sm:p-4">
    <div className="animate-pulse flex items-start gap-5 w-full md:flex-col sm:flex-col">
      <div className="bg-gray-200 w-[150px] h-[100px] rounded md:w-full sm:w-full md:h-[200px] sm:h-[200px]" />
      <div className="flex-1 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-16" />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenUploadModal,
  onOpenDeleteModal,
  isDashboard = false,
  isPublic = false,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { createInterview } = useCreateInterview();

  const navigate = useNavigate();

  const handleIncompleteClick = () => {
    if (project?.status === "Incomplete" && onOpenUploadModal) {
      onOpenUploadModal(project);
    }
  };

  const handleViewStatusClick = () => {
    setIsReviewModalOpen(true);
    setIsSuccessModalOpen(true);
  };
  const getStatusConfig = (status: ProjectStatus) => {
    const configs = {
      Verified: {
        icon: verifyImg,
        color: "text-green-600",
        text: "Verified",
      },
      "In-review": {
        icon: clockLoader,
        color: "text-blue-600",
        text: "In Review",
      },
      Unverified: {
        icon: unVerifyImg,
        color: "text-yellow-600",
        text: "Unverified",
      },
      Incomplete: {
        icon: alertCircle,
        color: "text-red-600",
        text: "Incomplete",
      },
    };

    return configs[status] || configs.Incomplete;
  };

  const getActionConfig = (status: ProjectStatus) => {
    const configs = {
      Verified: "Improve score",
      "In-review": "view status",
      Unverified: "Verify Project",
      Incomplete: "Complete Project",
    };

    return configs[status] || "";
  };

  const config = getStatusConfig(project.status);

  const handleVerifyProject = async () => {
    const interviewId = await createInterview({
      title: `project Interview`,
      type: "Project",
      project_id: project._id,
    });

    navigate(`/interview/${interviewId}`, {
      state: {
        title: project?.name || "Project Interview",
        level: user?.experience_level,
        type: "Project",
        projectId: project._id,
      },
    });
  };

  console.log("project", project);

  const handleViewProject = () => {
    if (!project.latest_interview_status?.interview_id) {
      return;
    }
    if (!project.latest_interview_status.isCompleted) {
      return toast.error("Interview is not completed yet");
    }
    navigate(`/project/report/${project.latest_interview_status.interview_id}`, {
      state: {
        best_interview: project.latest_interview_status.interview_id,
        fromInterviewCard: true,
        thread_id: "",
      },
    });
  };

  return (
    <Card
      className={`flex flex-col items-start p-0 bg-white rounded-lg ${
        !isDashboard ? "border border-black/10 p-6" : ""
      } self-stretch mb-4`}
    >
      <div className="flex items-start gap-5 w-full md:flex-col sm:flex-col">
        {project.thumbnail && (
          <div className="relative w-[150px] h-[100px] bg-[#fcfcfc] rounded overflow-hidden md:w-full sm:w-full md:h-[200px] sm:h-[200px]">
            <img
              src={project.thumbnail || "/placeholder.svg"}
              alt={`${project.name} Thumbnail`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-1 md:flex-col sm:flex-col md:gap-4 sm:gap-4 md:w-full sm:w-full md:items-start sm:items-start">
          <div className="flex flex-col gap-4 md:w-full sm:w-full">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-[#1f2226] text-sub-header">{project.name}</h2>
              {/* 3-dot menu for mobile */}
              {(project.githubLink?.length > 0 || project.liveLink) && (
                <div className="hidden md:block sm:block">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-[#000000] focus:outline-none">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0">
                      <div className="py-1">
                        {project.githubLink?.length > 0 && (
                          <a
                            href={project.githubLink[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-body2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          >
                            View GIT repo
                          </a>
                        )}
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-body2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          >
                            Live link
                          </a>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            {project.tech?.length > 0 && (
              <div className="flex w-[200px] md:w-full sm:w-full">
                <div className="flex gap-2 flex-wrap">
                  {project.tech.slice(0, 3).map((tech) => (
                    <Badge
                      key={tech._id}
                      variant="secondary"
                      className="px-[6px] bg-[#ebebeb] rounded-full flex items-center justify-center "
                    >
                      <span className="text-black text-[14px] leading-5 tracking-[0.21px] font-medium font-dm-sans">
                        {tech.name}
                      </span>
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="min-h-6 px-3 py-1 bg-[#ebebeb] rounded-full flex items-center justify-center"
                    >
                      <span className="text-black/70 text-sm font-medium">+{project.tech.length - 3}</span>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isPublic && (
            <div
              className={`flex items-center justify-between gap-3 ${
                project.tech?.length > 0 ? "mt-0" : "mt-0"
              } md:flex-col sm:flex-col md:items-start sm:items-start md:w-full sm:w-full md:gap-4 sm:gap-4`}
            >
              <div className="flex flex-col items-center md:w-full sm:w-full">
                {project.status === "Verified" && (
                  <div className="flex items-baseline">
                    <span className="text-xl font-medium">{project?.score?.toFixed(1)}</span>
                    <span className="text-[#909091] text-xl font-medium">/10</span>
                  </div>
                )}
                <div className="flex items-center gap-1 rounded-full">
                  <img src={config.icon || "/placeholder.svg"} alt={project.status} className="w-4 h-4" />
                  <span className={`text-sub-header ${config.color}`}>{config.text}</span>
                </div>
              </div>

              <Button
                onClick={handleViewProject}
                variant="link"
                className="text-[#68696B] text-body2 underline justify-center text-center md:w-full sm:w-full"
              >
                View Report
              </Button>

              <Button
                className="border-[#68696B] text-[#68696B] text-body2 justify-center md:w-full sm:w-full"
                variant="outline"
                onClick={
                  project.status === "Incomplete"
                    ? handleIncompleteClick
                    : project.status === "In-review"
                    ? handleViewStatusClick
                    : project.status === "Unverified"
                    ? handleVerifyProject
                    : project.status === "Verified"
                    ? handleVerifyProject
                    : () => {}
                }
              >
                {getActionConfig(project.status)}
              </Button>
            </div>
          )}
        </div>
      </div>

      <CardContent className="flex flex-col px-0 w-full p-0 mt-3">
        <p className="text-[#67696b] text-body2">{project.description}</p>

        <div className="flex gap-6 mt-3 md:hidden sm:hidden">
          {project.githubLink?.length > 0 && (
            <Button variant="link" className="text-[#001630] hover:text-[#001630CC] underline p-0 h-auto" asChild>
              <a href={project.githubLink[0]} target="_blank" rel="noopener noreferrer">
                View GIT repo
              </a>
            </Button>
          )}
          {project.liveLink && (
            <Button variant="link" className="text-[#001630] hover:text-[#001630CC] underline p-0 h-auto" asChild>
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                Live link
              </a>
            </Button>
          )}
        </div>
      </CardContent>
      {/* 
      <ReviewModal
        open={true}
        onOpenChange={setIsReviewModalOpen}
        project={project}
        username={user?.name}
      /> */}

      {isSuccessModalOpen && (
        <SuccessModal
          onClose={() => {
            setIsSuccessModalOpen(false);
          }}
          // onRefresh={(onSuccess) => }
        />
      )}
    </Card>
  );
};

export default ProjectCard;
