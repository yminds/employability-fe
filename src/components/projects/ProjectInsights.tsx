import React, { useState, useEffect } from "react"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice"
import logo from "@/assets/skills/e-Logo.svg"
import CircularProgress from "../ui/circular-progress-bar"
import vector from "../../assets/projects/vector.svg"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface Tech {
  name: string;
  _id: string;
}

interface Project {
  status: string;
  score?: number;
  tech: Tech[];
}

interface ProjectData {
  data: Project[];
}

interface SkillPoolId {
  name: string;
}

interface MandatorySkill {
  skill_pool_id: SkillPoolId;
}

interface SkillsData {
  data: {
    mandatory: MandatorySkill[];
  };
}

interface SkillCounts {
  [key: string]: number;
}

interface SkillUsage {
  name: string;
  usageCount: number;
  maxBars: number;
  progress: number;
}

interface ProjectInsightsProps {
  goalId: string;
  userId: string;
  goalDetails: any; // Consider defining a more specific type if possible
  className?: string;
}

const ProjectInsights = ({ userId, goalId, goalDetails, className }: ProjectInsightsProps) => {
  const [skillUsage, setSkillUsage] = useState<SkillUsage[]>([])
  const [totalProjects, setTotalProjects] = useState(0)
  const [averageScore, setAverageScore] = useState(0)

  const user = useSelector((state: RootState) => state.auth.user)

  // Safely access goalData
  const goalData = Array.isArray(goalDetails) && goalDetails.length > 0 ? goalDetails[0] : null

  const [getUserSkills, { data: skillsData, isLoading: skillsLoading }] = useGetUserSkillsMutation()
  const { data: projectDetails, isLoading: projectsLoading } = useGetProjectsByUserIdQuery(userId)

  const fetchSkills = async (userId: string | undefined, goalId: string | null) => {
    try {
      await getUserSkills({ userId, goalId }).unwrap()
    } catch (err) {
      console.error("Error fetching skills:", err)
    }
  }

  useEffect(() => {
    if (userId && goalId) {
      fetchSkills(userId, goalId)
    }
  }, [userId, goalId, getUserSkills])

  // Calculate average score from verified projects
  useEffect(() => {
    if (projectDetails?.data) {
      const verifiedProjects = projectDetails.data.filter((project) => project.status === "Verified")

      if (verifiedProjects.length > 0) {
        const totalScore = verifiedProjects.reduce((sum, project) => sum + (project.score || 0), 0)
        const calculatedAverage = totalScore / verifiedProjects.length
        setAverageScore(Number(calculatedAverage.toFixed(1)))
      }
    }
  }, [projectDetails])

  useEffect(() => {
    if (skillsData?.data?.mandatory && projectDetails?.data) {
      const mandatorySkills = skillsData.data.mandatory.map((skill) => skill.skill_pool_id.name)
      const skillCounts: SkillCounts = mandatorySkills.reduce((acc: SkillCounts, skill) => {
        acc[skill] = 0
        return acc
      }, {})

      const totalProjectCount = projectDetails.data.length
      setTotalProjects(totalProjectCount)

      projectDetails.data.forEach((project) => {
        project.tech.forEach((tech) => {
          if (mandatorySkills.includes(tech.name)) {
            skillCounts[tech.name]++
          }
        })
      })

      const processedSkills = mandatorySkills.map((skill) => ({
        name: skill,
        usageCount: skillCounts[skill],
        maxBars: totalProjectCount,
        progress: (skillCounts[skill] / totalProjectCount) * 100,
      }))

      setSkillUsage(processedSkills)
    }
  }, [skillsData, projectDetails])

  if (!goalData) {
    return <div className="text-gray-600">Loading goal data...</div>
  }

  return (
    <div
      className={`flex flex-col items-start gap-10 p-6 sm:p-8 lg:p-[42px] pb-8 rounded-[9px] border border-black/5 bg-white overflow-y-auto ${className}`}
    >
      <div className="w-full">
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-10">
          <img src={user?.profile_image || "/placeholder.svg"} alt="Profile" className="rounded-full w-16 h-16" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
            <p className="text-gray-600">{goalData.name}</p>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-[#e8f8ee] rounded-lg p-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
              <CircularProgress size={60} strokeWidth={6} showText={false} progress={averageScore * 10} />
              <img className="absolute w-8 h-8" src={logo || "/placeholder.svg"} alt="short logo" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Projects Score</h3>
              <p className="text-3xl font-bold text-gray-800">{averageScore}</p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
            <img className="w-6 h-6" src={vector || "/placeholder.svg"} alt="short logo" />
            Practical Skill Coverage
          </h3>
          <div className="space-y-4">
            {skillsLoading || projectsLoading ? (
              <div className="text-gray-600">Loading skills...</div>
            ) : (
              skillUsage.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  </div>
                  <div className="flex gap-1 w-full">
                    {[...Array(skill.maxBars)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full ${
                          index < skill.usageCount ? "bg-[#1FD167]" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectInsights