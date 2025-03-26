import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  handleSearchChange,
  filterOpen,
  setFilterOpen,
}) => {
  return (
    <div className="flex gap-4 my-6 text-body2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909091] w-4 h-4" />
        <Input
          placeholder="Search by name, skills, or location"
          className="pl-10 border-[#d6d7d9] bg-white h-12"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <Button
        variant="outline"
        className="border-[#d6d7d9] bg-white h-12"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Button>
      <div className="w-64">
        <Select defaultValue="matching">
          <SelectTrigger className="border-[#d6d7d9] bg-white h-12">
            <div className="flex items-center gap-2">
              <span className="text-[#909091]">Sort by :</span>
              <SelectValue placeholder="Select sort" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matching">Matching Score</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchAndFilters;
