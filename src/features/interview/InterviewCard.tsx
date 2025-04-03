import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MoreVertical } from "lucide-react";
import PlayCircle from "@/assets/profile/playcircle.svg";
import VerifiedBadge from "@/assets/interview/verifiedBadge.svg";
import UnVerifiedBadge from "@/assets/interview/unverifiedBadge.svg";
import { useGetMessagesQuery } from "@/api/mentorUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FeaturedStar from "@/assets/interview/featuredStar.svg";
import Featured from "@/assets/interview/featured.svg";
import {
  useAddFeaturedInterviewMutation,
  useUpdateFeaturedInterviewMutation,
  useGetFeaturedInterviewQuery,
  useDeleteFeaturedInterviewMutation,
} from "@/api/featuredInterviewApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";

interface Interview {
  _id: string;
  interview_id: {
    _id: string;
    title: string;
    type: string;
    createdAt: string;
  };
  final_rating: number;
  s3_recording_url: string[];
  summary?: {
    text: string;
  };
}

interface InterviewCardProps {
  id: string;
  title: string;
  rating: number;
  duration: any;
  createdAt: string;
  interviewType: string;
  summary: string;
  thumbnail: any;
  recordingUrls?: string[];
  goalId?: any;
  isLast?: boolean;
  history?: Interview[];
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  formatDate?: (dateString: string) => string;
  thread_id?: string;
  user_id?: string | undefined;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  id,
  title,
  rating,
  duration,
  createdAt,
  interviewType,
  summary,
  thumbnail,
  recordingUrls = [],
  goalId,
  isLast = false,
  history = [],
  isHovered = false,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  formatDate = (dateString) => dateString,
  thread_id,
}) => {
  const navigate = useNavigate();
  const [isSettingFeatured, setIsSettingFeatured] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth?.user?._id);

  const [addFeaturedInterview] = useAddFeaturedInterviewMutation();
  const [updateFeaturedInterview] = useUpdateFeaturedInterviewMutation();
  const [deleteFeaturedInterview] = useDeleteFeaturedInterviewMutation();
  const { data: existingFeaturedInterview, isLoading: isLoadingExisting } =
    useGetFeaturedInterviewQuery(userId || "", {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });

  const hasExistingInterview = existingFeaturedInterview?.data;

  // Check if this interview is already the featured one
  const isAlreadyFeatured =
    hasExistingInterview && existingFeaturedInterview?.data?.interviewId === id;

  // Helper function to calculate time difference
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths > 0) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    } else if (diffInWeeks > 0) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }
  };

  // Helper function to estimate duration from recording URLs
  const estimateDuration = (recordingUrls: string[]): string => {
    const estimatedSeconds = recordingUrls.length * 30;
    const minutes = Math.floor(estimatedSeconds / 60);
    const seconds = estimatedSeconds % 60;

    return `${minutes}m ${seconds}s`;
  };

  const handleViewReport = (interviewType: string) => {
    let path;

    switch (interviewType) {
      case "Job":
        path = `/skill/report/Job/${id}`;
        break;
      case "Mock":
        path = `/skill/report/Mock/${id}`;
        break;
      case "Full":
        path = `/skill/report/Full/${id}`;
        break;
      case "Screening":
        path = `/skill/report/Screening/${id}`;
        break;
      case "Project":
        path = `/skill/report/Project/${id}`;
        break;
      default:
        path = `/skill/report/${id}`;
    }

    navigate(path, {
      state: {
        best_interview: id,
        fromInterviewCard: true,
        thread_id: thread_id,
      },
    });
  };

  const handleViewHistoryReport = (interviewId: string, type: string) => {
    let path;

    switch (type) {
      case "Job":
        path = `/skill/report/Job/${interviewId}`;
        console.log(thread_id, "thread_id");
        break;
      case "Mock":
        path = `/skill/report/Mock/${interviewId}`;
        break;
      case "Full":
        path = `/skill/report/Full/${id}`;
        break;
      case "Screening":
        path = `/skill/report/Screening/${id}`;
        break;
      case "Project":
        path = `/skill/report/Project/${interviewId}`;
        break;
      default:
        path = `/skill/report/${interviewId}`;
    }

    navigate(path, {
      state: {
        best_interview: interviewId,
        fromHistoryCard: true,
      },
    });
  };

  const handleSetAsFeatured = async () => {
    if (!userId || !goalId) {
      return;
    }

    try {
      setIsSettingFeatured(true);
      setIsPopoverOpen(false);

      const data = {
        goalId: goalId,
        title: title || "Featured Interview",
        duration: recordingUrls.length * 30,
        date: createdAt || new Date().toISOString(),
        verifiedRatingAttachment: rating,
        interviewId: id,
        type: interviewType,
      };

      if (hasExistingInterview) {
        await updateFeaturedInterview({
          userId,
          data,
        }).unwrap();
        toast.success("Featured interview updated successfully");
      } else {
        await addFeaturedInterview({
          userId,
          data,
        }).unwrap();
        toast.success("Interview set as featured successfully");
      }
    } catch (error) {
      toast.error("Failed to set interview as featured");

      console.error("Error setting featured interview:", error);
    } finally {
      setIsSettingFeatured(false);
    }
  };

  const handleRemoveFeatured = async () => {
    if (!userId) {
      toast.error("User ID is required to remove featured interview");

      return;
    }

    try {
      setIsSettingFeatured(true);
      setIsPopoverOpen(false);

      await deleteFeaturedInterview(userId).unwrap();

      toast.success("Featured interview removed successfully");
    } catch (error) {
      toast.error("Failed to remove featured interview");

      console.error("Error removing featured interview:", error);
    } finally {
      setIsSettingFeatured(false);
    }
  };

  return (
    <div
      className={`w-full bg-white ${
        isLast ? "pb-0" : "border-b border-[#d9d9d9]/40 pb-7"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex">
        {/* Left side - Thumbnail */}
        <div className="w-[207px] h-[135px] mt-0.5">
          <div
            className="relative rounded-lg overflow-hidden bg-[#F5F5F5] h-full cursor-pointer"
            onClick={() => handleViewReport(interviewType)}
          >
            <img
              src={thumbnail || "/placeholder.svg?height=207&width=135"}
              alt="Mock Interview Session"
              className="w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <img
                src={PlayCircle || "/placeholder.svg?height=48&width=48"}
                alt="Play"
                className="w-12 h-12"
              />
            </button>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 pl-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-sub-header text-[#0c0f12]">{title}</h2>
              <div className="flex items-center">
                <span className="text-body2">{rating.toFixed(1)}/10</span>
                <div className="w-5 h-5 ml-2 rounded-full bg-emerald-100 flex items-center justify-center">
                  <img
                    src={VerifiedBadge || "/placeholder.svg"}
                    alt="Verified Badge"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAlreadyFeatured && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f8f5e4] rounded-md text-[#BD8F1A]">
                  <img
                    src={Featured || "/placeholder.svg"}
                    alt="Featured"
                    className="w-4 h-4"
                  />
                  <span className="text-[#BD8F1A] text-sm font-medium font-dm-sans">
                    Featured
                  </span>
                </div>
              )}
              {interviewType !== "Job" && (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="p-1">
                      <MoreVertical className="w-6 h-6 text-[#0c0f12]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="end">
                    <button
                      className="flex w-full items-center px-4 py-2.5 text-body2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSetAsFeatured}
                      disabled={isSettingFeatured || isAlreadyFeatured}
                    >
                      <img
                        src={FeaturedStar || "/placeholder.svg"}
                        alt="Featured Star"
                        className="mr-2 h-6 w-6"
                      />
                      <span>
                        {isAlreadyFeatured
                          ? "Currently Featured"
                          : "Set as Featured"}
                      </span>
                    </button>
                    {isAlreadyFeatured && (
                      <button
                        className="flex w-full items-center px-4 py-2.5 text-body2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleRemoveFeatured}
                        disabled={isSettingFeatured}
                      >
                        <svg
                          className="mr-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        <span>Remove Featured</span>
                      </button>
                    )}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <div className="flex items-center text-[#414447] text-sm font-normal leading-4 tracking-wider mb-3">
            <span>{estimateDuration(recordingUrls)}</span>
            <span className="mx-2">•</span>
            <span>{getTimeAgo(createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{interviewType} Interview</span>
          </div>

          <p className="text-[#1c1b1f] text-body2 line-clamp-3">{summary}</p>

          {/* Previous Interviews Section - Now inside the card with smooth transition */}
          {history.length > 0 && (
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isHovered
                  ? "opacity-100 max-h-[500px] mt-4"
                  : "opacity-0 max-h-0 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-2 text-[#414447] mb-3">
                <Clock className="w-[18px] h-[18px] text-[#68696B]" />
                <span className="text-[#68696B] text-body2">
                  Previous Interviews
                </span>
              </div>

              <div className="space-y-4 ml-0.5">
                {history.map((interview) => (
                  <div key={interview._id} className="flex gap-6 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[#0C0F12] text-body2">
                        {formatDate(interview.interview_id.createdAt)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-body2 ml-4">
                          {interview.final_rating.toFixed(1)}/10
                        </span>
                        <div className="w-5 h-5 ml-2 rounded-full flex items-center justify-center">
                          {interview.final_rating >= 4 ? (
                            <img
                              src={VerifiedBadge || "/placeholder.svg"}
                              alt="Verified Badge"
                            />
                          ) : (
                            <img
                              src={UnVerifiedBadge || "/placeholder.svg"}
                              alt="Unverified Badge"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleViewHistoryReport(
                          interview.interview_id._id,
                          interview.interview_id.type
                        )
                      }
                      className="text-[#001630] underline font-medium font-dm-sans cursor-pointer bg-transparent border-none"
                    >
                      View report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
