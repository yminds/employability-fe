import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import ReviewModal from "./modal/ReviewMessageModal";
import verifyImg from "../../assets/skills/verified.svg";
import unVerifyImg from "../../assets/skills/unverifies.svg";
import clockLoader from "../../assets/skills/clock_loader.svg";
import alertCircle from "../../assets/projects/alertCircle.svg"
import type { RootState } from "@/store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  status: "Verified" | "In-review" | "Unverified" | "Incomplete";
  score?: number;
  lastCompletedStep?: number;
}

type ProjectStatus = "Verified" | "In-review" | "Unverified" | "Incomplete";

interface ProjectCardProps {
  project: Project | null;
  onOpenUploadModal?: (project: Project | null) => void;
  onOpenDeleteModal?: (projectId: string) => void;
  isDashboard?: boolean;
  isPublic?: boolean;
}

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col items-start gap-7 p-5 pr-8 pb-7 bg-white rounded-lg border border-black/10 self-stretch mb-4 sm:p-4">
      <div className="flex items-start gap-5 w-full md:flex-col sm:flex-col">
        <Skeleton width={150} height={100} className="md:w-full sm:w-full md:h-[200px] sm:h-[200px]" />
        <div className="flex items-start justify-between flex-1 md:flex-col sm:flex-col md:gap-4 sm:gap-4 md:w-full sm:w-full">
          <div className="flex flex-col gap-4">
            <Skeleton width={200} height={20} />
            <div className="flex gap-2 flex-wrap">
              <Skeleton width={60} height={24} />
              <Skeleton width={60} height={24} />
              <Skeleton width={60} height={24} />
            </div>
          </div>
          <div className="flex items-center mt-5 md:flex-col sm:flex-col md:items-start sm:items-start md:w-full sm:w-full md:gap-4 sm:gap-4">
            <div className="w-32 md:w-full sm:w-full">
              <Skeleton width={80} height={40} />
            </div>
            <div className="flex gap-8 md:flex-col sm:flex-col md:w-full sm:w-full md:gap-2 sm:gap-2">
              <Skeleton width={112} height={36} className="md:w-full sm:w-full" />
              <Skeleton width={112} height={36} className="md:w-full sm:w-full" />
            </div>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col px-0 w-full">
        <Skeleton count={3} />
        <div className="flex gap-6 mt-3 md:flex-col sm:flex-col md:gap-2 sm:gap-2">
          <Skeleton width={100} height={20} />
          <Skeleton width={100} height={20} />
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenUploadModal,
  onOpenDeleteModal,
  isDashboard,
  isPublic = false,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state?.auth.user);

  if (!project) {
    return <ProjectCardSkeleton />;
  }

  const handleIncompleteClick = () => {
    if (project?.status === "Incomplete" && onOpenUploadModal) {
      onOpenUploadModal(project);
    }
  };

  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case "Verified":
        return {
          icon: verifyImg,
          color: "text-green-600",
        };
      case "In-review":
        return {
          icon: clockLoader,
          color: "text-blue-600",
        };
      case "Unverified":
        return {
          icon: unVerifyImg,
          color: "text-yellow-600",
        };
      case "Incomplete":
        return {
          icon: alertCircle,
          color: "text-red-600",
        };
      default:
        return {
          icon: alertCircle,
          color: "text-red-600",
        };
    }
  };

  const config = getStatusConfig(project.status);

  const getActionConfig = (status: ProjectStatus) => {
    switch (status) {
      case "Verified":
        return "Improve score";
      case "In-review":
      case "Unverified":
        return "Verify Project";
      case "Incomplete":
        return "Complete Project";
      default:
        return "";
    }
  };

  return (
    <Card
      className={`flex flex-col items-start p-0 bg-white rounded-lg ${
        !isDashboard ? "border border-black/10 p-6" : ""
      } self-stretch mb-4 sm:p-4`}
    >
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
            <h2 className="text-[#1f2226] text-sub-header">
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
                      <span className="text-black text-sm font-medium font-dm-sans">
                        {tech.name}
                      </span>
                    </Badge>
                  ))}
                  {project.tech.length > 5 && (
                    <Badge
                      variant="secondary"
                      className="min-h-6 px-3 py-1 bg-[#ebebeb] rounded-full flex items-center justify-center"
                    >
                      <span className="text-black/70 text-sm font-medium font-dm-sans">
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
                  <span className="text-xl font-medium font-ubuntu">
                    {project?.score}
                  </span>
                  <span className="text-[#909091] text-xl font-medium font-ubuntu">/10</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 rounded-full">
                <img src={config.icon} alt={project.status} className="w-4 h-4" />
                <span
                  className={`text-sm leading-[22px] tracking-[0] font-medium font-ubuntu ${config.color}`}
                >
                  {project.status}
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
        <p className="text-[#67696b] text-sm font-dm-sans">
          {project.description}
        </p>
        {(project.githubLink.length > 0 || project.liveLink) && (
          <div className="flex gap-6 mt-3 md:flex-col sm:flex-col md:gap-2 sm:gap-2">
            {project.githubLink.length > 0 && (
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
                  View GIT repo
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
};

export default ProjectCard;