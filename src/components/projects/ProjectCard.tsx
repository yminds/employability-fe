import type React from "react"
import { Trash2, Play, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface Skill {
  _id: string
  name: string
  description: string
  icon?: string
}

interface ProjectCardProps {
  project: {
    _id: string
    name: string
    description: string
    tech: Skill[]
    githubLink: string[]
    liveLink: string
    thumbnail?: string
    status: "Incomplete" | "In-review" | "Unverified" | "Verified"
    score: number
    lastCompletedStep?: number
  }
  onOpenUploadModal?: (project: ProjectCardProps["project"]) => void
  onOpenDeleteModal?: (projectId: string) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenUploadModal, onOpenDeleteModal }) => {
  const visibleSkills = project.tech.slice(0, 5)
  const remainingSkills = project.tech.length - 5
  const isVerified = project.status === "Verified"
  const score = project.score

  const handleIncompleteClick = () => {
    if (project.status === "Incomplete" && onOpenUploadModal) {
      onOpenUploadModal(project)
    }
  }

  const handleDeleteClick = () => {
    if (onOpenDeleteModal) {
      onOpenDeleteModal(project._id)
    }
  }

  const renderStatusBadge = () => {
    const statusConfig = {
      Verified: { icon: CheckCircle, color: "text-[#25de84]" },
      "In-review": { icon: Clock, color: "text-yellow-500" },
      Unverified: { icon: AlertCircle, color: "text-orange-500" },
      Incomplete: { icon: AlertCircle, color: "text-red-500" },
    }

    const { icon: Icon, color } = statusConfig[project.status]

    return (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">{score.toFixed(1)}</span>
          <span className="text-gray-600">/10</span>
        </div>
        <div className={`flex items-center gap-1 ${color}`}>
          <Icon className="w-4 h-4" />
          <span className="text-sm">{project.status}</span>
        </div>
      </div>
    )
  }

  const renderActionButton = () => {
    const buttonConfig = {
      Verified: "View Project",
      "In-review": "Details",
      Unverified: "Verify",
      Incomplete: "Complete Project",
    }

    return (
      <button
        onClick={project.status === "Incomplete" ? handleIncompleteClick : undefined}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors"
      >
        {buttonConfig[project.status]}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-5xl">
      <div className="flex gap-6">
        {/* Thumbnail */}
        {project.thumbnail && (
          <div className="relative w-48 h-32 flex-shrink-0">
            <img
              src={project.thumbnail || "/placeholder.svg"}
              alt={`${project.name} Thumbnail`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                <Play className="w-5 h-5 text-gray-800" />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {visibleSkills.map((skill) => (
                  <span key={skill._id} className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                    {skill.name}
                  </span>
                ))}
                {remainingSkills > 0 && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">+{remainingSkills}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">{renderStatusBadge()}</div>
              <div className="flex items-center gap-2">
                {renderActionButton()}
                <button
                  onClick={handleDeleteClick}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

          <div className="flex gap-4">
            {project.githubLink.length > 0 && (
              <a
                href={project.githubLink[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:underline font-medium"
              >
                View GIT repo
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:underline font-medium"
              >
                Live link
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard

