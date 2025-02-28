import React, { useState } from "react";
import closeIcon from "@/assets/jobs/close.svg";
import errorIcon from "@/assets/jobs/error.svg";
import locationIcon from "@/assets/jobs/location.svg";
import employeeIcon from "@/assets/jobs/employee.svg";
import briefcaseIcon from "@/assets/jobs/briefcase.svg";
import DOMPurify from "dompurify";
import type { Job } from "@/pages/JobsPage";
import { useSelector } from "react-redux";
import { useGetJobSkillAnalysisQuery } from "@/api/jobsApiSlice";
import AIAnalysisSkeleton from "./ai-analysis-skeleton";
import AddSkillsModal from "@/components/skills/addskills";
import ChipsCardAddSkill from "./chipsCardAddSkill";
import { useSaveJobMutation } from "@/api/jobsApiSlice";
import { toast } from "sonner";

interface JobDetailsProps {
  jobData: Job;
  userSkills: string[];
  closeModal: () => void;
  goals: any;
  goalId: string | null;
}

interface Skill {
  id: string;
  name: string;
}

const JobDetailsModal: React.FC<JobDetailsProps> = ({
  jobData,
  userSkills,
  closeModal,
  goals,
  goalId,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any[]>([]);

  const { data: skillAnalysis, isLoading } = useGetJobSkillAnalysisQuery({
    jobId: jobData.id.toString(),
    userSkills,
    userSoftSkills: user.parsedResume.softSkills || [],
    userEducation: user.education,
    userExperience: user.experience,
  });
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();

  console.log("Skill analysis", skillAnalysis);

  const calculateMatch = () => {
    const requiredSkills = jobData.skills;
    const matchedSkills = requiredSkills.filter((item) =>
      userSkills.includes(item._id)
    );

    const matchpercentage =
      Math.floor((matchedSkills.length / requiredSkills.length) * 100) | 0;
    return matchpercentage;
  };

  const matchPercentage = calculateMatch();
  const minimumMatchPercentage = 60;

  const handleSaveJob = async () => {
    try {
      const response = await saveJob({
        jobId: jobData.id.toString(),
        userId: user._id,
      }).unwrap();
      toast.success(response.message);
    } catch (error: any) {
      console.error("Failed to save job:", error);
      toast.error(error.data.message);
    }
  };

  const handleCloseModal = () => {
    setIsAddSkillModalOpen(false);
    setSelectedSkill([]);
  };

  return (
    <div
      className="jobDetailsModal z-40 absolute top-0 left-0 bg-black/25 h-screen w-screen flex flex-row justify-end overflow-hidden "
      onClick={() => closeModal()}
    >
      <style>
        {`
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100%);
              
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideInFromRight {
            animation: slideInFromRight 0.4s ease-out;
          }
        `}
      </style>

      <div
        className="w-4/6 h-full p-[42px] bg-white flex flex-col gap-4 slide-out-to-left-full animate-slideInFromRight "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-8 h-[90%] ">
          {/* title */}
          <div className="flex justify-between items-center">
            <h3 className="text-[#191919] text-xl font-medium font-['Ubuntu'] leading-relaxed">
              {jobData.title}
            </h3>
            <img
              src={closeIcon}
              className="overflow-auto p-2.5 "
              onClick={() => {
                closeModal();
              }}
            ></img>
          </div>

          <div className="flex flex-col h-full gap-12 overflow-scroll scrollbar-hide">
            {/* company and job details */}
            <section className="flex flex-row gap-5 ">
              {/* about company and skils */}
              <div className="p-6 bg-[#f7f7f7] rounded-md   flex-col justify-start items-start gap-6 inline-flex w-7/12">
                <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-row gap-3">
                    <div className=" p-[7.5px] size-fit rounded-full bg-white">
                      <img
                        className="w-[15px] h-[15px]  center"
                        src={jobData.logo}
                      ></img>
                    </div>
                    <h3 className="text-[#191919] text-sub-header my-auto ">
                      {jobData.company}
                    </h3>
                  </div>

                  {jobData.skills.length > 0 && (
                    <div>
                      <span
                        className={`text-xl font-bold inline-block font-['Ubuntu'] leading-[20px] ${
                          matchPercentage >= minimumMatchPercentage
                            ? "text-[#10B754]"
                            : "text-[#cf0c19]"
                        }`}
                      >
                        {matchPercentage}%
                      </span>
                      <span className="text-[#0b0e12] text-sm font-['Ubuntu'] leading-[18px] font-normal">
                        {" "}
                        match
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-black text-sub-header">About</h3>
                  <p className="text-[#414447] text-body2">
                    {" "}
                    {jobData.aboutCompany ||
                      "We’re seeking a talented Full Stack Engineer to join our team. In this role, you will work across the entire stack, building scalable systems and crafting exceptional user experiences. "}
                  </p>
                </div>
                {/* skills */}

                {jobData.skills.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <h3 className="text-black text-sub-header">
                      Skills required
                    </h3>

                    <ul className="flex flex-wrap w-full gap-2 mt-3">
                      {/* skills that dont match with user */}
                      {jobData.skills
                        .filter((item) => !userSkills.includes(item._id))
                        .map((item) => (
                          <li
                            key={item._id}
                            className="inline-flex items-center gap-1 py-1 pl-2.5 pr-4 bg-[#CF0C19]/10 rounded-[33px] text-[#CF0C19] text-body2"
                          >
                            {" "}
                            <img
                              src={errorIcon}
                              className="w-5 h-5 "
                            ></img>{" "}
                            {item.name}{" "}
                          </li>
                        ))}

                      {/* skills that match user skills */}
                      {jobData.skills
                        .filter((item) => userSkills.includes(item._id))
                        .map((item) => (
                          <li
                            key={item._id}
                            className="py-1 px-4 bg-[#E7EFEB]  rounded-[33px] text-[#03963F] text-body2"
                          >
                            {" "}
                            {item.name}{" "}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* job details */}
              <div className="p-6 bg-[#f7f7f7] rounded-md  flex-col justify-center items-start gap-5 inline-flex w-3/6">
                <div className="flex flex-row justify-start gap-3">
                  <div className="p-[12px] bg-white">
                    <img src={employeeIcon} className="h-[22px] w-[22px] " />
                  </div>
                  <div>
                    <h3 className="text-black text-sub-header">
                      Min Experience
                    </h3>
                    <p className="text-[#414347] text-body2">
                      {" "}
                      {jobData.minimumExperience} years
                    </p>
                  </div>
                </div>

                <div className="flex flex-row justify-start gap-3">
                  <div className="p-[12px] bg-white">
                    <img src={locationIcon} className="h-[22px] w-[22px] " />
                  </div>
                  <div>
                    <h3 className="text-black text-sub-header">Location</h3>
                    <p className="text-[#414347] text-body2">
                      {" "}
                      {jobData.locations
                        .map(
                          (item) => item.charAt(0).toUpperCase() + item.slice(1)
                        )
                        .join(",")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row justify-start gap-3">
                  <div className="p-[12px] bg-white">
                    <img src={employeeIcon} className="h-[22px] w-[22px] " />
                  </div>
                  <div>
                    <h3 className="text-black text-sub-header">Compensation</h3>
                    <p className="text-[#414347] text-body2">
                      {" "}
                      {jobData.salaryRange}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row justify-start gap-3">
                  <div className="p-[12px] bg-white">
                    <img src={briefcaseIcon} className="h-[22px] w-[22px] " />
                  </div>
                  <div>
                    <h3 className="text-black text-sub-header">Job Type</h3>
                    <p className="text-[#414347] text-body2"> {jobData.type}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* job description                 */}
            <section className="flex flex-col gap-4  ">
              <h2 className="text-black text-sub-header"> Job Description</h2>
              {/*                             
                            <iframe className=' bg-slate-200  overflow-scroll scrollbar-hide'  srcDoc={jobData.description}  > </iframe> */}
              <div
                className="text-[#414447] text-body2 overflow-scroll scrollbar-hide"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(jobData.description),
                }}
              ></div>
            </section>

            {isLoading ? (
              <AIAnalysisSkeleton />
            ) : (
              <section className=" p-6 bg-[#ddf8e8]/50 rounded-[9px] justify-start items-stretch gap-2.5 flex flex-row ">
                {/* employablility icon */}
                <div className=" flex flex-col   justify-start size-fit py-[3px] ">
                  <img src="/logo.svg" className="h-[14.5px] w-4 mt-[2px]" />
                </div>

                {/* Analysis content */}
                <div className="w-full flex flex-col justify-start gap-8 ">
                  {/* overview  */}
                  <div className="flex flex-col justify-start items-stretch gap-2.5">
                    <h3 className="text-black text-sub-header">AI Analysis</h3>
                    <p className="text-[#414347] text-body2">
                      {skillAnalysis?.overallAnalysis.summary}
                    </p>
                  </div>

                  <div className="flex flex-row gap-8 w-full">
                    <div className="flex-1 flex-col flex gap-3">
                      <h3 className="text-black text-sub-header">
                        Technical Fit
                      </h3>
                      <ul className="list-disc ml-5 text-[#414347] text-body2">
                        {skillAnalysis?.technicalSkillsAnalysis.skillStrengths.map(
                          (strength, index) => (
                            <li key={index}>{strength}</li>
                          )
                        )}
                        {skillAnalysis?.experienceAnalysis.strengths.map(
                          (strength, index) => (
                            <li key={`exp-${index}`}>{strength}</li>
                          )
                        )}
                        {skillAnalysis?.technicalSkillsAnalysis.skillGapRecommendations.map(
                          (gap, index) => (
                            <li key={`gap-${index}`}>{gap}</li>
                          )
                        )}
                        {skillAnalysis?.experienceAnalysis.experienceGaps.map(
                          (gap, index) => (
                            <li key={`expgap-${index}`}>{gap}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                      <h3 className="text-black text-sub-header">
                        Cultural Fit
                      </h3>
                      <ul className="list-disc ml-5 text-[#414347] text-body2">
                        {skillAnalysis?.culturalFit.alignmentDetails.strengths.map(
                          (strength, index) => (
                            <li key={index}>{strength}</li>
                          )
                        )}
                        {skillAnalysis?.culturalFit.alignmentDetails.potentialChallenges.map(
                          (challenge, index) => (
                            <li key={`challenge-${index}`}>{challenge}</li>
                          )
                        )}
                        {skillAnalysis?.culturalFit.alignmentDetails.recommendedAdaptationStrategies.map(
                          (recommendation, index) => (
                            <li key={`recommendation-${index}`}>
                              {recommendation}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <hr></hr>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-black text-sub-header">
                      Recommendation
                    </h3>
                    <div className="flex flex-col gap-4 text-[#414347] text-body2">
                      <p>Add the following skills to improve your job match:</p>
                      <ChipsCardAddSkill
                        itemList={skillAnalysis?.recommendedSkills || []}
                        selectItem={(item: Skill) => {
                          setSelectedSkill([item]);
                          setIsAddSkillModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end p-0">
          <button
            className="w-[161px] h-11 px-8 py-4 rounded border border-[#00183d] justify-center items-center gap-2 inline-flex text-base font-medium font-['SF Pro Display'] leading-normal disabled:cursor-not-allowed"
            onClick={handleSaveJob}
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save Job"}
          </button>
          <a
            className="w-[196px] h-11 px-8 py-4 bg-[#00183d] rounded justify-center items-center gap-2 inline-flex text-base font-medium font-['SF Pro Display'] leading-normal text-white"
            target="_blank"
            href={jobData.applicationUrl}
          >
            Apply now
          </a>
        </div>
        {isAddSkillModalOpen && (
          <AddSkillsModal
            userId={user._id}
            goalId={goalId}
            onClose={handleCloseModal}
            onSkillsUpdate={() => {}}
            goals={goals}
            prefillSkills={selectedSkill}
          />
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
