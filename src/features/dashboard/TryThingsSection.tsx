import React from "react";
import { useNavigate } from "react-router-dom";
import AddPictureimg from '@/assets/dashboard/add_picture.svg';
import Addbioimg from '@/assets/dashboard/add_bio.svg';
import AddEducationImg from '@/assets/dashboard/add_education.svg';

const TryThingsSection: React.FC<{}> = ({ }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const handleLinkClick = (route: string) => {
        navigate(route); // Navigate to the specified route
    };

    const completionPercentage = 50;

    return <>
        <section className="flex flex-col items-start gap-4 self-stretch">
            <h5 className="text-[#000] text-[20px] font-medium leading-[26px] tracking[-0.2px]"
            >Complete your profile</h5>
            <div className="flex items-center gap-5 self-stretch">
                <div className="relative w-full bg-[#FAFAFA] rounded-full h-[6px]">
                <div className="bg-[#1FD167] h-[6px] rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                </div>
            </div>
            <p className="text-black text-base font-normal leading-6 tracking-[0.24px] font-sf-pro mb-2">Employers are <span className="text-[#03963F]">3 times</span> more likely to hire a candidate with a complete profile.</p>

            <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full">
                <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                >
                    <div className="h-[100px]">
                        <img
                            src={AddPictureimg}
                            alt="Skills"
                            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <p className="text-gray-500 text-base font-normal leading-6 tracking-wide font-sf-pro">Prepare for real interviews by practicing with AI-driven questions.</p>
                    </div>

                    <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide font-sf-pro" onClick={() => handleLinkClick("/user-profile")}>Add Profile Picture</button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                >
                    <div className="h-[100px]">
                        <img
                            src={Addbioimg}
                            alt="Project"
                            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <p className="text-gray-500 text-base font-normal leading-6 tracking-wide font-sf-pro">Add a bio highlighting your skills and expertise</p>
                    </div>

                    <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide font-sf-pro" onClick={() => handleLinkClick("/user-profile")}>Add Bio</button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                >
                    <div className="h-[100px]">
                        <img
                            src={AddEducationImg}
                            alt="Practice"
                            className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <p className="text-gray-500 text-base font-normal leading-6 tracking-wide font-sf-pro">Start adding projects that showcase your expertise and creativity.</p>
                    </div>

                    <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide font-sf-pro" onClick={() => handleLinkClick("/user-profile")}>Add Education</button>
                </div>
            </div>
        </section>
    </>
};

export default TryThingsSection;