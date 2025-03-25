import React, { useState, useEffect } from 'react';
import { 
  Check, ChevronLeft, ChevronRight, MoreVertical, 
  Search, SlidersHorizontal, Bookmark 
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu as Dropdown, DropdownMenuContent as DropdownContent, DropdownMenuItem as DropdownItem, DropdownMenuTrigger as DropdownTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from "@/hooks/use-toast";

import { 
  useGetInterviewCandidatesQuery,
  useGetInterviewStatsQuery,
  useShortlistCandidateMutation,
  InterviewCandidate 
} from '../../api/InterviewInvitation';

interface InterviewCandidatesViewProps {
  jobId: string;
}

const InterviewCandidatesView: React.FC<InterviewCandidatesViewProps> = ({ jobId }) => {
  // State for filters and pagination
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [interviewType, setInterviewType] = useState<'full' | 'screening' | 'all'>('full');
  const [submissionStatus, setSubmissionStatus] = useState<'all' | 'pending' | 'submitted'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [shortlistingCandidateId, setShortlistingCandidateId] = useState<string | null>(null);
  
  // Toast notification if your UI has a toast component
  const { toast } = useToast();
  
  // Get interview candidates data
  const {
    data: candidatesResponse,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetInterviewCandidatesQuery({
    jobId,
    interviewType,
    status: submissionStatus,
    sortBy
  });

  // Get interview stats
  const {
    data: statsResponse,
    isLoading: statsLoading
  } = useGetInterviewStatsQuery(jobId);
  
  // Mutation for shortlisting
  const [shortlistCandidate, { isLoading: isShortlisting }] = useShortlistCandidateMutation();

  // Extract data
  const candidates = candidatesResponse?.data || [];
  const stats = statsResponse?.data || {
    fullInterviews: { invitesSent: 0, accepted: 0, notAccepted: 0, submitted: 0 },
    screeningInterviews: { invitesSent: 0, accepted: 0, notAccepted: 0, submitted: 0 }
  };
  
  // Filter candidates by search term
  const filteredCandidates = candidates.filter((candidate: InterviewCandidate) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.candidate_name.toLowerCase().includes(searchLower) ||
      (candidate.candidate_location && candidate.candidate_location.toLowerCase().includes(searchLower))
    );
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredCandidates.length);
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);
  
  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(currentCandidates.map((c: InterviewCandidate) => c._id));
    } else {
      setSelectedCandidates([]);
    }
  };
  
  // Handle individual selection
  const handleSelectCandidate = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, id]);
    } else {
      setSelectedCandidates(prev => prev.filter(cid => cid !== id));
    }
  };
  
  // Handle shortlist
  const handleShortlist = async (candidateId: string) => {
    try {
      setShortlistingCandidateId(candidateId);
      
      const response = await shortlistCandidate({
        jobId,
        candidateId
      }).unwrap();
      
      // Show success notification if toast is available
      if (toast) {
        toast({
          title: "Success",
          description: "Candidate has been shortlisted",
          variant: "default"
        });
      } else {
        console.log("Candidate shortlisted successfully");
      }
      
      // Refetch the candidates to update the UI
      refetch();
      
    } catch (error) {
      console.error("Error shortlisting candidate:", error);
      
      // Show error notification if toast is available
      if (toast) {
        toast({
          title: "Error",
          description: "Failed to shortlist candidate. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setShortlistingCandidateId(null);
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else {
      return `${diffInDays} days ago`;
    }
  };

  // Generate user initials for profile placeholder
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Create background color based on name
  const getInitialsBackgroundColor = (name: string) => {
    if (!name) return '#6c757d';
    
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
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
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

  const renderCandidateCard = (candidate: InterviewCandidate) => {
    // For "completed" status, use the new profile design
    if (candidate.status === 'completed') {
      return (
        <div className="bg-white border-b p-0">
          <div className="border-b border-[#d9d9d9]">
            <div className="flex items-center p-6 gap-4">
              {/* Checkbox */}
              <div className="flex-shrink-0">
                <Checkbox 
                  id={`candidate-${candidate._id}`}
                  checked={selectedCandidates.includes(candidate._id)}
                  onCheckedChange={(checked) => handleSelectCandidate(candidate._id, !!checked)}
                  className="rounded border-[#68696b]"
                />
              </div>
              
              {/* Profile section */}
              <div className="flex flex-1 items-center gap-4">
                {/* Profile image with badge */}
                <div className="relative flex-shrink-0">
                  {candidate.profile_image ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                      <img 
                        src={candidate.profile_image} 
                        alt={candidate.candidate_name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-20 h-20 rounded-full overflow-hidden border-2 border-white flex items-center justify-center"
                      style={{ backgroundColor: getInitialsBackgroundColor(candidate.candidate_name) }}
                    >
                      <span className="text-white text-lg font-medium">
                        {getInitials(candidate.candidate_name)}
                      </span>
                    </div>
                  )}
                  {/* We could add a badge here if needed */}
                </div>
                
                {/* Candidate info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-medium text-[#202326]">{candidate.candidate_name}</h2>
                  {/* <p className="text-[#414447] text-sm">{candidate.candidate_location || "Location not available"}</p> */}
                  <p className="text-[#68696b] text-sm mt-1">
                    Submitted {candidate.report_submitted_at ? formatRelativeTime(candidate.report_submitted_at) : 'N/A'}
                  </p>
                </div>
                
                {/* Score section - Only shown if has_report is true */}
                {candidate.has_report && (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-[#202326]">{candidate.interview_score?.toFixed(1)}</span>
                        <span className="text-[#68696b]">/10</span>
                        <div className="bg-[#10b754] rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-[#68696b]">Interview score</span>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  {candidate.has_report && (
                    <Button
                      variant="outline"
                      className="bg-[#dfe7f2] hover:bg-[#d0dbe9] text-[#001630] font-medium py-2 px-4 rounded"
                      onClick={() => window.open(`/reports/${candidate.report_id}`, '_blank')}
                    >
                      View Report
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className={`border ${
                      candidate.shortlist 
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" 
                      : "border-[#d9d9d9] hover:bg-gray-50 text-[#202326]"
                    } font-medium py-2 px-4 rounded flex items-center gap-2`}
                    onClick={() => handleShortlist(candidate.candidate_id)}
                    disabled={isShortlisting || !!shortlistingCandidateId || candidate.shortlist}
                  >
                    {shortlistingCandidateId === candidate.candidate_id ? (
                      <span className="flex items-center">
                        <span className="w-3 h-3 border-2 border-t-[#68696b] border-r-[#68696b] border-b-transparent border-l-transparent rounded-full animate-spin mr-1"></span>
                        Shortlisting...
                      </span>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        {candidate.shortlist ? 'Shortlisted' : 'Shortlist'}
                      </>
                    )}
                  </Button>
                  
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#202326] p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="w-6 h-6" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownContent align="end">
                      <DropdownItem>Send Message</DropdownItem>
                      <DropdownItem>Schedule Interview</DropdownItem>
                      <DropdownItem>Download Resume</DropdownItem>
                      <DropdownItem className="text-red-500">Decline Candidate</DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Original design for non-completed candidates
      return (
        <div className="bg-white border-b p-4">
          <div className="flex items-center">
            <Checkbox 
              id={`candidate-${candidate._id}`} 
              className="mr-4 rounded border-[#d6d7d9]"
              checked={selectedCandidates.includes(candidate._id)}
              onCheckedChange={(checked) => handleSelectCandidate(candidate._id, !!checked)}
            />
            <div className="relative">
              {candidate.profile_image ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border">
                  <img 
                    src={candidate.profile_image} 
                    alt={candidate.candidate_name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div 
                  className="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center"
                  style={{ backgroundColor: getInitialsBackgroundColor(candidate.candidate_name) }}
                >
                  <span className="text-white text-lg font-medium">
                    {getInitials(candidate.candidate_name)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-[#0c0f12]">{candidate.candidate_name}</h3>
                  {candidate.candidate_location && (
                    <p className="text-sm text-[#68696b]">{candidate.candidate_location}</p>
                  )}
                  {candidate.has_report && (
                    <p className="text-xs text-[#68696b] mt-1">
                      Submitted {candidate.report_submitted_at ? formatRelativeTime(candidate.report_submitted_at) : 'N/A'}
                    </p>
                  )}
                  {/* Show shortlisted tag if candidate is shortlisted */}
                  {candidate.shortlist && (
                    <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Shortlisted
                    </span>
                  )}
                </div>
                
                {/* If candidate has not submitted report yet */}
                {!candidate.has_report && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#24d680]">Invite Accepted</div>
                    <p className="text-sm text-[#68696b]">Waiting for Interview Submission</p>
                  </div>
                )}
                
                {/* If candidate has submitted interview report */}
                {candidate.has_report && (
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-[#0c0f12]">{candidate.interview_score?.toFixed(1)}</span>
                        <span className="text-sm text-[#68696b]">/10</span>
                        <div className="w-5 h-5 rounded-full bg-[#24d680] flex items-center justify-center ml-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-[#68696b]">Interview score</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm bg-[#d2e9ff] text-[#2d96ff] border-[#d2e9ff] hover:bg-[#d2e9ff] hover:text-[#2d96ff]"
                        onClick={() => window.open(`/reports/${candidate.report_id}`, '_blank')}
                      >
                        View Report
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-8 px-3 py-1 text-sm ${
                          candidate.shortlist 
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" 
                          : "border-[#d6d7d9] text-[#68696b] hover:bg-transparent"
                        }`}
                        onClick={() => handleShortlist(candidate.candidate_id)}
                        disabled={isShortlisting || !!shortlistingCandidateId || candidate.shortlist}
                      >
                        {shortlistingCandidateId === candidate.candidate_id ? (
                          <span className="flex items-center">
                            <span className="w-3 h-3 border-2 border-t-[#68696b] border-r-[#68696b] border-b-transparent border-l-transparent rounded-full animate-spin mr-1"></span>
                            Shortlisting...
                          </span>
                        ) : candidate.shortlist ? (
                          <span className="flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            Shortlisted
                          </span>
                        ) : (
                          <span>Shortlist</span>
                        )}
                      </Button>
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#68696b]">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent align="end">
                          <DropdownItem>Send Message</DropdownItem>
                          <DropdownItem>Schedule Interview</DropdownItem>
                          <DropdownItem>Download Resume</DropdownItem>
                          <DropdownItem className="text-red-500">Decline Candidate</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1">
        {/* Filters */}
        <div className="flex gap-2 p-4">
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

          <Select value={interviewType} onValueChange={(value: 'full' | 'screening' | 'all') => setInterviewType(value)}>
            <SelectTrigger className="w-[180px] border rounded-md">
              <SelectValue placeholder="Interview Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Interview</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="all">All Types</SelectItem>
            </SelectContent>
          </Select>

          <Select value={submissionStatus} onValueChange={(value: 'all' | 'pending' | 'submitted') => setSubmissionStatus(value)}>
            <SelectTrigger className="w-[180px] border rounded-md">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="all">All Statuses</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="border rounded-md">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[#68696b]">Sort by :</span>
            <Select value={sortBy} onValueChange={(value: 'recent' | 'oldest' | 'name') => setSortBy(value)}>
              <SelectTrigger className="w-[220px] border rounded-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent Submissions</SelectItem>
                <SelectItem value="oldest">Oldest Submissions</SelectItem>
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
                checked={selectedCandidates.length === currentCandidates.length && currentCandidates.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="selectAll" className="text-sm text-[#68696b]">
                Select All
              </label>
            </div>
          </div>

          {/* Error state */}
          {!!error && !isFetching && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-red-500 font-medium">Failed to load candidates</p>
                <p className="text-[#666666] mt-2">
                  {typeof error === 'string' 
                    ? error 
                    : 'An error occurred while fetching candidates'
                  }
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
              {/* Map through candidates with conditional rendering based on status */}
              {currentCandidates.map((candidate: InterviewCandidate) => renderCandidateCard(candidate))}
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
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="text-[#68696b]">...</span>
                  ) : (
                    <Button 
                      key={`page-${page}`}
                      variant="ghost" 
                      className={`h-8 w-8 ${
                        currentPage === page 
                          ? 'bg-[#f0f3f7] text-[#001630]' 
                          : 'text-[#68696b]'
                      }`}
                      onClick={() => goToPage(page as number)}
                    >
                      {page}
                    </Button>
                  )
                ))}
                
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