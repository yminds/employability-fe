import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, AlertCircle, Loader2, FileText, SendHorizonal, Calendar, Mail, RefreshCcw } from "lucide-react";
import { ICandidate } from "../../types/candidate";
import { 
  getCandidateData, 
  getCandidateRole, 
  getCandidateExperienceLevel, 
  formatDate, 
  getInvitationStatusColor 
} from "../../utils/candidateUtils";

interface InvitedCandidatesTabProps {
  invitationsData: any[];
  isLoadingInvitations: boolean;
  isPolling?: boolean; 
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  appliedCandidates: ICandidate[];
  onResendInvite?: (candidateId: string) => void;
  onManualRefresh?: () => void;
  invitationCompleted?: boolean;
  batchId?: string | null;
  job_id: string;
}

const InvitedCandidatesTab: React.FC<InvitedCandidatesTabProps> = ({
  invitationsData,
  isLoadingInvitations,
  isPolling = false,
  searchTerm,
  setSearchTerm,
  appliedCandidates,
  onResendInvite,
  onManualRefresh,
  invitationCompleted = false,
  batchId,
  job_id
}) => {
  // Calculate the total number of invited candidates
  const totalInvitedCount = invitationsData.filter(
    (card) => card.invite_status === "invited"
  ).length;

  // Handle resend invitation
  const handleResendInvite = (candidateId: string) => {
    if (onResendInvite) {
      onResendInvite(candidateId);
    }
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    if (onManualRefresh) {
      onManualRefresh();
    }
  };

  // Helper function to get candidate info from either populated data or appliedCandidates
  const getCandidateInfo = (screeningCard: any) => {
    // First, try to get candidate data from the populated field (if available)
    if (screeningCard.candidate_id && typeof screeningCard.candidate_id === 'object' && screeningCard.candidate_id.name) {
      return screeningCard.candidate_id;
    }
    
    // If candidate_id is just an ID string or reference, find in appliedCandidates
    const candidateId = typeof screeningCard.candidate_id === 'string' 
      ? screeningCard.candidate_id 
      : screeningCard.candidate_id?._id || screeningCard.candidate_id;
      
    const foundCandidate = appliedCandidates.find(c => 
      c._id === candidateId || c._id === candidateId?.toString()
    );
    
    return foundCandidate || { name: "Unknown", contact: { email: "N/A" } };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Invited Candidates
          </div>
          <Button variant="outline" size="sm" onClick={handleManualRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Track candidates who have been invited to apply or interview for
          this position.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingInvitations || isPolling ? (
          <div className="py-20 text-center">
            <Loader2 className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="font-medium text-gray-900">
              {isPolling ? "Sending invitations in progress..." : "Loading invited candidates..."}
            </h3>
            {isPolling && (
              <p className="text-gray-500 mt-2">
                This may take a moment. You'll see results automatically when ready.
              </p>
            )}
          </div>
        ) : (
          <>
            {totalInvitedCount === 0 ? (
              <div className="py-20 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900">
                  No invited candidates yet
                </h3>
                <p className="text-gray-500 mt-1">
                  Screen and invite candidates first
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleManualRefresh}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Check for Results
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Total Invited: {totalInvitedCount}
                    </Badge>
                  </div>

                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      className="pl-10"
                      placeholder="Search invited candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="divide-y">
                    {invitationsData
                      .filter((screeningCard) => {
                        // Only include candidates with invite_status = "invited"
                        if (screeningCard.invite_status !== 'invited') {
                          return false;
                        }
                        
                        // Get candidate information
                        const candidate = getCandidateInfo(screeningCard);
                        const candidateName = candidate?.name || "";
                        const candidateEmail = candidate?.contact?.email || "";

                        return (
                          !searchTerm ||
                          candidateName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          candidateEmail
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          (Array.isArray(candidate?.skills) && candidate.skills.some((skill: string) => 
                            skill.toLowerCase().includes(searchTerm.toLowerCase())
                          ))
                        );
                      })
                      .map((screeningCard, index) => {
                        // Get candidate information
                        const candidate = getCandidateInfo(screeningCard);
                        
                        // Get candidate details
                        const candidateRole = getCandidateRole(candidate);
                        const candidateExperienceLevel = getCandidateExperienceLevel(candidate);
                        const matchingScore = screeningCard.matching_score;
                        const candidateId = typeof screeningCard.candidate_id === 'string' 
                          ? screeningCard.candidate_id 
                          : screeningCard.candidate_id?._id || screeningCard.candidate_id;
                        
                        return (
                          <div
                            key={screeningCard._id || index}
                            className="flex items-center justify-between p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>
                                  {candidate?.name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {candidate?.name || "Unknown"}
                                </h4>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-500">
                                    {candidate?.contact?.email || "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {candidateRole} • {candidateExperienceLevel}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <div className="mr-4 text-center">
                                <div className="text-xl font-semibold">{matchingScore}%</div>
                                <p className="text-xs text-gray-500">Match Score</p>
                              </div>
                              
                              {screeningCard.invite_date && (
                                <div className="mr-6 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                  <span className="text-sm">{formatDate(screeningCard.invite_date)}</span>
                                </div>
                              )}

                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                                onClick={() => handleResendInvite(candidateId?.toString())}
                              >
                                <SendHorizonal className="h-4 w-4 mr-1" />
                                Resend Invite
                              </Button>

                              
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitedCandidatesTab;