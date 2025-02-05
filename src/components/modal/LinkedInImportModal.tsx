import type React from "react";
import { useState, useCallback } from "react";
import { X, Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetResumeState } from "@/store/slices/resumeSlice";
import ResumeUploadProgressModal from "./ResumeUploadProgressModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { updateUserProfile } from "@/features/authentication/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadResumeMutation } from "@/api/resumeUploadApiSlice";
import { DialogClose } from "@radix-ui/react-dialog";
import LinkedinInstruction from "@/assets/images/Frame 1410077928.png"

interface LinkedInImportModalProps {
  onClose: () => void;
  userId: string;
  goalId: string;
}

const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  onClose,
  userId,
  goalId,
}) => {
  const dispatch = useDispatch();
  const [uploadResume] = useUploadResumeMutation();
  const [uploadState, setUploadState] = useState<{
    file?: File;
    progress: number;
  }>({ progress: 0 });
  const [resume, setResume] = useState({
    resumeUrl: "",
  });
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (file.type === "application/pdf") {
          startUpload(file);
        }
      }
    },
    []
  );

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
      formData.append("folder", "linkedin");
      formData.append("name", file.name);

      const s3Response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`, {
        method: "POST",
        body: formData,
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
        dispatch(resetResumeState({ parsedData: parsedData.data.parsedData }));

        setShowCompleteProfile(true);
      } catch (error) {
        console.error("Error parsing LinkedIn profile:", error);
      }
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

  if (showCompleteProfile) {
    return (
      <CompleteProfileModal
        type="linkedinUpload"
        onClose={onClose}
        userId={userId}
        onSave={() => console.log("Save profile")}
        parsedData={parsedData}
        isParsed={true}
        goalId={goalId}
      />
    );
  }

  if (uploadState.file) {
    return (
      <ResumeUploadProgressModal
        isOpen={true}
        onClose={onClose}
        fileName={uploadState.file.name}
        fileSize={`${(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB`}
        uploadProgress={uploadState.progress}
        isUploading={uploadState.progress < 100}
        onContinue={handleContinue}
        onRemove={removeFile}
        uploadType="linkedin"
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-white rounded-lg max-w-2xl p-[42px] flex flex-col justify-center">
        <DialogHeader className="w-full flex justify-between items-start">
          <DialogTitle className="text-black text-[20px] font-medium leading-[26px] tracking-[-0.2px] font-ubuntu mb-2">
            Import your profile from LinkedIn
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
                1
              </span>
              <p className="text-[#000] font-sf-pro text-[15px] font-normal leading-[24px] tracking-[0.21px]">
                Go to your{" "}
                <a
                  href="https://linkedin.com/"
                  className="text-[#3888FF] hover:underline "
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

          {/* Step 2 */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
                2
              </span>
              <p className="text-[#000] font-sf-pro text-[15px] font-normal leading-[24px] tracking-[0.21px]">
                Upload the downloaded PDF by clicking the button below.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="linkedin-file-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload LinkedIn profile
              </label>
              <input
                type="file"
                id="linkedin-file-upload"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedInImportModal;
