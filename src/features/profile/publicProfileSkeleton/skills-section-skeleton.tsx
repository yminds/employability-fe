import type React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkillsSectionSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-0 mb-4">
        <Skeleton height={24} width={120} />
      </div>

      <div>
        {[1, 2, 3].map((index) => (
          <SkillCardSkeleton key={index} isFirst={index === 1} />
        ))}
      </div>
    </div>
  );
};

const SkillCardSkeleton: React.FC<{ isFirst?: boolean }> = ({
  isFirst = false,
}) => {
  return (
    <>
      {/* Mobile View */}
      <div
        className={`w-full bg-white hidden sm:block ${
          !isFirst ? "border-t border-[#E5E7EB]" : ""
        }`}
      >
        <div className="py-4">
          {/* Top section with skill icon and name */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton circle width={60} height={60} />
            <div>
              <Skeleton height={20} width={120} className="mb-2" />
              <Skeleton height={16} width={100} />
            </div>
          </div>

          {/* Bottom section with verification status and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton height={24} width={40} />
              <Skeleton circle width={20} height={20} />
              <Skeleton height={20} width={80} />
            </div>
            <Skeleton height={20} width={100} />
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div
        className={`sm:hidden w-full bg-white py-4 ${
          !isFirst ? "border-t border-[#E5E7EB]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Skill Icon */}
            <Skeleton circle width={60} height={60} />

            {/* Skill Info */}
            <div>
              <Skeleton height={20} width={120} className="mb-2" />
              <Skeleton height={16} width={100} />
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex items-center gap-14">
            {/* View Report Button */}
            <Skeleton height={20} width={100} />

            {/* Rating and Verification Status */}
            <div className="flex flex-col items-end">
              <Skeleton height={24} width={60} className="mb-1" />
              <div className="flex items-center gap-2">
                <Skeleton circle width={20} height={20} />
                <Skeleton height={20} width={80} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkillsSectionSkeleton;
