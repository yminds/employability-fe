import MentorContainer from '@/components/mentor/MentorContainer';
import React from 'react';
import { useLocation } from 'react-router-dom';


const Mentor: React.FC = () => {
    const location = useLocation();
    const { skill,skillId, skillPoolId} = location.state;
  return (
    <div className="flex w-full h-screen justify-center sm:overflow-y-auto">
      <main className=" flex-col bg-[#F5F5F5] w-full h-screen sm:p-0 relative ">
        <MentorContainer skill={skill} skillId={skillId} skillPoolId={skillPoolId}/>
      </main>
    </div>
  );
};

export default Mentor;
