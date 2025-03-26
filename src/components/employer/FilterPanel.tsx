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
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onReset,
  onApply,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg border border-[#d6d7d9] p-4 mb-4 text-body2">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Experience</label>
          <Select defaultValue="any">
            <SelectTrigger className="border-[#d6d7d9] bg-white">
              <SelectValue placeholder="Any experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any experience</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Location</label>
          <Select defaultValue="any">
            <SelectTrigger className="border-[#d6d7d9] bg-white">
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any location</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Skill Rating</label>
          <Select defaultValue="any">
            <SelectTrigger className="border-[#d6d7d9] bg-white">
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="8">8+ Rating</SelectItem>
              <SelectItem value="7">7+ Rating</SelectItem>
              <SelectItem value="6">6+ Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
