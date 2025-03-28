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
// import StatsCards from "./StatsCard";
import ResumeUploadBanner from "./ResumeUploadBanner";
import JobDetailsCard from "./JobDetailsCard";
import ResumeUploadModal, { ProcessedResume } from "./UploadResumesModal";
import InterviewModal from "./InterviewInvitationModal";
// Import the new InterviewCandidatesView component
import InterviewCandidatesView from "./InterviewCandidatesView";
import FullInterviewsCard from "./FullInterviewsCard";
import ScreeningInterviewsCard from "./ScreeningInterviewsCard";
import MatchingCandidatesCard from "./MatchingCandidatesCard";

import { useGetInterviewCandidatesQuery } from "../../api/InterviewInvitation";

interface JobListingPageProps {
  job_id: string;
}

export default function JobListingPage({ job_id }: JobListingPageProps) {
  const navigate = useNavigate();

  // Changed default tab to "inviteCandidates" to match new naming
  const [selectedTab, setSelectedTab] = useState("inviteCandidates");
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
  const [interviewCount, setInterviewCount] = useState(0);


  const handleCandidateCountChange = (count: number) => {
    setInterviewCount(count);
  };

  // Fetch job details
  const {
    data: jobDetails,
    isLoading: isLoadingJob,
    error: jobError,
  } = useGetJobDetailsQuery(job_id);

  console.log("Selected Candidates", selectedCandidates);

  // Fetch matching candidates
  const {
    data: matchingCandidatesResponse,
    isLoading,
    error,
    refetch: refetchCandidates,
  } = useGetMatchingCandidatesQuery({ job_id, source: selectedSource, sortBy });



const {
  data: interviewCandidatesResponse,
  isLoading: isLoadingInterviews
} = useGetInterviewCandidatesQuery({
  jobId: job_id,
}, {
  skip: !job_id
});

useEffect(()=>{
  if(interviewCandidatesResponse?.data){
    const filteredCandidates = interviewCandidatesResponse.data.filter((candidate: any)=>
      candidate.status === "accepted" || candidate.status === "pending"
    );
    setInterviewCount(filteredCandidates.length);
  }
},[interviewCandidatesResponse])



  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setCurrentPage(1);
  };

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy);
    setCurrentPage(1);
  };

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
      // If current page is now invalid, reset to first page
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

  // Select/deselect all candidates on current page
  const handleSelectAllCurrentPage = (checked: boolean) => {
    if (checked) {
      // Add all current page candidates
      const currentIds = currentCandidates.map(
        (candidate: any) => candidate.user_id
      );
      setSelectedCandidates((prevSelected) => {
        const newSet = new Set([...prevSelected, ...currentIds]);
        return Array.from(newSet);
      });
    } else {
      // Remove all current page candidates
      const currentIds = currentCandidates.map((c: any) => c.user_id);
      setSelectedCandidates((prevSelected) => {
        return prevSelected.filter((id) => !currentIds.includes(id));
      });
    }
  };

  // Toggle selection of *all candidates* across all pages
  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      // Already all selected => clear them
      setSelectedCandidates([]);
    } else {
      // Select all candidates across all pages
      const allIds = filteredCandidates.map(
        (candidate: any) => candidate.user_id
      );
      setSelectedCandidates(allIds);
    }
  };

  // Toggle selection for a single candidate
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

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Send interview invites for selected candidates - Updated to open modal
  const handleSendInterviewInvite = () => {
    if (selectedCandidates.length === 0) return;

    // Open the interview modal instead of showing an alert
    setIsInterviewModalOpen(true);

    // Grab details for the selected IDs (keep for future reference)
    const selectedCandidateDetails = allCandidates.filter((candidate: any) =>
      selectedCandidates.includes(candidate.user_id)
    );

    // Original console log
    console.log("Sending interview invites to:", selectedCandidateDetails);
  };

  // Handler to close the interview modal
  const handleCloseInterviewModal = () => {
    setIsInterviewModalOpen(false);
  };

  // Open the resume upload modal
  const handleOpenResumeModal = () => {
    setIsModalOpen(true);
  };


  const handleResumesProcessed = (resumes: ProcessedResume[]) => {
    setProcessedResumes(resumes);
    refetchCandidates();
  };

  // When selecting candidates from the resume modal
  const handleSelectCandidates = (candidateIds: string[]) => {
    setSelectedCandidates((prev) => {
      const newSet = new Set([...prev, ...candidateIds]);
      return Array.from(newSet);
    });
  };

  // Handle filter reset
  const handleFilterReset = () => {
    // Reset filter values
    console.log("Resetting filters");
  };

  // Handle filter apply
  const handleFilterApply = () => {
    // Apply filters
    console.log("Applying filters");
    setFilterOpen(false);
  };

  console.log("selectedCandidates", selectedCandidates);
  console.log("allCandidates", allCandidates);

  const getSelectedCandidateDetails = () => {
    return allCandidates
      .filter((candidate) => selectedCandidates.includes(candidate.user_id))
      .map((candidate) => ({
        user_id: candidate.user_id,
        name: candidate.name,
        profile_image: candidate.profile_image,
      }));
  };

  const employerId = jobDetails?.data?.employer || undefined;
  const companyId = jobDetails?.data?.company || undefined;

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
            // Navigate to detailed job view
            navigate(`/employer/jobs/${job_id}/details`);
          }}
        />

        <div className="flex gap-6">
          {/* Left section - Candidate list */}
          <div className="flex-1 space-y-8">
            {/* Tabs - Pass the interview count to display in the tab */}
            <div className="sticky top-0 z-10 bg-[#F5F5F5]">
              <TabNavigation
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                interviewCount={interviewCount}
              />
            </div>

            <div className="flex mb-6 space-x-4">
              {/* Matching Candidate Card */}
              <MatchingCandidatesCard />

              {/* Upload resumes banner */}
              <ResumeUploadBanner onClick={handleOpenResumeModal} />
            </div>

            {/* Conditional rendering based on selected tab */}
            {selectedTab === "inviteCandidates" && (
              <>
                <SearchAndFilters
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                  selectedSource={selectedSource}
                  handleSourceChange={handleSourceChange}
                  sortBy={sortBy}
                  handleSortByChange={handleSortByChange}
                  // filterOpen={filterOpen}
                  // setFilterOpen={setFilterOpen}
                />

                <FilterPanel
                  isOpen={filterOpen}
                  onReset={handleFilterReset}
                  onApply={handleFilterApply}
                />

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
              </>
            )}

            {/* Render the Interviews tab content */}
            {selectedTab === "interviews" && (
              <InterviewCandidatesView jobId={job_id} 
              onCandidateCountChange={handleCandidateCountChange}
              initialCount={interviewCount}
               />
            )}

            {/* Placeholder for Shortlisted Candidates tab */}
            {selectedTab === "shortlistedCandidates" && (
              <div className="mt-4 p-12 bg-white rounded-lg border border-[#d6d7d9] text-center">
                <p className="text-[#68696b]">
                  Shortlisted Candidates view is coming soon
                </p>
              </div>
            )}

            {/* Placeholder for Sent Invitations tab */}
            {selectedTab === "sentInvitations" && (
              <div className="mt-4 p-12 bg-white rounded-lg border border-[#d6d7d9] text-center">
                <p className="text-[#68696b]">
                  Sent Invitations view is coming soon
                </p>
              </div>
            )}
          </div>

          {/* Right section - Stats and job details */}
          <div className="w-[350px] mt-8 space-y-3.5 sticky top-5 h-fit">

            {/* Full Interviews */}
            <FullInterviewsCard jobId={job_id} />

            {/* Screening Interviews */}
            <ScreeningInterviewsCard jobId={job_id} />
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
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

      {/* Interview Modal */}
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
