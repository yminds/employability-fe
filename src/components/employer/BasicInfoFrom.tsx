import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "../../utils/employer/RichTextEditor"; 

// Updated interface to match the actual location structure
interface LocationType {
  city: string;
  state: string;
  country: string;
}

interface BasicInfoFormProps {
  formData: {
    title: string;
    location: LocationType | string; // Accept both object and string
    job_type: string;
    work_place_type: string;
    experience_level: string;
    description: string;
  };
  onChange: (formData: any) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData,
  onChange,
}) => {
  // Map the backend experience_level value to the format for the Select field
  const mapExperienceLevelForSelect = (value: string) => {
    switch (value) {
      case "entry":
        return "entry-level";
      case "mid":
        return "mid-level";
      case "senior":
        return "senior-level";
      default:
        return ""; // Default case if the value is not recognized
    }
  };

  // Map the selected experience level value back to backend format when submitting
  const mapExperienceLevelForBackend = (value: string) => {
    switch (value) {
      case "entry-level":
        return "entry";
      case "mid-level":
        return "mid";
      case "senior-level":
        return "senior";
      default:
        return ""; // Default case if the value is not recognized
    }
  };

  // Transform the formData.experience_level to the format needed for the Select component
  const experienceLevelValue = mapExperienceLevelForSelect(
    formData.experience_level
  );

  // Format location string for display in the input field
  const formatLocation = (location: LocationType | string) => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (location && typeof location === 'object') {
      const { city, state, country } = location;
      return `${city || ''}, ${state || ''}, ${country || ''}`.replace(/^, |, $/g, '');
    }
    
    return '';
  };

  const handleFormDataChange = (field: string, value: string) => {
    // If it's the experience_level field, map the value to backend format before updating the formData
    if (field === "experience_level") {
      value = mapExperienceLevelForBackend(value);
    }

    // Don't update location field since it's disabled
    if (field === "location") {
      return;
    }

    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Row: Job Title & Location */}
      <div className="flex gap-4">
        <Input
          value={formData.title}
          onChange={(e) => handleFormDataChange("title", e.target.value)}
          placeholder="Job Title (e.g., Full Stack Developer)"
          className="flex-1 h-[50px] text-body2"
          required
        />
        <Input
          value={formatLocation(formData.location)}
          onChange={(e) => {/* No-op since field is disabled */}}
          placeholder="Location (e.g., New York, USA)"
          className="flex-1 h-[50px] text-body2 bg-gray-100"
          disabled={true}
          required
        />
      </div>

      {/* Row: Job Type & Workplace Type */}
      <div className="flex gap-4">
        <Select
          value={formData.job_type}
          onValueChange={(val) => handleFormDataChange("job_type", val)}
          required
        >
          <SelectTrigger className="flex-1 h-[50px] text-body2">
            <SelectValue placeholder="Job Type (e.g., Full Time)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.work_place_type}
          onValueChange={(val) => handleFormDataChange("work_place_type", val)}
          required
        >
          <SelectTrigger className="flex-1 h-[50px] text-body2">
            <SelectValue placeholder="Workplace Type (e.g., Remote)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-site">On-site</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row: Experience Level */}
      <div className="flex gap-4">
        <Select
          value={experienceLevelValue} // Set the transformed value for Select
          onValueChange={(val) => handleFormDataChange("experience_level", val)} // Send transformed value back to the form
          required
        >
          <SelectTrigger className="flex-1 h-[50px] text-body2">
            <SelectValue placeholder="Experience Level (e.g., Mid Level)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry-level">Entry Level</SelectItem>
            <SelectItem value="mid-level">Mid Level</SelectItem>
            <SelectItem value="senior-level">Senior Level</SelectItem>
            <SelectItem value="executive-level">Executive Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description - Now using RichTextEditor */}
      <div>
        <label htmlFor="description" className="block mb-2 text-body2 font-medium text-gray-700">
          Job Description
        </label>
        <RichTextEditor
          value={formData.description}
          onChange={(html) => handleFormDataChange("description", html)}
          placeholder="Write a detailed job description..."
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;