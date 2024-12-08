import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string; // Default redirect path (e.g., login)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = "/",
}) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("ProtectedRoute Debug - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute Debug - user:", user);
  console.log("ProtectedRoute Debug - current location:", location.pathname);

  // If the user is not authenticated, redirect to login or specified redirectPath
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} />;
  }

  // If profile is not completed, redirect to /complete-profile
  if (isAuthenticated && !user?.isProfileCompleted) {
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" state={{ from: location }} />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
