import React from "react";
import { Briefcase, TrendingUp, Users, UserCheck, Award } from "lucide-react";

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

const StatCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  iconColor,
  trend = null,
}: {
  title: string;
  value: number | string;
  subValue?: string;
  icon: React.ElementType;
  iconColor: string;
  trend?: { value: number; isPositive: boolean } | null;
}) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex-1">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subValue && <p className="ml-2 text-sm text-gray-500">{subValue}</p>}
        </div>
        {trend && (
          <div
            className={`mt-1 flex items-center text-sm ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`w-3 h-3 ${
                trend.isPositive ? "" : "transform rotate-180"
              } mr-1`}
            />
            <span>
              {trend.value}% {trend.isPositive ? "increase" : "decrease"}
            </span>
          </div>
        )}
      </div>
      <div className={`p-2 rounded-md ${iconColor}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  return (
    <div className="flex flex-row space-x-4 mb-8 overflow-x-auto pb-2 font-dm-sans">
      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        subValue={`+${stats.newJobsThisWeek} this week`}
        icon={Briefcase}
        iconColor="bg-blue-600"
      />

      <StatCard
        title="Total Applications"
        value={stats.totalApplications}
        subValue={`+${stats.newApplicationsThisWeek} new`}
        icon={Users}
        iconColor="bg-purple-600"
        trend={{ value: 12, isPositive: true }}
      />

      <StatCard
        title="Shortlisted Candidates"
        value={stats.totalShortlisted}
        subValue={`${stats.shortlistedPercentage}% of applicants`}
        icon={UserCheck}
        iconColor="bg-amber-600"
      />

      <StatCard
        title="Hired"
        value={stats.totalHired}
        subValue={`${stats.hiredPercentage}% conversion`}
        icon={Award}
        iconColor="bg-green-600"
      />
    </div>
  );
};

export default DashboardOverview;
