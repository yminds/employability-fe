import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { useCreateJobPostingMutation } from "../api/employerJobsApiSlice";
import JobPostingPage from "@/components/employer/JobPostingForm";

// Define interfaces to match the backend model
interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface SkillWithImportance {
  skill: string; // ObjectId reference
  importance: "Must-Have*" | "Preferred" | "Optional";
}

interface ScreeningQuestion {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  customField?: string;
  customFieldValue?: string;
}

interface InterviewQuestion {
  id: string;
  question: string;
  category?: string;
}

// Interface for the data coming from the form based on actual structure
interface JobFormData {
  title: string;
  description: string;
  location: string;
  job_type: string;
  work_place_type: string;
  experience_level: string;
  company_name: string;
  skills_required: Array<{
    _id: string;
    name: string;
    icon?: string;
    importance: "Must-Have*" | "Preferred" | "Optional";
  }>;
  screening_questions: Array<ScreeningQuestion>;
  interview_questions: Array<InterviewQuestion>;
  company_id: string;
  employer_id: string;
}

// Interface for the API payload
interface JobPostingPayload {
  company: string;
  employer: string;
  title: string;
  description: string;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  work_place_type: "remote" | "hybrid" | "on-site";
  experience_level: "entry" | "mid" | "senior";
  location: string;
  salary_range: SalaryRange;
  skills_required: SkillWithImportance[];
  screening_questions: ScreeningQuestion[];
  interview_questions?: InterviewQuestion[];
  status: "active" | "closed";
  application_deadline?: string;
}

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  const [createJob, { isLoading: isCreating }] = useCreateJobPostingMutation();

  // Check if employer data is available
  useEffect(() => {
    if (!employer) {
      toast.error("Authentication required", {
        description: "Please log in to continue.",
      });
      navigate("/employer/login");
    }
  }, [employer, navigate]);

  // Handle job creation submission
  const handleJobSubmit = async (jobData: JobFormData) => {
    console.log("handleJobSubmit called with data:", jobData);
    
    try {
      if (!employer?._id || !employer?.company) {
        throw new Error("Employer information is missing");
      }

      // Map job_type values
      const jobTypeMap: Record<string, "full-time" | "part-time" | "contract" | "internship"> = {
        "full-time": "full-time",
        "part-time": "part-time",
        "contract": "contract",
        "internship": "internship"
      };

      // Map experience_level values to match backend's expected values
      const experienceLevelMap: Record<string, "entry" | "mid" | "senior"> = {
        "entry-level": "entry",
        "mid-level": "mid",
        "senior-level": "senior",
      };

      // Map work_place_type values
      const workplaceTypeMap: Record<string, "remote" | "hybrid" | "on-site"> = {
        "remote": "remote",
        "hybrid": "hybrid",
        "on-site": "on-site"
      };

      // Default salary range
      const salaryRange: SalaryRange = {
        min: 0,
        max: 0,
        currency: "USD"
      };

      // Process skills data to match backend model format
      const processedSkills: SkillWithImportance[] = jobData.skills_required.map(item => ({
        skill: item._id, // Using _id directly from each skill
        importance: item.importance
      }));
      
      // Get company and employer IDs
      const companyId = typeof employer.company === 'object' ? employer.company._id : employer.company;
      const employerId = employer._id;
      
      // Prepare the complete job data to match backend model
      const preparedJobData: JobPostingPayload = {
        company: companyId,
        employer: employerId,
        title: jobData.title || "Untitled Position",
        description: jobData.description || "",
        job_type: jobTypeMap[jobData.job_type] || "full-time",
        work_place_type: workplaceTypeMap[jobData.work_place_type] || "on-site",
        experience_level: experienceLevelMap[jobData.experience_level] || "intermediate",
        location: jobData.location || "",
        salary_range: salaryRange,
        skills_required: processedSkills,
        screening_questions: jobData.screening_questions,
        interview_questions: jobData.interview_questions,
        status: "active"
      };

      console.log("Calling API with prepared data:", preparedJobData);
      
      // Send the prepared data to the API
      const response = await createJob(preparedJobData as any).unwrap();
      console.log("API response:", response);
      
      toast.success("Job Posted", {
        description: "Your job has been successfully posted.",
      });

      // Navigate back to dashboard
      navigate("/employer/jobs");
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error("Error", {
        description: error.message || "There was an error processing your request. Please try again.",
      });
    }
  };

  const handleClose = () => {
    navigate("/employer/jobs");
  };

  // Show loading state while checking employer data
  if (!employer) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#001630] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Prepare initial data for the form component
  const companyName = typeof employer?.company === 'object' && employer?.company?.name 
    ? employer?.company?.name 
    : "Your Company";

  return (
    <JobPostingPage
      onSubmit={handleJobSubmit}
      onClose={handleClose}
      isLoading={isCreating}
      companyId={employer.company}
      employerId={employer._id}
      initialData={{
        company_name: companyName,
        location:employer.company?.location
      }}
    />
  );
};

export default CreateJobPage;