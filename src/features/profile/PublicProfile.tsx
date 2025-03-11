import type React from "react";
import { useParams } from "react-router-dom";
import {
  useGetPublicProfileQuery,
  useGetPublicProfileViewCountMutation,
} from "@/api/userPublicApiSlice";
import ProfileBanner from "./ProfileBanner";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import StatsSection from "./StatsSection";
import ProjectList from "@/components/projects/ProjectList";
import ProfileBannerMobile from "./ProfileBannerMobile";
import { useEffect } from "react";
import ProfileSkeleton from "./publicProfileSkeleton/profile-skeleton";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const { data: profile, isLoading } = useGetPublicProfileQuery({ username });
  const completedProjects =
    profile?.projects.filter(
      (project: any) => project.status !== "Incomplete"
    ) || [];
  const [incrementViewCount] = useGetPublicProfileViewCountMutation();

  useEffect(() => {
    const trackProfileView = async () => {
      if (!profile || !username) return;

      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      incrementViewCount({ username, visitorId });
    };

    trackProfileView();
  }, [profile, username, incrementViewCount]);

  const bio = profile?.bio || "";
  const handleEdit = () => {
    console.log("Something");
  };

  if (isLoading) return <ProfileSkeleton />;

  // Render the right section components
  const renderRightSectionComponents = () => (
    <>
      <StatsSection username={profile?.username} />{" "}
    </>
  );

  // Render main content sections
  const renderMainContentSections = () => (
    <>
      <div className="bg-white rounded-lg mt-6 p-8 overflow-y-auto overflow-x-auto max-h-3xl relative">
        <SkillsSection
          skills={profile.skills}
          isPublic={true}
          username={username}
        />
      </div>

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

      <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
        <ExperienceSection
          intialExperiences={profile.experience}
          isPublic={true}
        />
      </div>
      <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
        <EducationSection
          initialEducation={profile.education}
          isPublic={true}
        />
      </div>
      <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
        <CertificationsSection
          certifications={profile.certificates}
          isPublic={true}
        />
      </div>
    </>
  );

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
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
        {/* <div className="space-y-6 mb-6">{renderRightSectionComponents()}</div> */}

        {/* Main Content Sections */}
        <div className="space-y-6">{renderMainContentSections()}</div>
      </div>

      <div className="hidden lg:grid xl:grid 2xl:grid grid-cols-10 gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col col-span-10">
          <div className="mb-6">
            <ProfileBanner
              user={profile}
              bio={bio}
              onBioUpdate={handleEdit}
              isPublic={true}
              goalData={""}
            />
          </div>

          {/* Main Content Sections */}
          <div className="space-y-6">{renderMainContentSections()}</div>
        </div>
        {/* Right Section */}
        {/* <div className="flex flex-col space-y-6 flex-1 col-span-3">
          {renderRightSectionComponents()}
        </div> */}
      </div>
    </div>
  );
};

export default PublicProfile;
