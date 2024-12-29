import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInterview } from "@/hooks/useCreateInterview";

import verifiedImg from "@/assets/skills/verified.svg";
import unverifiedImg from "@/assets/skills/unverifies.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SkillCardProps {
  key: string;
  skillId: string;
  skill: string;
  skillImg: string;
  verified_rating: number;
  selfRating: number;
  initialStatus: string; // Initial status of the skill
}

const SkillCard: React.FC<SkillCardProps> = ({
  skillId,
  skill,
  skillImg,
  verified_rating,
  selfRating,
  initialStatus,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { createInterview, isLoading, isSuccess, isError, error } =
    useCreateInterview();

  const status = initialStatus === "Verified" ? "Verified" : "Unverified";
  const imgSrc = status === "Verified" ? verifiedImg : unverifiedImg;

  const handleViewReport = () => {
    navigate(`/skills/${skillId}`, {
      state: { skill, verified_rating, selfRating },
    });
  };

  const handleImproveScore = () => {
    navigate(`/interview/${skill}`, {
      state: { skill, verified_rating, selfRating },
    });
  };

  const handleLearn = () => {
    navigate(`/mentor/${skillId}`, { state: { skill } });
  };

  const handleVerifySkill = async () => {
    const interviewId = await createInterview({
      title: `${user?.name}'s ${skill} Interview`,
      type: "Skill",
      user_skill_id: skillId,
    });
    navigate(`/interview/${interviewId}`);
  };

  return (
    <div className="flex items-center justify-between h-[82px]  bg-white">
      {/* Left Section: Skill Image and Name */}
      <div className="flex w-[30%] h-full items-center space-x-4">
        <span className="flex w-[52px] h-[52px] p-[9.75px] px-[10.833px] justify-center items-center gap-[10.833px] flex-shrink-0 rounded-full border-[1.083px] border-black/5 bg-[rgba(250,250,250,0.98)]">
          <img src={skillImg} alt={skill} className="w-[30] h-[30]" />
        </span>
        <div>
          <h3 className=" text-[16px] font-medium">{skill}</h3>
          <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro">
            Self rating: {selfRating}/10
          </p>
        </div>
      </div>

      {/* Middle Section: Rating and Status */}
      <div className="flex w-[30%] flex-col items-center space-y-1">
        {status === "Verified" && (
          <p className="text-lg font-medium">
            {verified_rating}
            <span className="text-[#909091]">/10</span>
          </p>
        )}
        <div className="flex items-center space-x-2">
          <img src={imgSrc} alt={status} className="w-4 h-4" />
          <span
            className={`overflow-hidden text-ellipsis text-base font-normal leading-5 ${
              status === "Verified" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex w-[40%] justify-end space-x-2">
        {status === "Verified" ? (
          <>
            <button
              onClick={handleViewReport}
              className="px-4 py-2 text-sm w-[138px] h-[44px] font-medium rounded-md text-[#001630] underline"
            >
              View report
            </button>
            <button
              onClick={handleImproveScore}
              className=" py-2 text-sm w-[138px] h-[44px] font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630]"
            >
              Improve score
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLearn}
              className="px-4 py-2 text-sm w-[138px] h-[44px] font-medium rounded-md text-[#001630] underline"
            >
              Learn
            </button>
            <button
              onClick={handleVerifySkill}
              className="px-4 py-2 text-sm w-[138px] h-[44px] font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630]"
            >
              Verify skill
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
