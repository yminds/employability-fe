import React from "react";
import { useNavigate } from "react-router-dom";

const TryThingsSection: React.FC<{}> = ({ }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const handleLinkClick = (route: string) => {
        navigate(route); // Navigate to the specified route
    };

    return <>
        <section className="flex flex-col items-start gap-4 self-stretch">
            <h5 className="text-[#68696B] text-[20px] font-medium leading-[26px] tracking[-0.2px]"
            >Try these things out</h5>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                >
                    <div className="h-[100px]">
                        <img
                            src="./src/assets/dashboard/skills.svg"
                            alt="Skills"
                            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <h3 className="text-[#202326] text-base font-medium leading-5"
                        >Showcase Your Skills</h3>
                        <p className="text-gray-500 text-base font-normal leading-6 tracking-wide font-sf-pro">Highlight top skills to help us match you with the right opportunities.</p>
                    </div>

                    <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide font-sf-pro" onClick={() => handleLinkClick("/skills")}>Add Skills</button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                >
                    <div className="h-[100px]">
                        <img
                            src="./src/assets/dashboard/project.svg"
                            alt="Project"
                            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <h3 className="text-[#202326] text-base font-medium leading-5"
                        >Build Your Portfolio</h3>
                        <p className="text-gray-500 text-base font-normal leading-6 tracking-wide font-sf-pro">Start adding projects that showcase your expertise and creativity.</p>
                    </div>

                    <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide font-sf-pro" onClick={() => handleLinkClick("/projects")}>Add a Project</button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                >
                    <div className="h-[100px]">
                        <img
                            src="./src/assets/dashboard/practice.svg"
                            alt="Practice"
                            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <h3 className="text-[#202326] text-base font-medium leading-5"
                        >Take a Mock Interview</h3>
                        <p className="text-gray-500 text-base font-normal leading-6 tracking-wide font-sf-pro">Prepare for real interviews by practicing with AI-driven questions.</p>
                    </div>

                    <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide font-sf-pro" onClick={() => handleLinkClick("/interviews")}>Start Practice</button>
                </div>
            </div>
        </section>
    </>
};

export default TryThingsSection;