import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateJobPostingMutation,
  useGetCompanyJobsQuery,
  useUpdateJobMutation,
} from "../api/employerJobsApiSlice";
import { Briefcase, Users, Clock, Inbox, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import emojiWavingImg from "@/assets/dashboard/emoji_waving.svg";
import { toast } from "sonner";

// Import our components
import DashboardOverview from "./ImprovedEmployerDashboard";
import JobFilters from "@/components/employer/JobFilter";
import JobCard, { IJob } from "@/components/employer/JobCard";
import JobPostingForm from "@/components/employer/JobPostingForm";
import JobDetailsDialog from "@/components/employer/JobDetailsDialog";
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
  const [isJobPostingOpen, setIsJobPostingOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
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
  console.log("employerCompany",employer?.company._id)
  const token = useSelector((state: RootState) => state.employerAuth.token);

  // Query for jobs with proper error handling and loading states
  const {
    data: jobsData,
    isLoading,
    isFetching,
    refetch: refetchJobs,
  } = useGetCompanyJobsQuery(
    {
      company_id: employer?.company || "",
    },
    {
      // Only run the query if we have a company ID
      skip: !employer?.company,
      refetchOnMountOrArgChange: true,
    }
  );

  const [createJob, { isLoading: isCreating }] = useCreateJobPostingMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  // Dashboard statistics with safe access patterns
  const dashboardStats = {
    activeJobs:
      jobsData?.data?.filter((job: any) => job.status === "active")?.length ||
      0,
    newJobsThisWeek: 3, // Consider making this dynamic in the future
    totalApplications:
      jobsData?.data?.reduce(
        (acc: number, job: any) => acc + (job.applications || 0),
        0
      ) || 0,
    newApplicationsThisWeek: 15, // Consider making this dynamic in the future
    totalShortlisted:
      jobsData?.data?.reduce(
        (acc: number, job: any) =>
          acc + (job.candidates?.shortlisted?.length || 0),
        0
      ) || 0,
    shortlistedPercentage: 42, // Consider making this dynamic in the future
    totalHired:
      jobsData?.data?.reduce(
        (acc: number, job: any) => acc + (job.candidates?.hired?.length || 0),
        0
      ) || 0,
    hiredPercentage: 28, // Consider making this dynamic in the future
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!employer || !token) {
      navigate("/employer/login");
    }
  }, [employer, token, navigate]);

  // Handle job submission (create or update)
  const handleJobSubmit = async (jobData: any) => {
    try {
      if (isEditMode && selectedJob) {
        await updateJob({
          id: selectedJob._id,
          data: {
            ...jobData,
            employer_id: employer?._id,
            company_id: employer?.company?._id,
          },
        }).unwrap();

        toast.success("Job Updated", {
          description: "The job posting has been successfully updated.",
        });
      } else {
        await createJob({
          ...jobData,
          employer_id: employer?._id,
          company_id: employer?.company,
        }).unwrap();

        toast.success("Job Posted", {
          description: "Your job has been successfully posted.",
        });
      }
      setIsJobPostingOpen(false);
      setIsEditMode(false);
      setSelectedJob(null);
      refetchJobs(); // Refresh jobs after creating/updating
    } catch (error) {
      console.error("Error creating/updating job:", error);

      toast.error("Error", {
        description:
          "There was an error processing your request. Please try again.",
      });
    }
  };

  const handleEditJob = (job: IJob) => {
    setSelectedJob(job);
    setIsEditMode(true);
    setIsJobPostingOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      experience_level: "all",
      status: "all",
      search: "",
    });
  };

  // Safe access to filtered jobs
  const filteredJobs =
    jobsData?.data && jobsData.data.length > 0
      ? jobUtils.filterJobs(jobsData.data, filters)
      : [];

  const isContentLoading = isLoading || isFetching;

  return (
    <main className="h-screen w-full overflow-hidden font-ubuntu">
      <div className="h-full flex flex-col bg-[#F5F5F5]">
        <div className="flex-1 p-[35px] md:p-[55px] overflow-y-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-gray-800 text-2xl md:text-3xl font-semibold flex items-center gap-3">
                Welcome Back, {employer?.employerName || "User"}
                <span className="wave">
                  <img src={emojiWavingImg} alt="Emoji" className="w-5" />
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your job postings and candidates
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => navigate("/employer/candidates")}
              >
                <Users className="h-4 w-4 mr-2" />
                All Candidates
              </Button>
              <Button
                onClick={() => {
                  setSelectedJob(null);
                  setIsEditMode(false);
                  setIsJobPostingOpen(true);
                }}
                className="bg-[#001630] text-white hover:bg-[#062549]"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </header>

          {/* Dashboard Overview */}
          {isContentLoading ? (
            <OverviewSkeleton />
          ) : (
            <DashboardOverview stats={dashboardStats} />
          )}

          {/* Main Content */}
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList className="bg-white">
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
            </TabsList>

            <TabsContent value="jobs" className="space-y-6">
              {/* Filters */}
              <JobFilters
                filters={filters}
                setFilters={setFilters}
                onReset={resetFilters}
              />

              {isContentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  {!filteredJobs || filteredJobs.length === 0 ? (
                    <Card className="text-center py-20">
                      <CardContent>
                        <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No jobs posted yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Create your first job posting to start hiring talent
                        </p>
                        <Button
                          onClick={() => {
                            setSelectedJob(null);
                            setIsEditMode(false);
                            setIsJobPostingOpen(true);
                          }}
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
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
                          onSelect={setSelectedJob}
                          onEdit={handleEditJob}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

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

          {/* Job Posting Dialog */}
          <Dialog
            open={isJobPostingOpen}
            onOpenChange={(open) => {
              if (!open) {
                setIsJobPostingOpen(false);
                setIsEditMode(false);
                setSelectedJob(null);
              }
            }}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-6">
              <DialogTitle className="text-xl mb-3">
                {isEditMode ? "Edit Job" : "Post a New Job"}
              </DialogTitle>
              <JobPostingForm
                onClose={() => {
                  setIsJobPostingOpen(false);
                  setIsEditMode(false);
                  setSelectedJob(null);
                }}
                onSubmit={handleJobSubmit}
                initialData={isEditMode ? selectedJob : null}
                isLoading={isCreating || isUpdating}
              />
            </DialogContent>
          </Dialog>

          {/* Job Details Dialog */}
          {selectedJob && !isEditMode && (
            <Dialog
              open={!!selectedJob && !isEditMode}
              onOpenChange={(open) => {
                if (!open) setSelectedJob(null);
              }}
            >
              <JobDetailsDialog
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                onEdit={handleEditJob}
              />
            </Dialog>
          )}
        </div>
      </div>
    </main>
  );
};

export default ImprovedEmployerDashboard;
