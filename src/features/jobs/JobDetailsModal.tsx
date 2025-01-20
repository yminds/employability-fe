import React from 'react'

import closeIcon from '@/assets/jobs/close.svg'
import errorIcon from '@/assets/jobs/error.svg'
import locationIcon from '@/assets/jobs/location.svg'
import employeeIcon from '@/assets/jobs/employee.svg'
import briefcaseIcon from '@/assets/jobs/briefcase.svg'

import ChipsCardAdd from './chipsCardAdd'

import DOMPurify from 'dompurify'
import type { Job } from '@/pages/JobsPage'


  

interface JobDetailsProps{
    jobData:Job;
    userSkills:string[];
    closeModal:()=>void;
}



const JobDetailsModal:React.FC<JobDetailsProps>=({jobData,userSkills,closeModal})=>{

    

    const calculateMatch=()=>{
        const requiredSkills=jobData.skills;
        const matchedSkills=requiredSkills.filter((item)=>userSkills.includes(item._id))
        
        const matchpercentage= Math.floor((matchedSkills.length/requiredSkills.length)*100) | 0;
        return matchpercentage       
    }

    const matchPercentage=calculateMatch();
    const minimumMatchPercentage=60;
    
    return (
<div className="jobDetailsModal z-40 absolute top-0 left-0 bg-black/25 h-screen w-screen flex flex-row justify-end overflow-hidden " onClick={()=>closeModal()}>

    <style>
        {`
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100%);
              
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideInFromRight {
            animation: slideInFromRight 0.4s ease-out;
          }
        `}
      </style>

    <div className='w-4/6 h-full p-[42px] bg-white flex flex-col gap-4 slide-out-to-left-full animate-slideInFromRight ' onClick={e=>e.stopPropagation()} >

        <div className='flex flex-col gap-8 h-[90%] '>

                    {/* title */}
            <div className='flex justify-between items-center'>
                    <h3 className="text-[#191919] text-xl font-medium font-['Ubuntu'] leading-relaxed">{jobData.title}</h3>
                    <img src={closeIcon} className='overflow-auto p-2.5 ' onClick={()=>{closeModal()}}></img>
            </div>

            <div className='flex flex-col h-full gap-12 overflow-scroll scrollbar-hide'>

                    {/* company and job details */}
                <section className='flex flex-row gap-5 '>

                        {/* about company and skils */}
                    <div className='p-6 bg-[#f7f7f7] rounded-md   flex-col justify-start items-start gap-6 inline-flex w-7/12'>
                        <div className='flex flex-row justify-between w-full'>
                            <div className='flex flex-row gap-3'>
                                <div className=' p-[7.5px] size-fit rounded-full bg-white'>
                                    <img className='w-[15px] h-[15px]  center' src={jobData.logo} ></img>
                                </div>
                                <h3 className="text-[#191919] text-base font-medium font-['Ubuntu'] leading-snug my-auto ">{jobData.company}</h3> 
                            </div>

                        {jobData.skills.length>0 &&
                
                            <div>
                               <span className={`text-xl font-bold inline-block font-['Ubuntu'] leading-[18px] ${matchPercentage>=minimumMatchPercentage?'text-[#10b753]':'text-[#cf0c19]' }`}  >{matchPercentage}%</span>
                               <span className="text-[#0b0e12] text-base font-['Ubuntu'] leading-[18px] "> match</span>
                            </div>

                        }
                        </div>

                        <div className='flex flex-col gap-1'>
                            <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">About</h3>
                            <p> {jobData.aboutCompany}</p>
                        </div>
                                                    {/* skills */}
                       
                      {jobData.skills.length>0 &&
                       
                        <div className='flex flex-col gap-1'>
                            <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Skills required</h3>
                            
                            <ul className='flex flex-wrap w-full gap-2'>
                                            {/* skills that dont match with user */}
                                {jobData.skills.filter(item=>!userSkills.includes(item._id))
                                    .map((item)=><li key={item._id} className="inline-flex items-center gap-1 py-1 pl-2.5 pr-4  bg-[#cf0c19]/10 rounded-[33px] text-[#cf0c19] text-base font-['SF Pro Display']  tracking-tight">   <img src={errorIcon} className='w-5 h-5 '></img> {item.name}  </li>
                                )}

                                            {/* skills that match user skills */}
                                {jobData.skills.filter(item=>userSkills.includes(item._id))
                                    .map((item)=><li  key={item._id} className="  tracking-tight  py-1 px-4 bg-[#e6eeeb]  rounded-[33px] text-[#03963e]  text-base font-['SF Pro Display'] tracking-tight"> {item.name} </li>
                                ) }

                            </ul>
                        </div>
                        }

                    </div>
                                                {/* job details */}
                    <div className='p-6 bg-[#f7f7f7] rounded-md  flex-col justify-center items-start gap-5 inline-flex w-3/6'>
                                
                                <div className='flex flex-row justify-start gap-3'>
                                    <div className='p-[12px] bg-white'>

                                        <img src={employeeIcon}  className='h-[22px] w-[22px] '/>
                                    </div>
                                    <div>
                                        <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">Min Experience</h3>
                                        <p className="text-[#414347] text-base  font-['SF Pro Display']  tracking-tight"> {jobData.minimumExperience} years</p>
                                    </div>
                                </div>

                                <div className='flex flex-row justify-start gap-3'>
                                   <div className='p-[12px] bg-white'>

                                        <img src={locationIcon}  className='h-[22px] w-[22px] '/>
                                    </div>
                                    <div>
                                        <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug" >Location</h3>
                                        <p className="text-[#414347] text-base  font-['SF Pro Display']  tracking-tight"> {jobData.locations.map(item=> item.charAt(0).toUpperCase()+item.slice(1)).join(',') }</p>
                                    </div>
                                </div>

                                <div className='flex flex-row justify-start gap-3'>
                                    <div className='p-[12px] bg-white'>
                                        <img src={employeeIcon}  className='h-[22px] w-[22px] '/>
                                    </div>
                                    <div>
                                        <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug" >Compensation</h3>
                                        <p className="text-[#414347] text-base  font-['SF Pro Display']  tracking-tight"> { jobData.salaryRange }</p>
                                    </div>
                                </div>

                                <div className='flex flex-row justify-start gap-3'>

                                    <div className='p-[12px] bg-white'>
                                            <img src={briefcaseIcon}  className='h-[22px] w-[22px] '/>
                                    </div>
                                    <div>
                                        <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug" >Job Type</h3>
                                        <p className="text-[#414347] text-base  font-['SF Pro Display']  tracking-tight" > {jobData.type }</p>
                                    </div>
                                </div>

                    </div>
          
                </section>

                            {/* job description                 */}
                <section className='flex flex-col gap-4  '>

                  
                            <h2 className="text-black text-base font-medium font-['Ubuntu'] leading-snug"> Job Description</h2>
{/*                             
                            <iframe className=' bg-slate-200  overflow-scroll scrollbar-hide'  srcDoc={jobData.description}  > </iframe> */}
                            <div className="  overflow-scroll scrollbar-hide"  dangerouslySetInnerHTML={ ({__html: DOMPurify.sanitize(jobData.description)}) } ></div>
                      
                </section>


                <section className=' p-6 bg-[#ddf8e8]/50 rounded-[9px] justify-start items-stretch gap-2.5 flex flex-row '>
                                    {/* employablility icon */}
                            <div className=' flex flex-col   justify-start size-fit py-[3px] '>
                                <img src='/logo.svg' className='h-[14.5px] w-4 mt-[2px]' />
                            </div>

                                 {/* Analysis content */}
                            <div className='w-full flex flex-col justify-start gap-8 '>

                                                            {/* overview  */}
                                <div className='flex flex-col justify-start items-stretch gap-2.5'>
                                    <h3 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">AI Analysis</h3>

                                    <p className="text-[#414347] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight"> 
                                                    You’re a strong candidate for this position! Your experience, skills, and projects align closely with what Creative Minds Inc. is looking for. However, to maximize your chances:
                                                    Refine your portfolio with detailed case studies and measurable outcomes.
                                                    Emphasize how your freelance work was equivalent to full-time professional experience.
                                    </p>
                                </div>


                                <div className='flex flex-row gap-8 w-full'>

                                    <div className='flex-1 flex-col flex gap-3'>
                                        <h3 className=" text-black text-base font-medium font-['Ubuntu'] leading-snug"> Skill Alignment</h3>

                                        <ul className='list-disc ml-5'>
                                            <li>
                                            Your experience with React.js, Node.js, SQL/NoSQL databases, and cloud platforms (AWS) is highly relevant to the role. 
                                              
                                            </li>
                                            <li>
                                                No mention of Ruby on Rails or GraphQL in your resume.
                                            </li>
                                        </ul>

                                    </div>

                                    <div className='flex-1 flex flex-col gap-3'>
                                        <h3 className=" text-black text-base font-medium font-['Ubuntu'] leading-snug"> Skill Alignment</h3>

                                        <ul className='list-disc ml-5'>
                                            <li>
                                            Your experience with React.js, Node.js, SQL/NoSQL databases, and cloud platforms (AWS) is highly relevant to the role.
                                           
                                            </li>
                                            <li>
                                                No mention of Ruby on Rails or GraphQL in your resume.
                                            </li>
                                        </ul>
                                    </div>

                                </div>

                                <hr></hr>
                                <div className='flex flex-col gap-3'>
                                    <h3>Recommendation</h3>
                                    <div className='flex flex-col gap-4'>
                                            <p>Add the following skills to our profile to improve your job match by upto 90%</p>
                                            <ChipsCardAdd itemList={['React','MongoDb','Node.js','GraphQL','MySQL','Express',]}  selectItem={(item:string)=>{}} ></ChipsCardAdd>
                                    </div>
                                </div>


                            </div>

                </section>
             

            </div>
          
        </div>
        
        <div className='flex gap-3 justify-end p-0'>
                    <button className="w-[161px] h-11 px-8 py-4 rounded border border-[#00183d] justify-center items-center gap-2 inline-flex text-base font-medium font-['SF Pro Display'] leading-normal" onClick={()=>{}}>Save Job </button>
                    <a className="w-[196px] h-11 px-8 py-4 bg-[#00183d] rounded justify-center items-center gap-2 inline-flex text-base font-medium font-['SF Pro Display'] leading-normal text-white" target='_blank' href={jobData.applicationUrl}>Apply now</a>
                   
        </div>
        
        
        
    </div>

</div>

    )

}

export default JobDetailsModal