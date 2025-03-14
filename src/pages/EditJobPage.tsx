import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { 
  useUpdateJobMutation,
  useGetJobDetailsQuery
} from "../api/employerJobsApiSlice";
import JobPostingPage from "@/components/employer/JobPostingForm";
import { IJob } from "@/components/employer/JobCard";

const EditJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  
  // Fetch the job details
  const { 
    data: jobData, 
    isLoading: isJobLoading,
    error: jobError
  } = useGetJobDetailsQuery(
    { id: jobId || "" },
    { skip: !jobId }
  );
  
  // Handle job update submission
  const handleJobSubmit = async (formData: any) => {
    if (!jobId) return;
    
    try {
      // Prepare job data
      const preparedJobData = {
        ...formData,
        employer_id: employer?._id,
        company_id: employer?.company,
        // Transform skills if needed
        skills_required: Array.isArray(formData.skills_required)
          ? formData.skills_required.map((skill: any) =>
              typeof skill === "object" && skill._id ? skill._id : skill
            )
          : formData.skills_required,
      };

      await updateJob({
        id: jobId,
        data: preparedJobData,
      }).unwrap();
      
      toast.success("Job Updated", {
        description: "The job posting has been successfully updated.",
      });

      // Navigate back to dashboard
      navigate("/employer/jobs");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Error", {
        description:
          "There was an error updating your job. Please try again.",
      });
    }
  };

  const handleClose = () => {
    navigate("/employer/jobs");
  };

  // If job is still loading or there was an error
  if (isJobLoading) {
    return <div className="flex justify-center items-center h-screen">Loading job details...</div>;
  }

  if (jobError || !jobData?.data) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Job</h1>
        <p className="text-gray-600 mt-2">Unable to load job details. The job may not exist or you don't have permission to edit it.</p>
        <button 
          onClick={() => navigate("/employer/jobs")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <JobPostingPage
      onSubmit={handleJobSubmit}
      onClose={handleClose}
      isLoading={isUpdating}
      initialData={jobData.data as IJob}
      companyId={employer?.company}
      employerId={employer?._id}
    />
  );
};

export default EditJobPage;