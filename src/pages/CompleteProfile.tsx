import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "@/store/slices/resumeSlice";
import { AppDispatch } from "@/store/store";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/ResumeUpload";
import WorkExperience from "@/components/WorkExperience";
import Education from "@/components/Education";
import ProjectSection from "@/components/ProjectSection";
import AwardsSection from "@/components/AwardSection";
import { createProfile } from "@/store/slices/profileSlice";
import { skillsList } from "@/utils/skillsList";
import LocationSelector from "@/components/LocationSection";
import PersonalInfoSection from "@/components/PersonalInfoSection";
import ProfessionalProfilesSection from "@/components/ProfessionalProfileSection";
import LanguagesSection from "@/components/LanguagesSection";
import CertificationsSection from "@/components/CertificationsSection";
import Select from "react-select";
import SkillSelector from "@/components/SkillSelector";

interface Skill {
  name: string;
  rating: number;
}

console.log(skillsList);

const CompleteProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Accessing user and resume data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const { uploading, error, parsedData } = useSelector(
    (state: RootState) => state.resume
  );

  // Safely access skills from parsedData, checking if parsedData is available
  const parsedDataSkills = parsedData?.skills || [];

  // Personal Information
  const [fullName, setFullName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState<string>(user?.dob || "");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [linkedinProfile, setLinkedinProfile] = useState<string>("");
  const [portfolioWebsite, setPortfolioWebsite] = useState<string>("");
  const [githubProfile, setGithubProfile] = useState<string>("");
  const [workExperiences, setWorkExperiences] = useState<Array<any>>([]);
  const [educations, setEducations] = useState<Array<any>>([]);
  const [projects, setProjects] = useState<Array<any>>([]);
  const [awards, setAwards] = useState<string[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<string>("");
  const [certifications, setCertifications] = useState<string[]>([]);

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (parsedData) {
      setFullName(parsedData.name || "");
      setEmail(parsedData.contact?.email || "");
      setPhoneNumber(parsedData.contact?.phone || "");
      setDateOfBirth(parsedData.contact?.dob || "");
      setAddress({
        street: parsedData.contact?.address?.street || "",
        city: parsedData.contact?.address?.city || "",
        state: parsedData.contact?.address?.state || "",
        postalCode: parsedData.contact?.address?.postalCode || "",
        country: parsedData.contact?.address?.country || "",
      });
      setLinkedinProfile(parsedData.contact?.linkedin || "");
      setPortfolioWebsite(parsedData.contact?.portfolio || "");
      setGithubProfile(parsedData.contact?.github || "");
      setWorkExperiences(parsedData.experience || []);
      setEducations(parsedData.education || []);
      setProjects(parsedData.projects || []);
      setAwards(parsedData.awards || []);
      setCertifications(parsedData.certifications || []);

      // Convert skills array of strings to array of Skill objects with default rating
      if (parsedData.skills && Array.isArray(parsedData.skills)) {
        const filteredSkills = parsedData.skills.filter((skill: string) =>
          skillsList.includes(skill)
        );
        setSkills(
          filteredSkills.map((skill: string) => ({ name: skill, rating: 1 }))
        );
      }

      if (parsedData.languages && Array.isArray(parsedData.languages)) {
        setLanguages(parsedData.languages.join(", "));
      }
    }
  }, [parsedData]);

  console.log(parsedData);

  // Handle file change for resume upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      dispatch(uploadResume({ file, userId: user?._id || "" }));
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    const errors: any = {};
    if (!fullName) {
      errors.fullName = "Full Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    }
    if (!dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // If no errors, return true
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    const profileData = {
      personalInformation: {
        fullName,
        email,
        phoneNumber,
        dateOfBirth,
        address,
      },
      professionalProfiles: {
        linkedinProfile,
        portfolioWebsite,
        githubProfile,
      },
      workExperiences,
      educations,
      skills, // Array of skills with ratings
      projects,
      additionalInformation: {
        languages,
        certifications,
        awards,
      },
    };

    if (user) {
      await dispatch(createProfile({ userId: user._id, profileData })); // Replace with actual dispatch
    }
    navigate("/profile");
    console.log("Profile Data Su bmitted:", profileData);
  };

  // Functions for handling dynamic sections (Work Experience, Education, etc.)
  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
      },
    ]);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        location: "",
      },
    ]);
  };

  const updateWorkExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    setWorkExperiences((prevExperiences) => {
      const updatedExperiences = [...prevExperiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
      return updatedExperiences;
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setEducations((prevEducations) => {
      const updatedEducations = [...prevEducations];
      updatedEducations[index] = {
        ...updatedEducations[index],
        [field]: value,
      };
      return updatedEducations;
    });
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperiences((prevExperiences) => {
      const updatedExperiences = [...prevExperiences];
      updatedExperiences.splice(index, 1);
      return updatedExperiences;
    });
  };

  const removeEducation = (index: number) => {
    setEducations((prevEducations) => {
      const updatedEducations = [...prevEducations];
      updatedEducations.splice(index, 1);
      return updatedEducations;
    });
  };

  const handleSelectSkill = (selectedOption: any) => {
    const skill = selectedOption?.value; // Get the selected skill name
    if (skill && !skills.some((s) => s.name === skill)) {
      setSkills([...skills, { name: skill, rating: 1 }]); // Add new skill with a default rating
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index); // Remove the skill at the specified index
    setSkills(updatedSkills); // Update the state with the new skills list
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 shadow-lg rounded bg-white">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <ResumeUpload
            uploading={uploading}
            error={error}
            onFileChange={handleFileChange}
          />
          <PersonalInfoSection
            fullName={fullName}
            email={email}
            phoneNumber={phoneNumber}
            dateOfBirth={dateOfBirth}
            formErrors={formErrors}
            onFullNameChange={(e) => setFullName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPhoneNumberChange={(e) => setPhoneNumber(e.target.value)}
            onDateOfBirthChange={(e) => setDateOfBirth(e.target.value)}
          />
          <ProfessionalProfilesSection
            linkedinProfile={linkedinProfile}
            portfolioWebsite={portfolioWebsite}
            githubProfile={githubProfile}
            onLinkedinProfileChange={setLinkedinProfile}
            onPortfolioWebsiteChange={setPortfolioWebsite}
            onGithubProfileChange={setGithubProfile}
          />
          <LocationSelector />
          <br />

          <SkillSelector skills={skills} setSkills={setSkills} />
          <WorkExperience
            workExperiences={workExperiences}
            onUpdate={updateWorkExperience}
            onRemove={removeWorkExperience}
            onAdd={addWorkExperience}
          />
          <Education
            educations={educations}
            onUpdate={updateEducation}
            onRemove={removeEducation}
            onAdd={addEducation}
          />
          <ProjectSection projects={projects} setProjects={setProjects} />
          <AwardsSection awards={awards} setAwards={setAwards} />
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Additional Information
            </h3>
            <LanguagesSection
              languages={languages}
              onLanguagesChange={setLanguages}
            />
            <CertificationsSection
              certifications={certifications}
              onCertificationsChange={setCertifications}
            />
          </div>
          <Button type="submit" className="w-full" variant="default">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};
export default CompleteProfile;
