import type React from "react"
import { useEffect } from "react"
import { useGetUserSkillsSummaryMutation } from "@/api/skillsApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CheckCircle2, VerifiedIcon } from "lucide-react"
import VerfiedIcon from '../../assets/skills/verified.svg'
import Background from '../../assets/dashboard/Background.svg'
import { useNavigate } from "react-router-dom"

interface CompleteActivityProps {
  displayScore?: boolean
  goalId: string
  goalName:string
}

const CompleteActivityCard: React.FC<CompleteActivityProps> = ({ displayScore = true, goalId,goalName }) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const user_id = user ? user._id : ""
  const navigate = useNavigate()

  const [getUserSkillsSummary, { data: skillsSummaryData }] = useGetUserSkillsSummaryMutation()

  const totalSkills = skillsSummaryData?.data?.totalSkills || "0"
  const totalVerifiedSkills = skillsSummaryData?.data?.totalVerifiedSkills || "0"

  useEffect(() => {
    if (user_id && goalId) {
      getUserSkillsSummary({ userId: user_id, goalId })
    }
  }, [user_id, goalId, getUserSkillsSummary])

  const handleNavigateToProfile = () =>{
    navigate('/user-profile')
  }

  const totalSkillsNum = Number(totalSkills) || 0
  const totalVerifiedSkillsNum = Number(totalVerifiedSkills) || 0
  const averageVerifiedPercentage =
    totalSkillsNum > 0 ? Number.parseFloat(((totalVerifiedSkillsNum / totalSkillsNum) * 100).toFixed(2)) : 0
  const employabilityScore = totalSkillsNum > 0 ? Number.parseFloat((averageVerifiedPercentage / 10).toFixed(1)) : 0

  return (
    <Card 
      className="w-full max-w-sm p-8 space-y-6 bg-white border border-[#d9d9d9]/20 rounded-lg relative overflow-hidden"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-3 relative z-10">
        <Avatar className="h-[42px] w-[42px]">
          <AvatarImage src={user?.profile_image || "/placeholder.svg?height=90&width=90"} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <h2 className="text-h2 text-[#414447]">{user?.name || "User Name"}</h2>
          <p className="text-body2 text-[#909091]">{user?.address?.city || "Location"}</p>
        </div>
      </div>

      <Separator className="bg-[#d9d9d9] relative z-10" />

      {/* Role and Score Section */}
      <div className="space-y-3 relative z-10">
        <h4 className="text-h2 text-[#040609]">{ goalName || 'Full Stack Developer'}</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">{employabilityScore}</span>
              <span className="text-2xl font-medium text-[#00000099]">/10</span>
            </div>
            <img src={VerfiedIcon} className="w-28px h-28px" alt="Verified" />
          </div>
          <p className="text-body2 text-[#414447]">Employability score</p>
        </div>
      </div>

      <Separator className="bg-[#d9d9d9] relative z-10" />

      {/* View Profile Link */}
      <button onClick={handleNavigateToProfile} className="flex items-center gap-1.5 text-[#414447] hover:text-[#000000] transition-colors group relative z-10">
        <span className="text-body2">View my full profile</span>
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center group-hover:bg-[#f5f5f5]">
          <ArrowRight className="w-4 h-4 text-[#666666]" />
        </div>
      </button>
    </Card>
  )
}

export default CompleteActivityCard