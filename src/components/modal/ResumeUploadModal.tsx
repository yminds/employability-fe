import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { resetResumeState, uploadResume } from "@/store/slices/resumeSlice";
import ResumeUploadProgressModal from "./ResumeUploadProgressModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { useUploadResumeMutation } from "@/api/resumeUploadApiSlice";
import { X, Upload } from "lucide-react";
import { ProfileFormData } from "@/features/profile/types";
import axios from "axios";
import { updateUserProfile } from "@/features/authentication/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

//Images
import VectorFile from "@/assets/profile/completeprofile/file.svg";
import UploadFileArrow from "@/assets/profile/completeprofile/uploadfile.svg";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
  userId: string;
  goalId: string;
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  userId,
  goalId,
}) => {
  const dispatch = useDispatch();
  const { uploading, error } = useSelector((state: RootState) => state.resume);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<{
    file?: File;
    progress: number;
  }>({ progress: 0 });
  const [uploadResume] = useUploadResumeMutation();
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [resume, setResume] = useState({
    resumeUrl: "",
  });
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [parsedData, setParsedData] = useState(null);

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
        startUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        startUpload(file);
      }
    }
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
      // await dispatch(uploadResume({ file, userId })).unwrap();

      // Then make the S3 upload call using FormData
      const formData = new FormData();
      formData.append("files", file); // This will be req.file in controller
      formData.append("userId", userId); // This will be req.body.userId
      formData.append("folder", "resume"); // This will be req.body.fileType
      formData.append("name", file.name); // This will be req.body.name

      const s3Response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`, {
        method: "POST",
        body: formData, // Don't set Content-Type header, browser will set it
      });

      if (!s3Response.ok) {
        throw new Error("Failed to upload to S3");
      }

      const result = await s3Response.json();

      setResume({ resumeUrl: result.data[0].fileUrl });

      // Smoothly complete progress to 100% after both operations are done
      setUploadState((prev) => ({ ...prev, progress: 100 }));
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadState((prev) => ({ ...prev, progress: 0 }));
    } finally {
      clearInterval(simulatedProgress);
    }
  };

  const removeFile = async () => {
    try {
      if (resume.resumeUrl && userId) {
        const bucketBaseUrl =
          "https://employability-user-profile.s3.us-east-1.amazonaws.com/";
        const key = resume.resumeUrl.replace(bucketBaseUrl, "");
        console.log("Deleting image with key:", key, "for user:", userId);
        const response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/s3/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            userId: userId,
            folder: "resume",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete file from S3");
        }
      }

      setResume({ resumeUrl: "" });
      setUploadState(() => ({ progress: 0 }));
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const handleContinue = async () => {
    if (uploadState.file) {
      try {
        const formData = new FormData();
        formData.append("resume", uploadState.file);
        formData.append("userId", userId);

        const response = await uploadResume({ file: uploadState.file, userId });
        const parsedData = response.data
        setParsedData(parsedData.data.parsedData);
        console.log("Parsed Data", parsedData);

        // dispatch(updateUserProfile({ parsedData: parsedData.data.parsedData }));
        dispatch(resetResumeState({parsedData: parsedData.data.parsedData}))

        setShowCompleteProfile(true);
      } catch (error) {
        console.error("Error parsing resume:", error);
      }
    }
  };

  // Update progress to 100% when upload completes and show CompleteProfileModal
  useEffect(() => {
    if (!uploading && uploadState.file) {
      setUploadState((prev) => ({ ...prev, progress: 100 }));
      // Add a small delay before showing the CompleteProfileModal
      setTimeout(() => {
        setShowCompleteProfile(true);
      }, 500);
    }
  }, [uploading]);

  if (showCompleteProfile) {
    return (
      <CompleteProfileModal
        type="resumeUpload"
        onClose={onClose}
        userId={userId}
        onSave={() => console.log("")}
        parsedData={parsedData}
        isParsed={true}
        goalId={goalId}
      />
    );
  }

  if (uploadState.file) {
    return (
      <ResumeUploadProgressModal
        isOpen={isOpen}
        onClose={onClose}
        fileName={uploadState.file.name}
        fileSize={`${(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB`}
        uploadProgress={uploadState.progress}
        isUploading={uploading}
        onContinue={handleContinue}
        onRemove={removeFile}
        uploadType="resume"
      />
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white rounded-lg max-w-2xl p-[42px] flex flex-col justify-center">
        <DialogHeader className="w-full flex justify-between items-start">
          <DialogTitle className="text-black text-[20px] font-medium leading-[26px] tracking-[-0.2px] font-ubuntu mb-2">
            Upload your Resume
          </DialogTitle>
        </DialogHeader>
        <div
          className={`flex flex-col justify-center items-center h-[222px] gap-4 self-stretch rounded-[13px] border border-dashed border-[#909091] ${
            dragActive ? "border-blue-500 bg-blue-50" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="relative mb-4">
            <img
              src={VectorFile || "/placeholder.svg"}
              alt="Upload"
              className="w-16 h-16 opacity-80"
            />
            <div className="absolute -bottom-2 -right-2 bg-[#10b754] rounded-full p-2">
              <img
                src={UploadFileArrow || "/placeholder.svg"}
                alt="Upload arrow"
                className="w-4 h-4"
              />
            </div>
          </div>
          <p className="text-[#000] text-center font-sf-pro text-[15px] font-normal leading-[24px] tracking-[0.21px]">
            Drag and drop a pdf or
          </p>
          <label className="text-[#03963F] font-sf-pro text-[14px] font-normal leading-[24px] tracking-[0.21px] underline underline-offset-2 cursor-pointer hover:text-[#03963F]/90">
            Select from files
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadModal;
