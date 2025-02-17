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

  const handleIncompleteClick = () => {
    if (project?.status === "Incomplete" && onOpenUploadModal) {
      onOpenUploadModal(project);
    }
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
      "In-review": "Verify Project",
      Unverified: "Verify Project",
      Incomplete: "Complete Project",
    };

    return configs[status] || "";
  };

  const config = getStatusConfig(project.status);

  return (
    <Card className={`flex flex-col items-start p-0 bg-white rounded-lg ${
      !isDashboard ? "border border-black/10 p-6" : ""
    } self-stretch mb-4 sm:p-4`}>
      <div className="flex items-start gap-5 w-full md:flex-col sm:flex-col">
        {project.thumbnail && (
          <div className="relative w-[150px] h-[100px] bg-[#fcfcfc] rounded overflow-hidden md:w-full sm:w-full md:h-[200px] sm:h-[200px]">
            <img
              src={project.thumbnail}
              alt={`${project.name} Thumbnail`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between flex-1 md:flex-col sm:flex-col md:gap-4 sm:gap-4 md:w-full sm:w-full">
          <div className="flex flex-col">
            <h2 className="text-[#1f2226] text-xl font-semibold">
              {project.name}
            </h2>
            {project.tech?.length > 0 && (
              <div className="flex flex-col gap-2 w-full mt-4">
                <div className="flex gap-2 flex-wrap">
                  {project.tech.slice(0, 4).map((tech) => (
                    <Badge
                      key={tech._id}
                      variant="secondary"
                      className="min-h-6 px-3 py-1 bg-[#ebebeb] rounded-full flex items-center justify-center"
                    >
                      <span className="text-black text-sm font-medium">
                        {tech.name}
                      </span>
                    </Badge>
                  ))}
                  {project.tech.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="min-h-6 px-3 py-1 bg-[#ebebeb] rounded-full flex items-center justify-center"
                    >
                      <span className="text-black/70 text-sm font-medium">
                        +{project.tech.length - 4}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-10 ${project.tech?.length > 0 ? 'mt-5' : 'mt-0'} md:flex-col sm:flex-col md:items-start sm:items-start md:w-full sm:w-full md:gap-4 sm:gap-4`}>
            <div className="flex w-[30%] flex-col items-center md:w-full sm:w-full">
              {project.status === "Verified" && (
                <div className="flex items-baseline">
                  <span className="text-xl font-medium">
                    {project?.score}
                  </span>
                  <span className="text-[#909091] text-xl font-medium">/10</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 rounded-full">
                <img src={config.icon} alt={project.status} className="w-4 h-4" />
                <span className={`text-sm leading-[22px] font-medium ${config.color}`}>
                  {config.text}
                </span>
              </div>
            </div>

            {!isPublic && (
              <div className="flex gap-8 md:flex-col sm:flex-col md:w-full sm:w-full md:gap-2 sm:gap-2">
                <Button
                  variant="link"
                  className="text-[#001630] underline w-28 justify-center md:w-full sm:w-full"
                  onClick={project.status === "Incomplete" ? handleIncompleteClick : undefined}
                >
                  {getActionConfig(project.status)}
                </Button>
                <Button
                  variant="outline"
                  className="border-[#67696b] text-[#001630] w-28 justify-center md:w-full sm:w-full"
                >
                  View Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col px-0 w-full p-0 mt-3">
        <p className="text-[#67696b] text-sm">
          {project.description}
        </p>
        {(project.githubLink?.length > 0 || project.liveLink) && (
          <div className="flex gap-6 mt-3 md:flex-col sm:flex-col md:gap-2 sm:gap-2">
            {project.githubLink?.length > 0 && (
              <Button
                variant="link"
                className="text-[#67696b] underline p-0 h-auto"
                asChild
              >
                <a
                  href={project.githubLink[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View GitHub repo
                </a>
              </Button>
            )}
            {project.liveLink && (
              <Button
                variant="link"
                className="text-[#67696b] underline p-0 h-auto"
                asChild
              >
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live link
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <ReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        project={project}
        username={user?.name}
      />
    </Card>
  );
}

export default ProjectCard