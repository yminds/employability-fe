import type React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectListSkeleton: React.FC = () => {
  return (
    <div className="p-[32px]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
          <Skeleton height={24} width={120} />
        </div>

        <div className="flex flex-col">
          {[1, 2, 3].map((index) => (
            <div key={index}>
              <ProjectCardSkeleton />
              {index < 3 && <div className="w-full h-px bg-[#E0E0E0] mb-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 py-4">
      <Skeleton height={120} width={180} className="rounded-lg" />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Skeleton height={24} width={180} className="mb-2" />
          <Skeleton height={16} count={2} className="mb-3" />

          <div className="flex flex-wrap gap-2 mb-3">
            {[1, 2, 3].map((index) => (
              <Skeleton
                key={index}
                height={32}
                width={80}
                className="rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton height={24} width={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListSkeleton;
