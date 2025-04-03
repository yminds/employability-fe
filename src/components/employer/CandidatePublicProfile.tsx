import type React from "react";
import { useEffect, useState } from "react";
import { useGetPublicProfileQuery } from "@/api/userPublicApiSlice";
import ProfileSkeleton from "../../features/profile/publicProfileSkeleton/profile-skeleton";
import SkillsSection from "../../features/profile/SkillsSection";
import ExperienceSection from "../../features/profile/ExperienceSection";
import EducationSection from "../../features/profile/EducationSection";
import CertificationsSection from "../../features/profile/CertificationsSection";
import ProjectList from "@/components/projects/ProjectList";
import ProfileBannerMobile from "../../features/profile/ProfileBannerMobile";
import FeaturedInterviewSection from "../../features/profile/FeaturedInterviewSection";

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
}

const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  const { data: profile, isLoading } = useGetPublicProfileQuery(
    { username },
    { skip: !username || !isOpen }
  );

  const [isRendered, setIsRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";
      timeoutId = setTimeout(() => {
        setIsRendered(true);
      }, 50);
    } else {
      setIsRendered(false);
      document.body.style.overflow = "";
      timeoutId = setTimeout(() => {
        setVisible(false);
      }, 300);
    }

    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const completedProjects =
    profile?.projects?.filter(
      (project: any) => project.status !== "Incomplete"
    ) || [];

  const bio = profile?.bio || "";

  const handleEdit = () => {
    console.log("");
  };

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
  );

  // Render main content sections
  const renderMainContentSections = () => (
    <>
      {profile?.skills?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 p-8 sm:p-5 overflow-y-auto overflow-x-auto max-h-3xl relative">
          <SkillsSection
            skills={profile.skills}
            isPublic={true}
            username={username || ""}
          />
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
          <ExperienceSection
            intialExperiences={profile.experience}
            isPublic={true}
          />
        </div>
      )}

      {profile?.education?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <EducationSection
            initialEducation={profile.education}
            isPublic={true}
          />
        </div>
      )}

      {profile?.certificates?.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <CertificationsSection
            certifications={profile.certificates}
            isPublic={true}
          />
        </div>
      )}
    </>
  );

  // If not visible, don't render anything
  if (!visible) return null;

  // Create overlay and side modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isRendered ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Side Modal - Fixed at 50% width and positioned on the right half of the screen */}
      <div
        className={`absolute top-8 bottom-8 right-4 bg-white shadow-xl overflow-hidden transform transition-transform duration-300 ease-in-out rounded-lg`}
        style={{
          width: "30%",
          transform: isRendered ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Content */}
        <div className="h-full overflow-y-auto scrollbar-hide bg-[#F5F5F5]">
          {isLoading ? (
            <div className="p-4">
              <ProfileSkeleton />
            </div>
          ) : profile ? (
            <div className="w-full max-w-screen-xl mx-auto p-4">
              {/* Desktop Layout */}
              <div>
                <div className="mb-4">
                  <ProfileBannerMobile
                    user={profile}
                    bio={bio}
                    onBioUpdate={handleEdit}
                    isPublic={true}
                  />
                </div>
                {/* Mobile Right Section Components */}
                <div className="space-y-4 mb-4">
                  {renderRightSectionComponents()}
                </div>

                {/* Main Content Sections */}
                <div className="space-y-4">{renderMainContentSections()}</div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Could not load profile
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;
