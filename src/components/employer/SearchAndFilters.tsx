// SearchAndFilters.tsx
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
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  handleSearchChange,
  selectedSource = "all",
  handleSourceChange = () => {},
  sortBy = "matching",
  handleSortByChange = () => {},
}) => {
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
      <div className="w-64">
        <Select value={selectedSource} onValueChange={handleSourceChange}>
          <SelectTrigger className="border-[#d6d7d9] bg-white h-12">
            <div className="flex items-center gap-2">
              <span className="text-[#909091]">Source :</span>
              <SelectValue placeholder="All Candidates" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="employability">Employability Pool</SelectItem>
            <SelectItem value="uploaded">All Uploaded Resumes</SelectItem>
            <SelectItem value="job">Resumes For this Job</SelectItem>
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