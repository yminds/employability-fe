import JobInvitation from "@/components/employer/JobInterviewInvitation";
import React from "react";

const EmployerInterviewInvitaion: React.FC = () => {
  return (
    <div className="flex w-full justify-center sm:overflow-y-auto sm:flex-col">
      <main className=" flex-col bg-[#F5F5F5] max-w-[1800px] p-5">
        <JobInvitation />
      </main>
    </div>
  );
};

export default EmployerInterviewInvitaion;