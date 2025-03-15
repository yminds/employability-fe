import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { useEmployerSignupMutation } from '@/api/employerApiSlice';
import { setEmployerCredentials } from '@/features/authentication/employerAuthSlice';

import logo from '@/assets/branding/logo.svg';
import arrow from '@/assets/skills/arrow.svg';
import employerSignuplogo from '@/assets/employer/employerSignup1.svg';

import User from '@/assets/sign-up/user.png';
import Mail from '@/assets/sign-up/mail.png';
import Password from '@/assets/sign-up/password.png';

import { PhoneInput } from '@/components/cards/phoneInput/PhoneInput';

export const EmployerSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    employerName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const [signup] = useEmployerSignupMutation();

  const handlePhoneInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const signupResponse = await signup({
        employerName: formData.employerName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      }).unwrap();

      if (signupResponse.success) {
        const employerData: any = signupResponse.data;

        dispatch(
          setEmployerCredentials({
            employer_info: {
              _id: employerData._id,
              employerName: employerData.employerName,
              email: employerData.email,
              role: employerData.role,
              is_email_verified: employerData.is_email_verified,
              account_status: employerData.account_status,
              createdAt: employerData.createdAt,
              updatedAt: employerData.updatedAt,
              // Company may be set if a matching company was found
              company_id: employerData.company || null
            },
            token: employerData.token,
            // Company info if found during signup
            company: employerData.companyInfo || null,
          })
        );

        // Reset form
        setFormData({
          employerName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
        });
          navigate('/employer');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.status === 400) {
        if (err.data?.message?.includes('Email already exists')) {
          setError('This email is already registered. Please try logging in instead.');
        } else {
          setError(err.data?.message || 'Please check your input and try again.');
        }
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <section className="flex h-screen w-screen bg-white relative dark:bg-gray-800">
      {/* Left Section with SVG */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src={employerSignuplogo}
          alt="Employer Signup Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-20">
          <img src={logo} alt="Logo" className="w-32" />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate("/employer/login")}
              className="hover:text-green-600 text-black text-sm flex items-center"
            >
              <img className="w-4 h-4 mr-2" src={arrow} alt="Back Arrow" />
              <span>Back</span>
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="h-[84px] flex flex-col justify-around mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                Create Employer Account
              </h1>
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/employer/login")}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Log in
                </button>
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
              >
                <AlertDescription className="text-[#ff3b30]">{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                autoComplete="name"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Name"
                value={formData.employerName}
                onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                required
              />
              <img
                src={User}
                alt="User Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              />
            </div>

            {/* Company Email */}
            <div className="relative">
              <input
                type="email"
                autoComplete="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your company email id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <img
                src={Mail}
                alt="Email Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <PhoneInput
                autoComplete="tel"
                placeholder="Phone Number"
                required
                className="w-full"
                value={formData.phoneNumber}
                onChange={handlePhoneInputChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                autoComplete="new-password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm 
                           focus:ring-green-500 focus:border-green-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <img
                src={Password}
                alt="Password Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                autoComplete="new-password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm 
                           focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <img
                src={Password}
                alt="Password Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] flex justify-center items-center gap-2 px-8 py-4
                         bg-[#062549] text-white font-medium rounded-[4px]
                         hover:bg-[#083264] transition-colors duration-200 ease-in-out"
              style={{
                boxShadow: '0px 10px 16px -2px rgba(6, 90, 216, 0.15)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmployerSignup;
