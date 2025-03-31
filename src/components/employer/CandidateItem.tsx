import type React from "react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { currentStatusSVG } from "../../features/profile/svg/currentStatusSVG"
import verified from "../../assets/skills/verified.svg"
import CandidateProfileModal from "./CandidatePublicProfile"

interface Candidate {
  user_id: string
  username: string
  profile_image?: string
  name: string
  current_status?: string
  experience_level?: string
  email: string
  averageRating?: number
  verifiedSkillCount?: number
  matchedSkillCount?: number
  location: {
    country: string
    state: string
    city: string
  }
  matchPercentage: number
  userGoals?: string[] // Added userGoals field
}

interface CandidateItemProps {
  candidate: Candidate
  isChecked: boolean
  onCheckChange: (userId: string, checked: boolean) => void
}

const CandidateItem: React.FC<CandidateItemProps> = ({ candidate, isChecked, onCheckChange }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleCandidateClick = () => {
    setIsProfileModalOpen(true)
  }

  // Determine if the score is based entirely on verified ratings or includes self ratings
  const hasVerifiedSkills = candidate.verifiedSkillCount && candidate.verifiedSkillCount > 0
  const hasSelfRatedSkills =
    candidate.matchedSkillCount &&
    candidate.verifiedSkillCount !== undefined &&
    candidate.matchedSkillCount > candidate.verifiedSkillCount

  return (
    <>
      <div
        className="flex items-center px-4 py-4 border-b border-[#d6d7d9] hover:bg-[#f9fafc] cursor-pointer"
        onClick={handleCandidateClick}
      >
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => onCheckChange(candidate.user_id, !!checked)}
          className="mr-4 h-4 w-4
            data-[state=checked]:bg-[#001630] 
            data-[state=checked]:border-[#001630]
            data-[state=checked]:text-white"
          onClick={(e) => e.stopPropagation()} // Prevent triggering the parent div's click
        />
        <div className="flex items-center flex-1">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-[#10b754]">
            {/* Profile Image */}
            {candidate.profile_image ? (
              <img
                src={candidate.profile_image || "/placeholder.svg"}
                alt={candidate.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 font-semibold text-lg">
                {candidate.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* If "Actively seeking" status => show green semicircle */}
            {candidate.current_status === "Actively seeking job" && (
              <div className="absolute transform scale-[0.4] origin-bottom">{currentStatusSVG}</div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-[#0c0f12]">{candidate.name}</h3>
            </div>
            <div className="flex flex-col">
              {/* Display user goals if available */}
              {candidate.userGoals && candidate.userGoals.length > 0 && (
                <p className="text-sm text-[#68696b]">{candidate.userGoals[0]}</p>
              )}

              {candidate.location?.city && candidate.location?.state && (
                <p className="text-sm text-[#68696b]">{`${candidate.location.city}, ${candidate.location.state}`}</p>
              )}
            </div>
          </div>

          {/* Fixed-width container for both scores to ensure alignment */}
          <div className="flex items-center justify-end w-72 space-x-12">
            {/* Employability Score - fixed width */}
            <div className="w-32">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                    <div className="text-center">
                      {hasVerifiedSkills ? (
                        <>
                          <div className="flex items-center justify-center">
                            <span className="text-m font-medium">
                              {typeof candidate.averageRating === "number" 
                                ? candidate.averageRating === 10 
                                  ? "10" 
                                  : candidate.averageRating.toFixed(1) 
                                : "0.0"}
                            </span>
                            <span className="text-sm text-[#909091]">/10</span>
                            <img src={verified || "/placeholder.svg"} alt="verified" className="w-4 h-4 ml-1" />
                          </div>
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-[#414447]">Employability score</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-center">
                            <span className="text-sm text-[#909091]">No verified ratings</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-[#414447]">Skills not assessed</span>
                          </div>
                        </>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {hasVerifiedSkills
                        ? hasSelfRatedSkills
                          ? "Calculated from verified ratings (70% weight) and self-assessments (30% weight)"
                          : "Average verified rating across all matched skills"
                        : "This candidate has no verified skill assessments"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Match Percentage - fixed width with highlighted appearance */}
            <div className="w-24 text-center p-2">
              <div className="text-xl font-bold text-[#10b754]">{Math.round(candidate.matchPercentage)}%</div>
              <div className="text-xs text-[#414447]">Match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <CandidateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        username={candidate.username}
      />
    </>
  )
}

export default CandidateItem