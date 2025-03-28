"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Check, Clock, FileText, X, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import eLogo from "@/assets/branding/eLogo.svg";
import { InterviewDateModal } from "./InterviewDateModal";

import {
  useCheckInviteStatusQuery,
  useRespondToInviteMutation,
  useCheckUserExistsMutation,
} from "@/api/InterviewInvitation";
import { useGetJobDetailsQuery } from "@/api/employerJobsApiSlice";

export default function JobInvitation() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const inviteId = "67e62c0ec73df887ba78e261";
  const action = searchParams.get("action") || "accept";

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [userCheckInitiated, setUserCheckInitiated] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  const {
    data: inviteStatusData,
    error: statusError,
    isLoading: statusLoading,
  } = useCheckInviteStatusQuery(inviteId || "", {
    skip: !inviteId,
    refetchOnMountOrArgChange: true,
  });

  console.log("InviteStatusData", inviteStatusData);
  const jobId = inviteStatusData?.data?.jobDetails;

  const { data: jobDetailsData } = useGetJobDetailsQuery(jobId || "", {
    skip: !jobId,
    refetchOnMountOrArgChange: true,
  });

  console.log("JobDetails", jobDetailsData);

  const [
    respondToInvite,
    { data: responseData, error: responseError, isLoading: responseLoading },
  ] = useRespondToInviteMutation();

  const [checkUserExists, { isLoading: userCheckLoading }] =
    useCheckUserExistsMutation();

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
  const location = jobDetailsData?.data.location;
  const workType = jobDetailsData?.data.work_place_type;
  const level = jobDetailsData?.data.experience_level;
  const Description = jobDetailsData?.data.description;

  // Check if user exists in the database
  useEffect(() => {
    if (!userCheckInitiated && inviteStatusData?.data) {
      const candidateEmail = inviteStatusData?.data?.candidateInfo?.email;
      if (candidateEmail) {
        setUserCheckInitiated(true);

        checkUserExists({ email: candidateEmail })
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
  }, [inviteStatusData, checkUserExists, userCheckInitiated]);

  // Handle action from URL parameter
  useEffect(() => {
    const handleAction = async () => {
      if (!inviteId || !action || processingComplete) return;

      if (!["accept", "decline"].includes(action)) {
        setErrorMessage("Invalid action specified");
        setProcessingComplete(true);
        return;
      }

      // Check invitation status
      if (
        inviteStatusData?.data?.status &&
        inviteStatusData.data.status !== "pending"
      ) {
        setErrorMessage(
          `This invitation has already been ${inviteStatusData.data.status}`
        );
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
      await respondToInvite({
        inviteId: inviteId || "",
        action: "accept",
        commited_due_date: selectedDate.toISOString(),
      }).unwrap();

      setProcessingComplete(true);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setErrorMessage("Failed to accept the invitation. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    setDateSelected(true);
    setIsModalOpen(false);
    console.log("Interview date confirmed:", date.toLocaleDateString());
    // Note: We don't automatically accept the invitation here anymore
  };

  const redirectToAccount = () => {
    if (userExists) {
      window.location.href =
        "https://employability.ai/login?redirect=dashboard";
    } else {
      window.location.href = "https://employability.ai/signup";
    }
  };

  // Loading state
  if (
    statusLoading ||
    (responseLoading && !processingComplete) ||
    userCheckLoading
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

  // Already responded
  if (
    inviteStatusData?.data?.status &&
    inviteStatusData.data.status !== "pending"
  ) {
    const statusDisplay =
      inviteStatusData.data.status === "accepted" ? "accepted" : "declined";

    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card className="p-6">
          <div
            className={`bg-${
              statusDisplay === "accepted" ? "green" : "gray"
            }-50 p-4 rounded-lg mb-4`}
          >
            <div
              className={`flex items-center text-${
                statusDisplay === "accepted" ? "green" : "gray"
              }-700 font-semibold text-lg mb-2`}
            >
              {statusDisplay === "accepted" ? (
                <>
                  <Check className="mr-2" /> Interview Already Accepted
                </>
              ) : (
                <>
                  <X className="mr-2" /> Interview Already Declined
                </>
              )}
            </div>
            <p className="text-gray-700 mb-2">
              {jobDetailsData?.data.title || "This position"} at{" "}
              {companyName || "the company"}
            </p>
            <p>You have already {statusDisplay} this interview invitation.</p>
            {statusDisplay === "accepted" && (
              <Alert className="mt-4" variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                  Please log into your EmployAbility.AI account to take the
                  interview.
                </AlertDescription>
              </Alert>
            )}
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

  // Success message after responding
  // if (responseData?.success && processingComplete) {
  //   return (
  //     <div className="container mx-auto mt-16 max-w-4xl">
  //       {/* Success Banner */}
  //       <div className="flex items-center justify-between bg-white p-4 mb-6 rounded-lg shadow-sm">
  //         <div className="flex items-center gap-4">
  //           <img
  //             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employability.AI-dHQbgFHoQqmzHDbaw1IPprk8POamu0.png"
  //             alt="Celebration"
  //             className="w-12 h-12"
  //           />
  //           <h2 className="text-2xl font-semibold text-[#202326]">
  //             Thank you for{" "}
  //             {action === "accept" ? "Accepting" : "Responding to"} the Invite
  //           </h2>
  //         </div>
  //         {action === "accept" ? (
  //           <Button
  //             onClick={redirectToAccount}
  //             className="bg-[#001630] hover:bg-[#001630]/90 text-white px-8 py-2 rounded-lg"
  //           >
  //             Continue
  //           </Button>
  //         ) : (
  //           <Button
  //             onClick={() =>
  //               (window.location.href = "https://employability.ai")
  //             }
  //             className="bg-[#001630] hover:bg-[#001630]/90 text-white px-8 py-2 rounded-lg"
  //           >
  //             Return to Homepage
  //           </Button>
  //         )}
  //       </div>

  //       <Card className="p-6">
  //         <div
  //           className={`bg-${
  //             action === "accept" ? "green" : "gray"
  //           }-50 p-4 rounded-lg mb-4`}
  //         >
  //           <div
  //             className={`flex items-center text-${
  //               action === "accept" ? "green" : "gray"
  //             }-700 font-semibold text-lg mb-2`}
  //           >
  //             {action === "accept" ? (
  //               <>
  //                 <Check className="mr-2" /> Interview Accepted
  //               </>
  //             ) : (
  //               <>
  //                 <X className="mr-2" /> Interview Declined
  //               </>
  //             )}
  //           </div>
  //           {action === "accept" && (
  //             <p className="text-gray-700 mb-2">
  //               {jobDetailsData?.data.title || "This position"} at{" "}
  //               {companyName || "the company"}
  //             </p>
  //           )}
  //           <p>{responseData.message || "Your response has been recorded."}</p>

  //           {action === "accept" && (
  //             <Alert className="mt-4" variant="default">
  //               <Check className="h-4 w-4" />
  //               <AlertTitle>Interview Accepted Successfully!</AlertTitle>
  //               <AlertDescription>
  //                 Thank you for accepting this interview invitation. You can now
  //                 proceed to take your interview.
  //               </AlertDescription>
  //             </Alert>
  //           )}
  //         </div>
  //         {action === "accept" ? (
  //           <Button
  //             onClick={redirectToAccount}
  //             className="w-full bg-[#16a34a] text-white"
  //           >
  //             {userExists
  //               ? "Login & Take Interview"
  //               : "Create Account & Take Interview"}
  //           </Button>
  //         ) : (
  //           <Button
  //             onClick={() =>
  //               (window.location.href = "https://employability.ai")
  //             }
  //             className="w-full bg-[#001630] text-white"
  //           >
  //             Return to Homepage
  //           </Button>
  //         )}
  //       </Card>
  //     </div>
  //   );
  // }

  // Main UI for pending invitation
  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#ffffff]">
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
      {responseData?.success && processingComplete && (
        <div className="flex items-center justify-between bg-white mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] font-medium leading-5 text-[#202326]">
              <span className="text-3xl">🎉</span> Thank you for Accepting the
              Invite
            </h2>
          </div>
          <Button
            onClick={redirectToAccount}
            className="bg-[#001630] hover:bg-[#001630]/90 text-[14px] font-medium leading-5 tracking-[0.21px] text-white px-8 py-2 rounded-lg"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Job details and action buttons */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-[#ddf8e8] rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#03963f]" />
          </div>
          <div>
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
        <div className="flex gap-3">
          {!dateSelected && (
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 border-[#d6d7d9] text-[#202326]"
              onClick={handleDeclineInvite}
            >
              <X className="w-4 h-4" /> Decline
            </Button>
          )}

          {!responseData?.success && (
            <Button
              className="flex items-center gap-2 px-6 bg-[#68696B] hover:bg-[#bbddc9] text-white border-none"
              onClick={handleAcceptInvite}
            >
              <Check className="w-4 h-4" />{" "}
              {dateSelected ? "Continue" : "Accept Invite"}
            </Button>
          )}
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-[#eceef0] my-10"></div>
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

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
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
      {/* Interview Process */}
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
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2">
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              Full Interview
            </p>
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              25 Mins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2">
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              Questionnaire
            </p>
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              10 Mins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2">
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              React Skill Test
            </p>
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              30 Mins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-5 py-2">
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              Python Skill Test
            </p>
            <p className="text-[#414447] text-[16px] font-medium leading-6 tracking-[0.08px]">
              30 Mins
            </p>
          </div>
        </div>
      </Card>
      {/* Divider */}
      <div className="border-t border-[#eceef0] my-6"></div>
      {/* Job Description */}
      <div className="mb-8">
        <h3 className="text-h2 text-[#202326] mb-6">Job Description</h3>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {Description}
        </div>
      </div>
      {userCheckInitiated && (
        <div className="mb-8">
          <h3 className="text-h2 text-[#202326] mb-2">Account Status</h3>
          <p className="text-[#68696b] text-[14px] font-normal leading-6 tracking-[0.21px] mb-4">
            {userExists === null
              ? "Checking your account status..."
              : userExists
              ? "You already have an account. You'll be redirected to login after accepting."
              : "You'll need to create an account after accepting this invitation."}
          </p>
        </div>
      )}
      {/* Interview Date Modal */}
      <InterviewDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDate}
        deadlineDate={deadlineDate}
      />
    </div>
  );
}
