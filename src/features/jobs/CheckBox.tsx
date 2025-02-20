import React, { useEffect } from "react";

interface item {
  label: string;
  value: string;
}

interface CheckBoxProps {
  itemList: item[];
  selected: string | string[];
  onSelected: (selected: string) => void;
  multiselect: Boolean;
}

export default function CheckBox(props: CheckBoxProps) {
  const { itemList, selected, onSelected, multiselect } = props;

  return (
    <div className="flex flex-col h-full w-full gap-3 justify-start">
      {itemList.map((item, index) => {
        return (
          <div
            onClick={(e) => {
              onSelected(item.value);
            }}
            key={index}
            className="flex flex-row gap-2 h-full"
          >
            <input
              type="checkbox"
              value={item.value}
              key={index}
              checked={
                multiselect
                  ? selected.includes(item.value)
                  : item.value == selected
              }
            />
            <label className="text-[#67696b] text-base font-normal font-['SF Pro Display'] leading-normal tracking-tight">
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}
