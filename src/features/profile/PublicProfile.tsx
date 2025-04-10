import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import UserNotFoundSVG from "@/assets/error/UserNotFound.svg";
// import { useMetaTags } from "@/hooks/useMetaTags";

const PublicProfile: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const {
    data: profile,
    isLoading,
    isSuccess,
  } = useGetPublicProfileQuery({ username });

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

  // const profileFirstName = profile?.firstName || "User";
  // const profileName = profile?.name || "User Profile";
  // const profileBio =
  //   profile?.bio ||
  //   `Check out ${profileFirstName}'s profile on EmployAbility.AI. Discover their skills, experience, and achievements.`;
  // const profileImage = "https://employability.ai/employabilityLogo.jpg";
  // const profileUrl = `https://employability.ai/profile/${username}`;

  // useMetaTags({
  //   title: `${profileName} | EmployAbility.AI`,
  //   description: profileBio,
  //   image: profileImage,
  //   url: profileUrl,
  //   type: "profile",
  // });

  if (isLoading) return <ProfileSkeleton />;

  // User not found
  if (!isSuccess || !profile) {
    return (
      <div className="w-full mx-auto">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <div className="max-w-md text-center">
            {/* Logo */}
            <div className="flex gap-2 mb-6 justify-center">
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

            {/* Error SVG illustration */}
            <img
              src={UserNotFoundSVG || "/placeholder.svg"}
              alt="User Not Found"
              className="mx-auto mb-8 w-[400px] h-auto"
            />

            {/* Simple, friendly error message */}
            <h1 className="text-xl font-medium text-[#202326] mb-2">
              Whoops! This user is not who you were looking for
            </h1>

            <p className="text-[#68696b] mb-8">
              We couldn't find "{username}". But thanks for helping us test our
              error page! Try your luck by going back home.
            </p>

            {/* Button - using the same style as 404 page */}
            <Button
              onClick={() => navigate("/")}
              className="px-6 py-2 text-[#001630] bg-white border border-[#001630] hover:bg-[#e1f2ea]"
            >
              Take me Home
            </Button>
          </div>
        </div>
      </div>
    );
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
