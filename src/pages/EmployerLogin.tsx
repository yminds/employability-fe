import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLoginMutation } from '@/api/employerApiSlice';

import logo from "@/assets/branding/logo.svg";
import man from "@/assets/sign-up/man.png";
import grid from "@/assets/sign-up/grid.svg";
import Mail from "@/assets/sign-up/mail.png";
import Password from "@/assets/sign-up/password.png";

export const EmployerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const result = await login({ email, password }).unwrap();
      if (result.success) {
        localStorage.setItem('employerToken', result.token);
        navigate('/employer');
      }
    } catch (err: any) {
      setError(err.data?.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-800">
      {/* Left Section */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        <img src={grid} alt="Grid Background" className="absolute inset-0 h-full w-full object-cover" />
        <img src={man} alt="Hero" className="absolute bottom-0 left-0 right-0 w-full object-contain" />
        <div className="absolute top-8 left-8 z-20">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="h-[84px] flex flex-col justify-around mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">Employer Login</h1>
              <p className="text-sm text-gray-500">
                New employer?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/employer/signup')}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Sign up
                </button>
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]">
                <AlertDescription className="text-[#ff3b30]">{error}</AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <input
                type="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img src={Mail} alt="Email Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            <div className="relative">
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img src={Password} alt="Password Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] flex justify-center items-center gap-2 px-8 py-4 
                bg-[#001630] text-white font-medium rounded-[4px] 
                hover:bg-[#002a54] transition-colors duration-200 ease-in-out"
              style={{
                boxShadow: "0px 10px 16px -2px rgba(6, 90, 216, 0.15)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};