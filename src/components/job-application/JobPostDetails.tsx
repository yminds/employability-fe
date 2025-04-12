import { useParams } from "react-router-dom";
import { useGetJobByIdQuery } from "@/api/employabilityJobApiSlice";
import CompanyInfo from "./CompanyInfo";
import JobDescription from "./JobDescription";
import JobHeader from "./JobHeader";
import JobInfo from "./JobInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function JobPostDetails() {
  const user = useSelector((state: RootState) => state.auth?.user);
  console.log("user", user);

  const { jobId } = useParams<{ jobId: string }>();

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useGetJobByIdQuery(jobId, {
    pollingInterval: 5 * 60 * 1000,
    skip: !jobId,
  });

  const jobDetails = job?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading job details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-red-500">
          <h2 className="text-xl font-bold mb-2">Error loading job details</h2>
          <p>
            {(error as any)?.data?.message ||
              "Failed to load job details. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-gray-700">
          <h2 className="text-xl font-bold mb-2">Job not found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  console.log("Job details:", jobDetails);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {!user && <JobHeader />}
      <main className="mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-10 gap-8">
          <div className="col-span-7">
            <JobInfo jobDetails={jobDetails} user={user} />
            <JobDescription description={jobDetails.description} />
          </div>
          <div className="col-span-3">
            <CompanyInfo jobDetails={jobDetails} />
          </div>
        </div>
      </main>
    </div>
  );
}
