import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { useGetJobDetailsQuery, useUpdateJobMutation } from "../api/employerJobsApiSlice";
import JobPostingPage from "@/components/employer/JobPostingForm";

// Define interfaces to match the backend model
interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface SkillWithImportance {
  skill: string; // ObjectId reference
  importance: "Very Important" | "Important" | "Good-To-Have";
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

interface JobFormData {
  title: string;
  description: string;
  location: string;
  job_type: string;
  work_place_type: string;
  experience_level: string;
  company_name: string;
  company_logo?: string;
  job_id?: string; // Explicitly include job_id
  skills_required: Array<{
    _id: string;
    name: string;
    icon?: string;
    importance: "Very Important" | "Important" | "Good-To-Have";
  }>;
  screening_questions: Array<ScreeningQuestion>;
  interview_questions: Array<InterviewQuestion>;
  company_id: string;
  employer_id: string;
  isEditMode?: boolean;
}

const EditJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  
  // Debug log the URL parameter
  console.log("EditJobPage - jobId from URL params:", jobId);
  
  // Fetch job details
  const { 
    data: jobDetails, 
    isLoading: isLoadingJob, 
    isError: isJobError,
    error: jobError 
  } = useGetJobDetailsQuery(jobId || '', {
    skip: !jobId,
  });

  const jobData = jobDetails?.data;
  
  // Debug log the job data
  useEffect(() => {
    if (jobData) {
      console.log("EditJobPage - Job data loaded:", jobData);
      console.log("EditJobPage - Job ID from API:", jobData._id);
    }
  }, [jobData]);
  
  // Update job mutation
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  useEffect(() => {
    if (!employer) {
      toast.error("Authentication required", {
        description: "Please log in to continue.",
      });
      navigate("/employer/login");
    }
  }, [employer, navigate]);

  // Show error message if job fetching fails
  useEffect(() => {
    if (isJobError) {
      console.error("Error loading job:", jobError);
      toast.error("Error loading job", {
        description: "Could not load job details. Please try again.",
      });
    }
  }, [isJobError, jobError]);

  // Handle job update submission
  const handleJobUpdate = async (formData: JobFormData) => {
    try {
      console.log("EditJobPage - handleJobUpdate - Form data received:", formData);
      console.log("EditJobPage - handleJobUpdate - job_id from form:", formData.job_id);
      
      if (!employer?._id || !employer?.company) {
        throw new Error("Employer information is missing");
      }
      
      // Prioritize job_id from form data, then fallback to URL param
      const jobIdToUse = formData.job_id || jobId;
      
      console.log("EditJobPage - handleJobUpdate - Job ID to use:", jobIdToUse);
      
      if (!jobIdToUse) {
        throw new Error("Job ID is missing. Cannot update job.");
      }

      // Mapping for job_type, experience_level, and work_place_type
      const jobTypeMap: Record<string, "full-time" | "part-time" | "contract" | "internship"> = {
        "full-time": "full-time",
        "part-time": "part-time",
        "contract": "contract",
        "internship": "internship"
      };

      const experienceLevelMap: Record<string, "entry" | "intermediate" | "senior" | "executive"> = {
        "entry-level": "entry",
        "mid-level": "intermediate",
        "senior-level": "senior",
        "executive-level": "executive"
      };

      const workplaceTypeMap: Record<string, "remote" | "hybrid" | "on-site"> = {
        "remote": "remote",
        "hybrid": "hybrid",
        "on-site": "on-site"
      };

      // Default salary range or use existing
      const salaryRange: SalaryRange = jobData?.salary_range || {
        min: 0,
        max: 0,
        currency: "USD"
      };

      // Process skills data to match backend model format
      const processedSkills = formData.skills_required.map(item => ({
        _id: item._id,
        name: item.name, 
        importance: item.importance
      }));

      // Get company and employer IDs
      const companyId = typeof employer.company === 'object' ? employer.company._id : employer.company;
      const employerId = employer._id;

      // Prepare the update data
      const updateData = {
        company: companyId,
        employer: employerId,
        title: formData.title || jobData?.title || "Untitled Position",
        description: formData.description || jobData?.description || "",
        job_type: jobTypeMap[formData.job_type] || jobData?.job_type || "full-time",
        work_place_type: workplaceTypeMap[formData.work_place_type] || jobData?.work_place_type || "on-site",
        experience_level: experienceLevelMap[formData.experience_level] || jobData?.experience_level || "mid",
        location: formData.location || jobData?.location || "",
        salary_range: salaryRange,
        skills_required: processedSkills,
        screening_questions: formData.screening_questions,
        interview_questions: [], // Keep empty interview questions array for API compatibility
        status: jobData?.status || "active",
        application_deadline: jobData?.application_deadline
      };

      // Prepare the API payload in the correct format - this is the key fix
      const apiPayload = {
        id: jobIdToUse,
        data: updateData
      };

      console.log("EditJobPage - handleJobUpdate - API payload:", apiPayload);
      
      // Call the API with the correct payload structure
      const response = await updateJob(apiPayload).unwrap();
      console.log("EditJobPage - handleJobUpdate - Update response:", response);
      
      toast.success("Job Updated", {
        description: "Your job has been successfully updated.",
      });

      // Navigate back to jobs listing
      navigate("/employer/jobs");
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast.error("Error", {
        description: error.message || "There was an error updating the job. Please try again.",
      });
    }
  };

  const handleClose = () => {
    navigate("/employer/jobs");
  };

  // Prepare initial data for the JobPostingPage component
  const prepareInitialData = () => {
    if (!jobData) return null;

    // DEBUG: Log job ID being used for initialData
    console.log("EditJobPage - prepareInitialData - Job ID for initialData:", jobData._id);

    let companyName = "";
    if (employer?.company) {
      companyName = typeof employer.company === 'object' && employer.company.name 
        ? employer.company.name 
        : "Your Company";
    }

    let companyLogo = "";
    if (typeof employer?.company === 'object' && employer.company?.logo) {
      companyLogo = employer.company.logo;
    }

    // Format skills data
    const skills = jobData.skills_required.map(skillItem => {
      if (typeof skillItem === 'string') {
        return {
          _id: skillItem,
          name: skillItem,
          importance: "Important"
        };
      } else if (skillItem.skill) {
        return {
          _id: typeof skillItem.skill === 'string' ? skillItem.skill : skillItem.skill._id,
          name: typeof skillItem.skill === 'string' ? skillItem.skill : skillItem.skill.name,
          icon: typeof skillItem.skill === 'object' ? skillItem.skill.icon : undefined,
          importance: skillItem.importance || "Important"
        };
      } else {
        return {
          _id: skillItem._id,
          name: skillItem.name,
          icon: skillItem.icon,
          importance: skillItem.importance || "Important"
        };
      }
    });

    // Make sure to include _id as job_id for the form
    const initialData = {
      _id: jobData._id, // For internal use
      job_id: jobData._id, // Explicitly set job_id for the form
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      job_type: jobData.job_type,
      work_place_type: jobData.work_place_type,
      experience_level: jobData.experience_level,
      company_name: companyName,
      company_logo: companyLogo,
      skills_required: skills,
      screening_questions: jobData.screening_questions || [],
      interview_questions: jobData.interview_questions || [],
      // Add a flag to indicate this is edit mode - we'll use this in JobPostingPage
      isEditMode: true
    };
    
    // DEBUG: Log the final initialData
    console.log("EditJobPage - prepareInitialData - Final initialData:", initialData);
    
    return initialData;
  };

  // Show loading state
  if (isLoadingJob || !jobId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#001630] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isJobError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Job</h1>
          <p className="text-gray-600 mb-6">
            We couldn't load the job details. Please try again or go back to your jobs list.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate("/employer/jobs")}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Back to Jobs
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initialData = prepareInitialData();
  if (!initialData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">No job data available.</p>
          <button 
            onClick={() => navigate("/employer/jobs")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <JobPostingPage
      onSubmit={handleJobUpdate}
      onClose={handleClose}
      isLoading={isUpdating}
      companyId={employer?.company}
      employerId={employer?._id}
      initialData={initialData}
    />
  );
};

export default EditJobPage;