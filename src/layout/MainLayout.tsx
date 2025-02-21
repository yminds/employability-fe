import React, { useEffect } from "react";
import { routes } from "@/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/features/sidebar/sidebar";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import EmailVerification from "@/components/signup/EmailVerification";

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

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isEmailVerified = user?.is_email_verified;
  const isPhoneVerified = user?.is_phone_verified;

  useEffect(() => {
    if (user && !isPhoneVerified) {
      navigate("/setexperience");
    }
  }, [user, isPhoneVerified]);

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

    return isMatchedRoute;
  };

  const shouldShowBanner = (): boolean | null => {
    // Show banner if user is logged in, email is not verified, and we're on a route that shows the sidebar
    return shouldDisplaySidebar() && Boolean(user) && isEmailVerified === false;
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Email Verification Banner */}
      {shouldShowBanner() && (
        <div className="sticky top-0 z-50">
          <EmailVerification />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 ">
        {/* Sidebar */}
        {shouldDisplaySidebar() && (
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-100">{children}</div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default MainLayout;
