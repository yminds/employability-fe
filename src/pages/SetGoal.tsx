import React from "react";
import { Link } from "react-router-dom";

const SetGoal: React.FC = () => {
    return (
        <>
            <main>
                <div className="bg-gray-100 min-h-screen p-6">
                    <div className="max-w-5xl mx-auto rounded-[12px] bg-white flex p-[42px] flex-col items-start gap-[32px]">
                        <div className="flex flex-col items-start gap-1 flex-1">
                            <h2 className="text-[#1A1A1A] text-[24px] font-medium leading-[32px] tracking[-0.24px]">Set Your Goal</h2>
                            <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide">Choose your goal and get tailored resources to help you succeed.</p>
                        </div>

                        <div className="flex flex-col items-start gap-12 self-stretch">
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link to="" className="rounded-[9px] border border-black/10 bg-[#FFF] hover:border-[#8B5CF6]">
                                    <div className="flex flex-col items-start gap-8 relative p-6">
                                        <div className="h-[50px]">
                                            <img
                                                src="./src/assets/set-goal/career_goal.svg"
                                                alt="Skills"
                                                className="absolute top-0 start-0"
                                            />
                                        </div>

                                        <div className="flex flex-col items-start gap-3.5 self-stretch">
                                            <h3 className="text-gray-800 text-lg font-medium leading-6 tracking-tight"
                                            >Career Mentor</h3>
                                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Unsure where to start? Let AI guide you to the perfect career goal.</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="" className="rounded-[9px] border border-black/10 bg-[#FFF] hover:border-[#1FD167]">
                                    <div className="flex flex-col items-start gap-8 relative p-6">
                                        <div className="h-[50px]">
                                            <img
                                                src="./src/assets/set-goal/custom_goal.svg"
                                                alt="Skills"
                                                className="mt-3"
                                            />
                                        </div>

                                        <div className="flex flex-col items-start gap-3.5 self-stretch">
                                            <h3 className="text-gray-800 text-lg font-medium leading-6 tracking-tight"
                                            >Create Custom Goal</h3>
                                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Define your own career path and learning journey.</p>
                                        </div>
                                    </div>
                                </Link>
                            </section>

                            <section className="flex flex-col items-start gap-4 self-stretch">
                                <h5 className="text-[#909091] text-[20px] font-medium leading-[26px] tracking[-0.2px]"
                                >Predefined Goals</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Link to="" className="rounded-[9px] border border-black/10 bg-[#FCFCFC] hover:border-[#1FD167]">
                                        <img
                                            src="./src/assets/dashboard/jobs_banner.png"
                                            alt="Jobs"
                                            className="rounded-e-[9px] rounded-s-[9px] rounded-b-none w-full"
                                        />
                                        <div className="flex flex-col p-6 justify-center items-start gap-2 self-stretch">
                                            <h3 className="text-gray-800 text-base font-medium leading-5">Full Stack Developer</h3>
                                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Build both the front-end and back-end of web apps.</p>
                                        </div>
                                    </Link>
                                    <Link to="" className="rounded-[9px] border border-black/10 bg-[#FCFCFC] hover:border-[#1FD167]">
                                        <img
                                            src="./src/assets/dashboard/jobs_banner.png"
                                            alt="Jobs"
                                            className="rounded-e-[9px] rounded-s-[9px] rounded-b-none w-full"
                                        />
                                        <div className="flex flex-col p-6 justify-center items-start gap-2 self-stretch">
                                            <h3 className="text-gray-800 text-base font-medium leading-5">Front-End Developer</h3>
                                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Design and build interactive user interfaces.</p>
                                        </div>
                                    </Link>
                                    <Link to="" className="rounded-[9px] border border-black/10 bg-[#FCFCFC] hover:border-[#1FD167]">
                                        <img
                                            src="./src/assets/dashboard/jobs_banner.png"
                                            alt="Jobs"
                                            className="rounded-e-[9px] rounded-s-[9px] rounded-b-none w-full"
                                        />
                                        <div className="flex flex-col p-6 justify-center items-start gap-2 self-stretch">
                                            <h3 className="text-gray-800 text-base font-medium leading-5">Backend Developer</h3>
                                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Develop server-side logic and manage databases.</p>
                                        </div>
                                    </Link>
                                </div>
                            </section>

                        </div>

                    </div>
                </div>
            </main>
        </>
    );
};

export default SetGoal;
