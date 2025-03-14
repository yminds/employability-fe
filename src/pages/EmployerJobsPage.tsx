// src/pages/employer/EmployerJobsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useGetEmployerJobsQuery } from "@/api/employerJobsApiSlice";
import JobFilters from "@/components/employer/JobFilter";
import JobCard, { IJob } from "@/components/employer/JobCard";
import { jobUtils } from "@/utils/jobUtils";

// Skeleton placeholders
const JobCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-7 w-48 bg-gray-200 rounded"></div>
      <div className="h-7 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="h-5 w-32 bg-gray-200 rounded"></div>
      <div className="h-5 w-64 bg-gray-200 rounded"></div>
      <div className="flex space-x-2">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="mt-4 flex justify-between">
      <div className="h-6 w-32 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

import arrow from "@/assets/skills/arrow.svg"; // If you have a back arrow image, adjust import path

const EmployerJobsPage: React.FC = () => {
  const navigate = useNavigate();

  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  const token = useSelector((state: RootState) => state.employerAuth.token);

  useEffect(() => {
    if (!employer || !token) {
      navigate("/employer/login");
    }
  }, [employer, token, navigate]);

  // Filters
  const [filters, setFilters] = useState({
    type: "all",
    experience_level: "all",
    status: "all",
    search: "",
  });

  // Query employer's jobs
  const {
    data: jobsData,
    isLoading,
    isFetching,
  } = useGetEmployerJobsQuery(
    { employer_id: employer?._id || "" },
    {
      skip: !employer?._id,
      refetchOnMountOrArgChange: true,
    }
  );

  const isContentLoading = isLoading || isFetching;
  const filteredJobs = jobsData?.data?.length
    ? jobUtils.filterJobs(jobsData.data, filters)
    : [];

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "all",
      experience_level: "all",
      status: "all",
      search: "",
    });
  };

  // Navigate to job details
  const handleSelectJob = (job: IJob) => {
    navigate(`/employer/jobs/${job._id}`);
  };

  // If you want an edit button in the listing
  const handleEditJob = (job: IJob) => {
    navigate("/employer/dashboard", { state: { editJobId: job._id } });
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="w-[95%] h-screen overflow-hidden max-w-[1800px] p-5 bg-[#F5F5F5] mx-auto">
      <div className="w-full max-w-screen-xl flex flex-col gap-6">
        {/* HEADER SECTION */}
        <section className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackClick}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.025rem]">
         Jobs
          </h1>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="w-full h-[calc(100vh-2rem)]">
          <div className="h-full flex justify-center">
            {/* If you want a two-column layout, you can do it here */}
            <div className="w-full flex gap-6">
              {/* LEFT COLUMN (Filters) */}
              <div className="w-[300px] hidden lg:block">
                <div className="sticky top-0 bg-[#F5F5F5]">
                  <JobFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
                </div>
              </div>

              {/* RIGHT COLUMN (Job Listing) */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* If you want to also show filters on mobile, you can show them inline above or below */}
                <div className="lg:hidden mb-4">
                  <JobFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
                </div>

                {isContentLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <JobCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {!isContentLoading && (
                  <>
                    {(!filteredJobs || filteredJobs.length === 0) ? (
                      <Card className="text-center py-20">
                        <CardContent>
                          <h3 className="text-xl font-semibold mb-2">
                            No jobs posted yet
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Create your first job posting to start hiring talent
                          </p>
                          <Button onClick={() => navigate("/employer/dashboard")}>
                            Post Your First Job
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {filteredJobs.map((job: IJob) => (
                          <JobCard
                            key={job._id}
                            job={job}
                            onSelect={handleSelectJob}
                            onEdit={handleEditJob}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployerJobsPage;
