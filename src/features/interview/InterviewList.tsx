import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetInterviewDetailsQuery } from "@/api/interviewDetailsApiSlice";
import InterviewCard from "./InterviewCard";
import search from "@/assets/skills/search.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import thumbnail from "@/assets/profile/MockInterview.svg";

type InterviewType = "all" | "skill" | "project" | "mock";

interface InterviewListProps {
  goalId: string | null;
}

const InterviewList: React.FC<InterviewListProps> = ({ goalId }) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { data: interviewDetails, isLoading } =
    useGetInterviewDetailsQuery(userId);

  const [selectedType, setSelectedType] = useState<InterviewType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);

  useEffect(() => {
    if (interviewDetails?.data?.reports) {
      // Apply filters (search and type)
      let filtered = interviewDetails.data.reports;

      // Filter by type if not "all"
      if (selectedType !== "all") {
        filtered = filtered.filter(
          (report: any) =>
            report.interview_id.type.toLowerCase() === selectedType
        );
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (report: any) =>
            report.interview_id.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (report.summary?.text &&
              report.summary.text
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        );
      }

      setFilteredInterviews(filtered);
    }
  }, [searchQuery, selectedType, interviewDetails]);

  const renderInterviewTypes = () => {
    const types = [
      { id: "all", label: "All" },
      { id: "jobs", label: "Jobs" },
      { id: "skill", label: "Skills" },
      { id: "project", label: "Projects" },
      { id: "mock", label: "Mock" },
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
                src={search || "/placeholder.svg"}
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

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[32px] sm:p-6">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px]">
        {renderInterviewTypes()}

        <div className="space-y-7">
          {isLoading ? (
            Array.from({ length: 3 }).map(() => renderLoadingSkeleton())
          ) : filteredInterviews.length > 0 ? (
            filteredInterviews.map((report: any, index: number) => (
              <React.Fragment key={report._id}>
                <InterviewCard
                  id={report.interview_id._id}
                  title={report.interview_id.title}
                  rating={report.final_rating}
                  duration={report.s3_recording_url}
                  createdAt={report.interview_id.createdAt}
                  interviewType={report.interview_id.type}
                  summary={report.summary?.text || "No summary available."}
                  thumbnail={thumbnail}
                  recordingUrls={report.s3_recording_url}
                  goalId={goalId}
                  isLast={index === filteredInterviews.length - 1}
                />
              </React.Fragment>
            ))
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
