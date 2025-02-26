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
];

const employerRoutes = [
  "/employer",
  "/employer/candidates",
  "/employer/jobs",
  "/employer/profile",
  "/employer/dashboard",
  "/employer/settings",
  "/employer/uploadResume"
]

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isEmailVerified = user?.is_email_verified;
  const isPhoneVerified = user?.is_phone_verified;
  const account_status = user?.account_status;

  const [isDisabledModalOpen, setIsDisabledModalOpen] = useState(false);

  useEffect(() => {
    if (user && !isPhoneVerified) {
      navigate("/setexperience");
    }
  }, [user, isPhoneVerified]);

  useEffect(() => {
    setIsDisabledModalOpen(account_status === "disabled");
  }, [account_status]);

  const isEmployerRoute = (): boolean => {
    const currentPath = location.pathname;
    return employerRoutes.some(route => currentPath.startsWith(route));
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
    const isEmployerPath = employerRoutes.some(route => 
      currentPath === route || currentPath.startsWith(route + "/")
    );

    return isMatchedRoute || isEmployerPath;
  };

  const shouldShowBanner = (): boolean | null => {
    // Show banner if user is logged in, email is not verified, and we're on a route that shows the sidebar
    return shouldDisplaySidebar() && Boolean(user) && isEmailVerified===false && !isEmployerRoute();
  };

  const renderAppropriateLayout = () => {
    if (!shouldDisplaySidebar()) {
      return (
        <div className="flex-1 bg-gray-100">
          {children}
        </div>
      );
    }

    return (
      <div className="flex flex-1">
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
          {children}
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
