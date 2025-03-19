import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ResumeUploadProgressModal from "./ResumeUploadProgressModal";
import { Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUploadResumeMutation } from "@/api/resumeUploadApiSlice";
import { toast } from "sonner";

// Assets
import VectorFile from "@/assets/profile/completeprofile/file.svg";
import UploadFileArrow from "@/assets/profile/completeprofile/uploadfile.svg";
import LinkedinInstruction from "@/assets/images/Frame 1410077928.png";
import { updateUserProfile } from "@/features/authentication/authSlice";

interface UnifiedUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  goalId: string;
}

const UnifiedUploadModal: React.FC<UnifiedUploadModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const dispatch = useDispatch();
  const [uploadResume] = useUploadResumeMutation();
  const [activeTab, setActiveTab] = useState<"resume" | "linkedin">("resume");
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<{
    file?: File;
    progress: number;
  }>({ progress: 0 });
  const [resume, setResume] = useState({
    resumeUrl: "",
  });

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
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", userId);
      formData.append("folder", activeTab === "resume" ? "resume" : "linkedin");
      formData.append("name", file.name);

      const s3Response = await fetch(
        `${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!s3Response.ok) {
        throw new Error("Failed to upload to S3");
      }

      const result = await s3Response.json();
      setResume({ resumeUrl: result.data[0].fileUrl });
      setUploadState((prev) => ({ ...prev, progress: 100 }));
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadState((prev) => ({ ...prev, progress: 0 }));
    } finally {
      clearInterval(simulatedProgress);
    }
  };

  const handleContinue = async () => {
    if (uploadState.file) {
      try {
        const response = await uploadResume({
          file: uploadState.file,
          userId,
          fileUrl: resume.resumeUrl,
        });
        const parsedData = response.data;
        dispatch(
          updateUserProfile({
            parsedResume: parsedData.data.parsedData,
            resume_s3_url: resume.resumeUrl,
          })
        );
        toast.success("Resume Uploaded Successfully");
      } catch (error) {
        console.error("Error parsing file:", error);
      }
    }
  };

  const removeFile = async () => {
    try {
      if (resume.resumeUrl && userId) {
        const bucketBaseUrl =
          "https://employability-user-profile.s3.us-east-1.amazonaws.com/";
        const key = resume.resumeUrl.replace(bucketBaseUrl, "");

        const response = await fetch(
          `${process.env.VITE_API_BASE_URL}/api/v1/s3/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key,
              userId: userId,
              folder: activeTab === "resume" ? "resume" : "linkedin",
            }),
          }
        );

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

  if (uploadState.file) {
    return (
      <ResumeUploadProgressModal
        isOpen={isOpen}
        onClose={onClose}
        fileName={uploadState.file.name}
        fileSize={`${(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB`}
        uploadProgress={uploadState.progress}
        isUploading={uploadState.progress < 100}
        onContinue={handleContinue}
        onRemove={removeFile}
        uploadType={activeTab}
      />
    );
  }

  const ResumeUploadContent = () => (
    <div
      className={`flex flex-col justify-center items-center h-80 gap-4 self-stretch rounded-xl border border-dashed border-gray-400 ${
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
        <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2">
          <img
            src={UploadFileArrow || "/placeholder.svg"}
            alt="Upload arrow"
            className="w-4 h-4"
          />
        </div>
      </div>
      <p className="text-black text-center font-sf-pro text-base leading-6">
        Drag and drop a pdf or
      </p>
      <label className="text-emerald-700 font-sf-pro text-sm leading-6 underline underline-offset-2 cursor-pointer hover:text-emerald-600">
        Select from files
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileInput}
        />
      </label>
    </div>
  );

  const LinkedInUploadContent = () => (
    <div className="space-y-8 p-4">
      <div className="space-y-4">
        <div className="flex gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
            1
          </span>
          <p className="text-black font-sf-pro text-base leading-6">
            Go to your{" "}
            <a
              href="https://linkedin.com/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn profile
            </a>{" "}
            and download your profile as shown below.
          </p>
        </div>
        <div>
          <img
            src={LinkedinInstruction}
            alt="LinkedIn profile download instructions"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
            2
          </span>
          <p className="text-black font-sf-pro text-base leading-6">
            Upload the downloaded PDF by clicking the button below.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload LinkedIn profile
            <input
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

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-white rounded-[10px] max-w-4xl p-0 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 p-4 border-r border-gray-200 rounded-l-[20px]">
          <h2 className="text-lg font-medium text-gray-900 mb-4 px-2">
            Upload Options
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("resume")}
              className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
                activeTab === "resume"
                  ? "text-[#00183D] font-semibold bg-white border-r-2 border-[#00183D]"
                  : "text-[#68696B] hover:text-[#00183D] hover:bg-gray-50"
              }`}
            >
              Resume Upload
            </button>
            <button
              onClick={() => setActiveTab("linkedin")}
              className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
                activeTab === "linkedin"
                  ? "text-[#00183D] font-semibold bg-white border-r-2 border-[#00183D]"
                  : "text-[#68696B] hover:text-[#00183D] hover:bg-gray-50"
              }`}
            >
              LinkedIn Import
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 rounded-r-[20px]">
          <h3 className="text-xl font-medium text-gray-900 mb-6">
            {activeTab === "resume"
              ? "Upload your Resume"
              : "Import your profile from LinkedIn"}
          </h3>
          {activeTab === "resume" ? (
            <ResumeUploadContent />
          ) : (
            <LinkedInUploadContent />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedUploadModal;
