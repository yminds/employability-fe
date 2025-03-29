// components/SelectAllHeader.tsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { InterviewCandidate } from "@/api/InterviewInvitation";

interface SelectAllHeaderProps {
  selectedCandidates: string[];
  currentCandidates: InterviewCandidate[];
  handleSelectAll: (checked: boolean) => void;
}

export const SelectAllHeader: React.FC<SelectAllHeaderProps> = ({
  selectedCandidates,
  currentCandidates,
  handleSelectAll,
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center">
        <Checkbox
          id="selectAll"
          className="mr-2 rounded border-[#d6d7d9]"
          checked={
            selectedCandidates.length === currentCandidates.length &&
            currentCandidates.length > 0
          }
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="selectAll" className="text-sm text-[#68696b]">
          Select All
        </label>
      </div>
    </div>
  );
};