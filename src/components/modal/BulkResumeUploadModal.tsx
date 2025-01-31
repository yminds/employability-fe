import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { uploadResume } from "@/store/slices/resumeSlice";
import ResumeUploadProgressModal from "./ResumeUploadProgressModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { useUploadResumeMutation } from "@/api/resumeUploadApiSlice";
import { X, Upload } from "lucide-react";
import { ProfileFormData } from "@/features/profile/types";

interface ResumeUploadModalProps {
  onClose: () => void;
  onUpload: () => void;
  setSelectedFiles: (selectedFiles: any[]) => void;
  setIsUploadModalOpen: (value: boolean) => void;
  setIsParsingComplete: (value: boolean) => void;
}

const BulkResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  onClose,
  setSelectedFiles,
  setIsUploadModalOpen,
  setIsParsingComplete
}) => {
  const dispatch = useDispatch();
  const { uploading, error } = useSelector((state: RootState) => state.resume);

  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<{
    file?: File;
    progress: number;
  }>({ progress: 0 });
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        // startUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files }: any = e.target;
    // console.log(typeof e?.target.files[0]);

    if (e.target.files) {
      setSelectedFiles([])
      setIsUploadModalOpen(false);
      setIsParsingComplete(false)
      setSelectedFiles(files);
    }
    // if (e.target.files && e.target.files[0]) {
    //   const file = e.target.files[0];
    //   if (file.type === "application/pdf") {
    //     startUpload(file);
    //   }
    // }
  };

  const startUpload = async (file: File) => {
    setUploadState({ file, progress: 0 });

    const simulatedProgress = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 90) {
          clearInterval(simulatedProgress);
          return prev;
        }
        return { ...prev, progress: prev.progress + 5 };
      });
    }, 300);

    try {
      // First dispatch the Redux action to handle resume parsing
      //   await dispatch(uploadResume({ file, userId })).unwrap();

      const formData = new FormData();
      formData.append("file", file); // This will be req.file in controller
      formData.append("folder", "resume"); // This will be req.body.fileType
      formData.append("name", file.name); // This will be req.body.name

      //   const s3Response = await fetch("http://localhost:3000/api/v1/s3/upload", {
      //     method: "POST",
      //     body: formData, // Don't set Content-Type header, browser will set it
      //   });

      //   console.log("S3 response", s3Response);

      //   if (!s3Response.ok) {
      //     throw new Error("Failed to upload to S3");
      //   }

      // Smoothly complete progress to 100% after both operations are done
      setUploadState((prev) => ({ ...prev, progress: 100 }));
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadState((prev) => ({ ...prev, progress: 0 }));
    } finally {
      clearInterval(simulatedProgress);
    }
  };

  if (uploadState.file) {
    return (
      <ResumeUploadProgressModal
        onClose={onClose}
        fileName={uploadState.file.name}
        fileSize={`${(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB`}
        uploadProgress={uploadState.progress}
        isUploading={uploading}
        onContinue={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Upload your Resumes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-blue-200"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <p className="text-gray-600 text-center mb-2">
            Drag and drop a PDF, or
          </p>
          <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
            Select from files
            <input
              multiple
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BulkResumeUploadModal;
