// ReportPage.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetReportByInterviewIdQuery } from "@/api/reportApiSlice";
import { RootState } from "@/store/store";
import Skeleton from "react-loading-skeleton";
import { useGetPublicProfileQuery } from "@/api/userPublicApiSlice";
import MockReportContent from "@/components/project-report/ProjectInterviewContainer";

interface Performance {
    criteria: string;
    rating: number;
  }
  
  interface TechnicalSkills {
    score: number;
    strengths: string[];
    areasForImprovement: string[];
  }
  
  interface ProblemSolvingSkills {
    score: number;
    strengths: string[];
    areasForImprovement: string[];
  }
  
  interface SoftSkills {
    score: number;
    strengths: string[];
    areasForImprovement: string[];
  }
  
  interface Summary {
    text: string;
    strengths: string[];
    improvements: string[];
    performance_highlights: Performance[];
    technicalSkills: TechnicalSkills;
    problemSolvingSkills: ProblemSolvingSkills;
    softskills: SoftSkills;
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
  reportType:string
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
          <div
            key={item}
            className="flex justify-between items-center p-3 border rounded-lg"
          >
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

const ProjectReportPage: React.FC<ReportPageProps> = ({ isSharedReport }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = location.state?.isPublic || false;

  // Get username and interview ID from URL for shared reports
  const getInterviewIdFromUrl = () => {
    const pathParts = location.pathname.split("/");
    // URL format: /skills-report/username/interviewId
    const username = pathParts[pathParts.length - 2]; // e.g. "someUser"
    const interviewId = pathParts[pathParts.length - 1]; // e.g. "abc123"
    console.log({
      username,
      interviewId,
    })
    return {
      username,
      interviewId,
    };
  };

  // Logged-in username from Redux
  const loggedInUsername = useSelector(
    (state: any) => state.auth.user?.username
  );
  console.log("loggedInUsername",loggedInUsername)

  // Parse username & interviewId from URL (for shared):
  const { username, interviewId } = getInterviewIdFromUrl();

  // Determine what username to use for the public profile query.
  // If it's a shared report, use the username from the URL, otherwise the logged-in username.
  const profileUsername = isSharedReport ? username : loggedInUsername;

  // We only skip if we have NO username at all to query.
  const { data: profile, isLoading: profileLoading } = useGetPublicProfileQuery(
    { username: profileUsername || "" },
    { skip: !profileUsername }
  );

  // Determine the correct interview ID:
  const resolvedInterviewId = isSharedReport
    ? interviewId // from URL
    : location.state?.best_interview; // from React Router state

  // Get user profile image from Redux.
  const userImg = useSelector(
    (state: RootState) => state.auth?.user?.profile_image
  ) ;
  console.log("userImg",userImg)

  // State to store report data.
  const [reportData, setReportData] = useState<Report | null>(null);

  // Fetch report data.
  const {
    data: fetchReportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery(resolvedInterviewId, {
    skip: !resolvedInterviewId,
  });

  // Once both interview data and report data are available, set the report state.
  useEffect(() => {
    if (fetchReportData?.data) {
      setReportData(fetchReportData.data as Report);
    }
  }, [fetchReportData]);

  // If any required data is still loading, show the loading state.
  if (profileLoading || reportLoading) {
    return <LoadingState />;
  }

  // Handle error states.
  if (reportError ) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error fetching report data.
      </div>
    );
  }

  // If we've finished loading but don't have the data, show a loading skeleton or error
  if (!profile || !reportData) {
    return <LoadingState />;
  }

  const handleBackToSkillsPage = () => {
    navigate(-1);
  };

  return (
    <MockReportContent
    reportData={reportData}
    userName={profile?.name || ""} // or profile?.username, depending on your API
    handleBackToSkillsPage={handleBackToSkillsPage}
    userImg={userImg || profile.profile_image}
    sharedReport={isSharedReport}
    publicProfileName={profile?.username || ""}
    isPublic={isPublic}
  />
  );
};

export default ProjectReportPage;