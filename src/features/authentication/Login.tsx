import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApiSlice";
import { Button } from "@/components/elements/button";

import logo from "@/assets/branding/logo.svg";
import heroImg from "@/assets/sign-up/carousel.png";
import arrow from '@/assets/skills/arrow.svg'

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isSuccess }] = useLoginMutation();
  const authState = useSelector((state: RootState) => state.auth);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email, password });
  };

  useEffect(() => {
    if (isSuccess || token) {
      navigate("/");
    }
  }, [isSuccess, authState]);

  return (
    <div className="flex h-screen  w-screen bg-gray-50 dark:bg-gray-800">
      <div className=" absolute top-5 left-10 w-1/4  h-1/4  z-10">
        <img src={logo} alt="" />
      </div>
      {/* Hero Image Section */}
      <div className="flex  w-1/2 justify-center items-center md:block md:p-0">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full max-h-screen md:h-screen object-cover md:object-cover hidden md:block"
        />
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center md:items-center p-6 md:p-12">
        <div className="h-[500px] w-[400px] max-w-lg justify-around  bg-white p-6 rounded-lg shadow-lg dark:bg-gray-900">
          <div className=" w-[90px]h-[50px] flex items-center gap-2">
            <img className="w-3 h-3" src={arrow} alt="" />
            <button
            onClick={() => navigate("/")}
            className="text-black hover:text-green-600"
            >
            Back
            </button>
          </div>
          <div>
            <form 
              className="space-y-4 md:space-y-6"
              onSubmit={handleLogin}
            >
                <h1 className="text-3xl font-bold text-start text-gray-900 dark:text-white md:text-2xl">
                  Log in to Your Account
                </h1>
                <div className="text-start space-y-4 mt-6">
                  <p className="text-sm text-gray-500">
                    New to Employability.AI?{" "}
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-primary-500 underline hover:text-green-600"
                      
                    >
                      Sign In
                    </button>
                  </p>
                </div>
                <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div>
                <input
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                </div>
            </form>
          </div>
          
          <div className="mt-5 h-11 flex justify-between items-center">
                <Button
                  type="submit"
                  className="w-full text-sm bg-[#10B754] font-sans font-medium hover:bg-green-600 text-white py-3 rounded-lg"
                >
                  Log In
                </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
