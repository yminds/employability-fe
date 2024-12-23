import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from '../../assets/sidebar/logo.svg';
import DashboardIcon from '../../assets/sidebar/dashboard.svg';
import MentorIcon from '../../assets/sidebar/mentor.svg';
import ProfileIcon from '../../assets/sidebar/profile.svg';
import SkillsIcon from '../../assets/sidebar/skills.svg';
import ProjectsIcon from '../../assets/sidebar/projects.svg';
import InterviewsIcon from '../../assets/sidebar/interviews.svg';
import JobsIcon from '../../assets/sidebar/jobs.svg';
import CloseIcon from '../../assets/sidebar/left_panel_close.svg';
import OpenIcon from '../../assets/sidebar/left_panel_open.svg';

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const getActiveClass = (path: string) => {
        return window.location.pathname === path ? 'bg-[#DBFFEA] text-[#10B754]' : '';
    };

    return (
        <div className="relative">
            <aside className={`bg-white shadow-md h-screen p-8 px-4 justify-between flex-shrink-0 flex flex-col items-start gap-[40px] self-stretch overflow-y-auto overflow-x-hidden transition-all ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <Link to="/" className={`flex items-center gap-2 self-stretch ${isCollapsed ? 'justify-center' : ''}`}>
                    <img src={LogoIcon} alt='' />
                    {!isCollapsed && (
                        <div className="text-[#001630] text-[20px] font-bold leading-normal">
                            <span>Employ</span>
                            <span className="text-[#0AD472]">Ability.AI</span>
                        </div>
                    )}
                </Link>
                <nav className="flex-1 w-full">
                    <ul className="space-y-3">
                        <li>
                            <Link to="/" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/')}`}>
                                <img src={DashboardIcon} alt='Dashboard' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Dashboard</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/mentor" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/mentor')}`}>
                                <img src={MentorIcon} alt='Mentor' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Mentor</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/profile')}`}>
                                <img src={ProfileIcon} alt='Profile' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Profile</span>}
                            </Link>
                        </li>

                        <div className={`h-1 pt-4 border-b-[1px] border-b-[rgba(0,0,0,0.10)] ${isCollapsed ? '' : ''}`}></div>

                        {!isCollapsed && <label className="flex p-2 pt-4 px-4 text-gray-400 text-sm font-medium normal-case">Career</label>}
                        <li>
                            <Link to="/skills" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/skills')}`}>
                                <img src={SkillsIcon} alt='Skills' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Skills</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/projects')}`}>
                                <img src={ProjectsIcon} alt='Projects' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Projects</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/interviews" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/interviews')}`}>
                                <img src={InterviewsIcon} alt='Interviews' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Interviews</span>}
                            </Link>
                        </li>
                        <li>
                            <Link to="/jobs" className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] ${getActiveClass('/jobs')}`}>
                                <img src={JobsIcon} alt='Jobs' />
                                {!isCollapsed && <span className="text-gray-500 text-base font-medium leading-normal">Jobs</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="mt-6 w-full">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'p-4 rounded-[6px] border border-[#F5F5F5] bg-white'}`}>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">Y</div>
                        {!isCollapsed && (
                            <div className="ml-3">
                                <p className="text-gray-800 text-base font-medium">Mathew Johns</p>
                                <p className="text-gray-400 text-xs font-medium">MJ1234@gmail.com</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-2 right-[-30px] p-1 bg-white rounded-md shadow-md focus:outline-none"
            >
                {isCollapsed ? <img src={OpenIcon} alt="Expand" /> : <img src={CloseIcon} alt="Collapse" />}
            </button>
        </div>
    );
};

export default Sidebar;