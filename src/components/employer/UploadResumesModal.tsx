"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, FileText, Loader2, Clock, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export interface ProcessedResume {
  _id?: string;
  name: string;
  contact: {
    email: string;
    phone: string;
    linkedin?: string;
    address?: string;
    github?: string;
    portfolio?: string;
  };
  education: {
    degree: string;
    institution: string;
    location: string;
    graduationYear?: number;
  }[];
  experience: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }[];
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

type ResumeUploadModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  jobId: string;
  employerId?: string;
  companyId?: string;
  onResumesProcessed?: (resumes: ProcessedResume[]) => void;
  onSelectCandidates?: (candidateIds: string[]) => void;
}

export default function ResumeUploadModal({ 
  isOpen, 
  setIsOpen, 
  jobId, 
  employerId, 
  companyId,
  onResumesProcessed,
  onSelectCandidates 
}: ResumeUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>([])
  
  // Create a ref for the web worker to persist across renders
  const workerRef = useRef<Worker | null>(null)

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
    if (!isOpen) return;
    
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
  }, [jobId, isOpen]);

  const fetchProcessedResumes = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "FETCH_RESUMES",
        data: {
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
          jobId: jobId,
          companyId: companyId,
        },
      });
    }
  }, [jobId, companyId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    // Handle file upload
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/pdf"
    );
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      setError(null);
    } else {
      setError("Please upload PDF files only");
      toast.error("Please upload PDF files only");
    }
  }

  const handleFileSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf"
    input.multiple = true
    input.onchange = (e) => {
      if (e.target && (e.target as HTMLInputElement).files) {
        const selectedFiles = Array.from((e.target as HTMLInputElement).files as FileList);
        setFiles(prev => [...prev, ...selectedFiles]);
        setError(null);
      }
    }
    input.click()
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getProcessingTime = useCallback((start: number | null) => {
    if (!start) return 0;
    return ((Date.now() - start) / 1000).toFixed(1);
  }, []);

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#ffffff] rounded-lg w-full max-w-xl mx-4 shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#000000]">Upload Resumes</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[#000000] hover:text-[#68696b] transition-colors"
              disabled={uploading}
            >
              <X size={24} />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-10 mb-6 flex flex-col items-center justify-center cursor-pointer
              ${isDragging ? "border-[#1fd167] bg-[#f0f5f3]" : "border-[#d9d9d9]"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <div className="w-16 h-16 mb-4 relative">
              <div className="absolute inset-0">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M40 12H24C21.7909 12 20 13.7909 20 16V48C20 50.2091 21.7909 52 24 52H40C42.2091 52 44 50.2091 44 48V16C44 13.7909 42.2091 12 40 12Z"
                    stroke="#001630"
                    strokeWidth="2"
                  />
                  <path
                    d="M32 52V32M32 32L26 38M32 32L38 38"
                    stroke="#1fd167"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-center text-[#1c1b1f] mb-2">Drag and drop as a pdfs or</p>
            <button className="text-[#1fd167] font-medium hover:underline">Select from files</button>
            <p className="text-[#909091] text-sm mt-4">*Only pdfs</p>
          </div>

          {/* Selected files list */}
          {files.length > 0 && (
            <div className="mb-6">
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

          {/* Error display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload progress */}
          {(uploading || uploadProgress) && (
            <div className="bg-[#f0f5f3] rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-4">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="4" fill="#f44336" />
                    <path
                      d="M14 24V32C14 33.1046 14.8954 34 16 34H32C33.1046 34 34 33.1046 34 32V24"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M24 28V14M24 14L20 18M24 14L28 18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      {uploadProgress && (
                        <p className="text-xl font-bold text-[#000000]">
                          {uploadProgress.completed}<span className="text-[#909091] font-normal">/{uploadProgress.total}</span>
                        </p>
                      )}
                      <p className="text-[#909091]">Uploaded</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {startTime && `${getProcessingTime(startTime)}s`}
                      </span>
                    </div>
                  </div>
                  {uploadProgress && (
                    <>
                      <div className="w-full bg-[#d6d7d9] h-2 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-[#1fd167] h-full rounded-full" 
                          style={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }}
                        ></div>
                      </div>
                      {uploadProgress.failed > 0 && (
                        <p className="mt-1 text-sm text-red-500">
                          Failed to process {uploadProgress.failed} files
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4">
          <Button 
            className="bg-[#001630] hover:bg-[#001630]/90 text-white px-8 py-2 rounded-md font-medium"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
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
      </div>
    </div>
  )
}