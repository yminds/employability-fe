import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface BasicInfoFormProps {
  data: {
    name: string;
    mobile: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    country: string;
    state: string;
    city: string;
    profileImage?: File;
  };
  socialProfiles: {
    github: string;
    linkedin: string;
    dribbble: string;
    behance: string;
    portfolio: string;
  };
  onChange: (basicInfo: any, socialProfiles: any) => void;
  errors: { [key: string]: string };
}

export default function BasicInfoForm({
  data = {
    name: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    state: "",
    city: "",
  },
  socialProfiles = {
    github: "",
    linkedin: "",
    dribbble: "",
    behance: "",
    portfolio: "",
  },
  onChange,
  errors = {},
}: BasicInfoFormProps) {
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  console.log(userId);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");

  // Debug logging
  useEffect(() => {
    console.log("BasicInfoForm mounted with data:", data);
    console.log("BasicInfoForm socialProfiles:", socialProfiles);
  }, []);

  // Load countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (data?.country) {
      const countryStates = State.getStatesOfCountry(data.country);
      setStates(countryStates);

      if (
        data.state &&
        !countryStates.find((state) => state.isoCode === data.state)
      ) {
        onChange({ ...data, state: "", city: "" }, socialProfiles);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [data?.country, socialProfiles]);

  // Update cities when state changes
  useEffect(() => {
    if (data?.country && data?.state) {
      const stateCities = City.getCitiesOfState(data.country, data.state);
      setCities(stateCities);

      if (data.city && !stateCities.find((city) => city.name === data.city)) {
        onChange({ ...data, city: "" }, socialProfiles);
      }
    } else {
      setCities([]);
    }
  }, [data?.country, data?.state, socialProfiles]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedData = {
      ...data,
      [e.target.name]: e.target.value,
    };
    onChange(updatedData, socialProfiles);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    try {
      if (!file) return;

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageError("File must be either JPEG, PNG or WebP");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setImageError("File size must be less than 2MB");
        return;
      }

      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Create FormData for S3 upload
      const formData = new FormData();
      formData.append("file", file); // Changed from 'profile_image' to 'file' to match our S3 controller
      formData.append("userId", userId); // Make sure userId is available
      formData.append("fileType", "profile-image");
      formData.append("name", file.name);

      // Upload to S3
      const response = await fetch("http://localhost:3000/api/v1/s3/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { fileUrl } = await response.json(); // Changed from imageUrl to fileUrl to match our S3 controller response

      // Update form data with the returned S3 URL
      onChange(
        {
          ...data,
          profile_image: fileUrl,
        },
        socialProfiles
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageError("Failed to upload image. Please try again.");
      setImagePreview(null); // Reset preview on error
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageError("");
    onChange(
      {
        ...data,
        profileImage: undefined,
      },
      socialProfiles
    );
  };

  const handleSocialProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedProfiles = {
      ...socialProfiles,
      [e.target.name]: e.target.value,
    };
    onChange(data, updatedProfiles);
  };

  const getError = (field: string) => errors[field] || "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Profile Image Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-600 text-4xl">+</span>
              </div>
            )}

            <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
              {imagePreview ? "Change Image" : "Select Image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPEG, PNG, WebP. Max size: 2MB
            </p>

            {imageError && (
              <p className="text-red-500 text-xs mt-1">{imageError}</p>
            )}
            {getError("basicInfo.profileImage") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.profileImage")}
              </p>
            )}
          </div>
        </div>

        {/* Basic Info Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.name") ? "border-red-500" : ""
              }`}
              placeholder="Enter your full name"
            />
            {getError("basicInfo.name") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.name")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={data.mobile}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.mobile") ? "border-red-500" : ""
              }`}
              placeholder="+91 1234567890"
            />
            {getError("basicInfo.mobile") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.mobile")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.email") ? "border-red-500" : ""
              }`}
              placeholder="example@email.com"
            />
            {getError("basicInfo.email") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.email")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium mb-4">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date Of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleBasicInfoChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.dateOfBirth") ? "border-red-500" : ""
              }`}
            />
            {getError("basicInfo.dateOfBirth") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.dateOfBirth")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={data.gender}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.gender") ? "border-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {getError("basicInfo.gender") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.gender")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              name="country"
              value={data.country}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.country") ? "border-red-500" : ""
              }`}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {getError("basicInfo.country") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.country")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              name="state"
              value={data.state}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.state") ? "border-red-500" : ""
              }`}
              disabled={!data.country}
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {getError("basicInfo.state") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.state")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              name="city"
              value={data.city}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.city") ? "border-red-500" : ""
              }`}
              disabled={!data.state}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {getError("basicInfo.city") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.city")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Social Profiles */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium mb-4">Social Profiles</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              name="github"
              value={socialProfiles.github}
              onChange={handleSocialProfileChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={socialProfiles.linkedin}
              onChange={handleSocialProfileChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dribbble</label>
            <input
              type="url"
              name="dribbble"
              value={socialProfiles.dribbble}
              onChange={handleSocialProfileChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://dribbble.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Behance</label>
            <input
              type="url"
              name="behance"
              value={socialProfiles.behance}
              onChange={handleSocialProfileChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://behance.net/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Portfolio</label>
            <input
              type="url"
              name="portfolio"
              value={socialProfiles.portfolio}
              onChange={handleSocialProfileChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// export default BasicInfoForm;
