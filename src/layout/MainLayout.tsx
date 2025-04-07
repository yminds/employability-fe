import React, { useEffect, useState } from "react";
import { routes } from "@/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/features/sidebar/sidebar";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import EmailVerification from "@/components/signup/EmailVerification";
import EmployerSidebar from "@/features/sidebar/EmployerSidebar";
import DisabledAccountModal from "@/components/modal/DisabledAccountModal";
import { cleanRecordingReference } from "@/store/slices/recorderSlice";
import { useDispatch } from "react-redux";
import useInterviewSetup from "@/hooks/useInterviewSetup";

interface MainLayoutProps {
  children: React.ReactNode;
}

const noSidebarRoutes = [
  "/login",
  "/interview",
  "/signup",
  "/setgoal",
  "/example",
  "/setexperience",
  "/addphone",
  "/verify-otp",
  "/auth/github/callback",
  "/auth/linkedin/callback",
  "/profile",
  "/employer/signup",
  "/employer/login",
  "/skills-report",
  "/skill-report",
  "/privacy-policy",
  "/employer/company/create",
  "/invitation/:inviteId",
  "/invitations"
];

const employerRoutes = [
  "/employer",
  "/employer/candidates",
  "/employer/jobs",
  "/employer/profile",
  "/employer/dashboard",
  "/employer/settings",
  "/employer/uploadResume",
  "/employer/jobs",
  "/employer/jobs/:jobId",
  "/employer/company/create",
  "/employer/jobs/edit/:jobId",
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isEmailVerified = user?.is_email_verified;
  const isPhoneVerified = user?.is_phone_verified;
  const experience_level = user?.experience_level;
  const account_status = user?.account_status;
  const dispatch = useDispatch();
  
  const [isDisabledModalOpen, setIsDisabledModalOpen] = useState(false);

  useEffect(() => {
    if (user && !experience_level) {
      navigate("/setexperience");
    }
  }, [user, experience_level]);

  useEffect(() => {
    setIsDisabledModalOpen(account_status === "disabled");
  }, [account_status]);

  const isEmployerRoute = (): boolean => {
    const currentPath = location.pathname;
    return employerRoutes.some((route) => currentPath.startsWith(route));
  };

  const shouldDisplaySidebar = (): boolean => {
    const currentPath = location.pathname;

    const isNoHeaderRoute = noSidebarRoutes.some((route) => {
      return currentPath === route || currentPath.startsWith(route + "/");
    });

    if (isNoHeaderRoute) {
      return false;
    }

    const isMatchedRoute = routes.some((routeObj) => {
      const routePath = routeObj.route;
      if (routePath.includes(":")) {
        const baseRoute = routePath.split("/:")[0];
        return currentPath.startsWith(baseRoute + "/");
      }
      return currentPath === routePath;
    });

    // Check for employer routes
    const isEmployerPath = employerRoutes.some((route) => currentPath === route || currentPath.startsWith(route + "/"));

    return isMatchedRoute || isEmployerPath;
  };

  const shouldShowBanner = (): boolean | null => {
    // Show banner if user is logged in, email is not verified, and we're on a route that shows the sidebar
    return shouldDisplaySidebar() && Boolean(user) && isEmailVerified === false && !isEmployerRoute();
  };

  const renderAppropriateLayout = () => {
    if (!shouldDisplaySidebar()) {
      return (
        <div className="flex-1 bg-gray-100">
          {isDisabledModalOpen ? <DisabledAccountModal isOpen={isDisabledModalOpen} /> : children}
        </div>
      );
    }

    return (
      <div className="flex flex-1 sm:flex-col">
        {isEmployerRoute() ? (
          <div className="flex-shrink-0">
            <EmployerSidebar />
          </div>
        ) : (
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 bg-gray-100">
          {isDisabledModalOpen ? <DisabledAccountModal isOpen={isDisabledModalOpen} /> : children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Email Verification Banner */}
      {shouldShowBanner() && (
        <div className="sticky top-0 z-50">
          <EmailVerification />
        </div>
      )}

      {/* Main Content */}
      {renderAppropriateLayout()}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default MainLayout;
