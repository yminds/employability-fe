// components/CandidateCard.tsx
import React from "react";
import { Check, MoreVertical, X, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem as DropdownItem,
  DropdownMenuTrigger as DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { InterviewCandidate } from "@/api/InterviewInvitation";
import {
  getInitials,
  getInitialsBackgroundColor,
  getSubmissionBadge,
  getTimeSinceUpdate,
  canShowReportAndShortlist,
  getCandidateFinalRating
} from "../InterviewCandidatesView";

interface CandidateCardProps {
  candidate: InterviewCandidate;
  isSelected: boolean;
  isShortlisting: boolean;
  handleSelectCandidate: (id: string, checked: boolean) => void;
  handleShortlist: (candidateId: string) => Promise<void>;
  handleViewReport: (candidate: InterviewCandidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  isShortlisting,
  handleSelectCandidate,
  handleShortlist,
  handleViewReport,
}) => {
  // Get submission badge info
  const submissionBadge = getSubmissionBadge(candidate);

  // Get time since last update
  const timeSinceUpdate = getTimeSinceUpdate(candidate);

  // Check if we should show report and shortlist options
  const showReportAndShortlist = canShowReportAndShortlist(candidate);

  // Get final rating
  const finalRating = getCandidateFinalRating(candidate);

  // Render badge icon based on type
  const renderBadgeIcon = () => {
    if (submissionBadge.icon === "check") {
      return <Check className={`w-4 h-4 ${submissionBadge.textColor}`} />;
    } else if (submissionBadge.icon === "clock") {
      return <Clock className={`w-4 h-4 ${submissionBadge.textColor}`} />;
    } else if (submissionBadge.icon === "x") {
      return (
        <div className="w-4 h-4 flex items-center justify-center rounded-full bg-[#414447]">
          <X className="w-3 h-3 text-white" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-b p-4">
      <div className="flex items-center">
        <Checkbox
          id={`candidate-${candidate._id}`}
          className="mr-4 rounded border-[#d6d7d9]"
          checked={isSelected}
          onCheckedChange={(checked) =>
            handleSelectCandidate(candidate._id, !!checked)
          }
        />
        <div className="relative">
          {candidate.profile_image ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border">
              <img
                src={candidate.profile_image || "/placeholder.svg"}
                alt={candidate.candidate_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center"
              style={{
                backgroundColor: getInitialsBackgroundColor(
                  candidate.candidate_name
                ),
              }}
            >
              <span className="text-white text-lg font-medium">
                {getInitials(candidate.candidate_name)}
              </span>
            </div>
          )}
          {candidate.has_report && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10b754] rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-[#0c0f12]">
                {candidate.candidate_name}
              </h3>
              {candidate.candidate_location && (
                <p className="text-sm text-[#68696b]">
                  {candidate.candidate_location}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {/* Status badge */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${submissionBadge.bgColor}`}>
                  {renderBadgeIcon()}
                  <span className={`text-sm font-medium ${submissionBadge.textColor}`}>
                    {submissionBadge.text}
                    {candidate.has_report && timeSinceUpdate && ` ${timeSinceUpdate}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side of card */}
            <div className="flex flex-col items-end">
              {/* Status text on the top right */}
              {candidate.status === "accepted" && (
                <div className="text-right mb-2">
                  <p className="text-sm font-medium text-[#0c0f12]">
                    Invite Accepted
                  </p>
                  <p className="text-sm text-[#68696b]">
                    Waiting for Interview Submission
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Show rating if completed and has report */}
                {showReportAndShortlist && candidate.has_report && (
                  <div className="text-center mr-2">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-[#0c0f12]">
                        {typeof finalRating === "number"
                          ? finalRating.toFixed(1)
                          : "N/A"}
                      </span>
                      <span className="text-sm text-[#68696b]">/10</span>
                      <div className="w-5 h-5 rounded-full bg-[#10b754] flex items-center justify-center ml-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-[#68696b]">Interview score</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {/* View Report button */}
                  {showReportAndShortlist && candidate.has_report && (
                    <Button
                      variant="outline"
                      className="h-8 px-3 py-1 text-sm bg-[#f0f3f7] text-[#001630] border-[#f0f3f7] hover:bg-[#f0f3f7] hover:text-[#001630]"
                      onClick={() => handleViewReport(candidate)}
                    >
                      View Report
                    </Button>
                  )}

                  {/* Shortlisted button */}
                  {candidate.status === "completed" &&
                    candidate.task?.interview_type?.interview_id &&
                    candidate.shortlist && (
                      <Button
                        variant="outline"
                        className="h-8 px-3 py-1 text-sm bg-[rgba(3,150,63,0.10)] text-[#03963f] border-[#d9d9d9] hover:bg-[#d9d9d9] hover:text-[#03963f] flex items-center"
                        disabled
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            d="M17.4693 8.99944L15 6.53019L16.0443 5.46094L17.4693 6.88594L20.9943 3.33594L22.0635 4.40519L17.4693 8.99944ZM5.5 20.2494V5.30719C5.5 4.80202 5.675 4.37444 6.025 4.02444C6.375 3.67444 6.80258 3.49944 7.30775 3.49944H13V4.99944H7.30775C7.23075 4.99944 7.16025 5.03152 7.09625 5.09569C7.03208 5.15969 7 5.23019 7 5.30719V17.9494L12 15.7994L17 17.9494V10.9994H18.5V20.2494L12 17.4609L5.5 20.2494Z"
                            fill="#03963F"
                          />
                        </svg>
                        Shortlisted
                      </Button>
                    )}

                  {/* Shortlist button */}
                  {showReportAndShortlist && !candidate.shortlist && (
                    <Button
                      variant="outline"
                      className="h-8 px-3 py-1 text-sm border-[#d9d9d9] text-[#202326] hover:bg-transparent"
                      onClick={() => handleShortlist(candidate.candidate_id)}
                      disabled={isShortlisting}
                    >
                      {isShortlisting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#202326]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Shortlisting...
                        </span>
                      ) : (
                        <>Shortlist</>
                      )}
                    </Button>
                  )}

                  {/* More options dropdown */}
                  {candidate.status === "completed" && (
                    <Dropdown>
                      <DropdownTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#68696b]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownContent align="end">
                        <DropdownItem>Send Message</DropdownItem>
                        <DropdownItem>Schedule Interview</DropdownItem>
                        <DropdownItem>Download Resume</DropdownItem>
                        <DropdownItem className="text-red-500">
                          Decline Candidate
                        </DropdownItem>
                      </DropdownContent>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};