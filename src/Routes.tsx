import type React from "react";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Hooks
import useScrollToTop from "./hooks/useScrollTop.ts";

// Models
import type { Role } from "./models/Role";

// Components
import NotFound from "@/components/app/NotFound";
import ProtectedRoute from "./features/authentication/ProtectedRoute.tsx";

// Lazy load route components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SetGoal = lazy(() => import("./pages/SetGoal.tsx"));
const Interview = lazy(() => import("./pages/Interview.tsx"));
const Login = lazy(() => import("./pages/LoginPage.tsx"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage.tsx"));
const Skills = lazy(() => import("./pages/SkillsPage.tsx"));
const SkillDetailPage = lazy(() => import("./pages/SkillDetailPage.tsx"));
const SignupForm = lazy(() => import("./pages/SignUpPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const JobsPage = lazy(() => import("./pages/JobsPage.tsx"));
const ProjectListing = lazy(() => import("./pages/project-listing.tsx"));
const LinkedInCallback = lazy(
  () => import("./features/authentication/LinkedinCallback.tsx")
);
const GitHubCallback = lazy(
  () => import("./features/authentication/GithubCallback.tsx")
);
const ExperienceLevel = lazy(() => import("./pages/SetExperience.tsx"));
const AddPhone = lazy(() => import("./pages/AddPhoneNumber.tsx"));
const Example = lazy(() => import("./features/cap/Example.tsx"));
const Mentor = lazy(() => import("./pages/Mentor.tsx"));
const Canidates = lazy(() => import("./pages/Canidates.tsx"));
const Candidate = lazy(() => import("./pages/Candidate.tsx"));
const UserPublicProfilePage = lazy(
  () => import("./pages/UserPublicProfilePage.tsx")
);
const InterviewsLisingPage = lazy(
  () => import("./pages/InterviewsListingPage.tsx")
);
const MockInterviewsPage = lazy(
  () => import("./pages/MockInterviews.tsx")
);

const MockReportPage = lazy(() => import("./pages/MockReportPage.tsx"));
const ReportPage = lazy(() => import("./pages/SkillsReportPage.tsx"));
const VerifyPhoneOTP = lazy(() => import("./pages/VerifyPhoneOTP.tsx"));
const EmployerSignup = lazy(() => import("./pages/EmployerSignUp.tsx"));
const EmployerLogin = lazy(() => import("./pages/EmployerLogin.tsx"));
const EmployerDashboard = lazy(() => import("./pages/EmployerDashboard.tsx"));
const EmployerNotFound = lazy(
  () => import("./components/employer/NotFound.tsx")
);
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const InterviewsPage = lazy(() => import("./pages/InterviewsPage.tsx"));

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
    route: "/auth/linkedin/callback",
    component: <LinkedInCallback />,
  },
  {
    route: "/auth/github/callback",
    component: <GitHubCallback />,
  },
  {
    route: "/setexperience",
    component: <ExperienceLevel />,
    roles: ["CANDIDATE"],
  },
  {
    route: "/addphone",
    component: <AddPhone />,
    roles: ["CANDIDATE"],
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
    route: "/privacy-policy",
    component: <PrivacyPolicy />,
  },
  {
    route: "/verify-otp",
    component: <VerifyPhoneOTP />,
  },
  // {
  //   route:"/employer/uploadResume",
  //   component:<ResumeUploader/>
  // },
  {
    route: "/employer/signup",
    component: <EmployerSignup />,
  },
  {
    route: "/employer/login",
    component: <EmployerLogin />,
  },
  {
    route: "/employer",
    component: <EmployerDashboard />,
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
    route: "*",
    component: <NotFound />,
  },
  {
    route: "/employer/*",
    component: <EmployerNotFound />,
  },
  {
    route: "/user-profile",
    component: <UserProfilePage />,
  },
  {
    route: "/profile/:username",
    component: <UserPublicProfilePage />,
  },
  {
    route: "/jobs",
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
  {
    route: "/mentor/learn/:id",
    component: <Mentor />,
  },
  {
    route: "/candidates",
    component: <Canidates />,
  },
  {
    route: "/candidates/:id",
    component: <Candidate />,
  },
  {
    route: "/skill/report/:id",
    component: <ReportPage isSharedReport={false} />,
  },
  {
    route: "/skills-report/:id/:id",
    component: <ReportPage isSharedReport={true} />,
  },
  {
    route: "/invites",
    component: <InterviewsLisingPage />,
  },
  {
    route: "/interviews",
    component: <InterviewsPage />,
  },
  {
    route: "/mock-interviews",
    component: <MockInterviewsPage />,
  },
  {
    route: "/skill/report/:id/:id",
    component: <MockReportPage isSharedReport={false} />,
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
  return (
    <Suspense>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

export default AppRoutes;
