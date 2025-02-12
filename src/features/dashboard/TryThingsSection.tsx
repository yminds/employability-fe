import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Components
import UnifiedUploadModal from "@/components/modal/UnifiedUploadModal"
import CompleteProfileModal from "@/components/modal/CompleteProfileModal"

// Assets
import AddPictureimg from "@/assets/dashboard/add_picture.svg"
import Addbioimg from "@/assets/dashboard/add_bio.svg"
import AddEducationImg from "@/assets/dashboard/add_education.svg"

// Types and API
import type { RootState } from "@/store/store"
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice"
import { useGetUserDetailsQuery, useUpdateUserMutation } from "@/api/userApiSlice"
import type { ProfileFormData } from "@/features/profile/types"

interface SectionState {
  completed: boolean
  skipped?: boolean
}

interface Sections {
  basicInfo: SectionState
  experience: SectionState
  education: SectionState
  certification: SectionState
}

interface CardType {
  image: string
  alt: string
  description: string
  buttonText: string
  route: string
  secondaryAction?: {
    text: string
    route?: string
    onSkip?: () => void
  }
  isOptional?: boolean
  progressSection?: keyof Sections
}

const TryThingsSection: React.FC = () => {
  const navigate = useNavigate()
  const [startIndex, setStartIndex] = useState(0)
  const [profileProgress, setProfileProgress] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [currentProfileSection, setCurrentProfileSection] = useState<string>("")

  const [sections, setSections] = useState<Sections>({
    basicInfo: { completed: false },
    experience: { completed: false, skipped: false },
    education: { completed: false },
    certification: { completed: false, skipped: false },
  })

  // Get user ID and data with enhanced query configuration
  const userId = useSelector((state: RootState) => state.auth?.user?._id)
  const { data: goalsData } = useGetUserGoalQuery(userId || "")
  const { 
    data: userData, 
    refetch: refetchUserDetails,
    isFetching 
  } = useGetUserDetailsQuery(userId || "", {
    refetchOnMountOrArgChange: true,
    skip: !userId,
  })

  const [updateUser] = useUpdateUserMutation()
  const goalId = goalsData?.data?.[0]?._id || ""

  // Utility functions for checking completion status
  const isBasicInfoComplete = (user: any): boolean => {
    return !!(
      user?.name &&
      user?.email &&
      user?.phone_number &&
      user?.gender &&
      user?.address?.country &&
      user?.address?.state &&
      user?.address?.city
    )
  }

  const isExperienceComplete = (user: any): boolean => {
    if (user?.is_experienced === false) return true
    return Array.isArray(user?.experience) && user.experience.length > 0
  }

  const isEducationComplete = (user: any): boolean => {
    return Array.isArray(user?.education) && user.education.length > 0
  }

  const isCertificationComplete = (user: any): boolean => {
    if (user?.has_certificates === false) return true
    return Array.isArray(user?.certificates) && user.certificates.length > 0
  }

  const hasParsedResumeData = (section: string): boolean => {
    const parsedResume = userData?.data?.parsedResume
    if (!parsedResume) return false

    switch (section) {
      case "basicInfo":
        return !!(
          parsedResume.name ||
          parsedResume.contact?.email ||
          parsedResume.contact?.phone ||
          parsedResume.address?.country ||
          parsedResume.address?.city ||
          parsedResume.address?.state ||
          parsedResume.gender
        )
      case "experience":
        return Array.isArray(parsedResume.experience) && parsedResume.experience.length > 0
      case "education":
        return Array.isArray(parsedResume.education) && parsedResume.education.length > 0
      case "certification":
        return Array.isArray(parsedResume.certifications) && parsedResume.certifications.length > 0
      default:
        return false
    }
  }

  const getButtonText = (section: string, defaultText: string): string => {
    if (!isComplete(section) && hasParsedResumeData(section)) {
      return `Review ${section.charAt(0).toUpperCase() + section.slice(1)}`
    }
    return defaultText
  }

  const isComplete = (section: string): boolean => {
    const user = userData?.data
    if (!user) return false

    switch (section) {
      case "basicInfo":
        return isBasicInfoComplete(user)
      case "experience":
        return isExperienceComplete(user)
      case "education":
        return isEducationComplete(user)
      case "certification":
        return isCertificationComplete(user)
      default:
        return false
    }
  }

  // Calculate profile completion progress
  const calculateProfileProgress = (user: any) => {
    let progress = 0

    if (isBasicInfoComplete(user)) {
      progress += 25
      setSections(prev => ({
        ...prev,
        basicInfo: { completed: true },
      }))
    }

    if (isExperienceComplete(user)) {
      progress += 25
      setSections(prev => ({
        ...prev,
        experience: { completed: true },
      }))
    }

    if (isEducationComplete(user)) {
      progress += 25
      setSections(prev => ({
        ...prev,
        education: { completed: true },
      }))
    }

    if (isCertificationComplete(user)) {
      progress += 25
      setSections(prev => ({
        ...prev,
        certification: { completed: true },
      }))
    }

    setProfileProgress(progress)
  }

  // Effect to recalculate progress when data changes
  useEffect(() => {
    if (!isFetching && userData?.data) {
      calculateProfileProgress(userData.data)
    }
  }, [userData, isFetching])

  const handleLinkClick = (route: string) => {
    if (route === "/upload-resume") {
      setShowUploadModal(true)
      return
    }

    const routeToSection: { [key: string]: string } = {
      "/basic-info": "basic",
      "/add-experience": "experience",
      "/add-education": "education",
      "/add-certification": "certification",
    }

    const section = routeToSection[route]
    if (section) {
      setCurrentProfileSection(section)
      setShowProfileModal(true)
    }
  }

  const handleFresherClick = async () => {
    if (userId) {
      try {
        await updateUser({
          userId,
          data: {
            has_resume: false,
          },
        })
        // Double refetch pattern to ensure data is updated
        await refetchUserDetails()
        setTimeout(async () => {
          await refetchUserDetails()
        }, 1000)
      } catch (error) {
        console.error("Error updating user:", error)
      }
    }
  }

  const handleProfileSave = async (data: ProfileFormData) => {
    try {
      console.log("Saving profile data:", data)
      setShowProfileModal(false)
      
      // Double refetch pattern to ensure data is updated
      await refetchUserDetails()
      setTimeout(async () => {
        await refetchUserDetails()
      }, 1000)
      
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleCardAction = (progressSection: keyof Sections | undefined) => {
    if (progressSection) {
      setSections(prev => ({
        ...prev,
        [progressSection]: { completed: true, skipped: false },
      }))
    }
  }

  const getCards = (): CardType[] => {
    const user = userData?.data
    const defaultCards: CardType[] = []

    if (!user) return defaultCards

    // Add cards only if sections are incomplete
    if (!isBasicInfoComplete(user)) {
      defaultCards.push({
        image: Addbioimg,
        alt: "Basic Info",
        description: "Add your personal and contact details to complete your profile basics.",
        buttonText: getButtonText("basicInfo", "Add Basic Info"),
        route: "/basic-info",
        progressSection: "basicInfo",
      })
    }

    if (user?.is_experienced !== false && !isExperienceComplete(user)) {
      defaultCards.push({
        image: AddEducationImg,
        alt: "Experience",
        description: "Share your work experience or indicate if you're just starting your career.",
        buttonText: getButtonText("experience", "Add Experience"),
        route: "/add-experience",
        isOptional: true,
        progressSection: "experience",
      })
    }

    if (!isEducationComplete(user)) {
      defaultCards.push({
        image: AddEducationImg,
        alt: "Education",
        description: "Add your educational qualifications (required).",
        buttonText: getButtonText("education", "Add Education"),
        route: "/add-education",
        progressSection: "education",
      })
    }

    if (user?.has_certificates !== false && !isCertificationComplete(user)) {
      defaultCards.push({
        image: AddPictureimg,
        alt: "Certification",
        description: "Add any relevant certifications to enhance your profile.",
        buttonText: getButtonText("certification", "Add Certification"),
        route: "/add-certification",
        isOptional: true,
        progressSection: "certification",
      })
    }

    if (
      user?.has_resume !== false &&
      (!user?.parsedResume || Object.keys(user.parsedResume).length === 0)
    ) {
      defaultCards.unshift({
        image: AddPictureimg,
        alt: "Resume",
        description: "Upload your resume or create a new one to showcase your professional background.",
        buttonText: "Upload Resume",
        route: "/upload-resume",
        secondaryAction: {
          text: "I don't have a resume",
          onSkip: handleFresherClick,
        },
        isOptional: true,
      })
    }

    return defaultCards
  }

  // Memoize cards to prevent unnecessary recalculations
  const cards = useMemo(() => getCards(), [userData, sections])
  const visibleCards = cards.slice(startIndex, startIndex + 3)
  const canScrollLeft = startIndex > 0
  const canScrollRight = startIndex + 3 < cards.length

  const handlePrevClick = () => {
    if (canScrollLeft) {
      setStartIndex(prev => prev - 1)
    }
  }

  const handleNextClick = () => {
    if (canScrollRight) {
      setStartIndex(prev => prev + 1)
    }
  }

  const renderCard = (card: CardType, index: number) => (
    <div
      key={index}
      className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col justify-between h-full relative"
    >
      <div className="flex flex-col gap-8">
        <div className="h-[100px]">
          <img
            src={card.image || "/placeholder.svg"}
            alt={card.alt}
            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <p className="text-gray-500 text-body2">
            {card.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-2 mt-4">
        <button
          className="flex w-full p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-button hover:bg-gray-50"
          onClick={() => {
            handleLinkClick(card.route)
            if (card.progressSection) {
              handleCardAction(card.progressSection)
            }
          }}
        >
          {card.buttonText}
        </button>
        {card.alt === "Resume" && card.secondaryAction && (
          <button
            className="text-gray-500 text-button hover:text-gray-700"
            onClick={() => {
              if (card.secondaryAction?.onSkip) {
                card.secondaryAction.onSkip()
              }
            }}
          >
            {card.secondaryAction.text}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <section className="flex flex-col items-start gap-2 self-stretch">
      <h5 className="text-black text-h2">
        Complete your profile
      </h5>
      {profileProgress < 100 && (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-3 self-stretch">
            <div className="relative w-full bg-[#FAFAFA] rounded-full h-[6px]">
              <div
                className="bg-[#1FD167] h-[6px] rounded-full transition-all duration-300"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
            <span className="text-[#1FD167] font-medium">{profileProgress}%</span>
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="text-black text-body2">
              Employers are <span className="text-[#03963F]">3 times</span> more likely to hire a candidate with a complete
              profile.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handlePrevClick}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full ${
                  canScrollLeft ? "text-gray-700 hover:bg-gray-50" : "text-gray-300"
                }`}
                aria-label="Previous cards"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextClick}
                disabled={!canScrollRight}
                className={`p-2 rounded-full ${
                  canScrollRight ? "text-gray-700 hover:bg-gray-50" : "text-gray-300"
                }`}
                aria-label="Next cards"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative w-full">
        <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full">
          {visibleCards.map((card, index) => renderCard(card, index))}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <CompleteProfileModal
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileSave}
          type={currentProfileSection}
          userId={userId || ""}
          isParsed={hasParsedResumeData(currentProfileSection)}
          goalId={goalId}
        />
      )}

      {/* Upload Modal */}
      <UnifiedUploadModal
        isOpen={showUploadModal}
        onClose={async () => {
          setShowUploadModal(false)
          // Double refetch pattern to ensure data is updated
          await refetchUserDetails()
          setTimeout(async () => {
            await refetchUserDetails()
          }, 1000)
        }}
        userId={userId || ""}
        goalId={goalId}
      />
    </section>
  )
}

export default TryThingsSection