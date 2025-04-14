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
import ErrorBoundary from "@/components/error/ErrorBoundary";

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
  "/invitations",
  "/employer/email-verification"
  "/job-post",
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
  "/employer/email-verification"
];

// const freeRoutes = [ "/job-post"];
const allfreeRoutes = [...noSidebarRoutes, ...employerRoutes];
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isEmailVerified = user?.is_email_verified;
  const experience_level = user?.experience_level;
  const account_status = user?.account_status;

  const queryParams = new URLSearchParams(location.search);
  let jobApplication = queryParams.get("job_application");

  const currentPath = location.pathname;
  if (
    currentPath === "/auth/github/callback" ||
    currentPath === "/auth/linkedin/callback"
  ) {
    const stateParam = queryParams.get("state");
    if (stateParam) {
      try {
        const stateObj = JSON.parse(atob(stateParam));
        if (stateObj.job_application) {
          jobApplication = stateObj.job_application;
          console.log("Job Application from state:", jobApplication);
        }
      } catch (error) {
        console.error("Error parsing state parameter:", error);
      }
    }
  }

  const [isDisabledModalOpen, setIsDisabledModalOpen] = useState(false);

  useEffect(() => {
    if (user && !experience_level) {
      navigate(
        jobApplication
          ? `/setexperience?job_application=${encodeURIComponent(
              jobApplication
            )}`
          : "/setexperience"
      );
    }
  }, [user, experience_level]);

  const checkIsFreeRoute = (freeRoutes: string[]) => {
    const currrentPath = window.location.pathname;
    const response = freeRoutes.some((path: string) => {
      if (currrentPath.includes(path)) return true;
    });
    return response;
  };
  useEffect(() => {
    if (checkIsFreeRoute(allfreeRoutes)) return;
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    setIsDisabledModalOpen(account_status === "disabled");
  }, [account_status]);

  const isEmployerRoute = (): boolean => {
    const currentPath = location.pathname;
    return employerRoutes.some((route) => currentPath.startsWith(route));
  };

  const shouldDisplaySidebar = (): boolean => {
    const currentPath = location.pathname;

    if (currentPath === "/job-post" || currentPath.startsWith("/job-post/")) {
      return Boolean(user);
    }

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
    const isEmployerPath = employerRoutes.some(
      (route) => currentPath === route || currentPath.startsWith(route + "/")
    );

    return isMatchedRoute || isEmployerPath;
  };

  const shouldShowBanner = (): boolean | null => {
    // Show banner if user is logged in, email is not verified, and we're on a route that shows the sidebar
    return (
      shouldDisplaySidebar() &&
      Boolean(user) &&
      isEmailVerified === false &&
      !isEmployerRoute()
    );
  };

  const renderAppropriateLayout = () => {
    if (!shouldDisplaySidebar()) {
      return (
        <div className="flex-1 bg-gray-100">
          {isDisabledModalOpen ? (
            <DisabledAccountModal isOpen={isDisabledModalOpen} />
          ) : (
            <ErrorBoundary>{children}</ErrorBoundary>
          )}
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
          {isDisabledModalOpen ? (
            <DisabledAccountModal isOpen={isDisabledModalOpen} />
          ) : (
            <ErrorBoundary>{children}</ErrorBoundary>
          )}
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
