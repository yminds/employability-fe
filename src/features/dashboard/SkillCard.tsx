import { PuzzleIcon, FileText, Users, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SkillCardProps {
  type: "skills" | "projects" | "interview"
  total: number | null
  verifiedSkills?: number
  totalMandatorySkills?: number
  verifiedProjects?: number
  totalProjects?: number
}

const cardConfig = {
  skills: {
    title: "Skills",
    icon: PuzzleIcon,
    iconColor: "text-[#1fd167]",
    bgColor: "bg-[#dbffea]",
  },
  projects: {
    title: "Projects",
    icon: FileText,
    iconColor: "text-[#ff8c3f]",
    bgColor: "bg-[#fff2ea]",
  },
  interview: {
    title: "Interview",
    icon: MessageSquare,
    iconColor: "text-[#a855f7]",
    bgColor: "bg-[#f3e8ff]",
  },
}

export function SkillCard({
  type,
  total,
  verifiedSkills,
  totalMandatorySkills,
  verifiedProjects,
  totalProjects,
}: SkillCardProps) {
  const config = cardConfig[type]
  const Icon = config.icon

  const renderContent = () => {
    if (type === "skills" && verifiedSkills !== undefined && totalMandatorySkills !== undefined) {
      return (
        <div className="flex items-baseline">
          <span className="text-[#202326] text-3xl font-bold leading-none">{verifiedSkills}</span>
          
            <span className="text-[#68696B] text-sm ml-1">/ {totalMandatorySkills}</span>
          
        </div>
      )
    }
    if (type === "projects" && verifiedProjects !== undefined && totalProjects !== undefined) {
      return (
        <div className="flex items-baseline">
          <span className="text-[#202326] text-3xl font-bold leading-none">{verifiedProjects}</span>
          
            <span className="text-[#68696B] text-sm ml-1">/ {totalProjects}</span>
          
        </div>
      )
    }
    return (
      <div className="flex items-baseline">
        <span className="text-[#202326] text-3xl font-bold leading-none">{total}</span>
      </div>
    )
  }

  return (
    <Card className="w-full bg-white rounded-xl shadow-sm border border-[#eee] hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <span className="text-[#414447] font-ubuntu text-md font-medium">{config.title}</span>
          </div>
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  )
}