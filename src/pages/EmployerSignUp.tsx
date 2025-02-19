import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSignupMutation, useLoginMutation } from '@/api/employerApiSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import User from '@/assets/sign-up/user.png';
import Mail from '@/assets/sign-up/mail.png';
import Password from '@/assets/sign-up/password.png';
import logo from '@/assets/branding/logo.svg';
import man from '@/assets/sign-up/man.png';
import grid from '@/assets/sign-up/grid.svg';
import arrow from '@/assets/skills/arrow.svg';

// Industry options
const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'construction', label: 'Construction' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' }
];

export const EmployerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: ''
  });
  const [error, setError] = useState<string | null>(null);
  
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const isLoading = isSigningUp || isLoggingIn;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const signupResult = await signup({
        employerName: formData.employerName,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        industry: formData.industry
      }).unwrap();

      if (signupResult.success) {
        // Automatically login after successful signup
        const loginResult = await login({
          email: formData.email,
          password: formData.password
        }).unwrap();

        if (loginResult.success) {
          localStorage.setItem('employerToken', loginResult.token);
          navigate('/employer');
        }
      }
    } catch (err: any) {
      setError(err.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value }));
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <section className="flex h-screen w-screen bg-white relative dark:bg-gray-800">
      {/* Left Section */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        <img src={grid} alt="Grid Background" className="absolute inset-0 h-full w-full object-cover" />
        <img src={man} alt="Hero" className="absolute bottom-0 left-0 right-0 w-full object-contain" />
        <div className="absolute top-8 left-8 z-20">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate('/employer/login')}
              className="hover:text-green-600 text-black text-sm flex items-center"
            >
              <img className="w-4 h-4 mr-2" src={arrow} alt="Back Arrow" />
              <span>Back</span>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="h-[84px] flex flex-col justify-around mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">Create Employer Account</h1>
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/employer/login')}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Log in
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
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Full Name"
                value={formData.employerName}
                onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                required
              />
              <img src={User} alt="User Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>

            <div className="relative">
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
              <img src={User} alt="Building Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>

            {/* Industry Dropdown */}
            <div className="relative">
              <Select
                value={formData.industry}
                onValueChange={handleIndustryChange}
                required
              >
                <SelectTrigger className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem 
                      key={industry.value} 
                      value={industry.value}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <img src={User} alt="Industry Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" />
            </div>

            <div className="relative">
              <input
                type="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <img src={Mail} alt="Email Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            <div className="relative">
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <img src={Password} alt="Password Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            <div className="relative">
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <img src={Password} alt="Password Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] flex justify-center items-center gap-2 px-8 py-4 
                bg-[#062549] text-white font-medium rounded-[4px] 
                hover:bg-[#083264] transition-colors duration-200 ease-in-out"
              style={{
                boxShadow: "0px 10px 16px -2px rgba(6, 90, 216, 0.15)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSigningUp ? 'Signing up...' : 'Logging in...'}
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};