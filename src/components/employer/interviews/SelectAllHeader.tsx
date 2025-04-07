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
    <div className="px-5 py-3 bg-[#F0F3F7] rounded-t-lg border-b border-[#d6d7d9]">
      <div className="flex items-center">
        <Checkbox
          id="selectAll"
          className="mr-2 h-4 w-4
            data-[state=checked]:bg-[#001630] 
            data-[state=checked]:border-[#001630]
            data-[state=checked]:text-white
            data-[state=unchecked]:bg-white
              data-[state=unchecked]:border-2
            data-[state=unchecked]:border-[#68696B]"
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
