import React, { useState, useEffect } from "react";
import { useGetShortlistedCandiatesQuery } from "@/api/InterviewInvitation";
import { Search, Bookmark, AlertCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "./Pagination";
import verified from "@/assets/skills/verified.svg";
import Submitted from "@/assets/employer/Submitted.svg";
import NotSubmitted from "@/assets/employer/NotSubmitted.svg";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Types
interface ShortlistedCandidate {
  _id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  interview_id?: string;
  type_interview_id?: string;
  user_id: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    username: string;
    profile_image?: string;
    address?: {
      country: string;
      state: string;
      city: string;
    };
    goals?: { _id: string; title: string }[];
    skills?: { _id: string; name: string }[];
    experience_level?: string;
    current_status?: string;
  };
  shortlist: boolean;
  task?: {
    interview_type: {
      type: string;
      status: string;
      interview_id: string;
    };
  };
  has_report: boolean;
  report_id?: string;
  final_rating?: number;
  report_updated_at?: string;
  type_report_id?: string;
  type_final_rating?: number;
  type_report_updated_at?: string;
  effective_report_id?: string;
  effective_final_rating?: number;
  effective_report_updated_at?: string;
  effective_interview_id?: string;
  total_experience?: number;
  raw_report?: any;
  raw_type_report?: any;
}

interface ShortlistedCandidatesResponse {
  data: ShortlistedCandidate[];
  status: number;
  message: string;
  count: number;
}

type SortOption = "recent" | "name_asc" | "name_desc" | "rating_high" | "rating_low";
type InterviewType = "full" | "screening" | "all";

interface ShortlistedCandidateViewProps {
  jobId: string;
  onRefetchAvailable?: (refetch: () => void) => void;
}

const ShortlistedCandidatesView: React.FC<ShortlistedCandidateViewProps> = ({ jobId }) => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [interviewType, setInterviewType] = useState<InterviewType>("all");
  
  // API Query
  const {
    data: shortlistedCandidatesResponse,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetShortlistedCandiatesQuery({
    jobId,
    sortBy: sortBy
  }) as {
    data: ShortlistedCandidatesResponse | undefined;
    isLoading: boolean;
    isFetching: boolean;
    error: any;
    refetch: () => void;
  }
  

  const candidates = shortlistedCandidatesResponse?.data || [];
  
  useEffect(()=>{
    refetch()
  },[refetch])

  // Filter candidates based on search term and interview type
  const filteredCandidates = candidates.filter((candidate: ShortlistedCandidate) => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      // Check if name contains search term
      const nameMatch = candidate.user_id.name.toLowerCase().includes(searchLower);
      
      // Check if location contains search term
      const locationMatch = candidate.user_id.address && (
        (candidate.user_id.address.city && candidate.user_id.address.city.toLowerCase().includes(searchLower)) ||
        (candidate.user_id.address.state && candidate.user_id.address.state.toLowerCase().includes(searchLower)) ||
        (candidate.user_id.address.country && candidate.user_id.address.country.toLowerCase().includes(searchLower))
      );
      
      // Check if skills match
      const skillsMatch = candidate.user_id.skills && candidate.user_id.skills.some(
        skill => skill.name.toLowerCase().includes(searchLower)
      );
      
      if (!(nameMatch || locationMatch || skillsMatch)) {
        return false;
      }
    }
    
    // Apply interview type filter
    if (interviewType !== "all") {
      const candidateInterviewType = candidate.task?.interview_type?.type?.toLowerCase();
      return candidateInterviewType === interviewType;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredCandidates.length);
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Handlers
  const handleViewProfile = (username: string) => {
    window.open(`/profile/${username}`, '_blank');
  };

  const handleViewReport = (candidate: ShortlistedCandidate) => {
    const inviteId = candidate._id;
  
    console.log("inviteId", inviteId);
  
    if (!inviteId) {
      console.error("Invite not found");
      return;
    }
  
    // Get the interview type from task or default to "Full"
    const interviewType = candidate.task?.interview_type?.type || "Full";
    
    // Capitalize the first letter of the interview type
    const formattedType = interviewType.charAt(0).toUpperCase() + interviewType.slice(1);
    
    // Build the URL with the new format
    const reportUrl = `/employer/report/${formattedType}/${inviteId}/${candidate.user_id.username}/${candidate.task?.interview_type?.interview_id}`;
    
    window.open(reportUrl, '_blank');
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInterviewTypeChange = (value: InterviewType) => {
    // If clicking the currently selected type, set back to "all"
    if (value === interviewType) {
      setInterviewType("all");
    } else {
      setInterviewType(value);
    }
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Helper functions
  const formatLocation = (address?: {country: string; state: string; city: string}) => {
    if (!address) return "";
    
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    
    return parts.join(", ") || "";
  };
  
  const getInitials = (name: string) => {
    if (!name) return "?";
    
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const getEffectiveRating = (candidate: ShortlistedCandidate) => {
    // First check type_final_rating since we're prioritizing it
    if (candidate.type_final_rating !== undefined && candidate.type_final_rating !== null) {
      return candidate.type_final_rating;
    }
    
    // Then check the effective_final_rating which is the next preference
    if (candidate.effective_final_rating !== undefined && candidate.effective_final_rating !== null) {
      return candidate.effective_final_rating;
    }
    
    // If we have raw report data, check there
    if (candidate.raw_type_report?.final_rating) {
      return candidate.raw_type_report.final_rating;
    }
    
    if (candidate.raw_report?.final_rating) {
      return candidate.raw_report.final_rating;
    }
    
    // Fall back to the other fields
    if (candidate.final_rating !== undefined && candidate.final_rating !== null) {
      return candidate.final_rating;
    }
    
    return 0;
  };

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "yesterday";
    return `${diffInDays} days ago`;
  };

  const getTimeSinceUpdate = (candidate: ShortlistedCandidate) => {
    // Prioritize type_report_updated_at since we're focusing on type reports
    if (candidate.type_report_updated_at) {
      return formatRelativeTime(candidate.type_report_updated_at);
    }
    
    // Use the most recent update time from any available field as fallback
    const updateDate =
      candidate.effective_report_updated_at ||
      candidate.report_updated_at 

    if (!updateDate) return null;

    return formatRelativeTime(updateDate);
  };

  // UI Components
  const StatusMessage = ({ type }: { type: "loading" | "error" | "empty" }) => {
    if (type === "loading") {
      return (
        <div className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-[#68696b]">Loading shortlisted candidates...</p>
        </div>
      );
    } else if (type === "error") {
      return (
        <div className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-[#68696b] mb-4">Failed to load shortlisted candidates.</p>
          <Button 
            variant="outline"
            onClick={() => refetch()}
            className="mx-auto"
          >
            Try Again
          </Button>
        </div>
      );
    } else if (type === "empty") {
      return (
        <div className="py-12 text-center">
          <p className="text-[#68696b]">No shortlisted candidates for this job yet.</p>
        </div>
      );
    }
    return null;
  };

  // Render badge icon based on type
  const renderBadgeIcon = (badgeType: string) => {
    if (badgeType === "check") {
      return (
        <div className="w-4 h-4 mr-2 flex items-center justify-center rounded-full">
          <img src={Submitted} alt="Submitted" />
        </div>
      );
    } else if (badgeType === "x") {
      return (
        <div className="w-4 h-4 mr-2 flex items-center justify-center rounded-full">
          <img src={NotSubmitted} alt="Not Submitted" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden h-full p-6">
      {/* Filters in a single row */}
      <div className="sticky top-0 z-10 bg-white mb-5">
          <div className="flex items-center justify-between">
            {/* Left side with search and filters */}
            <div className="flex items-center gap-4">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-10 py-2 border border-[#d6d7d9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#001630]"
                />
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#68696b] w-4 h-4" 
                />
              </div>
              
              {/* Interview Type Radio Buttons */}
              <div className="flex items-center space-x-2">
                <RadioGroup
                  value={interviewType}
                  onValueChange={(value) => handleInterviewTypeChange(value as InterviewType)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="full" 
                      id="full" 
                      className="text-[#001630] border-[#68696b] data-[state=checked]:border-[#001630] data-[state=checked]:bg-[#001630]" 
                    />
                    <Label htmlFor="full" className="text-sm font-medium text-[#0c0f12] cursor-pointer">
                      Full Interview
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="screening" 
                      id="screening" 
                      className="text-[#001630] border-[#68696b] data-[state=checked]:border-[#001630] data-[state=checked]:bg-[#001630]" 
                    />
                    <Label htmlFor="screening" className="text-sm font-medium text-[#0c0f12] cursor-pointer">
                      Screening Interview
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sort dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-[#d6d7d9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#001630]"
              >
                <option value="recent">Most Recent</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="rating_high">Rating (High to Low)</option>
                <option value="rating_low">Rating (Low to High)</option>
              </select>
            </div>
          </div>
          
          {/* Clear filter button - shown only when filter is active */}
          {interviewType !== "all" && (
            <div className="mt-3 flex">
              <button
                onClick={() => setInterviewType("all")}
                className="text-[#001630] text-xs underline hover:text-[#001630]/80"
              >
                Clear filter
              </button>
            </div>
          )}

      </div>

      <div className="bg-white rounded-lg border border-[#d6d7d9] flex flex-col h-full">
        {/* Candidates list - scrollable content */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          {/* Loading, Error, or Empty State */}
          {isFetching && <StatusMessage type="loading" />}
          {!!error && !isFetching && <StatusMessage type="error" />}
          {!isFetching && !error && currentCandidates.length === 0 && <StatusMessage type="empty" />}

          {/* Candidate Cards */}
          {!isFetching && !error && currentCandidates.length > 0 && (
            <div>
              {currentCandidates.map((candidate: ShortlistedCandidate) => {
                const rating = getEffectiveRating(candidate);
                const hasReport = candidate.has_report && (candidate.type_report_id || candidate.effective_report_id || candidate.report_id);
                
                return (
                  <div 
                    key={candidate._id} 
                    className="bg-white p-5 border-b border-[#d6d7d9]"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Profile Image */}
                      <div className="relative">
                        {candidate.user_id.profile_image ? (
                          <div className="w-14 h-14 rounded-full overflow-hidden border">
                            <img
                              src={candidate.user_id.profile_image}
                              alt={candidate.user_id.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-14 h-14 rounded-full overflow-hidden border flex items-center justify-center"
                            style={{ backgroundColor: "#6c757d" }}
                          >
                            <span className="text-white text-xl font-medium">
                              {getInitials(candidate.user_id.name)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            {/* Name and Location */}
                            <h3 className="font-medium text-[#0c0f12] text-base">
                              {candidate.user_id.name}
                            </h3>
                            
                            {candidate.user_id.address && (
                              <p className="text-sm text-[#68696b]">
                                {formatLocation(candidate.user_id.address)}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              {/* Interview Type Badge */}
                              {candidate.task?.interview_type?.type && (
                                <div className="inline-flex items-center px-2 py-0.5 bg-[#edf2f7] text-[#001630] rounded-md text-xs">
                                  {candidate.task.interview_type.type.charAt(0).toUpperCase() + candidate.task.interview_type.type.slice(1)} Interview
                                </div>
                              )}

                            </div>
                          </div>

                          {/* Right side with rating and buttons */}
                          <div className="flex flex mt-2 items-end justify-center h-full">
                            {/* Interview Rating - Show for candidates with reports */}
                            {hasReport && (
                              <div className="text-center mr-8">
                                <div className="flex items-center gap-1">
                                  <span className="text-lg font-bold text-[#0c0f12]">
                                    {rating > 0 ? rating.toFixed(1) : 0}
                                  </span>
                                  <span className="text-sm text-[#68696b]">/10</span>
                                  {rating > 0 && (
                                    <div className="w-5 h-5 ml-1">
                                      <img src={verified} alt="verified.png" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-[#68696b]">Interview score</p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 mt-2">
                              {/* View Report button - Show only if report exists */}
                              {hasReport && (
                                <Button
                                  variant="outline"
                                  className="h-8 px-3 py-1 text-sm bg-[#DFE7F2] underline text-[#001630] border-[#f0f3f7] hover:bg-[#f0f3f7] hover:text-[#001630]"
                                  onClick={() => handleViewReport(candidate)}
                                >
                                  View Report
                                </Button>
                              )}

                              {/* View Profile Button */}
                              <Button
                                variant="outline"
                                className="h-8 px-3 py-1 text-sm bg-[#DFE7F2] text-[#001630] border-[#f0f3f7] hover:bg-[#f0f3f7] hover:text-[#001630]"
                                onClick={() => handleViewProfile(candidate.user_id.username)}
                              >
                                View Profile
                              </Button>

                              {/* More options dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#68696b]"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-500">
                                    Remove from Shortlist
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination - fixed at the bottom */}
        {!isFetching && !error && filteredCandidates.length > 0 && (
          <div className="sticky bottom-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              onPageChange={goToPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistedCandidatesView;