import React from 'react';

import brandLogo from '../../../public/logo.svg';


interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  locations:string[] ;
  skills:string[]
  status?: string;
  logo: string;
  salary?: string;
  minimumExperience:number;
}


interface JobCardProps {
  job: Job;
  preferedLocations:string[];
  userSkills:string[];
  userExperience:number;
}

const JobCard: React.FC<JobCardProps> = ({ job ,preferedLocations,userSkills,userExperience }) => {
  const {
    title,
    company,
    type,
    locations,
    skills,
    logo,
    salary,
    minimumExperience
  } = job;

  const requiredSkills=skills.length;
  const matchedSkills=skills.filter(skill=>userSkills.includes(skill)).length;
  const matchPercentage=  ((matchedSkills/skills.length)*100)
  const minimumMatchPercentage=60;
  const inpreferedLocations=preferedLocations.length?locations.some( loc=>preferedLocations.includes(loc)):true;

  return (
    <div className="bg-white py-[36px] px-[42px] flex flex-col gap-4 content-center w-full  rounded-[8px] items-stretch">
        <div className="flex flex-row  justify-between ">
          
          <div className=' flex flex-row gap-[14px] text-left'>
            <img className="w-[48px] h-[48px] px-[9px] py-[10px] rounded-full bg-gray-100 center " src={logo} alt="logo">
  
            </img>
          
            <div className="flex flex-col gap-[4px]">
              <p className="text-[16px] leading-[20px] font-medium">{title}</p>
              
              <div className="">
                <p className='text-base font-normal tracking-tight leading-normal text-[#414347]'>{company} {type && `• ${type}`} {salary && `• ${salary}` }</p>
                <p className='text-sm font-normal tracking-tight leading-normal text-[#67696b]'>{locations}</p>
                
              </div>
              
            </div>
          </div>

          <div className="flex flex-row gap-[32px] items-center">
            <div className="text-right  items-center">
              <p  className={` text-xl font-bold  leading-[18px] ${matchPercentage >= 60 ? "text-[#10b753]" : "text-[#aa040f]"} `} >  
                {matchPercentage}%
              </p>
              <p className="text-sm text-gray-600">match</p>
            </div>
              <div className='flex flex-col gap-4 items-stretch'>
                <button className="px-[20px] py-[8px] w-[141px] ring-1- h-10 border rounded text-base text-black leading-[0.24px] border-black/20  ">
                  Apply now
                </button>
              </div>
            </div>
        
        </div>

        
       
       {/* // jobs and skill match section */}
      <div className="h-[46px] px-6 py-2.5 bg-[#ddf8e8]/50 rounded-[9px] justify-start items-center  gap-2.5 inline-flex">
        <img className="w-[14.30px] h-[14.60px] " src={brandLogo} />
        <div className='flex flex-row gap-[3px]'>
          <span className="text-[#67696b] text-sm font-normal font-['SF Pro Display'] leading-normal tracking-tight">You have</span>
          <span className={`text-sm font-medium font-['SF Pro Display'] leading-normal tracking-tight ${matchPercentage>=minimumMatchPercentage ?'text-[#03963e]':'text-[#CF0C19]' } `}> {matchedSkills}/{requiredSkills} skills</span>
          <span className="text-[#67696b] text-sm font-normal font-['SF Pro Display'] leading-normal tracking-tight">required for this job.</span>
          

            { (!inpreferedLocations || userExperience<minimumExperience) && 
              <>
              <span className="text-[#67696b] text-sm font-normal font-['SF Pro Display'] leading-normal tracking-tight">This job is </span> 

               { !inpreferedLocations && <span className="text-[#cf0c19] text-sm font-medium font-['SF Pro Display'] leading-normal tracking-tight">not in preferred locations </span>}

                { !inpreferedLocations && userExperience<minimumExperience && <span className="text-[#cf0c19] text-sm font-medium font-['SF Pro Display'] leading-normal tracking-tight">and </span>}
  
                { userExperience<minimumExperience && <span className="text-[#cf0c19] text-sm font-medium font-['SF Pro Display'] leading-normal tracking-tight">for someone {minimumExperience-userExperience}+ years experienced than you</span>}
              </>

            }

          
        </div>
      
      </div>


       
    </div>
  );
};

export default JobCard;
