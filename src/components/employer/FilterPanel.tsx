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
  sourceCounts?: {
    employability: number;
    uploaded: number;
    job: number;
    applicants: number;
    all?: number;
  };
  isLoadingCandidates?: boolean; // New prop to track loading state
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onReset,
  onApply,
  selectedSource,
  onSourceChange,
  sourceCounts = { employability: 0, uploaded: 0, job: 0, applicants: 0 },
  isLoadingCandidates = false
}) => {
  if (!isOpen) return null;
  
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

  // Create a loading skeleton for the counts
  const LoadingSkeleton = () => (
    <div className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
  );

  return (
    <div className="bg-white rounded-lg border border-[#d6d7d9] p-4 mb-4 text-body2">
      <div>
        <label className="text-sm font-medium block mb-2">Select sources</label>
        <Select 
          value={selectedSource} 
          onValueChange={(value) => onSourceChange(value)}
          disabled={isLoadingCandidates}
        >
          <SelectTrigger className="border-[#d6d7d9] bg-white">
            <SelectValue>
              {getSourceDisplay(selectedSource)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="employability">
              Employability Pool ({isLoadingCandidates && selectedSource !== "employability" ? <LoadingSkeleton /> : sourceCounts.employability})
            </SelectItem>
            <SelectItem value="uploaded">
              All Uploaded Resumes ({isLoadingCandidates && selectedSource !== "uploaded" ? <LoadingSkeleton /> : sourceCounts.uploaded})
            </SelectItem>
            <SelectItem value="job">
              Resumes For this Job ({isLoadingCandidates && selectedSource !== "job" ? <LoadingSkeleton /> : sourceCounts.job})
            </SelectItem>
            <SelectItem value="applicants">
              Job Applicants ({isLoadingCandidates && selectedSource !== "applicants" ? <LoadingSkeleton /> : sourceCounts.applicants})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          className="mr-2" 
          onClick={onReset}
          disabled={isLoadingCandidates}
        >
          Reset
        </Button>
        <Button
          className="bg-[#001630] hover:bg-[#001630]/90 text-white"
          onClick={onApply}
          disabled={isLoadingCandidates}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;