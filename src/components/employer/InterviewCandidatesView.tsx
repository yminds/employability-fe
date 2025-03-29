// InterviewCandidatesView.tsx
import type React from "react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetInterviewCandidatesQuery,
  useGetInterviewStatsQuery,
  useShortlistCandidateMutation,
  type InterviewCandidate,
} from "../../api/InterviewInvitation";

import { InterviewFilters } from "../employer/interviews/InterviewFilters";
import { CandidateCard } from "../employer/interviews/CandidateCard";
import { PaginationControls } from "../employer/interviews/PaginationControls";
import { StatusMessage } from "../employer/interviews/StatusMessageComponent";
import { SelectAllHeader } from "../employer/interviews/SelectAllHeader";

// Types
export type InterviewType = "full" | "screening" | "all";
export type SubmissionStatus = "all" | "submitted" | "not_submitted";
export type SortOption =
  | "rating_high_to_low"
  | "rating_low_to_high"
  | "recent_submissions"
  | "past_submissions";

interface InterviewCandidatesViewProps {
  jobId: string;
  onCandidateCountChange: (count: number) => void;
  initialCount: number;
}

const InterviewCandidatesView: React.FC<InterviewCandidatesViewProps> = ({
  jobId,
  onCandidateCountChange,
  initialCount = 0,
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

  useEffect(() => {
    const newCount = filteredCandidates.length;

    if (newCount !== initialCount) {
      onCandidateCountChange(newCount);
    }
  }, [filteredCandidates.length, onCandidateCountChange, initialCount]);

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
    window.location.href = `/reports/${reportId}`;
  };

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Update row count and reset to first page
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col">
      {/* Filters */}
      <InterviewFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        interviewType={interviewType}
        setInterviewType={setInterviewType}
        submissionStatus={submissionStatus}
        setSubmissionStatus={setSubmissionStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Candidates list */}
      <div className="border rounded-md mx-4 mb-4 bg-[#f0f3f7]">
        {/* Select All Header */}
        <SelectAllHeader
          selectedCandidates={selectedCandidates}
          currentCandidates={currentCandidates}
          handleSelectAll={handleSelectAll}
        />

        {/* Loading, Error, or Empty State */}
        {isFetching && <StatusMessage type="loading" />}
        {!!error && !isFetching && <StatusMessage type="error" error={error} />}
        {!isFetching && !error && currentCandidates.length === 0 && (
          <StatusMessage type="empty" />
        )}

        {/* Candidate Cards */}
        {!isFetching && !error && currentCandidates.length > 0 && (
          <>
            {currentCandidates.map((candidate: InterviewCandidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                isSelected={selectedCandidates.includes(candidate._id)}
                isShortlisting={
                  isShortlisting &&
                  shortlistingCandidateId === candidate.candidate_id
                }
                handleSelectCandidate={handleSelectCandidate}
                handleShortlist={handleShortlist}
                handleViewReport={handleViewReport}
              />
            ))}
          </>
        )}

        {/* Pagination */}
        {!isFetching && !error && filteredCandidates.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            goToPage={goToPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </div>
    </div>
  );
};

// Helper functions
export const getEffectiveRating = (candidate: InterviewCandidate) => {
  return (
    candidate.effective_final_rating ||
    candidate.type_final_rating ||
    candidate.final_rating ||
    0
  );
};

export const getEffectiveDate = (candidate: InterviewCandidate) => {
  return (
    candidate.effective_report_updated_at ||
    candidate.type_report_updated_at ||
    candidate.report_updated_at ||
    candidate.updated_at ||
    candidate.sent_at
  );
};

export const formatRelativeTime = (dateString: string) => {
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

export const formatDaysRemaining = (dateString?: string) => {
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

export const getSubmissionBadge = (candidate: InterviewCandidate) => {
  // If candidate status is accepted, show special badge
  if (candidate.status === "accepted") {
    return {
      bgColor: "bg-[#fff8e6]",
      textColor: "text-[#f59e0b]",
      icon: "clock",
      text: "Interview Accepted",
    };
  }

  // If candidate has a report, they've submitted
  if (candidate.has_report) {
    return {
      bgColor: "bg-[#d1f3d9]",
      textColor: "text-[#10b754]",
      icon: "check",
      text: "Submitted",
    };
  }

  // Otherwise, they haven't submitted
  return {
    bgColor: "bg-[#eceef0]",
    textColor: "text-[#414447]",
    icon: "x",
    iconBg: "bg-[#414447]",
    text: "Not Submitted",
  };
};

export const getTimeSinceUpdate = (candidate: InterviewCandidate) => {
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

export const canShowReportAndShortlist = (candidate: InterviewCandidate) => {
  return (
    candidate.status === "completed" &&
    candidate.task?.interview_type?.interview_id !== undefined
  );
};

export const getCandidateFinalRating = (candidate: InterviewCandidate) => {
  return candidate.effective_final_rating !== undefined
    ? candidate.effective_final_rating
    : candidate.type_final_rating !== undefined
    ? candidate.type_final_rating
    : candidate.final_rating;
};

export const getInitials = (name: string) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

export const getInitialsBackgroundColor = (name: string) => {
  return "#6c757d";
};

export default InterviewCandidatesView;