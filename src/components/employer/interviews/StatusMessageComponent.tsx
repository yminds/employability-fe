// components/StatusMessage.tsx
import React from "react";

interface StatusMessageProps {
  type: "loading" | "error" | "empty";
  error?: any;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ type, error }) => {
  switch (type) {
    case "loading":
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <p className="text-[#666666] font-medium">Loading candidates...</p>
          </div>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <p className="text-red-500 font-medium">Failed to load candidates</p>
            <p className="text-[#666666] mt-2">
              {typeof error === "string"
                ? error
                : "An error occurred while fetching candidates"}
            </p>
          </div>
        </div>
      );
    case "empty":
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <p className="text-[#666666] font-medium">No candidates found</p>
            <p className="text-[#909091] mt-2">Try adjusting your filters</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};