import React from "react";
import { Edit, MapPin } from "lucide-react";

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
  workplace_type?: string;
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
      <div className="bg-white rounded-lg border border-[#d6d7d9] p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#d6d7d9] overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex gap-3">
          {/* Company logo/icon */}
          <div className="w-[50px] h-[50px] relative bg-[#ecedef] rounded-full overflow-hidden">
            <div className="w-[69px] h-[73px] left-[-9px] top-[-6px] absolute">
              <div className="w-[69px] h-[73px] left-0 top-0 absolute" />
              <div className="w-[31px] h-[40px] left-[19px] top-[17px] absolute">
                <div className="w-[21px] h-[40px] left-0 top-0 absolute bg-[#cdead9]" />
                <div className="w-[21px] h-[21px] left-[9.5px] top-[18.5px] absolute bg-[#bbddc9]" />
                <div className="w-[17px] h-[12px] left-[2.2px] top-[2.5px] absolute inline-flex flex-col justify-start items-start gap-[2.3px]">
                  <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                  <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                  <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                  <div className="self-stretch h-[1.5px] bg-[#a6c4b2]" />
                </div>
              </div>
            </div>
          </div>

          {/* Job details */}
          <div className="inline-flex flex-col justify-center items-start gap-1">
            <div className="flex flex-col justify-start items-start gap-2">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="justify-center text-[#414447] text-lg font-medium leading-tight">
                  {jobDetails.title || "Job Title"}
                </div>
                <div className="flex flex-col justify-center items-start">
                  <div className="text-[#414447] text-sm font-normal leading-relaxed tracking-tight">
                    {jobDetails.company?.name || "Company Name"}
                  </div>
                </div>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <MapPin className="w-4 h-4 text-[#68696b]" />
                <div className="text-[#68696b] text-sm font-normal leading-normal tracking-tight">
                  {jobDetails.location || "Location not specified"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="text-[#001630]"
          onClick={onViewDetails}
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {/* Job Metadata */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">Location</div>
            <div className="text-[#414447] text-sm font-medium">
              {jobDetails.location || "Not specified"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">Job Type</div>
            <div className="text-[#414447] text-sm font-medium">
              {jobDetails.job_type || "Not specified"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">Workplace Type</div>
            <div className="text-[#414447] text-sm font-medium">
              {jobDetails.workplace_type || "Not specified"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[#68696b] text-xs font-normal">Job Experience Level</div>
            <div className="text-[#414447] text-sm font-medium">
              {jobDetails.experience_level || "Not specified"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsCard;