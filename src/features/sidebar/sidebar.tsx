import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BadgeCheck, Menu, MoreVertical, Power } from "lucide-react"; // Import Menu icon from lucide-react
import LogoIcon from "../../assets/sidebar/logo.svg";
import DashboardIcon from "../../assets/sidebar/dashboard.svg";
import MentorIcon from "../../assets/sidebar/mentor.svg";
import ProfileIcon from "../../assets/sidebar/profile.svg";
import SkillsIcon from "../../assets/sidebar/skills.svg";
import ProjectsIcon from "../../assets/sidebar/projects.svg";
import InterviewsIcon from "../../assets/sidebar/interviews.svg";
import JobsIcon from "../../assets/sidebar/jobs.svg";
import CloseIcon from "../../assets/sidebar/left_panel_close.svg";
import OpenIcon from "../../assets/sidebar/left_panel_open.svg";
import { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutConfirmationModal from "@/components/modal/LogoutConfirmationModal";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility on small screens
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const getActiveClass = (path: string) => {
    return window.location.pathname === path
      ? "text-[#10B754]"
      : "text-[#68696B]";
  };

  const renderIcon = (Icon: string, path: string) => {
    return window.location.pathname === path ? (
      <img
        src={Icon || "/placeholder.svg"}
        alt=""
        style={{
          filter:
            "invert(38%) sepia(93%) saturate(515%) hue-rotate(98deg) brightness(95%) contrast(92%)",
        }}
      />
    ) : (
      <img
        src={Icon || "/placeholder.svg"}
        alt=""
        style={{
          filter: "invert(42%) sepia(5%) saturate(20%) hue-rotate(180deg)",
        }}
      />
    );
  };

  const user_name = useSelector((state: RootState) => state.auth.user?.name);
  const user_email = useSelector((state: RootState) => state.auth.user?.email);
  const user_profile_image = useSelector(
    (state: RootState) => state.auth.user?.profile_image
  );

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="relative group">
      <aside
        className={`bg-white shadow-md h-screen p-8 px-4 justify-between flex-shrink-0 flex flex-col items-start gap-[40px] self-stretch overflow-y-auto overflow-x-hidden scrollbar-default transition-all ${
          isCollapsed ? "w-20" : "w-52"
        } sm:hidden`}
      >
        <Link
          to="/"
          className={`flex items-center gap-2 self-stretch ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <img
            src={LogoIcon || "/placeholder.svg"}
            alt=""
            className="w-[29px] h-[26px]"
          />
          {!isCollapsed && (
            <div className="text-[#001630] font-ubuntu text-base font-bold">
              <span>Employ</span>
              <span className="text-[#0AD472]">Ability.AI</span>
            </div>
          )}
        </Link>
        <nav className="flex-1 w-full">
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/"
                )}`}
              >
                {renderIcon(DashboardIcon, "/")}
                {!isCollapsed && <span className="text-body2">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/mentor"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/mentor"
                )}`}
              >
                {renderIcon(MentorIcon, "/mentor")}
                {!isCollapsed && <span className="text-body2">Mentor</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/user-profile"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/user-profile"
                )}`}
              >
                {renderIcon(ProfileIcon, "/user-profile")}
                {!isCollapsed && <span className="text-body2">Profile</span>}
              </Link>
            </li>

            <div
              className={`h-1 pt-4 border-b-[1px] border-b-[rgba(0,0,0,0.10)] ${
                isCollapsed ? "" : ""
              }`}
            ></div>

            {/* {!isCollapsed && (
              <label className="flex p-2 pt-4 px-4 text-gray-400 text-sm font-medium normal-case">
                Career
              </label>
            )} */}
            <li>
              <Link
                to="/skills"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/skills"
                )}`}
              >
                {renderIcon(SkillsIcon, "/skills")}
                {!isCollapsed && <span className="text-body2">Skills</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/projects"
                )}`}
              >
                {renderIcon(ProjectsIcon, "/projects")}
                {!isCollapsed && <span className="text-body2">Projects</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/interviews"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/interviews"
                )}`}
              >
                {renderIcon(InterviewsIcon, "/interviews")}
                {!isCollapsed && <span className="text-body2">Interviews</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/jobs"
                )}`}
              >
                {renderIcon(JobsIcon, "/jobs")}
                {!isCollapsed && <span className="text-body2">Jobs</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-6 w-full">
          <div
            className={`relative ${
              isCollapsed
                ? "flex justify-center"
                : "p-4 rounded-[12px] border border-[#f5f5f5] bg-white"
            }`}
          >
            <div className="flex flex-col items-start">
              <div className="relative">
                {user_profile_image ? (
                  <img
                    src={user_profile_image || "/placeholder.svg"}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#0ad472] flex items-center justify-center text-white text-lg font-semibold">
                    {user_name ? user_name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-[2px]">
                  <BadgeCheck className="w-4 h-4 text-[#0ad472]" />
                </div>
              </div>

              {!isCollapsed && (
                <div className="mt-3">
                  <p className="text-[#333333] text-sub-header">{user_name}</p>
                  <p className="text-[#909091] text-[14px] leading-5 tracking-[0.03em] font-dm-sans truncate max-w-[150px]">
                    {user_email}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 hover:bg-transparent"
                  >
                    <MoreVertical className="h-5 w-5 text-[#b3b3b3]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[100px]">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#68696B] text-body2 focus:cursor-pointer focus:bg-white"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </aside>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-8 right-[-30px] p-1 bg-white rounded-md focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:hidden"
      >
        {isCollapsed ? (
          <img src={OpenIcon || "/placeholder.svg"} alt="Expand" />
        ) : (
          <img src={CloseIcon || "/placeholder.svg"} alt="Collapse" />
        )}
      </button>
      <div className="sm:flex sm:items-center sm:justify-between sm:bg-white sm:shadow-md sm:p-4 sm:px-6 hidden">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={LogoIcon || "/placeholder.svg"}
            alt=""
            className="w-[29px] h-[26px]"
          />
          <div className="text-[#001630] font-ubuntu text-base font-bold">
            <span>Employ</span>
            <span className="text-[#0AD472]">Ability.AI</span>
          </div>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility
          className="p-2 bg-white rounded-md focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:flex sm:flex-col sm:bg-white sm:shadow-md sm:p-4 sm:px-6 hidden">
          <nav className="flex-1 w-full">
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/"
                  )}`}
                >
                  {renderIcon(DashboardIcon, "/")}
                  <span className="text-body2">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/mentor"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/mentor"
                  )}`}
                >
                  {renderIcon(MentorIcon, "/mentor")}
                  <span className="text-body2">Mentor</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/user-profile"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/user-profile"
                  )}`}
                >
                  {renderIcon(ProfileIcon, "/user-profile")}
                  <span className="text-body2">Profile</span>
                </Link>
              </li>

              <div
                className={`h-1 pt-4 border-b-[1px] border-b-[rgba(0,0,0,0.10)]`}
              ></div>

              <label className="flex p-2 pt-4 px-4 text-gray-400 text-sm font-medium normal-case">
                Career
              </label>
              <li>
                <Link
                  to="/skills"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/skills"
                  )}`}
                >
                  {renderIcon(SkillsIcon, "/skills")}
                  <span className="text-body2">Skills</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/projects"
                  )}`}
                >
                  {renderIcon(ProjectsIcon, "/projects")}
                  <span className="text-body2">Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/interviews"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/interviews"
                  )}`}
                >
                  {renderIcon(InterviewsIcon, "/interviews")}
                  <span className="text-body2">Interviews</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/jobs"
                  )}`}
                >
                  {renderIcon(JobsIcon, "/jobs")}
                  <span className="text-body2">Jobs</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <LogoutConfirmationModal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default Sidebar;
