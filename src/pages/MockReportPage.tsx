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
import UpdatedMockReportContainer from "@/components/mock-report/updatedReport";

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
  createdAt:string;
}

interface PredefinedGoal {
  _id: string;
  title: string;
  description?: string;
  skills?: string[];
  category?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status?: number;
}

interface User {
  username: string;
  profile_image?: string;
  name?: string;
}
export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  currently_working: boolean;
  end_date: string;
  start_date: string;
  description: string;
  employment_type: string;
}

interface UserProfile {
  name: string;
  username: string;
  profile_image: string;
  experience: ExperienceItem[];
}

const LoadingState = () => (
  <div className="w-full max-w-[1800px] mx-auto max-h-[95vh] m-4 p-10 space-y-8 overflow-y-auto">
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        <Skeleton width={100} />
      </h2>
      <div className="space-y-2">
        <Skeleton count={3} />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
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
  
  const { data: predefinedGoalsResponse } = useGetAllPreDefinedGoalsQuery() as { 
    data: ApiResponse<PredefinedGoal[]> | undefined 
  };
  const predefinedGoals = predefinedGoalsResponse?.data || [];
  
  const getInterviewIdFromUrl = () => {
    const pathParts = location.pathname.split("/");
    // URL format: /skills-report/username/interviewId
    const inviteId = pathParts[pathParts.length - 3 ];
    const username = pathParts[pathParts.length - 2]; // e.g. "someUser"
    const interviewId = pathParts[pathParts.length - 1]; // e.g. "abc123"
    console.log({
      username,
      interviewId,
      inviteId
    });
    return {
      username,
      interviewId,
      inviteId
    };
  };

  const loggedInUsername = useSelector((state: RootState) => {
    const authState = state as unknown as { auth: { user: User | null } };
    return authState.auth.user?.username || "";
  });

  const { username, interviewId, inviteId } = getInterviewIdFromUrl();

  const profileUsername = isSharedReport ? username : loggedInUsername;

  const { data: profileData, isLoading: profileLoading } = useGetPublicProfileQuery(
    { username: profileUsername || "" },
    { skip: !profileUsername }
  ) as { data: UserProfile | undefined, isLoading: boolean };
  
  const profile = profileData as UserProfile;
  console.log("profile details", profile);

  const resolvedInterviewId = isSharedReport
    ? interviewId
    : location.state?.best_interview;

  const userImg = useSelector((state: RootState) => {
    const authState = state as unknown as { auth: { user: User | null } };
    return authState.auth.user?.profile_image;
  });
  console.log("userImg", userImg);

  const [reportData, setReportData] = useState<Report | null>(null);

  const thread_id = location.state?.thread_id;
  console.log(thread_id);
  
  const {
    data: fetchReportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery(resolvedInterviewId || "", {
    skip: !resolvedInterviewId,
  });

  useEffect(() => {
    if (fetchReportData?.data) {
      setReportData(fetchReportData.data as Report);
    }
  }, [fetchReportData]);

  if (profileLoading || reportLoading) {
    return <LoadingState />;
  }

  if (reportError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error fetching report data.
      </div>
    );
  }

  if (!profile || !reportData) {
    return <LoadingState />;
  }

  let matchedItem: any = {};
  if (reportData.interview_id?.type === "Job") {
    matchedItem = mockInterviews.find(
      (job) => job.jobTitle === reportData.interview_id.title
    );
  } else if (reportData.interview_id?.type === "Mock") {
    matchedItem = predefinedGoals.find(
      (goal: PredefinedGoal) => goal.title === reportData.interview_id.title
    );
  }

  console.log(matchedItem);

  const handleBackToSkillsPage = () => {
    navigate(-1);
  };

  const professionalExperience = profile?.experience ;
  console.log("Experience", professionalExperience)


  return (
    // <MockReportContent
    //   reportData={reportData}
    //   userName={profile?.name || ""}
    //   handleBackToSkillsPage={handleBackToSkillsPage}
    //   userImg={userImg || profile.profile_image}
    //   sharedReport={isSharedReport}
    //   publicProfileName={profile?.username || ""}
    //   isPublic={isPublic}
    //   jobDetails={matchedItem ?? {}}
    //   thread_id={thread_id}
    // />
    <UpdatedMockReportContainer reportData={reportData} isSharedReport={false} professionalExperience={professionalExperience} inviteId={inviteId} publicProfileName={profile?.username || ""} />
  );
};

export default MockReportPage;