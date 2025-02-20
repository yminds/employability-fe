import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios, { AxiosError } from 'axios';
import { AlertCircle, CheckCircle, FileText, Loader2, X, Clock } from 'lucide-react';

// Define interfaces for type safety
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

interface ProcessedResume {
    name: string;
    contact: Contact;
    education: Education[];
    experience: Experience[];
    skills: string[];
    status: 'completed' | 'processing' | string;
    processingTime?: number;
    createdAt?: Date;
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

interface UploadResponse {
    message: string;
    data: {
        uploadId: string;
        totalFiles: number;
        totalBatches: number;
    };
}

const ResumeUploader: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [uploadId, setUploadId] = useState<string | null>(null);
    const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);

    // File drop handler
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setError(null);
    }, []);

    // Setup dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true
    });

    // Remove file handler
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Calculate processing time
    const getProcessingTime = useCallback((start: number | null) => {
        if (!start) return 0;
        return ((Date.now() - start) / 1000).toFixed(1);
    }, []);

    // Fetch processed resumes
    const fetchProcessedResumes = async () => {
        try {
            const response = await axios.get<{ message: string; data: ProcessedResume[] }>(
                `${process.env.VITE_API_BASE_URL}/api/v1/resume/getAll-resumes`
            );
            setProcessedResumes(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch processed resumes');
            setProcessedResumes([]);
        }
    };

    // Progress checking
    const checkProgress = useCallback(async (id: string) => {
        if (!id) return;

        try {
            const response = await axios.get<UploadProgress>(
                `${process.env.VITE_API_BASE_URL}/api/v1/resume/upload-status/${id}`
            );
            const progress = response.data;

            setUploadProgress(progress);

            if (!progress.isParsingDone) {
                setTimeout(() => checkProgress(id), 1000);
            } else {
                setUploading(false);
                setStartTime(null);
                fetchProcessedResumes();
            }
        } catch (error) {
            setError('Failed to check progress');
            setUploading(false);
            setStartTime(null);
        }
    }, []);

    // Upload handler
    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select files to upload');
            return;
        }

        setUploading(true);
        setError(null);
        setStartTime(Date.now());
        
        const formData = new FormData();
        files.forEach(file => {
            formData.append('resumes', file);
        });

        try {
            const response = await axios.post<UploadResponse>(
                `${process.env.VITE_API_BASE_URL}/api/v1/resume/bulkUpload-resumes`, 
                formData
            );
            const uploadId = response.data.data.uploadId;
            setUploadId(uploadId);
            setFiles([]); // Clear files after successful upload
            checkProgress(uploadId);
        } catch (error) {
            const axiosError = error as AxiosError<{ error: string }>;
            setError(axiosError.response?.data?.error || 'Upload failed');
            setUploading(false);
            setStartTime(null);
        }
    };

    useEffect(() => {
        fetchProcessedResumes();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Resume Upload</h2>
                
                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                >
                    <input {...getInputProps()} />
                    <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600 mb-2">
                        Drag & drop PDF resumes here, or click to select files
                    </p>
                    <p className="text-sm text-gray-500">
                        Supports PDF files only
                    </p>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Selected Files ({files.length})</h3>
                        <div className="max-h-48 overflow-y-auto">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded mb-2">
                                    <span className="text-sm text-gray-600">{file.name}</span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-gray-400 hover:text-red-500"
                                        type="button"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" size={20} />
                        {error}
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className={`mt-4 px-6 py-2 rounded-lg flex items-center justify-center w-full
                        ${uploading || files.length === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    type="button"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Processing...
                        </>
                    ) : 'Upload and Process'}
                </button>

                {/* Progress Bar with Processing Time */}
                {uploadProgress && (
                    <div className="mt-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Processing Resumes</span>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    {startTime && `${getProcessingTime(startTime)}s`}
                                </span>
                            </div>
                        </div>
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
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }}
                            />
                        </div>
                        {uploadProgress.failed > 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                Failed to process {uploadProgress.failed} files
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Processed Resumes Table */}
            {processedResumes.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold">Processed Resumes</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Processing Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processedResumes.map((resume, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {resume.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {resume.contact?.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${resume.status === 'completed' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {resume.status === 'completed' && <CheckCircle className="mr-1" size={12} />}
                                                {resume.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {resume.processingTime ? `${resume.processingTime.toFixed(1)}s` : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeUploader;