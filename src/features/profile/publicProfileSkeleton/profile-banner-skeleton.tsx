import type React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileBannerSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg bg-white">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div className="relative flex gap-6 items-center">
              <Skeleton circle width={130} height={130} />
              <div className="flex flex-col gap-2 items-start justify-end">
                <Skeleton height={32} width={180} />
                <Skeleton height={16} width={120} />
              </div>
            </div>
            <div className="flex flex-col items-start justify-end gap-2">
              <Skeleton height={32} width={160} />
              <div className="flex items-center gap-2 rounded-lg">
                <Skeleton height={40} width={80} />
              </div>
              <Skeleton height={16} width={140} />
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 px-4">
            <div className="rounded-lg p-4">
              <Skeleton height={64} width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBannerSkeleton;
