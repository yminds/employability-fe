import React from "react";
import JobCard from "@/features/jobs/JobCard";
import JobSideBar from "@/features/jobs/JobsSideBar";
import JobsHeader from "@/features/jobs/JobsHeader";
function JobPage(){

const jobData = {
    id: 1,
    title: "Senior Developer",
    company: "Tech Corp",
    type: "Full-time",
    locations:['banglore','chennai'],
    logo: "https://www.accenture.com/favicon.ico",
    skills: ['c++','mysql','react','angular','devops'],
    salary:'0 Rs - 10LPA',
    minimumExperience:2

};

  const preferedLocaions=['bengalore','delhi','australia'];
  const userSkills=['c++','mysql','snowflake','android studio','react'];

return (
<div className="w-screen h-screen bg-[#f4f4f4] flex flex-row gap-8 justify-end">
    
    <div className="w-[70%] flex flex-col gap-8 ml-10">
       <JobsHeader test="hello" hello={2}></JobsHeader>

        <div className="job flex flex-col gap-4 overflow-scroll w-full  w-max-[920px] ">
            <JobCard   job={jobData} preferedLocations={preferedLocaions} userSkills={userSkills} userExperience={2} ></JobCard>
            <JobCard   job={jobData} preferedLocations={[]} userSkills={['react']} userExperience={0}></JobCard>
            <JobCard   job={jobData} preferedLocations={preferedLocaions} userSkills={userSkills} userExperience={0}></JobCard>
            <JobCard   job={jobData} preferedLocations={[]} userSkills={userSkills} userExperience={3}></JobCard>
        </div>
    </div>

    <div className="w-[30%] w-max-[260px] mr-10 ">
        <JobSideBar></JobSideBar>
    </div>

</div>)

}



export default JobPage