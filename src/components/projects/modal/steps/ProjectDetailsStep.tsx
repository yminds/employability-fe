import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import GoalSelect from "../GoalSelect"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"

interface ProjectDetailsStepProps {
  projectName: string
  description: string
  goalId:string
  onChange: (field: string, value: string) => void
  errors: {
    projectName?: string[]
    description?: string[]
    goalId?:string[]
  }
  isEditing: Boolean
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  projectName,
  description,
  goalId,
  onChange,
  errors,
  isEditing
}) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id)
  const{data:projectsData} = useGetProjectsByUserIdQuery(userId ?? "")
  const projectsCount = projectsData?.data.length || 0
  console.log(projectsCount)
  return (
    
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName" className="flex items-center gap-1">
          Project Name
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
          <span className="text-sm text-red-500">
            {errors.projectName?.[0]}
          </span>
          <span className="text-sm text-gray-500">
            {projectName.length}/100
          </span>
        </div>
      </div>
      {!isEditing && projectsCount === 0 && (
        <GoalSelect
          selectedGoal={goalId}
          onGoalSelect={(value) => onChange("goalId", value)}
          userId={userId!}
        />
      )}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-1">
          Description
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Briefly describe your project goals, features, and challenges..."
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
          className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-red-500">
            {errors.description?.[0]}
          </span>
          <span className="text-sm text-gray-500">
            {description.length}/500
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsStep
