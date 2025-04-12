"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, CalendarIcon, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

// Import shadcn UI components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

// Import assets
import screening from "../../assets/employer/Screening.svg";
import FullInterview from "../../assets/employer/FullInterview.svg";

// Import components
import SuccessModal from "./SuccessModal";
import SkillSelection from "./SkillSelection";

// Define interfaces
interface ProgressData {
  total: number;
  completed: number;
  failed: number;
  isComplete: boolean;
}

interface Candidate {
  user_id: string;
  name: string;
  profile_image?: string;
}

interface SkillData {
  _id: string;
  name: string;
  icon: string;
}

interface Skill {
  _id: string;
  name: string;
  importance: "Very Important" | "Important" | "Good-To-Have";
  skill: SkillData;
}

interface JobDetails {
  _id: string;
  title: string;
  skills_required: Skill[];
}

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidatesCount: number;
  selectedCandidates?: Candidate[];
  jobId: string;
}

export default function InterviewModal({
  isOpen,
  onClose,
  selectedCandidatesCount,
  selectedCandidates = [],
  jobId,
}: InterviewModalProps) {
  // State variables
  const [selectedOption, setSelectedOption] = useState<"full" | "screening">(
    "full"
  );
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ); // Default to 7 days from now
  const [batchId, setBatchId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [showSkillsSection, setShowSkillsSection] = useState(false);
  const [daysFromNow, setDaysFromNow] = useState<number>(7); // Default to 7 days

  // API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Web Worker reference
  const workerRef = useRef<Worker | null>(null);

  // Fetch job details when the modal opens
  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetails();
    }
  }, [isOpen, jobId]);

  // Update skills section visibility when interview type changes
  useEffect(() => {
    setShowSkillsSection(
      selectedOption === "full" && !!jobDetails?.skills_required?.length
    );
  }, [selectedOption, jobDetails]);

  // Fetch job details
  const fetchJobDetails = async () => {
    if (!jobId) return;

    setIsLoadingJob(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/employerJobs/jobs/${jobId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setJobDetails(data.data);

        // Auto-select "Very Important" skills
        const importantSkills = data.data.skills_required.filter(
          (skill: Skill) => skill.importance === "Very Important"
        );
        setSelectedSkills(importantSkills);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job skills");
    } finally {
      setIsLoadingJob(false);
    }
  };

  // Initialize the worker
  useEffect(() => {
    // Create the worker only if it doesn't exist yet
    if (!workerRef.current && window.Worker) {
      workerRef.current = new Worker(
        new URL("../../workers/invitationWorker.ts", import.meta.url),
        {
          type: "module",
        }
      );

      // Set up message handler for worker communication
      workerRef.current.addEventListener("message", handleWorkerMessage);
    }

    // Cleanup worker on component unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  // Handle messages from worker
  const handleWorkerMessage = useCallback(
    (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case "INTERVIEW_WORKER_READY":
          console.log("Interview worker is ready");
          break;

        case "BATCH_CREATED":
          setBatchId(data.batchId);
          toast.info(
            `Sending ${selectedCandidatesCount} interview invitations...`
          );
          break;

        case "INVITATION_PROGRESS":
          setProgress(data);
          break;

        case "INVITATION_COMPLETE":
          setIsSending(false);

          const total = data.total || 0;
          const completed = data.completed || 0;

          // Show success modal and clear batch ID to hide progress UI
          if (total > 0 && completed > 0) {
            const message =
              completed === total
                ? `All ${completed} interview invitations were sent successfully!`
                : `${completed} out of ${total} interview invitations were sent successfully.`;

            setSuccessMessage(message);
            setShowSuccessModal(true);
            setBatchId(null); // Hide the progress bar immediately
          }
          break;

        case "INTERVIEW_ERROR":
          setError(data.error);
          setIsSending(false);
          toast.error(data.error);
          break;

        default:
          console.warn(`Unknown message type from worker: ${type}`);
      }
    },
    [selectedCandidatesCount]
  );

  // Resume polling if batchId exists when component mounts
  useEffect(() => {
    if (batchId && workerRef.current && isOpen) {
      workerRef.current.postMessage({
        type: "START_INVITATION_PROGRESS",
        data: {
          batchId,
          apiBaseUrl,
        },
      });
    }
  }, [batchId, apiBaseUrl, isOpen]);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      // Small delay for animation to work properly
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Reset state when modal closes
      setBatchId(null);
      setProgress(null);
      setError(null);
    }
  }, [isOpen]);

  // Handle close with animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Handle send invites
  const handleSendInvites = useCallback(() => {
    if (
      !date ||
      selectedCandidatesCount === 0 ||
      isSending ||
      !workerRef.current
    )
      return;

    setIsSending(true);
    setError(null);

    // Prepare candidate IDs
    const candidateIds = selectedCandidates.map(
      (candidate) => candidate.user_id
    );

    // Prepare skills array for API
    const skills_array =
      selectedOption === "full" && selectedSkills.length > 0
        ? selectedSkills.map((skill) => ({
            _id: skill.skill._id,
            name: skill.name,
          }))
        : undefined;

    try {
      // Send message to worker to start invitation process
      workerRef.current.postMessage({
        type: "SEND_INVITATIONS",
        data: {
          jobId,
          candidateIds,
          interviewType: selectedOption,
          applicationDeadline: date.toISOString(),
          skills_array,
          apiBaseUrl,
        },
      });
    } catch (err) {
      // This try/catch is mostly for handling any errors that might
      // occur when posting the message to the worker
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to start interview invitation process";
      setError(errorMsg);
      setIsSending(false);
      toast.error(errorMsg);
    }
  }, [
    date,
    selectedCandidatesCount,
    isSending,
    jobId,
    selectedOption,
    selectedCandidates,
    selectedSkills,
    apiBaseUrl,
  ]);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!progress) return 0;
    const { total, completed } = progress;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Check if process is complete
  const isProcessComplete = () => {
    if (!progress) return false;
    return progress.isComplete;
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the interview modal as well
  };

  // Update days when date changes
  useEffect(() => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate calculation
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = selectedDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysFromNow(diffDays);
    }
  }, [date]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        {/* Backdrop - only covers the whole screen with partial opacity */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal panel - slides in from right, not taking full height */}
        <div
          className={`absolute top-8 bottom-8 right-0 bg-white w-full max-w-2xl shadow-lg rounded-l-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#e6e6e6]">
            <h2 className="text-xl font-semibold text-[#000000]">
              Send Interview
            </h2>
            <button
              className="text-[#6a6a6a] hover:text-[#000000]"
              onClick={handleClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content - make it flex-grow and scrollable */}
          <div className="flex-grow overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Show progress if batch is processing */}
              {batchId && progress && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium mb-2 flex items-center">
                    {isProcessComplete() ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        Invitations Sent Successfully
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Invitations...
                      </>
                    )}
                  </h3>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    {progress && (
                      <>
                        Progress: {progress.completed}/{progress.total}{" "}
                        invitations sent
                        {progress.failed > 0 && (
                          <span className="text-red-500 ml-2">
                            ({progress.failed} failed)
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {isProcessComplete() && (
                    <button
                      onClick={handleClose}
                      className="mt-3 px-4 py-2 bg-[#001630] text-white rounded-md hover:bg-opacity-90"
                    >
                      Close
                    </button>
                  )}
                </div>
              )}

              {/* Error message if needed */}
              {error && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium text-red-700">
                      Failed to send invitations
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-red-600">
                    {error ||
                      "Please try again or contact support if the problem persists."}
                  </p>
                </div>
              )}

              {/* Candidates info */}
              <div className="flex flex-col gap-3">
                {/* Text information on top line */}
                <div className="flex items-center">
                  <p className="text-[#4c4c4c] text-sm">
                    You're about to send an interview invitation to
                  </p>
                </div>

                {/* Candidate profile images with count on the right */}
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {/* Display up to 4 selected candidates */}
                    {selectedCandidates.slice(0, 4).map((candidate, index) => (
                      <div
                        key={candidate?.user_id || index}
                        className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative"
                      >
                        {candidate?.profile_image ? (
                          <img
                            src={candidate.profile_image || "/placeholder.svg"}
                            alt={candidate.name || `Candidate ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 font-semibold text-lg">
                            {candidate?.name
                              ? candidate.name.charAt(0).toUpperCase()
                              : `${index + 1}`}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* If no candidates are selected, show placeholder */}
                    {selectedCandidates.length === 0 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                          ?
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Count displayed to the right of the images */}
                  <span className="font-medium text-[#000000] ml-4 underline">
                    {selectedCandidatesCount} Candidates
                  </span>
                </div>
              </div>

              {/* Only show form if not currently processing */}
              {!batchId && (
                <>
                  {/* Interview type selection */}
                  <div className="space-y-3">
                    <h3 className="text-base font-normal text-[#000000]">
                      What do you want the candidate to do?
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div
                        className={`border rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-6 hover:shadow-md ${
                          selectedOption === "full"
                            ? "border-1 border-[#001630] bg-[#ecf5ff]"
                            : "border border-[#e6e6e6] hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedOption("full")}
                      >
                        <div className="flex-1 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                                selectedOption === "full"
                                  ? "border-[#001630] bg-[#001630]"
                                  : "border-2 border-[#68696b]"
                              }`}
                            >
                              {selectedOption === "full" && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-[#001630] text-h2">
                              Full Interview
                            </span>
                          </div>

                          <p className="text-[#68696b] text-[14px] font-normal leading-6 tracking-[0.07px] mb-6">
                            Interview covering specific skills, custom
                            questions, and{" "}
                            <span className="font-medium text-[#001630]">
                              in-depth topics
                            </span>
                            .
                          </p>

                          <button className="border border-[#001630] rounded-lg py-2 px-6 text-[#414447] font-medium leading-5 tracking-[0.07px] hover:bg-[#d7ebff] transition-colors">
                            View Sample Report
                          </button>
                        </div>

                        <div className="flex transition-transform duration-200 hover:scale-105">
                          <img
                            src={FullInterview || "/placeholder.svg"}
                            alt="Full Interview"
                            className="object-contain h-[200px] max-h-full"
                            style={{ maxWidth: "none" }}
                          />
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-6 hover:shadow-md ${
                          selectedOption === "screening"
                            ? "border-1 border-[#001630] bg-gradient-to-r from-white to-[#eeebff]"
                            : "border border-[#e6e6e6] hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedOption("screening")}
                      >
                        <div className="flex-1 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                                selectedOption === "screening"
                                  ? "border-[#001630] bg-[#001630]"
                                  : "border-2 border-[#68696b]"
                              }`}
                            >
                              {selectedOption === "screening" && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-[#001630] text-h2">
                              Screening
                            </span>
                          </div>

                          <p className="text-[#68696b] text-[14px] font-normal leading-6 tracking-[0.07px] mb-6">
                            A quick session to gauge a candidate's
                            basics—usually{" "}
                            <span className="font-medium text-[#001630]">
                              15 minutes
                            </span>{" "}
                            or less.
                          </p>

                          <button className="border border-[#001630] rounded-lg py-2 px-6 text-[#414447] font-medium leading-5 tracking-[0.07px] hover:bg-[#eeebff] transition-colors">
                            View Sample Report
                          </button>
                        </div>

                        <div className="relative flex transition-transform duration-200 hover:scale-105">
                          <img
                            src={screening || "/placeholder.svg"}
                            alt="Screening"
                            className="object-contain h-[200px] max-h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NEW SKILLS SECTION - Using the updated SkillSelection component */}
                  {selectedOption === "full" && (
                    <div className="space-y-3 mt-6">
                      {isLoadingJob ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 p-4 border border-gray-200 rounded-lg">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading job skills...</span>
                        </div>
                      ) : jobDetails?.skills_required &&
                        jobDetails.skills_required.length > 0 ? (
                        <SkillSelection
                          availableSkills={jobDetails.skills_required}
                          selectedSkills={selectedSkills}
                          setSelectedSkills={setSelectedSkills}
                          maxSkills={6}
                        />
                      ) : (
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-500 italic">
                            No skills found for this job.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expiry date */}
                  <div className="space-y-3">
                    <h3 className="text-base font-normal text-[#000000]">
                      Set a due date or days from today
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-60 px-4 py-3 border border-[#e6e6e6] rounded-lg text-left flex items-center justify-between text-[#4c4c4c]">
                              {date
                                ? format(date, "PPP")
                                : "Select Expiry Date"}
                              <CalendarIcon className="ml-2 h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Days selector */}
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={daysFromNow}
                          className="w-20 px-3 py-2 border border-[#e6e6e6] rounded-lg text-[#4c4c4c]"
                          onChange={(e) => {
                            const days = Number.parseInt(e.target.value, 10);
                            if (!isNaN(days) && days > 0) {
                              setDaysFromNow(days);
                              const newDate = new Date();
                              newDate.setDate(newDate.getDate() + days);
                              setDate(newDate);
                            }
                          }}
                        />
                        <span className="text-[#4c4c4c]">days</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#666666]">
                      Candidates will receive an email with a link to complete
                      this interview by this date.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer with action buttons - only show if not currently processing */}
          {!batchId && (
            <div className="flex justify-end gap-3 p-6 border-t border-[#e6e6e6] mt-auto">
              <button
                className="px-6 py-2.5 border border-[#e6e6e6] rounded-lg text-[#4c4c4c] hover:bg-[#f5f5f5]"
                onClick={handleClose}
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                className={`px-6 py-2.5 bg-[#001630] text-white rounded-lg ${
                  isSending || !date || selectedCandidatesCount === 0
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-opacity-90"
                }`}
                onClick={handleSendInvites}
                disabled={isSending || !date || selectedCandidatesCount === 0}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  "Send Invite"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={successMessage}
        subtitle="The candidates will receive an email with instructions to complete their interview."
      />
    </>
  );
}
