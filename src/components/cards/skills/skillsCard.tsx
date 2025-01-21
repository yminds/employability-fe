import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInterview } from "@/hooks/useCreateInterview";

import verifiedImg from "@/assets/skills/verified.svg";
import unverifiedImg from "@/assets/skills/unverifies.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DefaultImg from "@/assets/skills/DefaultSkillImg.svg";

interface SkillCardProps {
  skillId: string;
  skill: string;
  skillImg: string | undefined;
  verified_rating: number;
  selfRating: number;
  initialStatus: string; // Initial status of the skill
  level: string | undefined;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skillId,
  skill,
  skillImg,
  verified_rating,
  selfRating,
  initialStatus,
  level
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
    navigate(`/interview/${skillId}`, {
      state: { skill, verified_rating, selfRating },
    });
  };

  const handleLearn = () => {
    navigate(`/mentor/${skillId}`, { state: { skill } });
  };

  const handleVerifySkill = async () => {
    const interviewId = await createInterview({
      title: `${skill} Interview`,
      type: "Skill",
      user_skill_id: skillId,
    });
    navigate(`/interview/${interviewId}`);
  };

  if (skillImg == undefined) {
    skillImg = DefaultImg;
  }

  const getBadgeColor = (type: string, value: string) => {
    if (type === "proficiency") {
      return value === "Basic"
        ? "bg-[#E5F6FF] text-[#1C3FAA] w-fit"
        : value === "Intermediate"
          ? "bg-[#E5F0FF] text-[#1C2CD8]"
          : "bg-[#E5E7FF] text-[#1C2CD8]";
    }
    if (type === "importance") {
      return value === "Low"
        ? "bg-[#DBFFEA] text-[#10B754]"
        : value === "Medium"
          ? "bg-[#FFF9DB] text-[#D4B30C]"
          : "bg-[#FFF2DB] text-[#D48A0C]";
    }
  };


  const skillsLevelObj = { 1: "Basic", 2: "Intermediate", 3: "Advanced" };

  return (
    <div className="flex items-center justify-between h-[82px] snap-start bg-white sm:min-w-[660px]">
      {/* Left Section: Skill Image and Name */}
      <div className="flex w-[30%] h-full items-center space-x-4">
        <span className="flex w-[52px] h-[52px] p-[9.75px] px-[10.833px] justify-center items-center gap-[10.833px] flex-shrink-0 rounded-full border-[1.083px] border-black/5 bg-[rgba(250,250,250,0.98)]">
          <img
            src={skillImg}
            alt="Skill Icon"
            className="w-[30px] h-[30px]"
            onError={(e) => (e.currentTarget.src = DefaultImg)}
          />
        </span>
        <div>
          <h3 className=" text-[16px] font-medium">{skill}</h3>
          <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro">
            Self rating: {selfRating}/10
          </p>
        </div>
      </div>

      {/* Skill level */}
      <div className="flex w-[30%] flex-col items-center space-y-1 text-base">
        <span  className={`px-4 py-2 rounded-[40px] font-medium leading-6 tracking-[0.24px] ${getBadgeColor(
          "proficiency",
          level || "1" // Ensure a valid fallback for `getBadgeColor`
        )}`}>{skillsLevelObj[level as unknown as keyof typeof skillsLevelObj] ?? "Basic"}</span>
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
            className={`overflow-hidden text-ellipsis text-base font-normal leading-5 ${status === "Verified" ? "text-green-600" : "text-yellow-600"
              }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex w-[40%] lg:w-[50%] justify-end space-x-2">
        {status === "Verified" ? (
          <>
            <button
              onClick={handleViewReport}
              className="px-4 py-2 text-sm w-[138px] h-[44px] font-medium rounded-md text-[#001630] underline hover:text-[#001630CC]"
            >
              View report
            </button>
            <button
              onClick={handleImproveScore}
              className=" py-2 text-sm w-[138px] h-[44px] md:h[50px] md:w[150px] md:px-2 md:py-0.5 font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
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
              className="px-4 py-2 w-[138px] h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md"
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
