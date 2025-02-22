import type React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BasicInfoFormSkeleton: React.FC = () => (
  <div className="space-y-6 w-full">
    <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="space-y-2">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={120} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={110} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={100} />
          <Skeleton height={230} className="rounded-lg" />
          <Skeleton height={16} width={150} />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton height={22} width={60} />
          <Skeleton height={50} />
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={70} />
          <Skeleton height={50} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Skeleton height={22} width={70} />
          <Skeleton height={50} />
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={50} />
          <Skeleton height={50} />
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={40} />
          <Skeleton height={50} />
        </div>
      </div>
    </div>
    <Skeleton height={22} width={120} />
    <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton height={22} width={60} />
          <Skeleton height={50} />
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={70} />
          <Skeleton height={50} />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={22} width={80} />
        <Skeleton height={50} />
      </div>
    </div>
  </div>
);

const SkillsFormSkeleton: React.FC = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
      >
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2 col-span-2">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2 col-span-1">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2 col-span-1">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ExperienceFormSkeleton: React.FC = () => (
  <div className="space-y-6 w-full">
    {[1, 2].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={120} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={110} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={80} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton height={20} width={20} />
          <Skeleton height={20} width={150} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={90} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={90} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={110} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={100} />
          <Skeleton height={100} />
        </div>
      </div>
    ))}
    <Skeleton height={40} width={150} />
  </div>
);

const EducationFormSkeleton: React.FC = () => (
  <div className="space-y-6 w-full">
    {[1, 2].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={120} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={100} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2 col-span-2">
            <Skeleton height={22} width={150} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2 col-span-1">
            <Skeleton height={22} width={80} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2 col-span-1">
            <Skeleton height={22} width={80} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={100} />
          <Skeleton height={50} />
        </div>
      </div>
    ))}
    <Skeleton height={40} width={150} />
  </div>
);

const CertificationsFormSkeleton: React.FC = () => (
  <div className="space-y-6 w-full">
    {[1, 2].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={50} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={80} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton height={22} width={90} />
            <Skeleton height={50} />
          </div>
          <div className="space-y-2">
            <Skeleton height={22} width={120} />
            <Skeleton height={50} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton height={22} width={120} />
          <Skeleton height={50} />
        </div>
      </div>
    ))}
    <Skeleton height={40} width={150} />
  </div>
);

export {
  BasicInfoFormSkeleton,
  SkillsFormSkeleton,
  ExperienceFormSkeleton,
  EducationFormSkeleton,
  CertificationsFormSkeleton,
};
