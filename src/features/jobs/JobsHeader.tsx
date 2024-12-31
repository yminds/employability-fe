import React from "react"
import { useState } from "react";

interface JobsHeaderProps {
    test:string;
    hello:number;
}


const JobsHeader:React.FC<JobsHeaderProps> = (props) => {
    
    const [selectedCategory,setselectedCategory] = useState('All');



    return (  
        <div className="w-full jobsheader flex flex-col gap-4 ">

            <section id="title and back btn " className="flex flex-row gap-4">
                <div className="w-[30px] h-[30px] bg-white rounded-3xl border border-black/10 flex-col justify-center items-center gap-2.5 inline-flex" >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="Vector 84" d="M0.505025 5.50503C0.231658 5.77839 0.231658 6.22161 0.505025 6.49497L4.9598 10.9497C5.23316 11.2231 5.67638 11.2231 5.94975 10.9497C6.22311 10.6764 6.22311 10.2332 5.94975 9.9598L1.98995 6L5.94975 2.0402C6.22311 1.76684 6.22311 1.32362 5.94975 1.05025C5.67638 0.776886 5.23316 0.776886 4.9598 1.05025L0.505025 5.50503ZM1 6.7H12V5.3H1V6.7Z" fill="#666666"/>
                    </svg>
                </div>
                <div className="w-[390px] text-black text-xl font-medium font-['Ubuntu'] leading-relaxed"><p></p>Jobs</div>
            </section>
        
            <section id="search and filters " className="flex flex-row gap-4 justify-between items-center ">
                
                <div  id='job categories' className="bg-white   p-[5px] rounded-md justify-start items-start gap-2.5 inline-flex">
                    <button 
                    onClick={()=>setselectedCategory('All')}
                    className={`py-1.5 px-2 rounded-[3px]  text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight ${selectedCategory=='All'?'bg-[#DBFFEA] text-[#10B754]':''} `}
                    >All</button>
                    <button 
                    onClick={()=>setselectedCategory('Suggested')}
                    className={`py-1.5 px-2 rounded-[3px] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight ${selectedCategory=='Suggested'?'bg-[#DBFFEA] text-[#10B754]':''}`}>Suggested</button>
                    <button 
                    onClick={()=>setselectedCategory('Active application')}
                    className={`py-1.5 px-2 rounded-[3px] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight ${selectedCategory=='Active application'?'bg-[#DBFFEA] text-[#10B754]':''}`}>Active applications</button>

                </div>

                <div id='search bar and filters ' className="flex flex-row gap-4">

                    <div id='searchbar' className="flex flex-row gap-4 items-center">
                        <img src='x'></img>
                        <input type="text" placeholder="Search" className=" rounded-[6px] font-['Ubuntu'] text-base text-normal leading-normal tracking-tight text-[#67696b]  bg-white p-5" />
                    
                    </div>
                
                </div>



            </section>
        </div>

        
    );
}

export default JobsHeader;