import type React from "react";
import { useNavigate } from "react-router-dom";

import verifiedImg from "@/assets/skills/verified.svg";
import unverifiedImg from "@/assets/skills/unverifies.svg";
import DefaultImg from "@/assets/skills/DefaultSkillImg.svg";
import verifiedWhite from "@/assets/skills/verified_whiteBG.svg";
import backGround from "@/assets/skills/verifiedBg.png";

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
  const smImgSrc = status === "Verified" ? verifiedWhite : unverifiedImg;

  const handleViewReport = () => {
    navigate(`/skills-report/${username}/${best_interview}`, {
      state: { isPublic: true },
    });
  };

  return (
    <>
      {/* Mobile View */}
      <div className="group relative sm:flex flex-wrap bg-white mb-4">
        <div className="flex flex-col sm:flex-col w-full border rounded-lg py-4 px-2 relative overflow-hidden">
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-4">
              <div>
                <span className="flex w-[52px] h-[52px] p-[9.75px] px-[10.833px] justify-center items-center rounded-full">
                  <img
                    src={skillImg || DefaultImg}
                    alt="Skill Icon"
                    className="w-[30px] h-[30px]"
                    onError={(e) => (e.currentTarget.src = DefaultImg)}
                  />
                </span>
              </div>
              <div>
                <h3 className="text-sub-header sm:text-sm sm:w-1/2 truncate">
                  {skill}
                </h3>
                <p className="text-[#414447] text-body2">
                  Self rating: {selfRating}/10
                </p>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between w-full mt-2">
                {/* Verification Status Badge */}
                <div
                  className={`flex items-center space-x-2 absolute right-0 top-0 px-2 h-[35px] `}
                  style={{ backgroundImage: `url(${backGround})` }}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={smImgSrc || "/placeholder.svg"}
                      alt={status}
                      className="w-4 h-4"
                    />
                    <span
                      className={`overflow-hidden text-ellipsis text-body2 ${
                        status === "Verified" ? "text-white" : "text-white"
                      }`}
                    >
                      {status}
                    </span>
                    {status === "Verified" && (
                      <p className="text-body2 text-white">
                        {verified_rating}
                        <span className="text-white">/10</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full flex justify-end items-center">
            {/* Action Buttons */}
            <div className="flex space-x-2">
              {status === "Verified" && (
                <button
                  onClick={handleViewReport}
                  className="px-4 py-2 text-button text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
                >
                  View report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DeskTop View */}
    </>
  );
};

export default PublicSkillCard;
