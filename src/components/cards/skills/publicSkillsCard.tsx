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
}) => {
  const navigate = useNavigate();

  const status = initialStatus === "Verified" ? "Verified" : "Unverified";
  const imgSrc = status === "Verified" ? verifiedImg : unverifiedImg;

  const handleViewReport = () => {
    navigate(`/skills-report/${username}/${best_interview}`, {
      state: { isPublic: true },
    });
  };

  const handleRequestVerification = () => {
    console.log("Request verification for skill:", skillId);
  };

  return (
    <>
      <div className="group relative bg-white p-4 rounded-md transition sm:hidden">
        <div className="flex items-center justify-between h-[82px]">
          {/* Left Section */}
          <div className="flex w-[30%] items-center space-x-4">
            <span className="flex w-[52px] h-[52px] p-[9.75px] px-[10.833px] justify-center items-center rounded-full border border-black/5 bg-[rgba(250,250,250,0.98)]">
              <img
                src={skillImg || DefaultImg}
                alt="Skill Icon"
                className="w-[30px] h-[30px]"
                onError={(e) => (e.currentTarget.src = DefaultImg)}
              />
            </span>
            <div>
              <h3 className="text-[16px] font-medium">{skill}</h3>
              <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px]">
                Self rating: {selfRating}/10
              </p>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex w-[30%] flex-col items-center"></div>

          {/* Rating and Status */}
          <div className="flex w-[30%] flex-col items-center">
            {status === "Verified" && (
              <p className="text-lg font-medium">
                {verified_rating}
                <span className="text-[#909091]">/10</span>
              </p>
            )}
            <div className="flex items-center space-x-2">
              <img
                src={imgSrc || "/placeholder.svg"}
                alt={status}
                className="w-4 h-4"
              />
              <span
                className={`overflow-hidden text-ellipsis text-base font-normal leading-5 ${
                  status === "Verified" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-[40%] lg:w-[50%] justify-end items-center space-x-2">
            {status === "Verified" && (
              <button
                onClick={handleViewReport}
                className="px-4 py-2 text-sm font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
              >
                View report
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicSkillCard;
