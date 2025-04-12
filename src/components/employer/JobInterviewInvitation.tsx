import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Check, Clock, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { detectMobileDevice } from "@/utils/deviceDetection";
import eLogo from "@/assets/branding/eLogo.svg";
import { InterviewDateModal } from "./InterviewDateModal";

import {
  useCheckInviteStatusQuery,
  useRespondToInviteMutation,
  useCheckUserExistsMutation,
  useSendInvitationResponseMailMutation,
} from "@/api/InterviewInvitation";
import { useGetJobDetailsQuery } from "@/api/employerJobsApiSlice";
import { SwitchToDesktopModal } from "./SwitchToDesktopModal";

// Add styles for rich text content
const richTextStyles = `
  .job-description-content ul, .job-description-content ol {
    list-style-position: outside;
    padding-left: 1.5rem;
    margin: 1rem 0;
  }
  
  .job-description-content ul {
    list-style-type: disc;
  }
  
  .job-description-content ol {
    list-style-type: decimal;
  }
  
  .job-description-content li {
    margin: 0.25rem 0;
    padding-left: 0.5rem;
    display: list-item;
  }
  
  .job-description-content li p {
    margin: 0;
    display: inline;
  }
  
  .job-description-content table {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;
  }
  
  .job-description-content table td, 
  .job-description-content table th {
    border: 1px solid #d1d5db;
    padding: 0.5rem;
  }
  
  .job-description-content table th {
    background-color: #f3f4f6;
    font-weight: 500;
  }
  
  .job-description-content p {
    margin: 1rem 0;
  }
`;

export default function JobInvitation() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [userCheckInitiated, setUserCheckInitiated] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isDesktopSwitchModalOpen, setIsDesktopSwitchModalOpen] =
    useState(false);

  const {
    data: inviteStatusData,
    error: statusError,
    isLoading: statusLoading,
  } = useCheckInviteStatusQuery(inviteId || "", {
    skip: !inviteId,
  });

  console.log("inviteStatusData", inviteStatusData);

  const jobId = inviteStatusData?.data?.jobDetails;

  const { data: jobDetailsData, isLoading: jobDetailsLoading } =
    useGetJobDetailsQuery(jobId || "", {
      skip: !jobId,
    });

  const [
    respondToInvite,
    { data: responseData, error: responseError, isLoading: responseLoading },
  ] = useRespondToInviteMutation();

  const [checkUserExists, { isLoading: userCheckLoading }] =
    useCheckUserExistsMutation();

  // Check if user is on mobile device
  useEffect(() => {
    setIsMobileDevice(detectMobileDevice());
  }, []);

  const [sendInvitationResponseMail] = useSendInvitationResponseMailMutation();

  // Format deadline date
  const deadlineDate = inviteStatusData?.data?.deadline
    ? new Date(inviteStatusData?.data?.deadline)
    : null;
  const formattedDeadline = deadlineDate
    ? deadlineDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  // Calculate days left
  const calculateDaysLeft = (deadline: string) => {
    if (!deadline) return "N/A";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "Day" : "Days"} Left`;
  };

  const daysLeft = calculateDaysLeft(inviteStatusData?.data?.deadline || "");

  const companyName =
    typeof jobDetailsData?.data.company === "object" &&
    jobDetailsData?.data.company?.name;
  const companyLogo =
    typeof jobDetailsData?.data.company === "object"
      ? jobDetailsData?.data.company?.logo
      : null;
  const location = jobDetailsData?.data.location;
  const workType = jobDetailsData?.data.work_place_type;
  const level = jobDetailsData?.data.experience_level;
  const Description = jobDetailsData?.data.description;

  // Check if user exists in the database
  useEffect(() => {
    if (!userCheckInitiated && inviteStatusData?.data) {
      const candidateEmail = inviteStatusData?.data?.candidateInfo?.email;
      console.log("candidateEmail", candidateEmail);
      if (candidateEmail && inviteId) {
        setUserCheckInitiated(true);

        checkUserExists({ email: candidateEmail, inviteId: inviteId })
          .unwrap()
          .then((response) => {
            setUserExists(!!response.userId);
            console.log("User exists check:", !!response.userId);
          })
          .catch((error) => {
            console.error("Error checking if user exists:", error);
            setUserExists(false);
          });
      }
    }
  }, [inviteStatusData, checkUserExists, userCheckInitiated, inviteId]);

  // Handle action from URL parameter
  useEffect(() => {
    const handleAction = async () => {
      if (!inviteId || !action || processingComplete) return;

      if (!["accept", "decline"].includes(action)) {
        setErrorMessage("Invalid action specified");
        setProcessingComplete(true);
        return;
      }

      if (inviteStatusData?.data?.isExpired) {
        setProcessingComplete(true);
        return;
      }

      // Auto-decline if that's the action
      if (action === "decline") {
        try {
          await respondToInvite({
            inviteId: inviteId || "",
            action,
          }).unwrap();
          setProcessingComplete(true);
        } catch (err) {
          console.error("Error responding to invitation:", err);
          setErrorMessage("Failed to process your response. Please try again.");
          setProcessingComplete(true);
        }
      } else if (
        action === "accept" &&
        inviteStatusData?.data.status === "pending"
      ) {
        setTimeout(() => {
          setIsModalOpen(true);
        }, 1000);
      }
    };

    if (inviteStatusData && !statusLoading && !processingComplete) {
      handleAction();
    }
  }, [
    inviteId,
    action,
    inviteStatusData,
    statusLoading,
    respondToInvite,
    processingComplete,
  ]);

  // Handle errors
  useEffect(() => {
    if (statusError) {
      setErrorMessage(
        (statusError as any)?.data?.message ||
          "Failed to check invitation status"
      );
      setProcessingComplete(true);
    }
    if (responseError) {
      setErrorMessage(
        (responseError as any)?.data?.message ||
          "Failed to process your response"
      );
      setProcessingComplete(true);
    }
  }, [statusError, responseError]);

  // Check if invitation is already responded to
  useEffect(() => {
    if (
      inviteStatusData?.data?.status &&
      inviteStatusData.data.status !== "pending"
    ) {
      setProcessingComplete(true);
    }
  }, [inviteStatusData]);

  const handleAcceptInvite = () => {
    if (userExists === null && userCheckLoading) {
      // Still checking user existence
      console.log("Still checking if user exists...");
      return;
    }

    if (dateSelected) {
      // If date is already selected, proceed with accepting the invitation
      handleConfirmAccept();
    } else {
      // Otherwise open the calendar modal
      setIsModalOpen(true);
    }
  };

  const handleDeclineInvite = async () => {
    try {
      await respondToInvite({
        inviteId: inviteId || "",
        action: "decline",
      }).unwrap();

      setProcessingComplete(true);
    } catch (err) {
      console.error("Error declining invitation:", err);
      setErrorMessage("Failed to decline the invitation. Please try again.");
    }
  };

  const handleConfirmAccept = async () => {
    if (!selectedDate) {
      setErrorMessage("Please select a submission date before continuing");
      return;
    }

    try {
      const response = await respondToInvite({
        inviteId: inviteId || "",
        action: "accept",
        submission_expected_date: selectedDate.toISOString(),
      }).unwrap();

      if (response.success && inviteStatusData?.data?.candidateInfo) {
        await sendInvitationResponseMail({
          inviteId: inviteId || "",
          candidateEmail: inviteStatusData.data.candidateInfo.email,
          candidateName: inviteStatusData.data.candidateInfo.name,
          jobTitle: jobDetailsData?.data.title,
          companyName:
            typeof jobDetailsData?.data.company === "object"
              ? jobDetailsData?.data.company?.name
              : "",
          status: "accepted",
          submissionDate: selectedDate.toISOString(),
        });
      }

      setProcessingComplete(true);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setErrorMessage("Failed to accept the invitation. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseDesktopSwitchModal = () => {
    setIsDesktopSwitchModalOpen(false);
  };

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    setDateSelected(true);
    setIsModalOpen(false);
    console.log("Interview date confirmed:", date.toLocaleDateString());
    // Note: We don't automatically accept the invitation here anymore
  };

  const redirectToAccount = () => {
    if (isMobileDevice) {
      setIsDesktopSwitchModalOpen(true);
      return;
    }
    if (userExists) {
      window.location.href = "https://employability.ai/login";
    } else {
      window.location.href = `https://employability.ai/signup?inviteId=${inviteId}`;
    }
  };

  // Function to determine if text contains HTML
  const isHTML = (text: string) => {
    return /<\/?[a-z][\s\S]*>/i.test(text);
  };

  // Loading state
  if (
    statusLoading ||
    (responseLoading && !processingComplete) ||
    userCheckLoading ||
    jobDetailsLoading
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin mr-2 h-8 w-8 border-t-2 border-b-2 border-[#0AD472] rounded-full"></div>
        <p className="ml-2 text-lg">Processing your response...</p>
      </div>
    );
  }

  // Error message
  if (errorMessage) {
    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card className="p-6">
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <div className="flex items-center text-red-700 font-semibold text-lg mb-2">
              <AlertCircle className="mr-2" /> Error Processing Request
            </div>
            <p className="text-red-600">{errorMessage}</p>
          </div>
          <Button
            onClick={() => (window.location.href = "https://employability.ai")}
            className="w-full bg-[#001630] text-white"
          >
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  // Expired invitation
  if (inviteStatusData?.data?.isExpired) {
    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card className="p-6">
          <div className="bg-amber-50 p-4 rounded-lg mb-4">
            <div className="flex items-center text-amber-700 font-semibold text-lg mb-2">
              <Clock className="mr-2" /> Interview Invitation Expired
            </div>
            <p className="text-gray-700 mb-2">
              {jobDetailsData?.data.title || "This position"} at{" "}
              {companyName || "the company"}
            </p>
            <p>This interview invitation has expired and is no longer valid.</p>
            <p className="mt-4 text-gray-600">
              Please contact the employer if you wish to arrange another
              interview opportunity.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "https://employability.ai")}
            className="w-full bg-[#001630] text-white"
          >
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  // Main UI for pending invitation
  return (
    <div className="max-w-4xl mx-auto p-8 sm:p-6 bg-[#ffffff]">
      {/* Add the styles for rich text content */}
      <style dangerouslySetInnerHTML={{ __html: richTextStyles }} />
      
      {/* Header with logo and job title */}
      <div className="flex items-center mb-8">
        <div className="flex items-center font-ubuntu text-[22px] font-bold leading-normal">
          <img
            src={eLogo || "/placeholder.svg"}
            alt="Logo"
            className="w-[38px] h-[35px] mr-2.5"
          />
          <span className="text-[#001630]">Employ</span>
          <span className="text-[#0AD472]">Ability.AI</span>
        </div>
      </div>

      {/* Success Banner */}
      {inviteStatusData?.data.status !== "pending" && processingComplete && (
        <div className="flex items-center justify-between bg-white mb-10">
          <div className="flex items-center gap-4">
            {inviteStatusData?.data.status === "accepted" ? (
              <h2 className="text-[18px] font-medium leading-5 text-[#202326]">
                <span className="text-3xl">🎉</span> Thank you for Accepting the
                Invite
              </h2>
            ) : (
              inviteStatusData?.data.status === "declined" && (
                <h2 className="text-[18px] font-medium leading-5 text-[#202326]">
                  <span className="text-3xl">📩</span> We appreciate your time
                  and hope to connect in the future. 🤝
                </h2>
              )
            )}
          </div>
          <Button
            onClick={redirectToAccount}
            className="bg-[#001630] hover:bg-[#001630]/90 text-[14px] font-medium leading-5 tracking-[0.21px] text-white px-8 py-2 rounded-lg sm:hidden"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Job details and action buttons */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-[#ddf8e8] rounded-full flex items-center justify-center">
            {companyLogo ? (
              <img
                src={companyLogo || "/placeholder.svg"}
                alt={`${companyName || "Company"} logo`}
                className="w-full h-full object-cover border border-[#ECEEF0] rounded-full"
              />
            ) : (
              <FileText className="w-8 h-8 text-[#03963f]" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h2 className="text-sub-header text-[#414447]">
                {jobDetailsData?.data.title}
              </h2>
              <span className="px-2 py-0.5 bg-[#eceef0] text-[#414447] text-[14px] font-medium leading-5 tracking-[0.07px] rounded-full">
                {level}
              </span>
            </div>
            <p className="text-[#68696b] text-[14px] font-normal leading-5 tracking-[0.07px] mt-1">
              {companyName} | {location} | {workType}
            </p>
          </div>
        </div>
        {/* Replace with responsive button container that's fixed on small screens */}
        <div className="flex gap-3 sm:hidden">
          {!dateSelected && inviteStatusData?.data.status === "pending" && (
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 border-[#d6d7d9] text-[#202326]"
              onClick={handleDeclineInvite}
            >
              <X className="w-4 h-4" /> Decline
            </Button>
          )}

          {inviteStatusData?.data.status === "pending" && (
            <Button
              className="flex items-center gap-2 px-6 bg-[#68696B] hover:bg-[#bbddc9] text-white border-none"
              onClick={handleAcceptInvite}
            >
              <Check className="w-4 h-4" />{" "}
              {dateSelected ? "Confirm" : "Accept Invite"}
            </Button>
          )}
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-[#eceef0] my-6"></div>

      {/* Commited Submission Date */}
      {selectedDate && (
        <div className="mb-8">
          <h3 className="text-h2 text-[#202326] mb-2">
            Committed Submission Date
          </h3>
          <p className="text-[#68696b] text-[14px] font-normal leading-6 tracking-[0.21px] mb-4">
            *This helps your employer know when to expect your submission
          </p>

          <div className="bg-[#f0f3f7] rounded-lg p-4 inline-block">
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.24px]">
              {selectedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              |{" "}
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffTime = selectedDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return `${diffDays} ${diffDays === 1 ? "Day" : "Days"} Left`;
              })()}
            </p>
          </div>
        </div>
      )}

      {/* About Interview */}
      <div className="mb-6">
        <h3 className="text-h2 text-[#202326] mb-6">About Interview</h3>

        <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#f0a422] mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-[14px] font-normal leading-5 tracking-[0.21px]">
                Type
              </span>
            </div>
            <p className="text-[#202326] text-[16px] font-medium leading-[28px] tracking-[0.24px]">
              Full Interview, Video Based, Screen Shared
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[#fd5964] mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-[14px] font-normal leading-5 tracking-[0.21px]">
                Submission Due Date
              </span>
            </div>
            <p className="text-[#202326] text-[16px] font-medium leading-[28px] tracking-[0.24px]">
              {formattedDeadline} | {daysLeft}
            </p>
          </div>
        </div>
      </div>
      <Card className="border border-[#eceef0] rounded-lg mb-8">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 py-3 px-5 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#5990ff]" />
            <span className="text-[#414447] text-[14px] font-medium leading-5 tracking-[0.21px]">
              Interview Process
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a561ff]" />
            <span className="text-[#414447] text-[14px] font-medium leading-5 tracking-[0.21px]">
              Est. Duration
            </span>
          </div>
        </div>

        <div className="py-3">
          {/* Main interview type */}
          {inviteStatusData?.data?.task?.interview_type.type && (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2">
              <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
                {inviteStatusData.data.task.interview_type.type
                  .charAt(0)
                  .toUpperCase() +
                  inviteStatusData.data.task.interview_type.type.slice(1)}{" "}
                Interview
              </p>
              <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
                {inviteStatusData.data.task.interview_type.estimated_time || 40}{" "}
                Mins
              </p>
            </div>
          )}

          {/* Questionnaire - static entry */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2">
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              Questionnaire
            </p>
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              10 Mins
            </p>
          </div>

          {/* Skills assessment */}
          {inviteStatusData?.data?.task.skills &&
            inviteStatusData.data.task.skills.map((skill: any, index: any) => (
              <div
                key={skill._id || index}
                className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2"
              >
                <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
                  {skill.name}{" "}
                  {skill.status !== "incomplete" && `(${skill.status})`}
                </p>
                <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
                  {skill.estimated_time} Mins
                </p>
              </div>
            ))}
        </div>
      </Card>
      {/* Divider */}
      <div className="border-t border-[#eceef0] my-6"></div>
      {/* Job Description */}
      <div>
        <h3 className="text-h2 text-[#202326] mb-6">Job Description</h3>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {Description && (
            <>
              {isHTML(Description) ? (
                <div 
                  className="text-[#414447] text-body2 job-description-content prose prose-sm sm:prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: Description }}
                />
              ) : (
                <div className="text-[#414447] text-body2 whitespace-pre-line">
                  {Description}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Fixed bottom buttons for small screens */}
      {!processingComplete ? (
        <div className="hidden sm:flex fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-[#eceef0] gap-3 justify-between z-10">
          {!dateSelected && inviteStatusData?.data.status === "pending" && (
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 border-[#d6d7d9] text-[#202326]"
              onClick={handleDeclineInvite}
            >
              <X className="w-4 h-4" /> Decline
            </Button>
          )}

          {inviteStatusData?.data.status === "pending" && (
            <Button
              className="flex-1 flex items-center justify-center gap-2 bg-[#68696B] hover:bg-[#bbddc9] text-white border-none"
              onClick={handleAcceptInvite}
            >
              <Check className="w-4 h-4" />{" "}
              {dateSelected ? "Confirm" : "Accept Invite"}
            </Button>
          )}
        </div>
      ) : (
        <div className="hidden sm:flex fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-[#eceef0] gap-3 justify-between z-10">
          {inviteStatusData?.data.status !== "pending" && (
            <Button
              onClick={redirectToAccount}
              className="flex-1 flex items-center justify-center bg-[#001630] hover:bg-[#001630]/90 text-[14px] font-medium leading-5 tracking-[0.21px] text-white px-8 py-2 rounded-lg"
            >
              Continue
            </Button>
          )}
        </div>
      )}
      {/* Interview Date Modal */}
      <InterviewDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDate}
        deadlineDate={deadlineDate}
        isMobileDevice={isMobileDevice}
      />
      {/* Switch to Desktop Modal */}
      <SwitchToDesktopModal
        isOpen={isDesktopSwitchModalOpen}
        onClose={handleCloseDesktopSwitchModal}
      />
    </div>
  );
}