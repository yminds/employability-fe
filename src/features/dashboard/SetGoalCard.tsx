import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import GoalList from "@/features/dashboard/GoalList";

const SetGoalCard: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleLinkClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent the default navigation behavior
        setIsOpen(true); // Open the dialog
    }

    return <>
        <div className="flex flex-col items-start gap-12 self-stretch">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="mentor" className="rounded-[9px] border border-black/10 bg-[#FFF] hover:border-[#8B5CF6]">
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
                <Link to="" className="rounded-[9px] border border-black/10 bg-[#FFF] hover:border-[#1FD167]"
                    onClick={handleLinkClick}>
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

                {/* Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="p-0 max-w-2xl max-h-[100vh] overflow-y-auto">
                        {/* Visually hidden title */}
                        <DialogTitle className="hidden">Define Your Custom Goal</DialogTitle>

                        <div className="flex items-center justify-center">
                            <div className="w-full inline-flex p-[42px] flex-col justify-center items-start gap-[40px]">
                                <div>
                                    <h2 className="text-gray-900 text-2xl font-medium leading-8 tracking-tight">Define Your Custom Goal</h2>
                                    <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide">Enter your goal and tailor your learning path.</p>
                                </div>

                                <form className="w-full flex flex-col items-start gap-8">
                                    <div className="flex flex-col items-start gap-3.5 w-full">
                                        <label htmlFor="goal" className="text-gray-900 text-base font-medium leading-5">
                                            What is your Goal?
                                        </label>
                                        <input
                                            type="text"
                                            id="goal"
                                            placeholder="e.g., Mobile App Developer"
                                            className="flex h-12 p-2 px-4 justify-between items-center self-stretch rounded-lg border border-black border-opacity-10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none"
                                        />
                                    </div>

                                    <div className="flex flex-col items-start gap-3.5 w-full">
                                        <label htmlFor="tech-stack" className="text-gray-900 text-base font-medium leading-5 flex flex-col items-start gap-1">
                                            Pick Your Tech Stack
                                            <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide">Select the technologies you'll be using for this goal</p>
                                        </label>

                                        <div className="relative w-full">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <img
                                                    src="./src/assets/set-goal/mail.svg"
                                                    alt="Search"
                                                />
                                            </span>
                                            <input
                                                type="text"
                                                id="tech-stack"
                                                placeholder="Search"
                                                className="w-full flex h-12 p-2 px-4 justify-between items-center self-stretch rounded-lg border border-black border-opacity-10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none pl-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-3.5 w-full">
                                        <label htmlFor="description" className="text-gray-900 text-base font-medium leading-5">
                                            Description <span className="text-[#B3B3B3]">(Optional)</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            placeholder="e.g., Mern GEN AI engineer"
                                            className="w-full flex h-[150px] p-2 px-4 justify-between items-start rounded-[6px] border border-black/10 bg-[#FAFBFE] hover:border-[#1FD167] focus:border-[#1FD167] outline-none"
                                            rows={3}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="flex h-[44px] p-4 justify-center items-center gap-2 self-stretch rounded bg-[#10B754] text-white text-[16px] font-medium leading-[24px] tracking-[0.24px]"
                                    >
                                        Save Goal
                                    </button>
                                </form>

                            </div>
                        </div>

                    </DialogContent>
                </Dialog>
            </section>

            <section className="flex flex-col items-start gap-4 self-stretch">
                <h5 className="text-[#909091] text-[20px] font-medium leading-[26px] tracking[-0.2px]"
                >Predefined Goals</h5>
                <GoalList isLoading={false} error={false}/>

                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div> */}
            </section>

        </div>
    </>
};

export default SetGoalCard;