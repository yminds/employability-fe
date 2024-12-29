
import React from "react";



interface GoalsWindowProps {
    goals: string[];
    currentStatus: string;
}


const GoalsWindow: React.FC<GoalsWindowProps> = () => {
    return (
        <div className="w-full bg-white p-[34px] pb-[32px] flex flex-col justify-start gap-6 items-stretch rounded-[9px]">
            {/* goals */}
            <div className=" flex flex-col  items-stretch text-left p-4">
                <p className="text-[14px] ml-1 leading-6 font-nornmal font-['SFPro Display'] text-[#909091]">Goals</p>
                <select className="text-black text-lg font-medium font-['Ubuntu'] leading-snug">
                    <option>Frontend Developer</option>
                </select>
            
            </div>
            {/* current job status */}
            <div className="flex flex-col gap-4 items-stretch ">
                <p className="text-black text-base font-medium font-['Ubuntu'] leading-snug  "> Current Status</p>
                <select className=" ring-1 rounded-[6px] font-['Ubuntu'] ring-black/10 bg-[#FAFBFE] px-2 py-4" >
                    <option>Actively seeking job</option>
                    <option>Not unemployed for job</option>
                    <option>Not looking for job</option>    
                </select>            
            </div>
        </div>
    )
}


interface MyJobsProps {
    applied:number;
    intervied:number;
    shortlisted:number;
}
 
const MyJobs: React.FC<MyJobsProps> = (Myjobs) => {
    const {applied,intervied,shortlisted}= Myjobs;

    return (
        <div className="w-full bg-white p-[42px] pb-[32px] flex flex-col gap-6 rounded-[9px]" >
            <h2 className="text-black text-base font-medium font-['Ubuntu'] leading-snug">My Jobs</h2>
            <section className="flex flex-col gap-5 ">

                <div className="flex flex-row gap-4 items-left">
                    <div className="w-12 h-12 py-[9px] px-[10px]  bg-neutral-50/95 rounded-[48px] border border-black/5 justify-center items-center gap-2.5 inline-flex ">
                    <img src='https://facebook.com/favicon.ico' className=" w-6 h-6" ></img>
                    </div>
                    <div>
                    <p className="text-black text-base font-medium font-['Ubuntu'] leading-snug">{applied}</p>
                    <p className="text-[#414347] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight">Applied</p>
                    </div> 
                </div>

                <div className="flex flex-row gap-4 items-left">
                    <div className="w-12 h-12 py-[9px] px-[10px]  bg-neutral-50/95 rounded-[48px] border border-black/5 justify-center items-center gap-2.5 inline-flex ">
                    <img src='https://facebook.com/favicon.ico' className=" w-6 h-6" ></img>
                    </div>
                    <div>
                    <p className="text-black text-base font-medium font-['Ubuntu'] leading-snug">{intervied}</p>
                    <p className="text-[#414347] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight">Interviewed</p>
                    </div> 
                </div>

                <div className="flex flex-row gap-4 items-left">
                    <div className="w-12 h-12 py-[9px] px-[10px]  bg-neutral-50/95 rounded-[48px] border border-black/5 justify-center items-center gap-2.5 inline-flex ">
                    <img src='https://facebook.com/favicon.ico' className=" w-6 h-6" ></img>
                    </div>
                    <div>
                    <p className="text-black text-base font-medium font-['Ubuntu'] leading-snug">{shortlisted}</p>
                    <p className="text-[#414347] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight">Shortlisted</p>
                    </div> 
                </div>
            </section>
        </div>
        
    );
}
 



const goals=['Frontend Developer','Entereprenuer'];
const currentStatus='current unemployed';

const JobSideBar : React.FC= () => {
    return ( 
    <div className=" h-full w-full pt-[54px] flex flex-col gap-6 items-stretch">
    <GoalsWindow goals={goals} currentStatus={currentStatus} ></GoalsWindow>
    <MyJobs applied={2} intervied={3} shortlisted={4}></MyJobs>
    </div>
     );

}
 
export default JobSideBar;