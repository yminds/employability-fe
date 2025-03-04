import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import DefaultImg from "@/assets/skills/DefaultSkillImg.svg";
import verifiedImg from "@/assets/skills/verified.svg";

interface Interview {
  _id: string;
  title: string;
  is_interview_over: boolean;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

interface InterviewCardProps {
  skillId: string;
  skill: string;
  skillImg: string | undefined;
  verified_rating: number;
  bestInterview: string | undefined;
  latest_interview_status?: {
    interview_id: string;
    isCompleted: boolean;
  };
  interviews: Interview[];
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  skillId,
  skill,
  skillImg,
  verified_rating,
  bestInterview,
  latest_interview_status,
  interviews,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewReport = (interviewId: string) => {
    navigate(`/skill/report/${interviewId}`, {
      state: {
        best_interview: interviewId,
        skillIcon: skillImg,
        skillId: skillId,
        fromInterviewCard: true,
      },
    });
  };

  const handleResumeInterview = () => {
    navigate(`/interview/${latest_interview_status?.interview_id}`, {
      state: { title: skill, skillId, type: "Skill" },
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Format date to a readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter completed interviews and sort by createdAt date (newest first)
  const completedInterviews =
    interviews
      ?.filter(
        (interview) => interview.is_interview_over && interview.rating > 0
      )
      .sort((a, b) => {
        // Sort by date (newest first)
        if (a._id === bestInterview) return -1;
        if (b._id === bestInterview) return 1;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }) || [];

  return (
    <div className="bg-white rounded-md transition">
      {/* Main Card - Always Visible */}
      <div
        className="flex items-center justify-between h-[82px] font-ubuntu cursor-pointer"
        onClick={toggleExpand}
      >
        {/* Left Section - Skill Info */}
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
          </div>
        </div>

        {/* Middle Section - Score */}
        <div className="flex w-[30%] flex-col items-center font-ubuntu">
          <div className="flex items-center space-x-2">
            <img
              src={verifiedImg || "/placeholder.svg"}
              alt="Verified"
              className="w-4 h-4"
            />
            <p className="font-ubuntu text-xl font-medium leading-[22px]">
              {verified_rating}
              <span className="text-[#909091]">/10</span>
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex w-[40%] lg:w-[50%] justify-end items-center space-x-2 font-ubuntu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewReport(bestInterview || "");
            }}
            className="px-4 py-2 w-[138px] h-[44px] text-button rounded-md text-[#001630] underline hover:text-[#001630CC]"
          >
            View report
          </button>
          {latest_interview_status && !latest_interview_status.isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResumeInterview();
              }}
              className="px-4 py-2 w-[138px] h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md font-ubuntu"
            >
              Resume
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded Section - Interview History */}
      {isExpanded && completedInterviews.length > 0 && (
        <div className="border-t pt-1 pb-1 px-4">
          <h4 className="text-body2 text-gray-500 my-2">Interview History</h4>
          <div className="space-y-1">
            {completedInterviews.map((interview) => (
              <div
                key={interview._id}
                className={`grid grid-cols-3 items-center p-2 rounded-lg ${
                  interview._id === bestInterview ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                {/* Left: Date and Best indicator */}
                <div className="flex items-center">
                  <span className="text-sm font-medium font-ubuntu text-gray-600">
                    {formatDate(interview.updatedAt)}
                  </span>
                </div>

                {/* Center: Rating */}
                <div className="flex justify-start ml-10">
                  <span className="text-sm font-medium font-ubuntu text-gray-800">
                    Rating: {interview.rating.toFixed(2)}/10
                  </span>
                  {interview._id === bestInterview && (
                    <span className="ml-2 text-xs font-ubuntu text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Top Rating
                    </span>
                  )}
                </div>

                {/* Right: View report button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReport(interview._id);
                    }}
                    className="px-3 py-1 text-sm font-ubuntu text-[#001630] underline hover:text-[#001630CC]"
                  >
                    View report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
