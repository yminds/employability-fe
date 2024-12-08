// ProfessionalProfilesSection.tsx
import React from "react";
import TextInput from "@/components/TextInput";

interface ProfessionalProfilesSectionProps {
  linkedinProfile: string;
  portfolioWebsite: string;
  githubProfile: string;
  onLinkedinProfileChange: (value: string) => void;
  onPortfolioWebsiteChange: (value: string) => void;
  onGithubProfileChange: (value: string) => void;
}

const ProfessionalProfilesSection: React.FC<
  ProfessionalProfilesSectionProps
> = ({
  linkedinProfile,
  portfolioWebsite,
  githubProfile,
  onLinkedinProfileChange,
  onPortfolioWebsiteChange,
  onGithubProfileChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Professional Profiles</h3>
      <TextInput
        label="LinkedIn Profile"
        value={linkedinProfile}
        onChange={(e) => onLinkedinProfileChange(e.target.value)}
        placeholder="https://linkedin.com/in/yourprofile"
      />
      <TextInput
        label="Portfolio Website"
        value={portfolioWebsite}
        onChange={(e) => onPortfolioWebsiteChange(e.target.value)}
        placeholder="https://yourportfolio.com"
      />
      <TextInput
        label="GitHub Profile"
        value={githubProfile}
        onChange={(e) => onGithubProfileChange(e.target.value)}
        placeholder="https://github.com/yourprofile"
      />
    </div>
  );
};

export default ProfessionalProfilesSection;
