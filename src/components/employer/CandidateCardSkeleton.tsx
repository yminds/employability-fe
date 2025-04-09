// components/SkeletonLoader.tsx
import React from "react";

// Skeleton component for a single candidate card
export const CandidateCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 border-b border-[#d6d7d9] animate-pulse">
      <div className="flex items-center space-x-4">
        {/* Checkbox placeholder */}
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        
        {/* Avatar placeholder */}
        <div className="w-14 h-14 rounded-full bg-gray-200"></div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>

              <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
              
              {/* Location placeholder */}
              <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
              
              {/* Status badge placeholder */}
              <div className="h-8 bg-gray-200 rounded-full w-28"></div>
            </div>
            
            {/* Right side of card */}
            <div className="flex flex-col mt-2 items-end justify-center">
              {/* Status text placeholder */}
              <div className="text-right mb-2">
                <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              
              {/* Action buttons placeholder */}
              <div className="flex items-center gap-2 mt-3">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader that shows multiple cards
export const CandidatesSkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {/* Select All Header Skeleton */}
      <div className="sticky top-0 bg-[#f8f9fa] p-4 border-b border-[#d6d7d9]">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      {/* Render multiple card skeletons */}
      {Array(count).fill(0).map((_, index) => (
        <CandidateCardSkeleton key={index} />
      ))}
    </>
  );
};

export default CandidatesSkeletonLoader;