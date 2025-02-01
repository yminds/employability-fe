import type React from "react"
import { useEffect, useState } from "react"
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import ProjectCard, { ProjectCardSkeleton } from "@/components/projects/ProjectCard"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal"
import ProjectDeleteModal from "@/components/projects/modal/ProjectDeleteModal"
import SkillsHeader from "@/components/skills/skillsheader"
import ProjectInsights from "@/components/projects/ProjectInsights"
import { useNavigate } from "react-router-dom"
import arrow from "@/assets/skills/arrow.svg"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"


// Update Project interface
interface Project {
  _id: string
  name: string
  description: string
  tech: {
    _id: string
    name: string
    icon: string
  }[]
  githubLink: string[]
  liveLink: string
  thumbnail?: string // Changed from object to string
  images?: string  // Changed from array of objects to string array
  synopsisDoc?: string // Changed from object to string
  synopsis?: string
  status: string
  score?: number
  lastCompletedStep?: number
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
                  <ProjectCardSkeleton key={index} />
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

const ProjectListing: React.FC = () => {
  const navigate = useNavigate()
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [skillsUpdated, setSkillsUpdated] = useState(false)

  const userId = useSelector((state: RootState) => state.auth.user?._id)

  const { data: goalData } = useGetGoalsbyuserQuery(userId)
  const goalDetails = goalData?.data

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery(userId ?? "")

  useEffect(() => {
    if (goalData?.data?.length && selectedGoalId === null) {
      setSelectedGoalId(goalData.data[0]._id)
    }
  }, [goalData, selectedGoalId])

  const handleOpenUploadModal = (project?: Project) => {
    setSelectedProject(project || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = async () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    await refetchProjects()
  }

  const handleOpenDeleteModal = (projectId: string) => {
    setProjectToDelete(projectId)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = async () => {
    setProjectToDelete(null)
    setIsDeleteModalOpen(false)
    await refetchProjects()
  }

  const handleSkillsStatusChange = (isUpdated: boolean) => {
    setSkillsUpdated(isUpdated)
  }

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId)
  }

  const handleBackToDashboard = () => {
    navigate("/")
  }

  if (projectsLoading) {
    return <ProjectListingSkeleton />
  }

  const selectedGoal = goalData?.data.find((goal) => goal._id === selectedGoalId)
  const selectedGoalName = selectedGoal?.name || ""
  const selectedGoalExperience = selectedGoal?.experience || null

  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F5F5]">
      <ProjectUploadModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        selectedGoalId={selectedGoalId || ""}
        existingProject={selectedProject}
        onSuccess={async () => {
          await refetchProjects()
          setIsModalOpen(false)
          setSelectedProject(null)
        }}
      />

      {projectToDelete && (
        <ProjectDeleteModal
          open={isDeleteModalOpen}
          onOpenChange={handleCloseDeleteModal}
          projectId={projectToDelete}
          onSuccess={async () => {
            await refetchProjects()
            setIsDeleteModalOpen(false)
            setProjectToDelete(null)
          }}
        />
      )}

      <div className="h-full flex justify-center">
        <div className="w-full flex gap-6 p-6">
          <div className="flex-[7] flex flex-col h-full">
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

            <div className="sticky top-0 bg-[#F5F5F5] z-10">
              {goalData ? (
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
              ) : (
                <Skeleton height={50} />
              )}
            </div>

            <div className="mt-[70px] sm:min-w-[100%] sm:mt-4 overflow-y-auto scrollbar-hide">
              <div className="space-y-4">
                {projectsError ? (
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

          <div className="flex-[3] w-full space-y-4 sm:mt-0">
            <div className="flex flex-col gap-6 sticky top-[70px]">
              <ProjectInsights goalId={selectedGoalId || ""} userId={userId || ""} goalDetails={goalDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListing