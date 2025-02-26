import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BadgeCheck, Menu, MoreVertical, Power } from "lucide-react";
import LogoIcon from "../../assets/sidebar/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutConfirmationModal from "@/components/modal/LogoutConfirmationModal";
import { RootState } from "@/store/store";

const EmployerSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const getActiveClass = (path: string) => {
    return window.location.pathname === path
      ? "text-[#10B754]"
      : "text-[#68696B]";
  };

  const renderIcon = (Icon: JSX.Element, path: string) => {
    return (
      <div className={`w-5 h-5 ${getActiveClass(path)}`}>
        {Icon}
      </div>
    );
  };

 const user_name = useSelector((state: RootState) => state.employerAuth.employer?.employerName);
    const user_email = useSelector((state: RootState) => state.employerAuth.employer?.email);
    const user_profile_image = useSelector(
      (state: RootState) => state.employerAuth.employer?.profile_image
    );

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/employer/login";
  };

  return (
    <div className="relative group">
      <aside
        className={`bg-white shadow-md h-screen p-8 px-4 justify-between flex-shrink-0 flex flex-col items-start gap-[40px] self-stretch overflow-y-auto overflow-x-hidden scrollbar-default transition-all ${
          isCollapsed ? "w-20" : "w-64"
        } sm:hidden`}
      >
        <Link
          to="/employer"
          className={`flex items-center gap-2 self-stretch ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <img
            src={LogoIcon}
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
                to="/employer"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/employer"
                )}`}
              >
                {renderIcon(
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z"/>
                  </svg>,
                  "/employer"
                )}
                {!isCollapsed && <span className="text-body2">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/employer/candidates"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/employer/candidates"
                )}`}
              >
                {renderIcon(
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>,
                  "/employer/candidates"
                )}
                {!isCollapsed && <span className="text-body2">Candidates</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/employer/jobs"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/employer/jobs"
                )}`}
              >
                {renderIcon(
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                  </svg>,
                  "/employer/jobs"
                )}
                {!isCollapsed && <span className="text-body2">Jobs</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/employer/profile"
                className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                  "/employer/profile"
                )}`}
              >
                {renderIcon(
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>,
                  "/employer/profile"
                )}
                {!isCollapsed && <span className="text-body2">Profile</span>}
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
                    src={user_profile_image}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#0ad472] flex items-center justify-center text-white text-lg font-semibold">
                    {user_name ? user_name.charAt(0).toUpperCase() : "E"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-[2px]">
                  <BadgeCheck className="w-4 h-4 text-[#0ad472]" />
                </div>
              </div>

              {!isCollapsed && (
                <div className="mt-3">
                  <p className="text-[#333333] text-sub-header">{user_name}</p>
                  <p className="text-[#909091] text-body2 truncate max-w-[180px]">
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

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-8 right-[-30px] p-1 bg-white rounded-md focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:hidden"
      >
        {isCollapsed ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div className="sm:flex sm:items-center sm:justify-between sm:bg-white sm:shadow-md sm:p-4 sm:px-6 hidden">
        <Link to="/employer" className="flex items-center gap-2">
          <img
            src={LogoIcon}
            alt=""
            className="w-[29px] h-[26px]"
          />
          <div className="text-[#001630] font-ubuntu text-base font-bold">
            <span>Employ</span>
            <span className="text-[#0AD472]">Ability.AI</span>
          </div>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-white rounded-md focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:flex sm:flex-col sm:bg-white sm:shadow-md sm:p-4 sm:px-6 hidden">
          <nav className="flex-1 w-full">
            <ul className="space-y-3">
              {/* Mobile menu items - same as desktop */}
              <li>
                <Link
                  to="/employer"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex p-2 px-4 items-center gap-3 self-stretch rounded-[6px] hover:bg-[#DBFFEA] hover:text-[#10B754] ${getActiveClass(
                    "/employer"
                  )}`}
                >
                  {renderIcon(
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13z"/>
                    </svg>,
                    "/employer"
                  )}
                  <span className="text-body2">Dashboard</span>
                </Link>
              </li>
              {/* Add other mobile menu items similarly */}
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

export default EmployerSidebar;