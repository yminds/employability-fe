import type React from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import GoalSelect from "../GoalSelect"
import type { RootState } from "@/store/store"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"

interface ProjectDetailsStepProps {
  projectName: string
  description: string
  goalId: string
  onChange: (field: string, value: string) => void
  errors: {
    projectName?: string[]
    description?: string[]
    goalId?: string[]
  }
  isEditing: boolean
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  projectName,
  description,
  goalId,
  onChange,
  errors,
  isEditing,
}) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id)
  const userName = useSelector((state: RootState) => state.auth.user?.name) || ""
  const { data: projectsData } = useGetProjectsByUserIdQuery(userId ?? "")
  const projectsCount = projectsData?.data.length || 0

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">
        {getGreeting()}, {userName}! Let's create your project.
      </h2>

      <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Label htmlFor="projectName" className="flex items-center gap-1">
          What's your project called?
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="projectName"
          placeholder="e.g. Portfolio Website, Expense Tracker App"
          value={projectName}
          onChange={(e) => onChange("projectName", e.target.value)}
          required
          className={`${errors.projectName ? "border-red-500" : ""}`}
          maxLength={100}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-red-500">{errors.projectName?.[0]}</span>
          <span className="text-sm text-gray-500">{projectName.length}/100</span>
        </div>
      </motion.div>

      {!isEditing && projectsCount === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <GoalSelect selectedGoal={goalId} onGoalSelect={(value) => onChange("goalId", value)} userId={userId!} />
        </motion.div>
      )}

      <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Label htmlFor="description" className="flex items-center gap-1">
          Tell us more about your project, {userName.split(" ")[0]}
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder={`Hey ${userName.split(" ")[0]}, briefly describe your project goals, features, and challenges...`}
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
          className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-red-500">{errors.description?.[0]}</span>
          <span className="text-sm text-gray-500">{description.length}/500</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectDetailsStep
