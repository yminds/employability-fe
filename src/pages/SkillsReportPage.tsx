

// ReportPage.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetReportByInterviewIdQuery } from "@/api/reportApiSlice";
import InterviewPlayer from "@/components/interview/InterviewPlayer";

import { RootState } from "@/store/store";
import ReportContent from "@/components/skills-report/SkillsReportContainer"
import Skeleton from "react-loading-skeleton";
interface Report {
  interview_id: {
    title: string;
  };
  summary: Summary;
  concept_ratings?: {
    concept: string;
    rating: number;
    reason: string;
  }[];
  _id?: string;
  updatedAt?: string;
  final_rating:number
  s3_recording_url: [string];
}
interface Performance {
  criteria: string;
  rating: number;
}

interface Summary {
  text: string;
  strengths: string[];
  improvements: string[];
  performance_highlights: Performance[];
}
// Loading Component
const LoadingState = () => (
  <div className="w-full max-w-[1800px] mx-auto max-h-[95vh] m-4 p-10 space-y-8 overflow-y-auto">

  {/* Summary section */}
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">
      <Skeleton width={100} />
    </h2>
    <div className="space-y-2">
      <Skeleton count={3} />
    </div>
  </div>

  {/* Two column layout */}
  <div className="grid md:grid-cols-2 gap-6">
    {/* Strengths section */}
    <div className="space-y-4">
      <h3 className="font-medium">
        <Skeleton width={80} />
      </h3>
      <ul className="space-y-2">
        {[1, 2].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Skeleton width={200} />
          </li>
        ))}
      </ul>
    </div>

    {/* Performance Highlights */}
    <div className="space-y-4">
      <h3 className="font-medium">
        <Skeleton width={150} />
      </h3>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex justify-between items-center">
            <Skeleton width={150} />
            <Skeleton width={40} />
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Performance Criteria Table */}
  <div className="space-y-4">
    <h3 className="font-medium">
      <Skeleton width={180} />
    </h3>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex justify-between items-center p-3 border rounded-lg">
          <Skeleton width={120} />
          <Skeleton width={80} height={24} className="rounded-full" />
        </div>
      ))}
    </div>
  </div>
</div>
);

const ReportPage = () => {
  const location = useLocation();
  const best_interview = location.state?.best_interview;
  const goal_name = location.state?.goal_name;
  const skill_icon = location.state?.skillIcon;
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const navigate = useNavigate();

  const [reportData, setReport] = useState<Report | null>(null);

  const {
    data: fetchReportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery(best_interview);

  useEffect(() => {
    if (fetchReportData?.data) {
      setReport(fetchReportData.data as Report);
    }
  }, [fetchReportData]);

  const handleBackToSkillsPage = () => {
    navigate("/skills");
  };

  console.log("reportData", reportData);

  if (reportLoading) return <LoadingState />;
  if (reportError) return <div className="text-red-500 text-center mt-10">Error fetching report data</div>;
  if (!reportData) return null;

  return (
    <ReportContent
      reportData={reportData}
      userName={userName || ""}
      handleBackToSkillsPage={handleBackToSkillsPage}
      goal_name={goal_name}
      skill_icon={skill_icon}
      sharedReport= {false}
    />
  );
};

export default ReportPage;