import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import PlayCircle from "@/assets/profile/playcircle.svg";
import Duration from "@/assets/profile/duration.svg";
import MockInterivewImage from "@/assets/profile/MockInterview.svg";
import FeaturedInterviewImage from "@/assets/profile/featuredInterviewImage.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MockInterviewProps {
  existingFeaturedInterview: any;
  username?: string;
  isPublic?: boolean;
}

export default function FeaturedInterviewSection({
  existingFeaturedInterview,
  username,
  isPublic = false,
}: MockInterviewProps) {
  const navigate = useNavigate();

  const [formattedDuration, setFormattedDuration] = useState("0m 0s");
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (existingFeaturedInterview) {
      const durationInSeconds = existingFeaturedInterview.duration;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      setFormattedDuration(`${minutes}m ${seconds}s`);

      const interviewDate = new Date(existingFeaturedInterview.date);
      const now = new Date();
      const diffInMs = now.getTime() - interviewDate.getTime();

      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

      if (diffInDays >= 7) {
        const weeks = Math.floor(diffInDays / 7);
        setTimeAgo(`${weeks} ${weeks === 1 ? "week" : "weeks"} ago`);
      } else if (diffInDays > 0) {
        setTimeAgo(`${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`);
      } else if (diffInHours > 0) {
        setTimeAgo(
          `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
        );
      } else {
        setTimeAgo(
          `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
        );
      }
    }
  }, [existingFeaturedInterview]);

  const role = existingFeaturedInterview?.title || "Interview";
  const interviewId = existingFeaturedInterview?.interviewId;
  const interviewType = existingFeaturedInterview?.type;
  const thumbnailUrl = MockInterivewImage;

  const handleViewInterviews = () => {
    navigate("/interviews");
  };

  const handleViewReport = (interviewId: string) => {
    if (!interviewType) return;

    let reportUrl = "";

    switch (interviewType) {
      case "Mock":
        reportUrl = `/skill/report/Mock/${interviewId}`;
        break;
      case "Skill":
        reportUrl = `/skill/report/${interviewId}`;
        break;
      case "Project":
        reportUrl = `/skill/report/Project/${interviewId}`;
        break;
      default:
        reportUrl = `/skill/report/${interviewId}`;
    }

    if (isPublic) {
      navigate(`/skills-report/${username}/Mock/${interviewId}`, {
        state: { isPublic: true },
      });
    } else {
      navigate(reportUrl, {
        state: {
          best_interview: interviewId,
          fromInterviewCard: true,
        },
      });
    }
  };

  return (
    <Card className="w-full bg-white p-0 rounded-lg">
      {existingFeaturedInterview ? (
        <CardContent className="p-8 sm:p-5 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[#000000] text-sub-header">
              Featured interview
            </h2>
            <h3 className="text-[#000000] text-body2">{role}</h3>
          </div>

          <div className="space-y-4">
            <div
              className="relative rounded-lg overflow-hidden bg-[#F5F5F5]"
              onClick={() => {
                handleViewReport(interviewId);
              }}
            >
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt="Mock Interview Session"
                className="w-full h-auto"
              />
              <button className="absolute inset-0 flex items-center justify-center">
                <img
                  src={PlayCircle || "/placeholder.svg"}
                  alt="Play"
                  className="w-12 h-12"
                />
              </button>
            </div>

            <div className="flex items-center justify-between text-[#000000] gap-1">
              <span className="text-[#000000] text-body2">
                {formattedDuration}
              </span>
              <div className="flex items-center gap-1">
                <img src={Duration || "/placeholder.svg"} alt="Duration" />
                <span className="text-[#414447] text-body2">{timeAgo}</span>
              </div>
            </div>
          </div>

          {!isPublic && (
            <div className="space-y-6">
              <button
                onClick={handleViewInterviews}
                className="text-[#414447] text-body2 flex items-center gap-2"
              >
                View my interviews
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent className="p-8 flex flex-col">
          <h2 className="text-[#000000] text-sub-header mb-6 text-left">
            Featured Interview
          </h2>

          <div className="w-full mb-8">
            <img
              src={FeaturedInterviewImage || "/placeholder.svg"}
              alt="Featured Interview"
              className="w-full h-auto"
            />
          </div>

          <button
            onClick={handleViewInterviews}
            className="w-full border border-[#000000] rounded-md py-3 px-4 text-center text-[#000000] text-body2"
          >
            Select Interview
          </button>
        </CardContent>
      )}
    </Card>
  );
}
