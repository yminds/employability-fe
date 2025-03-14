import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ViewJD from "@/components/interview-list/ViewJD";
import { mockInterviews } from "../dashboard/InterviewsInvites";
import { useCreateInterview } from "@/hooks/useCreateInterview";

interface JobDescription {
  summary: string;
  keyResponsibilities: string[];
  requiredSkillsAndQualifications: string[];
  experience: string;
  perksAndBenefits: string;
  whyJoinUs: string[];
  role: string;
  industryType: string;
  department: string;
  employmentType: string;
  roleCategory: string;
}

interface JobListing {
  id: number;
  title: string;
  company: string;
  employmentType: string;
  postedTime: string;
  logoType: "accenture" | "paypal" | "zoho" | "ey";
  jobDescription: any;
  type: string;
  dueDate: string;
  jobTitle: string;
}

interface Interview {
  id: number;
  company: string;
  type: string;
  dueDate: string;
  jobTitle: string;
  jobDescription: JobDescription;
}

export default function InterviewInvites() {
  const { createInterview } = useCreateInterview();
  const navigate = useNavigate();
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);

  const getLogoType = (
    company: string
  ): "accenture" | "paypal" | "zoho" | "ey" => {
    const companyLower = company.toLowerCase();
    if (companyLower.includes("web") || companyLower.includes("craft"))
      return "accenture";
    if (companyLower.includes("mega") || companyLower.includes("byte"))
      return "paypal";
    if (companyLower.includes("cloud") || companyLower.includes("sky"))
      return "zoho";
    return "ey";
  };

  const jobListings: JobListing[] = mockInterviews.map((interview) => ({
    id: interview.id,
    title: interview.jobTitle,
    company: interview.company,
    employmentType: interview.jobDescription.employmentType.split(",")[0],
    postedTime: `Due: ${interview.dueDate}`,
    logoType: getLogoType(interview.company),
    jobDescription: interview.jobDescription,
    type: interview.type,
    dueDate: interview.dueDate,
    jobTitle: interview.jobTitle,
  }));

  const handleCardClick = (job: JobListing) => {
    const interview = mockInterviews.find((i) => i.id === job.id);
    setSelectedInterview(interview || null);
  };

  const handleTakeInterview = async (interview: Interview) => {
    const interviewId = await createInterview({
      title: `${interview.jobTitle}`,
      type: "Job",
    });

    navigate(`/interview/${interviewId}`, {
      state: {
        title: `${interview.jobTitle}`,
        type: "Job",
        jobDescription: interview,
      },
    });
  };

  const renderLogo = (logoType: string) => {
    switch (logoType) {
      case "accenture":
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fafafa] border">
            <div className="text-[#a100ff] font-bold text-xl">&gt;</div>
          </div>
        );
      case "paypal":
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fafafa] border">
            <div className="text-[#002c8a] font-bold">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.1 6.35C20.48 8.17 19.27 10.14 17.46 11.1C15.65 12.05 12.34 12.05 10.53 12.05C9.67 12.05 9.39 12.05 8.82 13.72C8.25 15.4 7.11 19.89 7.11 19.89H3L6.82 3.72H14.41C17.12 3.72 19.73 4.53 20.1 6.35Z"
                  fill="#002C8A"
                />
                <path
                  d="M8.25 15.4C8.25 15.4 10.53 15.4 12.34 15.4C14.15 15.4 15.65 14.58 16.03 12.9C16.41 11.22 15.27 9.95 13.46 9.54C11.65 9.13 9.1 9.13 7.29 9.13C5.48 9.13 4.63 10.27 4.63 10.27"
                  fill="#009BE1"
                />
              </svg>
            </div>
          </div>
        );
      case "zoho":
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fafafa] border">
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="5" height="12" rx="2" fill="#089949" />
              <rect x="6" y="0" width="5" height="12" rx="2" fill="#f9b21d" />
              <rect x="12" y="0" width="5" height="12" rx="2" fill="#e42527" />
              <rect x="18" y="0" width="5" height="12" rx="2" fill="#226db4" />
            </svg>
          </div>
        );
      case "ey":
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fafafa] border">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3L21 8V16L12 21L3 16V8L12 3Z" fill="#fee502" />
              <path d="M12 21V12L3 8V16L12 21Z" fill="#000000" />
              <path d="M12 3V12L21 8L12 3Z" fill="#000000" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fafafa] border">
            <div className="text-[#414447]">?</div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <Card className="w-full max-w-md mx-auto shadow-sm bg-white rounded-[8px] mt-1">
        <CardHeader className="px-8 pt-8 pb-6 text-body2 text-[#414447]">
          Interview Invites
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-5">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="flex items-start space-x-4 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                onClick={() => handleCardClick(job)}
              >
                {renderLogo(job.logoType)}
                <div className="space-y-1">
                  <h3 className="text-sub-header">{job.title}</h3>
                  <div className="text-[#414447] text-sm font-normal leading-6 tracking-[0.07px]">
                    {job.company} <span className="mx-1">•</span>{" "}
                    {job.employmentType}
                  </div>
                  <div className="text-[#414447] text-sm font-normal leading-6 tracking-[0.07px]">
                    {job.postedTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedInterview && (
        <ViewJD
          selectedInterview={selectedInterview}
          setSelectedInterview={setSelectedInterview}
          handleTakeInterview={handleTakeInterview}
        />
      )}
    </div>
  );
}
