import React from "react";


interface CreateJobPreviewProps {
  jobTitle: string;
  companyName: string;
  location: string;
  onPreviewClick?: () => void;
}

const CreateJobPreview: React.FC<CreateJobPreviewProps> = ({
  jobTitle = "Full Stack Developer",
  companyName = "Acme Inc.",
  location = "Bangalore, India",
  onPreviewClick,
}) => {
  return (
    <div className="w-[507px] p-6 bg-white rounded-xl flex justify-between items-start">
      <div className="flex gap-5">
        {/* Company logo/icon */}
        <div className="w-[70px] h-[70px] relative bg-[#ecedef] rounded-full border-white/0 overflow-hidden">
          <div className="w-[96.92px] h-[102.85px] left-[-12.38px] top-[-8.62px] absolute">
            <div className="w-[96.92px] h-[102.85px] left-0 top-0 absolute" />
            <div className="w-[43.61px] h-[56.43px] left-[26.38px] top-[24.07px] absolute">
              <div className="w-[30.13px] h-[56.43px] left-0 top-0 absolute bg-[#cdead9]" />
              <div className="w-[30.13px] h-[30.23px] left-[13.49px] top-[26.20px] absolute bg-[#bbddc9]" />
              <div className="w-[24.28px] h-[17.13px] left-[3.15px] top-[3.53px] absolute inline-flex flex-col justify-start items-start gap-[3.23px]">
                <div className="self-stretch h-[2.15px] bg-[#a6c4b2]" />
                <div className="self-stretch h-[2.15px] bg-[#a6c4b2]" />
                <div className="self-stretch h-[2.15px] bg-[#a6c4b2]" />
                <div className="self-stretch h-[2.15px] bg-[#a6c4b2]" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Job details */}
        <div className="inline-flex flex-col justify-center items-start gap-1">
          <div className="flex flex-col justify-start items-start gap-4">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="justify-center text-[#414347] text-xl font-medium font-['Ubuntu'] leading-loose">
                {jobTitle}
              </div>
              <div className="flex flex-col justify-center items-start gap-1">
                <div className="justify-end text-[#414347] text-base font-normal font-['DM_Sans'] leading-relaxed tracking-tight">
                  {companyName}
                </div>
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-2">
              <div className="w-[13px] h-4 bg-[#a6c4b3]" />
              <div className="justify-end text-[#8f9091] text-base font-normal font-['DM_Sans'] leading-normal tracking-tight">
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview button */}
      <div 
        className="rounded flex justify-center items-center gap-2 cursor-pointer"
        onClick={onPreviewClick}
      >
        <div className="w-[20.39px] h-3.5 bg-[#10b753]" />
        <div className="justify-end text-[#10b753] text-sm font-medium font-['SF_Pro_Display'] leading-tight tracking-tight">
          Preview
        </div>
      </div>
    </div>
  );
};

export default CreateJobPreview;