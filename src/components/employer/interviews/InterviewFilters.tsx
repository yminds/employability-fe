// components/InterviewFilters.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
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
  InterviewType,
  SubmissionStatus,
  SortOption,
} from "../InterviewCandidatesView";
import { FilterModal, type FilterValues } from "./FilterModal";
import Filter from "@/assets/employer/filter.svg";
import { Button } from "@/components/ui/button";

interface InterviewFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  interviewType: InterviewType;
  setInterviewType: (value: InterviewType) => void;
  submissionStatus: SubmissionStatus;
  setSubmissionStatus: (value: SubmissionStatus) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

export const InterviewFilters: React.FC<InterviewFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  interviewType,
  setInterviewType,
  submissionStatus,
  setSubmissionStatus,
  sortBy,
  setSortBy,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleApplyFilters = (filters: FilterValues) => {
    console.log("Applied filters:", filters);
  };
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative w-[180px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#68696b] w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2d96ff]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Interview Type Radio Buttons */}
        <RadioGroup
          value={interviewType}
          onValueChange={(value) => setInterviewType(value as InterviewType)}
          className="flex gap-2"
        >
          {/* Full Interview Option */}
          <div
            className={`flex items-center gap-2 px-3 py-2 border rounded-md ${
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
            className={`flex items-center gap-2 px-3 py-2 border rounded-md ${
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
          onValueChange={(value) =>
            setSubmissionStatus(value as SubmissionStatus)
          }
        >
          <SelectTrigger className="w-[150px] border rounded-md bg-white">
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

        {/* Filter Button */}
        <Button
          className="flex items-center justify-center border px-3.5 py-2 rounded-md bg-white hover:bg-[#f0f3f7] transition-colors"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <img
            src={Filter || "/placeholder.svg"}
            alt="Filter"
            className="w-[17.5px] h-[15.5px]"
          />
        </Button>

        {/* Sort by dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[240px] border rounded-md bg-white">
              <div className="flex gap-1">
                <span className="text-sm text-[#68696b]">Sort by :</span>
                <SelectValue placeholder="Sort by">
                  {sortBy === "rating_high_to_low" && "Rating (High to Low)"}
                  {sortBy === "rating_low_to_high" && "Rating (Low to High)"}
                  {sortBy === "recent_submissions" && "Recent Submissions"}
                  {sortBy === "past_submissions" && "Past Submissions"}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent_submissions">
                Recent Submissionss
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
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
};
