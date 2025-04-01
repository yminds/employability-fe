import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface CandidateListHeaderProps {
  selectAll: boolean;
  selectedCandidatesCount: number;
  totalCandidatesCount: number;
  onSelectAllCurrentPage: (checked: boolean) => void;
  onSelectAllCandidates: () => void;
  onSendInterviewInvite: () => void;
}

const CandidateListHeader: React.FC<CandidateListHeaderProps> = ({
  selectAll,
  selectedCandidatesCount,
  onSelectAllCurrentPage,
  onSendInterviewInvite,
}) => {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-[#F0F3F7]">
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={(checked) => onSelectAllCurrentPage(!!checked)}
            className="mr-2 h-4 w-4
              data-[state=checked]:bg-[#001630] 
              data-[state=checked]:border-[#001630]
              data-[state=checked]:text-white
              data-[state=unchecked]:bg-white
                data-[state=unchecked]:border-2
              data-[state=unchecked]:border-[#68696B]"
          />
          <label
            htmlFor="select-all"
            className="text-sm font-normal text-[#68696B]"
          >
            Select All
          </label>
        </div>

        {/* <Button
          variant="outline"
          size="sm"
          onClick={onSelectAllCandidates}
          className="text-xs"
        >
          {selectedCandidatesCount === totalCandidatesCount && totalCandidatesCount > 0
            ? "Deselect All Candidates"
            : "Select All Candidates"}
        </Button>

        {selectedCandidatesCount > 0 && (
          <span className="ml-2 text-sm text-[#666666]">
            ({selectedCandidatesCount} selected)
          </span>
        )} */}
      </div>

      <div className="flex gap-2">
        <Button
          variant="default"
          className="bg-[#001630] hover:bg-[#001630]/90 text-white"
          disabled={selectedCandidatesCount === 0}
          onClick={onSendInterviewInvite}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Interview Invite
        </Button>
      </div>
    </div>
  );
};

export default CandidateListHeader;
