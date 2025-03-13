import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import noProjects from "@/assets/profile/noProjects.svg";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  status: "Verified" | "In-review" | "Unverified" | "Incomplete";
  score?: number;
  lastCompletedStep?: number;
}

interface ProjectListProps {
  projects: Project[] | undefined;
  isLoading: boolean;
  isDashboard?: boolean;
  isPublic?: boolean;
  onOpenUploadModal?: (project: Project | null) => void;
  onOpenDeleteModal?: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  isDashboard = false,
  isPublic = false,
  onOpenUploadModal,
  onOpenDeleteModal,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const totalProjects = projects?.length || 0;

  const displayProjects =
    isExpanded || !isDashboard ? projects : projects?.slice(0, 3);

  const handleProjectClick = () => {
    if (isDashboard && !isPublic) {
      navigate("/projects");
    }
  };

  const handleViewAll = () => {
    if (isPublic) {
      setIsExpanded(!isExpanded);
    } else {
      navigate("/projects");
    }
  };

  return (
    <div className="p-[32px] sm:p-[20px]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
          <h2 className="text-base font-medium text-black font-['Ubuntu'] leading-[22px]">
            Projects ({totalProjects})
          </h2>
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            Array(3)
              .fill(null)
              .map((_, index) => <ProjectCardSkeleton key={index} />)
          ) : displayProjects?.length ? (
            <>
              {displayProjects.map((project, index) => (
                <React.Fragment key={project._id}>
                  <div className="cursor-pointer" onClick={handleProjectClick}>
                    <ProjectCard
                      project={project}
                      onOpenUploadModal={onOpenUploadModal}
                      onOpenDeleteModal={onOpenDeleteModal}
                      isDashboard={isDashboard}
                      isPublic={isPublic}
                    />
                  </div>
                  {index < displayProjects.length - 1 && (
                    <div className="w-full h-px bg-[#E0E0E0] mb-4" />
                  )}
                </React.Fragment>
              ))}
              {!isExpanded && projects && projects.length > 3 && (
                <>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[211px]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0) 20%, #FFF 100%)",
                    }}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                    <button
                      onClick={handleViewAll}
                      className="flex items-center gap-1 text-[#001630] text-sm font-medium"
                    >
                      View all
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </>
              )}
              {isExpanded && isDashboard && isPublic && (
                <div className="w-full flex justify-center mt-4">
                  <button
                    onClick={handleViewAll}
                    className="flex items-center gap-1 text-[#001630] text-sm font-medium"
                  >
                    Show less
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="py-[50px] items-center justify-center flex flex-col">
                <img
                  src={noProjects || "/placeholder.svg"}
                  alt="No project entries"
                  className="w-20 h-20 mb-6 sm:mb-1"
                />
                <h3 className="text-[#414447] text-body2 mb-2 text-center">
                  {isPublic
                    ? "No Projects added yet."
                    : "You haven't added any project yet."}
                </h3>
                {!isPublic && (
                  <p className="text-[#414447] text-body2 text-center">
                    <button
                      onClick={() => navigate("/projects")}
                      className="text-[#414447] underline underline-offset-2 hover:text-emerald-700 focus:outline-none"
                    >
                      Add project
                    </button>{" "}
                    to show up here
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
