import type React from "react";
import CandidateListHeader from "./CandidateListHeader";
import CandidateItem from "./CandidateItem";
import Pagination from "./Pagination";

interface CandidateListProps {
  isLoading: boolean;
  error: boolean;
  currentCandidates: any[];
  filteredCandidates: any[];
  selectAll: boolean;
  selectedCandidates: string[];
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  indexOfFirstCandidate: number;
  indexOfLastCandidate: number;
  handleSelectAllCurrentPage: (checked: boolean) => void;
  handleSelectAllCandidates: () => void;
  handleSelectCandidate: (id: string, checked: boolean) => void;
  handleSendInterviewInvite: () => void;
  handlePageChange: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  isLoading,
  error,
  currentCandidates,
  filteredCandidates,
  selectAll,
  selectedCandidates,
  currentPage,
  totalPages,
  rowsPerPage,
  handleSelectAllCurrentPage,
  handleSelectAllCandidates,
  handleSelectCandidate,
  handleSendInterviewInvite,
  handlePageChange,
  setRowsPerPage,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#d6d7d9] overflow-hidden flex flex-col h-full">
      {/* Header with selection controls */}
      <CandidateListHeader
        selectAll={selectAll}
        selectedCandidatesCount={selectedCandidates.length}
        totalCandidatesCount={filteredCandidates.length}
        onSelectAllCurrentPage={handleSelectAllCurrentPage}
        onSelectAllCandidates={handleSelectAllCandidates}
        onSendInterviewInvite={handleSendInterviewInvite}
      />

      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-t-[#001630] border-r-[#001630] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#666666]">Loading candidates...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-red-500 font-medium">
                Failed to load candidates
              </p>
              <p className="text-[#666666] mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && currentCandidates.length === 0 && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-[#666666] font-medium">
                No matching candidates found
              </p>
              <p className="text-[#909091] mt-2">
                Try adjusting your filters or skills requirements
              </p>
            </div>
          </div>
        )}

        {/* Candidate rows */}
        {!isLoading &&
          !error &&
          currentCandidates.map((candidate: any) => {
            const isChecked = selectedCandidates.includes(candidate.user_id);
            return (
              <CandidateItem
                key={candidate.user_id}
                candidate={candidate}
                isChecked={isChecked}
                onCheckChange={handleSelectCandidate}
              />
            );
          })}
      </div>

      {/* Pagination - fixed at the bottom */}
      {!isLoading && !error && filteredCandidates.length > 0 && (
        <div className="sticky bottom-0 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={(value: any) => {
              setRowsPerPage(value);
              handlePageChange(1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateList;
