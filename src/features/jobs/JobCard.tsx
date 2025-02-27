import React from "react";
import type { Job, Skill } from "@/pages/JobsPage";

interface JobCardProps {
  job: Job;
  preferedLocations: string[];
  userSkills: string[];
  userExperience: number;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  preferedLocations,
  userSkills,
  userExperience,
  onApply,
}) => {
  const {
    title,
    company,
    type,
    locations,
    skills,
    logo,
    salaryRange,
    minimumExperience,
  } = job;

  const requiredSkills = skills.length;
  const matchedSkills = skills.filter((skill: Skill) =>
    userSkills.includes(skill._id)
  ).length;
  const matchPercentage = Math.floor((matchedSkills / skills.length) * 100) | 0;
  const minimumMatchPercentage = 60;
  const inpreferedLocations = preferedLocations.length
    ? locations.some((loc) => preferedLocations.includes(loc))
    : true;

  const needSuggestions = () => {
    if (skills.length > 0 && userSkills.length > 0) return true;
    if (minimumExperience > userExperience) return true;
    if (!inpreferedLocations) return true;

    return false;
  };

  return (
    <div className="bg-white py-[36px] px-[42px] flex flex-col gap-4 content-center w-full  rounded-[8px] items-stretch">
      <div className="flex flex-row  justify-between ">
        <div className="flex flex-row gap-[14px] text-left">
          <img
            className="w-[48px] h-[48px] px-[9px] py-[10px] rounded-full bg-gray-100 center "
            src={logo}
            alt="logo"
          ></img>

          <div className="flex flex-col gap-[4px]">
            <p className="text-black text-sub-header">{title}</p>

            <div className="">
              <p className="text-body2 text-[#414447]">
                {company} {type && `• ${type}`}{" "}
                {salaryRange && `• ${salaryRange}`}
              </p>
              <p className="text-[14px] font-normal tracking-[0.21px] leading-[24px] text-[#68696B]">
                {locations
                  .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                  .join(",")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-[32px] items-center">
          {skills.length > 0 && (
            <div className="text-right  items-center">
              <p
                className={`text-xl font-ubuntu font-bold leading-[18px] ${
                  matchPercentage >= 60 ? "text-[#10B754]" : "text-[#AA040F]"
                } `}
              >
                {matchPercentage}%
              </p>
              <p className="text-sm text-[#0C0F12]">match</p>
            </div>
          )}
          <div className="flex flex-col gap-4 items-stretch">
            <button
              className="px-[20px] py-[8px] w-[141px] ring-1- h-10 border rounded text-black text-body2 border-black/20  "
              onClick={onApply}
            >
              Apply now
            </button>
          </div>
        </div>
      </div>

      {/* // jobs and skill match section */}

      {needSuggestions() && (
        <div className="h-[46px] px-6 py-5 bg-[#ddf8e8]/50 rounded-[9px] justify-start items-center  gap-2.5 inline-flex">
          <img className="w-[14.30px] h-[14.60px] " src="/logo.svg" />
          <div className="inline-block ">
            {(job.skills.length > 0 || true) && (
              <>
                <span className="text-[#67696b] text-sm font-normal font-dm-sans leading-normal tracking-[0.21px]">
                  You have
                </span>
                <span
                  className={`text-sm font-medium font-dm-sans leading-normal tracking-[0.21px] ${
                    matchPercentage >= minimumMatchPercentage
                      ? "text-[#03963e]"
                      : "text-[#CF0C19]"
                  } `}
                >
                  {" "}
                  {matchedSkills}/{requiredSkills} skills
                </span>
                <span className="text-[#67696b] text-sm font-normal font-dm-sans leading-normal tracking-[0.21px]t">
                  {" "}
                  required for this job.
                </span>
              </>
            )}

            {(!inpreferedLocations || userExperience < minimumExperience) && (
              <>
                <span className="text-[#67696b] text-sm font-normal font-dm-sans leading-normal tracking-[0.21px]">
                  This job is{" "}
                </span>

                {!inpreferedLocations && (
                  <span className="text-[#cf0c19] text-sm font-medium font-dm-sans leading-normal tracking-[0.21px]">
                    not in preferred locations{" "}
                  </span>
                )}

                {!inpreferedLocations && userExperience < minimumExperience && (
                  <span className="text-[#cf0c19] text-sm font-medium font-dm-sans leading-normal tracking-[0.21px]">
                    and{" "}
                  </span>
                )}

                {userExperience < minimumExperience && (
                  <span className="text-[#cf0c19] text-sm font-medium font-dm-sans leading-normal tracking-[0.21px]">
                    for someone {minimumExperience - userExperience}+ years
                    experienced than you
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
