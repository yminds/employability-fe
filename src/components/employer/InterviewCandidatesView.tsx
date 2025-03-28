import type React from "react";
import { useState, useEffect } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Bookmark,
  X,
  Calendar,
  Clock,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem as DropdownItem,
  DropdownMenuTrigger as DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import {
  useGetInterviewCandidatesQuery,
  useGetInterviewStatsQuery,
  useShortlistCandidateMutation,
  type InterviewCandidate,
} from "../../api/InterviewInvitation";

interface InterviewCandidatesViewProps {
  jobId: string;
}

type InterviewType = "full" | "screening" | "all";
type SubmissionStatus = "all" | "submitted" | "not_submitted";
type SortOption =
  | "rating_high_to_low"
  | "rating_low_to_high"
  | "recent_submissions"
  | "past_submissions";

const InterviewCandidatesView: React.FC<InterviewCandidatesViewProps> = ({
  jobId,
}) => {
  // State for filters and pagination
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [interviewType, setInterviewType] = useState<InterviewType>("full");
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent_submissions");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [shortlistingCandidateId, setShortlistingCandidateId] = useState<
    string | null
  >(null);

  const [localCandidates, setLocalCandidates] = useState<InterviewCandidate[]>(
    []
  );

  // Toast notification
  const { toast } = useToast();

  // Get interview candidates data with updated query parameters
  const {
    data: candidatesResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetInterviewCandidatesQuery({
    jobId,
    interviewType: interviewType === "all" ? undefined : interviewType,
    status:
      submissionStatus === "all"
        ? undefined
        : (submissionStatus as "pending" | "completed" | "all"),
    sortBy: getSortQueryParam(sortBy) as
      | "name"
      | "recent"
      | "oldest"
      | undefined,
  });

  // Convert frontend sort options to API query parameters
  function getSortQueryParam(sortOption: SortOption): string {
    switch (sortOption) {
      case "rating_high_to_low":
        return "rating_desc";
      case "rating_low_to_high":
        return "rating_asc";
      case "recent_submissions":
        return "recent";
      case "past_submissions":
        return "oldest";
      default:
        return "recent";
    }
  }

  // Get interview stats
  const { data: statsResponse, isLoading: statsLoading } =
    useGetInterviewStatsQuery(jobId);

  // Mutation for shortlisting
  const [shortlistCandidate, { isLoading: isShortlisting }] =
    useShortlistCandidateMutation();

  useEffect(() => {
    if (candidatesResponse) {
      setLocalCandidates(candidatesResponse.data);
    }
  }, [candidatesResponse]);

  // Extract data
  const candidates =
    localCandidates.length > 0
      ? localCandidates
      : candidatesResponse?.data || [];

  const stats = statsResponse?.data || {
    fullInterviews: {
      invitesSent: 0,
      accepted: 0,
      notAccepted: 0,
      submitted: 0,
    },
    screeningInterviews: {
      invitesSent: 0,
      accepted: 0,
      notAccepted: 0,
      submitted: 0,
    },
  };

  // Client-side sorting if needed
  const sortCandidates = (candidatesToSort: InterviewCandidate[]) => {
    const sortedCandidates = [...candidatesToSort];

    if (sortBy === "rating_high_to_low") {
      return sortedCandidates.sort((a, b) => {
        const ratingA = getEffectiveRating(a) || 0;
        const ratingB = getEffectiveRating(b) || 0;
        return ratingB - ratingA;
      });
    } else if (sortBy === "rating_low_to_high") {
      return sortedCandidates.sort((a, b) => {
        const ratingA = getEffectiveRating(a) || 0;
        const ratingB = getEffectiveRating(b) || 0;
        return ratingA - ratingB;
      });
    } else if (sortBy === "recent_submissions") {
      return sortedCandidates.sort((a, b) => {
        const dateA = getEffectiveDate(a);
        const dateB = getEffectiveDate(b);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } else if (sortBy === "past_submissions") {
      return sortedCandidates.sort((a, b) => {
        const dateA = getEffectiveDate(a);
        const dateB = getEffectiveDate(b);
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
    }

    return sortedCandidates;
  };

  const getEffectiveRating = (candidate: InterviewCandidate) => {
    return (
      candidate.effective_final_rating ||
      candidate.type_final_rating ||
      candidate.final_rating ||
      0
    );
  };

  const getEffectiveDate = (candidate: InterviewCandidate) => {
    return (
      candidate.effective_report_updated_at ||
      candidate.type_report_updated_at ||
      candidate.report_updated_at ||
      candidate.updated_at ||
      candidate.sent_at
    );
  };

  // Filter candidates by search term and submission status
  const filteredCandidates = candidates.filter(
    (candidate: InterviewCandidate) => {
      // First apply search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = candidate.candidate_name
          .toLowerCase()
          .includes(searchLower);
        const locationMatch =
          candidate.candidate_location &&
          candidate.candidate_location.toLowerCase().includes(searchLower);

        if (!nameMatch && !locationMatch) {
          return false;
        }
      }

      // Filter out pending candidates - only show accepted or completed
      if (candidate.status !== "accepted" && candidate.status !== "completed") {
        return false;
      }

      // Apply interview type filter
      if (interviewType !== "all") {
        if (candidate.task?.interview_type?.type !== interviewType) {
          return false;
        }
      }

      // Apply submission status filter
      if (submissionStatus === "submitted") {
        return (
          candidate.status === "completed" && candidate.has_report === true
        );
      } else if (submissionStatus === "not_submitted") {
        return !(
          candidate.status === "completed" && candidate.has_report === true
        );
      }

      return true;
    }
  );

  // Sort the filtered candidates
  const sortedFilteredCandidates = sortCandidates(filteredCandidates);

  // Pagination
  const totalPages = Math.ceil(sortedFilteredCandidates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(
    startIndex + rowsPerPage,
    sortedFilteredCandidates.length
  );
  const currentCandidates = sortedFilteredCandidates.slice(
    startIndex,
    endIndex
  );

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(currentCandidates.map((c: any) => c._id));
    } else {
      setSelectedCandidates([]);
    }
  };

  // Handle individual selection
  const handleSelectCandidate = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates((prev) => [...prev, id]);
    } else {
      setSelectedCandidates((prev) => prev.filter((cid) => cid !== id));
    }
  };

  // Handle shortlist
  const handleShortlist = async (candidateId: string) => {
    try {
      setShortlistingCandidateId(candidateId);

      const updatedCandidates = localCandidates.map((candidate) => {
        if (candidate.candidate_id === candidateId) {
          return { ...candidate, shortlist: true };
        }
        return candidate;
      });

      setLocalCandidates(updatedCandidates);

      await shortlistCandidate({
        jobId,
        candidateId,
      }).unwrap();

      // Show success notification
      if (toast) {
        toast({
          title: "Success",
          description: "Candidate has been shortlisted",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error shortlisting candidate:", error);

      const revertedCandidates = localCandidates.map((candidate) => {
        if (candidate.candidate_id === candidateId) {
          return { ...candidate, shortlist: false };
        }
        return candidate;
      });

      setLocalCandidates(revertedCandidates);

      // Show error notification
      if (toast) {
        toast({
          title: "Error",
          description: "Failed to shortlist candidate. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setShortlistingCandidateId(null);
    }
  };

  // Handle view report
  const handleViewReport = (candidate: InterviewCandidate) => {
    // Get the appropriate report ID
    const reportId =
      candidate.effective_report_id ||
      candidate.type_report_id ||
      candidate.report_id;

    if (!reportId) {
      toast({
        title: "Error",
        description: "Report not found",
        variant: "destructive",
      });
      return;
    }

    // Navigate to report view page
    window.location.href = `/reports/${reportId}`;
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return "today";
    } else if (diffInDays === 1) {
      return "yesterday";
    } else {
      return `${diffInDays} days ago`;
    }
  };

  // Format days remaining
  const formatDaysRemaining = (dateString?: string) => {
    if (!dateString) return null;

    const targetDate = new Date(dateString);
    const now = new Date();

    // Set times to midnight for accurate day calculation
    targetDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffInTime = targetDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return "Overdue";
    } else if (diffInDays === 0) {
      return "Due today";
    } else if (diffInDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffInDays} days`;
    }
  };

  // Generate user initials for profile placeholder
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Create background color based on name
  const getInitialsBackgroundColor = (name: string) => {
    if (!name) return "#6c757d";

    // Simple hash function to generate a consistent color for a name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to a hue (0-360)
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Update row count and reset to first page
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Get submission status badge
  const getSubmissionBadge = (candidate: InterviewCandidate) => {
    // If candidate status is accepted, show special badge
    if (candidate.status === "accepted") {
      return {
        bgColor: "bg-[#fff8e6]",
        textColor: "text-[#f59e0b]",
        icon: <Clock className="w-4 h-4 text-[#f59e0b]" />,
        text: "Interview Accepted",
      };
    }

    // If candidate has a report, they've submitted
    if (candidate.has_report) {
      return {
        bgColor: "bg-[#d1f3d9]",
        textColor: "text-[#10b754]",
        icon: <Check className="w-4 h-4 text-[#10b754]" />,
        text: "Submitted",
      };
    }

    // Otherwise, they haven't submitted
    return {
      bgColor: "bg-[#eceef0]",
      textColor: "text-[#414447]",
      icon: <X className="w-3 h-3 text-white" />,
      iconBg: "bg-[#414447]",
      text: "Not Submitted",
    };
  };

  // Get time since last update
  const getTimeSinceUpdate = (candidate: InterviewCandidate) => {
    // Use the most recent update time from any available field
    const updateDate =
      candidate.effective_report_updated_at ||
      candidate.type_report_updated_at ||
      candidate.report_updated_at ||
      candidate.updated_at ||
      candidate.sent_at;

    if (!updateDate) return null;

    return formatRelativeTime(updateDate);
  };

  // Check if candidate is eligible for View Report and Shortlist
  const canShowReportAndShortlist = (candidate: InterviewCandidate) => {
    return (
      candidate.status === "completed" &&
      candidate.task?.interview_type?.interview_id !== undefined
    );
  };

  // Get the final rating to display for a candidate
  const getCandidateFinalRating = (candidate: InterviewCandidate) => {
    // Prioritize effective rating (which already has the logic to choose task report over main report)
    return candidate.effective_final_rating !== undefined
      ? candidate.effective_final_rating
      : candidate.type_final_rating !== undefined
      ? candidate.type_final_rating
      : candidate.final_rating;
  };

  const renderCandidateCard = (candidate: InterviewCandidate) => {
    // Get submission badge info
    const submissionBadge = getSubmissionBadge(candidate);

    // Get time since last update
    const timeSinceUpdate = getTimeSinceUpdate(candidate);

    // For accepted status, check submission deadline
    const submissionDeadline =
      candidate.status === "accepted"
        ? formatDaysRemaining(candidate.submission_expected_date)
        : null;

    // Check if we should show report and shortlist options
    const showReportAndShortlist = canShowReportAndShortlist(candidate);

    // Get final rating
    const finalRating = getCandidateFinalRating(candidate);

    return (
      <div className="bg-white border-b p-4">
        <div className="flex items-center">
          <Checkbox
            id={`candidate-${candidate._id}`}
            className="mr-4 rounded border-[#d6d7d9]"
            checked={selectedCandidates.includes(candidate._id)}
            onCheckedChange={(checked) =>
              handleSelectCandidate(candidate._id, !!checked)
            }
          />
          <div className="relative">
            {candidate.profile_image ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border">
                <img
                  src={candidate.profile_image || "/placeholder.svg"}
                  alt={candidate.candidate_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center"
                style={{
                  backgroundColor: getInitialsBackgroundColor(
                    candidate.candidate_name
                  ),
                }}
              >
                <span className="text-white text-lg font-medium">
                  {getInitials(candidate.candidate_name)}
                </span>
              </div>
            )}
            {candidate.has_report && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10b754] rounded-full flex items-center justify-center border-2 border-white">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-[#0c0f12]">
                  {candidate.candidate_name}
                </h3>
                {candidate.candidate_location && (
                  <p className="text-sm text-[#68696b]">
                    {candidate.candidate_location}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {/* Status badge - shown as icon + text */}
                  {candidate.status === "accepted" ? (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fff8e6]">
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                      <span className="text-sm font-medium text-[#f59e0b]">
                        Not Submitted
                      </span>
                    </div>
                  ) : candidate.has_report ? (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d1f3d9]">
                      <Check className="w-4 h-4 text-[#10b754]" />
                      <span className="text-sm font-medium text-[#10b754]">
                        Submitted {timeSinceUpdate}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eceef0]">
                      <div className="w-4 h-4 flex items-center justify-center rounded-full bg-[#414447]">
                        <X className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-[#414447]">
                        Not Submitted
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side of card */}
              <div className="flex flex-col items-end">
                {/* Status text on the top right */}
                {candidate.status === "accepted" && (
                  <div className="text-right mb-2">
                    <p className="text-sm font-medium text-[#0c0f12]">
                      Invite Accepted
                    </p>
                    <p className="text-sm text-[#68696b]">
                      Waiting for Interview Submission
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Show rating if completed and has report */}
                  {showReportAndShortlist && candidate.has_report && (
                    <div className="text-center mr-2">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-[#0c0f12]">
                          {typeof finalRating === "number"
                            ? finalRating.toFixed(1)
                            : "N/A"}
                        </span>
                        <span className="text-sm text-[#68696b]">/10</span>
                        <div className="w-5 h-5 rounded-full bg-[#10b754] flex items-center justify-center ml-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-[#68696b]">Interview score</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {/* Show "View Report" only if completed status and has task.interview_type.interview_id */}
                    {showReportAndShortlist && candidate.has_report && (
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm bg-[#f0f3f7] text-[#001630] border-[#f0f3f7] hover:bg-[#f0f3f7] hover:text-[#001630]"
                        onClick={() => handleViewReport(candidate)}
                      >
                        View Report
                      </Button>
                    )}

                    {/* Show "Shortlist" button if not shortlisted and has task.interview_type.interview_id */}
                    {showReportAndShortlist && !candidate.shortlist && (
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm border-[#d9d9d9] text-[#202326] hover:bg-transparent"
                        onClick={() => handleShortlist(candidate.candidate_id)}
                        disabled={
                          isShortlisting &&
                          shortlistingCandidateId === candidate.candidate_id
                        }
                      >
                        {isShortlisting &&
                        shortlistingCandidateId === candidate.candidate_id ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#202326]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Shortlisting...
                          </span>
                        ) : (
                          <>Shortlist</>
                        )}
                      </Button>
                    )}

                    {/* More options dropdown - only show for completed status, not for accepted */}
                    {candidate.status === "completed" && (
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#68696b]"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent align="end">
                          <DropdownItem>Send Message</DropdownItem>
                          <DropdownItem>Schedule Interview</DropdownItem>
                          <DropdownItem>Download Resume</DropdownItem>
                          <DropdownItem className="text-red-500">
                            Decline Candidate
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Simplified filter bar */}
      <div className="flex flex-wrap gap-2 p-4">
        {/* Search */}
        <div className="relative w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#68696b] w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2d96ff]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Interview Type Radio Buttons - Separated */}
        <RadioGroup
          value={interviewType}
          onValueChange={(value) => setInterviewType(value as InterviewType)}
          className="flex gap-2"
        >
          {/* Full Interview Option */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 border rounded-md ${
              interviewType === "full" ? "bg-[#f0f3f7]" : "bg-white"
            }`}
          >
            <RadioGroupItem
              value="full"
              id="full-interview"
              className="hidden"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                interviewType === "full"
                  ? "border-[#2563eb]"
                  : "border-gray-300"
              }`}
            >
              {interviewType === "full" && (
                <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
              )}
            </div>
            <Label htmlFor="full-interview" className="cursor-pointer text-sm">
              Full Interview
            </Label>
          </div>

          {/* Screening Option */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 border rounded-md ${
              interviewType === "screening" ? "bg-[#f0f3f7]" : "bg-white"
            }`}
          >
            <RadioGroupItem
              value="screening"
              id="screening-interview"
              className="hidden"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                interviewType === "screening"
                  ? "border-[#2563eb]"
                  : "border-gray-300"
              }`}
            >
              {interviewType === "screening" && (
                <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
              )}
            </div>
            <Label
              htmlFor="screening-interview"
              className="cursor-pointer text-sm"
            >
              Screening
            </Label>
          </div>
        </RadioGroup>

        {/* Submission Status Filter */}
        <Select
          value={submissionStatus}
          onValueChange={(value: SubmissionStatus) =>
            setSubmissionStatus(value)
          }
        >
          <SelectTrigger className="w-[180px] border rounded-md bg-white">
            <SelectValue placeholder="Submission Status">
              {submissionStatus === "all" && "All Candidates"}
              {submissionStatus === "submitted" && "Submitted"}
              {submissionStatus === "not_submitted" && "Not Submitted"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="not_submitted">Not Submitted</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort by dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-[#68696b]">Sort by :</span>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[200px] border rounded-md bg-white">
              <SelectValue placeholder="Sort by">
                {sortBy === "rating_high_to_low" && "Rating (High to Low)"}
                {sortBy === "rating_low_to_high" && "Rating (Low to High)"}
                {sortBy === "recent_submissions" && "Recent Submissions"}
                {sortBy === "past_submissions" && "Past Submissions"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent_submissions">
                Recent Submissions
              </SelectItem>
              <SelectItem value="past_submissions">Past Submissions</SelectItem>
              <SelectItem value="rating_high_to_low">
                Rating (High to Low)
              </SelectItem>
              <SelectItem value="rating_low_to_high">
                Rating (Low to High)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Candidates list */}
      <div className="border rounded-md mx-4 mb-4 bg-[#f0f3f7]">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Checkbox
              id="selectAll"
              className="mr-2 rounded border-[#d6d7d9]"
              checked={
                selectedCandidates.length === currentCandidates.length &&
                currentCandidates.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="selectAll" className="text-sm text-[#68696b]">
              Select All
            </label>
          </div>
        </div>

        {/* Loading state */}
        {isFetching && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-[#666666] font-medium">
                Loading candidates...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!!error && !isFetching && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-red-500 font-medium">
                Failed to load candidates
              </p>
              <p className="text-[#666666] mt-2">
                {typeof error === "string"
                  ? error
                  : "An error occurred while fetching candidates"}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isFetching && !error && currentCandidates.length === 0 && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-[#666666] font-medium">No candidates found</p>
              <p className="text-[#909091] mt-2">Try adjusting your filters</p>
            </div>
          </div>
        )}

        {!isFetching && !error && currentCandidates.length > 0 && (
          <>
            {/* Map through candidates with unified rendering */}
            {currentCandidates.map((candidate: InterviewCandidate) =>
              renderCandidateCard(candidate)
            )}
          </>
        )}

        {/* Pagination */}
        {!isFetching && !error && filteredCandidates.length > 0 && (
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#68696b]"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="text-[#68696b]">
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant="ghost"
                    className={`h-8 w-8 ${
                      currentPage === page
                        ? "bg-[#f0f3f7] text-[#001630]"
                        : "text-[#68696b]"
                    }`}
                    onClick={() => goToPage(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#68696b]"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#68696b]">Rows per page</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="w-[70px] border rounded-md">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCandidatesView;
