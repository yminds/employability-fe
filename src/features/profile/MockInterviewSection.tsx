import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import PlayCircle from "@/assets/profile/playcircle.svg";
import Duration from "@/assets/profile/duration.svg";

interface MockInterviewProps {
  duration: string;
  timeAgo: string;
  role: string;
  percentile: number;
  thumbnailUrl: string;
}

export default function MockInterviewSection({
  duration,
  timeAgo,
  role,
  percentile,
  thumbnailUrl,
}: MockInterviewProps) {
  return (
    <Card className="w-full bg-white p-0 rounded-lg">
      <CardContent className="p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-[#000000] text-sub-header">Mock interview</h2>
          <h3 className="text-[#000000] text-body2">{role}</h3>
        </div>

        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-[#F5F5F5]">
            <img
              src={thumbnailUrl}
              alt="Mock Interview Session"
              className="w-full h-auto"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <img src={PlayCircle} alt="Play" className="w-12 h-12" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[#000000] gap-1">
            <span className="text-[#000000] text-body2">{duration}</span>
            <div className="flex items-center gap-1">
              <img src={Duration} alt="Duration" />
              <span className="text-[#414447] text-body2">{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <button className="text-[#414447] text-body2 flex items-center gap-2">
            View my interviews
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="h-[1px] bg-[#E5E7EB]" />

          <p className="text-[#000000] text-body2">
            You have performed{" "}
            <span className="font-semibold">better than {percentile}%</span> of
            candidates on Employability for the role of{" "}
            <span className="font-normal">{role}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
