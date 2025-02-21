import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface ProtectedOnboardingRouteProps {
  children: React.ReactNode;
}

const ProtectedOnboardingRoute: React.FC<ProtectedOnboardingRouteProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isPhoneVerified = user?.is_phone_verified;

  useEffect(() => {
    if (user && isPhoneVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || !isPhoneVerified) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedOnboardingRoute;
