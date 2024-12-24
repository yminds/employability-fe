import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createProfile } from "@/store/slices/profileSlice";
import { X } from "lucide-react";
import BasicInfoForm from "@/components/forms/basic-info-form";
import SkillsForm from "@/components/forms/skills-form";
import ExperienceForm from "@/components/forms/experience-form";
import EducationForm from "@/components/forms/education-form";
import { profileFormSchema } from "./shemas/profileFormSchema";
import { ZodError } from "zod";
import { useVerifySkillsMutation } from "@/api/skillApiSlice"; // Import RTK query hook
import CertificationsForm from "@/components/forms/certification-form";
interface VerifiedSkill {
  _id: string;
  name: string;
  description: string;
}

interface CompleteProfileModalProps {
  onClose: () => void;
  userId: string;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  onClose,
  userId,
}) => {
  const dispatch = useDispatch();
  const { parsedData } = useSelector((state: RootState) => state.resume);
  console.log(parsedData);

  const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkill[]>([]);
  const [isVerifyingSkills, setIsVerifyingSkills] = useState(false);

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    basicInfo: {
      name: parsedData?.name || "",
      mobile: parsedData?.contact?.phone || "",
      email: parsedData?.contact?.email || "",
      dateOfBirth: parsedData?.contact?.dob || "",
      gender: "",
      country: parsedData?.contact?.address?.country || "",
      state: parsedData?.contact?.address?.state || "",
      city: parsedData?.contact?.address?.city || "",
    },
    socialProfiles: {
      github: parsedData?.contact?.github || "",
      linkedin: parsedData?.contact?.linkedin || "",
      portfolio: parsedData?.contact?.portfolio || "",
    },
    skills: parsedData?.skills || [],
    experience: parsedData?.experience || [],
    education: parsedData?.education || [],
    certifications: parsedData?.certifications || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    basic: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
  };

  // Use the useVerifySkillsMutation hook
  const [verifySkills, { isLoading: isVerifying }] = useVerifySkillsMutation();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    sectionRefs[tab as keyof typeof sectionRefs]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop + 100; // Offset for header

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (!ref.current) return;
      const element = ref.current;
      const { top } = element.getBoundingClientRect();

      if (
        top <= scrollPosition &&
        top + element.offsetHeight > scrollPosition
      ) {
        setActiveTab(key);
      }
    });
  };

  const updateFormData = (section: keyof typeof formData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSave = async () => {
    try {
      console.log("Save button clicked - Before any processing");
      console.log(formData);

      // If validation passes
      const dispatchResult = await dispatch(
        createProfile({ userId, profileData: formData })
      );
      console.log("Dispatch result:", dispatchResult);

      onClose(); // Close modal after saving
    } catch (err) {
      console.error("Error in handleSave:", err);

      if (err instanceof ZodError) {
        console.log("Handling Zod error");
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          const path = error.path.join(".");
          fieldErrors[path] = error.message;
        });
        console.log("Field errors:", fieldErrors);
        setErrors(fieldErrors);

        // Navigate to the first error tab
        const firstError = err.errors[0];
        const section = firstError.path[0];
        if (
          section &&
          sectionRefs[section as keyof typeof sectionRefs]?.current
        ) {
          setActiveTab(section as string);
          sectionRefs[
            section as keyof typeof sectionRefs
          ]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ];

  // In useEffect
  useEffect(() => {
    const initializeData = async () => {
      if (parsedData) {
        console.log(parsedData);
        let validatedSkills: VerifiedSkill[] = [];
        if (parsedData.skills && parsedData.skills.length > 0) {
          const normalizedSkills = parsedData.skills.map((skill) =>
            skill.toLowerCase()
          );

          try {
            // Call the verifySkills mutation here
            const response = await verifySkills(normalizedSkills).unwrap();
            validatedSkills = response.data; // Get verified skills from the response
          } catch (error) {
            console.error("Error verifying skills:", error);
          }
        }
        setVerifiedSkills(validatedSkills);

        setFormData((prev) => ({
          ...prev,
          basicInfo: {
            name: parsedData?.name || "",
            mobile: parsedData?.contact?.phone || "",
            email: parsedData?.contact?.email || "",
            dateOfBirth: parsedData?.contact?.dob || "",
            gender: "",
            country: parsedData?.contact?.address?.country || "",
            state: parsedData?.contact?.address?.state || "",
            city: parsedData?.contact?.address?.city || "",
          },
          socialProfiles: {
            github: parsedData?.contact?.github || "",
            linkedin: parsedData?.contact?.linkedin || "",
            portfolio: parsedData?.contact?.portfolio || "",
          },
          skills: validatedSkills, // Pass complete skill objects
          experience: parsedData?.experience || [],
          education: parsedData?.education || [],
          certifications: parsedData?.certifications || [],
        }));
      }
    };

    initializeData();
  }, [parsedData, verifySkills]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-hidden ">
      <div className="bg-white rounded-md w-full max-w-3xl h-[90vh] flex flex-col p-6">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
              <p className="text-gray-600">
                Enter your details to complete your profile.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-6 justify-between bg-gray-100 text-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`pb-2 pt-2 px-4 relative ${
                  activeTab === tab.id
                    ? "text-green-600 font-semibold bg-green-50 w-1/4"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6"
          onScroll={handleScroll}
        >
          {/* Basic Info Section */}
          <div ref={sectionRefs.basic} className="py-6">
            <BasicInfoForm
              data={formData.basicInfo}
              socialProfiles={formData.socialProfiles}
              onChange={(basicInfo, socialProfiles) => {
                updateFormData("basicInfo", basicInfo);
                updateFormData("socialProfiles", socialProfiles);
              }}
              errors={errors}
            />
          </div>
          {/* Skills Section */}
          <div ref={sectionRefs.skills} className="py-6">
            {isVerifyingSkills ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-2 text-gray-600">Verifying skills...</span>
              </div>
            ) : (
              <SkillsForm
                skills={formData.skills}
                onChange={(skills) => updateFormData("skills", skills)}
                errors={errors}
              />
            )}
          </div>
          {/* Experience Section */}
          <div ref={sectionRefs.experience} className="py-6">
            <ExperienceForm
              experience={formData.experience}
              onChange={(experience) =>
                updateFormData("experience", experience)
              }
              errors={errors}
            />
          </div>
          {/* Education Section */}
          <div ref={sectionRefs.education} className="py-6">
            <EducationForm
              education={formData.education}
              certifications={formData.certifications}
              onChange={(education, certifications) => {
                updateFormData("education", education);
                updateFormData("certifications", certifications);
              }}
              errors={errors}
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t bg-white text-right justify-end ">
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Button clicked");
              handleSave();
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
