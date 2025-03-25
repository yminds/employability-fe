import React from 'react';

export type JobDescription = {
  summary: string;
  keyResponsibilities: string[];
  requiredSkillsAndQualifications: { skill: string; importance: string }[];
  experience: string;
  perksAndBenefits: string;
  whyJoinUs: string[];
  role: string;
  industryType: string;
  department: string;
  employmentType: string;
  roleCategory: string;
};

type InterviewDetailsProps = {
  selectedInterview: {
    jobTitle: string;
    company: string;
    jobDescription: JobDescription;
  } | null;
  setSelectedInterview: (interview: any) => void;
  handleTakeInterview: (interview: any) => void;
};

const ViewJD: React.FC<InterviewDetailsProps> = ({
  selectedInterview,
  setSelectedInterview,
  handleTakeInterview,
}) => {
  if (!selectedInterview) return null;

  const { jobTitle, company, jobDescription } = selectedInterview;

  return (
    <div className="fixed top-0 right-0 w-full max-w-2xl h-full z-50 bg-white shadow-xl flex flex-col">
      {/* Header / Close Button */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h3 className="text-lg font-semibold">
          {jobTitle} @ {company}
        </h3>
        <button
          onClick={() => setSelectedInterview(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Content Area (Scrollable) */}
      <div className="p-4 overflow-y-auto flex-1">
        {/* 1. Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-700">{jobDescription.summary}</p>
        </div>

        {/* 2. Key Responsibilities */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Key Responsibilities</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {jobDescription.keyResponsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>

        {/* 3. Required Skills */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Required Skills & Qualifications</h4>
          {jobDescription.requiredSkillsAndQualifications.map((skillObj, idx) => (
            <div key={idx} className="mb-2 flex justify-between">
              <strong className="block text-sm text-gray-800">{skillObj.skill}</strong>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                skillObj.importance === 'critical' 
                  ? 'bg-red-100 text-red-800' 
                  : skillObj.importance === 'important' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {skillObj.importance}
              </span>
            </div>
          ))}
        </div>

        {/* 4. Experience */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Experience</h4>
          <p className="text-sm text-gray-700">{jobDescription.experience}</p>
        </div>

        {/* 5. Perks & Benefits */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Perks and Benefits</h4>
          <p className="text-sm text-gray-700">{jobDescription.perksAndBenefits}</p>
        </div>

        {/* 6. Why Join Us */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Why Join Us?</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {jobDescription.whyJoinUs.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Additional Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-700">
            <strong>Role:</strong> {jobDescription.role}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Industry Type:</strong> {jobDescription.industryType}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Department:</strong> {jobDescription.department}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Employment Type:</strong> {jobDescription.employmentType}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Role Category:</strong> {jobDescription.roleCategory}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t p-4 flex justify-end gap-2">
        <button
          onClick={() => handleTakeInterview(selectedInterview)}
          className="px-4 py-2 w-[138px] h-[44px] bg-[#001630] text-white hover:bg-[#062549] rounded-md font-ubuntu"
        >
          Take Interview
        </button>
      </div>
    </div>
  );
};

export default ViewJD;
