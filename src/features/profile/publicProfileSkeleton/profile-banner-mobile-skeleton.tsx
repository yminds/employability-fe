import type React from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const ProfileBannerMobileSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full rounded-lg bg-white overflow-hidden">
        <div className="pt-4 pb-4">
          {/* Profile header section */}
          <div className="flex items-center justify-between px-4">
            {/* Profile image */}
            <Skeleton circle width={64} height={64} />

            {/* Name and location */}
            <div className="flex-1 mx-3">
              <Skeleton height={24} width={120} className="mb-2" />
              <Skeleton height={16} width={100} />
            </div>

            {/* Three dots menu */}
            <Skeleton circle width={32} height={32} />
          </div>

          {/* Job title */}
          <div className="mt-4 px-8">
            <Skeleton height={24} width={160} />
          </div>

          {/* Employability score */}
          <div className="px-8 flex items-center mt-2">
            <Skeleton height={40} width={80} />
            <Skeleton circle width={24} height={24} className="ml-2" />
          </div>

          <div className="px-8">
            <Skeleton height={16} width={140} />
          </div>

          {/* Bio section */}
          <div className="mt-4 px-4">
            <div className="rounded-lg p-4">
              <Skeleton height={64} width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileBannerMobileSkeleton

