import type React from "react";
import { useState } from "react";
import { Eye, MapPin, PenIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Skill {
  _id: string;
  name: string;
  icon?: string;
  importance?: "Must-Have*" | "Preferred" | "Optional";
}

interface ScreeningQuestion {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  customField?: string;
  customFieldValue?: string;
}

interface InterviewQuestion {
  question: string;
  category?: string;
}

interface JobPreviewSidebarProps {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  workplaceType: string;
  experienceLevel?: string;
  description?: string;
  companyLogo?: string;
  skills?: any[];
  screeningQuestions?: ScreeningQuestion[];
  interviewQuestions?: InterviewQuestion[];
  expanded?: boolean;
  onPreviewClick?: () => void;
  onEditClick?: (
    section: "basic" | "skills" | "screening" | "review"
  ) => void;
  isReviewMode?: boolean;
}

const JobPreviewSidebar: React.FC<JobPreviewSidebarProps> = ({
  jobTitle = "Full Stack Developer",
  companyName = "Acme Inc.",
  location = "Bangalore, India",
  jobType = "full-time",
  workplaceType = "on-site",
  experienceLevel = "mid-level",
  description = "",
  skills = [],
  screeningQuestions = [],
  companyLogo,
  expanded = false,
  onPreviewClick,
  onEditClick,
  isReviewMode = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    skills: true,
    screening: true,
  });

  // Format job type for display
  const formatJobType = (type: string): string => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get formatted question text
  const getFormattedQuestion = (question: ScreeningQuestion) => {
    if (!question.customField || !question.customFieldValue)
      return question.question;
    return question.question.replace(
      `[${question.customField}]`,
      question.customFieldValue
    );
  };

  // Process skills data to handle different formats
  const processedSkills = skills.map((skill) => {
    if (typeof skill === "object") {
      if (skill.skill) {
        // Handle case where skill is wrapped in an object with 'skill' property
        return {
          _id: skill.skill._id || "",
          name: skill.skill.name || "",
          icon: skill.skill.icon,
          importance: skill.importance || "Important",
        };
      } else {
        // Handle direct skill object
        return {
          _id: skill._id || "",
          name: skill.name || "",
          icon: skill.icon,
          importance: skill.importance || "Important",
        };
      }
    } else {
      // Handle string skill
      return {
        _id: typeof skill === "string" ? skill : "",
        name: typeof skill === "string" ? skill : "",
        icon: undefined,
        importance: "Important",
      };
    }
  });

  // Handle navigation to edit sections
  const handleEditClick = (
    section: "basic" | "skills" | "screening" | "review",
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (onEditClick) {
      onEditClick(section);
    }
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full bg-[#fafafa] rounded-xl shadow-sm overflow-y-auto max-h-[calc(100vh-110px)] border border-black/10">
      {/* Basic Preview (Always Visible) */}
      <div className="p-6 flex justify-between items-start bg-white rounded-t-xl">
        <div className="flex gap-3">
          {/* Company logo/icon - Conditionally render logo or default icon */}
          <div className="w-[50px] h-[50px] relative bg-[#ecedef] rounded-full border-white/0 overflow-hidden flex items-center justify-center">
            {companyLogo ? (
              // Display the company logo if provided
              <img 
                src={companyLogo} 
                alt={`${companyName} logo`} 
                className="w-full h-full object-cover"
              />
            ) : (
              // Display the default logo/icon
              <div className="w-[69px] h-[73px] left-[-9px] top-[-6px] absolute">
                <div className="w-[69px] h-[73px] left-0 top-0 absolute" />
                <div className="w-[31px] h-[40px] left-[19px] top-[17px] absolute">
                  <div className="w-[21px] h-[40px] left-0 top-0 absolute bg-[#cdead9]" />
                  <div className="w-[21px] h-[21px] left-[9.5px] top-[18.5px] absolute bg-[#bbddc9]" />
                  <div className="w-[17px] h-[12px] left-[2.2px] top-[2.5px] absolute inline-flex flex-col justify-start items-start gap-[2.3px]">
                    <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                    <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                    <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                    <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job details */}
          <div className="inline-flex flex-col justify-center items-start gap-1">
            <div className="flex flex-col justify-start items-start gap-2">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="justify-center text-[#414447] text-lg font-medium leading-tight">
                  {jobTitle}
                </div>
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#414447] text-sm font-normal leading-relaxed tracking-tight">
                    {companyName}
                  </div>
                </div>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <MapPin className="w-4 h-4 text-[#68696b]" />
                <div className="text-[#68696b] text-sm font-normal leading-normal tracking-tight">
                  {location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isReviewMode || expanded ? (
          <div
            className="w-10 h-10 relative bg-[#dbffea] rounded-3xl flex items-center justify-center cursor-pointer"
            onClick={() => handleEditClick("basic")}
            title="Edit basic information"
          >
            <PenIcon className="w-5 h-5 text-[#10b754]" />
          </div>
        ) : (
          <div
            className="rounded flex justify-center items-center gap-2 cursor-pointer"
            onClick={onPreviewClick}
          >
            <Eye className="w-4 h-4 text-[#10b754]" />
            <div className="text-[#10b754] text-xs font-medium leading-tight tracking-tight">
              Preview
            </div>
          </div>
        )}
      </div>

      {/* Job Metadata */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">Location</div>
            <div className="text-[#414447] text-sm font-medium">{location}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">Job Type</div>
            <div className="text-[#414447] text-sm font-medium">
              {formatJobType(jobType)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">
              Workplace Type
            </div>
            <div className="text-[#414447] text-sm font-medium">
              {formatJobType(workplaceType)}
            </div>
          </div>
          {experienceLevel && (
            <div className="space-y-1">
              <div className="text-[#68696b] text-xs font-normal">
                Job Experience Level
              </div>
              <div className="text-[#414447] text-sm font-medium">
                {formatJobType(experienceLevel)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extended Preview (Only visible when expanded=true) */}
      {expanded && (
        <div className="space-y-4 mt-4">
          {/* Description Section */}
          <div className="bg-white rounded-lg mx-4 border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[#414447] text-base font-medium">Description</h3>
              {(isReviewMode || expanded) && (
                <div
                  className="cursor-pointer"
                  onClick={(e) => handleEditClick("basic", e)}
                  title="Edit basic information"
                >
                  <PenIcon className="w-5 h-5 text-[#10b754]" />
                </div>
              )}
            </div>
            <div className="px-4 pb-4">
              {description ? (
                <p className="text-sm text-[#414447]">{description}</p>
              ) : (
                <p className="text-sm text-[#68696b]">No description provided</p>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg mx-4 border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[#414447] text-base font-medium">Skills</h3>
              {(isReviewMode || expanded) && (
                <div
                  className="cursor-pointer"
                  onClick={(e) => handleEditClick("skills", e)}
                  title="Edit skills"
                >
                  <PenIcon className="w-5 h-5 text-[#10b754]" />
                </div>
              )}
            </div>
            <div className="px-4 pb-4">
              {processedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {processedSkills.map((skill, index) => (
                    <div
                      key={`${skill._id || 'skill'}-${index}`}
                      className="text-sm px-3 py-1.5 rounded-[26px] border border-black/10 bg-[#F5F5F5] text-gray-700 flex items-center gap-2"
                    >
                      {skill.icon && (
                        <img src={skill.icon} alt="" className="w-4 h-4" />
                      )}
                      <span>{skill.name} : {skill.importance}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#68696b]">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Applicant Questions Section */}
          <div className="bg-white rounded-lg mx-4 border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-[#414447] text-base font-medium">Applicant Questions</h3>
              {(isReviewMode || expanded) && (
                <div
                  className="cursor-pointer"
                  onClick={(e) => handleEditClick("screening", e)}
                  title="Edit applicant questions"
                >
                  <PenIcon className="w-5 h-5 text-[#10b754]" />
                </div>
              )}
            </div>
            <div className="px-4 pb-4">
              {screeningQuestions.length > 0 ? (
                <div className="space-y-3">
                  {screeningQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="text-sm font-medium text-[#414447]">
                        {index + 1}. {getFormattedQuestion(question)}
                      </p>
                      {question.type === "multiple_choice" &&
                        question.options && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="w-3 h-3 rounded-full border border-[#68696b]"></div>
                                <span className="text-sm text-[#68696b]">
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      {question.is_eliminatory && (
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-[#d92d20] font-medium">
                            Must-have qualification
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#68696b]">
                  No applicant questions added yet
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons for review mode */}
          {isReviewMode && (
            <div className="flex justify-end gap-4 p-4 bg-white border-t border-gray-100 mx-4 rounded-lg">
              <Button
                variant="outline"
                className="text-[#414447] border-[#68696b]"
                onClick={() => handleEditClick("screening")}
              >
                Previous
              </Button>
              <Button 
                className="bg-[#10b754] hover:bg-[#0ea64a] text-white"
                onClick={() => handleEditClick("review")}
              >
                Save Job
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPreviewSidebar;