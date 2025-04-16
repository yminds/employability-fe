import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/landing/logos/logo-horizontal.svg";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 h-24 ">
        <nav className="container mx-auto flex items-center justify-between p-5 md:p-0">
          {/* Logo */}
          <img src={logo} className="h-8 md:h-auto md:px-24 md:py-8" alt="Logo" />

          {/* Desktop Buttons */}
          <div className="flex sm:hidden items-center gap-10">
            <Button
             onClick={()=> navigate("/employer")}
              variant="ghost"
              className="text-white/60 hover:text-white/80 font-normal text-base leading-6 tracking-[0.08px] p-0 hover:bg-transparent"
            >
              Employers
            </Button>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="rounded  text-white text-sm font-medium leading-5 tracking-[0.21px] border border-white px-8 py-2 flex justify-center items-center gap-2 hover:text-white/90 hover:bg-transparent bg-transparent"
            >
              Log In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className=" hidden sm:block text-foreground p-2 hover:bg-accent/10 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-0 h-screen bg-black z-40 flex flex-col">
          <div className="pt-24 px-4 flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white/80 font-normal text-base w-full py-3 bg-transparent hover:bg-transparent"
              onClick={toggleMenu}
            >
              Employers
            </Button>
            <Button
              className="rounded text-white text-sm font-medium border border-white w-full py-3 flex justify-center items-center gap-2 hover:text-white/90 hover:bg-transparent bg-transparent"
              onClick={toggleMenu}
            >
              Log In
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
