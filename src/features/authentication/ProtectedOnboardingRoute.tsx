import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface ProtectedOnboardingRouteProps {
  children: React.ReactNode;
}

const ProtectedOnboardingRoute: React.FC<ProtectedOnboardingRouteProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isPhoneVerified = user?.experience_level !== "";

  const queryParams = new URLSearchParams(location.search);
  const jobApplication = queryParams.get("job_application");

  useEffect(() => {
    if (user && isPhoneVerified) {
      if (jobApplication) {
        try {
          if (user && user?.goals?.length > 0) {
            const jobUrl = new URL(decodeURIComponent(jobApplication));
            const path = jobUrl.pathname + jobUrl.search + jobUrl.hash;
            navigate(path);
          } else {
            navigate(`/?job_application=${encodeURIComponent(jobApplication)}`);
          }
        } catch (error) {
          console.error("Invalid URL:", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  if (!user || !isPhoneVerified) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedOnboardingRoute;
