import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApiSlice";
import { Button } from "@/components/elements/button";

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
    <div className="flex flex-row w-full justify-center h-screen items-center bg-gray-50 dark:bg-gray-800">
      <div className="rounded-xl flex flex-row h-3/4 w-[1024px] tablet:w-3/4 mobile:w-full mobile:mx-4 bg-white">
        <div className="p-12 rounded-r-xl w-full flex items-start flex-col justify-center dark:bg-gray-900">
          <form
            className="space-y-4 md:space-y-6 mt-6 w-full"
            onSubmit={handleLogin}
          >
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Log in to platform
            </h1>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
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
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                placeholder="Enter your password"
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="my-5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2"></div>
                <span
                  className="font-medium text-xs text-blue-700 cursor-pointer"
                  onClick={() => navigate("/login/forget-password")}
                >
                  Lost password?
                </span>
              </div>
              <Button type="submit" className="text-sm font-sans font-medium">
                Log In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
