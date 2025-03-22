import { MapPin } from "lucide-react";

interface JobCardHeaderProps {
  jobTitle: string;
  companyName: string;
  location: string;
  companyLogo?: string;
}

export default function JobCreateSidebar({
  jobTitle,
  companyName,
  location,
  companyLogo,
}: JobCardHeaderProps) {
  return (
    <div className="flex items-start bg-white rounded-xl shadow-sm gap-4 p-4">
      {/* Company logo/icon */}
      <div className="w-[60px] h-[60px] relative bg-[#eceef0] rounded-full overflow-hidden flex items-center justify-center">
        {companyLogo ? (
          <img
            src={companyLogo || "/placeholder.svg"}
            alt={`${companyName} logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-[69px] h-[73px] left-[-4px] top-[-6px] absolute">
            <div className="w-[31px] h-[40px] left-[19px] top-[17px] absolute">
              <div className="w-[21px] h-[40px] left-0 top-0 absolute bg-[#cdead9]" />
              <div className="w-[21px] h-[21px] left-[9.5px] top-[18.5px] absolute bg-[#bbddc9]" />
              <div className="w-[17px] h-[12px] left-[2.2px] top-[2.5px] absolute inline-flex flex-col justify-start items-start gap-[2.3px]">
                <div className="self-stretch h-[1.5px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.5px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.5px] bg-[#a6c4b3]" />
                <div className="self-stretch h-[1.5px] bg-[#a6c4b3]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job details */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[#414447] text-[18px] font-medium leading-[32px] tracking-[-0.2px]">
          {jobTitle}
        </h2>
        <p className="text-[#414447] text-body2">{companyName}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-5 h-5 text-[#a6c4b3]" />
          <span className="text-[#909091] text-body2">{location}</span>
        </div>
      </div>
    </div>
  );
}
