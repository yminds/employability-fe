import { Card } from "@/components/ui/card";
import ScreeningInterviews from "@/assets/employer/screeningInterviews.svg";

export default function ScreeningInterviewsCard() {
  return (
    <Card className="w-full max-w-md bg-white rounded-xl">
      <div className="flex flex-row items-center gap-3 p-5 ">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4DEFD]">
          <img
            src={ScreeningInterviews}
            alt="ScreeningInterviews"
            className="w-5 h-5"
          />
        </div>
        <h2 className="text-body2 font-medium text-[#68696B]">
          Screening Interviews
        </h2>
      </div>
      <div className="px-5 pb-5">
        <div className="h-px w-full bg-[rgba(0,0,0,0.10)] mb-5"></div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#4C4C4C] text-[14px] font-dm-sans font-normal leading-5 tracking-[0.07px]">
              Invites Sent
            </span>
            <span className="text-[#0c0f12] text-body2 font-semibold">30</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4C4C4C] text-[14px] font-dm-sans font-normal leading-5 tracking-[0.07px]">
              Accepted
            </span>
            <span className="text-[#0c0f12] text-body2 font-semibold">10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4C4C4C] text-[14px] font-dm-sans font-normal leading-5 tracking-[0.07px]">
              Not Accepted
            </span>
            <span className="text-[#0c0f12] text-body2 font-semibold">10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4C4C4C] text-[14px] font-dm-sans font-normal leading-5 tracking-[0.07px]">
              Submitted
            </span>
            <span className="text-[#0c0f12] text-body2 font-semibold">10</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
