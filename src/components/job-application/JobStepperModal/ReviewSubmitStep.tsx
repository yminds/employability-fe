import { PencilIcon } from "lucide-react";
import { ActivelySeekingJobsSVG } from "../SVG/ActivelySeekingJobsSVG";
import PdfFile from "@/assets/job-posting/pdfFile.svg";
import { Button } from "@/components/ui/button";

interface FormattedAnswer {
  question_id: string;
  question: string;
  question_type: string;
  answer: string;
}

interface ReviewSubmitStepProps {
  userData: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    resumeUrl?: string;
    resumeName?: string;
    profileImage?: string;
    resume_s3_url?: string;
    currentStatus?: string;
  };
  applicationData: Record<string, string> | FormattedAnswer[];
  screeningQuestions: Array<{
    _id: string;
    question: string;
    type: string;
    is_mandatory: boolean;
    options?: string[];
    customField?: string;
  }>;
  onEditSection: (section: "details" | "resume" | "questions") => void;
}

export default function ReviewSubmitStep({
  userData,
  applicationData,
  screeningQuestions,
  onEditSection,
}: ReviewSubmitStepProps) {
  const createUserFriendlyResumeName = (userName: string): string => {
    if (!userName) return "Resume.pdf";

    const firstName = userName.split(" ")[0];
    return `${firstName}'s Resume.pdf`;
  };

  const displayResumeName =
    userData.resumeName ||
    (userData.resume_s3_url
      ? createUserFriendlyResumeName(userData.name)
      : "No resume uploaded");

  const getAnswerForQuestion = (questionId: string): string => {
    if (Array.isArray(applicationData)) {
      const questionData = applicationData.find(
        (item) => item.question_id === questionId
      );
      return questionData?.answer || "Not answered";
    } else {
      return applicationData[questionId] || "Not answered";
    }
  };

  const isActivelySeekingJobs =
    userData.currentStatus === "Actively seeking jobs";

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-body2">Your Details</h3>
          <Button
            variant="ghost"
            className="text-[#10B754] hover:bg-transparent"
            aria-label="Edit profile"
            onClick={() => onEditSection("details")}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-[#F2F3F5] p-4 rounded-lg">
          {/* User Profile */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="relative w-[95px] h-[95px] rounded-full overflow-hidden">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage || "/placeholder.svg"}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#E5E7EB] text-[#374151] text-[32px] font-semibold">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : ""}
                  </div>
                )}
                {isActivelySeekingJobs && ActivelySeekingJobsSVG}
              </div>
            </div>
            <div>
              <h3 className="text-sub-header text-[#202326]">
                {userData.name}
              </h3>
              <p className="text-[14px] font-medium leading-6 tracking-[0.07px] text-[#414447]">
                {userData.title}
              </p>
              <p className="text-[14px] font-normal leading-6 tracking-[0.07px] text-[#68696B]">
                {userData.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-body2 text-sm text-[#68696B]">Email</p>
              <p className="text-body2 text-[#414447]">{userData.email}</p>
            </div>
            <div>
              <p className="text-body2 text-sm text-[#68696B]">Phone Number</p>
              {userData.phone ? (
                <p className="text-body2 text-[#414447]">{userData.phone}</p>
              ) : (
                <p className="text-body2 text-[#414447]">Not Provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-body2">Resume</h3>
          <Button
            variant="ghost"
            className="text-[#10B754] hover:bg-transparent"
            onClick={() => onEditSection("resume")}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-[#F2F3F5] p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded">
              <img
                src={PdfFile || "/placeholder.svg"}
                alt="Pdf"
                className="w-5 h-5"
              />
            </div>
            <div>
              <p className="text-body2">{displayResumeName}</p>
              {userData.resume_s3_url && (
                <a
                  href={userData.resume_s3_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#10B754] hover:underline"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Questions Section - Only show if there are questions */}
      {screeningQuestions && screeningQuestions.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-body2">Application Questions</h3>
            <Button
              variant="ghost"
              className=" text-[#10B754] hover:bg-transparent"
              aria-label="Edit application questions"
              onClick={() => onEditSection("questions")}
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-[#F2F3F5] p-6 rounded-lg relative">
            <div className="space-y-4">
              {screeningQuestions.map((question) => (
                <div key={question._id}>
                  <p className="text-sm text-[#68696B]">
                    {question.is_mandatory && (
                      <span className="text-red-500">*</span>
                    )}
                    {question.question}
                  </p>
                  <p className="text-body2 text-sm text-[#414447] pt-2">
                    {getAnswerForQuestion(question._id)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
