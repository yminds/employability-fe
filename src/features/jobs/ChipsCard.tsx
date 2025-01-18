import React from "react";

import closeIcon from "@/assets/jobs/close.svg"

import arrowDownIcon from '@/assets/jobs/arrowDown.svg';
import { Any } from "react-spring";
interface ChipsCardProps{
    itemList:string[];
    setItemList:any;
    onInputChange:(search:string)=>void;
}


const ChipsCard:React.FC<ChipsCardProps>=(props)=>{
    
    const {itemList,setItemList,onInputChange}=props;


    const removeitem=(item:string)=>{
        setItemList(itemList.filter((i)=>i!=item));

    }
    const handleInputChange=(e:any)=>{
        const search=e.target.value;
        if (search.length>0){
            onInputChange(search);
        }
    }

    return(


        <div className="flex flex-col  items-center gap-2 w-full">
             
            <ul className="flex flex-wrap flex-1 gap-3 w-full items-stretch">
                {itemList.map((item, index) => (
                    <li key={index} className="h-9 px-3 py-1.5 bg-[#fafbfe] rounded-[10px] border border-[#03963e] justify-start items-center gap-2 inline-flex"> 
                        <span className="text-[#03963e]"> {item}</span> 
                        <img src={closeIcon} onClick={()=>removeitem(item)}></img>     
                    </li>
                ))} 

                 <div className="flex flex-row flex-grow items-center justify-between gap-2 ">
                    <input className='w-full p-0  focus:outline-none inline-block' onChange={handleInputChange}></input>
                    <img src={arrowDownIcon} className=" h-4 w-4  inline-block "></img>
                </div>
            </ul>

           
            
        </div>
    )
}






export default ChipsCard