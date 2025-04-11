import { Button } from "@/components/ui/button";
import Level from "@/assets/job-posting/level.svg";
import Location from "@/assets/job-posting/location.svg";
import WorkPlaceType from "@/assets/job-posting/workPlaceType.svg";
import JobType from "@/assets/job-posting/jobType.svg";
import { useState } from "react";
import ApplicationModal from "./ApplicationModal";

interface JobInfoProps {
  jobDetails: any;
}

// Helper function to format job type
const formatJobType = (jobType: string): string => {
  if (!jobType) return "Job Type";
  const formattedType = jobType.replace(/-/g, " ");
  return (
    formattedType.charAt(0).toUpperCase() + formattedType.slice(1).toLowerCase()
  );
};

// Helper function to format workplace type
const formatWorkplaceType = (workplaceType: string): string => {
  if (!workplaceType) return "Workplace Type";
  if (workplaceType === "on-site") {
    return "Onsite";
  }
  return (
    workplaceType.charAt(0).toUpperCase() + workplaceType.slice(1).toLowerCase()
  );
};

export default function JobInfo({ jobDetails }: JobInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Job details
  const title = jobDetails?.title;
  const experience_level = jobDetails?.experience_level;
  const location = jobDetails?.location;
  const work_place_type = jobDetails?.work_place_type;
  const job_type = jobDetails?.job_type;
  const skills = jobDetails?.skills_required || [];

  // Company details
  const company_name = jobDetails?.company.name;

  const formattedJobType = formatJobType(job_type);
  const formattedWorkPlaceType = formatWorkplaceType(work_place_type);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        {/* Job Header - Title and Apply Button */}
        <div className="flex md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.3px] text-[#414447] mb-4 md:mb-0">
            {title}
          </h1>
          <div className="flex items-center gap-4">
            <Button
              className="bg-[#001630] hover:bg-[#00183d] text-body2 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Apply now
            </Button>
          </div>
        </div>

        {/* Job Metadata - Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <img src={Level} alt="Level" className="w-4 h-4" />
            <span className="text-[14px] leading-6 tracking-[0.07px] text-gray-600">
              {experience_level
                ? experience_level.charAt(0).toUpperCase() +
                  experience_level.slice(1).toLowerCase() +
                  " Level"
                : "Experience Level"}
            </span>
          </div>
          <div className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <img src={Location} alt="Location" className="w-4 h-4" />
            <span className="text-[14px] leading-6 tracking-[0.07px] text-gray-600">
              {location}
            </span>
          </div>
          <div className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <img src={WorkPlaceType} alt="WorkPlaceType" className="w-4 h-4" />
            <span className="text-[14px] leading-6 tracking-[0.07px] text-gray-600">
              {formattedWorkPlaceType}
            </span>
          </div>
          <div className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <img src={JobType} alt="JobType" className="w-4 h-4" />
            <span className="text-[14px] leading-6 tracking-[0.07px] text-gray-600">
              {formattedJobType}
            </span>
          </div>
        </div>

        {/* Skills List */}
        <div className="mb-2">
          <h3 className="text-[16px] leading-6 tracking-[0.07px] font-medium text-gray-800 mb-3">
            Skills required
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, index: number) => (
              <div
                key={index}
                className="bg-[#E7EFEB] text-[#03963F] px-3 py-1.5 rounded-[33px] text-sm"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyName={company_name}
        jobId={jobDetails?._id}
      />
    </>
  );
}
