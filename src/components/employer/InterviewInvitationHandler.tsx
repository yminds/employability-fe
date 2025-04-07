import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { 
  useCheckInviteStatusQuery, 
  useRespondToInviteMutation,
  useCheckUserExistsMutation 
} from "@/api/InterviewInvitation";
import { useGetJobDetailsQuery } from "@/api/employerJobsApiSlice";
import { Loader, CheckCircle, XCircle, Clock, AlertCircle, Smartphone, Laptop, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/elements/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { detectMobileDevice } from "@/utils/deviceDetection";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Simplified job details extraction
const extractJobDetails = (data: any) => {
  let jobTitle = "the position";
  let companyName = "the company";
  
  if (!data) return { jobTitle, companyName };
  
  if (data?.data?.jobDetails) {
    const jobDetails = data.data.jobDetails;
    jobTitle = jobDetails.title || jobDetails.job_title || jobTitle;
    
    if (typeof jobDetails.company === 'string') {
      companyName = jobDetails.company;
    } else if (typeof jobDetails.company === 'object' && jobDetails.company !== null) {
      companyName = jobDetails.company.name || companyName;
    } else if (jobDetails.company_name) {
      companyName = jobDetails.company_name;
    }
  } 
  else if (data?.data) {
    jobTitle = data.data.title || jobTitle;
    
    if (data.data?.company && typeof data.data.company === 'object') {
      companyName = data.data.company.name || companyName;
    }
  }
  
  return { jobTitle, companyName };
};

const InterviewInvitationHandler: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [userCheckInitiated, setUserCheckInitiated] = useState(false);
  const [jobDetails, setJobDetails] = useState<{ jobTitle: string; companyName: string }>({
    jobTitle: "the position",
    companyName: "the company"
  });
  const [jobId, setJobId] = useState<string | null>(null);
  
  // RTK Query hooks
  const { 
    data: inviteStatusData, 
    error: statusError, 
    isLoading: statusLoading,
    isFetching: statusFetching
  } = useCheckInviteStatusQuery(inviteId || '', { 
    skip: !inviteId,
    refetchOnMountOrArgChange: true
  });

  console.log("inviteStatusData", inviteStatusData);
  
  
  const {
    data: jobDetailsData,
    isLoading: jobDetailsLoading
  } = useGetJobDetailsQuery(jobId || '', {
    skip: !jobId,
    refetchOnMountOrArgChange: true
  });
  
  const [respondToInvite, { 
    data: responseData, 
    error: responseError, 
    isLoading: responseLoading 
  }] = useRespondToInviteMutation();

  const [checkUserExists, {
    isLoading: userCheckLoading
  }] = useCheckUserExistsMutation();

  // Check if user is on mobile device
  useEffect(() => {
    setIsMobileDevice(detectMobileDevice());
  }, []);
  
  // Extract job ID from invite data
  useEffect(() => {
    if (inviteStatusData?.data?.jobDetails) {
      const jobDetailsObj = inviteStatusData.data.jobDetails;
      
      if (typeof jobDetailsObj === 'string') {
        setJobId(jobDetailsObj);
      } else if (jobDetailsObj?._id) {
        setJobId(jobDetailsObj._id);
      }
    }
  }, [inviteStatusData]);
  
  // Update job details from job details API response
  useEffect(() => {
    if (jobDetailsData?.success && jobDetailsData?.data) {
      let companyName = employer?.company?.name || 
        (typeof jobDetailsData.data.company === 'object' ? jobDetailsData.data.company?.name : "the company");
      
      setJobDetails({
        jobTitle: jobDetailsData.data.title || "the position",
        companyName
      });
    } else if (inviteStatusData) {
      // Fallback to invite data
      const details = extractJobDetails(inviteStatusData);
      
      setJobDetails({
        ...details,
        companyName: employer?.company?.name || details.companyName
      });
    }
  }, [jobDetailsData, inviteStatusData, employer]);
  
  // Update job details from response data
  useEffect(() => {
    if (responseData?.success) {
      const details = extractJobDetails(responseData);
      
      setJobDetails({
        ...details,
        companyName: employer?.company?.name || details.companyName
      });
    }
  }, [responseData, employer]);

  // Check if user exists in the database
  useEffect(() => {
    if (action === 'accept' && !userCheckInitiated) {
      setUserExists(false);
      
      const candidateEmail = 
        inviteStatusData?.data?.candidateInfo?.email
      
      if (candidateEmail) {
        setUserCheckInitiated(true);
        
        checkUserExists({ email: candidateEmail })
          .unwrap()
          .then((response) => {
            setUserExists(!!response.userId);
          })
          .catch(() => {
            setUserExists(false);
          });
      }
    }
  }, [inviteStatusData, action, checkUserExists, userCheckInitiated]);

  // Handle action response
  useEffect(() => {
    const handleAction = async () => {
      if (!inviteId || !action || processingComplete) return;
      
      if (!['accept', 'decline'].includes(action)) {
        setErrorMessage("Invalid action specified");
        setProcessingComplete(true);
        return;
      }

      // Check invitation status
      if (inviteStatusData?.data?.status && 
          inviteStatusData.data.status !== 'pending') {
        setErrorMessage(`This invitation has already been ${inviteStatusData.data.status}`);
        setProcessingComplete(true);
        return;
      }

      if (inviteStatusData?.data?.isExpired) {
        setProcessingComplete(true);
        return;
      }

      // Auto-decline if that's the action
      if (action === 'decline') {
        try {
          await respondToInvite({ 
            inviteId: inviteId || '', 
            action 
          }).unwrap();
          setProcessingComplete(true);
        } catch (err) {
          console.error("Error responding to invitation:", err);
          setErrorMessage("Failed to process your response. Please try again.");
          setProcessingComplete(true);
        }
      }
    };

    if (inviteStatusData && !statusLoading && !statusFetching && !processingComplete) {
      handleAction();
    }
  }, [inviteId, action, inviteStatusData, statusLoading, statusFetching, respondToInvite, processingComplete]);

  // Handle errors
  useEffect(() => {
    if (statusError) {
      setErrorMessage((statusError as any)?.data?.message || "Failed to check invitation status");
      setProcessingComplete(true);
    }
    if (responseError) {
      setErrorMessage((responseError as any)?.data?.message || "Failed to process your response");
      setProcessingComplete(true);
    }
  }, [statusError, responseError]);

  // Handle accept confirmation
  const handleConfirmAccept = async () => {
    try {
      await respondToInvite({ 
        inviteId: inviteId || '', 
        action: 'accept' 
      }).unwrap();
      
      setProcessingComplete(true);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setErrorMessage("Failed to accept the invitation. Please try again.");
    }
  };

  // Redirect user based on account status
  const redirectUser = () => {
    if (userExists) {
      window.location.href = "https://employability.ai/login?redirect=dashboard";
    } else {
      window.location.href = "https://employability.ai/signup";
    }
  };

  // Loading state
  if (statusLoading || statusFetching || (responseLoading && !processingComplete) || userCheckLoading || jobDetailsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
        <p className="ml-2 text-lg">Processing your response...</p>
      </div>
    );
  }

  // Error message
  if (errorMessage) {
    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700 flex items-center">
              <AlertCircle className="mr-2" /> Error Processing Request
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => window.location.href = "https://employability.ai"}
              className="w-full bg-[#001630] text-white"
            >
              Go to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Expired invitation
  if (inviteStatusData?.data?.isExpired) {
    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card>
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700 flex items-center">
              <Clock className="mr-2" /> Interview Invitation Expired
            </CardTitle>
            <CardDescription>
              {jobDetails.jobTitle} at {jobDetails.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>This interview invitation has expired and is no longer valid.</p>
            <p className="mt-4 text-gray-600">
              Please contact the employer if you wish to arrange another interview opportunity.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => window.location.href = "https://employability.ai"}
              className="w-full bg-[#001630] text-white"
            >
              Go to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Already responded
  if (inviteStatusData?.data?.status && inviteStatusData.data.status !== 'pending') {
    const statusDisplay = inviteStatusData.data.status === 'accepted' ? 'accepted' : 'declined';
    
    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card>
          <CardHeader className={`bg-${statusDisplay === 'accepted' ? 'green' : 'gray'}-50`}>
            <CardTitle className={`text-${statusDisplay === 'accepted' ? 'green' : 'gray'}-700 flex items-center`}>
              {statusDisplay === 'accepted' ? 
                <><CheckCircle className="mr-2" /> Interview Already Accepted</> : 
                <><XCircle className="mr-2" /> Interview Already Declined</>
              }
            </CardTitle>
            <CardDescription>
              {jobDetails.jobTitle} at {jobDetails.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>You have already {statusDisplay} this interview invitation.</p>
            {statusDisplay === 'accepted' && (
              <Alert className="mt-4" variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                  Please log into your EmployAbility.AI account to take the interview.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => window.location.href = "https://employability.ai"}
              className="w-full bg-[#001630] text-white"
            >
              Go to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Accept confirmation UI
  if (action === 'accept' && !processingComplete) {
    const interviewType = inviteStatusData?.data?.interviewType === 'full' ? 'Full Interview' : 'Screening Interview';
    const candidateName = 
      inviteStatusData?.data?.candidateInfo?.name ||
      "candidate";
    
    // Format deadline
    let deadlineDisplay = "the specified deadline";
    if (inviteStatusData?.data?.deadline) {
      try {
        deadlineDisplay = new Date(inviteStatusData.data.deadline).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }
    
    return (
      <div className="container mx-auto mt-8 max-w-md">
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <CheckCircle className="mr-2" /> Confirm Interview Acceptance
            </CardTitle>
            <CardDescription>
              {jobDetails.jobTitle} at {jobDetails.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                Hello {candidateName}, thank you for accepting the invitation for the <strong>{interviewType}</strong> for the <strong>{jobDetails.jobTitle}</strong> position at <strong>{jobDetails.companyName}</strong>.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Important Details:</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>Interview Type: <span className="font-medium">{interviewType}</span></li>
                  <li>Deadline: <span className="font-medium">{deadlineDisplay}</span></li>
                  <li>Account Status: <span className="font-medium">
                    {userExists ? 'You already have an account' : 'You need to create an account'}
                  </span></li>
                </ul>
              </div>
              
              {isMobileDevice && (
                <Alert variant="default" className="mt-4">
                  <Smartphone className="h-4 w-4" />
                  <AlertTitle>Mobile Device Detected</AlertTitle>
                  <AlertDescription>
                    For the best interview experience, we recommend using a desktop or laptop computer.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleConfirmAccept}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm & Continue
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "https://employability.ai"}
              className="w-full"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success message
  if (responseData?.success) {
    return (
      <div className="container mx-auto mt-16 max-w-md">
        <Card>
          <CardHeader className={`bg-${action === 'accept' ? 'green' : 'gray'}-50`}>
            <CardTitle className={`text-${action === 'accept' ? 'green' : 'gray'}-700 flex items-center`}>
              {action === "accept" ? 
                <><CheckCircle className="mr-2" /> Interview Accepted</> : 
                <><XCircle className="mr-2" /> Interview Declined</>
              }
            </CardTitle>
            {action === "accept" && (
              <CardDescription>
                {jobDetails.jobTitle} at {jobDetails.companyName}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <p>{responseData.message || "Your response has been recorded."}</p>
            
            {action === "accept" && (
              <>
                <Alert className="mt-4" variant="default">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Interview Accepted Successfully!</AlertTitle>
                  <AlertDescription>
                    Thank you for accepting this interview invitation. You can now proceed to take your interview.
                  </AlertDescription>
                </Alert>
                
                {isMobileDevice && (
                  <Alert variant="default" className="mt-4">
                    <Laptop className="h-4 w-4" />
                    <AlertTitle>Desktop Recommended</AlertTitle>
                    <AlertDescription>
                      For the best interview experience, please use a desktop or laptop computer.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
          <CardFooter>
            {action === "accept" ? (
              <Button
                onClick={redirectUser}
                className="w-full bg-[#16a34a] text-white"
              >
                {userExists 
                  ? "Login & Take Interview" 
                  : "Create Account & Take Interview"}
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = "https://employability.ai"}
                className="w-full bg-[#001630] text-white"
              >
                Return to Homepage
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Fallback UI
  return (
    <div className="container mx-auto mt-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Processing Your Request</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader className="mr-2 h-8 w-8 animate-spin" />
          <p>Please wait...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewInvitationHandler;