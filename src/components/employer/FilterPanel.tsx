import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  isOpen: boolean;
  onReset: () => void;
  onApply: () => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onReset,
  onApply,
  selectedSource,
  onSourceChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg border border-[#d6d7d9] p-4 mb-4 text-body2">
      <div>
        <label className="text-sm font-medium block mb-2">Select sources</label>
        <Select 
          value={selectedSource} 
          onValueChange={(value) => onSourceChange(value)}
        >
          <SelectTrigger className="border-[#d6d7d9] bg-white">
            <SelectValue placeholder="All Candidates">
              {selectedSource === "all" && "All Candidates"}
              {selectedSource === "employability" && "Employability Pool"}
              {selectedSource === "uploaded" && "All Uploaded Resumes"}
              {selectedSource === "job" && "Resumes For this Job"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="employability">Employability Pool</SelectItem>
            <SelectItem value="uploaded">All Uploaded Resumes</SelectItem>
            <SelectItem value="job">Resumes For this Job</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2" onClick={onReset}>
          Reset
        </Button>
        <Button
          className="bg-[#001630] hover:bg-[#001630]/90 text-white"
          onClick={onApply}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;