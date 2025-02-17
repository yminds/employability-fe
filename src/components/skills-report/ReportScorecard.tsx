import React from 'react';
import CircularProgress from '@/components/ui/circular-progress-bar'; 

interface ReportScoreProps {
  userName: string;
  userImg:string | undefined;
  goalName: string;
  ReportScore:number; 
  skill_icon:string
}

const ReportScore: React.FC<ReportScoreProps> = ({ userName, userImg, goalName , ReportScore, skill_icon }) => {

  const verifiedrating = ReportScore;

  return (
    <div className="bg-white flex flex-col w-[100%] rounded-lg  p-8 gap-6 md:mt-0 sm:mt-0">
      <div className="flex items-center gap-2">
        <div>
          <img className="w-[50px] h-[50px] rounded-full" src={userImg} alt="user" />
        </div>
        <div className='flex flex-col items-start'>
          <p className='text-[#414447] font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.2px]'>{userName}</p>
          <p className='text-[#909091]0 text-[14px] font-medium leading-[24px] tracking-[-0.2px]'>{goalName}</p>
        </div>
      </div>            

      {/* Employability Score Section */}
      <div className="p-4 w-[100%] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
          {/* Circular Progress Bar */}
          <CircularProgress progress={verifiedrating * 10} size={60} strokeWidth={6} showText={false} />
          <img className="absolute w-8 h-8" src={skill_icon} alt="short logo" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{verifiedrating > 0 ? verifiedrating.toFixed(2) : verifiedrating }
            <span className="text-2xl font-bold text-[#00000099]">/10</span>
          </p>
          <p className="text-gray-900 font-sf-pro-display text-lg font-medium leading-6 tracking-[0.27px]">Skill Score</p>
        </div>
      </div>
    </div>
  );
};

export default ReportScore;
