"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";

import verifiedImg from "@/assets/skills/verified.svg";
import unverifiedImg from "@/assets/skills/unverifies.svg";
import DefaultImg from "@/assets/skills/DefaultSkillImg.svg";

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
          <div className="flex items-center gap-4 mb-6">
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

          {/* Bottom section with verification status and actions */}
          <div className="flex items-center justify-between">
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

            {isVerified && (
              <button
                onClick={handleViewReport}
                className="text-[#001630] font-medium underline hover:text-[#001630CC]"
              >
                View report
              </button>
            )}
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
