import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import ResumeUploadProgressModal from "./ResumeUploadProgressModal";
import { useDispatch } from "react-redux";
import { resetResumeState } from "@/store/slices/resumeSlice";

// LinkedInImportModal Component
const LinkedInImportModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const dispatch = useDispatch();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        // Await the dispatch of resetResumeState
        await dispatch(resetResumeState());

        // Proceed with the file upload logic
        console.log("File uploaded:", selectedFile);
        setIsProgressModalOpen(true);
      } catch (error) {
        console.error("Error resetting resume state:", error);
        alert("An error occurred while resetting the resume state.");
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            Import your profile from LinkedIn
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
                1
              </span>
              <p className="text-gray-900">
                Go to your{" "}
                <a
                  href="https://linkedin.com/profile"
                  className="text-blue-600 hover:underline"
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
                src="src/assets/images/Frame 1410077928.png"
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
              <p className="text-gray-900">
                Upload the downloaded PDF by clicking the button below.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload LinkedIn profile
              </label>
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <span className="text-gray-600">{selectedFile.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>

        {isProgressModalOpen && (
          <ResumeUploadProgressModal
            onClose={() => setIsProgressModalOpen(false)}
            fileName={selectedFile?.name}
            fileSize={selectedFile?.size}
            uploadProgress={0} onContinue={function (): void {
              throw new Error("Function not implemented.");
            } } isUploading={undefined}          />
        )}
      </div>
    </div>
  );
};

export default LinkedInImportModal;
