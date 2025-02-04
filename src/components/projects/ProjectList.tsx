import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard, { ProjectCardSkeleton } from './ProjectCard';

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
  onOpenUploadModal?: (project: Project | null) => void;
  onOpenDeleteModal?: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  isDashboard = false,
  onOpenUploadModal,
  onOpenDeleteModal,
}) => {
  const navigate = useNavigate();
  const displayProjects = isDashboard ? projects?.slice(0, 3) : projects;
  const totalProjects = projects?.length || 0;

  const handleProjectClick = () => {
    if (isDashboard) {
      navigate('/projects');
    }
  };

  return (
    <div className="p-[42px]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
          <h2 className="text-[#1f2226] text-lg font-medium font-['Ubuntu'] leading-snug">
            Projects ({totalProjects})
          </h2>
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            Array(3).fill(null).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))
          ) : displayProjects?.length ? (
            <>
              {displayProjects.map((project, index) => (
                <React.Fragment key={project._id}>
                  <div 
                    className="cursor-pointer"
                    onClick={handleProjectClick}
                  >
                    <ProjectCard
                      project={project}
                      onOpenUploadModal={onOpenUploadModal}
                      onOpenDeleteModal={onOpenDeleteModal}
                    />
                  </div>
                  {index < displayProjects.length - 1 && index !== 2 && (
                    <div className="w-full h-px bg-[#E0E0E0]" />
                  )}
                </React.Fragment>
              ))}
              {isDashboard && totalProjects > 3 && (
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => navigate("/projects")}
                    className="flex items-center gap-1 text-[#001630] text-sm font-medium hover:underline py-2 mt-2"
                  >
                    View all
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3.33334L8 12.6667"
                        stroke="#001630"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.6667 8L8.00004 12.6667L3.33337 8"
                        stroke="#001630"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500 text-center py-4">No projects found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;