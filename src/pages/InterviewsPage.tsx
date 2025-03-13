import InterviewContainer from '@/features/interview/Interviews';
import React from 'react';


const InterviewsPage: React.FC = () => {
  return (
    <div className="flex w-full h-screen justify-center sm:overflow-y-auto">
      <main className=" flex-col bg-[#F5F5F5] w-[95%] max-w-[1800px] p-5 h-full sm:p-0">
        <InterviewContainer />
      </main>
    </div>
  );
};

export default InterviewsPage;