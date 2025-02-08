import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Components
import UnifiedUploadModal from "@/components/modal/UnifiedUploadModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";

// Assets
import AddPictureimg from "@/assets/dashboard/add_picture.svg";
import Addbioimg from "@/assets/dashboard/add_bio.svg";
import AddEducationImg from "@/assets/dashboard/add_education.svg";

// Types and API
import type { RootState } from "@/store/store";
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "@/api/userApiSlice";
import type { ProfileFormData } from "@/features/profile/types";

interface SectionState {
  completed: boolean;
  skipped?: boolean;
}

interface Sections {
  basicInfo: SectionState;
  experience: SectionState;
  education: SectionState;
  certification: SectionState;
}

interface CardType {
  image: string;
  alt: string;
  description: string;
  buttonText: string;
  route: string;
  secondaryAction?: {
    text: string;
    route?: string;
    onSkip?: () => void;
  };
  isOptional?: boolean;
  progressSection?: keyof Sections;
}

const TryThingsSection: React.FC = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [profileProgress, setProfileProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentProfileSection, setCurrentProfileSection] =
    useState<string>("");

  const [sections, setSections] = useState<Sections>({
    basicInfo: { completed: false },
    experience: { completed: false, skipped: false },
    education: { completed: false },
    certification: { completed: false, skipped: false },
  });

  // Get user ID and data
  const userId = useSelector((state: RootState) => state.auth?.user?._id)
  const { data: goalsData } = useGetUserGoalQuery(userId || "")
  const {data:userDetails,refetch:refetchUserDetails} = useGetUserDetailsQuery(userId || "",{
    refetchOnMountOrArgChange:true
  })
  console.log("data:", userDetails.data);
  const [updateUser] = useUpdateUserMutation()

  const goalId = goalsData?.data?.[0]?._id || ""

  // Check if basic info is complete
  const isBasicInfoComplete = (user: any) => {
    return !!(
      user?.name &&
      user?.email &&
      user?.phone_number &&
      user?.gender &&
      user?.address?.country &&
      user?.address?.state &&
      user?.address?.city
    );
  };

  // Check if experience section is complete
  const isExperienceComplete = (user: any) => {
    if (user?.is_experienced === false) {
      return true // Fresher case
    }
    return Array.isArray(user?.experience) && user.experience.length > 0
  }

  // Check if education section is complete
  const isEducationComplete = (user: any) => {
    return Array.isArray(user?.education) && user.education.length > 0
  }

  // Check if certification section is complete
  const isCertificationComplete = (user: any) => {
    if (user?.has_certificates === false) {
      return true // No certificates case
    }
    return Array.isArray(user?.certificates) && user.certificates.length > 0
  }

  // Check if parsed resume has data for a section
  const hasParsedResumeData = (section: string) => {
    const parsedResume = userDetails?.data?.parsedResume
    if (!parsedResume) return false

    switch (section) {
      case "basicInfo":
        return !!(
          parsedResume.name ||
          parsedResume.contact?.email ||
          parsedResume.contact?.phone ||
          parsedResume.address.country ||
          parsedResume.address.city ||
          parsedResume.address.state ||
          parsedResume.gender
        );
      case "experience":
        return (
          Array.isArray(parsedResume.experience) &&
          parsedResume.experience.length > 0
        );
      case "education":
        return (
          Array.isArray(parsedResume.education) &&
          parsedResume.education.length > 0
        );
      case "certification":
        return (
          Array.isArray(parsedResume.certifications) &&
          parsedResume.certifications.length > 0
        );
      default:
        return false;
    }
  };

  // Get button text based on section status
  const getButtonText = (section: string, defaultText: string) => {
    if (!isComplete(section) && hasParsedResumeData(section)) {
      return `Review ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    }
    return defaultText;
  };

  // Helper function to check if a section is complete
  const isComplete = (section: string) => {
    const user = userDetails.data
    switch (section) {
      case "basicInfo":
        return isBasicInfoComplete(user);
      case "experience":
        return isExperienceComplete(user);
      case "education":
        return isEducationComplete(user);
      case "certification":
        return isCertificationComplete(user);
      default:
        return false;
    }
  };

  // Calculate profile completion progress
  useEffect(() => {
    if (userDetails) {
      const user = userDetails.data
      let progress = 0

      if (isBasicInfoComplete(user)) {
        progress += 25
        setSections((prev) => ({
          ...prev,
          basicInfo: { completed: true },
        }))
      }

      if (isExperienceComplete(user)) {
        progress += 25
        setSections((prev) => ({
          ...prev,
          experience: { completed: true },
        }))
      }

      if (isEducationComplete(user)) {
        progress += 25
        setSections((prev) => ({
          ...prev,
          education: { completed: true },
        }))
      }

      if (isCertificationComplete(user)) {
        progress += 25
        setSections((prev) => ({
          ...prev,
          certification: { completed: true },
        }))
      }

      setProfileProgress(progress)
    }
  }, [userDetails])

  const handleLinkClick = (route: string) => {
    if (route === "/upload-resume") {
      setShowUploadModal(true);
      return;
    }

    const routeToSection: { [key: string]: string } = {
      "/basic-info": "basic",
      "/add-experience": "experience",
      "/add-education": "education",
      "/add-certification": "certification",
    };

    const section = routeToSection[route];
    if (section) {
      setCurrentProfileSection(section);
      setShowProfileModal(true);
    }
  };

  const handleFresherClick = async () => {
    if (userId) {
      try {
        await updateUser({
          userId,
          data: {
            has_resume: false,
          },
        })
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleProfileSave = (data: ProfileFormData) => {
    console.log("Saving profile data:", data)
    setShowProfileModal(false)
  }

  const handleCardAction = (progressSection: keyof Sections | undefined) => {
    if (progressSection) {
      setSections((prev) => ({
        ...prev,
        [progressSection]: { completed: true, skipped: false },
      }));
    }
  };

  const getCards = (): CardType[] => {
    const defaultCards = []
    const user = userDetails.data
    // Only add Basic Info card if user doesn't have basic info
    if (
      !user?.name ||
      !user?.email ||
      !user?.phone_number ||
      !user?.gender ||
      !user?.address?.country ||
      !user?.address?.state ||
      !user?.address?.city
    ) {
      defaultCards.push({
        image: Addbioimg,
        alt: "Basic Info",
        description:
          "Add your personal and contact details to complete your profile basics.",
        buttonText: getButtonText("basicInfo", "Add Basic Info"),
        route: "/basic-info",
        progressSection: "basicInfo",
      });
    }

    // Only add Experience card if user doesn't have experience and hasn't indicated they're a fresher
    if (user?.is_experienced !== false && (!user?.experience || user.experience.length === 0)) {
      defaultCards.push({
        image: AddEducationImg,
        alt: "Experience",
        description:
          "Share your work experience or indicate if you're just starting your career.",
        buttonText: getButtonText("experience", "Add Experience"),
        route: "/add-experience",
        isOptional: true,
        progressSection: "experience",
      });
    }

    // Only add Education card if user doesn't have education entries
    if (!user?.education || user.education.length === 0) {
      defaultCards.push({
        image: AddEducationImg,
        alt: "Education",
        description: "Add your educational qualifications (required).",
        buttonText: getButtonText("education", "Add Education"),
        route: "/add-education",
        progressSection: "education",
      });
    }

    // Only add Certification card if user hasn't indicated no certificates and doesn't have any certificates
    if (user?.has_certificates !== false && (!user?.certificates || user.certificates.length === 0)) {
      defaultCards.push({
        image: AddPictureimg,
        alt: "Certification",
        description: "Add any relevant certifications to enhance your profile.",
        buttonText: getButtonText("certification", "Add Certification"),
        route: "/add-certification",
        isOptional: true,
        progressSection: "certification",
      });
    }

    // Only add resume card if user hasn't uploaded a resume and hasn't indicated they don't have one
    if (
      user.has_resume !== false &&
      (!user.parsedResume || Object.keys(user.parsedResume).length === 0)
    ) {
      defaultCards.unshift({
        image: AddPictureimg,
        alt: "Resume",
        description:
          "Upload your resume or create a new one to showcase your professional background.",
        buttonText: "Upload Resume",
        route: "/upload-resume",
        secondaryAction: {
          text: "I don't have a resume",
          onSkip: handleFresherClick,
        },
        isOptional: true,
      });
    }

    return defaultCards;
  };

  const cards = getCards()
  const visibleCards = cards.slice(startIndex, startIndex + 3)
  const canScrollLeft = startIndex > 0
  const canScrollRight = startIndex + 3 < cards.length

  const handlePrevClick = () => {
    if (canScrollLeft) {
      setStartIndex((prev) => prev - 1)
    }
  };

  const handleNextClick = () => {
    if (canScrollRight) {
      setStartIndex((prev) => prev + 1)
    }
  };

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
          <p className="text-gray-500 text-body2">{card.description}</p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-2 mt-4">
      {card.alt === "Resume" && card.secondaryAction && (
          <button
            className="text-gray-500 text-button hover:text-gray-700"
            onClick={() => {
              if (card.secondaryAction?.onSkip) {
                card.secondaryAction.onSkip();
              }
            }}
          >
            {card.secondaryAction.text}
          </button>
        )}
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
      </div>
    </div>
  );

  return (
    <section className="flex flex-col items-start gap-2 self-stretch">
      <h5 className="text-black text-h2">
        Complete your Basic Details
      </h5>
      {profileProgress < 100 && (
        <div className="flex flex-col gap-1  w-full">
          <div className="flex items-center gap-3 self-stretch">
            <div className="relative w-full bg-[#FAFAFA] rounded-full h-[6px]">
              <div
                className="bg-[#1FD167] h-[6px] rounded-full transition-all duration-300"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
            <span className="text-[#1FD167] font-medium">
              {profileProgress}%
            </span>
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="text-black text-body2">
              Employers are <span className="text-[#03963F]">3 times</span> more likely to hire a candidate with a complete
              basic details.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handlePrevClick}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full  ${
                  canScrollLeft ? "text-gray-700 hover:bg-gray-50" : "text-gray-300"
                }`}
                aria-label="Previous cards"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextClick}
                disabled={!canScrollRight}
                className={`p-2 rounded-full  ${
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
          // refetchUserDetails={refetchUserDetails}
        />
      )}

      {/* Upload Modal */}

      {showUploadModal && (
        <UnifiedUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        userId={userId || ""}
        goalId={goalId}
      />
      )}
    </section>
  );
};

export default TryThingsSection;
