import { Card } from "@/components/ui/card"
import { BookOpen, CheckCircle2, Clock, Trophy } from "lucide-react"
import type React from "react" // Added import for React

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: number
  label: string
}

function MetricCard({ icon, title, value, label }: MetricCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[#0C0F12] text-base font-medium">{title}</h3>
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold text-[#0C0F12]">{value}</p>
        <p className="text-[#68696B] text-sm">{label}</p>
      </div>
    </Card>
  )
}

export function MetricCards() {
  const metrics = [
    {
      icon: <Trophy className="text-[#589BFF] w-5 h-5" />,
      title: "Total Skills",
      value: 50,
      label: "Skills mastered",
    },
    {
      icon: <CheckCircle2 className="text-[#1FD167] w-5 h-5" />,
      title: "Verified",
      value: 3,
      label: "Skills verified",
    },
    {
      icon: <Clock className="text-[#FFB020] w-5 h-5" />,
      title: "In Progress",
      value: 3,
      label: "Skills in progress",
    },
    {
      icon: <BookOpen className="text-[#FF4B4B] w-5 h-5" />,
      title: "Learning",
      value: 3,
      label: "Skills to learn",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}

