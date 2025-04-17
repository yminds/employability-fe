import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
import SuccessModal from "./SuccessModal";

import { useGetInterviewCandidatesQuery } from "../../api/InterviewInvitation";
import ShortlistedCandidatesView from "./ShortListedCandidatesView";

interface JobListingPageProps {
  job_id: string;
}

// Skeleton components - remain the same...
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

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fullInterviewsRefetchRef = useRef<(() => void) | null>(null);
  const screeningInterviewsRefetchRef = useRef<(() => void) | null>(null);

  const handleFullInterviewsRefetch = useCallback((refetch: () => void) => {
    fullInterviewsRefetchRef.current = refetch;
  }, []);

  const handleScreeningInterviewsRefetch = useCallback(
    (refetch: () => void) => {
      screeningInterviewsRefetchRef.current = refetch;
    },
    []
  );

  const refreshInterviewStats = useCallback(() => {
    // Refresh both cards
    if (fullInterviewsRefetchRef.current) {
      fullInterviewsRefetchRef.current();
    }
    if (screeningInterviewsRefetchRef.current) {
      screeningInterviewsRefetchRef.current();
    }

    setSelectedCandidates([]);
    setSelectAll(false);

    if (interviewCandidatesResponse) {
      const { refetch: refetchInterviewCandidates } =
        useGetInterviewCandidatesQuery(
          {
            jobId: job_id,
            filterStatus: [],
            interviewScore: 0,
          },
          { skip: !job_id }
        );
      refetchInterviewCandidates();
    }
  }, [job_id]);

  // Other state variables
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filterOpen, setFilterOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("matching");
  const [sourceCountsCache, setSourceCountsCache] = useState<{
    employability: number;
    uploaded: number;
    job: number;
    applicants: number;
    all?: number;
  }>({ employability: 0, uploaded: 0, job: 0, applicants: 0 });
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

  // Background processing state
  const [isBackgroundProcessing, setIsBackgroundProcessing] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingCountRef = useRef(0);
  const maxPollingAttempts = 30; // 5 seconds x 30 = 150 seconds (2.5 minutes) max polling time
  const previousCompletedCountRef = useRef<number | null>(null);

  const handleCandidateCountChange = (count: number) => {
    setInterviewCount(count);
  };

  // Fetch job details
  const { data: jobDetails, isLoading: isLoadingJob } =
    useGetJobDetailsQuery(job_id);

  // Fetch matching candidates
  const {
    data: matchingCandidatesResponse,
    isLoading,
    error,
    refetch: refetchCandidates,
    isSuccess: isCandidateSuccess,
  } = useGetMatchingCandidatesQuery({
    job_id,
    source: selectedSource,
    sortBy,
  });

  const {
    data: interviewCandidatesResponse,
    isLoading: isLoadingInterviews,
    isSuccess: isInterviewsSuccess,
  } = useGetInterviewCandidatesQuery(
    {
      jobId: job_id,
      filterStatus: [],
      interviewScore: 0,
    },
    {
      skip: !job_id,
    }
  );

  const calculateSourceCounts = () => {
    if (!matchingCandidatesResponse?.data) {
      return { employability: 0, uploaded: 0, job: 0, applicants: 0 };
    }

    const allCandidates = matchingCandidatesResponse.data;

    const counts = {
      employability: allCandidates.filter(
        (candidate: any) => candidate.source === "employability"
      ).length,
      uploaded: allCandidates.filter(
        (candidate: any) => candidate.source === "uploaded"
      ).length,
      job: allCandidates.filter((candidate: any) => candidate.source === "job")
        .length,
      applicants: allCandidates.filter(
        (candidate: any) => candidate.source === "applicants"
      ).length,
    };

    return counts;
  };

  // Function to check if there's background processing happening
  const checkForBackgroundProcessing = useCallback(() => {
    const savedState = sessionStorage.getItem("resumeUploadState");
    if (savedState && isCandidateSuccess) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.processingInBackground) {
          setIsBackgroundProcessing(true);
          startPolling();
        }
      } catch (e) {
        console.error("Failed to parse saved upload state");
        sessionStorage.removeItem("resumeUploadState");
      }
    }
  }, []);

  // Cache source counts when we get "all" data or update specific source count
useEffect(() => {
  if (!matchingCandidatesResponse?.data) return;
  
  if (selectedSource === "all") {
    // When we have "all" data, update the complete cache
    const allCandidates = matchingCandidatesResponse.data;
    
    setSourceCountsCache({
      employability: allCandidates.filter((candidate: any) => 
        candidate.source === "employability").length,
      uploaded: allCandidates.filter((candidate: any) => 
        candidate.source === "uploaded").length,
      job: allCandidates.filter((candidate: any) => 
        candidate.source === "job").length,
      applicants: allCandidates.filter((candidate: any) => 
        candidate.source === "applicants").length,
      all: allCandidates.length
    });
  } else {
    // When a specific filter is active, update just that count
    const filteredCount = matchingCandidatesResponse.data.length;
    
    setSourceCountsCache(prev => ({
      ...prev,
      [selectedSource]: filteredCount
    }));
  }
}, [matchingCandidatesResponse?.data, selectedSource]);


const sourceCounts = useMemo(() => {
  
  if (!matchingCandidatesResponse?.data) {
    return sourceCountsCache;
  }

  if (selectedSource === "all") {
    return calculateSourceCounts();
  }
  
  return {
    ...sourceCountsCache,
    [selectedSource]: matchingCandidatesResponse.data.length
  };
}, [matchingCandidatesResponse?.data, selectedSource, sourceCountsCache]);

  // Start polling for updates when background processing is active
  const startPolling = useCallback(() => {
    // Reset polling counter
    pollingCountRef.current = 0;
    previousCompletedCountRef.current = null;

    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Set up a new polling interval
    const interval = setInterval(() => {
      pollingCountRef.current += 1;

      if (pollingCountRef.current > maxPollingAttempts) {
        console.log("Max polling attempts reached. Stopping polling.");
        stopPolling();
        return;
      }

      if (isCandidateSuccess) {
        refetchCandidates().then((response) => {
          const currentData = response.data?.data || [];
          const currentJobResumes = currentData.filter(
            (candidate: any) => candidate.source === "job"
          ).length;

          if (previousCompletedCountRef.current === null) {
            previousCompletedCountRef.current = currentJobResumes;
            return;
          }

          if (currentJobResumes === previousCompletedCountRef.current) {
            if (pollingCountRef.current % 3 === 0) {
              console.log(
                "Resume count stable for 15 seconds. Processing likely complete."
              );
              stopPolling();
              return;
            }
          } else {
            previousCompletedCountRef.current = currentJobResumes;

            pollingCountRef.current = 0;
          }
        });
      }

      // Also check if the processing flag has been cleared
      const savedState = sessionStorage.getItem("resumeUploadState");
      if (!savedState) {
        console.log("Upload state removed. Stopping polling.");
        stopPolling();
        return;
      }

      try {
        const parsedState = JSON.parse(savedState);
        if (!parsedState.processingInBackground) {
          console.log("Processing no longer in background. Stopping polling.");
          stopPolling();
        }
      } catch (e) {
        console.error("Failed to parse saved upload state");
        stopPolling();
      }
    }, 5000); // Poll every 5 seconds

    pollingIntervalRef.current = interval;
  }, [refetchCandidates, isCandidateSuccess]);

  // Stop polling for updates
  const stopPolling = useCallback(
    (isUnmounting = false) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setIsBackgroundProcessing(false);

      // Remove the upload state from session storage to prevent restarting polling
      sessionStorage.removeItem("resumeUploadState");

      // Only refetch if not unmounting and the query has been initialized
      if (!isUnmounting && isCandidateSuccess) {
        refetchCandidates();
      }

      console.log("Polling stopped");
    },
    [refetchCandidates, isCandidateSuccess]
  );

  useEffect(() => {
    if (isCandidateSuccess) {
      checkForBackgroundProcessing();
    }

    // Cleanup polling interval when component unmounts
    return () => {
      stopPolling(true); // Pass true to indicate unmounting
    };
  }, [isCandidateSuccess, checkForBackgroundProcessing, stopPolling]);

  // Calculate interview count and determine initial tab when data is available
  useEffect(() => {
    // Skip if page is already ready or data is still loading
    if (pageReady || isLoadingInterviews || !isInterviewsSuccess) {
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


    setInterviewCount(count);


    const initialTab = count > 0 ? "interviews" : "inviteCandidates";
    setSelectedTab(initialTab);

    // Mark page as ready only after a delay to ensure everything is set
    setTimeout(() => {
      setPageReady(true);
    }, 100); // Short delay to ensure React has time to process state updates
  }, [
    interviewCandidatesResponse,
    isLoadingInterviews,
    isInterviewsSuccess,
    pageReady,
  ]);

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

  // Other handlers remain the same...
  const handleSelectAllCurrentPage = (checked: boolean) => {
    if (checked) {
      const currentIds = currentCandidates.map(
        (candidate: any) => candidate.user_id
      );
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
      const allIds = filteredCandidates.map(
        (candidate: any) => candidate.user_id
      );
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
    if (source === selectedSource) return;
    
    setIsLoadingCandidates(true);
    setSelectedSource(source);
    setCurrentPage(1);
    

    if (isCandidateSuccess) {
      refetchCandidates().finally(() => {
        setIsLoadingCandidates(false);
      });
    } else {

      setTimeout(() => setIsLoadingCandidates(false), 500);
    }
  };

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy);
    setCurrentPage(1);
  };

  const handleSendInterviewInvite = () => {
    if (selectedCandidates.length === 0) return;
    setIsInterviewModalOpen(true);
  };

  // Updated to receive success message from interview modal
  const handleCloseInterviewModal = (successMessage?: string) => {
    setIsInterviewModalOpen(false);
    
    if (successMessage) {
      setSuccessMessage(successMessage);
      // Show success modal after a brief delay to ensure interview modal is gone
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 100);
    }
    
    setSelectedCandidates([]);
    setSelectAll(false);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    refreshInterviewStats();
  };

  const handleOpenResumeModal = () => {
    setIsModalOpen(true);
  };

  // Handler for the Continue button in ResumeUploadModal
  const handleModalContinue = (sourceFilter: string) => {
    // Switch to inviteCandidates tab
    setSelectedTab("inviteCandidates");

    setSelectedSource(sourceFilter);

    setIsModalOpen(false);

    if (isCandidateSuccess) {
      refetchCandidates();
    }

    const savedState = sessionStorage.getItem("resumeUploadState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);

        if (parsedState.processingInBackground === true) {
          setIsBackgroundProcessing(true);
          startPolling();
        } else {
          setIsBackgroundProcessing(false);
          stopPolling();
        }
      } catch (e) {
        console.error("Failed to parse saved upload state");
        sessionStorage.removeItem("resumeUploadState");
        setIsBackgroundProcessing(false);
      }
    } else {
      // No saved state means no background processing
      setIsBackgroundProcessing(false);
      stopPolling();
    }
  };

  const handleResumesProcessed = (resumes: ProcessedResume[]) => {
    setProcessedResumes(resumes);
    if (isCandidateSuccess) {
      refetchCandidates();
    }

    // If background processing was active, stop polling
    if (isBackgroundProcessing) {
      stopPolling();
    }
  };

  const handleSelectCandidates = (candidateIds: string[]) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set([...prev, ...candidateIds]);
      return Array.from(newSet);
    });
  };

  const handleFilterReset = () => {
    setSelectedSource("all");
    setSearchTerm("");
    setSortBy("matching");
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

          {/* Background processing notification */}
          {isBackgroundProcessing && selectedSource === "job" && (
            <div className="bg-blue-50 p-3 rounded-lg flex items-center mb-4">
              <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
              <p className="text-blue-700 text-sm">
                Resumes are still being processed in the background. The
                candidate list will update automatically.
              </p>
            </div>
          )}

          <div className="sticky top-[50px] z-10 bg-white p-6 rounded-[12px]">
            <SearchAndFilters
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              selectedSource={selectedSource}
              handleSourceChange={handleSourceChange}
              sortBy={sortBy}
              handleSortByChange={handleSortByChange}
              sourceCounts={sourceCounts}
              isLoadingCandidates={isLoadingCandidates}
            />

            <FilterPanel
              isOpen={filterOpen}
              onReset={handleFilterReset}
              onApply={handleFilterApply}
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
              sourceCounts={sourceCounts}
              isLoadingCandidates={isLoadingCandidates}
            />

            <div className="h-[calc(100vh-235px)]">
              {isLoading || isLoadingCandidates ? (
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
            </div>
          </div>
        </>
      );
    } else if (selectedTab === "interviews") {
      return (
        <div className="mt-8">
          {isLoadingInterviews ? (
            <CandidateListSkeleton />
          ) : (
            <div className="h-[calc(100vh-125px)]">
              <InterviewCandidatesView
                jobId={job_id}
                onCandidateCountChange={handleCandidateCountChange}
                initialCount={interviewCount}
              />
            </div>
          )}
        </div>
      );
    } else if (selectedTab === "shortlistedCandidates") {
      return (
        <div className="mt-8">
          <ShortlistedCandidatesView jobId={job_id} />
        </div>
      );
    } else if (selectedTab === "sentInvitations") {
      return (
        <div className="mt-8 p-12 bg-white rounded-lg border border-[#d6d7d9] text-center">
          <p className="text-[#68696b]">Sent Invitations view is coming soon</p>
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

          <JobDetailsSkeleton />

          <div className="flex gap-6">
            <div className="flex-1 space-y-8">
              <CandidateListSkeleton />
            </div>

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
      <div className="max-w-[1600px] mx-auto px-4 py-6">
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
            navigate(`/employer/jobs/edit/${job_id}`);
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
            </div>
            {/* Render tab content */}
            {renderTabContent()}
          </div>

          {/* Right section */}
          <div className="mt-8 space-y-3.5 sticky top-5 h-fit">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <div className="w-[260px] space-y-3.5">
                <FullInterviewsCard
                  jobId={job_id}
                  onRefetchAvailable={handleFullInterviewsRefetch}
                />
                <ScreeningInterviewsCard
                  jobId={job_id}
                  onRefetchAvailable={handleScreeningInterviewsRefetch}
                />
              </div>
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
          onContinue={handleModalContinue}
        />
      )}

      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={handleCloseInterviewModal}
        selectedCandidatesCount={selectedCandidates.length}
        selectedCandidates={getSelectedCandidateDetails()}
        jobId={job_id}
        onSuccess={refreshInterviewStats}
      />

      {/* Success Modal - moved to parent component */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={successMessage}
        subtitle="The candidates will receive an email with instructions to complete their interview."
      />
    </div>
  );
}