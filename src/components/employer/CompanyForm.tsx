import React, { useState, FormEvent, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { 
  setEmployerCredentials, 
  updateCompanyLogo,
  updateCompanyDetails 
} from "@/features/authentication/employerAuthSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { useCreateCompanyMutation } from "@/api/employerApiSlice";

// Replace these imports with your actual asset paths
import Elogo from "@/assets/branding/logo.svg";
import employerBackground from "@/assets/employer/createCompany.svg";
import placeholderLogo from "@/assets/employer/placeHolderLogo.svg";
import employerUpload from "@/assets/employer/employerUpload.svg";

const organizationSizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001+",
];

const CompanyForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get employer data from Redux store - using useMemo to prevent unnecessary rerenders
  const employerData = useSelector((state: RootState) => state.employerAuth);
  
  // Memoize the derived data to prevent unnecessary rerenders
  const memoizedEmployerData = useMemo(() => ({
    _id: employerData.employer?._id,
    employerName: employerData.employer?.employerName,
    email: employerData.employer?.email,
    token: employerData.token,
    role: employerData.employer?.role || "member",
    is_email_verified: employerData.employer?.is_email_verified || false,
    account_status: employerData.employer?.account_status || "active",
    createdAt: employerData.employer?.createdAt || "",
    updatedAt: employerData.employer?.updatedAt || ""
  }), [
    employerData.employer?._id,
    employerData.employer?.employerName,
    employerData.employer?.email,
    employerData.token,
    employerData.employer?.role,
    employerData.employer?.is_email_verified,
    employerData.employer?.account_status,
    employerData.employer?.createdAt,
    employerData.employer?.updatedAt
  ]);

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    organizationSize: "1-10",
    location: "",
    description: "",
  });

  // State for logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<{ url: string; key: string }>({
    url: "",
    key: "",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use the createCompany mutation
  const [createCompany] = useCreateCompanyMutation();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "website") {
      const websitePattern = /^(https:\/\/|www\.)[\w-]+(\.[\w-]+)+.*$/;
  
      if (value && !websitePattern.test(value)) {
        setError("Website must start with 'https://' or 'www.'");
      } else {
        setError(null);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const file = files[0];
    
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
  
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  
    // Upload to server
    try {
      setUploadingLogo(true);
      setError(null);
      
      // Create form data
      const formData = new FormData();
      formData.append('files', file);
      formData.append('userId', memoizedEmployerData._id || ''); // Add userId as required by the backend
      formData.append('folder', 'company-logos'); // Add optional folder parameter
      
      // Make API request
      const response = await axios.post(`${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${memoizedEmployerData.token}`,
        },
      });
  
      // Match response structure from your backend
      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        const uploadedFile = response.data.data[0];
        const newLogoData = {
          url: uploadedFile.fileUrl, // Note: backend returns fileUrl, not location
          key: uploadedFile.key,
        };
        
        setLogoData(newLogoData);
        
        // Update Redux store with the logo information
        dispatch(updateCompanyLogo(newLogoData));
      } else {
        throw new Error(response.data.message || 'Invalid server response');
      }
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to upload logo. Please try again.'
      );
      // Clear preview on error
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!memoizedEmployerData._id) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    if (!isAuthorized) {
      setError(
        "Please confirm that you are authorized to create this company page."
      );
      return;
    }

    // Validate logo is uploaded
    if (!logoData.url) {
      setError("Please upload a company logo.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Prepare company data including the logo URL and key
      const companyData = {
        name: formData.name,
        website: formData.website,
        industry: formData.industry,
        organization_size: formData.organizationSize,
        location: formData.location,
        logo: logoData.url,
        logoKey: logoData.key
      };

      // Create company with the data
      const response = await createCompany({
        employerId: memoizedEmployerData._id,
        formData: companyData,
      }).unwrap();

      if (response && response.success && response.company) {
        // Update Redux store with new company data - ensuring we have proper structure
        dispatch(
          setEmployerCredentials({
            employer_info: {
              _id: memoizedEmployerData._id || "",
              employerName: memoizedEmployerData.employerName || "",
              email: memoizedEmployerData.email || "",
              role: memoizedEmployerData.role,
              is_email_verified: memoizedEmployerData.is_email_verified,
              account_status: memoizedEmployerData.account_status,
              createdAt: memoizedEmployerData.createdAt,
              updatedAt: memoizedEmployerData.updatedAt,
              company: response.company._id
            },
            token: memoizedEmployerData.token || "",
            company: response.company,
          })
        );

        // Update company details separately to ensure proper state update
        if (response.company) {
          dispatch(updateCompanyDetails(response.company));
        }

        navigate("/employer");
      } else {
        throw new Error("Company creation failed");
      }
    } catch (err: any) {
      console.error("Company creation error:", err);
      setError(
        err.data?.message ||
          "An error occurred during company creation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get location string for display
  const getLocationString = () => {
    return formData.location;
  };

  // -----------------------------
  // JSX (Preview + Form)
  // -----------------------------
  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-800">
      {/* LEFT SECTION with background */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={employerBackground}
          alt="Employer Background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Logo overlay (top-left corner) */}
        <div className="absolute top-8 left-8 z-20">
          <img src={Elogo} alt="Logo" className="w-32" />
        </div>

        {/* =============== PREVIEW CARD =============== */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className="
              w-[507px] p-7
              bg-gradient-to-b from-white/95 to-white/75
              rounded-lg shadow-[0px_55px_96px_0px_rgba(2,89,47,0.13)]
              outline-[6px] outline-white/70 backdrop-blur-[10px]
              flex justify-between items-start
            "
          >
            {/* Left Column */}
            <div className="inline-flex flex-col justify-center items-start gap-6">
              {/* Logo Container */}
              <div className="w-[94px] h-[94px] relative bg-[#f9f9f9] rounded-full overflow-hidden flex items-center justify-center border border-white/0">
                {/* If user hasn't uploaded, we use the placeholder. If uploaded, we show the preview. */}
                <img
                  src={logoPreview || placeholderLogo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Industry (No tagline/description here) */}
              <div className="flex flex-col justify-center items-start gap-1">
                {/* Company Name (hidden if empty) */}
                {formData.name && (
                  <div className="text-2xl font-medium text-[#414347] font-['Ubuntu'] leading-loose">
                    {formData.name}
                  </div>
                )}
                {/* Industry (hidden if empty) */}
                {formData.industry && (
                  <div className="text-base font-normal text-[#8f9091] font-['DM_Sans'] leading-relaxed tracking-tight">
                    {formData.industry}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Location (hidden if empty) */}
            {getLocationString() && (
              <div className="flex items-center gap-2">
                <div className="w-[13px] h-4 bg-[#a6c4b3]" />
                <div className="text-base font-normal text-[#8f9091] font-['DM_Sans'] leading-normal tracking-tight">
                  {getLocationString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (Form) */}
      <div className="flex flex-col justify-center flex-1 items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="hover:text-green-600 text-black text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="h-[84px] flex flex-col justify-around mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                Create a New Company Page
              </h1>
              <p className="text-sm text-gray-500">
                Fill in your company details to create your profile
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-8 bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
              >
                <AlertDescription className="text-[#ff3b30]">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Company Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M3 21h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>

            {/* Website */}
            <div className="relative">
              <input
                type="text"
                name="website"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Company Website (https:// or www.)"
                value={formData.website}
                pattern="^(https:\/\/|www\.).*$"
                onChange={handleInputChange}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m0 0a9 9 0 110-18 9 9 0 019 9zM3 12h18"
                  />
                </svg>
              </div>
            </div>

            {/* Industry */}
            <div className="relative">
              <input
                type="text"
                name="industry"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                  />
                </svg>
              </div>
            </div>

            {/* Organization Size */}
            <div className="relative">
              <select
                name="organizationSize"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 appearance-none"
                value={formData.organizationSize}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Organization Size
                </option>
                {organizationSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2"
                  />
                </svg>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Location - Single field */}
            <div className="relative">
              <input
                type="text"
                name="location"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Location (e.g., Bangalore, India)"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#333333] mb-2">Logo</label>
              <div className="w-full p-6 bg-white border border-[#cdead9] rounded-md flex flex-col items-center justify-center gap-3">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {logoPreview ? (
                  // Show logo preview if available
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="text-[#03963F] text-sm underline"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  // Show upload UI if no logo
                  <>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img src={employerUpload} alt="Upload icon" />
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] leading-5 text-[#666666] mb-1">
                        Add logo to your company page. Recommended size: 600x200 pixels.
                      </p>
                      <button
                        type="button"
                        className="text-[#03963F] text-sm underline"
                        onClick={handleFileSelect}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </span>
                        ) : (
                          "Upload Image"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Authorization Checkbox */}
            <div className="flex items-start gap-2">
              <div
                onClick={() => setIsAuthorized(!isAuthorized)}
                className="flex-shrink-0 h-5 cursor-pointer mt-0.5"
              >
                {isAuthorized ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      fill="white"
                      stroke="currentColor"
                    />
                    <path d="M9 12l2 2 4-4" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">
                I confirm I'm authorized to create and manage this page on
                behalf of my organization.
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isAuthorized || isLoading || uploadingLogo}
              className="w-full h-[44px] flex justify-center items-center gap-2 px-8 py-4
                bg-[#062549] text-white font-medium rounded-[4px]
                hover:bg-[#083264] transition-colors duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                boxShadow: "0px 10px 16px -2px rgba(6, 90, 216, 0.15)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Page...
                </>
              ) : (
                "Create Page"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;