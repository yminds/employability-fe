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
import SignupForm from "./pages/SignUpPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import JobsPage from "./pages/JobsPage.tsx";
import ProjectListing from "./pages/project-listing.tsx";
import LinkedInCallback from "./features/authentication/LinkedinCallback.tsx";
import GitHubCallback from "./features/authentication/GithubCallback.tsx";
import ExperienceLevel from "./pages/SetExperience.tsx";
import AddPhone from "./pages/AddPhoneNumber.tsx";
import Example from "./features/cap/Example.tsx";
import Mentor from "./pages/Mentor.tsx";
import Canidates from "./pages/Canidates.tsx";
import Candidate from "./pages/Candidate.tsx";
import UserPublicProfilePage from "./pages/UserPublicProfilePage.tsx";
import InterviewsLisingPage from "./pages/InterviewsListingPage.tsx"

import ReportPage from "./pages/SkillsReportPage.tsx";
import VerifyPhoneOTP from "./pages/VerifyPhoneOTP.tsx";
import ResumeUploader from "./components/employer/ResumeUpload.tsx";
import { EmployerSignup } from "./pages/EmployerSignUp.tsx";
import { EmployerLogin } from "./pages/EmployerLogin.tsx";
import EmployerDashboard from "./pages/EmployerDashboard.tsx";
import EmployerNotFound from "./components/employer/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import JobDetailsPage from "./components/employer/JobDetailsDialog.tsx";
import EmployerJobsPage from "./pages/EmployerJobsPage.tsx";
import EmployerCandidatesPage from "./pages/EmployerCandidatesPages.tsx";
import CompanyForm from "./components/employer/CompanyForm.tsx";
import JobPostingPage from "./components/employer/JobPostingForm.tsx";
import CreateJobPage from "./pages/CreateJobPage.tsx";


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
    route:"/privacy-policy",
    component: <PrivacyPolicy />,
  },
  {
    route:"/verify-otp",
    component:<VerifyPhoneOTP/>,
  },
  // {
  //   route:"/employer/uploadResume",
  //   component:<ResumeUploader/>
  // },
  {
    route:"/employer/signup",
    component:<EmployerSignup/>
  },
  {
    route:"/employer/login",
    component:<EmployerLogin/>
  },
  {
    route:"/employer",
    component:<EmployerDashboard/>
  },
  {
    route:"/employer/jobs",
    component:<EmployerJobsPage/>
  },
  {
    route:"/employer/candidates",
    component:<EmployerCandidatesPage/>
  },
  {
    route:"/employer/jobs/:jobId",
    component:<JobDetailsPage/>
  },
  {
    route:"/employer/company/create",
    component:<CompanyForm/>
  },
  {
    route:"/employer/jobs/create",
    component:<CreateJobPage/>
  },
  // {
  //   route:"/employer/",
  //   component:<
  // },
  // {
  //   route:"/employer/candidates",
  //   component:<CandidatesList/>
  // },
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
    route:"/employer/*",
    component:<EmployerNotFound/>
  },
  {
    route: "/user-profile",
    component: <UserProfilePage />,
  },
  {
    route: "/profile/:username",
    component: <UserPublicProfilePage/>
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
    component: <Mentor />
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
    route:"/skill/report/:id",
    component: <ReportPage isSharedReport= {false}/>
  },
  {
    route:"/skills-report/:id/:id",
    component: <ReportPage isSharedReport= {true}/>
  },
  {
    route:"/invites",
    component: <InterviewsLisingPage/>
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
