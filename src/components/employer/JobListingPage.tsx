import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetMatchingCandidatesQuery,
  useGetJobDetailsQuery,
} from "../../api/employerJobsApiSlice";

// Import our components
import BreadcrumbNav from "./nav/BreadcrumbNav";
import TabNavigation from "./TabNavigation";
import SearchAndFilters from "./SearchAndFilters";
import FilterPanel from "./FilterPanel";
import CandidateList from "./CandidateList";
import ResumeUploadBanner from "./ResumeUploadBanner";
import JobDetailsCard from "./JobDetailsCard";
import ResumeUploadModal, { ProcessedResume } from "./UploadResumesModal";
import InterviewModal from "./InterviewInvitationModal";
import InterviewCandidatesView from "./InterviewCandidatesView";
import FullInterviewsCard from "./FullInterviewsCard";
import ScreeningInterviewsCard from "./ScreeningInterviewsCard";
import MatchingCandidatesCard from "./MatchingCandidatesCard";

import { useGetInterviewCandidatesQuery } from "../../api/InterviewInvitation";

interface JobListingPageProps {
  job_id: string;
}

// Skeleton components for different parts of the page
const JobDetailsSkeleton = () => (
  <div className="bg-white rounded-lg p-6 mb-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="flex gap-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-lg p-4 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const CandidateListSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    </div>
    
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-4 mb-2 flex">
        <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    ))}
    
    <div className="mt-4 flex justify-between">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export default function JobListingPage({ job_id }: JobListingPageProps) {
  const navigate = useNavigate();
  
  // Page state
  const [pageReady, setPageReady] = useState(false);
  
  // Tab state
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [interviewCount, setInterviewCount] = useState(0);
  
  // Other state variables
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filterOpen, setFilterOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("matching");

  const handleCandidateCountChange = (count: number) => {
    setInterviewCount(count);
  };

  // Fetch job details
  const {
    data: jobDetails,
    isLoading: isLoadingJob,
  } = useGetJobDetailsQuery(job_id);

  // Fetch matching candidates
  const {
    data: matchingCandidatesResponse,
    isLoading,
    error,
    refetch: refetchCandidates,
  } = useGetMatchingCandidatesQuery({ job_id, source: selectedSource, sortBy });

  const { 
    data: interviewCandidatesResponse, 
    isLoading: isLoadingInterviews,
    isSuccess: isInterviewsSuccess
  } = useGetInterviewCandidatesQuery({
    jobId: job_id,
  }, {
    skip: !job_id,
  });

  // Calculate interview count and determine initial tab when data is available
  useEffect(() => {
    // Skip if page is already ready or data is still loading
    if (pageReady || (isLoadingInterviews || !isInterviewsSuccess)) {
      return;
    }

    // Process interview data
    let count = 0;
    if (interviewCandidatesResponse?.data) {
      const filteredCandidates = interviewCandidatesResponse.data.filter(
        (candidate: any) =>
          candidate.status === "accepted" || candidate.status === "pending"
      );
      count = filteredCandidates.length;
    }

    // Set interview count
    setInterviewCount(count);
    
    // Determine initial tab based on count
    const initialTab = count > 0 ? "interviews" : "inviteCandidates";
    setSelectedTab(initialTab);

    // Mark page as ready only after a delay to ensure everything is set
    setTimeout(() => {
      setPageReady(true);
    }, 100); // Short delay to ensure React has time to process state updates
  }, [interviewCandidatesResponse, isLoadingInterviews, isInterviewsSuccess, pageReady]);

  const allCandidates = matchingCandidatesResponse?.data || [];

  // Filter candidates based on search term
  const filteredCandidates = allCandidates.filter((candidate) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(searchLower) ||
      (candidate.email &&
        candidate.email.toLowerCase().includes(searchLower)) ||
      (candidate.current_status &&
        candidate.current_status.toLowerCase().includes(searchLower))
    );
  });

  // Calculate pagination
  useEffect(() => {
    if (filteredCandidates.length > 0) {
      setTotalPages(Math.ceil(filteredCandidates.length / rowsPerPage));
      if (currentPage > Math.ceil(filteredCandidates.length / rowsPerPage)) {
        setCurrentPage(1);
      }
    } else {
      setTotalPages(1);
    }
  }, [filteredCandidates, rowsPerPage, currentPage]);

  const indexOfLastCandidate = currentPage * rowsPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - rowsPerPage;
  const currentCandidates = filteredCandidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );

  useEffect(() => {
    if (currentCandidates.length === 0) {
      setSelectAll(false);
      return;
    }
    const allSelected = currentCandidates.every((candidate: any) =>
      selectedCandidates.includes(candidate.user_id)
    );
    setSelectAll(allSelected);
  }, [currentCandidates, selectedCandidates]);

  // Other handlers (simplified for brevity)
  const handleSelectAllCurrentPage = (checked: boolean) => {
    if (checked) {
      const currentIds = currentCandidates.map((candidate: any) => candidate.user_id);
      setSelectedCandidates((prevSelected) => {
        const newSet = new Set([...prevSelected, ...currentIds]);
        return Array.from(newSet);
      });
    } else {
      const currentIds = currentCandidates.map((c: any) => c.user_id);
      setSelectedCandidates((prevSelected) => {
        return prevSelected.filter((id) => !currentIds.includes(id));
      });
    }
  };

  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      const allIds = filteredCandidates.map((candidate: any) => candidate.user_id);
      setSelectedCandidates(allIds);
    }
  };

  const handleSelectCandidate = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });
    } else {
      setSelectedCandidates((prev) => prev.filter((cid) => cid !== id));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setCurrentPage(1);
  };

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy);
    setCurrentPage(1);
  };

  const handleSendInterviewInvite = () => {
    if (selectedCandidates.length === 0) return;
    setIsInterviewModalOpen(true);
  };

  const handleCloseInterviewModal = () => {
    setIsInterviewModalOpen(false);
  };

  const handleOpenResumeModal = () => {
    setIsModalOpen(true);
  };

  const handleResumesProcessed = (resumes: ProcessedResume[]) => {
    setProcessedResumes(resumes);
    refetchCandidates();
  };

  const handleSelectCandidates = (candidateIds: string[]) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set([...prev, ...candidateIds]);
      return Array.from(newSet);
    });
  };

  const handleFilterReset = () => {
    console.log("Resetting filters");
  };

  const handleFilterApply = () => {
    console.log("Applying filters");
    setFilterOpen(false);
  };

  const getSelectedCandidateDetails = () => {
    return allCandidates
      .filter((candidate: any) =>
        selectedCandidates.includes(candidate.user_id)
      )
      .map((candidate: any) => ({
        user_id: candidate.user_id,
        name: candidate.name,
        profile_image: candidate.profile_image,
      }));
  };

  const employerId = jobDetails?.data?.employer || undefined;
  const companyId = jobDetails?.data?.company || undefined;

  // Function to render tab content
  const renderTabContent = () => {
    if (!selectedTab) return null;
    
    if (selectedTab === "inviteCandidates") {
      return (
        <>
          <div className="flex mb-6 space-x-4 mt-8">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <MatchingCandidatesCard />
                <ResumeUploadBanner onClick={handleOpenResumeModal} />
              </>
            )}
          </div>

          <SearchAndFilters
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            selectedSource={selectedSource}
            handleSourceChange={handleSourceChange}
            sortBy={sortBy}
            handleSortByChange={handleSortByChange}
          />

          <FilterPanel
            isOpen={filterOpen}
            onReset={handleFilterReset}
            onApply={handleFilterApply}
          />

          {isLoading ? (
            <CandidateListSkeleton />
          ) : (
            <CandidateList
              isLoading={isLoading}
              error={!!error}
              currentCandidates={currentCandidates}
              filteredCandidates={filteredCandidates}
              selectAll={selectAll}
              selectedCandidates={selectedCandidates}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              indexOfFirstCandidate={indexOfFirstCandidate}
              indexOfLastCandidate={indexOfLastCandidate}
              handleSelectAllCurrentPage={handleSelectAllCurrentPage}
              handleSelectAllCandidates={handleSelectAllCandidates}
              handleSelectCandidate={handleSelectCandidate}
              handleSendInterviewInvite={handleSendInterviewInvite}
              handlePageChange={handlePageChange}
              setRowsPerPage={setRowsPerPage}
            />
          )}
        </>
      );
    } else if (selectedTab === "interviews") {
      return (
        <div className="mt-8">
          {isLoadingInterviews ? (
            <CandidateListSkeleton />
          ) : (
            <InterviewCandidatesView
              jobId={job_id}
              onCandidateCountChange={handleCandidateCountChange}
              initialCount={interviewCount}
            />
          )}
        </div>
      );
    } else if (selectedTab === "shortlistedCandidates") {
      return (
        <div className="mt-8 p-12 bg-white rounded-lg border border-[#d6d7d9] text-center">
          <p className="text-[#68696b]">
            Shortlisted Candidates view is coming soon
          </p>
        </div>
      );
    } else if (selectedTab === "sentInvitations") {
      return (
        <div className="mt-8 p-12 bg-white rounded-lg border border-[#d6d7d9] text-center">
          <p className="text-[#68696b]">
            Sent Invitations view is coming soon
          </p>
        </div>
      );
    }
    
    return null;
  };

  // Full page skeleton loader while everything initializes
  if (isLoadingJob || isLoadingInterviews || !pageReady || !selectedTab) {
    return (
      <div className="bg-[#F5F5F5] h-screen overflow-y-auto font-sans">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Breadcrumb skeleton */}
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
          
          {/* Job details skeleton */}
          <JobDetailsSkeleton />
          
          <div className="flex gap-6">
            <div className="flex-1 space-y-8">
              
              
              {/* Main content skeleton */}
              <CandidateListSkeleton />
            </div>
            
            {/* Right section skeleton */}
            <div className="w-[350px] mt-8 space-y-3.5 sticky top-5 h-fit">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#F5F5F5] h-screen overflow-y-auto font-sans"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <BreadcrumbNav jobTitle={jobDetails?.data.title} />

        <JobDetailsCard
          jobDetails={
            jobDetails?.data
              ? {
                  ...jobDetails.data,
                  company:
                    typeof jobDetails.data.company === "string"
                      ? { _id: jobDetails.data.company, name: "" }
                      : jobDetails.data.company,
                }
              : undefined
          }
          onViewDetails={() => {
            navigate(`/employer/jobs/${job_id}/details`);
          }}
        />

        <div className="flex gap-6">
          <div className="flex-1 space-y-8">
            <div className="sticky top-0 z-10 bg-[#F5F5F5]">
              {/* Only render TabNavigation when everything is ready */}
              <TabNavigation
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                interviewCount={interviewCount}
              />
              
              {/* Render tab content */}
              {renderTabContent()}
            </div>
          </div>

          {/* Right section */}
          <div className="w-[350px] mt-8 space-y-3.5 sticky top-5 h-fit">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <FullInterviewsCard jobId={job_id} />
                <ScreeningInterviewsCard jobId={job_id} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ResumeUploadModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          jobId={job_id}
          employerId={
            typeof employerId === "string" ? employerId : employerId?._id
          }
          companyId={typeof companyId === "string" ? companyId : companyId?._id}
          onResumesProcessed={handleResumesProcessed}
          onSelectCandidates={handleSelectCandidates}
        />
      )}

      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={handleCloseInterviewModal}
        selectedCandidatesCount={selectedCandidates.length}
        selectedCandidates={getSelectedCandidateDetails()}
        jobId={job_id}
      />
    </div>
  );
}