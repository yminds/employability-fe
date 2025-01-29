import type React from "react"
import { useEffect, useState } from "react"
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import ProjectCard from "@/components/projects/ProjectCard"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal"
import ProjectDeleteModal from "@/components/projects/modal/ProjectDeleteModal"
import SkillsHeader from "@/components/skills/skillsheader"
import ProjectInsights from "@/components/projects/ProjectInsights"

interface Project {
  _id: string
  name: string
  description: string
  tech: Array<{
    _id: string
    name: string
    description: string
  }>
  githubLink: string[]
  liveLink: string
  thumbnail?: { url: string; fileName: string }
  images?: Array<{ url: string; fileName: string }>
  synopsisDoc?: { url: string; fileName: string }
  status: "Incomplete" | "In-review" | "Unverified" | "Verified"
  score?: number
  lastCompletedStep?: number
}

const ProjectListing: React.FC = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [skillsUpdated, setSkillsUpdated] = useState(false)

  const userId = useSelector((state: RootState) => state.auth.user?._id)

  const { data: goalData } = useGetGoalsbyuserQuery(userId)
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
    if (project) {
      setSelectedProject({
        ...project,
        _id: project._id,
        name: project.name,
        description: project.description,
        tech: project.tech,
        githubLink: project.githubLink,
        liveLink: project.liveLink,
        thumbnail: project.thumbnail,
        images: project.images,
        synopsisDoc: project.synopsisDoc,
        status: project.status,
        score: project.score,
      })
    } else {
      setSelectedProject(null)
    }
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

  const selectedGoalName = goalData?.data.find((goal) => goal._id === selectedGoalId)?.name || ""
  const selectedGoalExperience = goalData?.data.find((goal) => goal._id === selectedGoalId)?.experience || null

  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F5F5]">
      {/* Modals */}
      <ProjectUploadModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        selectedGoalId={selectedGoalId}
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

      {/* Main Content */}
      <div className="h-full flex justify-center">
        <div className="w-full flex gap-6 p-6">
          {/* Left Section - Projects List */}
          <div className="flex-[7] flex flex-col h-full">
            {/* Header with Goal Selection and Add Project Button */}
            <div className="sticky top-0 bg-[#F5F5F5] py-4 z-10 flex justify-between items-center">
              <div className="flex-1 max-w-md">
                <SkillsHeader
                  userId={userId}
                  goals={goalData}
                  selectedGoalName={selectedGoalName}
                  onSkillsStatusChange={handleSkillsStatusChange}
                  onGoalChange={handleGoalChange}
                  selectedGoalExperienceLevel={selectedGoalExperience}
                  hideAddSkillsButton={true}
                />
              </div>
              <button
                onClick={() => handleOpenUploadModal()}
                className="flex items-center gap-2 bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600 ml-4"
              >
                Add/Create
              </button>
            </div>

            {/* Scrollable Projects List */}
            <div className="flex-1 overflow-y-auto pr-2 scroll-smooth snap-y snap-proximity sm:min-w-[290px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
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
          <div className="flex-[3] h-full">
            <div className="w-[400px] p-6 overflow-hidden ">
              <ProjectInsights goalId={selectedGoalId} userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListing

