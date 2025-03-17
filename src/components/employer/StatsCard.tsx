import React from "react";

interface StatsCardsProps {
  candidatesCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ candidatesCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        {/* Applicants */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-24 mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mr-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7H17"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12H17"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 17H12"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Applicants</span>
              <div className="text-xl font-semibold mt-1">
                {candidatesCount || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Interviews */}
        <div className="max-w-xs mb-3.5 p-5 bg-white rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e4defd]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H15L12 19L9 16Z"
                  stroke="#8a73ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-sm text-[#4c4c4c]">Interviews</span>
              <div className="text-[20px] font-semibold leading-6 tracking-[-0.06px] text-[#0d0d0d]">
                30
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between">
              <div className="text-[#4c4c4c] text-[14px] font-normal">
                Completed
              </div>
              <div className="text-[14px] font-bold text-[#0d0d0d]">
                10
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-[#4c4c4c] text-[14px] font-normal">
                Not Started
              </div>
              <div className="text-[14px] font-bold text-[#0d0d0d]">
                8
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Screenings */}
        <div className="max-w-xs mb-3.5 p-5 bg-white rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e4defd]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="2"
                  width="16"
                  height="20"
                  rx="2"
                  stroke="#8a73ff"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2"
                  stroke="#8a73ff"
                  strokeWidth="2"
                />
                <path
                  d="M16 16C16 13.7909 14.2091 12 12 12C9.79086 12 8 13.7909 8 16"
                  stroke="#8a73ff"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <span className="text-sm text-[#4c4c4c]">Screenings</span>
              <div className="text-[20px] font-semibold leading-6 tracking-[-0.06px] text-[#0d0d0d]">
                30
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between">
              <div className="text-[#4c4c4c] text-[14px] font-normal">
                Completed
              </div>
              <div className="text-[14px] font-bold text-[#0d0d0d]">
                10
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-[#4c4c4c] text-[14px] font-normal">
                Not Started
              </div>
              <div className="text-[14px] font-bold text-[#0d0d0d]">
                10
              </div>
            </div>
          </div>
        </div>

        {/* In Pipeline */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-24">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">In Pipeline</span>
              <div className="text-xl font-semibold mt-1">123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;