import type React from "react";

interface UploadProgressBarProps {
  progress: number;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full mt-2 flex items-center">
      <div className="flex-grow bg-gray-200 rounded-full h-1 mr-2">
        <div
          className="bg-green-500 h-1 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-[40px] text-right">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export default UploadProgressBar;
