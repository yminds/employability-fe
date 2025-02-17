// ReportPage.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useGetReportByInterviewIdQuery } from "@/api/reportApiSlice";
import { RootState } from "@/store/store";
import ReportContent from "@/components/skills-report/SkillsReportContainer";
import Skeleton from "react-loading-skeleton";
import { useGetPublicProfileQuery } from "@/api/userPublicApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";

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
  final_rating: number;
  s3_recording_url: [string];
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

interface ReportPageProps {
  isSharedReport: boolean;
  userName?: string;
}

const ReportPage: React.FC<ReportPageProps> = ({ isSharedReport }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // For shared reports, extract the interview ID from the URL.
  const getInterviewIdFromUrl = () => {
    const pathParts = location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  // Get username from Redux store.
  const username = useSelector((state: any) => state.auth.user?.username);

  // Fetch public profile only when username exists.
  const { data: profile, isLoading: profileLoading } = useGetPublicProfileQuery(
    { username },
    { skip: !username }
  );

  // Determine interview ID based on report type.
  const resolvedInterviewId = isSharedReport
    ? getInterviewIdFromUrl()
    : location.state?.best_interview;

  // For non-shared reports, goal name and skill icon are passed via state.
  const goal_name =
    isSharedReport && profile?.goals?.length
      ? profile.goals[0].name
      : location.state?.goal_name || "";
  const skill_icon =
    isSharedReport
      ? searchParams.get("skill_icon") || ""
      : location.state?.skillIcon || "";

  const userSkillId = location.state?.skillId || "";

  // Get user profile image from Redux.
  const userImg = useSelector((state: RootState) => state.auth.user?.profile_image);

  // State to store report data.
  const [reportData, setReportData] = useState<Report | null>(null);

  // Fetch interview data.
  const {
    data: fetchInterviewData,
    isLoading: interviewLoading,
    error: interviewError,
  } = useGetInterviewbyIdQuery(resolvedInterviewId);

  // Fetch report data.
  const {
    data: fetchReportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery(resolvedInterviewId);

  // Once both interview data and report data are available, set the report state.
  useEffect(() => {
    if (fetchReportData?.data && fetchInterviewData?.data) {
      setReportData(fetchReportData.data as Report);
    }
  }, [fetchReportData, fetchInterviewData]);

  // Get the skill id from interview data and then safely extract the skill icon from profile.
  
  const skillId = fetchInterviewData?.data?.skill_id;

  const profileSkillIcon =
    profile?.skills?.find(
      (skill: any) => skill.skill_pool_id._id === skillId
    )?.skill_pool_id.icon || skill_icon;

  const skill = 
  profile?.skills?.find(
    (skill: any) => skill.skill_pool_id._id === skillId
  )?.skill_pool_id.name;

  const level =  
  profile?.skills?.find(
    (skill: any) => skill.skill_pool_id._id === skillId
  )?.level || skill_icon;

  const handleBackToSkillsPage = () => {
    navigate("/skills");
  };

  // If any required data is still loading, show the loading state.
  if (profileLoading || interviewLoading || reportLoading) {
    return <LoadingState />;
  }

  // Handle error states.
  if (reportError || interviewError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error fetching report data.
      </div>
    );
  }

  // Ensure all necessary data is available before rendering the report.
  if (!profile || !fetchInterviewData || !reportData) {
    return <LoadingState />;
  }

  return (
    <ReportContent
      reportData={reportData}
      userName={profile.name || ""}
      handleBackToSkillsPage={handleBackToSkillsPage}
      goal_name={goal_name}
      skill_icon={profileSkillIcon}
      userImg={userImg}
      sharedReport={isSharedReport}
      skillId={skillId}
      userSkillId={userSkillId}
      level={level}
      skill={skill}
    />
  );
};

export default ReportPage;
