"use client";
import { Edit, PenIcon } from "lucide-react";

// API response shape - adjust field names based on your actual API
interface JobDetailsData {
  _id?: string;
  title?: string;
  company?: {
    _id?: string;
    name?: string;
  };
  location?: string;
  job_type?: string;
  work_place_type?: string;
  experience_level?: string;
  // Any other fields from your API
}

interface JobDetailsCardProps {
  jobDetails?: JobDetailsData;
  onViewDetails: () => void;
}

const JobDetailsCard = ({ jobDetails, onViewDetails }: JobDetailsCardProps) => {
  // If job details aren't loaded yet, show a loading state
  if (!jobDetails) {
    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-6 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-[70px] h-[70px] bg-[#eceef0] rounded-full animate-pulse"></div>
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-3">
                <div className="h-8 bg-[#eceef0] rounded w-[180px] animate-pulse"></div>
                <div className="h-7 bg-[#eceef0] rounded-full w-[100px] animate-pulse"></div>
              </div>
              <div className="h-5 bg-[#eceef0] rounded w-[250px] animate-pulse"></div>
            </div>
          </div>
          <div className="w-9 h-9 bg-[#eceef0] rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex gap-4">
          {/* Company logo/icon */}
          <div className="w-[70px] h-[70px] relative bg-[#ebfff3] rounded-full overflow-hidden flex items-center justify-center">
            <div className="w-[36px] h-[47px] relative">
              <div className="w-[24px] h-[47px] absolute left-0 top-0 bg-[#cdead9]" />
              <div className="w-[24px] h-[24px] absolute left-[11px] top-[22px] bg-[#bbddc9]" />
              <div className="w-[20px] h-[14px] absolute left-[2.5px] top-[3px] flex flex-col justify-start items-start gap-[2.7px]">
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.7px] bg-[#a6c4b3]" />
              </div>
            </div>
          </div>

          {/* Job details */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-[#414447] text-[18px] font-medium font-ubuntu leading-8 tracking-[-0.3px]">
                {jobDetails.title || "Job Title"}
              </h2>
              {jobDetails.experience_level && (
                <span className="px-3 py-1 bg-[#eceef0] text-[#414447] text-[14px] font-medium leading-5 tracking-[0.07px] rounded-full">
                  {jobDetails.experience_level}
                </span>
              )}
            </div>

            <div className="flex items-center text-[#68696b] text-body2">
              <span>{jobDetails.company?.name || "Company Name"}</span>
              {jobDetails.location && (
                <>
                  <span className="mx-2">|</span>
                  <span>{jobDetails.location}</span>
                </>
              )}
              {jobDetails.work_place_type && (
                <>
                  <span className="mx-2">|</span>
                  <span>{jobDetails.work_place_type}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          className="text-[#10b754] bg-[#ebfff3] p-2 rounded-full transition-colors"
          onClick={onViewDetails}
        >
          <PenIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default JobDetailsCard;
