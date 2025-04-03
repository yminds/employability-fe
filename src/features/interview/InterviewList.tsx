import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetInterviewDetailsQuery } from "@/api/interviewDetailsApiSlice";
import InterviewCard from "./InterviewCard";
import search from "@/assets/skills/search.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import thumbnail from "@/assets/profile/MockInterview.svg";
import InterviewInvitationsList from "@/features/dashboard/InterviewInvitationsList";
import { InterviewInvite } from "@/hooks/useInterviewInvites";

type InterviewType = "all" | "skill" | "project" | "mock" | "job" | "invites";

interface InterviewListProps {
  goalId: string | null;
  invites?: InterviewInvite[];
}

interface Interview {
  _id: string;
  interview_id: {
    _id: string;
    title: string;
    type: string;
    createdAt: string;
    thread_id: string;
  };
  final_rating: number;
  s3_recording_url: string[];
  thubmnail_url: string;
  summary?: {
    text: string;
  };
}

interface GroupedInterviews {
  [key: string]: {
    best: Interview;
    history: Interview[];
  };
}

const InterviewList: React.FC<InterviewListProps> = ({ goalId, invites }) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { data: interviewDetails, isLoading } =
    useGetInterviewDetailsQuery(userId);

  // Set initial tab to invites if invites are present
  const [selectedType, setSelectedType] = useState<InterviewType>(
    invites && invites.length > 0 ? "invites" : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [groupedInterviews, setGroupedInterviews] = useState<GroupedInterviews>(
    {}
  );
  const [hoveredInterview, setHoveredInterview] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Effect to update selected type if invites data changes and it's the initial load
  useEffect(() => {
    if (!hasInitialized && invites && invites.length > 0) {
      setSelectedType("invites");
      setHasInitialized(true);
    }
  }, [invites, hasInitialized]);

  // Group interviews by title and find the best one for each
  useEffect(() => {
    if (interviewDetails?.data?.reports) {
      // First apply type filter
      let filtered = interviewDetails.data.reports;

      if (selectedType !== "all") {
        if (selectedType === "job") {
          filtered = filtered.filter((report: Interview) =>
            ["job", "full", "screening"].includes(
              report.interview_id.type.toLowerCase()
            )
          );
        } else {
          filtered = filtered.filter(
            (report: Interview) =>
              report.interview_id.type.toLowerCase() === selectedType
          );
        }
      }

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (report: Interview) =>
            report.interview_id.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (report.summary?.text &&
              report.summary.text
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        );
      }

      // Group interviews by title
      const grouped: GroupedInterviews = {};

      filtered.forEach((report: Interview) => {
        const title = report.interview_id.title;
        const isJobInterview = ["job", "full", "screening"].includes(
          report.interview_id.type.toLowerCase()
        );

        if (isJobInterview) {
          const uniqueKey = `${title}-${report._id}`;
          grouped[uniqueKey] = {
            best: report,
            history: [],
          };
        } else {
          if (!grouped[title]) {
            grouped[title] = {
              best: report,
              history: [],
            };
          } else {
            if (report.final_rating > grouped[title].best.final_rating) {
              grouped[title].history.push(grouped[title].best);
              grouped[title].best = report;
            } else {
              grouped[title].history.push(report);
            }
          }
        }
      });

      // Sort history by date (newest first)
      Object.keys(grouped).forEach((title) => {
        grouped[title].history.sort(
          (a, b) =>
            new Date(b.interview_id.createdAt).getTime() -
            new Date(a.interview_id.createdAt).getTime()
        );
      });

      // Convert grouped object to array for sorting
      const groupedArray = Object.entries(grouped).map(([key, value]) => ({
        key,
        ...value,
      }));

      // Sort the array by date (newest first)
      groupedArray.sort(
        (a, b) =>
          new Date(b.best.interview_id.createdAt).getTime() -
          new Date(a.best.interview_id.createdAt).getTime()
      );

      // Convert back to object
      const sortedGrouped: GroupedInterviews = {};
      groupedArray.forEach((item) => {
        sortedGrouped[item.key] = {
          best: item.best,
          history: item.history,
        };
      });

      setGroupedInterviews(sortedGrouped);
    }
  }, [searchQuery, selectedType, interviewDetails]);

  const renderInterviewTypes = () => {
    interface TypeItem {
      id: string;
      label: string;
      count?: number;
    }

    const types: TypeItem[] = [
      { id: "all", label: "All" },
      { id: "job", label: "Jobs" },
      { id: "skill", label: "Skills" },
      { id: "project", label: "Projects" },
      { id: "mock", label: "Mock" },
      { id: "invites", label: "Invites" },
    ];

    return (
      <div className="flex gap-1 items-center mb-10 sm:max-w-[100%] sm:flex sm:flex-col-reverse sm:items-start md:items-start sm:gap-5">
        <div className="sm:flex h-[46px]">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as InterviewType)}
              className={`px-4 py-2 rounded-[3px] text-body2 transition-all sm:px-2 sm:py-2 ${
                selectedType === type.id
                  ? "bg-[#001630] text-white hover:bg-[#062549]"
                  : "text-[#68696B]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between ml-auto sm:ml-0 sm:w-[100%]">
          <div className="relative w-64 sm:max-w-[100%]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#D6D7D9] rounded-[6px] text-body2 px-4 py-2 pl-10 text-sm w-full focus:outline-none"
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <img
                src={search || "/placeholder.svg?height=16&width=16"}
                alt="Search Icon"
                className="w-4 h-4 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div key={Math.random()} className="mb-4">
      <div className="flex items-center justify-between w-full bg-white p-4 rounded-md border-gray-200">
        <div className="flex items-center">
          <Skeleton circle={true} height={40} width={40} className="mr-4" />
          <div>
            <Skeleton height={16} width={100} className="mb-2" />
            <Skeleton height={12} width={80} />
          </div>
        </div>
        <div>
          <Skeleton height={16} width={120} />
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[32px] sm:p-6">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px]">
        {renderInterviewTypes()}

        <div className="space-y-7">
          {selectedType === "invites" ? (
            // Show invitations
            invites && invites.length > 0 ? (
              <InterviewInvitationsList
                invites={invites}
                userId={userId}
                isDashboard={false}
                hideHeader={true}
              />
            ) : (
              <div className="text-gray-500 text-body2 text-center py-8">
                No interview invitations found
              </div>
            )
          ) : isLoading ? (
            // Loading interviews
            Array.from({ length: 3 }).map(() => renderLoadingSkeleton())
          ) : Object.keys(groupedInterviews).length > 0 ? (
            // Show filtered interviews
            Object.entries(groupedInterviews).map(
              ([title, { best, history }], index) => (
                <InterviewCard
                  key={best._id}
                  id={best.interview_id._id}
                  title={best.interview_id.title}
                  rating={best.final_rating}
                  duration={best.s3_recording_url}
                  createdAt={best.interview_id.createdAt}
                  interviewType={best.interview_id.type}
                  summary={best.summary?.text || "No summary available."}
                  thumbnail={best.thubmnail_url || thumbnail}
                  recordingUrls={best.s3_recording_url}
                  goalId={goalId}
                  isLast={index === Object.keys(groupedInterviews).length - 1}
                  history={history}
                  isHovered={hoveredInterview === title}
                  onMouseEnter={() => setHoveredInterview(title)}
                  onMouseLeave={() => setHoveredInterview(null)}
                  formatDate={formatDate}
                  thread_id={best.interview_id.thread_id}
                  user_id={userId}
                />
              )
            )
          ) : (
            <div className="text-gray-500 text-body2 text-center py-4">
              No interviews found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InterviewList;
