// ReportPage.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetReportByInterviewIdQuery } from "@/api/reportApiSlice";
import { RootState } from "@/store/store";
import MockReportContent from "@/components/mock-report/MockReportContainer";
import Skeleton from "react-loading-skeleton";
import { useGetPublicProfileQuery } from "@/api/userPublicApiSlice";
import { mockInterviews } from "@/features/dashboard/InterviewsInvites";
import { useGetAllPreDefinedGoalsQuery } from "@/api/predefinedGoalsApiSlice";

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
    type: string;
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

// Define PredefinedGoal interface
interface PredefinedGoal {
  _id: string;
  title: string;
  description?: string;
  skills?: string[];
  category?: string;
  // Add any other properties that might be in the predefined goal
}


// Define the API response type
interface ApiResponse<T> {
  data: T;
  message: string;
  status?: number;
}

// Define User interface for auth state
interface User {
  username: string;
  profile_image?: string;
  name?: string;
  // Add other user properties as needed
}

// Define profile interface
interface UserProfile {
  name: string;
  username: string;
  profile_image: string;
  // Add other profile properties as needed
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

interface LocationState {
  isPublic?: boolean;
  best_interview?: string;
  thread_id?: string;
}

const MockReportPage: React.FC<ReportPageProps> = ({ isSharedReport }) => {
  const location = useLocation() as { state: LocationState | null, pathname: string };
  const navigate = useNavigate();
  const isPublic = location.state?.isPublic || false;
  
  // Fix the destructuring with proper typing for predefined goals
  const { data: predefinedGoalsResponse } = useGetAllPreDefinedGoalsQuery() as { 
    data: ApiResponse<PredefinedGoal[]> | undefined 
  };
  const predefinedGoals = predefinedGoalsResponse?.data || [];
  
  // Get username and interview ID from URL for shared reports
  const getInterviewIdFromUrl = () => {
    const pathParts = location.pathname.split("/");
    // URL format: /skills-report/username/interviewId
    const username = pathParts[pathParts.length - 3]; // e.g. "someUser"
    const interviewId = pathParts[pathParts.length - 1]; // e.g. "abc123"
    console.log({
      username,
      interviewId,
    });
    return {
      username,
      interviewId,
    };
  };

  // Logged-in username from Redux with type assertion
  const loggedInUsername = useSelector((state: RootState) => {
    const authState = state as unknown as { auth: { user: User | null } };
    return authState.auth.user?.username || "";
  });
  console.log("loggedInUsername", loggedInUsername);

  // Parse username & interviewId from URL (for shared):
  const { username, interviewId } = getInterviewIdFromUrl();

  // Determine what username to use for the public profile query.
  // If it's a shared report, use the username from the URL, otherwise the logged-in username.
  const profileUsername = isSharedReport ? username : loggedInUsername;

  // We only skip if we have NO username at all to query.
  const { data: profileData, isLoading: profileLoading } = useGetPublicProfileQuery(
    { username: profileUsername || "" },
    { skip: !profileUsername }
  ) as { data: UserProfile | undefined, isLoading: boolean };
  
  const profile = profileData as UserProfile;

  // Determine the correct interview ID:
  const resolvedInterviewId = isSharedReport
    ? interviewId // from URL
    : location.state?.best_interview; // from React Router state

  // Get user profile image from Redux with type assertion
  const userImg = useSelector((state: RootState) => {
    const authState = state as unknown as { auth: { user: User | null } };
    return authState.auth.user?.profile_image;
  });
  console.log("userImg", userImg);

  // State to store report data.
  const [reportData, setReportData] = useState<Report | null>(null);

  const thread_id = location.state?.thread_id;
  console.log(thread_id);
  
  // Fetch report data.
  const {
    data: fetchReportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery(resolvedInterviewId || "", {
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
  if (reportError) {
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

  let matchedItem: any = {};
  if (reportData.interview_id?.type === "Job") {
    // If interview type is "Job," match from mockInterviews
    matchedItem = mockInterviews.find(
      (job) => job.jobTitle === reportData.interview_id.title
    );
  } else if (reportData.interview_id?.type === "Mock") {
    // If reportType is "Mock," match from predefinedGoals by title
    matchedItem = predefinedGoals.find(
      (goal: PredefinedGoal) => goal.title === reportData.interview_id.title
    );
  }

  console.log(matchedItem);

  const handleBackToSkillsPage = () => {
    navigate(-1);
  };
console.log("thread_id",thread_id);


  return (
    <MockReportContent
      reportData={reportData}
      userName={profile?.name || ""} // or profile?.username, depending on your API
      handleBackToSkillsPage={handleBackToSkillsPage}
      userImg={userImg || profile.profile_image}
      sharedReport={isSharedReport}
      publicProfileName={profile?.username || ""}
      isPublic={isPublic}
      jobDetails={matchedItem ?? {}}
      thread_id={thread_id}
    />
  );
};

export default MockReportPage;
