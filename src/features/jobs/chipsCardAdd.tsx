import React from "react";


import addsvg from './svgs/add.svg'
interface ChipsCardProps{
    itemList:string[];
    selectItem:any;
}


const ChipsCardAdd:React.FC<ChipsCardProps>=(props)=>{
    
    const {itemList,selectItem}=props;
    


    return(

        <div >
            <ul className="flex flex-wrap gap-3 ">
                {itemList.map((item, index) => (
                    <li id={index.toString()} className="-10 px-4 py-2 bg-[#fafbfe] rounded-[35px] border border-black/10 justify-start items-center gap-2 inline-flex"> 
                        <span className="text-[#03963e]"> {item}</span> 
                        <img src={addsvg} onClick={()=>selectItem(item)}></img>     
                    </li>
                ))} 
                
            </ul>

        </div>
    )
}






export default ChipsCardAdd