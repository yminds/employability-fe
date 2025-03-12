import type React from "react";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileBannerSkeleton from "./profile-banner-skeleton";
import ProfileBannerMobileSkeleton from "./profile-banner-mobile-skeleton";
import SkillsSectionSkeleton from "./skills-section-skeleton";
import ProjectListSkeleton from "./project-list-skeleton";
import ExperienceSectionSkeleton from "./experience-section-skeleton";
import EducationSectionSkeleton from "./education-section-skeleton";
import CertificationsSectionSkeleton from "./certifications-section-skeleton";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      {/* Mobile View */}
      <div className="lg:hidden xl:hidden 2xl:hidden">
        <div className="mb-6">
          <ProfileBannerMobileSkeleton />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg mt-6 p-8 overflow-y-auto overflow-x-auto max-h-3xl relative">
            <SkillsSectionSkeleton />
          </div>

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl relative">
            <ProjectListSkeleton />
          </div>

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <ExperienceSectionSkeleton />
          </div>

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <EducationSectionSkeleton />
          </div>

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <CertificationsSectionSkeleton />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid xl:grid 2xl:grid grid-cols-10 gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col col-span-10">
          <div className="mb-6">
            <ProfileBannerSkeleton />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg mt-6 p-8 overflow-y-auto overflow-x-auto max-h-3xl relative">
              <SkillsSectionSkeleton />
            </div>

            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl relative">
              <ProjectListSkeleton />
            </div>

            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
              <ExperienceSectionSkeleton />
            </div>

            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
              <EducationSectionSkeleton />
            </div>

            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
              <CertificationsSectionSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
