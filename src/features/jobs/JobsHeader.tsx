import React from "react"
import { useState } from "react";

import filterIcon from  '@/assets/jobs/filter.svg'
import searchIcon from  '@/assets/jobs/search.svg'
import locationIcon from  '@/assets/jobs/location.svg'
import compensationsvg from '@/assets/jobs/compensation.svg'
import employeesvg from '@/assets/jobs/employee.svg'

interface JobsHeaderProps {
    JobsTab:string;
    setJobsTab:(jobsCategory:string)=>void;
    filters:any;
    openFiltersModal:()=>void
    onSearch:(keywork:string)=>void
}


const JobsHeader:React.FC<JobsHeaderProps> = (props) => {
    

    const {JobsTab,setJobsTab,filters,openFiltersModal}=props;
    


    const handleSearchChange=(e:any)=>{
       
        if (e.key=='Enter'){
            props.onSearch(e.target.value.trim())
        }
        
    }

    const getAppliedFiltersCount=()=>{
        let count=0;
        if (filters.locations.length>0) count++;
        if (filters.jobRoles.length>0) count++;
        if (filters.jobTypes.length>0) count++;
        if (filters.minimumSalary>0) count++;
        if (filters.companySize!=='') count++;
        if (filters.currency!=='INR') count++;
        if (filters.onlyRemoteJobs) count++;
        return count
    }

    const jobTypesDisplayMapping=(input:string)=>{
        
            if(input =='fulltime' )
                return 'Full time'
            if (input=='parttime')
                return 'Part time'
            if (input=='internship')
                return 'Internship'
            if (input=='cofounder')
                return 'Co founder'
            return ''
            };

    const appliedFiltersCount=getAppliedFiltersCount();




    return (  
        <div className="w-full jobsheader flex flex-col gap-4 bg ">

            <section id="title and back btn " className="flex flex-row gap-4">
                <div className="w-[30px] h-[30px] bg-white rounded-3xl border border-black/10 flex-col justify-center items-center gap-2.5 inline-flex" >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="Vector 84" d="M0.505025 5.50503C0.231658 5.77839 0.231658 6.22161 0.505025 6.49497L4.9598 10.9497C5.23316 11.2231 5.67638 11.2231 5.94975 10.9497C6.22311 10.6764 6.22311 10.2332 5.94975 9.9598L1.98995 6L5.94975 2.0402C6.22311 1.76684 6.22311 1.32362 5.94975 1.05025C5.67638 0.776886 5.23316 0.776886 4.9598 1.05025L0.505025 5.50503ZM1 6.7H12V5.3H1V6.7Z" fill="#666666"/>
                    </svg>
                </div>
                <div className="w-[390px] text-black text-xl font-medium font-['Ubuntu'] leading-relaxed"><p></p>Jobs</div>
            </section>
        
            <section id="search and filters " className="flex flex-row gap-3.5 justify-between items-center ">
                
                <div  id='job categories' className="bg-white   p-[5px] rounded-md justify-start text-center gap-2.5 inline-flex">
                    <button 
                    onClick={()=>setJobsTab('All')}
                    className={`py-1.5 px-2 rounded-[3px]  text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight ${JobsTab=='All'?'bg-[#DBFFEA] text-[#10B754]':''} `}
                    >All</button>
                    <button 
                    onClick={()=>setJobsTab('Suggested')}
                    className={`py-1.5 px-2 rounded-[3px] text-base font-normal font-['SF Pro Display']  leading-normal tracking-tight ${JobsTab=='Suggested'?'bg-[#DBFFEA] text-[#10B754]':''}`}>Suggested</button>
                    <button 
                    onClick={()=>setJobsTab('Active application')}
                    className={`py-1.5 px-2 rounded-[3px] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight ${JobsTab=='Active application'?'bg-[#DBFFEA] text-[#10B754]':''}`}>Active applications</button>

                </div>

                <div id='search bar and filters ' className="flex flex-row gap-3.5  item-center">

                    <div id='searchbar' className="flex flex-row p-[5px]  rounded-[6px] items-center bg-white">
                        <div className="py-1.5 px-3 flex items-center justify-center">
                            <img src={searchIcon} className="w-4 h-4 "></img>
                        </div>
                        <div className="py-1.5 pr-3 ">
                        <input onKeyDown={handleSearchChange}  type="text" placeholder="Search" className=" text-[#67696b] text-base font-normal font-['SF Pro Display'] w-20 leading-normal tracking-tight focus:outline-none focus:w-28 " />
                        </div>
                    </div>

                    <div id='filters' className="flex flex-row p-2.5 rounded-[6px] items-center text-center bg-white "
                    onClick={()=>openFiltersModal()}    >
                        <img src={filterIcon} className="w-4 h-4 my-1.5 mx-3 "></img>
                        <p className=" my-1.6 mr-12 text-[#67696b] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight"> Filters {appliedFiltersCount?`(${appliedFiltersCount})`:''}</p>
                    </div>
                </div>
            </section>

            {appliedFiltersCount>0 &&            
            
                <section id='applied filters' className="flex  flex-row justify-start gap-3.5 items-center w-full  rounded-lg  overflow-clip overflow-ellipsis ">
                    
                    <p className="  text-nowrap ">Applied filters  </p>
                   
                    <div className="inline-flex gap-2 ">

                            {/* location filters */}
                        {filters.locations.length>0 &&
                            <div  className=" flex flex-row  gap-1.5 px-3 items-center rounded-lg justify-start py-2.5 bg-white text-nowrap text-ellipsis overflow-hidden min-w-min w-max-[320px]"> 
                                <img src={locationIcon} className="w-4 h-4  "></img>
                                <p className=" inline-block ">{filters.locations.slice(0,4).join(',')}{filters.locations.length>4?'...':''}</p>
                            </div>
                        }
                        
                            {/* salary filters */}
                        {filters.minimumSalary>0 && 
                            <div  className=" flex flex-row  gap-1.5 px-3 items-center rounded-lg justify-center py-2.5 bg-white  "> 
                                <img src={compensationsvg} className="w-4 h-4  "></img>
                                <p className=" inline-block "> {'>'}{filters.minimumSalary}</p>
                            </div>

                             
                        }

                                {/* jobtypes filters */}
                        {filters.jobTypes.length>0 && 
                            <div  className=" flex flex-row  gap-1.5 px-3 items-center rounded-lg justify-center py-2.5 bg-white text-ellipsis text-nowrap "> 
                                <img src={employeesvg} className="w-4 h-4  "></img>
                                <p className=" inline-block ">{filters.jobTypes.slice(0,2).map((item:string)=>{return jobTypesDisplayMapping(item);}).join(', ')}{filters.jobTypes.length>2?'...':''} </p>
                            </div>                             
                        }


                        {filters.jobRoles.length>0 && 
                            <div  className=" flex flex-row  gap-1.5 px-3 items-center rounded-lg justify-center py-2.5 bg-white   text-ellipsis whitespace-nowrap "> 
                                <img src={employeesvg} className="w-4 h-4  "></img>
                                <p className=" inline-block ">{filters.jobRoles.slice(0,2).join(', ')}{filters.jobRoles.length>2?'...':''} </p>
                            </div>    
                        }

                        
                        {filters.companySize!='' && 
                            <div  className=" flex flex-row  gap-1.5 px-3 items-center rounded-lg justify-center py-2.5 bg-white   text-ellipsis whitespace-nowrap  t"> 
                                <img src={employeesvg} className="w-4 h-4  "></img>
                                <p className=" inline-block ">{filters.companySize} employees</p>
                            </div>    
                        }

                       

                    </div> 


                </section> }


        </div>

        
    );
}

export default JobsHeader;