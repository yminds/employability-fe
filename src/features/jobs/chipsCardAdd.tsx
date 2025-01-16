import React from "react";


import addIcon from '@/assets/jobs/add.svg'
interface ChipsCardProps{
    itemList:string[];
    selectItem:any;
}


const ChipsCardAdd:React.FC<ChipsCardProps>=(props)=>{
    
    const {itemList,selectItem}=props;
    


    return(

        <div className="">
            <ul className="flex flex-wrap gap-3 w-full">
                {itemList.map((item, index) => (
                    <li key={index} className="h-10 px-4 py-2 bg-[#fafbfe] rounded-[35px] border border-black/10 justify-start items-center gap-2 inline-flex"> 
                        <span className="text-[#03963e]"> {item}</span> 
                        <img src={addIcon} onClick={()=>selectItem(item)}></img>     
                    </li>
                ))} 
                
            </ul>

        </div>
    )
}






export default ChipsCardAdd