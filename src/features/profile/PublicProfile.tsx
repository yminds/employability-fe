import type React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  useGetPublicProfileQuery,
  useGetPublicProfileViewCountMutation,
} from "@/api/userPublicApiSlice";
import ProfileBanner from "./ProfileBanner";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import ProjectList from "@/components/projects/ProjectList";
import ProfileBannerMobile from "./ProfileBannerMobile";
import { useEffect } from "react";
import ProfileSkeleton from "./publicProfileSkeleton/profile-skeleton";
import FeaturedInterviewSection from "./FeaturedInterviewSection";
import LogoIcon from "../../assets/sidebar/logo.svg";

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading } = useGetPublicProfileQuery({ username });

  const completedProjects =
    profile?.projects.filter(
      (project: any) => project.status !== "Incomplete"
    ) || [];
  const [incrementViewCount] = useGetPublicProfileViewCountMutation();

  useEffect(() => {
    if (profile && username) {
      incrementViewCount({ username });
    }
  }, [profile, username, incrementViewCount]);

  const bio = profile?.bio || "";
  const handleEdit = () => {
    console.log("");
  };

  const profileFirstName = profile?.firstName || "User";
  const profileName = profile?.name || "User Profile";
  const profileBio =
    profile?.bio ||
    `Check out ${profileFirstName}'s profile on EmployAbility.AI. Discover their skills, experience, and achievements.`;
  const profileImage = "https://employability.ai/employabilityLogo.jpg";
  const profileUrl = `https://employability.ai/profile/${username}`;

  if (isLoading) return <ProfileSkeleton />;

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
      {profile.skills.length > 0 && (
        <div className="bg-white rounded-lg mt-6 p-8 sm:p-5 overflow-y-auto overflow-x-auto max-h-3xl relative">
          <SkillsSection
            skills={profile.skills}
            isPublic={true}
            username={username}
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

      {profile.experience.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <ExperienceSection
            intialExperiences={profile.experience}
            isPublic={true}
          />
        </div>
      )}

      {profile.education.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <EducationSection
            initialEducation={profile.education}
            isPublic={true}
          />
        </div>
      )}

      {profile.certificates.length > 0 && (
        <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
          <CertificationsSection
            certifications={profile.certificates}
            isPublic={true}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      {/* Add Helmet for dynamic meta tags */}
      <Helmet>
        <title key="title">{profileName} | EmployAbility.AI</title>
        <meta name="description" content={profileBio} />

        {/* Open Graph / Facebook meta tags */}
        <meta
          property="og:title"
          content={`${profileName} | EmployAbility.AI`}
        />
        <meta property="og:description" content={profileBio} />
        <meta
          property="og:image"
          content={profile?.profilePicture || profileImage}
        />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="EmployAbility.AI" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${profileName} | EmployAbility.AI`}
        />
        <meta name="twitter:description" content={profileBio} />
        <meta
          name="twitter:image"
          content={profile?.profilePicture || profileImage}
        />
      </Helmet>

      <div className="lg:hidden xl:hidden 2xl:hidden">
        <div className="flex gap-2 mb-3.5">
          <img
            src={LogoIcon || "/placeholder.svg"}
            alt=""
            className="w-[29px] h-[26px]"
          />
          <div className="text-[#001630] font-ubuntu text-[16px] font-bold">
            <span>Employ</span>
            <span className="text-[#0AD472]">Ability.AI</span>
          </div>
        </div>
        <div className="mb-6">
          <ProfileBannerMobile
            user={profile}
            bio={bio}
            onBioUpdate={handleEdit}
            isPublic={true}
          />
        </div>
        {/* Mobile Right Section Components */}
        <div className="space-y-6 mb-6">{renderRightSectionComponents()}</div>

        {/* Main Content Sections */}
        <div className="space-y-6">{renderMainContentSections()}</div>
      </div>

      <div className="hidden lg:grid xl:grid 2xl:grid grid-cols-10 gap-6 max-w-5xl mx-auto">
        <div
          className={`flex flex-col ${
            profile?.featuredInterview ? "col-span-7" : "col-span-10"
          }`}
        >
          <div className="flex gap-2 mb-6">
            <img
              src={LogoIcon || "/placeholder.svg"}
              alt=""
              className="w-[29px] h-[26px]"
            />
            <div className="text-[#001630] font-ubuntu text-[16px] font-bold">
              <span>Employ</span>
              <span className="text-[#0AD472]">Ability.AI</span>
            </div>
          </div>
          <div className="">
            <ProfileBanner
              user={profile}
              bio={bio}
              onBioUpdate={handleEdit}
              isPublic={true}
            />
          </div>

          {/* Main Content Sections */}
          <div className="space-y-6">{renderMainContentSections()}</div>
        </div>
        {/* Right Section */}
        <div className="flex flex-col space-y-6 mt-[50px] flex-1 col-span-3">
          {renderRightSectionComponents()}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
