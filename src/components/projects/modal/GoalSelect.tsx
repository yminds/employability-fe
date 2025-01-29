import React from 'react'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetUserGoalQuery } from '@/api/predefinedGoalsApiSlice'

interface GoalSelectProps {
  selectedGoal: string
  onGoalSelect: (goalId: string) => void
  userId: string | undefined
}

const GoalSelect: React.FC<GoalSelectProps> = ({ selectedGoal, onGoalSelect, userId }) => {
  const { data: goalsData, isLoading, error } = useGetUserGoalQuery(userId ?? 'skip')
  const goals = goalsData?.data || []

  if (!userId) return null

  if (isLoading) {
    return <div className="space-y-2">
      <Label>Loading goals...</Label>
      <Select disabled>
        <SelectTrigger><SelectValue placeholder="Loading..." /></SelectTrigger>
      </Select>
    </div>
  }

  if (error) {
    return <div className="space-y-2">
      <Label>Error loading goals</Label>
      <Select disabled>
        <SelectTrigger><SelectValue placeholder="Failed to load goals" /></SelectTrigger>
      </Select>
    </div>
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="goal" className="flex items-center gap-1">
        Select Goal<span className="text-red-500">*</span>
      </Label>
      <Select value={selectedGoal} onValueChange={onGoalSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a goal for this project" />
        </SelectTrigger>
        <SelectContent>
          {goals.map((goal) => (
            <SelectItem key={goal._id} value={goal._id}>
              {goal.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default GoalSelect