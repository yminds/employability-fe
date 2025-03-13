import React from 'react';
import MockInterviewsList from '@/components/mock-interview/MockInterviewListing';
const MockInterviewsPage: React.FC = () => {
  return (
    <div className="flex w-full h-screen justify-center sm:overflow-y-auto">
      <main className=" flex-col bg-[#F5F5F5] w-[95%] max-w-[1800px] p-5 h-full sm:p-0">
        <MockInterviewsList/>
      </main>
    </div>
  );
};

export default MockInterviewsPage;
