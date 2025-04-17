import type React from "react";
import ActiveJobSVG from "@/assets/employer-dashboard/ActiveJobSVG.svg";
import JobApplicationSVG from "@/assets/employer-dashboard/JobApplication.svg";
import ShortlistedInterviewSVG from "@/assets/employer-dashboard/ShortlistedInterview.svg";
import AcceptedInterviewSVG from "@/assets/employer-dashboard/AcceptedInterview.svg";

interface DashboardStats {
  activeJobs: number;
  newJobsThisWeek: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  totalShortlisted: number;
  shortlistedPercentage: number;
  totalHired: number;
  hiredPercentage: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: number | string;
  subValue?: string;
  iconSrc: string;
  iconAlt: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  iconSrc,
  iconAlt,
  iconColor,
}) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex-1">
    <div className="flex gap-5 items-center">
      <div
        className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center`}
      >
        <img
          src={iconSrc || "/placeholder.svg"}
          alt={iconAlt}
          className="w-5 h-5"
        />
      </div>
      <div>
        <h3 className="text-body2 text-[#414447]">{title}</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-[24px] font-semibold leading-6 tracking-[-0.072px] text-[#202326]">
            {value}
          </p>
          {subValue && (
            <p className="ml-2 text[14px] font-normal leading-6 tracking-[-0.042px] text-[#909091]">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  return (
    <div className="flex flex-row space-x-4 mb-8 overflow-x-auto font-dm-sans">
      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        subValue={`+${stats.newJobsThisWeek} this week`}
        iconSrc={ActiveJobSVG}
        iconAlt="Active Jobs"
        iconColor="bg-[#D2DEFF]"
      />

      <StatCard
        title="Total Applications"
        value={stats.totalApplications}
        subValue={`+${stats.newApplicationsThisWeek} new`}
        iconSrc={JobApplicationSVG}
        iconAlt="Total Applications"
        iconColor="bg-[#FFF2DB]"
      />

      <StatCard
        title="Hired"
        value={stats.totalHired}
        subValue={`${stats.hiredPercentage}% conversion`}
        iconSrc={AcceptedInterviewSVG}
        iconAlt="Hired"
        iconColor="bg-[#D2E9FF]"
      />

      <StatCard
        title="Shortlisted Candidates"
        value={stats.totalShortlisted}
        subValue={`${stats.shortlistedPercentage}% of applicants`}
        iconSrc={ShortlistedInterviewSVG}
        iconAlt="Shortlisted Candidates"
        iconColor="bg-[#DBFFEA]"
      />
    </div>
  );
};

export default DashboardOverview;
