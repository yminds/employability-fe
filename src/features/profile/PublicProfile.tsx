import type React from "react";
import { useParams } from "react-router-dom";
import { useGetPublicProfileQuery } from "@/api/userPublicApiSlice";
import ProfileBanner from "./ProfileBanner";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import MockInterivewImage from "@/assets/profile/MockInterview.svg";
import MockInterviewSection from "./MockInterviewSection";
import StatsSection from "./StatsSection";
import ProjectList from "@/components/projects/ProjectList";

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const { data: profile, isLoading } = useGetPublicProfileQuery({ username });
  const completedProjects =
    profile?.projects.filter(
      (project: any) => project.status !== "Incomplete"
    ) || [];

  const bio =
    profile?.bio ||
    "Full-stack developer with a strong foundation in React, Python, and MongoDB. A quick learner passionate about building user-friendly web applications, eager to apply skills in a professional environment.";
  const handleEdit = () => {
    console.log("Something");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      <div className="grid grid-cols-8 gap-6">
        <div className="flex flex-col col-span-6">
          <ProfileBanner
            user={profile}
            bio={bio}
            onBioUpdate={handleEdit}
            isPublic={true}
            goalData={""}
          />

          <div className="bg-white rounded-lg mt-6 p-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <SkillsSection skills={profile.skills} isPublic={true} />
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
          <div className="mb-6"></div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 flex flex-col flex-1 col-span-2">
          {/* MockInterview Section */}
          <MockInterviewSection
            duration="5m 32s"
            timeAgo="3 weeks ago"
            role="Full stack developer"
            percentile={60}
            thumbnailUrl={MockInterivewImage || ""}
          />

          {/* Stats Section */}
          <StatsSection skills={6} projects={4} certifications={2} />
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
