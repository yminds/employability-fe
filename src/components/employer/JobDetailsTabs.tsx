import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
 
// Import sub-tab components
import CandidatesTab from "./CandidatesTab";
import ScreeningResultsTab from "./matchingResultTabs";
import InvitedCandidatesTab from "./InviteCandidatesTab";
 
// Import types
import { IJob, ScreeningCard, ProcessedResume } from "../../types/candidate";
import {
  useScreenCandidatesMutation,
  useGetScreeningResultsQuery,
} from "../../api/matchingCardApi";
import {
  useInviteCandidatesMutation,
  useResendInvitationMutation,
  useGetInvitationStatusesQuery,
} from "../../api/emailInvitationApiSlice";
 
interface JobDetailsTabsProps {
  job: IJob;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
 
const JobDetailsTabs: React.FC<JobDetailsTabsProps> = ({
  job,
  activeTab,
  setActiveTab,
}) => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [screeningBatchId, setScreeningBatchId] = useState<string | null>(null);
  const [invitationBatchId, setInvitationBatchId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>([]);
  const [isScreeningPolling, setIsScreeningPolling] = useState(false);
  const [isInvitationPolling, setIsInvitationPolling] = useState(false);
  const [screeningCompleted, setScreeningCompleted] = useState(false);
  const [invitationCompleted, setInvitationCompleted] = useState(false);
 
  // Reference to the workers
  const matchingWorkerRef = useRef<Worker | null>(null);
  const invitationWorkerRef = useRef<Worker | null>(null);
 
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
 
  // RTK Query hooks
  const [screenCandidates] = useScreenCandidatesMutation();
  const [inviteCandidates] = useInviteCandidatesMutation();
  const [resendInvitation] = useResendInvitationMutation();
 
  const {
    data: screeningResults,
    isLoading: isLoadingResults,
    refetch: refetchScreeningResults
  } = useGetScreeningResultsQuery(
    { job_id: job._id, batch_id: screeningBatchId },
    {
      skip: activeTab !== "screening" || !screeningBatchId,
      pollingInterval: 0,
    }
  );
 
  const { 
    data: invitationStatuses, 
    isLoading: isLoadingInvitations,
    refetch: refetchInvitations
  } = useGetInvitationStatusesQuery(
    { 
      job_id: job._id,
      employer_id: employer?._id || ''
    }, 
    { 
      skip: activeTab !== "invited",
      pollingInterval: 0,
    }
  );
 
  // Handle tab changes and refetching data
  useEffect(() => {
    if (activeTab === "screening" && screeningBatchId) {
      refetchScreeningResults();
    } else if (activeTab === "invited") {
      refetchInvitations();
    }
  }, [activeTab, screeningBatchId, refetchScreeningResults, refetchInvitations]);
 
  // Initialize workers
  useEffect(() => {
    if (!matchingWorkerRef.current) {
      matchingWorkerRef.current = new Worker(
        new URL("../../workers/matchingWorker.ts", import.meta.url),
        { type: "module" }
      );
      matchingWorkerRef.current.addEventListener("message", (event) => {
        const { type, data } = event.data;
        switch (type) {
          case "SCREENING_WORKER_READY":
            console.log("Screening worker is ready");
            break;
          case "SCREENING_PROGRESS":
            console.log("Screening progress update:", data);
            break;
          case "SCREENING_COMPLETE":
            setIsScreeningPolling(false);
            setScreeningCompleted(true);
            toast.success("Screening completed", {
              description: "Candidates have been screened successfully.",
            });
            
            refetchScreeningResults();
            
            if (matchingWorkerRef.current) {
              matchingWorkerRef.current.terminate();
              matchingWorkerRef.current = null;
            }
            break;
          case "SCREENING_ERROR":
            setIsScreeningPolling(false);
            toast.error("Screening error", {
              description: data.error || "There was an error during screening.",
            });
            if (matchingWorkerRef.current) {
              matchingWorkerRef.current.terminate();
              matchingWorkerRef.current = null;
            }
            break;
          default:
            console.warn("Unknown message type from screening worker:", type);
        }
      });
    }

    // Initialize the invitation worker
    if (!invitationWorkerRef.current) {
      invitationWorkerRef.current = new Worker(
        new URL("../../workers/invitationWorker.ts", import.meta.url),
        { type: "module" }
      );
      invitationWorkerRef.current.addEventListener("message", (event) => {
        const { type, data } = event.data;
        switch (type) {
          case "INVITATION_WORKER_READY":
            console.log("Invitation worker is ready");
            break;
          case "INVITATION_PROGRESS":
            // Update invitation progress state
            console.log("Invitation progress update:", data);
            break;
          case "INVITATION_COMPLETE":
            setIsInvitationPolling(false);
            setInvitationCompleted(true);
            toast.success("Invitations sent", {
              description: "Candidates have been invited successfully.",
            });
            // Refetch invitations after completion
            refetchInvitations();
            // Terminate the worker after completion
            if (invitationWorkerRef.current) {
              invitationWorkerRef.current.terminate();
              invitationWorkerRef.current = null;
            }
            break;
          case "INVITATION_ERROR":
            setIsInvitationPolling(false);
            toast.error("Invitation error", {
              description: data.error || "There was an error during invitation process.",
            });
            if (invitationWorkerRef.current) {
              invitationWorkerRef.current.terminate();
              invitationWorkerRef.current = null;
            }
            break;
          default:
            console.warn("Unknown message type from invitation worker:", type);
        }
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (matchingWorkerRef.current) {
        matchingWorkerRef.current.terminate();
        matchingWorkerRef.current = null;
      }
      if (invitationWorkerRef.current) {
        invitationWorkerRef.current.terminate();
        invitationWorkerRef.current = null;
      }
    };
  }, [refetchScreeningResults, refetchInvitations]);
 
  // Callback when resumes are processed from the ResumeUploader within CandidatesTab
  const handleResumesProcessed = useCallback((resumes: ProcessedResume[]) => {
    setProcessedResumes(resumes);
  }, []);
 
  // Handle candidate selection from CandidatesTab
  const handleCandidateSelection = useCallback((candidateIds: string[]) => {
    setSelectedCandidates(candidateIds);
  }, []);
 
  // Handle screening of candidates using the worker for progress polling
  const handleScreenCandidates = useCallback(async () => {
    if (selectedCandidates.length === 0) {
      toast.error("No candidates selected", {
        description: "Please select at least one candidate to screen.",
      });
      return;
    }
   
    setIsScreening(true);
    setScreeningCompleted(false);
   
    try {
      const result = await screenCandidates({
        job_id: job._id,
        candidate_ids: selectedCandidates,
        employer_id: employer?._id,
        company_id: job.company,
      }).unwrap();
 
      if (result.data?.batch_id) {
        setScreeningBatchId(result.data.batch_id);
        setIsScreeningPolling(true);
        // Start the screening progress worker
        if (matchingWorkerRef.current) {
          matchingWorkerRef.current.postMessage({
            type: "START_SCREENING_PROGRESS",
            data: {
              batchId: result.data.batch_id,
              apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
              jobId: job._id,
            },
          });
        }
      }
     
      setActiveTab("screening");
      toast.success("Screening started", {
        description: `Screening ${selectedCandidates.length} candidates. You'll see results shortly.`,
      });
    } catch (error) {
      console.error("Error screening candidates:", error);
      toast.error("Screening failed", {
        description: "There was an error while screening candidates. Please try again.",
      });
    } finally {
      setIsScreening(false);
    }
  }, [selectedCandidates, job._id, employer?._id, job.company, screenCandidates, setActiveTab]);
 
  // Send email invitations
  const handleSendInvites = useCallback(async () => {
    if (selectedCandidates.length === 0) {
      toast.error("No candidates selected", {
        description: "Please select at least one candidate to invite.",
      });
      return;
    }
    setIsSendingInvites(true);
    setInvitationCompleted(false);
    
    try {
      const result = await inviteCandidates({
        job_id: job._id,
        candidate_ids: selectedCandidates,
        message: customMessage,
        email_type: "interview_invitation",
        employer_id: employer?._id || "",
      }).unwrap();
      
      setShowInviteDialog(false);
      setCustomMessage("");

      // Start invitation progress polling if we got a batch ID
      if (result.data?.batch_id) {
        setInvitationBatchId(result.data.batch_id);
        setIsInvitationPolling(true);
        
        // Start the invitation progress worker
        if (invitationWorkerRef.current) {
          invitationWorkerRef.current.postMessage({
            type: "START_INVITATION_PROGRESS",
            data: {
              batchId: result.data.batch_id,
              apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
              jobId: job._id,
            },
          });
        }
      }
      
      setActiveTab("invited");
      toast.success("Sending invitations", {
        description: `Processing ${selectedCandidates.length} invitations. You'll see results shortly.`,
      });
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations", {
        description: "There was an error while sending invitations. Please try again.",
      });
    } finally {
      setIsSendingInvites(false);
    }
  }, [
    selectedCandidates,
    customMessage,
    job._id,
    employer?._id,
    inviteCandidates,
    setActiveTab
  ]);

  // Handle resend invitation
  const handleResendInvitation = useCallback(async (candidateId: string) => {
    try {
      if (!candidateId) {
        console.error("Cannot resend invitation: Missing candidate ID");
        return;
      }
      
      const result = await resendInvitation({
        job_id: job._id,
        candidate_id: candidateId,
        message: "",
        employer_id: employer?._id || "",
      }).unwrap();
      
      // If we get a batch ID, start polling for this specific invitation
      if (result.data?.batch_id) {
        setInvitationBatchId(result.data.batch_id);
        setIsInvitationPolling(true);
        
        // Start the invitation progress worker
        if (invitationWorkerRef.current) {
          invitationWorkerRef.current.postMessage({
            type: "START_INVITATION_PROGRESS",
            data: {
              batchId: result.data.batch_id,
              apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
              jobId: job._id,
            },
          });
        }
      }
      
      toast.success("Resending invitation", {
        description: "The invitation is being resent. You'll see the updated status shortly.",
      });
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation", {
        description: "There was an error while resending the invitation. Please try again.",
      });
    }
  }, [job._id, employer?._id, resendInvitation]);

  // Handle manual refresh for invitations
  const handleRefreshInvitations = useCallback(() => {
    refetchInvitations();
    toast.success("Refreshing invitation data", {
      description: "Fetching the latest invitation statuses.",
    });
  }, [refetchInvitations]);
 
  // Extract screening results data safely
  const getScreeningResultsData = useCallback((): ScreeningCard[] => {
    if (!screeningResults) return [];
    const result = screeningResults as any;
    if (result.data?.screeningResults && Array.isArray(result.data.screeningResults)) {
      return result.data.screeningResults;
    }
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  }, [screeningResults]);
 
  // Extract candidate invitations data safely
  const getCandidateInvitationsData = useCallback((): any[] => {
    if (!invitationStatuses) return [];
    
    if (invitationStatuses.success && Array.isArray(invitationStatuses.data)) {
      return invitationStatuses.data;
    }

    // Fallback in case the response structure is different
    const result = invitationStatuses as any;
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  }, [invitationStatuses]);
 
  const screeningResultsData = getScreeningResultsData();
  const invitationsData = getCandidateInvitationsData();
  const appliedCandidates = job.candidates?.applied || [];
 
  return (
    <>
      {/* Main Candidates Tab */}
      <TabsContent value="candidates">
        <CandidatesTab
          job={job}
          employerId={employer?._id}
          onResumesProcessed={handleResumesProcessed}
          onSelectCandidates={handleCandidateSelection}
          selectedCandidates={selectedCandidates}
          isScreening={isScreening}
          onScreenCandidates={handleScreenCandidates}
          activeCandidatesTab={activeTab === "candidates"}
        />
      </TabsContent>
 
      {/* Screening Results Tab */}
      <TabsContent value="screening">
        <ScreeningResultsTab
          screeningResultsData={screeningResultsData}
          isLoadingResults={isLoadingResults || isScreeningPolling}
          isPolling={isScreeningPolling}
          selectedCandidates={selectedCandidates}
          setSelectedCandidates={setSelectedCandidates}
          onOpenInviteDialog={() => setShowInviteDialog(true)}
          isSendingInvites={isSendingInvites}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          job={job}
          appliedCandidates={appliedCandidates}
          screeningCompleted={screeningCompleted}
          batchId={screeningBatchId}
        />
      </TabsContent>
 
      {/* Invited Candidates Tab */}
      <TabsContent value="invited">
        <InvitedCandidatesTab
          invitationsData={invitationsData}
          isLoadingInvitations={isLoadingInvitations}
          isPolling={isInvitationPolling}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          appliedCandidates={appliedCandidates}
          onResendInvite={handleResendInvitation}
          onManualRefresh={handleRefreshInvitations}
          invitationCompleted={invitationCompleted}
          batchId={invitationBatchId}
          job_id={job._id}
        />
      </TabsContent>
 
      {/* Email Invitation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Send Email Invitations</DialogTitle>
          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Selected Candidates</Label>
              <p className="text-sm text-gray-500 mt-1">
                You are about to send invitations to {selectedCandidates.length} candidates.
              </p>
            </div>
            <div>
              <Label htmlFor="custom-message" className="text-sm font-medium">
                Custom Message (Optional)
              </Label>
              <Textarea
                id="custom-message"
                placeholder="Add a personal message to the email invitation..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvites} disabled={isSendingInvites}>
                {isSendingInvites ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
 
export default JobDetailsTabs;