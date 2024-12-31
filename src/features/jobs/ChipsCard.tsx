import React from "react";


import closesvg from './svgs/close.svg'
interface ChipsCardProps{
    itemList:string[];
    setItemList:any;
}


const ChipsCard:React.FC<ChipsCardProps>=(props)=>{
    
    const {itemList,setItemList}=props;


    const removeitem=(item:string)=>{
        setItemList(itemList.filter((i)=>i!=item));

    }


    return(


        <div >
            <ul className="flex flex-wrap gap-3 ">
                {itemList.map((item, index) => (
                    <li id={index.toString()} className="h-9 px-3 py-1.5 bg-[#fafbfe] rounded-[10px] border border-[#03963e] justify-start items-center gap-2 inline-flex"> 
                        <span className="text-[#03963e]"> {item}</span> 
                        <img src={closesvg} onClick={()=>removeitem(item)}></img>     
                    </li>
                ))} 
                
            </ul>

        </div>
    )
}






export default ChipsCard