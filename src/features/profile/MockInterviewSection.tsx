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
    <Card className="w-full bg-white p-6 rounded-lg">
      <CardContent className="p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px]">
            Mock interview
          </h2>
          <h3 className="text-[#000000] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]">
            {role}
          </h3>
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
            <span className="text-[#000000] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]">
              {duration}
            </span>
            <div className="flex items-center gap-1">
              <img src={Duration} alt="Duration" />
              <span className="text-[#414447] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <button className="font-sf-pro text-[#414447] text-base font-normal flex leading-6 tracking-[0.24px] items-center gap-2">
            View my interviews
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="h-[1px] bg-[#E5E7EB]" />

          <p className="text-[#000000] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]">
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
