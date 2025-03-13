import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  AlertCircle,
  FileText,
  Loader2,
  X,
  Clock,
  Upload,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Contact {
  email: string;
  phone: string;
  linkedin?: string;
  address?: string;
  github?: string;
  portfolio?: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationYear?: number;
}

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface ProcessedResume {
  _id?: string;
  name: string;
  contact: Contact;
  education: Education[];
  experience: Experience[];
  skills: string[];
  softSkills?: string[];
  summary?: string;
  role?: string;
  experience_level?: string;
  certifications?: any[];
  projects?: any[];
  languages?: any[];
  awards?: any[];
  interests?: string[];
  company_id?: string;
  employer_id?: string;
  job_id?: string[];
  screeningCard?: string[];
  status?: "completed" | "processing" | string;
  processingTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UploadProgress {
  completed: number;
  total: number;
  failed: number;
  isParsingDone: boolean;
  processingStartTime?: number;
  processingEndTime?: number;
  message?: string;
}

interface UploadState {
  isUploading: boolean;
  startTime: number;
  uploadId?: string;
}

interface WorkerMessage {
  type: string;
  data: any;
}

interface ResumeUploaderProps {
  jobId: string;
  employerId?: string;
  companyId?: string;
  onResumesProcessed?: (resumes: ProcessedResume[]) => void;
  onSelectCandidates?: (candidateIds: string[]) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ 
  jobId, 
  employerId, 
  companyId, 
  onResumesProcessed,
  onSelectCandidates,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);

  // Create a ref for the web worker to persist across renders
  const workerRef = useRef<Worker | null>(null);


  // Initialize the worker
  useEffect(() => {
    if (!workerRef.current) {
      try {
        workerRef.current = new Worker(
          new URL("../../workers/resumeWorkerUpload.ts", import.meta.url),
          { type: "module" }
        );
        workerRef.current.addEventListener(
          "message",
          (event: MessageEvent<WorkerMessage>) => {
            const { type, data } = event.data;
            switch (type) {
              case "WORKER_READY":
                console.log("Worker is ready");
                break;
              case "UPLOAD_COMPLETE":
                // Update state with the returned uploadId
                const currentState: UploadState = JSON.parse(
                  sessionStorage.getItem("resumeUploadState") || "{}"
                );
                const updatedState = { ...currentState, uploadId: data.uploadId };
                sessionStorage.setItem("resumeUploadState", JSON.stringify(updatedState));
                setUploadId(data.uploadId);
                break;
              case "UPLOAD_PROGRESS":
                setUploadProgress(data);
                if (data.isParsingDone) {
                  setUploading(false);
                  setStartTime(null);
                  sessionStorage.removeItem("resumeUploadState");
                  toast.success(`Successfully processed ${data.completed} resumes`);
                  fetchProcessedResumes();
                }
                break;
              case "PROCESSED_RESUMES":
                setProcessedResumes(data);
                if (onResumesProcessed) {
                  onResumesProcessed(data);
                }
                break;
              case "UPLOAD_ERROR":
                setError(data.error);
                setUploading(false);
                setStartTime(null);
                sessionStorage.removeItem("resumeUploadState");
                toast.error(data.error || "Failed to upload and process resumes");
                break;
              default:
                console.warn("Unknown message type from worker:", type);
            }
          }
        );
      } catch (err) {
        console.error("Failed to initialize web worker:", err);
        setError("Failed to initialize resume processing. Please try again.");
      }
    }
    return () => {
      const savedUploadState = sessionStorage.getItem("resumeUploadState");
      if (!savedUploadState && workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [onResumesProcessed]);

  // On initial load, check for any saved upload state
  useEffect(() => {
    const savedState = sessionStorage.getItem("resumeUploadState");
    if (savedState && workerRef.current) {
      try {
        const parsedState: UploadState = JSON.parse(savedState);
        if (parsedState.isUploading && parsedState.uploadId) {
          setUploading(true);
          setUploadId(parsedState.uploadId);
          setStartTime(parsedState.startTime);
          workerRef.current.postMessage({
            type: "FETCH_PROGRESS",
            data: {
              uploadId: parsedState.uploadId,
              apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
              jobId: jobId,
            },
          });
        }
      } catch (e) {
        console.error("Failed to parse saved upload state");
        sessionStorage.removeItem("resumeUploadState");
      }
    }
    fetchProcessedResumes();
  }, [jobId]);

  // Dropzone handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getProcessingTime = useCallback((start: number | null) => {
    if (!start) return 0;
    return ((Date.now() - start) / 1000).toFixed(1);
  }, []);

  const fetchProcessedResumes = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "FETCH_RESUMES",
        data: {
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          jobId: jobId,
          companyId:companyId,
        },
      });
    }
  }, [jobId,companyId]);

 


  const handleUpload = useCallback(() => {
    if (files.length === 0) {
      setError("Please select files to upload");
      toast.error("Please select files to upload");
      return;
    }
    const uploadStartTime = Date.now();
    setUploading(true);
    setError(null);
    setStartTime(uploadStartTime);
    const uploadState: UploadState = {
      isUploading: true,
      startTime: uploadStartTime,
    };
    sessionStorage.setItem("resumeUploadState", JSON.stringify(uploadState));
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "UPLOAD_RESUMES",
        data: {
          files,
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          jobId: jobId,
          employerId: employerId,
          companyId: companyId,
        },
      });
      toast.info(`Uploading and processing ${files.length} resumes...`);
    }
    setFiles([]);
  }, [files, jobId, employerId, companyId]);

  // Filter processed resumes based on search term
  const filteredResumes = searchTerm
    ? processedResumes.filter(resume =>
        resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        resume.softSkills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : processedResumes;

  const handleSelectResume = (resumeId: string) => {
    const newSelected = selectedResumes.includes(resumeId)
      ? selectedResumes.filter(id => id !== resumeId)
      : [...selectedResumes, resumeId];
    setSelectedResumes(newSelected);
    if (onSelectCandidates) {
      onSelectCandidates(newSelected);
    }
  };

  const handleSelectAll = () => {
    let newSelected: string[];
    if (selectedResumes.length === filteredResumes.length) {
      newSelected = [];
    } else {
      newSelected = filteredResumes.filter(resume => resume._id).map(resume => resume._id as string);
    }
    setSelectedResumes(newSelected);
    if (onSelectCandidates) {
      onSelectCandidates(newSelected);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-2">
              Drag & drop resumes here, or click to select files
            </p>
            <p className="text-sm text-gray-500">Supports PDF files only</p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 border-b last:border-0"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(uploading || uploadProgress) && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Processing Resumes</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {startTime && `${getProcessingTime(startTime)}s`}
                  </span>
                </div>
              </div>
              {uploadProgress && (
                <>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      {uploadProgress.completed} / {uploadProgress.total} files
                    </span>
                    {uploadProgress.completed > 0 && startTime && (
                      <span className="text-sm text-gray-600">
                        ~{(Number(getProcessingTime(startTime)) / uploadProgress.completed).toFixed(1)}s per file
                      </span>
                    )}
                  </div>
                  <Progress
                    value={(uploadProgress.completed / uploadProgress.total) * 100}
                    className="h-2"
                  />
                  {uploadProgress.failed > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      Failed to process {uploadProgress.failed} files
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Process
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processed Resumes Section */}
      {processedResumes.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Uploaded Candidates</h3>
                <p className="text-sm text-gray-500">
                  {processedResumes.length} resumes have been processed
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
                    id="select-all-resumes"
                    checked={selectedResumes.length === filteredResumes.length && filteredResumes.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all-resumes" className="text-sm">
                    Select All
                  </label>
                </div>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden">
              {filteredResumes.length > 0 ? (
                <div className="overflow-y-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="w-12 px-4 py-3 text-left">
                          <Checkbox
                            checked={selectedResumes.length === filteredResumes.length && filteredResumes.length > 0}
                            onCheckedChange={handleSelectAll}
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
                        {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResumes.map((resume, index) => {
                        const resumeRole = resume.role || (resume.experience && resume.experience.length > 0 
                          ? resume.experience[0].jobTitle 
                          : 'Not Specified');
                        let experienceLevel = resume.experience_level || 'Not Specified';
                        if (!resume.experience_level && resume.experience && resume.experience.length > 0) {
                          const totalYears = resume.experience.reduce((total, exp) => {
                            const start = new Date(exp.startDate);
                            const end = exp.endDate ? new Date(exp.endDate) : new Date();
                            return total + (end.getFullYear() - start.getFullYear());
                          }, 0);
                          if (totalYears < 2) experienceLevel = 'Entry Level';
                          else if (totalYears < 5) experienceLevel = 'Mid Level';
                          else experienceLevel = 'Senior Level';
                        }
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Checkbox
                                checked={selectedResumes.includes(resume._id || '')}
                                onCheckedChange={() => resume._id && handleSelectResume(resume._id)}
                                disabled={!resume._id}
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{resume.name?.charAt(0) || '?'}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{resume.name || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {resume.contact?.email || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {resumeRole}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {experienceLevel}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeUploader;
