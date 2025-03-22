"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useGetPublicProfileQuery } from "@/api/userPublicApiSlice"
import ProfileSkeleton from "../../features/profile/publicProfileSkeleton/profile-skeleton"
import ProfileBanner from "../../features/profile/ProfileBanner"
import SkillsSection from "../../features/profile/SkillsSection"
import ExperienceSection from "../../features/profile/ExperienceSection"
import EducationSection from "../../features/profile/EducationSection"
import CertificationsSection from "../../features/profile/CertificationsSection"
import ProjectList from "@/components/projects/ProjectList"
import ProfileBannerMobile from "../../features/profile/ProfileBannerMobile"
import FeaturedInterviewSection from "../../features/profile/FeaturedInterviewSection"

interface CandidateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  username: string | null
}

const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({ isOpen, onClose, username }) => {
  const { data: profile, isLoading } = useGetPublicProfileQuery({ username }, { skip: !username || !isOpen })

  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        setIsRendered(true)
      }, 50)
    } else {
      // Reset when closed
      document.body.style.overflow = ""
      setIsRendered(false)
    }

    return () => {
      // Cleanup
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const completedProjects = profile?.projects?.filter((project: any) => project.status !== "Incomplete") || []

  const bio = profile?.bio || ""

  const handleEdit = () => {
    console.log("")
  }

  // Render the right section components
  const renderRightSectionComponents = () => (
    <>
      {profile?.featuredInterview && (
        <FeaturedInterviewSection
          existingFeaturedInterview={profile?.featuredInterview}
          username={profile?.username}
          isPublic={true}
        />
      )}
    </>
  )

  // Render main content sections
  const renderMainContentSections = () => (
    <>
      {profile?.skills?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 p-8 sm:p-5 overflow-y-auto overflow-x-auto max-h-3xl relative">
          <SkillsSection skills={profile.skills} isPublic={true} username={username || ""} />
        </div>
      )}

      {completedProjects.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl relative">
          <ProjectList
            projects={completedProjects}
            isLoading={false}
            isDashboard={true}
            isPublic={true}
            onOpenUploadModal={() => {}}
            onOpenDeleteModal={() => {}}
          />
        </div>
      )}

      {profile?.experience?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <ExperienceSection intialExperiences={profile.experience} isPublic={true} />
        </div>
      )}

      {profile?.education?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <EducationSection initialEducation={profile.education} isPublic={true} />
        </div>
      )}

      {profile?.certificates?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <CertificationsSection certifications={profile.certificates} isPublic={true} />
        </div>
      )}
    </>
  )

  // If not open, don't render anything
  if (!isOpen) return null

  // Create overlay and side modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isRendered ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Side Modal - Fixed at 50% width and positioned on the right half of the screen */}
      <div
        className={`absolute top-8 bottom-8 right-0 bg-white shadow-xl overflow-hidden transition-transform duration-300 ease-in-out rounded-l-lg`}
        style={{
          width: "50%",
          transform: isRendered ? "translateX(0)" : "translateX(100%)",
        }}
      >

        {/* Content */}
        <div className="h-[calc(100%-64px)] overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="p-4">
              <ProfileSkeleton />
            </div>
          ) : profile ? (
            <div className="w-full max-w-screen-xl mx-auto p-4">
              {/* Mobile Layout */}
              <div className="lg:hidden xl:hidden 2xl:hidden">
                <div className="mb-6">
                  <ProfileBannerMobile
                    user={profile}
                    bio={bio}
                    onBioUpdate={handleEdit}
                    isPublic={true}
                    goalData={""}
                  />
                </div>
                {/* Mobile Right Section Components */}
                <div className="space-y-6 mb-6">{renderRightSectionComponents()}</div>

                {/* Main Content Sections */}
                <div className="space-y-6">{renderMainContentSections()}</div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid xl:grid 2xl:grid grid-cols-10 gap-6 max-w-5xl mx-auto">
                <div className={`flex flex-col ${profile?.featuredInterview ? "col-span-7" : "col-span-10"}`}>
                  <div className="">
                    <ProfileBanner user={profile} bio={bio} onBioUpdate={handleEdit} isPublic={true} goalData={""} />
                  </div>

                  {/* Main Content Sections */}
                  <div className="space-y-6">{renderMainContentSections()}</div>
                </div>
                {/* Right Section */}
                <div className="flex flex-col space-y-6 flex-1 col-span-3 ">{renderRightSectionComponents()}</div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">Could not load profile</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateProfileModal

