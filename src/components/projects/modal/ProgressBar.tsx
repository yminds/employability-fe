// components/ProjectUploadModal/ProgressBar.tsx

"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200" />
      <div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-green-500 transition-all duration-300"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-semibold",
              index <= currentStep
                ? "border-green-500 text-green-500"
                : "text-gray-400"
            )}
          >
            {index < currentStep ? (
              <Check className="h-4 w-4" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
