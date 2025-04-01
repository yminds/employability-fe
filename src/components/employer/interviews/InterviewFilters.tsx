// components/InterviewFilters.tsx
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType, SubmissionStatus, SortOption } from "../InterviewCandidatesView";

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
  return (
    <div className="flex flex-wrap gap-2">
      {/* Search */}
      <div className="relative w-[200px]">
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
          className={`flex items-center space-x-2 px-4 py-2 border rounded-md ${
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
          className={`flex items-center space-x-2 px-4 py-2 border rounded-md ${
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
        onValueChange={(value) => setSubmissionStatus(value as SubmissionStatus)}
      >
        <SelectTrigger className="w-[180px] border rounded-md bg-white">
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

      {/* Sort by dropdown */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-[#68696b]">Sort by :</span>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[200px] border rounded-md bg-white">
            <SelectValue placeholder="Sort by">
              {sortBy === "rating_high_to_low" && "Rating (High to Low)"}
              {sortBy === "rating_low_to_high" && "Rating (Low to High)"}
              {sortBy === "recent_submissions" && "Recent Submissions"}
              {sortBy === "past_submissions" && "Past Submissions"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent_submissions">
              Recent Submissions
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
  );
};