import React from "react";
import { useEffect, useState } from "react";
import JobCard from "@/features/jobs/JobCard";
import JobSideBar from "@/features/jobs/JobsSideBar";
import JobsHeader from "@/features/jobs/JobsHeader";
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import JobsFilterModal from "@/features/jobs/JobsFilterModal";
import JobDetailsModal from "@/features/jobs/JobDetailsModal";
import { useGetAllJobsMutation } from "@/api/jobsApiSlice";
import { useGetGoalsbyuserQuery } from "@/api/goalsApiSlice";
import { useGetSavedJobsQuery } from "@/api/jobsApiSlice";

export interface Skill {
  _id: string;
  name: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  locations: string[];
  skills: Skill[];
  status: string;
  logo: string;
  minimumExperience: number;
  aboutCompany: string;
  salaryRange: string;
  description: string;
  applicationUrl: string;
}

export interface Filter {
  search: string;
  jobRoles: string[];
  locations: string[];
  workTypes: string[];
  minimumSalary: number;
  jobTypes: string[];
  companySize: string;
  currency: string;
  minimumExperience: number | null;
  onlyRemoteJobs: boolean;
  skills: string[];
}

export interface Goal {
  _id: string;
  name: string;
  experience: string;
}

const JobPage: React.FC = () => {
  const defaultJobFilters: Filter = {
    search: "",
    locations: [],
    workTypes: [],
    jobRoles: [],
    minimumSalary: 0,
    jobTypes: [],
    companySize: "",
    currency: "INR",
    onlyRemoteJobs: false,
    minimumExperience: null,
    skills: [],
  };

  const userExperience = 2;
  const [reachedEnd, setReachedEnd] = useState<boolean>(true);
  const [filters, setFilters] = useState(defaultJobFilters);
  const userId = useSelector((state: RootState) => state?.auth.user?._id);
  const { data: goalData, isLoading: goalLoading } =
    useGetGoalsbyuserQuery(userId);

  const [getAllJobs, { data: jobs, isLoading, error }] =
    useGetAllJobsMutation();

  const [getUserSkills, { data: skillsData, isLoading: userSkillsLoading }] =
    useGetUserSkillsMutation();

  const { data: savedJobs, isLoading: isSavedJobsLoading } =
    useGetSavedJobsQuery(userId ?? "") as unknown as {
      data: Job[];
      isLoading: boolean;
    };

  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [jobsCategory, setJobsCategory] = useState("All");

  useEffect(() => {
    if (goalData != undefined && goalData.data.length > 0) {
      const fetched_goals = goalData.data;
      setAllGoals(fetched_goals);
      setSelectedGoal(fetched_goals[0]._id);
    }
  }, [goalData]);

  useEffect(() => {
    if (skillsData != undefined) {
      const fetched_skills = skillsData.data.all
        .filter((skill) => skill.verified_rating >= 4)
        .map((skill) => skill.skill_pool_id);
      const skill_ids = fetched_skills.map((item) => item._id);
      setUserSkills(skill_ids);
    }
  }, [skillsData]);

  useEffect(() => {
    if (selectedGoal == null) {
      setUserSkills([]);
    } else {
      getUserSkills({ userId, goalId: selectedGoal });
    }
  }, [selectedGoal]);

  useEffect(() => {
    setReachedEnd(false);
    setPageNumber(1);
    setJobsList([]);
  }, [filters]);

  useEffect(() => {
    let updatedSkills: string[] = [];
    if (jobsCategory == "All") {
      updatedSkills = [];
    } else if (jobsCategory == "Suggested") {
      updatedSkills = userSkills;
    } else if (jobsCategory == "Active applications") {
      updatedSkills = [];
    } else if (jobsCategory == "Saved") {
      setFilters(defaultJobFilters);
      setJobsList([]);
      setReachedEnd(true);
      return;
    }
    if (
      !filters.skills.every((item) => updatedSkills.includes(item)) ||
      updatedSkills.length != filters.skills.length
    ) {
      setFilters((prev) => ({ ...prev, skills: updatedSkills }));
      setPageNumber(1);
    }
  }, [jobsCategory, userSkills]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (jobsCategory !== "Saved") {
      getAllJobs({ page: pageNumber, filters });
    }
  }, [pageNumber, filters, jobsCategory]);

  useEffect(() => {
    if (jobs !== undefined && jobs.length > 0) {
      setJobsList((prevJobs: any) => [...prevJobs, ...jobs]);
    }

    if (jobs !== undefined && jobs.length < 10) {
      // when end is reached
      setReachedEnd(true);
    }
  }, [jobs]);

  const handleScroll = (e: any) => {
    if (jobsCategory === "Saved") return; // Disable scrolling for saved jobs
    const container = e.target;
    const maxScroll = container.scrollHeight - container.clientHeight; // Absolute bottom

    if (
      Math.floor(container.scrollHeight - container.scrollTop) -
        container.clientHeight <
      1
    ) {
      if (!isLoading && !reachedEnd) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
      container.scrollTop = maxScroll - 5; // Prevent
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm }));
  };

  const displayDetails = (job: any) => {
    setIsDetailsModalOpen(true);
    setSelectedJob(job);
  };

  const handleGoalChange = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const displayedJobs = jobsCategory === "Saved" ? savedJobs || [] : jobsList;

  return (
    <div className="h-screen w-[95%] max-w-[1800px] bg-[#F5F5F5] p-5 flex flex-row gap-8 mx-auto">
      <div className="w-full max-w-screen-xl flex flex-col gap-8">
        <JobsHeader
          onSearch={handleSearch}
          filters={filters}
          openFiltersModal={() => setIsFilterModalOpen(true)}
          JobsTab={jobsCategory}
          setJobsTab={(jobsCategory: string) => {
            setJobsCategory(jobsCategory);
          }}
        ></JobsHeader>

        <div
          className="flex flex-col gap-4 overflow-scroll scrollbar-hide w-full h-full snap-y snap-mandatory"
          onScroll={handleScroll}
        >
          {displayedJobs.map((jobData, index) => (
            <JobCard
              key={index}
              job={jobData}
              preferedLocations={filters.locations}
              userSkills={userSkills}
              userExperience={userExperience}
              onApply={() => {
                displayDetails(jobData);
              }}
            />
          ))}
          {jobsCategory === "Saved" && displayedJobs.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No saved jobs found
            </div>
          )}
        </div>
      </div>

      <div className="w-[25%] w-max-[260px]">
        <JobSideBar
          allGoals={allGoals}
          selectedGoalId={selectedGoal}
          onGoalChange={handleGoalChange}
        />
      </div>

      {isFilterModalOpen && (
        <JobsFilterModal
          filters={filters}
          setIsFilterModalOpen={setIsFilterModalOpen}
          setfilters={setFilters}
        />
      )}
      {isDetailsModalOpen && selectedJob != undefined ? (
        <JobDetailsModal
          jobData={selectedJob}
          userSkills={userSkills}
          closeModal={() => {
            setIsDetailsModalOpen(false);
          }}
          goals={goalData}
          goalId={selectedGoal}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default JobPage;
