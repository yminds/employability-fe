import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';

// Import logo assets
import logo from '@/assets/branding/logo.svg';
import employerBgImage from '@/assets/employer/employerSignup1.svg';

const CompanySelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Get employer data from Redux or location state
  const employerFromRedux = useSelector((state: RootState) => state.employerAuth.employer);
  const tokenFromRedux = useSelector((state: RootState) => state.employerAuth.token);
  
  // If employer data was passed through navigation
  const employerFromNav = location.state?.employerData;
  
  // Merged employer data
  const [employerData, setEmployerData] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  useEffect(() => {
    // Check if we have employer data
    if (employerFromNav) {
      setEmployerData(employerFromNav);
      setLoading(false);
    } else if (employerFromRedux && tokenFromRedux) {
      setEmployerData({
        _id: employerFromRedux._id,
        employerName: employerFromRedux.employerName,
        email: employerFromRedux.email,
        token: tokenFromRedux
      });
      setLoading(false);
    } else {
      // No employer data, redirect to login
      navigate('/employer/login');
    }
  }, [employerFromNav, employerFromRedux, tokenFromRedux, navigate]);

  // Check if the employer is already associated with a company
  useEffect(() => {
    if (employerData) {
      if (employerFromRedux?.company._id) {
        // User already has a company, redirect to dashboard
        navigate('/employer/dashboard');
      }
    }
  }, [employerData, employerFromRedux, navigate]);

  const handleCreateNewClick = () => {
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-white">
      {/* Left Section with Image */}
      <div className="relative hidden md:flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src={employerBgImage}
          alt="Employer Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-20">
          <img src={logo} alt="Logo" className="w-32" />
        </div>
        
        {/* Company Preview Card */}
        <div className="absolute w-[507px] p-7 bg-gradient-to-b from-white/95 to-white/75 rounded-lg shadow-[0px_55px_96px_0px_rgba(2,89,47,0.13)] backdrop-blur-[10px] z-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-[#001630]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#1fd167]"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-medium text-gray-800">Acme Inc.</h3>
                <p className="text-base text-gray-700">Building innovative gadgets that simplify everyday life</p>
                <p className="text-gray-500">Software Development</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-4 bg-[#a6c4b3]"></div>
              <span className="text-gray-500">Bangalore, India</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="w-7 h-7 relative">
              <div className="w-2 h-2 absolute bottom-0 right-0 bg-[#0ed776]"></div>
            </div>
            <div className="font-bold">
              <span className="text-black">Employ</span>
              <span className="text-[#0ed776]">ability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        {showCreateForm ? (
          <CompanyForm employerData={employerData} />
        ) : (
          <CompanyList 
            employerData={employerData} 
          />
        )}
      </div>
    </div>
  );
};

export default CompanySelection;