// components/TextInput.tsx
import React from "react";
import { Input } from "./ui/input";

// interface TextInputProps {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   required?: boolean;
//   type?: string;
//   placeholder?: string;
//   error?: string; // Add error prop to handle error messages
// }

// const TextInput: React.FC<TextInputProps> = ({
//   label,
//   value,
//   onChange,
//   required,
//   type = "text",
//   placeholder = "",
//   error,
// }) => {
//   return (
//     <div className="mb-4">
//       <label className="block text-gray-700">{label}</label>
//       <Input
//         type={type}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className={`w-full mt-1 p-2 border rounded ${
//           error ? "border-red-500" : "border-gray-300"
//         } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//         placeholder={placeholder}
//       />
//       {error && <span className="text-sm text-red-500">{error}</span>}{" "}
//       {/* Display error below input */}
//     </div>
//   );
// };

// export default TextInput;

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: string; // Icon path as a string
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder = "",
  error,
  icon,
}) => {
  return (
    <div className="flex flex-col gap-[4px]">
      {label && (
        <label className="block text-gray-700 text-[14px] font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <img
            src={icon}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            alt="Icon"
          />
        )}

        <Input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full py-[12px] px-[16px] bg-[#FAFBFE] rounded-[6px] 
            border border-[rgba(0,0,0,0.10)] 
            focus:outline-none focus:ring-2 focus:ring-[#0AD472] 
            ${error ? "border-red-500" : ""}
            ${icon ? "pl-10" : ""}
          `}
        />
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default TextInput;

//this is the dropdown code to select the role of the user, whether he is an employee or a recruiter

// {isSignup && (
//   <>
//     {/* Role Selection with ChevronDown */}
//     <div className="relative">
//       <select
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//         className="w-full py-[8px] px-[16px] h-[50px] bg-[#FAFBFE] rounded-[6px] outline outline-1 outline-[#e1e2e5]
//           hover:outline-1 hover:outline-[#0AD472]
//           focus:outline-1 focus:outline-[#0AD472]
//           appearance-none pr-10"
//       >
//         <option value="candidate">Candidate</option>
//         <option value="employer">Employer</option>
//         <option value="recruiter">Recruiter</option>
//       </select>
//       <ChevronDown
//         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
//         size={18}
//       />
//     </div>

//     {role === "candidate" && (
//       <TextInput
//         type="text"
//         value={resume}
//         onChange={(e) => setResume(e.target.value)}
//         placeholder="Resume URL (optional)"
//       />
//     )}

//     {(role === "employer" || role === "recruiter") && (
//       <>
//         <TextInput
//           type="text"
//           value={companyName}
//           onChange={(e) => setCompanyName(e.target.value)}
//           placeholder="Company Name"
//         />

//         <TextInput
//           type="url"
//           value={companyWebsite}
//           onChange={(e) => setCompanyWebsite(e.target.value)}
//           placeholder="Company Website (e.g. https://example.com)"
//         />
//       </>
//     )}
//   </>
// )}
