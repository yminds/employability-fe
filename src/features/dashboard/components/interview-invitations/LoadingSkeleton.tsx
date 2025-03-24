import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-background-grey p-4 rounded-lg animate-pulse">
      <div className="h-5 bg-grey-2 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-grey-2 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-grey-2 rounded w-1/3"></div>
    </div>
  );
}; 