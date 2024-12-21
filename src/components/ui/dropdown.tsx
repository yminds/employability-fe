import React, { useState } from 'react';
interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  width?: string | number; // Width can be specified as string (e.g., '200px') or number
  dropdownWidth?: string | number; // Optional separate width for dropdown list
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  className = '',
  width = '100%',
  dropdownWidth,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (optionValue: string): void => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  // Convert width to string with 'px' if it's a number
  const buttonWidth = typeof width === 'number' ? `${width}px` : width;
  const listWidth = dropdownWidth 
    ? (typeof dropdownWidth === 'number' ? `${dropdownWidth}px` : dropdownWidth)
    : buttonWidth;

  return (
    <div className={`relative ${className}`} style={{ width: buttonWidth }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-6 text-left bg-white text-[#4C4C4C] text-sm font-medium flex items-center justify-between rounded-[8px] border border-[#DBDBDB] hover:bg-gray-50 focus:outline-none "
      >
        <span className=' w-[`${width}px`] font-medium leading-5 font-ubuntu text-sm truncate'>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <img className= {`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} src="src\assets\images\screen-setup\arrow_drop_down.svg" alt="" />
      </button>

      {isOpen && (
        <div 
          className="absolute mt-1 bg-white border-2 rounded shadow-lg z-10"
          style={{ width: listWidth }}
        >
          <ul className="p-2 max-h-60 overflow-auto flex flex-col items-start no-scrollbar">
            <li
              onClick={() => handleSelect('')}
              className="w-full px-6 py-2 text-sm leading-5 font-ubuntu rounded hover:bg-[#DBDBDB] cursor-pointer"
            >
              {placeholder}
            </li>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full px-6 py-2 text-sm font-ubuntu leading-5 rounded truncate hover:bg-[#DBDBDB] cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;