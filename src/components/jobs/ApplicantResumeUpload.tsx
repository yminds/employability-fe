import React, { useState, useRef } from 'react';
import axios from 'axios';

interface ResumeUploadProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  companyId: string;
  onUploadSuccess: (candidateData: any, fileInfo: any) => void;
}

export const ApplicantResumeUpload: React.FC<ResumeUploadProps> = ({
  isOpen,
  onClose,
  jobId,
  companyId,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        setError('Only PDF files are allowed');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        setError('Only PDF files are allowed');
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First upload to S3
      const formData = new FormData();
      formData.append('files', file);
      formData.append('userId', 'tempUserId'); // Replace with actual user ID
      formData.append('folder', 'resumes');
      
      const uploadResponse = await axios.post('/api/files/upload', formData);
      
      if (!uploadResponse.data.success) {
        throw new Error('Failed to upload file');
      }
      
      const fileUrl = uploadResponse.data.data[0].fileUrl;
      const fileKey = uploadResponse.data.data[0].key;
      
      // Now save candidate with resume
      const candidateResponse = await axios.post('/api/candidates/upload-resume', {
        fileUrl,
        job_id: jobId,
        company_id: companyId
      });
      
      onUploadSuccess(candidateResponse.data.data.candidate, {
        originalName: file.name,
        size: file.size,
        url: fileUrl,
        key: fileKey
      });
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error uploading resume');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Upload your Resume</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <div className="p-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              
              <p className="mb-2">drag and drop as a pdf or</p>
              <button 
                className="text-green-500 hover:underline"
                onClick={handleBrowseClick}
              >
                select from files
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".pdf" 
                onChange={handleFileSelect}
              />
            </div>
          </div>
          
          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded flex items-center">
              <div className="bg-red-500 text-white p-1 rounded text-xs">PDF</div>
              <span className="ml-2 truncate">{file.name}</span>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-500">{error}</div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`px-6 py-2 rounded ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            {loading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};