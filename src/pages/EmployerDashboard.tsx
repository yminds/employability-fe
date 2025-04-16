"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGetEmployerJobsQuery } from "../api/employerJobsApiSlice";
import { Clock, Inbox, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import emojiWavingImg from "@/assets/dashboard/emoji_waving.svg";

// Import SVGs
import PostJobSVG from "@/assets/employer-dashboard/PostJobSVG.svg";
import SetCompanyProfileSVG from "@/assets/employer-dashboard/SetCompanyProfileSVG.svg";
import UploadResumesSVG from "@/assets/employer-dashboard/UploadResumesSVG.svg";
import NoPostSVG from "@/assets/employer-dashboard/NoPostSVG.svg";

// Import our components
import DashboardOverview from "./ImprovedEmployerDashboard";
import JobCard, { type IJob } from "@/components/employer/JobCard";
import { jobUtils } from "../utils/jobUtils";

// Skeleton Components
const OverviewSkeleton = () => (
  <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 w-1/4 min-w-[220px]"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-9 h-9 rounded-md bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

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

const ImprovedEmployerDashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    type: "all",
    experience_level: "all",
    status: "all",
    search: "",
  });
  const navigate = useNavigate();

  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const token = useSelector((state: RootState) => state.employerAuth.token);

  // Query for jobs with proper error handling and loading states
  const {
    data: jobsData,
    isLoading,
    isFetching,
    refetch: refetchJobs,
  } = useGetEmployerJobsQuery(
    {
      employer_id: employer?._id || "",
    },
    {
      skip: !employer?._id,
      refetchOnMountOrArgChange: true,
    }
  );

  console.log("jobsData", jobsData);

  // Dashboard statistics with safe access patterns
  const dashboardStats = {
    activeJobs:
      jobsData?.data?.filter((job: any) => job.status === "active")?.length ||
      0,
    newJobsThisWeek: 3, // Example placeholder
    totalApplications:
      jobsData?.data?.reduce(
        (acc: number, job: any) => acc + (job.applications || 0),
        0
      ) || 0,
    newApplicationsThisWeek: 15, // Example placeholder
    totalShortlisted:
      jobsData?.data?.reduce(
        (acc: number, job: any) =>
          acc + (job.candidates?.shortlisted?.length || 0),
        0
      ) || 0,
    shortlistedPercentage: 42, // Example placeholder
    totalHired:
      jobsData?.data?.reduce(
        (acc: number, job: any) => acc + (job.candidates?.hired?.length || 0),
        0
      ) || 0,
    hiredPercentage: 28, // Example placeholder
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!employer || !token || !employer.is_email_verified) {
      navigate("/employer/login");
    }
  }, [employer, token, navigate]);

  // For navigating to job edit page
  const handleEditJob = (job: IJob) => {
    navigate(`/employer/jobs/edit/${job._id}`);
  };

  // For navigating to the job details page
  const handleSelectJob = (job: IJob) => {
    navigate(`/employer/jobs/${job._id}`);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "all",
      experience_level: "all",
      status: "all",
      search: "",
    });
  };
  const filteredJobs =
    jobsData?.data && jobsData.data.length > 0
      ? jobUtils.filterJobs(jobsData.data, filters).slice(0, 3)
      : [];

  const isContentLoading = isLoading || isFetching;
  const hasCompany = employer?.company;
  console.log("employer", employer);

  console.log("hasCompany", hasCompany);

  return (
    <main className="h-screen w-full overflow-hidden font-ubuntu">
      <div className="h-full flex flex-col bg-[#F5F5F5]">
        <div className="flex-1 p-[35px] md:p-[55px] overflow-y-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-8">
            <div>
              <h1 className="text-[#414447] text-[18px] font-medium font-ubuntu leading-[27px] tracking-[-0.18px]  flex items-center gap-3">
                Hi, {employer?.employerName || "User"}
                <span className="wave">
                  <img
                    src={emojiWavingImg || "/placeholder.svg"}
                    alt="Emoji"
                    className="w-5"
                  />
                </span>
              </h1>
              <p className="text-[20px] font-medium font-ubuntu leading-8 tracking-[-0.2px] text-[#414447] mt-1">
                Let's get started with your hiring journey.
              </p>
            </div>
            <div className="flex flex-row gap-6 w-full">
              <div
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-full cursor-pointer overflow-hidden"
                onClick={() => navigate("/employer/jobs/create")}
              >
                <div className="flex items-center px-6 py-4 h-full">
                  <div className="flex-shrink-0 w-20 h-20 mr-6 relative">
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(219,234,254,1) 25%, rgba(255,255,255,1) 80%)",
                      }}
                    >
                      <img
                        src={PostJobSVG || "/placeholder.svg"}
                        alt="Post Job"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-[#414447] text-[18px] font-medium leading-6 font-ubuntu">
                      Post a New Job
                    </h3>
                    {/* <p className="text-[#909091] text-sm mt-1">
                      Lorem Ipsum Confetti
                    </p> */}
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#f0f0f0] rounded-lg">
                      <ChevronRight className="h-5 w-5 text-[#414447]" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-full cursor-pointer overflow-hidden"
                onClick={() => navigate("/employer/resumes")}
              >
                <div className="flex items-center px-6 py-4 h-full">
                  <div
                    className="flex-shrink-0 w-20 h-20 mr-6 relative"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(233,213,255,1) 0%, rgba(255,255,255,1) 70%)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={UploadResumesSVG || "/placeholder.svg"}
                        alt="Upload Resumes"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-[#414447] text-[18px] font-medium leading-6 font-ubuntu">
                      Upload Resumes
                    </h3>
                    {/* <p className="text-[#909091] text-sm mt-1">
                      Lorem Ipsum Confetti
                    </p> */}
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#f0f0f0] rounded-lg">
                      <ChevronRight className="h-5 w-5 text-[#414447]" />
                    </div>
                  </div>
                </div>
              </div>

              {!hasCompany && (
                <div
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-full cursor-pointer overflow-hidden"
                  onClick={() => navigate("/employer/company/create")}
                >
                  <div className="flex items-center px-6 h-full">
                    <div className="flex-shrink-0 w-20 h-20 mr-6 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={SetCompanyProfileSVG || "/placeholder.svg"}
                          alt="Set Company Profile"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-[#414447] text-[18px] font-medium leading-6 font-ubuntu">
                        Set Company Profile
                      </h3>
                      {/* <p className="text-[#909091] text-sm mt-1">
                        Lorem Ipsum Confetti
                      </p> */}
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#f0f0f0] rounded-lg">
                        <ChevronRight className="h-5 w-5 text-[#414447]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Dashboard Overview */}
          {/* Overview */}
          <div className="mb-6">
            <h2 className="text-h2 text-[#68696B]">Overview</h2>
          </div>
          {isContentLoading ? (
            <OverviewSkeleton />
          ) : (
            <DashboardOverview stats={dashboardStats} />
          )}

          {/* Main Content */}
          <Tabs defaultValue="jobs" className="space-y-6">
            {/* <TabsList className="bg-white text-body2">
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-blue-50"
              >
                Active Jobs
              </TabsTrigger>
              <TabsTrigger
                value="drafts"
                className="data-[state=active]:bg-blue-50"
              >
                Drafts
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="data-[state=active]:bg-blue-50"
              >
                Archived
              </TabsTrigger>
            </TabsList> */}

            <TabsContent value="jobs" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-h2 text-[#68696B]">Recently Posted Jobs</h2>
                <button
                  className="text-body2 text-sm text-[#414447] underline flex items-center px-3"
                  onClick={() => navigate("/employer/jobs")}
                >
                  View All
                </button>
              </div>

              {/* Filters */}
              {/* <JobFilters
                filters={filters}
                setFilters={setFilters}
                onReset={resetFilters}
              /> */}

              {isContentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
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
                        <p className="text-body2 text-[#414447] mb-1">
                          You haven't added posted any jobs yet.
                        </p>
                        {!hasCompany ? (
                          <button
                            onClick={() => navigate("/employer/company/create")}
                            className="hover:bg-transparent  text-[#414447] text-body2 underline"
                          >
                            Create Company First
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/employer/jobs/create")}
                            className="hover:bg-transparent  text-[#414447] text-body2 underline"
                          >
                            Post Job
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredJobs.map((job: IJob) => (
                        <JobCard
                          key={job._id}
                          job={job}
                          onSelect={handleSelectJob} // Navigate to job details page
                          onEdit={handleEditJob}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Drafts Tab */}
            <TabsContent value="drafts">
              <Card className="text-center py-16">
                <CardContent>
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No draft jobs</h3>
                  <p className="text-gray-500 mb-6">
                    Save jobs as drafts to edit them later
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Archived Tab */}
            <TabsContent value="archived">
              <Card className="text-center py-16">
                <CardContent>
                  <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No archived jobs
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Archived jobs will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default ImprovedEmployerDashboard;
