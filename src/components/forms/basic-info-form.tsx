// import React, { useEffect, useState } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { Country, State, City } from "country-state-city";

// interface BasicInfoFormProps {
//   data: {
//     name: string;
//     mobile: string;
//     email: string;
//     dateOfBirth: string;
//     gender: string;
//     country: string;
//     state: string;
//     city: string;
//     profileImage?: File;
//   };
//   socialProfiles: {
//     github: string;
//     linkedin: string;
//     dribbble: string;
//     behance: string;
//     portfolio: string;
//   };
//   onChange: (basicInfo: any, socialProfiles: any) => void;
// }

// export default function BasicInfoForm({
//   data,
//   socialProfiles,
//   onChange,
// }: BasicInfoFormProps) {
//   const [countries, setCountries] = useState<any[]>([]);
//   const [states, setStates] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);

//   useEffect(() => {
//     // Load all countries on component mount
//     const allCountries = Country.getAllCountries();
//     setCountries(allCountries);
//   }, []);

//   useEffect(() => {
//     // Update states when country changes
//     if (data.country) {
//       const countryStates = State.getStatesOfCountry(data.country);
//       setStates(countryStates);
//       // Reset state and city when country changes
//       if (
//         data.state &&
//         !countryStates.find((state) => state.isoCode === data.state)
//       ) {
//         onChange({ ...data, state: "", city: "" }, socialProfiles);
//       }
//     } else {
//       setStates([]);
//       setCities([]);
//     }
//   }, [data.country]);

//   useEffect(() => {
//     // Update cities when state changes
//     if (data.country && data.state) {
//       const stateCities = City.getCitiesOfState(data.country, data.state);
//       setCities(stateCities);
//       // Reset city when state changes
//       if (data.city && !stateCities.find((city) => city.name === data.city)) {
//         onChange({ ...data, city: "" }, socialProfiles);
//       }
//     } else {
//       setCities([]);
//     }
//   }, [data.country, data.state]);

//   const handleBasicInfoChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     onChange(
//       {
//         ...data,
//         [e.target.name]: e.target.value,
//       },
//       socialProfiles
//     );
//   };

//   const handlePhoneChange = (value: string) => {
//     onChange(
//       {
//         ...data,
//         mobile: value, // Update phone number with country code
//       },
//       socialProfiles
//     );
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       onChange(
//         {
//           ...data,
//           profileImage: e.target.files[0],
//         },
//         socialProfiles
//       );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-6">
//         {/* Profile Image Upload */}
//         <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
//           <div className="flex flex-col items-center">
//             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
//               <span className="text-emerald-600 text-lg">+</span>
//             </div>
//             <p className="text-gray-600 text-center mb-2">
//               Upload a profile image
//             </p>
//             <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
//               Select from files
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//               />
//             </label>
//             <p className="text-xs text-gray-500 mt-2">
//               Image should be 'x' mb or less
//             </p>
//           </div>
//         </div>

//         {/* Basic Info Fields */}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={data.name}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               placeholder="Matthew Johns"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Mobile number <span className="text-red-500">*</span>
//             </label>
//             {/* <PhoneInput
//               country={"us"} // Default country
//               value={data.mobile}
//               onChange={handlePhoneChange}
//               inputClass="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               placeholder="+91 123 456 7890"
//               enableSearch
//             /> */}
//             <input
//               type="tel"
//               name="mobile"
//               value={data.mobile}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               placeholder="+91 1234567891"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Email Address <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={data.email}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               placeholder="example@domain.com"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Location Info */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="font-medium mb-4">Basic Info</h3>
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Date Of Birth
//             </label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={data.dateOfBirth}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Gender</label>
//             <select
//               name="gender"
//               value={data.gender}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Country</label>
//             <select
//               name="country"
//               value={data.country}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             >
//               <option value="">Select country</option>
//               {countries.map((country) => (
//                 <option key={country.isoCode} value={country.isoCode}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">State</label>
//             <select
//               name="state"
//               value={data.state}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               disabled={!data.country}
//             >
//               <option value="">Select state</option>
//               {states.map((state) => (
//                 <option key={state.isoCode} value={state.isoCode}>
//                   {state.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">City</label>
//             <select
//               name="city"
//               value={data.city}
//               onChange={handleBasicInfoChange}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               disabled={!data.state}
//             >
//               <option value="">Select city</option>
//               {cities.map((city) => (
//                 <option key={city.name} value={city.name}>
//                   {city.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";

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
  data,
  socialProfiles,
  onChange,
  errors,
}: BasicInfoFormProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    // Load all countries on component mount
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    // Update states when country changes
    if (data.country) {
      const countryStates = State.getStatesOfCountry(data.country);
      setStates(countryStates);
      // Reset state and city when country changes
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
  }, [data.country]);

  useEffect(() => {
    // Update cities when state changes
    if (data.country && data.state) {
      const stateCities = City.getCitiesOfState(data.country, data.state);
      setCities(stateCities);
      // Reset city when state changes
      if (data.city && !stateCities.find((city) => city.name === data.city)) {
        onChange({ ...data, city: "" }, socialProfiles);
      }
    } else {
      setCities([]);
    }
  }, [data.country, data.state]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(
      {
        ...data,
        [e.target.name]: e.target.value,
      },
      socialProfiles
    );
  };

  const handlePhoneChange = (value: string) => {
    onChange(
      {
        ...data,
        mobile: value, // Update phone number with country code
      },
      socialProfiles
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(
        {
          ...data,
          profileImage: e.target.files[0],
        },
        socialProfiles
      );
    }
  };

  const getError = (field: string) => errors[field] || "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Profile Image Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-emerald-600 text-lg">+</span>
            </div>
            <p className="text-gray-600 text-center mb-2">
              Upload a profile image
            </p>
            <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
              Select from files
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Image should be 'x' mb or less
            </p>
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
              placeholder="Matthew Johns"
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
            {/* <PhoneInput
              country={"us"} // Default country
              value={data.mobile}
              onChange={handlePhoneChange}
              inputClass="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="+91 123 456 7890"
              enableSearch
            /> */}
            <input
              type="phone"
              name="mobile"
              value={data.mobile}
              onChange={handleBasicInfoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError("basicInfo.mobile") ? "border-red-500" : ""
              }`}
              placeholder="+91 1234567891"
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
              placeholder="example@domain.com"
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
    </div>
  );
}
