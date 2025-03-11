import type React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ExperienceSectionSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-start justify-between px-8 pt-8 pb-0">
        <div className="flex items-center gap-2">
          <Skeleton height={24} width={160} />
        </div>
      </div>

      <div className="divide-y divide-[#E5E7EB] p-8 relative">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`flex items-start gap-6 ${
              index === 1 ? "pt-0 pb-6" : index === 3 ? "pt-6 pb-0" : "py-6"
            }`}
          >
            <Skeleton
              circle
              width={40}
              height={40}
              className="flex-shrink-0 mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton height={24} width={160} className="mb-2" />
                  <Skeleton height={16} width={120} className="mb-1" />
                  <Skeleton height={16} width={100} />
                </div>
                <div className="text-right">
                  <Skeleton height={24} width={60} className="mb-2" />
                  <Skeleton height={16} width={120} />
                </div>
              </div>

              <div className="mt-4">
                <Skeleton height={16} count={3} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSectionSkeleton;
