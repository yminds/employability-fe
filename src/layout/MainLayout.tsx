import React from "react";
import { routes } from "@/Routes";
import { useLocation } from "react-router-dom";
import Sidebar from "@/features/sidebar/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

<<<<<<< HEAD
const noSidebarRoutes = [
  "/login",
  "/interview",
  "/signup",
  "/setgoal",
  "/setexperience",
  "/addphone",
  "/auth/github/callback",
  "/auth/linkedin/callback",
];
=======
const noSidebarRoutes = ["/login", "/interview" ,"/signup","/setgoal", "/example"];
>>>>>>> e8d2adf40403c8e4964c9cbaa9643c47fe02a4b0

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

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

  return (
    <>
      <div
        className={`flex min-h-screen ${
          shouldDisplaySidebar() ? "bg-gray-100" : ""
        }`}
      >
        {shouldDisplaySidebar() && <Sidebar />}
        {children}
      </div>
    </>
  );
};

export default MainLayout;
