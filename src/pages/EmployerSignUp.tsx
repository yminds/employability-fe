import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2, Building2, Briefcase } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployerSignupMutation, useEmployerLoginMutation } from '@/api/employerApiSlice';
import { setEmployerCredentials } from '@/features/authentication/employerAuthSlice';

// Import your assets
import User from '@/assets/sign-up/user.png';
import Mail from '@/assets/sign-up/mail.png';
import Password from '@/assets/sign-up/password.png';
import logo from '@/assets/branding/logo.svg';
import man from '@/assets/sign-up/man.png';
import grid from '@/assets/sign-up/grid.svg';
import arrow from '@/assets/skills/arrow.svg';

// Industry options
const INDUSTRY_OPTIONS = [
  "Information Technology",
  "Software Development",
  "Digital Marketing",
  "E-commerce",
  "Consulting",
  "Healthcare",
  "Education",
  "Finance",
  "Manufacturing",
  "Other"
];

export const EmployerSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    employerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    website: '', // Added website field
    industry: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [signup] = useEmployerSignupMutation();
  const [login] = useEmployerLoginMutation();

  // Validate email domain matches website domain
  const validateEmailDomain = () => {
    if (!formData.email || !formData.website) return true;

    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    const websiteDomain = formData.website
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .toLowerCase();

    return emailDomain === websiteDomain;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (!validateEmailDomain()) {
      setError("Email domain must match company website domain");
      setIsLoading(false);
      return;
    }

    try {
      const signupResponse = await signup({
        employerName: formData.employerName,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        website: formData.website,
        industry: formData.industry
      }).unwrap();

      if (signupResponse.success) {
        // Dispatch the credentials to Redux store
        dispatch(setEmployerCredentials(signupResponse.data));
        
        // Automatic login after successful signup
        try {
          const loginResponse = await login({
            email: formData.email,
            password: formData.password
          }).unwrap();

          if (loginResponse.success) {
            navigate("/employer/dashboard");
          }
        } catch (loginError: any) {
          setError("Signup successful but login failed. Please try logging in manually.");
        }
      } else {
        setError(signupResponse.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.data?.message || "An error occurred during signup. Please try again.");
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

            {/* Personal Info Section */}
            <div className="space-y-4">
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
                  type="email"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Company Email"
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
            </div>

            {/* Company Info Section */}
            <div className="space-y-4 pt-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              <div className="relative">
                <input
                  type="url"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Company Website (e.g., https://company.com)"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  required
                  pattern="https?://.*"
                  title="Please include http:// or https://"
                />
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  Signing up...
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