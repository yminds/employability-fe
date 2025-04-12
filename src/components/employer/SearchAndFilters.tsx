import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndFiltersProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSource?: string;
  handleSourceChange?: (source: string) => void;
  sortBy?: string;
  handleSortByChange?: (sortBy: string) => void;
  sourceCounts?: {
    employability: number;
    uploaded: number;
    job: number;
    applicants: number;
    all?: number;
  };
  isLoadingCandidates?: boolean; 
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  handleSearchChange,
  selectedSource = "all",
  handleSourceChange = () => {},
  sortBy = "matching",
  handleSortByChange = () => {},
  sourceCounts = { employability: 0, uploaded: 0, job: 0, applicants: 0 },
  isLoadingCandidates = false
}) => {
  // Map source values to display texts (without counts)
  const getSourceDisplay = (source: string) => {
    switch(source) {
      case "all": return "All Candidates";
      case "employability": return "Employability Pool";
      case "uploaded": return "All Uploaded Resumes";
      case "job": return "Resumes For this Job";
      case "applicants": return "Job Applicants";
      default: return source;
    }
  };


  
  return (
    <div className="flex gap-4 mb-5 text-body2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909091] w-4 h-4" />
        <Input
          placeholder="Search"
          className="pl-10 border-[#d6d7d9] bg-white h-12"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="w-[280px]">
        <Select value={selectedSource} onValueChange={handleSourceChange} disabled={isLoadingCandidates}>
          <SelectTrigger className="border-[#d6d7d9] bg-white h-12">
            <div className="flex items-center gap-2">
              <span className="text-[#909091]">Source :</span>
              <SelectValue>{getSourceDisplay(selectedSource)}</SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="employability">Employability Pool ({sourceCounts.employability})</SelectItem>
            <SelectItem value="uploaded">All Uploaded Resumes ({sourceCounts.uploaded})</SelectItem>
            <SelectItem value="job">Resumes For this Job ({sourceCounts.job})</SelectItem>
            <SelectItem value="applicants">Job Applicants ({sourceCounts.applicants})</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-64">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="border-[#d6d7d9] bg-white h-12">
            <div className="flex items-center gap-2">
              <span className="text-[#909091]">Sort by :</span>
              <SelectValue placeholder="Select sort" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matching">Matching Score</SelectItem>
            <SelectItem value="employability">EmployabilityScore</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchAndFilters;