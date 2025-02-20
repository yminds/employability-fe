import JobPage from "./JobsPage";
import React from "react";

const PageJobs: React.FC = () => {
  return (
    <div className="flex w-full h-screen justify-center sm:overflow-y-auto">
      <main className=" flex-col bg-[#F5F5F5] w-[90%] max-w-[1800px] p-5 h-full sm:p-0">
        <JobPage />
      </main>
    </div>
  );
};

export default PageJobs;
