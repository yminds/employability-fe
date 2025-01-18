
import React, { useEffect, useState } from 'react'

import closesvg from '@/assets/jobs/close.svg';
import jobsvg from '@/assets/jobs/job.svg';
import locaitonsvg from  '@/assets/jobs/location.svg'
import compensationsvg from '@/assets/jobs/compensation.svg'
import employeesvg from '@/assets/jobs/employee.svg'
import buildingIcon from '@/assets/jobs/building.svg'

import ChipsCard from './ChipsCard';
import ChipsCardAdd from './chipsCardAdd';
import CheckBox from './CheckBox';

import { Filter } from '@/pages/JobsPage';
import { useGetJobLocationSuggestionsMutation ,useGetJobRoleSuggestionsMutation } from '@/api/jobsApiSlice';

import { cn } from "@/lib/utils"



interface JobsFilterModalProps {
    filters:Filter;
    setfilters:(filter:Filter)=>void;
    setIsFilterModalOpen:React.Dispatch<React.SetStateAction<boolean>>;
    
}







const JobsFilterModal:React.FC<JobsFilterModalProps>=(props)=> {
    const {filters,setfilters, setIsFilterModalOpen} = props;

    const [companySize,setCompanySize]=useState(filters.companySize);
    const [jobTypes,setJobTypes]=useState(filters.jobTypes);
    const [selectedJobTitles,setSelectedJobTitles]=useState(filters.jobRoles)
    const [suggestedJobTitles,setSuggestedJobTitles]=useState(filters.jobRoles.length?filters.jobRoles:['Frontend developer','Product Manager','Data Scientist','System Administrator']);
    const [getJobRoleSuggestion, { data:fetchedSuggestedJobRoles, isLoading:isloadingJob, error:jobError }] = useGetJobRoleSuggestionsMutation();
    
    const [selectedLocations,setSelectedLocations]=useState(filters.locations)
    const [suggestedLocations,setSuggestedLocations]=useState(filters.locations.length?filters.locations:['Banglore','chennai','delhi'])
    const [getLocationSuggestions, { data:fetchedSuggestedLocations, isLoading, error }] = useGetJobLocationSuggestionsMutation();
    const [onlyRemoteJobs,setOnlyRemoteJobs]=useState(filters.onlyRemoteJobs)
    const [minimumSalary,setMinimumSalary]=useState(filters.minimumSalary)
    const [mininmumExperience,setMinimumExperience]=useState(filters.minimumExperience)
    const [currency,setCurrency]=useState(filters.currency)
    
    const [workPlacePref,setWorkPlacePref]=useState(filters.workPlacePref)
    
    const currencies=['INR','USD',"EUR",'AUD','RUB'];

    const jobTypeMapping=[  {value:'fulltime',label:'Full time'},
                            {value:'parttime',label:'Part time'},
                            {value:'internship',label:'Internship'},
                            {value:'contract',label:'Contract'},
                            {value:'cofounder',label:'Co founder'}
                        ];

    const companySizes=['1-10','11-50','51-200','200-1000','1000+']



    useEffect(()=>{
        getJobRoleSuggestion({search:''})
        getLocationSuggestions({search:''})
    },[])

    useEffect(()=>{
        if(fetchedSuggestedLocations!=undefined){
            const newLocations=fetchedSuggestedLocations.locations.filter(item=> {return !selectedLocations.includes(item)});
            setSuggestedLocations(newLocations);
        }

    },[fetchedSuggestedLocations])

    useEffect(()=>{
        if(fetchedSuggestedJobRoles!=undefined){
            const newJobTitles=fetchedSuggestedJobRoles.roles.filter(item=> {return !selectedJobTitles.includes(item)});
            setSuggestedJobTitles(newJobTitles);
        }

    },[fetchedSuggestedJobRoles])
       
    const addJobTitletoFilters =(jobTitle:string)=>{
    
        setSuggestedJobTitles(suggestedJobTitles.filter(i=>i!=jobTitle))
        setSelectedJobTitles([...selectedJobTitles,jobTitle]);

    }


    const addLocationToFilters=(location:string)=>{1
        setSuggestedLocations(suggestedLocations.filter(i=>i!=location))
        setSelectedLocations([...selectedLocations,location]);
    }

    const toggleOnlyRemote=()=>{
        setOnlyRemoteJobs(!onlyRemoteJobs)
        if (onlyRemoteJobs==false){
            setSelectedLocations([])
        }
        
    }

    const changeCompanysize=(size:string)=>{
        setCompanySize(()=>size)
    }
     
    const applyFilters=()=>{
        const newFilters:Filter ={
            search:filters.search,
            locations:selectedLocations,
            workPlacePref:workPlacePref,
            jobRoles:selectedJobTitles,
            minimumSalary:minimumSalary,
            currency:currency,
            jobTypes:jobTypes,
            companySize:companySize,
            minimumExperience:mininmumExperience,
            onlyRemoteJobs:onlyRemoteJobs,
            skills:filters.skills
        }
        console.log(newFilters)
        setfilters(newFilters)
        setIsFilterModalOpen(false)
    }

    const handleJobTypeSelection=(jobType:string)=>{
        if(jobTypes.includes(jobType)){
            setJobTypes( (prev)=>prev.filter((item)=>item!=jobType))
        }
        else{  
            setJobTypes(prev=>[...prev,jobType])

        }   
    }

    const handleLocationSearch=(search:string)=>{
        getLocationSuggestions({search})
    }

    
    const handleJobTitleSearch=(search:string)=>{
        getJobRoleSuggestion({search})
    }

    const handleWorkPrefChange=(e:any)=>{
        setWorkPlacePref(e.target.value)
    }


  return (
    <div className='p-[42px] z-[52] flex items-center justify-center  w-full h-full absolute top-0 left-0  bg-black/50'  onClick={()=>{setIsFilterModalOpen(false)}}>  

        <div id='modal main container' className='flex flex-col gap-8  m-auto w-[50%] h-full bg-white p-[42px] rounded-[8px] overflow-auto scrollbar-hide'  onClick={e=>e.stopPropagation()}>

                {/* title section */}
            <section  className='flex flex-row justify-between'>
                <h2 className="text-[#191919] text-xl font-medium font-['Ubuntu'] leading-relaxed">Filter Jobs by</h2>
                <img src={closesvg} className='text-gray-600 bg-white border-none p-2.5'  onClick={()=>{setIsFilterModalOpen(false)}} ></img>
            </section>

            {/* filters */}
            <section className='flex flex-col gap-12'>

                        {/* jobs filter section */}
                <div className='flex flex-col gap-3.5'> 
                    <div className='flex flex-row gap-4'>
                        <img src={jobsvg} className='w-5 h-5 relative overflow-hidden' ></img>
                        <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Job title</h3>
                    </div>
                

                    <div className='bg-[#f9f9f9] rounded-[7px] p-6 pt-8 border border-black/10 flex-col justify-start  gap-6 flex items-stretch  '>

                                {/* adding jobtitles */}
                        <div className='h-min-16 p-4  bg-white rounded-md border border-black/10 justify-start items-center flex flex-row gap-4 '>
                        
                            <ChipsCard onInputChange={handleJobTitleSearch} itemList={selectedJobTitles} setItemList={(items:string[])=>setSelectedJobTitles(items)}></ChipsCard>
                            
                        </div>

                                {/* suggestion tab for jobtitles */}
                        <div className='flex flex-col gap-3'>
                            <h2> Suggested </h2>
                            <div className=' justify-start items-center flex flex-row gap-4 '>
                                <ChipsCardAdd itemList={suggestedJobTitles} selectItem={addJobTitletoFilters}></ChipsCardAdd>
                            </div>

                        </div>
                    </div>
                </div>

                               {/* experience filter section          */}
                <div className='flex flex-col gap-3.5'> 
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row gap-4'>
                            <img src={employeesvg} className='w-5 h-5 relative overflow-hidden' ></img>
                            <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Experience</h3>
                        </div>
                    </div>

                    <div className='bg-[#f9f9f9] rounded-[7px] p-6 pt-8 border border-black/10 flex-col justify-start  gap-7 flex items-stretch  '>
                    
                        <div className='flex justify-between w-1/2'>

                        <h3>Minimum Experience </h3>
                        <p>{mininmumExperience!=null?mininmumExperience+' Years':"Any"}</p>
                                    
                        </div>

                                    {/* slider */}
                        <div className='relative flex  gap-6 w-1/2'>
                         {/* <div className="flex flex-col w-full justify-start gap-6"> */}
  
                                    <div className="relative w-full ">
                                        {/* Background bar */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-600 rounded-full z-[53]"></div>

                                        {/* Progress bar */}
                                        <div
                                        className="absolute h-1 bg-[#2EE578] rounded-full z-[53]"
                                        style={{
                                            width: `${(mininmumExperience !== null ? mininmumExperience : 31) / 31 * 100}%`,
                                        }}
                                        ></div>

                                        {/* Single input slider */}
                                        <input
                                        type="range"
                                        min="0"
                                        max="31"
                                        value={mininmumExperience !== null ? mininmumExperience : 31}
                                        onChange={(e:any) => e.target.value==31?setMinimumExperience(null):setMinimumExperience(e.target.value)}
                                        className="absolute w-full h-1 appearance-none bg-transparent focus:outline-none pointer-events-auto z-[53]"
                                        />
                                    </div>
                        </div>

                    
                    </div>


                    
                </div>

                     {/* location filter section */}
                <div className='flex flex-col gap-3.5'> 
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row gap-4'>
                            <img src={locaitonsvg} className='w-5 h-5 relative overflow-hidden' ></img>
                            <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Location</h3>
                        </div>
                        
                     
                    </div>

                    
                    <div className='bg-[#f9f9f9] rounded-[7px] p-6 pt-8 border border-black/10 flex-col justify-start  gap-6 flex items-stretch  '>

                                {/* adding prefered locations */}
                        <div className='h-min-16 p-4  bg-white rounded-md border border-black/10 justify-start items-center flex flex-row gap-4 '>
                        
                            <ChipsCard onInputChange={handleLocationSearch}  itemList={selectedLocations} setItemList={(items:string[])=>setSelectedLocations(items)}></ChipsCard>
                            
                        </div>

                                {/* suggestion tab for locations */}
                        <div className='flex flex-col gap-3 '>
                            <h2> Suggested </h2>
                            <div className='justify-start items-center flex flex-row gap-4 '>
                                <ChipsCardAdd itemList={suggestedLocations} selectItem={addLocationToFilters}></ChipsCardAdd>
                            </div>
                        </div>

                                    {/* location type preferences */}
                        <div className='flex flex-col gap-1 items-stretch justify-start'>
                            <h3 className="text-black text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight"> Work Preference</h3>
                            <select value={workPlacePref} onChange={handleWorkPrefChange} className='w-1/2  h-[50px]  focus:outline-none px-4 py-2 bg-white rounded-md border border-black/10 '>
                                <option value="">Any</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        
                    </div>

                </div>

                    {/* salary filter section */}
                <div className='flex flex-col gap-3.5'> 
                    <div className='flex flex-row gap-4'>
                        <img src={compensationsvg} className='w-5 h-5 relative overflow-hidden' ></img>
                        <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Compensation</h3>
                    </div>

                    <div className='bg-[#f9f9f9] rounded-[7px] p-6 pt-8 border border-black/10 flex-col justify-start  gap-6 flex items-stretch  '>


                        <div className='flex flex-col gap-3 '>
                            <label className="text-black text-base font-normal font-['SF Pro Display']  tracking-tight"> Enter minimum expected salary (yearly) </label>

                            <div className='h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 justify-start items-center gap-3.5 inline-flex' >
                                <select name="currency" id="currency" className="focus:outline-none text-black text-base font-normal font-['SF Pro Display']  tracking-tight appearance:textfield"
                                    onChange={(e)=>{ setCurrency(e.target.value)}}
                                    value={currency}
                                >
                                    {currencies.map((currency)=><option key={currency} value={currency}>{currency}</option>) }
                                </select>

                                <input type="number"  placeholder='12,00,000' step='5000'  className='focus:outline-none w-full' 
                                    onChange={(e)=>{setMinimumSalary(e.target.valueAsNumber)}}
                                    value={minimumSalary}
                                />
                                
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 '>
                            <label className="text-black text-base font-normal font-['SF Pro Display']  tracking-tight"> Equity </label>
                            <div className='h-[50px] px-4 py-2 bg-white rounded-md border border-black/10 justify-start items-center gap-[13px] inline-flex'>
                                <input placeholder=' eg: 1%' min='0' max='100' type='number'className='w-full focus:outline-none'></input>

                            </div>
                        
                        </div>        
                    </div>

                </div>

                    {/* jobType and company size filter */}
                <div className='flex flex-row gap-5 w-full'>

                                            {/* jobtype selection */}
                    <div className='flex flex-col gap-3.5  w-full'>
                            <div className='flex flex-row gap-2'>
                                <img src={employeesvg} className='w-5 h-5 relative overflow-hidden'></img>
                                <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Job Type</h3>
                            </div>

                            <div className='px-6 pt-8 pb-6 bg-[#f9f9f9] rounded-[7px] border border-black/10 flex-col justify-start items-start gap-6 inline-flex  h-full'>
                                <CheckBox itemList={jobTypeMapping} multiselect={true} selected={jobTypes} onSelected={handleJobTypeSelection} ></CheckBox>

                            </div>

                    </div>
                                        {/* company size selection */}
                    <div className='flex flex-col gap-3.5 w-full'>
                            <div className='flex flex-row gap-2'>
                                <img src={buildingIcon} className='w-5 h-5 relative overflow-hidden'></img>
                                <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Company size</h3>
                            </div>

                            <div className='px-6 pt-8 pb-6 bg-[#f9f9f9] rounded-[7px] border border-black/10 flex-col justify-start items-start gap-6 inline-flex '>
                                <CheckBox itemList={companySizes.map(item=>({value:item,label:item+' emplyees'})) } multiselect={false} selected={companySize}  onSelected={changeCompanysize} ></CheckBox>
                                
                                
                            </div>
                    </div>

                </div>

     
            </section>

            <div className='flex gap-3 justify-end'>
                    <button className="w-[161px] h-11 px-8 py-4 rounded border border-[#00183d] justify-center items-center gap-2 inline-flex text-base font-medium font-['SF Pro Display'] leading-normal" onClick={()=>{setIsFilterModalOpen(false)}}>Discard </button>
                    <button className="w-[196px] h-11 px-8 py-4 bg-[#00183d] rounded justify-center items-center gap-2 inline-flex text-base font-medium font-['SF Pro Display'] leading-normal text-white" onClick={applyFilters}>Apply filter</button>
                </div>
        </div>
    </div>
  )
}



export default JobsFilterModal;
