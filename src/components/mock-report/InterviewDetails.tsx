import React from "react";
import { useLocation } from "react-router-dom";
import projectINterviewIcon from "@/assets/projects/projectInteviewIcon.png";

interface IInterviewDetails {
  skill_icon?: string;
  skill_name?: string;
  project_name?: string;
  takenAt: string;
  onRetake?: () => void;
  onImproveScore?: () => void;
  interviewType?: string;
}

const InterviewDetails = ({
  skill_icon,
  skill_name = "React",
  project_name,
  takenAt = "Took on 8/5/2025, 8:40 AM IST",
  onRetake,
  onImproveScore,
  interviewType,
}: IInterviewDetails) => {
  const location = useLocation();
  const { skillIcon, skillName ,projectName} = location.state;
  console.log("location", location.state);

  return (
    <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 w-full border border-gray-200">
      {/* Left Section: Skill Icon + Name and Taken At info */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full ">
          {interviewType === "Project" ? (
            <img src={projectINterviewIcon} alt={skillName} className="w-8 h-8" />
          ) : (
            <img src={skillIcon} alt={skillName} className="w-8 h-8" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{skillName || projectName}</h3>
          <p className="text-sm text-gray-500">Took on {takenAt}</p>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onRetake}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Retake Interview
        </button>
        <button
          onClick={onImproveScore}
          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800"
        >
          Improve score
        </button>
      </div>
    </div>
  );
};

export default InterviewDetails;
