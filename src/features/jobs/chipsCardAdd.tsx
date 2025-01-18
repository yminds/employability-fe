import React from "react";


import addIcon from '@/assets/jobs/add.svg'
interface ChipsCardProps{
    itemList:string[];
    selectItem:(item:string)=>void;
}


const ChipsCardAdd:React.FC<ChipsCardProps>=(props)=>{
    
    const {itemList,selectItem}=props;
    


    return(

        <div className="">
            <ul className="flex flex-wrap gap-3 w-full">
                {itemList.map((item, index) => (
                    <li key={index} className="h-10 px-4 py-2 bg-[#fafbfe] rounded-[35px] border border-black/10 justify-start items-center gap-2 inline-flex"> 
                        <span className="text-[#414347] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tigh"> {item}</span> 
                        <img src={addIcon} onClick={()=>selectItem(item)}></img>     
                    </li>
                ))} 
                
            </ul>

        </div>
    )
}






export default ChipsCardAdd