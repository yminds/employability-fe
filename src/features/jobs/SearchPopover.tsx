import React, { useState } from "react";

import arrowDownIcon from "@/assets/jobs/arrowDown.svg";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

interface SearchPopoverProps {
  onInputChange: (search: string) => void;
  options: string[];
  onSelect: (item: string) => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  onInputChange,
  options,
  onSelect,
}) => {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onInputChange(value);
  };

  return (
    <div className="w-full ">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <div className="w-full  flex justify-end ">
            <button className="p-2 bg-white rounded-md hover:bg-gray-300">
              <img src={arrowDownIcon} alt="Dropdown" className="h-4 w-4" />
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className=" m-0 w-full  p-4  bg-white shadow-md rounded-lg border border-gray-200 z-[56] ">
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
            value={search}
            onChange={handleInputChange}
          />
          <ul className="mt-2 w-full">
            {options.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchPopover;
