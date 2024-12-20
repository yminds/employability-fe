import React from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import useScrollToTop from "./utils/hooks/useScrollTop";

// Models
import { Role } from "./models/Role";

// Routes Components
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview.tsx";

// Components
import NotFound from "@/components/app/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login.tsx";

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
    roles: ["PUBLIC"],
    // redirectIfAuthenticated: "/",
  },
  {
    route: "/",
    component: <Dashboard />,
    roles: ["CANDIDATE", "EMPLOYER"],
  },
  {
    route: "/interview/:id",
    component: <Interview />,
    roles: ["CANDIDATE"],
  },
  {
    route: "*",
    component: <NotFound />,
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
