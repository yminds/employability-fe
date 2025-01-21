import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface ProtectedOnboardingRouteProps {
  children: React.ReactNode;
}

const ProtectedOnboardingRoute: React.FC<ProtectedOnboardingRouteProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  console.log("User:", user);
  

  useEffect(() => {
    if (user && user.experience_level !== "") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.experience_level === "") {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedOnboardingRoute;
