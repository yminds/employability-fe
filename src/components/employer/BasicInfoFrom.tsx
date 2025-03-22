import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoFormProps {
  formData: {
    title: string;
    location: string;
    job_type: string;
    work_place_type: string;
    experience_level: string;
    description: string;
  };
  onChange: (formData: any) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  formData, 
  onChange
}) => {
  
  const handleFormDataChange = (field: string, value: string) => {
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
          value={formData.location}
          onChange={(e) => handleFormDataChange("location", e.target.value)}
          placeholder="Location (e.g., New York, USA)"
          className="flex-1 h-[50px] text-body2"
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
          value={formData.experience_level}
          onValueChange={(val) => handleFormDataChange("experience_level", val)}
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

      {/* Description */}
      <Textarea
        value={formData.description}
        onChange={(e) => handleFormDataChange("description", e.target.value)}
        placeholder="Job Description"
        rows={20}
        className="resize-none text-body2"
        required
      />
    </div>
  );
};

export default BasicInfoForm;