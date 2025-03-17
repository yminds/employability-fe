
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbNavProps {
  jobTitle?: string;
}

const BreadcrumbNav = ({ jobTitle }: BreadcrumbNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => navigate("/employer/jobs")}
        className="flex items-center text-[#666666] hover:text-[#001630]"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Jobs</span>
      </button>
      <span className="text-[#666666]">{">"}</span>
      <span className="font-medium">
        {jobTitle || "Job Details"}
      </span>
    </div>
  );
};

export default BreadcrumbNav;