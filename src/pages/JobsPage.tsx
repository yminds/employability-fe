import React from "react";
import {useEffect, useState} from "react";
import JobCard from "@/features/jobs/JobCard";
import JobSideBar from "@/features/jobs/JobsSideBar";
import JobsHeader from "@/features/jobs/JobsHeader";

import JobsFilterModal from "@/features/jobs/JobsFilterModal";

import JobDetailsModal from "@/features/jobs/JobDetailsModal";

import { useGetAllJobsMutation } from "@/api/jobsApiSlice";




export interface Job {
    id: number;
    title: string;
    company: string;
    type: string;
    locations:string[];
    skills:string[]
    logo: string;
    minimumExperience:number;
    aboutCompany:string;
    salaryRange:string;
    description:string;
  }

export interface Filter{
    search:string
    jobRoles:string[];
    locations:string[];
    minimumSalary:number;
    jobTypes:string[];
    companySize:string;
    currency:string;
    onlyRemoteJobs:boolean

}

const JobPage:React.FC=()=>{

 
    const defaultJobFilters:Filter={
        search:"",
        locations:[],
        jobRoles:[],
        minimumSalary:0,
        jobTypes:[],
        companySize:'',
        currency:'INR',
        onlyRemoteJobs:false
    };
    
    const [isFilterModalOpen,setIsFilterModalOpen]=useState(false);
    const [filters, setFilters] = useState(defaultJobFilters);
    const [jobsCategory,setJobsCategory]=useState('All')
    const userSkills=['Linux','Agile','HTML','JavaScript','Java','MySQL','C++','Python'];
    const userExperience=2;

    const [isDetailsModalOpen,setIsDetailsModalOpen]=useState(false);
    const [selectedJob, setSelectedJob] = useState(undefined);

   
    const [jobsList,setJobsList]=useState<Job[]>([])
    const [pageNumber,setPageNumber]=useState(1);
   // const { data:jobs, error, isLoading } = useGetAllJobsMutation( {pageNumber, ...filters});
    const [getAllJobs, { data:jobs, isLoading, error }] = useGetAllJobsMutation();


    useEffect(()=>{
        console.log('filters changed')
        console.log(JSON.stringify(filters))
        setJobsList(()=>[])
        setPageNumber(()=>1)
        console.log('emptied the jobslist and set page number to 1');
    
    },[filters])

    useEffect(()=>{
        console.log('pageNumber changed')
        getAllJobs({page:pageNumber,filters})
        
    },[pageNumber,filters])


    useEffect(()=>{ 
        
        console.log('jobs changed',jobs)

        if(jobs!==undefined && jobs.length>0){
            console.log('added fetched jobs to jobslist');
                
           setJobsList((prevJobs:any)=>[...prevJobs,...jobs])
       }

    },[jobs])

    
    const handleScroll = (e: any) => {
        const container = e.target;
    
        if (Math.floor(container.scrollHeight - container.scrollTop)-container.clientHeight <10) {
           setPageNumber((prevPageNumber) => prevPageNumber + 1);
           console.log('page number is',pageNumber);
           
            // Trigger your action here
        }
    };
    
    const handleSearch=(searchTerm:string)=>{
        console.log('search term changed',searchTerm);
        setFilters((prevFilters)=>({...prevFilters,search:searchTerm}))
    }
   
    const displayDetails=(job:any)=>{
        setIsDetailsModalOpen(true);
        setSelectedJob(job);
    }

return (
<div className=" flex-1 h-screen w-[75%]  bg-[#F5F5F5] flex flex-row gap-8 justify-around " >
    
    <div className="w-[70%]  flex flex-col gap-8 ml-10">
       <JobsHeader  onSearch={handleSearch} filters={filters} openFiltersModal={()=>setIsFilterModalOpen(true)} JobsTab={jobsCategory} setJobsTab={(jobsCategory:string)=>{setJobsCategory(jobsCategory)} }></JobsHeader>

        <div className="job flex flex-col gap-4 overflow-scroll scrollbar-hide w-full h-full   " onScroll={handleScroll}  >
            {jobsList.map(
                (jobData,index)=><JobCard key={index}
                job={jobData} 
                preferedLocations={filters.locations} 
                userSkills={userSkills} 
                userExperience={userExperience}
                onApply={()=>{displayDetails(jobData)}} 
                />)}
        </div>
    </div>

    <div className="w-[25%] w-max-[260px] mr-10 ">
        <JobSideBar/>
    </div>

    {isFilterModalOpen && <JobsFilterModal  filters={filters} setIsFilterModalOpen={setIsFilterModalOpen} setfilters={setFilters} />}
    {isDetailsModalOpen && selectedJob!=undefined?<JobDetailsModal jobData={selectedJob} userSkills={userSkills} closeModal={()=>{setIsDetailsModalOpen(false)}} />:'' }

</div>)

}



export default JobPage
