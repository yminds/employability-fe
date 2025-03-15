"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";

import verifiedImg from "@/assets/skills/verified.svg";
import unverifiedImg from "@/assets/skills/unverifies.svg";
import DefaultImg from "@/assets/skills/DefaultSkillImg.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PublicSkillCardProps {
  skillId: string;
  skill: string;
  skillPoolId: string;
  skillImg: string | undefined;
  verified_rating: number;
  selfRating: number;
  initialStatus: string;
  level: string | undefined;
  best_interview: string;
  username?: string;
  isFirst?: boolean;
}

const PublicSkillCard: React.FC<PublicSkillCardProps> = ({
  skillId,
  skill,
  skillImg,
  verified_rating,
  selfRating,
  initialStatus,
  best_interview,
  username,
  isFirst = false,
}) => {
  const navigate = useNavigate();

  const status = initialStatus === "Verified" ? "Verified" : "Unverified";
  const isVerified = status === "Verified";

  const handleViewReport = () => {
    navigate(`/skills-report/${username}/${best_interview}`, {
      state: { isPublic: true },
    });
  };

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
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[60px] rounded-full border border-black/5 bg-[#fafafa] flex items-center justify-center">
                <img
                  src={skillImg || DefaultImg}
                  alt="Skill Icon"
                  className="w-[36px] h-[36px]"
                  onError={(e) => (e.currentTarget.src = DefaultImg)}
                />
              </div>

              <div>
                <h3 className="text-[#0c0f12] text-sub-header">{skill}</h3>
                <p className="text-[#414447] text-body2">
                  Self rating : {selfRating}/10
                </p>
              </div>
            </div>

            {/* Three dots menu positioned parallel to skill title */}
            {isVerified && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-[#000000] focus:outline-none mt-1">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <div className="py-1">
                    <button
                      onClick={handleViewReport}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      View report
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Bottom section with verification status */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {isVerified ? (
                <>
                  <div className="text-xl font-medium font-ubuntu">
                    <span className="text-[#0c0f12]">{verified_rating}</span>
                    <span className="text-[#909091]">/10</span>
                  </div>
                  <img
                    src={verifiedImg || "/placeholder.svg"}
                    alt="Verified"
                    className="w-5 h-5"
                  />
                  <span className="text-[#10b754] text-sub-header">
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={unverifiedImg || "/placeholder.svg"}
                    alt="Unverified"
                    className="w-5 h-5"
                  />
                  <span className="text-[#d48a0c] text-sub-header">
                    Unverified
                  </span>
                </>
              )}
            </div>
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
            <div className="w-[60px] h-[60px] rounded-full border border-black/5 bg-[#fafafa] flex items-center justify-center">
              <img
                src={skillImg || DefaultImg}
                alt="Skill Icon"
                className="w-[36px] h-[36px]"
                onError={(e) => (e.currentTarget.src = DefaultImg)}
              />
            </div>

            {/* Skill Info */}
            <div>
              <h3 className="text-[#0c0f12] text-sub-header">{skill}</h3>
              <p className="text-[#414447] text-body2">
                Self rating : {selfRating}/10
              </p>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex items-center gap-14">
            {/* View Report Button - Only for verified skills */}
            {isVerified && (
              <button
                onClick={handleViewReport}
                className="text-[#001630] font-medium underline hover:text-[#001630CC]"
              >
                View report
              </button>
            )}

            {/* Rating and Verification Status */}
            <div className="flex flex-col items-end">
              {isVerified && (
                <div className="text-xl font-medium font-ubuntu">
                  <span className="text-[#0c0f12]">{verified_rating}</span>
                  <span className="text-[#909091]">/10</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {isVerified ? (
                  <>
                    <img
                      src={verifiedImg || "/placeholder.svg"}
                      alt="Verified"
                      className="w-5 h-5"
                    />
                    <span className="text-[#10b754] text-sub-header">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src={unverifiedImg || "/placeholder.svg"}
                      alt="Unverified"
                      className="w-5 h-5"
                    />
                    <span className="text-[#d48a0c] text-sub-header">
                      Unverified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicSkillCard;
