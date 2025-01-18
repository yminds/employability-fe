import React from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import useScrollToTop from "./hooks/useScrollTop.ts";

// Models
import { Role } from "./models/Role";

// Routes Components
import Dashboard from "./pages/Dashboard";
import SetGoal from "./pages/SetGoal.tsx";
import Interview from "./pages/Interview.tsx";

// Components
import NotFound from "@/components/app/NotFound";
import ProtectedRoute from "./features/authentication/ProtectedRoute.tsx";
import Login from "./pages/LoginPage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import Skills from "./pages/SkillsPage.tsx";
import SkillDetailPage from "./pages/SkillDetailPage.tsx";
import SelectedSkill from "@/components/skills/selectedskill.tsx";
import SignupForm from "./pages/SignUpPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import JobsPage from "./pages/JobsPage.tsx";
import ProjectListing from "./pages/project-listing.tsx";
import Example from "./features/cap/Example.tsx";

interface RouteConfig {
  route: string;
  parameterized?: boolean;
  component: React.ReactNode;
  roles?: Role[];
  childrens?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    route: "/login",
    component: <Login />,
    // redirectIfAuthenticated: "/",
  },
  {
    route: "/",
    component: <Dashboard isDashboard={true} displayScore={true} />,
    roles: ["CANDIDATE", "EMPLOYER"],
  },
  {
    route: "/signup",
    component: <SignupForm />,
  },
  {
    route: "/setgoal",
    component: <SetGoal />,
    roles: ["CANDIDATE"],
  },
  {
    route: "/interview/:id",
    component: <Interview />,
    roles: ["CANDIDATE"],
  },
  {
    route: "/skills",
    component: <Skills />,
    roles: ["CANDIDATE"],
  },
  {
    route: "/skills/:id",
    component: <SkillDetailPage />,
    roles: ["CANDIDATE"],
  },
  {
    route: "/skills/suggestedskills/:id",
    component: <SelectedSkill skill={""} icon={""} description={""} />,
    roles: ["CANDIDATE"],
  },
  {
    route: "*",
    component: <NotFound />,
  },
  {
    route: "/user-profile",
    component: <UserProfilePage />,
  },
  {
    route: "/jobsdev",
    component: <JobsPage />,
  },
  {
    route: "/projects",
    component: <ProjectsPage />,
  },
  {
    route: "/example",
    component: <Example />,
  },
  {
    route: "/project-listing",
    component: <ProjectListing />,
  },
];

const renderRoutes = (routesArray: RouteConfig[]) => {
  return routesArray.map((routeObj, index) => {
    if (routeObj.roles) {
      return (
        <Route
          key={index}
          path={routeObj.route}
          element={
            <ProtectedRoute allowedRoles={routeObj.roles}>
              {routeObj.component}
            </ProtectedRoute>
          }
        />
      );
    }
    if (routeObj.childrens) {
      return (
        <Route
          key={index}
          path={routeObj.route}
          element={<Routes>{renderRoutes(routeObj.childrens)}</Routes>}
        />
      );
    }
    return (
      <Route key={index} path={routeObj.route} element={routeObj.component} />
    );
  });
};

const AppRoutes: React.FC = () => {
  useScrollToTop();
  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default AppRoutes;
