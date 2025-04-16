"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Card, CardContent } from "@/components/ui/card";

import { useGetEmployerJobsQuery } from "@/api/employerJobsApiSlice";
import JobFilters from "@/components/employer/JobFilter";
import JobCard, { type IJob } from "@/components/employer/JobCard";
import { jobUtils } from "@/utils/jobUtils";
import NoPostSVG from "@/assets/employer-dashboard/NoPostSVG.svg";

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

// Helper function to format location for display (can be moved to jobUtils)
const formatLocation = (
  location: string | { city: string; state: string; country: string }
): string => {
  if (typeof location === "string") {
    return location;
  }

  if (location && typeof location === "object") {
    const { city, state, country } = location;
    return `${city || ""}, ${state || ""}, ${country || ""}`.replace(
      /^, |, $/g,
      ""
    );
  }

  return "";
};

// Extend jobUtils to handle location objects in filtering
const extendedJobUtils = {
  ...jobUtils,
  filterJobs: (jobs: IJob[], filters: any) => {
    return jobs.filter((job) => {
      // Type filter
      if (filters.type !== "all" && job.job_type !== filters.type) {
        return false;
      }

      // Experience level filter
      if (
        filters.experience_level !== "all" &&
        job.experience_level !== filters.experience_level
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && job.status !== filters.status) {
        return false;
      }

      // Search filter - include location in the search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const formattedLocation = formatLocation(job.location).toLowerCase();

        return (
          job.title.toLowerCase().includes(searchTerm) ||
          formattedLocation.includes(searchTerm) ||
          (job.description &&
            job.description.toLowerCase().includes(searchTerm))
        );
      }

      return true;
    });
  },
};

const EmployerJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
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

  // Use extended jobUtils to handle location objects
  const filteredJobs = jobsData?.data?.length
    ? extendedJobUtils.filterJobs((jobsData as any).data, filters)
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
    navigate(`/employer/jobs/edit/${job._id}`);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="w-full h-screen overflow-hidden max-w-[1800px] p-[35px] bg-[#F5F5F5] mx-auto">
      <div className="w-full max-w-screen-xl flex flex-col gap-6">
        {/* HEADER SECTION */}
        <section className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackClick}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img
              className="w-[10px] h-[10px]"
              src={arrow || "/placeholder.svg"}
              alt="Back"
            />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.025rem]">
            Jobs
          </h1>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="w-full h-[calc(100vh-130px)]">
          <div className="h-full flex justify-center">
            {/* Two-column layout */}
            <div className="w-full flex gap-6 h-full">
              {/* LEFT COLUMN (Filters) - Fixed position */}
              <div className="w-[300px] hidden lg:block h-full">
                <div className="sticky top-0 bg-[#F5F5F5] h-full overflow-y-auto pr-2">
                  <JobFilters
                    filters={filters}
                    setFilters={setFilters}
                    onReset={resetFilters}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN (Job Listing) - Scrollable */}
              <div className="flex-1 flex flex-col h-full">
                {/* Mobile filters */}
                <div className="lg:hidden mb-4">
                  <JobFilters
                    filters={filters}
                    setFilters={setFilters}
                    onReset={resetFilters}
                  />
                </div>

                {/* Scrollable job cards container */}
                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide"
                >
                  {isContentLoading && (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <JobCardSkeleton key={i} />
                      ))}
                    </div>
                  )}

                  {!isContentLoading && (
                    <>
                      {!filteredJobs || filteredJobs.length === 0 ? (
                        <Card className="text-center py-16 bg-white shadow-sm rounded-lg">
                          <CardContent>
                            <div className="flex justify-center mb-4">
                              <div className="w-16 h-16">
                                <img
                                  src={NoPostSVG || "/placeholder.svg"}
                                  alt="No Post"
                                />
                              </div>
                            </div>
                            {jobsData?.data?.length === 0 ? (
                              <>
                                <p className="text-body2 text-[#414447] mb-1">
                                  Create your first job posting to start hiring
                                  talent.
                                </p>
                                <button
                                  onClick={() =>
                                    navigate("/employer/jobs/create")
                                  }
                                  className="hover:bg-transparent text-[#414447] text-body2 underline"
                                >
                                  Post Job
                                </button>
                              </>
                            ) : (
                              <p className="text-body2 text-[#414447] mb-1">
                                No jobs match your current filter criteria.
                              </p>
                            )}
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployerJobsPage;
