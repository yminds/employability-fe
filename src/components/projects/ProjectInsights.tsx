import { useGetUserSkillDetailsQuery } from "@/api/skillsApiSlice"
import { useState, useEffect } from "react"

interface ProjectInsightsProps{
  goalId:string,
  user_id:string
}

export default function ProjectInsights({}:ProjectInsightsProps) {
  const [containerHeight, setContainerHeight] = useState("auto")

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight
      setContainerHeight(`${vh - 48}px`) // Subtracting 48px for potential padding
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])


  const skills = [
    { name: "JavaScript", progress: 100 },
    { name: "React.js", progress: 100 },
    { name: "Node.js", progress: 100 },
    { name: "Vue.js", progress: 75 },
    { name: "Angular", progress: 50 },
    { name: "Python", progress: 75 },
    { name: "Ruby", progress: 50 },
    { name: "Spring", progress: 50 },
    { name: "Laravel", progress: 75 },
    { name: "Swift", progress: 50 },
    { name: "HTML", progress: 75 },
  ]

  return (
    <div
      className="flex flex-col items-start gap-10 p-[42px] pb-8 rounded-[9px] border border-black/5 bg-white overflow-y-scroll scrollbar-hide"
      style={{ height: containerHeight }}
    >
      <div className="w-full">
        <div className="flex items-center gap-4 mb-10">
          <img
            src="/placeholder.svg?height=64&width=64"
            alt="Matthew Johns"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Matthew Johns</h2>
            <p className="text-gray-600">Full stack developer</p>
          </div>
        </div>

        <div className="bg-[#e8f8ee] rounded-lg p-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#01ff85] stroke-[3]"
                  strokeDasharray="100 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">e</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Projects Score</h3>
              <p className="text-3xl font-bold text-gray-800">9.2</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.75 12H20.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.75 6H20.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.75 18H20.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Practical Skill Coverage
          </h3>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                </div>
                <div className="flex gap-1 w-full">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full ${
                        index < Math.ceil((skill.progress / 100) * 4) ? "bg-[#01ff85]" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

