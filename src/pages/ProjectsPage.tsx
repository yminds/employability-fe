import { useState } from "react"
import UploadProjectSVG from "@/assets/projects/upload-local.svg"
import GetProjectFromMentorSVG from "@/assets/projects/get-project-from-mentor.svg"
import { ProjectUploadModal } from "@/components/projects/modal/ProjectUploadModal"
import backgroundImageSVG from "@/assets/projects/background.svg"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice"
import ProjectListing from "./project-listing"
import ProjectInsights from "@/components/projects/ProjectInsights"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex">
        <div className="flex-[7] flex flex-col items-center justify-center px-4">
          <div className="mb-8 text-center w-full max-w-md">
            <Skeleton height={36} width="80%" className="mb-2" />
            <Skeleton height={20} width="60%" />
          </div>
          <div className="w-full max-w-md space-y-4">
            <Skeleton height={200} width="100%" />
            <Skeleton height={200} width="100%" />
          </div>
        </div>
        <div className="flex-[3] p-6">
          <Skeleton height={400} />
        </div>
      </div>
    </div>
  )
}

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const userId = useSelector((state: RootState) => state.auth.user?._id)
  
  const { data: goalData } = useGetGoalsbyuserQuery(userId)
  const goalDetails = goalData?.data

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery(userId ?? "")

  const handleModalClose = async () => {
    setIsModalOpen(false)
    await refetchProjects()
  }

  const handleProjectSuccess = async () => {
    await refetchProjects()
    setIsModalOpen(false)
  }

  if (projectsLoading) {
    return <LoadingSkeleton />
  }

  if (projectsError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error loading projects</div>
  }

  if (projectsData?.data && projectsData.data.length > 0) {
    return <ProjectListing />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex">
        <div className="flex-[7] relative">
          <div className="absolute inset-0 z-0">
            <img src={backgroundImageSVG || "/placeholder.svg"} alt="" className="w-full h-full object-cover opacity-50" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
            <ProjectUploadModal
              open={isModalOpen}
              onOpenChange={handleModalClose}
              onSuccess={handleProjectSuccess}
              selectedGoalId={selectedGoalId || ""}
            />

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-ubuntu font-bold text-gray-900">No Projects Yet</h1>
              <p className="text-gray-500 font-sf-pro">Start showcasing your skills by adding your first project.</p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div
                className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsModalOpen(true)}
              >
                <img src={UploadProjectSVG || "/placeholder.svg"} alt="Upload Project" className="w-auto h-auto" />
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
        <div className="flex-[3] p-6">
          <div className="sticky top-[70px]">
            <ProjectInsights goalId={selectedGoalId || ""} userId={userId || ""} goalDetails={goalDetails} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage