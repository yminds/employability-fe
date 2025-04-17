import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Header from "../components/landing/app/Header";
import { Button } from "../components/ui/button";
import Card from "../components/landing/ui/card";
import resumeIcon from "../assets/landing/icons/resume-icon.svg";
import interviewIcon from "../assets/landing/icons/interview-icon.svg";
import verifiedIcon from "../assets/landing/icons/verified-icon.svg";
import employerIcon from "../assets/landing/icons/employer-icon.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
// Container component that will be rendered in the portal
const LandingPageContent: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#000", color: "#fff" }}>
      <Header />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="py-44 md:py-32 lg:py-48 flex flex-col px-4 justify-center">
          <div className="flex flex-col items-center">
            <span className="font-ubuntu text-[46px] sm:text-3xl md:text-4xl font-medium leading-tight md:leading-relaxed tracking-tight text-center bg-gradient-to-r from-gray-200 via-green-200 to-gray-200 bg-clip-text text-transparent">
              Prove Yourself to Employers
            </span>
            <span className="font-ubuntu text-[28px] sm:text-xl md:text-2xl font-light leading-tight md:leading-relaxed tracking-tight text-center bg-gradient-to-r from-gray-200 via-green-200 to-gray-200 bg-clip-text text-transparent">
              Get Discovered, Get Hired
            </span>
          </div>
          <div className="flex flex-col mt-4 md:mt-8">
            <span className="text-gray-300 text-center font-ubuntu text-[20px] sm:text-lg md:text-xl font-normal leading-normal md:leading-relaxed tracking-wide max-w-2xl mx-auto">
              Employability connects employers with verified, Job-ready candidates through Al-powered interviews.
            </span>
          </div>
          <div className="flex flex-row justify-center mt-6 md:mt-11 gap-3">
            <Button
              onClick={() => navigate("/signup")}
              className="rounded text-black text-sm font-normal border border-white py-2 md:py-3 flex justify-center items-center gap-2 hover:text-black hover:bg-white bg-white w-32"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="rounded text-white text-sm font-normal border border-white py-2 md:py-3 flex justify-center items-center gap-2 hover:text-white/90 hover:bg-transparent bg-transparent w-32"
            >
              Take Interview
            </Button>
          </div>
        </section>
        <section className="flex flex-col px-4 justify-center pb-32 ">
          <div className="flex flex-col items-center">
            <span className="font-ubuntu text-[36px] sm:text-3xl md:text-3xl font-medium leading-tight md:leading-relaxed tracking-tight text-center bg-gradient-to-r from-gray-200 via-green-200 to-gray-200 bg-clip-text text-transparent">
              How It Works
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 px-4 sm:px-8 md:px-16 lg:px-32 ">
            {" "}
            <Card
              title="Build Your Profile"
              description="Add your experience, education, and skills to create a professional"
              iconSrc={resumeIcon}
              gradientColorStart="#C489FF"
              gradientColorEnd="#8834DD"
              iconWidth="5rem"
            />
            <Card
              title="Take AI-Driven Interviews"
              description="Showcase your abilities through smart, real-world assessments."
              iconSrc={interviewIcon}
              gradientColorStart="#89CEFF"
              gradientColorEnd="#3488DD"
              iconWidth="6rem"
            />
            <Card
              title="Get Verified"
              description="Our AI evaluates your performance to create a verified, trusted profile."
              iconSrc={verifiedIcon}
              gradientColorStart="rgba(141, 243, 182, 0.40)"
              gradientColorEnd="rgba(48, 116, 75, 0.40)"
              iconWidth="5rem"
            />
            <Card
              title="Stand Out to Employers"
              description="Get noticed by companies looking for job-ready, proven talent."
              iconSrc={employerIcon}
              gradientColorStart="#FFD089"
              gradientColorEnd="#DD9934"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

// Main component that creates the portal
const LandingPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) return <Dashboard isDashboard={true} displayScore={true} />;

  return <LandingPageContent />;
};

export default LandingPage;
