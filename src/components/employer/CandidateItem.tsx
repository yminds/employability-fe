import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentStatusSVG } from "../../features/profile/svg/currentStatusSVG";
import verified from "../../assets/skills/verified.svg";

interface Candidate {
  user_id: string;
  profile_image?: string;
  name: string;
  current_status?: string;
  experience_level?: string;
  email: string;
  averageRating?: number;
  location: {
    country: string;
    state: string;
    city: string;
  };
  matchPercentage: number;
}

interface CandidateItemProps {
  candidate: Candidate;
  isChecked: boolean;
  onCheckChange: (userId: string, checked: boolean) => void;
}

const CandidateItem: React.FC<CandidateItemProps> = ({
  candidate,
  isChecked,
  onCheckChange,
}) => {
  console.log("candidate", candidate);
  return (
    <div className="flex items-center px-6 py-4 border-t border-[#d6d7d9] hover:bg-[#f9fafc]">
      <Checkbox
        checked={isChecked}
        onCheckedChange={(checked) =>
          onCheckChange(candidate.user_id, !!checked)
        }
        className="mr-4 h-5 w-5
          data-[state=checked]:bg-[#001630] 
          data-[state=checked]:border-[#001630]
          data-[state=checked]:text-white"
      />
      <div className="flex items-center flex-1">
        <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden mr-4 border-2 border-[#10b754]">
          {/* Profile Image */}
          {candidate.profile_image ? (
            <img
              src={candidate.profile_image}
              alt={candidate.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 font-semibold text-xl">
              {candidate.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* If "Actively seeking" status => show green semicircle */}
          {candidate.current_status === "Actively seeking job" && (
            <div className="absolute transform scale-[0.519] origin-bottom">
              {currentStatusSVG}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-medium">{candidate.name}</h3>
          </div>
          <p className="text-sm text-[#666666]">{candidate.email}</p>

          {candidate.location?.city && (
            <p className="text-sm text-[#666666]">
              {`${candidate.location.city}, ${candidate.location.state}`}
            </p>
          )}
        </div>

        <div className="flex items-center mr-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-center">
                  <div className="flex items-center">
                    <span className="text-lg font-medium">
                      {typeof candidate.averageRating === "number"
                        ? candidate.averageRating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-lg text-[#909091]">/10</span>
                    <img
                      src={verified}
                      alt="verified"
                      className="w-5 h-5 ml-1"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-[#414447] font-dm-sans font-normal leading-[24px] tracking-[0.07px]">
                      Employability score
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Average verified rating across all matched skills
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="text-center ml-5">
          <div className="text-xl font-bold text-[#10b754]">
            {Math.round(candidate.matchPercentage)}%
          </div>
          <div className="text-sm text-[#414447]">Match</div>
        </div>
      </div>
    </div>
  );
};

export default CandidateItem;
