import React from "react";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  // allowedRoles,
  children,
}) => {
  const token = useSelector((state: any) => state.auth?.token);
  const role = useSelector((state: RootState) => state.auth?.role?.name);
  const user = useSelector((state: RootState) => state.auth.user);

  // return token ? (
  //   <>
  //     {/* {allowedRoles && !allowedRoles.includes(role) ? ( */}
  //     {false ? <Navigate to="/not-authorized" replace /> : <>{children}</>}
  //   </>
  // ) : (
  //   <>{!user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}</>
  // );
  return user ? (
    <>{children}</>
  ) : (
    <>
      <>{!user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}</>
    </>
  );
};

export default ProtectedRoute;
