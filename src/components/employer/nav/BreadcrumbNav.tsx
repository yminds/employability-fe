
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbNavProps {
  jobTitle?: string;
}

const BreadcrumbNav = ({ jobTitle }: BreadcrumbNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
            <div className="w-[30px] h-[30px] bg-white rounded-3xl border border-black/10 flex items-center justify-center" onClick={()=>navigate('/employer')}>
              {/* Arrow icon placeholder */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-base text-[#8f9091] font-normal">
              <span>Jobs</span>
              <span className="mx-1">/</span>
              <span className="text-[#030609] font-semibold">{jobTitle}</span>
            </div>
          </div>
  );
};

export default BreadcrumbNav;