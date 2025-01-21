import React from 'react';
import { useTimer } from 'react-timer-hook';
import TimerIcon from './TimerIcon';

interface QuestionHeaderProps {
  questionNumber: number;
  timeLimit: number;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ questionNumber, timeLimit }) => {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + timeLimit);

  const { minutes, seconds } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("Time's up!"),
  });

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Calculate progress percentage
  const remainingSeconds = minutes * 60 + seconds;
  const progress = (remainingSeconds / timeLimit) * 100;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1 items-baseline">
          <span className="text-black font-medium">Q{questionNumber}</span>
          <span className="text-[#B3B3B3] font-normal text-xs">/10</span>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <TimerIcon />
          <span className="text-black font-medium">{formattedTime}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-[#E3F5EC] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#25DE84] transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionHeader; 