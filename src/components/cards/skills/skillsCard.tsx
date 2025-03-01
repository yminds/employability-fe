import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInterview } from "@/hooks/useCreateInterview";
import { Edit2, Trash2 } from "lucide-react";

import verifiedImg from "@/assets/skills/verified.svg";
import unverifiedImg from "@/assets/skills/unverifies.svg";
import DefaultImg from "@/assets/skills/DefaultSkillImg.svg";
import verifiedWhite from "@/assets/skills/verified_whiteBG.svg";
import backGround from "@/assets/skills/verifiedBg.png";
import SkillVerificationTutorial from "@/components/skills/SkillVerificationTutorial";
import { useGetUserDetailsQuery } from "@/api/userApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface LatestInterviewStatus {
  interview_id: string;
  isCompleted: boolean;
}   
interface SkillCardProps {
  skillId: string;
  skill: string;
  skillPoolId: string;
  skillImg: string | undefined;
  verified_rating: number;
  selfRating: number;
  initialStatus: string;
  level: string | undefined;
  isMandatory?: boolean;
  onDelete?: (skillId: string) => void;
  onEdit?: (skillId: string, updatedSelfRating: number) => void;
  userId?: string | undefined;
  isDashboard: boolean;
  bestInterview: string | undefined;
  goalName: string;
  latest_interview_status?: LatestInterviewStatus;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skillId,
  skill,
  skillPoolId,
  skillImg,
  verified_rating,
  selfRating,
  initialStatus,
  level,
  isMandatory = false,
  onDelete,
  onEdit,
  isDashboard,
  bestInterview,
  goalName,
  latest_interview_status,
}) => {
  const navigate = useNavigate();
  const { createInterview } = useCreateInterview();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSelfRating, setEditedSelfRating] = useState(selfRating);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ratingError, setRatingError] = useState("");
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const {data:userCredntials}= useGetUserDetailsQuery(userId!);
  console.log("userCredntials",userCredntials);


  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setEditedSelfRating(value);

    if (value > 10) {
      setRatingError("Rating cannot exceed 10");
    } else if (value < 0) {
      setRatingError("Rating cannot be negative");
    } else {
      setRatingError("");
    }
  };

  const handleRatingKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRatingUpdate();
    }
  };

  const handleRatingUpdate = () => {
    if (onEdit && !ratingError) {
      const parsedRating = Math.min(10, Math.max(0, editedSelfRating));
      setIsEditing(false);
      onEdit(skillId, parsedRating);
    }
  };
  const status = initialStatus === "Verified" ? "Verified" : "Unverified";
  const imgSrc = status === "Verified" ? verifiedImg : unverifiedImg;
  const smImgSrc = status === "Verified" ? verifiedWhite : unverifiedImg;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(skillId);
    }
  };

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

  const handleViewReport = () => {
    navigate(`/skill/report/${bestInterview}`, {
      state: { best_interview: bestInterview, goal_name: goalName, skillIcon: skillImg, skillId : skillId },
    });
  };

  // const handleImproveScore = () => {
  //   navigate(`/interview/${skillId}`, {
  //     state: { skill, verified_rating, selfRating: editedSelfRating },
  //   });
  // };

  const handleLearn = () => {
    navigate(`/mentor/learn/${skillId}`, {
      state: { skill, skillId, skillPoolId },
    });
  };

  const handleVerifySkill = async () => {
    if (dontShowAgain) {
      const interviewId = await createInterview({
        title: `${skill} Interview`,
        type: "Skill",
        user_skill_id: skillId,
        skill_id: skillPoolId,
      });

      // Start the interview directly if tutorial is disabled
      navigate(`/interview/${interviewId}`, {
        state: {title: skill, skillId, skillPoolId, level, type: "Skill" },
      });
    } else {
      // Show the tutorial, interview will start after confirmation
      setShowTutorial(true);
    }
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenVerifySkillTutorial");
    if (hasSeenTutorial) {
      setShowTutorial(false);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

 useEffect(() => {
    // Check if the user has disabled the tutorial
    const hasSeenTutorial = localStorage.getItem("hasSeenVerifySkillTutorial");
    if (hasSeenTutorial) {
      setDontShowAgain(true);
    }
  }, []);

  const handleConfirmTutorial = async () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenVerifySkillTutorial", "true");
    }

    setShowTutorial(false);
    const interviewId = await createInterview({
      title: `${skill} Interview`,
      type: "Skill",
      user_skill_id: skillId,
      skill_id: skillPoolId,
    });
    console.log("interviewId", interviewId);
    
    // Start the interview after closing the tutorial
    navigate(`/interview/${interviewId}`, {
      state: { title:skill, skillId, skillPoolId, level, type: "Skill" },
    });
  };

  const handleResumeInterView = () => {
      navigate(`/interview/${latest_interview_status?.interview_id}`, {
      state: { title: skill, skillPoolId, level, type:"Skill" },
    });
  }
  return (
    <>
      {/* Skill Verification Tutorial Popup */}
      {showTutorial && (
        <SkillVerificationTutorial
          onClose={handleCloseTutorial}
          onConfirm={handleConfirmTutorial}
          dontShowAgain={dontShowAgain}
          setDontShowAgain={setDontShowAgain}
          component={"SkillsCard"}
        />
      )}

      <div className="group relative bg-white rounded-md transition sm:hidden">
        {/* Delete Button */}
        {!isMandatory && onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute right-[-4%] top-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3  text-xs font-medium text-black rounded  z-10"
          >
            <Trash2 size={20} />
          </button>
        )}

        <div className="flex items-center justify-between h-[82px] font-ubuntu">
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
              <h3 className="text-[#0C0F12] text-sub-header">{skill}</h3>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <p className="text-[#414447] text-body2">Self rating:</p>
                      <input
                        ref={inputRef}
                        type="number"
                        min="0"
                        max="10"
                        value={editedSelfRating}
                        onChange={handleRatingChange}
                        onKeyDown={handleRatingKeyDown}
                        onBlur={handleRatingUpdate}
                        className="w-12 p-1 border-none focus:outline-none appearance-none bg-transparent text-body2"
                        style={{
                          MozAppearance: "textfield",
                          WebkitAppearance: "none",
                        }}
                      />
                      <span>/10</span>
                    </div>
                    {ratingError && <p className="text-red-500 text-xs mt-1">{ratingError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 font-ubuntu">
                    <p className="text-[#414447] text-body2">
                      Self rating: {editedSelfRating}/10
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-blue-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section */}
          {/* {!isDashboard && (
            <div className="flex w-[30%] flex-col items-center">
              <span
                className={`px-4 py-2 rounded-[40px] font-medium leading-6 tracking-[0.24px] ${getBadgeColor(
                  "proficiency",
                  level || "1"
                )}`}
              >
                {skillsLevelObj[level as unknown as keyof typeof skillsLevelObj] ?? "Basic"}
              </span>
            </div>
          )} */}

          {/* Rating and Status */}
          <div className="flex w-[30%] flex-col items-center font-ubuntu">
            {status === "Verified" && (
              <p className="font-ubuntu text-xl font-medium leading-[22px]">
                {verified_rating}
                <span className="text-[#909091]">/10</span>
              </p>
            )}
            <div className="flex items-center space-x-2">
              <img src={imgSrc} alt={status} className="w-4 h-4" />
              <span
                className={`overflow-hidden text-ellipsis text-sub-header ${status === "Verified" ? "text-green-600" : "text-yellow-600"
                  }`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-[40%] lg:w-[50%] justify-end items-center space-x-2 font-ubuntu">
            {status === "Verified" ? (
              <>
                <button
                  onClick={handleViewReport}
                  className="px-4 py-2 w-[138px] h-[44px] text-button rounded-md text-[#001630] underline hover:text-[#001630CC]"
                >
                  View report
                </button>
                {/* here we have to check one more check if thery any latest interviwe staus in pending */}
                {latest_interview_status?.isCompleted === false ? (
                  <button
                    onClick={handleResumeInterView}
                    className="px-4 py-2 w-[138px] h-[44px] text-button bg-[#001630] text-white hover:bg-[#062549] rounded-md"
                  >
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerifySkill()}
                    className="py-2 text-sm w-[138px] h-[44px] text-button text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
                  >
                    Improve score
                  </button>
                )}
         
              </>
            ) : // checking the latest interview isCompleted false
            latest_interview_status?.isCompleted === false ? (
              <>
                <button
                  onClick={handleLearn}
                  className="px-11 py-2 text-button rounded-md text-[#001630] underline"
                >
                  Learn
                </button>
                <button
                  onClick={handleResumeInterView}
                  className="px-4 py-2 w-[138px] text-button h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md"
                >
                  Resume
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
                  onClick={() => handleVerifySkill()}
                  className="px-4 py-2 w-[138px] h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md font-ubuntu"
                >
                  Verify skill
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="group relative sm:flex flex-wrap bg-white rounded-md transition hidden font-ubuntu">
        {/* Delete Button */}
        {!isMandatory && onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute right-[-3%] top-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1 text-xs font-medium text-white bg-[#00183D] rounded hover:bg-black z-10"
          >
            <Trash2 size={16} />
          </button>
        )}

        <div className="flex flex-col sm:flex-col w-full sm:gap-6 border rounded-lg  py-4 px-2 relative overflow-hidden">
          <div className=" flex justify-between w-full">
            <div className="flex items-center  space-x-4">
              <div>
                <span className="flex w-[52px] h-[52px] p-[9.75px] px-[10.833px] justify-center items-center rounded-full border border-black/5 bg-[rgba(250,250,250,0.98)]">
                  <img
                    src={skillImg || DefaultImg}
                    alt="Skill Icon"
                    className="w-[30px] h-[30px]"
                    onError={(e) => (e.currentTarget.src = DefaultImg)}
                  />
                </span>
              </div>
              <div>
                <h3 className="text-[16px] font-medium sm:text-sm sm: w-1/2 truncate">{skill}</h3>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px]">Self rating:</p>
                        <input
                          ref={inputRef}
                          type="number"
                          min="0"
                          max="10"
                          value={editedSelfRating}
                          onChange={handleRatingChange}
                          onKeyDown={handleRatingKeyDown}
                          className="w-12 p-1 border-none focus:outline-none appearance-none bg-transparent text-base"
                          style={{
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                          }}
                        />
                        <span>/10</span>
                      </div>
                      {ratingError && <p className="text-red-500 text-xs mt-1">{ratingError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px]">
                        Self rating: {editedSelfRating}/10
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex flex-wrap items-center justify-between w-full mt-2">
                {/* Left Section: Verified Rating */}
                <div
                  className={`flex items-center space-x-2 absolute right-0 top-0 px-2 h-[35px] `}
                  style={{ backgroundImage: `url(${backGround})` }}
                >
                  <div className="flex items-center space-x-2">
                    <img src={smImgSrc} alt={status} className="w-4 h-4" />
                    <span
                      className={`overflow-hidden text-ellipsis text-base font-normal leading-5 ${status === "Verified" ? "text-white" : "text-white"
                        }`}
                    >
                      {status}
                    </span>
                    {status === "Verified" && (
                      <p className="text-lg font-medium text-white">
                        {verified_rating}
                        <span className="text-white">/10</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full h-full flex justify-between items-center">
            <div className="flex items-center">
              <span
                className={`px-4 py-2 rounded-[40px] font-medium leading-6 tracking-[0.24px] ${getBadgeColor(
                  "proficiency",
                  level || "1"
                )}`}
              >
                {skillsLevelObj[level as unknown as keyof typeof skillsLevelObj] ?? "Basic"}
              </span>
            </div>
            {/* Right Section: Action Buttons */}
            <div className="flex space-x-2">
              {status === "Verified" ? (
                <>
                  <button
                    onClick={handleViewReport}
                    className="px-4 py-2 text-sm font-medium rounded-md text-[#001630] underline hover:text-[#001630CC]"
                  >
                    View report
                  </button>
                  <button
                    onClick={()=> handleVerifySkill()}
                    className="py-2 text-sm font-medium text-[#001630] bg-white rounded-md border border-solid border-[#001630] hover:bg-[#00163033] hover:border-[#0522430D] hover:text-[#001630CC]"
                  >
                    Improve score
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLearn}
                    className="px-4 py-2 text-sm font-medium rounded-md text-[#001630] underline"
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => handleVerifySkill()}
                    className="px-4 py-2 bg-[#001630] text-white hover:bg-[#062549] rounded-md font-ubuntu"
                  >
                    Verify skill
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default SkillCard;
