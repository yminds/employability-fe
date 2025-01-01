import { Filter } from 'lucide-react';
import React, { useState } from 'react'

import closesvg from './svgs/close.svg';
import jobsvg from './svgs/job.svg';
import arrowDown from './svgs/arrowDown.svg';

import ChipsCard from './ChipsCard';
import ChipsCardAdd from './chipsCardAdd';

interface filters {
    locations:string[];
    jobRoles:string[];
    salary:number|null;
    jobType:string;
    companySize:string ;
}

// const defaultJobFilters:filters={
//     locations:[],
//     jobRoles:[],
//     salary:null,
//     jobType:'',
//     companySize:''
//     }

interface JobsFilterModalProps {
    filters:filters;
    setfilters:React.Dispatch<React.SetStateAction<filters>>;
    setIsFilterModalOpen:React.Dispatch<React.SetStateAction<boolean>>;
    
}







const JobsFilterModal:React.FC<JobsFilterModalProps>=(props)=> {
    const {filters,setfilters, setIsFilterModalOpen} = props;

    const [selectedJobTitles,setSelectedJobTitles]=useState(filters.jobRoles)
    const [suggestedJobTitles,setSuggestedJobTitles]=useState(['Frontend developer','Product Manager','Data Scientist','System Administrator']);
    
    const onJobTitleSelect =(jobTitle:string)=>{

        setSuggestedJobTitles(suggestedJobTitles.filter(i=>i!=jobTitle))
        setSelectedJobTitles([...selectedJobTitles,jobTitle]);
    }

  return (
    <div className='p-[42px] z-50 flex items-center justify-center  w-screen h-screen absolute  bg-black/50 '>  

        <div id='modal main container' className='flex flex-col gap-8  m-auto w-[50%] h-[90%] bg-white p-[42px] rounded-[8px] oferflow-scroll scrollbar-hide'>

                {/* title section */}
            <section  className='flex flex-row justify-between'>
                <h2>Filter Jobs by</h2>
                <img src={closesvg} className='text-gray-600 bg-white border-none p-2.5'  onClick={()=>{setIsFilterModalOpen(false)}} ></img>
            </section>

            {/* filters */}
            <section className='flex flex-col gap-3.5'>

                    
                <div> 
                    <div className='flex flex-row gap-4'>
                        <img src={jobsvg} className='w-5 h-5 relative overflow-hidden' ></img>
                        <h3>Job title</h3>
                    </div>
                </div>

                <div className='bg-[#f9f9f9] rounded-[7px] p-6 pt-8 border border-black/10 flex-col justify-start  gap-6 flex items-stretch '>


                            {/* adding jobtitles */}
                    <div className='h-16 px-4  bg-white rounded-md border border-black/10 justify-start items-center flex flex-row gap-4 '>
                        <div className=' w-auto'>
                        <ChipsCard  itemList={selectedJobTitles} setItemList={(items:string[])=>setSelectedJobTitles(items)}></ChipsCard>
                        </div>
                        <div className='flex-1 flex flex-row items-center'>
                            <input className='h-10   w-full  p-0 my-auto focus:outline-none'></input>
                            <img src={arrowDown} ></img>
                        </div>
                    </div>

                            {/* suggestion tab for jobtitles */}
                    <div>
                        <h2> Suggested </h2>
                        <div>
                            <ChipsCardAdd itemList={suggestedJobTitles} selectItem={onJobTitleSelect}></ChipsCardAdd>
                        </div>

                    </div>
                

                </div>

                    
            </section>
        </div>
    </div>
  )
}


export default JobsFilterModal;
