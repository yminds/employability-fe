import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Loader2, RefreshCcw, Search, Mail } from "lucide-react";
import { IJob, ICandidate, ScreeningCard } from "../../types/candidate";
import {
  getCandidateData,
  getCandidateRole,
  getCandidateExperienceLevel,
} from "../../utils/candidateUtils";
import { useGetScreeningResultsQuery } from "../../api/matchingCardApi";
 
interface ScreeningResultsTabProps {
  screeningResultsData: ScreeningCard[];
  isLoadingResults: boolean;
  isPolling?: boolean; // Indicates active polling
  selectedCandidates: string[];
  setSelectedCandidates: (candidates: string[]) => void;
  onOpenInviteDialog: () => void;
  isSendingInvites: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  job: IJob;
  appliedCandidates: ICandidate[];
  screeningCompleted?: boolean; // Indicates screening completion
  batchId?: string | null; // Batch ID from screening process
}
 
const ScreeningResultsTab: React.FC<ScreeningResultsTabProps> = ({
  screeningResultsData,
  isLoadingResults,
  isPolling = false,
  selectedCandidates,
  setSelectedCandidates,
  onOpenInviteDialog,
  isSendingInvites,
  searchTerm,
  setSearchTerm,
  job,
  appliedCandidates,
  screeningCompleted = false,
  batchId,
}) => {
  // Local state to track which candidate rows are expanded
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
 
  // RTK Query hook for manually triggering refetch
  const { refetch } = useGetScreeningResultsQuery(
    { job_id: job._id, batch_id: batchId },
    { skip: !batchId }
  );
 
  const toggleExpansion = (candidateId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId],
    }));
  };
 
  // Handle individual candidate selection.
  const handleSelectCandidate = (candidateId: string) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter((id) => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };
 
  // Handle "Select All" functionality for displayed candidates.
  const handleSelectAll = (candidates: any[]) => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      const validCandidateIds = candidates
        .filter((c) => c && c._id)
        .map((c) => c._id);
      setSelectedCandidates(validCandidateIds);
    }
  };
 
  // Filter screening results based on search term.
  const filteredResults = screeningResultsData.filter((result) => {
    const candidate = getCandidateData(result, appliedCandidates);
    const candidateName = candidate?.name || "";
    const candidateEmail = candidate?.contact?.email || "";
    return (
      !searchTerm ||
      candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
 
  // Handle manual refresh
  const handleManualRefresh = () => {
    refetch();
  };
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Screening Results
          </div>
          {batchId && !isLoadingResults && !isPolling && (
            <Button variant="outline" size="sm" onClick={handleManualRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Review candidates based on their automatic screening.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingResults || isPolling ? (
          <div className="py-20 text-center">
            <Loader2 className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="font-medium text-gray-900">
              {isPolling ? "Screening candidates in progress..." : "Loading screening results..."}
            </h3>
            {isPolling && (
              <p className="text-gray-500 mt-2">
                This may take a moment. You'll see results automatically when ready.
              </p>
            )}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="py-20 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900">No screening results available</h3>
            <p className="text-gray-500 mt-1">
              {screeningCompleted
                ? "No candidates matched your screening criteria."
                : "Screen candidates first to see results here."}
            </p>
            {batchId && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleManualRefresh}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Check for Results
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-end items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-screening"
                  checked={
                    selectedCandidates.length > 0 &&
                    selectedCandidates.length ===
                      filteredResults
                        .map((r) => getCandidateData(r, appliedCandidates)._id)
                        .filter((id) => id !== undefined).length &&
                    filteredResults.length > 0
                  }
                  onCheckedChange={() => {
                    const candidates = filteredResults.map((r) =>
                      getCandidateData(r, appliedCandidates)
                    );
                    handleSelectAll(candidates);
                  }}
                />
                <label htmlFor="select-all-screening" className="text-sm">
                  Select All
                </label>
              </div>
            </div>
 
            <div className="border rounded-md overflow-hidden">
              <div className="divide-y">
                {filteredResults.map((result, index) => {
                  const candidateObj = getCandidateData(result, appliedCandidates);
                  const candidateRole = getCandidateRole(candidateObj);
                  const candidateExperienceLevel = getCandidateExperienceLevel(candidateObj);
                  const candidateId = candidateObj?._id || String(index);
                  const isExpanded = expandedRows[candidateId] || false;
 
                  return (
                    <div key={candidateId} className="flex flex-col p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedCandidates.includes(candidateId)}
                            onCheckedChange={() => handleSelectCandidate(candidateId)}
                            className="mr-4"
                          />
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-3 rounded-full bg-gray-200 flex items-center justify-center">
                              {candidateObj?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <h4 className="font-medium">{candidateObj?.name || "Unknown Candidate"}</h4>
                              <p className="text-sm text-gray-500">{candidateObj?.contact?.email || "N/A"}</p>
                              <p className="text-xs text-gray-400">
                                {candidateRole} • {candidateExperienceLevel}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{result.matching_score}%</div>
                            <div className="text-xs text-gray-500">Match Score</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpansion(candidateId)}
                          >
                            {isExpanded ? "Know Less" : "Know More"}
                          </Button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600" title={result.reason}>
                            {result.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
 
            <div className="mt-4 flex justify-end">
              <Button
                onClick={onOpenInviteDialog}
                disabled={
                  selectedCandidates.length === 0 ||
                  isSendingInvites ||
                  !screeningResultsData.some((r) => {
                    const candidateId =
                      typeof r.candidate_id === "string"
                        ? r.candidate_id
                        : r.candidate_id._id;
                    return selectedCandidates.includes(candidateId);
                  })
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email Invites ({selectedCandidates.length})
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
 
export default ScreeningResultsTab;