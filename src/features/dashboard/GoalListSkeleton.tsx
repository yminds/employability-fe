import React from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

const GoalListSkeleton: React.FC = () => {
  return (
    <div className="inset-0 rounded-[9px] border border-black/10 bg-white transition-opacity duration-300 shadow-sm mb-4">
      {/* Image Skeleton */}
      <div className="rounded-tl-[9px] rounded-tr-[9px] w-full">
        <Skeleton height={90} />
      </div>

      <div className="flex flex-col gap-6 p-4 pt-4 pb-4 pl-3 self-stretch">
        {/* Title Skeleton */}
        <div>
          <Skeleton height={20} width={200} />
        </div>

        {/* Tags Skeleton */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton height={30} width={90} />
          <Skeleton height={30} width={100} />
          <Skeleton height={30} width={120} />
          <Skeleton height={30} width={110} />
        </div>
      </div>
    </div>
  );
};

const GoalListSkeletonContainer: React.FC = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <GoalListSkeleton key={index} />
      ))}
    </>
  );
};

export default GoalListSkeletonContainer;
