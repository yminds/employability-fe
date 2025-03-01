import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from "@/store/store";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  useScreenCandidatesMutation,
  useGetScreeningResultsQuery
} from '../../api/screenCardApislice';
import { 
  useInviteCandidatesMutation
} from '../../api/emailInvitationApiSlice';
import { IJob } from './JobCard';
import { jobUtils } from '../../utils/jobUtils';
import {toast} from 'sonner'
import ResumeUploader from '@/components/employer/ResumeUpload';
import {
  Upload,
  CheckCircle,
  Search,
  AlertCircle,
  X,
  Loader2,
  FileText,
  Mail,
  SendHorizonal
} from 'lucide-react';

interface JobDetailsTabsProps {
  job: IJob;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface ICandidate {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  experience?: string;
  education?: string;
  match_score?: number;
  status?: string;
}

interface IScreeningResult {
  _id: string;
  candidate_id: ICandidate;
  status: "passed" | "failed";
  matching_score: number;
  reason: string;
  invite_status: "not_invited" | "invited";
}

const JobDetailsTabs: React.FC<JobDetailsTabsProps> = ({ job, activeTab, setActiveTab }) => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  
  // RTK Query hooks
  const [screenCandidates] = useScreenCandidatesMutation();
  const [inviteCandidates] = useInviteCandidatesMutation();
  
  const { data: screeningResults, isLoading: isLoadingResults } = useGetScreeningResultsQuery(
    { job_id: job._id },
    { skip: activeTab !== 'screening' }
  );
  
  // Handle candidate selection
  const handleSelectCandidate = (candidateId: string) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };
  
  // Handle "Select All" functionality
  const handleSelectAll = (candidates: ICandidate[]) => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(c => c._id));
    }
  };
  
  // Start screening process
const handleScreenCandidates = async () => {
    if (selectedCandidates.length === 0) {
      toast.error("No candidates selected", {
        description: "Please select at least one candidate to screen."
      });
      return;
    }
    
    setIsScreening(true);
    
    try {
      const result = await screenCandidates({
        job_id: job._id,
        candidate_ids: selectedCandidates
      }).unwrap();
      
      setBatchId(result.data.batch_id);
      setActiveTab('screening');
      
      toast.success("Screening started", {
        description: `Screening ${selectedCandidates.length} candidates. This may take a few moments.`
      });
    } catch (error) {
      console.error('Error screening candidates:', error);
      toast.error("Screening failed", {
        description: "There was an error while screening candidates. Please try again."
      });
    } finally {
      setIsScreening(false);
      setSelectedCandidates([]);
    }
  };
  
  // Send email invitations
  const handleSendInvites = async () => {
    if (selectedCandidates.length === 0) {
      toast.error("No candidates selected", {
        description: "Please select at least one candidate to invite."
      });
      return;
    }
    
    setIsSendingInvites(true);
    
    try {
      const result = await inviteCandidates({
        job_id: job._id,
        candidate_ids: selectedCandidates,
        message: customMessage,
        email_type: 'interview_invitation',
        employer_id: employer?._id || ""
      }).unwrap();
      
      setShowInviteDialog(false);
      setCustomMessage('');
      
      toast.success("Invitations sent", {
        description: `Successfully sent ${selectedCandidates.length} invitations.`
      });
      
      // Move to the invited tab
      setActiveTab('invited');
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error("Failed to send invitations", {
        description: "There was an error while sending invitations. Please try again."
      });
    } finally {
      setIsSendingInvites(false);
    }
  };
  
  // Filter candidates based on search term
  const filterCandidates = (candidates: ICandidate[]) => {
    if (!searchTerm) return candidates;
    
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // Get filtered candidates for the current tab
  const getFilteredCandidates = () => {
    switch (activeTab) {
      case 'uploadResume':
        return filterCandidates(job.candidates.applied);
      case 'screening':
        if (!screeningResults?.data) return [];
        return filterCandidates(screeningResults.data.map((result: any) => result.candidate_id));
      case 'invited':
        return filterCandidates(job.candidates.shortlisted);
      default:
        return [];
    }
  };
  
  const filteredCandidates = getFilteredCandidates();
  
  return (
    <>
      {/* Upload Resumes Tab */}
      <TabsContent value="uploadResume">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Resumes
            </CardTitle>
            <CardDescription>
              Upload candidate resumes in PDF, DOC, or DOCX format. You can also upload a CSV file with candidate information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeUploader jobId={job._id} />
            
            {/* Uploaded Candidates List */}
            {job.candidates.applied.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Uploaded Candidates ({job.candidates.applied.length})</h3>
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
                        id="select-all"
                        checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                        onCheckedChange={() => handleSelectAll(filteredCandidates)}
                      />
                      <label htmlFor="select-all" className="text-sm">Select All</label>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  {filteredCandidates.length > 0 ? (
                    <div className="divide-y">
                      {filteredCandidates.map((candidate, index) => (
                        <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <Checkbox
                              checked={selectedCandidates.includes(candidate._id)}
                              onCheckedChange={() => handleSelectCandidate(candidate._id)}
                              className="mr-4"
                            />
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{candidate.name}</h4>
                                <p className="text-sm text-gray-500">{candidate.email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {candidate.skills && (
                              <div className="flex gap-2 mr-6">
                                {candidate.skills.slice(0, 3).map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="font-normal">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 3 && (
                                  <Badge variant="outline" className="font-normal">
                                    +{candidate.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <Button variant="ghost" size="sm" className="mr-2">
                              <FileText className="h-4 w-4 mr-1" />
                              View CV
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900">No candidates found</h3>
                      <p className="text-gray-500 mt-1">
                        {searchTerm ? 'Try a different search term' : 'Upload resumes to see candidates here'}
                      </p>
                    </div>
                  )}
                </div>
                
                {filteredCandidates.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleScreenCandidates}
                      disabled={selectedCandidates.length === 0 || isScreening}
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
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Screening Results Tab */}
      <TabsContent value="screening">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Screening Results
            </CardTitle>
            <CardDescription>
              Review candidates who have been automatically screened based on their skills and experience match.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <div className="py-20 text-center">
                <Loader2 className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="font-medium text-gray-900">Loading screening results...</h3>
              </div>
            ) : (
              <>
                {!screeningResults?.data || screeningResults.data.length === 0 ? (
                  <div className="py-20 text-center">
                    <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900">No screening results available</h3>
                    <p className="text-gray-500 mt-1">
                      Screen candidates first to see results here
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Passed: {screeningResults.data.filter((r: any) => r.status === 'passed').length}
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          Failed: {screeningResults.data.filter((r: any) => r.status === 'failed').length}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4">
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
                              selectedCandidates.length === 
                              screeningResults.data
                                .filter((r: any) => r.status === 'passed')
                                .filter((r: any) => 
                                  !searchTerm || 
                                  r.candidate_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  r.candidate_id.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .length && 
                              screeningResults.data
                                .filter((r: any) => r.status === 'passed')
                                .filter((r: any) => 
                                  !searchTerm || 
                                  r.candidate_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  r.candidate_id.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .length > 0
                            }
                            onCheckedChange={() => {
                              const passedCandidates = screeningResults.data
                                .filter((r: any) => r.status === 'passed')
                                .filter((r: any) => 
                                  !searchTerm || 
                                  r.candidate_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  r.candidate_id.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((r: any) => r.candidate_id);
                              
                              handleSelectAll(passedCandidates);
                            }}
                          />
                          <label htmlFor="select-all-screening" className="text-sm">Select All Passed</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="divide-y">
                        {screeningResults.data
                          .filter((result: any) => {
                            const candidate = result.candidate_id;
                            return !searchTerm || 
                              candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
                          })
                          .map((result: any, index: number) => (
                            <div key={index} className={`flex items-center justify-between p-4 ${
                              result.status === 'passed' ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                              <div className="flex items-center">
                                {result.status === 'passed' && (
                                  <Checkbox
                                    checked={selectedCandidates.includes(result.candidate_id._id)}
                                    onCheckedChange={() => handleSelectCandidate(result.candidate_id._id)}
                                    className="mr-4"
                                  />
                                )}
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback>{result.candidate_id.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium flex items-center">
                                      {result.candidate_id.name}
                                      {result.status === 'passed' && (
                                        <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                                      )}
                                      {result.status === 'failed' && (
                                        <X className="h-4 w-4 text-red-600 ml-2" />
                                      )}
                                    </h4>
                                    <p className="text-sm text-gray-500">{result.candidate_id.email}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <div className="mr-6 text-center">
                                  <div className="text-2xl font-bold">
                                    {result.matching_score}%
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Match Score
                                  </div>
                                </div>
                                
                                <div className="w-48 mr-6">
                                  <p className="text-sm line-clamp-2" title={result.reason}>
                                    {result.reason}
                                  </p>
                                </div>
                                
                                <Badge 
                                  className={`mr-3 ${jobUtils.getStatusColor(result.status)}`}
                                >
                                  {result.status}
                                </Badge>
                                
                                {result.invite_status === 'invited' && (
                                  <Badge className="bg-purple-100 text-purple-800 mr-2">
                                    Invited
                                  </Badge>
                                )}
                                
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  View CV
                                </Button>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={() => setShowInviteDialog(true)}
                        disabled={
                          selectedCandidates.length === 0 || 
                          isSendingInvites || 
                          !screeningResults.data.some((r: any) => 
                            r.status === 'passed' && 
                            selectedCandidates.includes(r.candidate_id._id)
                          )
                        }
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email Invites ({selectedCandidates.length})
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Invited Candidates Tab */}
      <TabsContent value="invited">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Invited Candidates
            </CardTitle>
            <CardDescription>
              Track candidates who have been invited to apply or interview for this position.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {job.candidates.shortlisted.length === 0 ? (
              <div className="py-20 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900">No invited candidates yet</h3>
                <p className="text-gray-500 mt-1">
                  Screen and invite candidates first
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Invited Candidates ({job.candidates.shortlisted.length})</h3>
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
                    {filteredCandidates.map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{candidate.name}</h4>
                            <p className="text-sm text-gray-500">{candidate.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="mr-6">
                            <Badge className="bg-purple-100 text-purple-800">
                              Invited
                            </Badge>
                          </div>
                          
                          <Button variant="outline" size="sm" className="mr-2">
                            <SendHorizonal className="h-4 w-4 mr-1" />
                            Resend Invite
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View CV
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Email Invitation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Send Email Invitations</DialogTitle>
          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Selected Candidates</Label>
              <p className="text-sm text-gray-500 mt-1">
                You are about to send invitations to {selectedCandidates.length} candidates.
              </p>
            </div>
            
            <div>
              <Label htmlFor="custom-message" className="text-sm font-medium">Custom Message (Optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Add a personal message to the email invitation..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvites} disabled={isSendingInvites}>
                {isSendingInvites ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobDetailsTabs;