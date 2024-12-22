import React, { useState } from "react";
import { X } from "lucide-react";

interface ResumeUploadModalProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function ResumeUploadModal({
  onClose,
  onUpload,
}: ResumeUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<{
    file?: File;
    progress?: number;
  }>({});

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
        setUploadState({ file, progress: 0 });
        // Simulate upload progress
        simulateUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setUploadState({ file, progress: 0 });
        // Simulate upload progress
        simulateUpload(file);
      }
    }
  };

  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadState((prev) => ({ ...prev, progress }));
      if (progress >= 100) {
        clearInterval(interval);
        onUpload(file);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Upload your Resume</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!uploadState.file ? (
          <>
            <div
              className={`
                border-2 border-dashed rounded-lg p-12
                flex flex-col items-center justify-center
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-blue-200"}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12  flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="56"
                  viewBox="0 0 48 56"
                  fill="none"
                >
                  <path
                    d="M36.9164 50.0963L1.12681 50.1021C0.508748 50.1022 0.00814383 49.6016 0.00804738 48.9835L1.39316e-08 1.12328C-9.64333e-05 0.505215 0.500546 0.00462086 1.11861 0.00452442L23.1652 0.00081653L38.0304 14.9838L38.0357 48.9772C38.0358 49.5953 37.5344 50.0962 36.9164 50.0963Z"
                    fill="#EBEBEB"
                  />
                  <path
                    d="M38.0304 14.9838L23.1661 2.75095e-06L21.9961 0L21.9988 18.2697L38.0312 18.2672L38.0304 14.9838Z"
                    fill="#E0E0E0"
                  />
                  <path
                    d="M38.0304 14.8603L23.1681 14.8628L23.1661 2.75095e-06L38.0304 14.8603Z"
                    fill="#F5F5F5"
                  />
                  <path
                    d="M33.0528 38.3231C24.2295 38.3245 15.4062 38.3258 6.58284 38.3272C4.80146 38.3274 4.53147 41.1019 6.32427 41.1013C15.1476 41.1 23.9709 41.0986 32.7942 41.0972C34.5756 41.097 34.8459 38.3231 33.0528 38.3231Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M6.32145 24.3244C15.1448 24.323 23.9681 24.3216 32.7914 24.3203C34.5728 24.32 34.8428 21.5455 33.05 21.5461C24.2267 21.5475 15.4033 21.5489 6.58002 21.5502C4.79796 21.5508 4.52797 24.3253 6.32145 24.3244Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M6.25252 32.9703C15.0758 32.9689 23.8992 32.9676 32.7232 32.9659C34.5045 32.9656 34.7745 30.1911 32.9817 30.1917C24.1584 30.1931 15.3351 30.1944 6.51109 30.1961C4.72972 30.1964 4.45973 32.9709 6.25252 32.9703Z"
                    fill="#FAFAFA"
                  />
                  <rect
                    x="21.75"
                    y="30"
                    width="25.5"
                    height="25.5"
                    rx="12.75"
                    fill="#10B754"
                  />
                  <path
                    d="M34.5 47.8125C34.5 47.2125 34.5 40.8125 34.5 37.6875M34.5 37.6875L30.375 41.8125M34.5 37.6875L38.625 41.8125"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
              </div>
              <p className="text-gray-600 text-center mb-2">
                drag and drop as a pdf or
              </p>
              <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                select from files
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-700 text-sm font-medium">PDF</span>
                </div>
                <div>
                  <p className="font-medium">{uploadState.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round(uploadState.file.size / 1024 / 1024)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadState({})}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-600 mt-1">
              {uploadState.progress}%
            </p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 transition-colors">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
