"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice"
import logo from "@/assets/skills/e-Logo.svg"
import CircularProgress from "../ui/circular-progress-bar"
import vector from "../../assets/projects/vector.svg"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"


interface Tech {
  name: string
  _id: string
}

interface Project {
  status: string
  score?: number
  tech: Tech[]
}

interface ProjectData {
  data: Project[]
}

interface SkillPoolId {
  name: string
}

interface MandatorySkill {
  skill_pool_id: SkillPoolId
}

interface SkillsData {
  data: {
    mandatory: MandatorySkill[]
  }
}

interface SkillCounts {
  [key: string]: number
}

interface SkillUsage {
  name: string
  usageCount: number
  maxUsage: number
  progress: number
}

interface ProjectInsightsProps {
  goalId: string
  userId: string
  goalDetails: any // Consider defining a more specific type if possible
  className?: string
}

const ProjectInsights: React.FC<ProjectInsightsProps> = ({ userId, goalId, goalDetails, className }) => {
  const [skillUsage, setSkillUsage] = useState<SkillUsage[]>([])
  const [totalProjects, setTotalProjects] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [skillsContainerHeight, setSkillsContainerHeight] = useState("auto")
  const [showScrollbar, setShowScrollbar] = useState(false)

  const skillsContainerRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state: RootState) => state.auth.user)

  // Safely access goalData
  const goalData = Array.isArray(goalDetails) && goalDetails.length > 0 ? goalDetails[0] : null

  const [getUserSkills, { data: skillsData }] = useGetUserSkillsMutation()
  const { data: projectDetails, isLoading: projectsLoading } = useGetProjectsByUserIdQuery(userId)

  const fetchSkills = useCallback(
    async (goalId: string | null) => {
      try {
        await getUserSkills({ userId, goalId }).unwrap()
      } catch (err) {
        console.error("Error fetching skills:", err)
      }
    },
    [getUserSkills, userId, goalId],
  )

  useEffect(() => {
    if (userId && goalId) {
      fetchSkills(goalId)
    }
  }, [userId, goalId, fetchSkills])

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

      const verifiedProjects = projectDetails.data.filter((project) => project.status === "Verified")
      setTotalProjects(verifiedProjects.length)

      verifiedProjects.forEach((project) => {
        project.tech.forEach((tech) => {
          if (mandatorySkills.includes(tech.name)) {
            skillCounts[tech.name]++
          }
        })
      })

      const maxUsage = Math.max(...Object.values(skillCounts))

      const processedSkills = mandatorySkills.map((skill) => ({
        name: skill,
        usageCount: skillCounts[skill],
        maxUsage: maxUsage || 1,
        progress: maxUsage ? (skillCounts[skill] / maxUsage) * 100 : 0,
      }))

      setSkillUsage(processedSkills)
    }
  }, [skillsData, projectDetails])

  useEffect(() => {
    const updateSkillsContainerHeight = () => {
      if (skillsContainerRef.current) {
        const containerTop = skillsContainerRef.current.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        const maxHeight = windowHeight - containerTop - 40
        setSkillsContainerHeight(`${maxHeight}px`)
      }
    }

    updateSkillsContainerHeight()
    window.addEventListener("resize", updateSkillsContainerHeight)

    return () => {
      window.removeEventListener("resize", updateSkillsContainerHeight)
    }
  }, [])

  useEffect(() => {
    if (skillsContainerRef.current) {
      setShowScrollbar(skillsContainerRef.current.scrollHeight > skillsContainerRef.current.clientHeight)
    }
  }, [skillsContainerRef])

  if (!goalData) {
    return <SkeletonLoader />
  }

  return (
    <div className={`bg-white flex flex-col w-[320px] h-[100%] rounded-lg p-[30px] gap-6 ${className}`}>
      <div className="flex items-center gap-2">
        <div>
          <img className="w-[50px] h-[50px] rounded-full" src={user?.profile_image || "/placeholder.svg"} alt="user" />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-[#414447] font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.2px]">
            {user?.name}
          </p>
          <p className="text-[#909091] text-[14px] font-medium leading-[24px] tracking-[-0.2px]">{goalData.name}</p>
        </div>
      </div>

      {/* Projects Score Section */}
      <div className="p-4 w-[100%] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
          <CircularProgress progress={averageScore * 10} size={60} strokeWidth={6} showText={false} />
          <img className="absolute w-8 h-8" src={logo || "/placeholder.svg"} alt="short logo" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{averageScore}</p>
          <p className="text-gray-900 text-sub-header">Projects Score</p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="self-stretch flex-1 overflow-hidden flex flex-col">
        <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-6">
          <img className="w-6 h-6" src={vector || "/placeholder.svg"} alt="short logo" />
          Practical Skill Coverage
        </h3>
        <div
          ref={skillsContainerRef}
          className={`space-y-4 overflow-y-auto ${showScrollbar ? 'minimal-scrollbar p-2' : ""}`}
          style={{ height: skillsContainerHeight }}
        >
          {projectsLoading ? (
            <SkillsSkeleton />
          ) : (
            skillUsage.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-[#1FD167] h-2.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const SkeletonLoader: React.FC = () => (
  <div className="bg-white flex flex-col w-[90%] h-[100%] rounded-lg p-[30px] gap-6 md:mt-0 sm:mt-0">
    <div className="flex items-center gap-2">
      <Skeleton circle={true} width={50} height={50} />
      <div className="flex flex-col items-start">
        <Skeleton width={150} height={20} />
        <Skeleton width={100} height={14} />
      </div>
    </div>

    <Skeleton height={92} className="rounded-lg" />

    <div className="self-stretch flex-1 overflow-hidden flex flex-col">
      <Skeleton width={200} height={24} className="mb-4" />
      <SkillsSkeleton />
    </div>
  </div>
)

const SkillsSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <div key={index} className="mb-4">
        <div className="flex justify-between mb-3">
          <Skeleton width={100} height={16} />
          <Skeleton width={50} height={16} />
        </div>
        <Skeleton height={10} />
      </div>
    ))}
  </>
)

export default ProjectInsights

