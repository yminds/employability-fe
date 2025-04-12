import React, { useState, useEffect } from "react";
import { useGetShortlistedCandiatesQuery } from "@/api/InterviewInvitation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Pagination from "./Pagination";

// Types
interface ShortlistedCandidate {
  _id: string;
  job_id: string;
  candidate_id: string;
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
  };
  shortlist: boolean;
  status: string;
}

interface ShortlistedCandidatesResponse {
  data: ShortlistedCandidate[];
  status: number;
  message: string;
}

type SortOption = "recent" | "name_asc" | "name_desc";

interface ShortlistedCandidateViewProps {
  jobId: string;
}

const ShortlistedCandidatesView: React.FC<ShortlistedCandidateViewProps> = ({ jobId }) => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  
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
    data:ShortlistedCandidatesResponse | undefined;
    isLoading:boolean;
    isFetching:boolean;
    error:any;
    refetch:()=> void;
  }

  const candidates = shortlistedCandidatesResponse?.data || [];

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter((candidate: ShortlistedCandidate) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    // Check if name contains search term
    const nameMatch = candidate.user_id.name.toLowerCase().includes(searchLower);
    
    // Check if location contains search term
    const locationMatch = candidate.user_id.address && (
      (candidate.user_id.address.city && candidate.user_id.address.city.toLowerCase().includes(searchLower)) ||
      (candidate.user_id.address.state && candidate.user_id.address.state.toLowerCase().includes(searchLower)) ||
      (candidate.user_id.address.country && candidate.user_id.address.country.toLowerCase().includes(searchLower))
    );
    
    return nameMatch || locationMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredCandidates.length);
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Handlers
  const handleViewProfile = (username: string) => {
    
    window.open(`/profile/${username}`,'_blank')
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

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden h-full p-6">
      {/* Filters in a single row */}
      <div className="sticky top-0 z-10 bg-white mb-5">
        <div className="flex items-center justify-between p-4 border-b border-[#d6d7d9]">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 border border-[#d6d7d9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#001630]"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#68696b] w-4 h-4" 
            />
          </div>
          
          {/* Sort dropdown */}
          <div className="ml-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-[#d6d7d9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#001630]"
            >
              <option value="recent">Most Recent</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
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
            <div className="p-4">
              {currentCandidates.map((candidate: ShortlistedCandidate) => (
                <div 
                  key={candidate._id} 
                  className="bg-white p-4 mb-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-[#eaeaea]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Profile Image */}
                      {candidate.user_id.profile_image ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border">
                          <img
                            src={candidate.user_id.profile_image}
                            alt={candidate.user_id.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center"
                          style={{ backgroundColor: "#6c757d" }}
                        >
                          <span className="text-white text-base font-medium">
                            {getInitials(candidate.user_id.name)}
                          </span>
                        </div>
                      )}
                      
                      {/* Name and Location */}
                      <div className="overflow-hidden">
                        <h3 className="font-medium text-[#0c0f12] text-base truncate">
                          {candidate.user_id.name}
                        </h3>
                        
                        {candidate.user_id.address && (
                          <p className="text-sm text-[#68696b] truncate">
                            {formatLocation(candidate.user_id.address)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* View Profile Button - positioned at the right end */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-0 h-8 text-sm bg-[#DFE7F2] text-[#001630] border-[#f0f3f7] hover:bg-[#f0f3f7] hover:text-[#001630]"
                      onClick={() => handleViewProfile(candidate.user_id.username)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
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