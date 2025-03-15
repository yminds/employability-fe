import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Upload,
  Users,
  BadgeCheck,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useGetCompanyCandidatesQuery } from "../../api/employerJobsApiSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IJob, ProcessedResume } from "../../types/candidate";

// Re-use the resume uploader component
import UploadResumeTab from "./ResumeUpload";

// Helper: safely convert a value to lowercase string (defaulting to an empty string)
const safeToLower = (value: any) => (value ? String(value).toLowerCase() : "");

interface CandidatesTabProps {
  job: IJob;
  employerId?: string;
  onResumesProcessed: (resumes: ProcessedResume[]) => void;
  onSelectCandidates: (candidateIds: string[]) => void;
  selectedCandidates: string[];
  isScreening: boolean;
  onScreenCandidates: () => void;
  // New prop to signal that the parent (job details) candidates tab is active
  activeCandidatesTab?: boolean;
}

const CandidatesTab: React.FC<CandidatesTabProps> = ({
  job,
  employerId,
  onResumesProcessed,
  onSelectCandidates,
  selectedCandidates,
  isScreening,
  onScreenCandidates,
  activeCandidatesTab = false,
}) => {
  // Set default sub‑tab to "uploadResumes"
  const [activeSubTab, setActiveSubTab] = useState("verifiedUsers");
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize local selected candidates state once.
  const [localSelectedCandidates, setLocalSelectedCandidates] = useState<
    Record<string, boolean>
  >(() => {
    const initMap: Record<string, boolean> = {};
    selectedCandidates.forEach((id) => {
      initMap[id] = true;
    });
    return initMap;
  });

  // Sync local selection changes to parent.
  useEffect(() => {
    const selectedIds = Object.entries(localSelectedCandidates)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    onSelectCandidates(selectedIds);
  }, [localSelectedCandidates]);

  // Fetch existing company candidates.
  const { data: companyCandidates, isLoading: isLoadingCompanyCandidates } =
    useGetCompanyCandidatesQuery({
      company_id: job?.company?._id,
      job_id: job?._id
    });


  // Mock verified users.
  const verifiedUsers: any[] = [
    {
      _id: "verified-1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+1234567890",
      skills: ["React", "TypeScript", "UI/UX"],
      yearsOfExperience: 5,
      verified: true,
      avatar: "",
      location: "San Francisco, CA",
      currentTitle: "Senior Frontend Developer",
    },
    {
      _id: "verified-2",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1987654321",
      skills: ["Python", "Data Science", "Machine Learning"],
      yearsOfExperience: 3,
      verified: true,
      avatar: "",
      location: "New York, NY",
      currentTitle: "Data Scientist",
    },
    {
      _id: "verified-3",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@example.com",
      phone: "+1567890123",
      skills: ["Project Management", "Agile", "SCRUM"],
      yearsOfExperience: 7,
      verified: true,
      avatar: "",
      location: "Chicago, IL",
      currentTitle: "Technical Project Manager",
    },
  ];

  // Local candidate selection handler.
  const handleCandidateSelection = useCallback(
    (candidateId: string, isSelected: boolean) => {
      setLocalSelectedCandidates((prev) => ({
        ...prev,
        [candidateId]: isSelected,
      }));
    },
    []
  );

  // Filter candidates based on search.
  const filterCandidates = (candidates: any[]) => {
    if (!searchTerm) return candidates;
    const term = searchTerm.toLowerCase();
    return candidates.filter((candidate) => {
      const fullName =
        safeToLower(candidate.firstName) +
        " " +
        safeToLower(candidate.lastName);
      return (
        fullName.includes(term) ||
        safeToLower(candidate.email).includes(term) ||
        safeToLower(candidate.currentTitle).includes(term) ||
        (candidate.skills &&
          candidate.skills.some((skill: string) =>
            safeToLower(skill).includes(term)
          ))
      );
    });
  };

  // Render a candidate card.
  const renderCandidateCard = (candidate: any) => {
    return (
      <div
        key={candidate._id}
        className="flex items-start space-x-4 p-4 border rounded-md"
      >
        <Checkbox
          id={`candidate-${candidate._id}`}
          checked={!!localSelectedCandidates[candidate._id]}
          onCheckedChange={(checked) =>
            handleCandidateSelection(candidate._id, checked === true)
          }
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {candidate.avatar ? (
                  <img src={candidate.avatar} alt={candidate.name} />
                ) : (
                  <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-lg">
                    {candidate.name
                      ? candidate.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {candidate.name || "Unknown Candidate"}
                </h3>
                <p className="text-sm text-gray-500">
                  {candidate.contact?.email || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Role: {candidate.role || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Experience Level: {candidate.experience_level || "N/A"}
                </p>
              </div>
            </div>
            {candidate.verified && (
              <Badge variant="secondary" className="flex items-center">
                <BadgeCheck className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const existingCandidates = companyCandidates?.data || [];
  const filteredExistingCandidates = filterCandidates(existingCandidates);
  const filteredVerifiedUsers = filterCandidates(verifiedUsers);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Candidates
        </CardTitle>
        <CardDescription>
          Upload new resumes, select from existing candidates, or choose from
          verified talent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeSubTab}
          onValueChange={setActiveSubTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="verifiedUsers" className="flex items-center">
              <BadgeCheck className="h-4 w-4 mr-2" />
              Employability Candidates
            </TabsTrigger>
            <TabsTrigger
              value="existingCandidates"
              className="flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Company Candidates
            </TabsTrigger>
            <TabsTrigger value="uploadResumes" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Your Candidates
            </TabsTrigger>
          </TabsList>

          {/* Upload Resumes Sub-Tab – pass activeCandidatesTab to trigger resume fetch */}
          <TabsContent value="uploadResumes">
            <UploadResumeTab
              jobId={job._id}
              employerId={employerId}
              onResumesProcessed={onResumesProcessed}
              onSelectCandidates={(candidateIds) => {
                setLocalSelectedCandidates((prev) => {
                  const newSelection = { ...prev };
                  candidateIds.forEach((id) => {
                    newSelection[id] = true;
                  });
                  return newSelection;
                });
              }}
              companyId={job.company?._id}
            />
          </TabsContent>

          {/* Existing Company Candidates Sub-Tab */}
          <TabsContent value="existingCandidates">
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Company Candidates
                    </h3>
                    <p className="text-sm text-gray-500">
                      {filteredExistingCandidates.length} candidates found
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        className="pl-10"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all-existing"
                        checked={
                          filteredExistingCandidates.length > 0 &&
                          filteredExistingCandidates.every(
                            (candidate) =>
                              !!localSelectedCandidates[candidate._id]
                          )
                        }
                        onCheckedChange={(checked) => {
                          const newSelection = { ...localSelectedCandidates };
                          filteredExistingCandidates.forEach((candidate) => {
                            newSelection[candidate._id] = checked === true;
                          });
                          setLocalSelectedCandidates(newSelection);
                        }}
                      />
                      <label htmlFor="select-all-existing" className="text-sm">
                        Select All
                      </label>
                    </div>
                  </div>
                </div>

                {isLoadingCompanyCandidates ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    {filteredExistingCandidates.length > 0 ? (
                      <div className="overflow-y-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="w-12 px-4 py-3 text-left">
                                <Checkbox
                                  checked={
                                    filteredExistingCandidates.length > 0 &&
                                    filteredExistingCandidates.every(
                                      (candidate) =>
                                        !!localSelectedCandidates[candidate._id]
                                    )
                                  }
                                  onCheckedChange={(checked) => {
                                    const newSelection = {
                                      ...localSelectedCandidates,
                                    };
                                    filteredExistingCandidates.forEach(
                                      (candidate) => {
                                        newSelection[candidate._id] =
                                          checked === true;
                                      }
                                    );
                                    setLocalSelectedCandidates(newSelection);
                                  }}
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Experience Level
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredExistingCandidates.map(
                              (candidate, index) => {
                                const candidateRole =
                                  candidate.role ||
                                  (candidate.experience &&
                                  candidate.experience.length > 0
                                    ? candidate.experience[0].jobTitle
                                    : "Not Specified");
                                let experienceLevel =
                                  candidate.experience_level || "Not Specified";
                                if (
                                  !candidate.experience_level &&
                                  candidate.experience &&
                                  candidate.experience.length > 0
                                ) {
                                  const totalYears =
                                    candidate.experience.reduce(
                                      (total: number, exp: { startDate: string | number | Date; endDate: string | number | Date; }) => {
                                        const start = new Date(exp.startDate);
                                        const end = exp.endDate
                                          ? new Date(exp.endDate)
                                          : new Date();
                                        return (
                                          total +
                                          (end.getFullYear() -
                                            start.getFullYear())
                                        );
                                      },
                                      0
                                    );
                                  if (totalYears < 2)
                                    experienceLevel = "Entry Level";
                                  else if (totalYears < 5)
                                    experienceLevel = "Mid Level";
                                  else experienceLevel = "Senior Level";
                                }
                                return (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <Checkbox
                                        checked={
                                          !!localSelectedCandidates[
                                            candidate._id
                                          ]
                                        }
                                        onCheckedChange={(checked) => {
                                          handleCandidateSelection(
                                            candidate._id,
                                            checked === true
                                          );
                                        }}
                                      />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarFallback>
                                            {candidate.name?.charAt(0) || "?"}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                          {candidate.name || "N/A"}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {candidate.contact?.email || "N/A"}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {candidateRole}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {experienceLevel}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-medium text-gray-900">
                          No candidates found
                        </h3>
                        <p className="text-gray-500 mt-1">
                          {searchTerm
                            ? "Try a different search term"
                            : "No candidates available"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verified Users Sub-Tab */}
          <TabsContent value="verifiedUsers">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Verified Talent Pool</h3>
                <Input
                  placeholder="Search verified talent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              {filteredVerifiedUsers.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No matching verified talent found"
                      : "No verified talent available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVerifiedUsers.map(renderCandidateCard)}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Screen Selected Candidates Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onScreenCandidates}
            disabled={isScreening || selectedCandidates.length === 0}
          >
            {isScreening ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Screening...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Screen Selected Candidates ({selectedCandidates.length})
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatesTab;
