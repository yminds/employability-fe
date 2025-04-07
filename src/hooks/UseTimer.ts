import React from "react";

interface IUseTimer {
  time: number;
  type: string;
}
const UseTimer = ({ time, type }: IUseTimer) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return {
    formattedTime,
  };
};


export default UseTimer;
