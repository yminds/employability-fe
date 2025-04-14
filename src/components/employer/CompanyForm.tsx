import React, { useState, FormEvent, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import axios from "axios";
import {
  setEmployerCredentials,
  updateCompanyLogo,
  updateCompanyDetails,
} from "@/features/authentication/employerAuthSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/store/store";
import { useCreateCompanyMutation } from "@/api/employerApiSlice";

// Replace these imports with your actual asset paths
import Elogo from "@/assets/branding/logo.svg";
import employerBackground from "@/assets/employer/createCompany.svg";
import placeholderLogo from "@/assets/employer/placeHolderLogo.svg";
import employerUpload from "@/assets/employer/employerUpload.svg";
import companyName from "@/assets/employer-company/companyName.svg";
import companyWebsite from "@/assets/employer-company/companyWebsite.svg";
import companyLocation from "@/assets/employer-company/companyLocation.svg";
import industry from "@/assets/employer-company/industry.svg";
import organizationSize from "@/assets/employer-company/organizationSize.svg";
import dropdownArrow from "@/assets/employer-company/dropdownArrow.svg";
import aboutIcon from "@/assets/employer-company/about.svg"; // Add an appropriate icon for the about field

// Type definitions for location data
interface Country {
  isoCode: string;
  name: string;
  phonecode: string;
  flag: string;
  currency: string;
  latitude: string;
  longitude: string;
  timezones: { zoneName: string; gmtOffset: number }[];
}

interface State {
  isoCode: string;
  name: string;
  countryCode: string;
  latitude: string;
  longitude: string;
}

interface City {
  name: string;
  countryCode: string;
  stateCode: string;
  latitude: string;
  longitude: string;
}

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
  const memoizedEmployerData = useMemo(
    () => ({
      _id: employerData.employer?._id,
      employerName: employerData.employer?.employerName,
      email: employerData.employer?.email,
      token: employerData.token,
      role: employerData.employer?.role || "member",
      is_email_verified: employerData.employer?.is_email_verified || false,
      account_status: employerData.employer?.account_status || "active",
      createdAt: employerData.employer?.createdAt || "",
      updatedAt: employerData.employer?.updatedAt || "",
    }),
    [
      employerData.employer?._id,
      employerData.employer?.employerName,
      employerData.employer?.email,
      employerData.token,
      employerData.employer?.role,
      employerData.employer?.is_email_verified,
      employerData.employer?.account_status,
      employerData.employer?.createdAt,
      employerData.employer?.updatedAt,
    ]
  );

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    organizationSize: "1-10",
    location: {
      country: "",
      state: "",
      city: ""
    },
    about: "",
  });

  // State for location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState({
    countries: false,
    states: false,
    cities: false,
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

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingLocation(prev => ({ ...prev, countries: true }));
        const response = await axios.get(
          `${process.env.VITE_API_BASE_URL}/api/v1/employer/location/countries`,
          {
            headers: {
              Authorization: `Bearer ${memoizedEmployerData.token}`,
            },
          }
        );
        if (response.data.success) {
          setCountries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingLocation(prev => ({ ...prev, countries: false }));
      }
    };

    if (memoizedEmployerData.token) {
      fetchCountries();
    }
  }, [memoizedEmployerData.token]);

  // Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) {
        setStates([]);
        return;
      }

      try {
        setLoadingLocation(prev => ({ ...prev, states: true }));
        const response = await axios.get(
          `${process.env.VITE_API_BASE_URL}/api/v1/employer/location/states/${selectedCountry}`,
          {
            headers: {
              Authorization: `Bearer ${memoizedEmployerData.token}`,
            },
          }
        );
        if (response.data.success) {
          setStates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingLocation(prev => ({ ...prev, states: false }));
      }
    };

    if (selectedCountry && memoizedEmployerData.token) {
      fetchStates();
    }
  }, [selectedCountry, memoizedEmployerData.token]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) {
        setCities([]);
        return;
      }

      try {
        setLoadingLocation(prev => ({ ...prev, cities: true }));
        const response = await axios.get(
          `${process.env.VITE_API_BASE_URL}/api/v1/employer/location/cities/${selectedCountry}/${selectedState}`,
          {
            headers: {
              Authorization: `Bearer ${memoizedEmployerData.token}`,
            },
          }
        );
        if (response.data.success) {
          setCities(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingLocation(prev => ({ ...prev, cities: false }));
      }
    };

    if (selectedCountry && selectedState && memoizedEmployerData.token) {
      fetchCities();
    }
  }, [selectedCountry, selectedState, memoizedEmployerData.token]);

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

    // Handle regular form fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle location field changes
  const handleLocationChange = (field: string, value: string) => {
    // Update the location object in formData
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));

    // Update the selected country/state for cascading selects
    if (field === "country") {
      setSelectedCountry(value);
      setSelectedState("");
      
      // Reset state and city in formData
      setFormData((prev) => ({
        ...prev,
        location: {
          country: value,
          state: "",
          city: ""
        }
      }));
    } else if (field === "state") {
      setSelectedState(value);
      
      // Reset city in formData
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          state: value,
          city: ""
        }
      }));
    }
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
    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
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
      formData.append("files", file);
      formData.append("userId", memoizedEmployerData._id || ""); // Add userId as required by the backend
      formData.append("folder", "company-logos"); // Add optional folder parameter

      // Make API request
      const response = await axios.post(
        `${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${memoizedEmployerData.token}`,
          },
        }
      );

      // Match response structure from your backend
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const uploadedFile = response.data.data[0];
        const newLogoData = {
          url: uploadedFile.fileUrl, // Note: backend returns fileUrl, not location
          key: uploadedFile.key,
        };

        setLogoData(newLogoData);

        // Update Redux store with the logo information
        dispatch(updateCompanyLogo(newLogoData));
      } else {
        throw new Error(response.data.message || "Invalid server response");
      }
    } catch (err: any) {
      console.error("Logo upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload logo. Please try again."
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

    // Validate location fields
    if (!formData.location.country) {
      setError("Please select a country.");
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
        about: formData.about,
        logo: logoData.url,
        logoKey: logoData.key,
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
              company: response.company._id,
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
    const parts = [];
    
    if (formData.location.city) {
      const cityObj = cities.find(c => c.name === formData.location.city);
      if (cityObj) {
        parts.push(cityObj.name);
      }
    }
    
    if (formData.location.state) {
      const stateObj = states.find(s => s.isoCode === formData.location.state);
      if (stateObj && !parts.includes(stateObj.name)) {
        parts.push(stateObj.name);
      }
    }
    
    if (formData.location.country) {
      const countryObj = countries.find(c => c.isoCode === formData.location.country);
      if (countryObj && !parts.includes(countryObj.name)) {
        parts.push(countryObj.name);
      }
    }
    
    return parts.join(", ");
  };

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-800">
      {/* LEFT SECTION with background */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={employerBackground || "/placeholder.svg"}
          alt="Employer Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
  
        {/* Logo overlay (top-left corner) */}
        <div className="absolute top-8 left-8 z-20">
          <img src={Elogo || "/placeholder.svg"} alt="Logo" className="w-32" />
        </div>
  
        {/* =============== PREVIEW CARD =============== */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className="
              w-[507px] p-7
              bg-gradient-to-b from-white/95 to-white/75
              rounded-lg shadow-[0px_55px_96px_0px_rgba(2,89,47,0.13)]
              outline-[6px] outline-white/70 backdrop-blur-[10px]
              flex flex-col justify-between items-start
            "
          >
            {/* Logo and Company Info */}
            <div className="flex justify-between w-full">
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
  
            {/* About preview (if provided) */}
            {formData.about && (
              <div className="mt-4 w-full">
                <h3 className="text-sm font-medium text-[#414347] mb-1">About</h3>
                <p className="text-sm text-[#8f9091] line-clamp-3">
                  {formData.about}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  
      
      <div className="flex flex-col justify-center w-2/5 items-center p-4 md:p-6">
        <div className="w-full max-w-sm bg-white rounded-lg">
          {/* Back Button */}
          <div className="flex items-center gap-2">
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
  
          {/* Header */}
          <div className="flex flex-col justify-around mx-auto py-4">
            <h1 className="text-2xl leading-tight tracking-[-0.48px] font-bold text-gray-900">
              Create a New Company Page
            </h1>
          </div>
  
          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30]"
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
                className="w-full p-2 pl-9 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400">
                <img src={companyName || "/placeholder.svg"} alt="Company Name" />
              </div>
            </div>
  
            {/* Website */}
            <div className="relative">
              <input
                type="text"
                name="website"
                className="w-full p-2 pl-9 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Company Website"
                value={formData.website}
                pattern="^(https:\/\/|www\.).*$"
                onChange={handleInputChange}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400">
                <img src={companyWebsite || "/placeholder.svg"} alt="Company Website" />
              </div>
            </div>
  
            {/* Location - Three selectors for country, state, city */}
            <div className="space-y-1">
              <label className="block text-[#68696B] text-xs mb-1">
                Company Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Country Selector */}
                <div className="relative">
                  <select
                    name="country"
                    className="w-full p-2 pl-7 border border-gray-300 rounded-lg text-xs focus:ring-green-500 focus:border-green-500 appearance-none"
                    value={formData.location.country}
                    onChange={(e) => handleLocationChange("country", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {loadingLocation.countries ? "Loading..." : "Country"}
                    </option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-400">
                    <img src={companyLocation || "/placeholder.svg"} alt="Country" />
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src={dropdownArrow || "/placeholder.svg"} alt="DropDown Arrow" />
                  </div>
                </div>
  
                {/* State Selector */}
                <div className="relative">
                  <select
                    name="state"
                    className="w-full p-2 pl-2 border border-gray-300 rounded-lg text-xs focus:ring-green-500 focus:border-green-500 appearance-none"
                    value={formData.location.state}
                    onChange={(e) => handleLocationChange("state", e.target.value)}
                    disabled={!formData.location.country || loadingLocation.states}
                  >
                    <option value="" disabled>
                      {loadingLocation.states ? "Loading..." : "State"}
                    </option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src={dropdownArrow || "/placeholder.svg"} alt="DropDown Arrow" />
                  </div>
                </div>
  
                {/* City Selector */}
                <div className="relative">
                  <select
                    name="city"
                    className="w-full p-2 pl-2 border border-gray-300 rounded-lg text-xs focus:ring-green-500 focus:border-green-500 appearance-none"
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange("city", e.target.value)}
                    disabled={!formData.location.state || loadingLocation.cities}
                  >
                    <option value="" disabled>
                      {loadingLocation.cities ? "Loading..." : "City"}
                    </option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src={dropdownArrow || "/placeholder.svg"} alt="DropDown Arrow" />
                  </div>
                </div>
              </div>
            </div>
  
            {/* Industry */}
            <div className="relative">
              <input
                type="text"
                name="industry"
                className="w-full p-2 pl-9 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400">
                <img src={industry || "/placeholder.svg"} alt="Industry" />
              </div>
            </div>
  
            {/* Organization Size */}
            <div className="relative">
              <select
                name="organizationSize"
                className="w-full p-2 pl-9 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 appearance-none"
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[8px] text-gray-400">
                <img src={organizationSize || "/placeholder.svg"} alt="Organization Size" />
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <img src={dropdownArrow || "/placeholder.svg"} alt="DropDown Arrow" />
              </div>
            </div>
  
            {/* About (New field) */}
            <div className="space-y-1">
              <label className="block text-[#68696B] text-xs">
                About the Company
              </label>
              <div className="relative">
                <Textarea
                  name="about"
                  placeholder="Describe your company, mission, values, etc."
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-9 min-h-[80px] border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute left-3 top-3 w-[16px] h-[16px] text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                This information will be displayed on your company profile page
              </p>
            </div>
  
            {/* Logo Upload */}
            <div className="mt-3">
              <label className="block text-[#68696B] text-xs mb-1">
                Logo
              </label>
              <div className="w-full p-4 bg-white border border-[#cdead9] rounded-md flex flex-col items-center justify-center gap-2">
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
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="text-[#03963F] text-xs underline"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  // Show upload UI if no logo
                  <>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img src={employerUpload || "/placeholder.svg"} alt="Upload icon" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] leading-4 text-[#666666] mb-1">
                        Add logo to your company page. Recommended size: 600x200
                        pixels.
                      </p>
                      <button
                        type="button"
                        className="text-[#03963F] text-xs underline"
                        onClick={handleFileSelect}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
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
                className="flex-shrink-0 h-4 cursor-pointer mt-0.5"
              >
                {isAuthorized ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
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
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#68696B]">
                I confirm I'm authorized to create and manage this page on
                behalf of my organization.
              </span>
            </div>
  
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isAuthorized || isLoading || uploadingLogo}
              className="w-full h-[36px] flex justify-center items-center gap-2 px-6 py-2
                bg-[#062549] text-white font-medium rounded-[4px]
                hover:bg-[#083264] transition-colors duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                boxShadow: "0px 8px 12px -2px rgba(6, 90, 216, 0.15)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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