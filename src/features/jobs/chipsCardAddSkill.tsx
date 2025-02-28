import type React from "react";
import addIcon from "@/assets/jobs/add.svg";

interface Skill {
  id: string;
  name: string;
}

interface ChipsCardSkillProps {
  itemList: Skill[];
  selectItem: (item: Skill) => void;
}

const ChipsCardAddSkill: React.FC<ChipsCardSkillProps> = (props) => {
  const { itemList, selectItem } = props;

  return (
    <div className="">
      <ul className="flex flex-wrap gap-3 w-full">
        {itemList.map((item, index) => (
          <li
            key={item.id || index}
            className="h-10 px-4 py-2 bg-[#fafbfe] rounded-[35px] border border-black/10 justify-start items-center gap-2 inline-flex hover:cursor-pointer"
            onClick={() => selectItem(item)}
          >
            <span className="text-[#414347] text-body2">{item.name}</span>
            <img src={addIcon || "/placeholder.svg"} alt="add"></img>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChipsCardAddSkill;
