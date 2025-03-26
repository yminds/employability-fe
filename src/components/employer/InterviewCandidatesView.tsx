
import type React from "react";
import { useState } from "react";
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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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

// Update the InterviewInfo interface to match backend structure
interface InterviewInfo {
  interview_id: string;
  interview_date?: string;
  interview_status?: string;
}

interface InterviewCandidatesViewProps {
  jobId: string;
}

const InterviewCandidatesView: React.FC<InterviewCandidatesViewProps> = ({
  jobId,
}) => {
  // State for filters and pagination
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [interviewType, setInterviewType] = useState<
    "full" | "screening" | "all"
  >("full");
  const [submissionStatus, setSubmissionStatus] = useState<
    "all" | "submitted" | "not_submitted"
  >("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name">("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [shortlistingCandidateId, setShortlistingCandidateId] = useState<
    string | null
  >(null);
  // New filter for shortlisted candidates
  const [filterShortlisted, setFilterShortlisted] = useState<
    "all" | "shortlisted" | "not_shortlisted"
  >("all");

  const[localCandidates, setLocalCandidates] = useState<InterviewCandidate[]>([]);

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
    interviewType,
    status: submissionStatus,
    sortBy,
    filter_shortlisted: filterShortlisted,
  });

  // Get interview stats
  const { data: statsResponse, isLoading: statsLoading } =
    useGetInterviewStatsQuery(jobId);

  // Mutation for shortlisting
  const [shortlistCandidate, { isLoading: isShortlisting }] =
    useShortlistCandidateMutation();



  // Extract data

  const candidates = localCandidates.length > 0 ? localCandidates : candidatesResponse?.data || [];

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

  // Filter candidates by search term and submission status
  const filteredCandidates = candidates.filter((candidate: any) => {
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

    // Then apply submission status filter if set
    if (submissionStatus === "submitted") {
      return candidate.has_report === true;
    } else if (submissionStatus === "not_submitted") {
      return candidate.has_report !== true;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredCandidates.length
  );
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

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
  const getSubmissionBadge = (candidate: any) => {
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
  const getTimeSinceUpdate = (candidate: any) => {
    const updateDate =
      candidate.report_updated_at || candidate.updated_at || candidate.sent_at;
    if (!updateDate) return null;

    return formatRelativeTime(updateDate);
  };

  const renderCandidateCard = (candidate: any) => {
    // Get submission badge info
    const submissionBadge = getSubmissionBadge(candidate);

    // Get time since last update
    const timeSinceUpdate = getTimeSinceUpdate(candidate);

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
            <div className="flex justify-between items-center">
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
                  {/* Submission status badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${submissionBadge.bgColor}`}
                  >
                    {submissionBadge.iconBg ? (
                      <div
                        className={`w-4 h-4 flex items-center justify-center rounded-full ${submissionBadge.iconBg}`}
                      >
                        {submissionBadge.icon}
                      </div>
                    ) : (
                      submissionBadge.icon
                    )}
                    <span
                      className={`text-sm font-medium ${submissionBadge.textColor}`}
                    >
                      {submissionBadge.text}
                    </span>
                    {candidate.has_report && timeSinceUpdate && (
                      <span className={`text-sm ${submissionBadge.textColor}`}>
                        {timeSinceUpdate}
                      </span>
                    )}
                  </div>

                  {/* Shortlisted badge if applicable */}
                  {/* {candidate.shortlist && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e6f7ed]">
                      <Check className="w-4 h-4 text-[#10b754]" />
                      <span className="text-sm text-[#10b754] font-medium">Shortlisted</span>
                    </div>
                  )} */}

                  {/* Status badge - showing the underlying status */}
                  {/* <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#edf2f7]">
                    <span className="text-sm text-[#4a5568] font-medium">
                      {candidate.status}
                    </span>
                  </div> */}
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Show rating only if completed status, has report and interview_id */}
                {candidate.status === "completed" &&
                  candidate.has_report &&
                  candidate.interview_id && (
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-[#0c0f12]">
                          {typeof candidate.final_rating === "number"
                            ? candidate.final_rating.toFixed(1)
                            : "N/A"}
                        </span>
                        <span className="text-sm text-[#68696b]">/10</span>
                        <div className="w-5 h-5 rounded-full bg-[#10b754] flex items-center justify-center ml-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-[#68696b]">Interview Score</p>
                    </div>
                  )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {/* Show "View Report" only if completed status, has report and interview_id */}
                  {candidate.status === "completed" &&
                    candidate.has_report &&
                    candidate.interview_id && (
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm bg-[#dfe7f2] text-[#001630] border-[#dfe7f2] hover:bg-[#dfe7f2] hover:text-[#001630]"
                      >
                        View Report
                      </Button>
                    )}

                  {/* Show "Shortlist" button if not shortlisted */}
                  {candidate.status === "completed" &&
                    candidate.interview_id &&
                    !candidate.shortlist && (
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm border-[#d9d9d9] text-[#202326] hover:bg-transparent flex items-center"
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
                          <>
                            <Bookmark className="w-4 h-4 mr-1" />
                            Shortlist
                          </>
                        )}
                      </Button>
                    )}

                  {/* Show "Shortlisted" button if already shortlisted */}
                  {candidate.status === "completed" &&
                    candidate.interview_id &&
                    candidate.shortlist && (
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm bg-[rgba(3,150,63,0.10)] text-[#03963f] border-[#d9d9d9] hover:bg-[#d9d9d9] hover:text-[#03963f] flex items-center"
                        disabled
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            d="M17.4693 8.99944L15 6.53019L16.0443 5.46094L17.4693 6.88594L20.9943 3.33594L22.0635 4.40519L17.4693 8.99944ZM5.5 20.2494V5.30719C5.5 4.80202 5.675 4.37444 6.025 4.02444C6.375 3.67444 6.80258 3.49944 7.30775 3.49944H13V4.99944H7.30775C7.23075 4.99944 7.16025 5.03152 7.09625 5.09569C7.03208 5.15969 7 5.23019 7 5.30719V17.9494L12 15.7994L17 17.9494V10.9994H18.5V20.2494L12 17.4609L5.5 20.2494Z"
                            fill="#03963F"
                          />
                        </svg>
                        Shortlisted
                      </Button>
                    )}

                  {/* Interview scheduling info if available */}
                  {candidate.interview_info &&
                    candidate.interview_info.interview_date && (
                      <div className="text-sm text-[#4b5563] flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(candidate.interview_info.interview_date)}
                        </span>
                      </div>
                    )}

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1">
        {/* Filters */}
        <div className="flex gap-2 p-4 flex-wrap">
          <div className="relative w-[240px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#68696b] w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2d96ff]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={interviewType}
            onValueChange={(value: "full" | "screening" | "all") =>
              setInterviewType(value)
            }
          >
            <SelectTrigger className="w-[180px] border rounded-md">
              <SelectValue placeholder="Interview Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Interview</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="all">All Types</SelectItem>
            </SelectContent>
          </Select>

          {/* Updated to focus on submission status */}
          <Select
            value={submissionStatus}
            onValueChange={(value: "all" | "submitted" | "not_submitted") =>
              setSubmissionStatus(value)
            }
          >
            <SelectTrigger className="w-[180px] border rounded-md">
              <SelectValue placeholder="Submission Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="not_submitted">Not Submitted</SelectItem>
            </SelectContent>
          </Select>

          {/* Shortlist filter */}
          <Select
            value={filterShortlisted}
            onValueChange={(value: "all" | "shortlisted" | "not_shortlisted") =>
              setFilterShortlisted(value)
            }
          >
            <SelectTrigger className="w-[180px] border rounded-md">
              <SelectValue placeholder="Shortlist Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="not_shortlisted">Not Shortlisted</SelectItem>
              <SelectItem value="all">All Candidates</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="border rounded-md">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[#68696b]">Sort by :</span>
            <Select
              value={sortBy}
              onValueChange={(value: "recent" | "oldest" | "name") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[220px] border rounded-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent Updates</SelectItem>
                <SelectItem value="oldest">Oldest Updates</SelectItem>
                <SelectItem value="name">Name</SelectItem>
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
                <p className="text-[#666666] font-medium">
                  No candidates found
                </p>
                <p className="text-[#909091] mt-2">
                  Try adjusting your filters
                </p>
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
    </div>
  );
};

export default InterviewCandidatesView;
