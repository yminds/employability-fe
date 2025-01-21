import React, { useEffect, useState } from "react";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProjectCard from "@/components/projects/ProjectCard";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal";
import { PlusCircle } from "lucide-react";
import ProjectDeleteModal from "@/components/projects/modal/ProjectDeleteModal";

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
  thumbnail?: string;
  status: 'Incomplete' | 'In-review' | 'Unverified' | 'Verified';
  score?: number;
  lastCompletedStep?: number;
}

const ProjectListing: React.FC = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const { data: goalData } = useGetGoalsbyuserQuery(userId);
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects
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

  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F5F5]">
      {/* Modals */}
      <ProjectUploadModal 
        open={isModalOpen} 
        onOpenChange={handleCloseModal}
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
        <div className="w-full max-w-[1300px] flex gap-6 p-6">
          {/* Left Section - Projects List */}
          <div className="flex-[7] flex flex-col h-full">
            {/* Fixed Header */}
            <div className="sticky top-0  bg-[#F5F5F5] py-4 z-20 flex justify-end">
              <button 
                onClick={() => handleOpenUploadModal()}
                className="flex items-center gap-2 bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600 "
              >
                
                Add/Create
              </button>
            </div>

            {/* Scrollable Projects List */}
            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="text-center text-gray-500 py-4">Loading projects...</div>
                ) : projectsError ? (
                  <div className="text-center text-red-500 py-4">Error loading projects</div>
                ) : projectsData?.data.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No projects found. 
                    <button 
                      onClick={() => handleOpenUploadModal()} 
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Create your first project
                    </button>
                  </div>
                ) : (
                  projectsData?.data.map((project) => (
                    <ProjectCard 
                      key={project._id} 
                      project={{
                        _id: project._id,
                        name: project.name,
                        description: project.description,
                        tech: project.tech.map(tech => ({
                          _id: tech._id,
                          name: tech.name,
                          description: tech.description || ''
                        })),
                        githubLink: project.githubLink,
                        liveLink: project.liveLink,
                        thumbnail: project.thumbnail,
                        status: project.status,
                        score: project.score
                      }}
                      onOpenUploadModal={handleOpenUploadModal}
                      onOpenDeleteModal={handleOpenDeleteModal}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Project Insights */}
          <div className="flex-[3] h-full">
            <div className="sticky top-6 bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Project Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-semibold text-gray-900">
                    {projectsData?.data.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verified Projects</span>
                  <span className="font-semibold text-green-600">
                    {projectsData?.data.filter(p => p.status === 'Verified').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Verification</span>
                  <span className="font-semibold text-orange-600">
                    {projectsData?.data.filter(p => p.status !== 'Verified').length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListing;