import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { ProfileFormData } from "../../features/profile/types";
import BasicInfoForm from "../forms/basic-info-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "../forms/experience-form";
import EducationForm from "../forms/education-form";
import { profileFormSchema } from "../../features/profile/shemas/profileFormSchema";
import { ZodError } from "zod";
import debounce from "lodash.debounce"; // Install lodash.debounce

interface CompleteProfileModalProps {
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
}

export default function CompleteProfileModal({
  onClose,
  onSave,
}: CompleteProfileModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<ProfileFormData>({
    basicInfo: {
      name: "",
      mobile: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      country: "",
      state: "",
      city: "",
    },
    socialProfiles: {
      github: "",
      linkedin: "",
      dribbble: "",
      behance: "",
      portfolio: "",
    },
    skills: [],
    experience: [],
    education: [],
    certifications: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    basic: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
  };

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

  const updateFormData = (section: keyof ProfileFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  // // Debounced validation function
  // const validateForm = debounce(() => {
  //   try {
  //     profileFormSchema.parse(formData);
  //     setErrors({});
  //   } catch (err) {
  //     if (err instanceof ZodError) {
  //       const fieldErrors: { [key: string]: string } = {};
  //       err.errors.forEach((error) => {
  //         const path = error.path.join(".");
  //         fieldErrors[path] = error.message;
  //       });
  //       setErrors(fieldErrors);
  //     }
  //   }
  // }, 500); // 500ms debounce

  // useEffect(() => {
  //   validateForm();
  //   // Cleanup debounce on unmount
  //   return () => {
  //     validateForm.cancel();
  //   };
  // }, [formData]);

  const handleSave = () => {
    try {
      profileFormSchema.parse(formData);
      // If validation passes
      onSave(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          const path = error.path.join(".");
          fieldErrors[path] = error.message;
        });
        setErrors(fieldErrors);

        // Navigate to the first error section
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-hidden ">
      <div className="bg-white rounded-md w-full max-w-3xl h-[90vh] flex flex-col p-6">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
              <p className="text-gray-600">
                Enter your goal and tailor your learning path.
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
                className={`pb-2 pt-2 px-4 relative  ${
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
            <SkillsForm
              skills={formData.skills}
              onChange={(skills) => updateFormData("skills", skills)}
              errors={errors}
            />
          </div>

          {/* Experience Section */}
          <div ref={sectionRefs.experience} className="py-6">
            <ExperienceForm
              experiences={formData.experience}
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
              onChange={(education) => {
                updateFormData("education", education);
              }}
              errors={errors}
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t bg-white text-right justify-end ">
          <button
            onClick={handleSave}
            className=" bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}
