import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUp, X } from "lucide-react";
import File from "@/assets/job-posting/file.svg";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function ResumeUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ResumeUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input click
    setFile(null);
  };

  // Format file size to KB or MB
  const formatFileSize = (size: number): string => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] p-6 gap-0 rounded-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-h2 text-left text-black">
            Upload your Resume
          </DialogTitle>
        </DialogHeader>

        {!file ? (
          // Drag and drop area when no file is selected
          <div
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer mb-6 ${
              isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 mb-4 relative">
              <img src={File} alt="File" />
              <div className="absolute bottom-2 right-3 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                <ArrowUp className="text-white w-3 h-3" />
              </div>
            </div>

            <p className="text-gray-700 text-body2 text-sm mb-2">
              drag and drop as a pdf or
            </p>
            <button className="text-green-500 text-body2 text-sm font-medium underline">
              select from files
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          // Display selected file details
          <div className="border-2 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-16 flex-shrink-0 bg-gray-100 rounded-sm flex items-center justify-center mr-4">
                <span className="text-xs text-gray-500">PDF</span>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 p-1"
                onClick={handleRemoveFile}
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="text-green-500 border-green-500 hover:bg-green-50"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose a different file
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!file}
            className={`px-8 py-2 rounded-md ${
              file
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}