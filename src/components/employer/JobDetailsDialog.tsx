import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Edit,
  ChevronRight,
} from "lucide-react";

import arrow from "@/assets/skills/arrow.svg"; // ← Update this import to your back-arrow icon path

import { RootState } from "@/store/store";
// This is your RTK Query that fetches the job details
import { useGetJobDetailsQuery } from "../../api/employerJobsApiSlice";
import JobDetailsTabs from "@/components/employer/JobDetailsTabs";

export interface IJob {
  _id: string;
  company: string;
  employer: string;
  title: string;
  description: string;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  work_place_type: "remote" | "hybrid" | "on-site";
  location: string;
  skills_required: any[];
  screening_questions?: {
    question: string;
    type: "yes_no" | "numeric";
    options?: string[];
    is_mandatory: boolean;
    is_eliminatory: boolean;
    ideal_answer?: string;
  }[];
  status: "active" | "closed";
  createdAt?: string;
  updatedAt?: string;
  experience_level?: string;
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  views?: number;
  applications?: number;
  candidates?: {
    applied?: string[];
    shortlisted?: string[];
    rejected?: string[];
    hired?: string[];
  };
}

// Example utilities for formatting
const jobUtils = {
  getStatusColor: (status: string) => {
    if (status === "active") return "bg-green-100 text-green-800";
    if (status === "closed") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  },
  formatJobType: (jobType: string) => {
    switch (jobType) {
      case "full-time":
        return "Full-time";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contract";
      case "internship":
        return "Internship";
      default:
        return jobType;
    }
  },
  formatExperienceLevel: (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  },
  formatSalaryRange: (range: { min: number; max: number; currency: string }) => {
    return `${range.currency}${range.min} - ${range.currency}${range.max}`;
  },
};

const JobDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  // Redux state: check auth
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  const token = useSelector((state: RootState) => state.employerAuth.token);

  // If not authenticated, redirect or show an error
  useEffect(() => {
    if (!employer || !token) {
      navigate("/employer/login");
    }
  }, [employer, token, navigate]);

  // Fetch single job details
  const { data: jobDetails, isLoading, isError } = useGetJobDetailsQuery(jobId || "", {
    skip: !jobId,
  });
  const job = jobDetails?.data;

  const [activeTab, setActiveTab] = useState("jobDetails");

  // Fallback posted date
  const postedDate = job?.createdAt || new Date().toISOString();

  if (isLoading) {
    return <div className="p-6">Loading job details...</div>;
  }

  if (isError || !job) {
    return (
      <div className="p-6 text-red-600">
        Could not fetch job details. Please try again.
      </div>
    );
  }

  // Handle edit
  const handleEdit = () => {
    navigate("/employer", { state: { editJobId: job._id } });
  };

  // Navigate back (or to jobs list)
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="w-[95%] h-screen overflow-hidden max-w-[1800px] p-5 bg-[#F5F5F5] mx-auto">
      <div className="w-full max-w-screen-xl flex flex-col gap-6">

        {/* Breadcrumb-style header */}
        <section className="flex items-center space-x-2 gap-3">
      <button
        onClick={handleBackClick}
        className="w-8 h-8 bg-white border-2 rounded-full flex justify-center items-center"
      >
        <ChevronRight className="w-3 h-3 transform rotate-180" />
      </button>
      <nav className="flex items-center gap-2">
        <h1 className="text-gray-600">Jobs</h1>
        <span className="text-gray-400">{">"}</span>
        <h2 className="text-black font-semibold">{job.title}</h2>
      </nav>
    </section>

        {/* Main content (Tabs + details) */}
        <section className="w-full h-[calc(100vh-2rem)] overflow-y-auto">
          <Tabs defaultValue="jobDetails" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="jobDetails">Job Details</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="screening">Screening Results</TabsTrigger>
              <TabsTrigger value="invited">Invited</TabsTrigger>
            </TabsList>

            {/* JOB DETAILS TAB */}
            <TabsContent value="jobDetails">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold text-gray-700">Description</h3>
                        <p className="text-gray-600 mt-2">{job.description}</p>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <h3 className="font-semibold text-gray-700">Required Skills</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.skills_required.map((skill: any, index) => (
                            <Badge key={index} variant="secondary">
                              {skill?.name ?? "Unnamed Skill"}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Screening Questions (if any) */}
                      {job.screening_questions && job.screening_questions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-700">
                            Screening Questions
                          </h3>
                          <div className="mt-2 space-y-3">
                            {job.screening_questions.map((q, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded">
                                <p className="font-medium">{q.question}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <Badge variant="outline">
                                    {q.type === "yes_no" ? "Yes/No" : "Numeric"}
                                  </Badge>
                                  {q.is_mandatory && (
                                    <Badge variant="outline" className="bg-blue-50">
                                      Required
                                    </Badge>
                                  )}
                                  {q.is_eliminatory && (
                                    <Badge variant="outline" className="bg-red-50">
                                      Eliminatory
                                    </Badge>
                                  )}
                                </div>
                                {q.ideal_answer && (
                                  <p className="text-sm mt-2">
                                    <span className="font-medium">Ideal answer:</span>{" "}
                                    {q.ideal_answer}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium">Location</h4>
                          <p className="text-sm text-gray-600">{job.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium">Work Place Type</h4>
                          <p className="text-sm text-gray-600">
                            {job.work_place_type
                              ? job.work_place_type.charAt(0).toUpperCase() +
                                job.work_place_type.slice(1)
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium">Job Type</h4>
                          <p className="text-sm text-gray-600">
                            {jobUtils.formatJobType(job.job_type)}
                          </p>
                        </div>
                      </div>

                      {job.experience_level && (
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium">Experience Level</h4>
                            <p className="text-sm text-gray-600">
                              {jobUtils.formatExperienceLevel(job.experience_level)}
                            </p>
                          </div>
                        </div>
                      )}

                      {job.salary_range && (
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium">Salary Range</h4>
                            <p className="text-sm text-gray-600">
                              {jobUtils.formatSalaryRange(job.salary_range)}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium">Posted Date</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(postedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Edit Button */}
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Job
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Additional tabs (Candidates, Screening, etc.) */}
            <JobDetailsTabs
              job={job}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default JobDetailsPage;
