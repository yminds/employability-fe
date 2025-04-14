import JobPostDetails from "@/components/job-application/JobPostDetails";
import React from "react";

const JobPostingPage: React.FC = () => {
  return (
    <div
      className="flex w-full h-screen justify-center overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <main className=" flex-col bg-[#F5F5F5] w-[100%] h-full">
        <JobPostDetails />
      </main>
    </div>
  );
};

export default JobPostingPage;
