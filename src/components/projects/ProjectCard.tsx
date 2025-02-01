import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useSelector } from "react-redux"
import ReviewModal from "./modal/ReviewMessageModal"
import verifyImg from "../../assets/skills/verified.svg"
import unVerifyImg from "../../assets/skills/unverifies.svg"
import clockLoader from "../../assets/skills/clock_loader.svg"
import type { RootState } from "@/store/store"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface Skill {
  _id: string
  name: string
  description: string
  icon?: string
}

type ProjectStatus = "Verified" | "In-review" | "Unverified" | "Incomplete";

interface ProjectCardProps {
  project: {
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
  status: ProjectStatus
  score?: number
  lastCompletedStep?: number
  } | null
  onOpenUploadModal?: (project: ProjectCardProps["project"]) => void
  onOpenDeleteModal?: (projectId: string) => void
}

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col items-start gap-7 p-5 pr-8 pb-7 bg-white rounded-lg border border-black/10 self-stretch mb-4">
      <div className="flex items-start gap-5 w-full">
        <Skeleton width={150} height={100} />
        <div className="flex items-start justify-between flex-1">
          <div className="flex flex-col gap-4">
            <Skeleton width={200} height={20} />
            <div className="flex gap-2">
              <Skeleton width={60} height={24} />
              <Skeleton width={60} height={24} />
              <Skeleton width={60} height={24} />
            </div>
          </div>
          <div className="flex items-center mt-5">
            <div className="w-32">
              <Skeleton width={80} height={40} />
            </div>
            <div className="flex gap-8">
              <Skeleton width={112} height={36} />
              <Skeleton width={112} height={36} />
            </div>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col px-0 w-full">
        <Skeleton count={3} />
        <div className="flex gap-6 mt-3">
          <Skeleton width={100} height={20} />
          <Skeleton width={100} height={20} />
        </div>
      </CardContent>
    </Card>
  )
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenUploadModal, onOpenDeleteModal }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const user = useSelector((state: RootState) => state?.auth.user)

  if (!project) {
    return <ProjectCardSkeleton />
  }

  const handleIncompleteClick = () => {
    if (project?.status === "Incomplete" && onOpenUploadModal) {
      onOpenUploadModal(project)
    }
  }

  const renderThumbnail = () => {
    if (!project?.thumbnail) return null

    return (
      <div className="relative w-[150px] h-[100px] bg-[#fcfcfc] rounded overflow-hidden">
        <img
          src={project.thumbnail || "/placeholder.svg?height=100&width=150"}
          alt={`${project.name} Thumbnail`}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  type StatusConfigType = {
    [K in ProjectStatus]: {
      imgSrc?: string;
      component?: typeof AlertCircle;
      color: string;
      showScore: boolean;
      action: string;
    }
   }
   
   const statusConfig: StatusConfigType = {
    Verified: {
      imgSrc: verifyImg,
      color: "text-[#10b753]",
      showScore: true,
      action: "Improve score",
    },
    "In-review": {
      imgSrc: clockLoader,
      color: "text-[#589bff]", 
      showScore: false,
      action: "Verify Project",
    },
    Unverified: {
      imgSrc: unVerifyImg,
      color: "text-[#589bff]",
      showScore: false,
      action: "Verify Project",
    },
    Incomplete: {
      component: AlertCircle,
      color: "text-red-500",
      showScore: false,
      action: "Complete Project", 
    },
   };

  const config = statusConfig[project.status]
  const StatusIcon = config?.component

  return (
    <Card className="flex flex-col items-start gap-7 p-5 pr-8 pb-7 bg-white rounded-lg border border-black/10 self-stretch mb-4">
      <div className="flex items-start gap-5 w-full">
        {project.thumbnail && renderThumbnail()}

        <div className="flex items-start justify-between flex-1">
          <div className="flex flex-col gap-4">
            <h2 className="text-[#1f2226] text-base font-medium font-['Ubuntu'] leading-snug">{project.name}</h2>
            <div className="flex flex-col gap-2">
              {project.thumbnail ? (
                <>
                  <div className="flex gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech._id}
                        variant="secondary"
                        className="h-6 px-2.5 bg-[#ebebeb] rounded-[33px] justify-center items-center gap-2.5 inline-flex"
                      >
                        <div className="text-black/70 text-sm font-['SF Pro Display'] leading-normal tracking-tight">
                          {tech.name}
                        </div>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.tech.slice(3, 5).map((tech) => (
                      <Badge
                        key={tech._id}
                        variant="secondary"
                        className="h-6 px-2.5 bg-[#ebebeb] rounded-[33px] justify-center items-center gap-2.5 inline-flex"
                      >
                        <div className="text-black/70 text-sm font-['SF Pro Display'] leading-normal tracking-tight">
                          {tech.name}
                        </div>
                      </Badge>
                    ))}
                    {project.tech.length > 5 && (
                      <Badge
                        variant="secondary"
                        className="h-6 px-2.5 bg-[#ebebeb] rounded-[33px] justify-center items-center gap-2.5 inline-flex"
                      >
                        <div className="text-black/70 text-sm font-['SF Pro Display'] leading-normal tracking-tight">
                          +{project.tech.length - 5}
                        </div>
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  {project.tech.slice(0, 5).map((tech) => (
                    <Badge
                      key={tech._id}
                      variant="secondary"
                      className="h-6 px-2.5 bg-[#ebebeb] rounded-[33px] justify-center items-center gap-2.5 inline-flex"
                    >
                      <span className="text-black/70 text-sm font-['SF Pro Display'] leading-normal tracking-tight">
                        {tech.name}
                      </span>
                    </Badge>
                  ))}
                  {project.tech.length > 5 && (
                    <Badge
                      variant="secondary"
                      className="h-6 px-2.5 bg-[#ebebeb] rounded-[33px] justify-center items-center gap-2.5 inline-flex"
                    >
                      <span className="text-black/70 text-sm font-['SF Pro Display'] leading-normal tracking-tight">
                        +{project.tech.length - 5}
                      </span>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mt-5">
            <div className="w-32">
              {project.status === "Verified" && project.score &&  (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-xl">
                    <span className="text-[#0b0e12] font-medium">{project.score.toFixed(1)}</span>
                    <span className="text-[#8f9091] font-medium">/10</span>
                  </div>
                  <div className={`flex items-center gap-2 ${config.color}`}>
                    {config.imgSrc && (
                      <img
                        src={config.imgSrc || "/placeholder.svg?height=20&width=20"}
                        alt={project.status}
                        className="w-5 h-5"
                      />
                    )}
                    <span className="font-sub-header">{project.status}</span>
                  </div>
                </div>
              )}
              {project.status !== "Verified" && (
                <div className={`flex items-center gap-2 ${config.color}`}>
                  {config.imgSrc ? (
                    <img
                      src={config.imgSrc || "/placeholder.svg?height=20&width=20"}
                      alt={project.status}
                      className="w-5 h-5"
                    />
                  ) : (
                    StatusIcon && <StatusIcon className="w-5 h-5" />
                  )}
                  <span className="font-sub-header">{project.status}</span>
                </div>
              )}
            </div>

            <div className="flex gap-8">
              <Button
                variant="link"
                className="text-[#67696b] underline w-28 justify-center"
                onClick={project.status === "Incomplete" ? handleIncompleteClick : undefined}
              >
                {config.action}
              </Button>

              <Button variant="outline" className="border-[#67696b] text-[#67696b] w-28 justify-center">
                View Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col px-0">
        <p className="text-[#67696b] text-base font-normal font-['SF Pro Display'] leading-7 tracking-tight">
          {project.description}
        </p>
        {(project.githubLink.length > 0 || project.liveLink) && (
          <div className="flex gap-6 mt-3">
            {project.githubLink.length > 0 && (
              <Button variant="link" className="text-[#67696b] underline p-0 h-auto" asChild>
                <a href={project.githubLink[0]} target="_blank" rel="noopener noreferrer">
                  View GIT repo
                </a>
              </Button>
            )}
            {project.liveLink && (
              <Button variant="link" className="text-[#67696b] underline p-0 h-auto" asChild>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
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
  )
}

export default ProjectCard