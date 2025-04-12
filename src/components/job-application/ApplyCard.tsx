import { Button } from "@/components/ui/button";
import ResumeUploadSVG from "@/assets/job-posting/ResumeUploadSVG.svg";

interface ApplyCardProps {
  onUploadClick: () => void;
}

export default function ApplyCard({ onUploadClick }: ApplyCardProps) {
  return (
    <div className="w-full">
      {/* Main Resume Upload Card */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#FCFCFC] to-[#DED8FB] border rounded-lg">
        <div className="flex">
          <div className="flex-1 p-7">
            <h2 className="text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.2px] text-[#1c1b1f] mb-2">
              Resume
            </h2>
            <p className="text-body2">Upload your updated resume to apply</p>

            <Button
              className="mt-8 border border-[#000000] bg-white text-[#000000] text-button hover:bg-gray-50 px-8 py-2 h-auto"
              onClick={onUploadClick}
            >
              Upload Resume & Apply
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-full relative">
              <div className="absolute right-[-20px] top-3 h-[240px] w-[240px]">
                <img
                  src={ResumeUploadSVG || "/placeholder.svg"}
                  alt="Resume upload illustration"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider with "Or" text - outside the card */}
      <div className="flex items-center my-7">
        <div className="flex-1 h-px bg-[#909091] bg-opacity-30"></div>
        <span className="px-4 text-[#666666]">Or</span>
        <div className="flex-1 h-px bg-[#909091] bg-opacity-30"></div>
      </div>

      {/* Apply with Employability section - outside the card */}
      <div className="text-center">
        <h3 className="text-[14px] font-medium leading-5 tracking-[0.21px] text-[#001630] mb-4">
          Apply with Employability
        </h3>
        <Button
          variant="outline"
          className="w-full max-w-xs border border-[#000000] bg-white text-[#000000] text-button hover:bg-gray-50 py-3 h-auto"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
