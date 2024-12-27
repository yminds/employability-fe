import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Education, ProfileFormData } from "../../features/profile/types";
import BasicInfoForm from "../forms/basic-info-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "../forms/experience-form";
import EducationForm from "../forms/education-form";
import { profileFormSchema } from "../../features/profile/shemas/profileFormSchema";
import CertificationsForm from "../forms/certification-form";
import { ZodError } from "zod";
import debounce from "lodash.debounce"; // Install lodash.debounce
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useVerifySkillsMutation } from "@/api/skillApiSlice";
import { transformFormDataForDB } from "@/utils/transformData";
import { useUpdateUserMutation } from "@/api/userApiSlice";

interface CompleteProfileModalProps {
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
  type: string;
  userId?: string; // or userId: string if always required
}
interface VerifiedSkill {
  _id: string;
  name: string;
  description: string;
}

export default function CompleteProfileModal({
  onClose,
  onSave,
  type,
  userId,
}: CompleteProfileModalProps) {
  const data = useSelector((state: RootState) => state.resume.parsedData);
  const [updateUser] = useUpdateUserMutation();

  console.log(userId);

  const [verifySkills, { isLoading: isVerifyingSkills }] =
    useVerifySkillsMutation();
  const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkill[]>([]);

  // const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkill[]>([]);
  // const [isVerifyingSkills, setIsVerifyingSkills] = useState(false);

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<any>({ });

  const transformData = async (data: any) => {
    let validatedSkills: VerifiedSkill[] = [];
    if (data.skills && data.skills.length > 0) {
      try {
        const normalizedSkills = data.skills.map((skill: string) =>
          skill.toLowerCase()
        );
        const response = await verifySkills(normalizedSkills).unwrap();
        validatedSkills = response.data;
      } catch (error) {
        console.error("Error verifying skills:", error);
      }
    }

    // Helper function to transform date from "Month, Year" to "YYYY-MM"
    const transformDate = (dateStr: string) => {
      if (!dateStr) return "";
      if (dateStr === "Present") return null;

      try {
        // Handle dates in "Month Year" or "Month, Year" format
        const parts = dateStr.replace(",", "").trim().split(" ");
        if (parts.length !== 2) {
          // console.error("Invalid date format:", dateStr);
          return "";
        }

        const [monthStr, yearStr] = parts;
        const monthNames: { [key: string]: string } = {
          January: "01",
          February: "02",
          March: "03",
          April: "04",
          May: "05",
          June: "06",
          July: "07",
          August: "08",
          September: "09",
          October: "10",
          November: "11",
          December: "12",
        };

        const month = monthNames[monthStr];
        if (!month) {
          console.error("Invalid month:", monthStr);
          return "";
        }

        return `${yearStr}-${month}`;
      } catch (error) {
        console.error("Error parsing date:", dateStr);
        return "";
      }
    };

    return {
      basicInfo: {
        name: data.name || "",
        mobile: data.contact?.phone || "",
        email: data.contact?.email || "",
        dateOfBirth: "",
        gender: "",
        country: "",
        state: "",
        city: "",
      },
      socialProfiles: {
        github: data.contact?.github || "",
        linkedin: data.contact?.linkedin || "",
        dribbble: "",
        behance: "",
        portfolio: data.contact?.portfolio || "",
      },
      skills: validatedSkills,
      experience:
        data.experience?.map((exp: any) => {
          // console.log("Processing experience:", exp); // Debug log
          const startDate = transformDate(exp.startDate);
          const endDate =
            exp.endDate === "Present" ? null : transformDate(exp.endDate);
          // console.log("Transformed dates:", { startDate, endDate }); // Debug log

          return {
            id: Date.now().toString(),
            jobTitle: exp.jobTitle || "",
            companyName: exp.company || "",
            employmentType: "",
            companyLogo: "",
            location: exp.location || "",
            startDate,
            endDate,
            currentlyWorking: exp.endDate === "Present",
            currentCTC: "",
            expectedCTC: "",
            description: exp.responsibilities?.join("\n") || "",
            jobType: undefined,
            isVerified: undefined,
            duration: undefined,
          };
        }) || [],
      education:
        data.education?.map((edu: any) => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          location: edu.location || "",
          graduationYear: edu.graduationYear || "",
        })) || [],
      certifications:
        data.certifications?.map((cert: any) => ({
          name: cert.name || "",
          issuer: cert.issuer || "",
          dateObtained: cert.dateObtained || "",
          expiryDate: cert.expiryDate || "",
        })) || [],
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      if (data) {
        try {
          const transformedData = await transformData(data);
          setFormData(transformedData);
          console.log("Transformed data:", transformedData);
        } catch (error) {
          console.error("Error transforming data:", error);
        }
      }
    };

    initializeData();
  }, [data]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    basic: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    certification: useRef<HTMLDivElement>(null),
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
    setFormData((prev: any) => ({
      ...prev,
      [section]: data,
    }));
  };



  const handleSave = async () => {
    console.log(formData);

    try {
      console.log("button clicked");

      const transformedData = transformFormDataForDB(formData);
      console.log(transformedData);

      const response = await fetch(
        `http://localhost:3000/api/v1/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      console.log("API Response:", result);

      // const result = await updateUser({
      //   userId,
      //   data: transformData,
      // }).unwrap();

      // console.log("Update successful:", result);
      onClose(); // to close the modal after submission
      // onSave(formData);
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
              experiences={formData.experience}
              onChange={(experience: any) =>
                updateFormData("experience", experience)
              }
            />
          </div>

          {/* Education Section */}
          <div ref={sectionRefs.education} className="py-6">
            <EducationForm
              education={formData.education}
              onChange={(education: any) => {
                updateFormData("education", education);
              } }
              errors={errors} onAddEducation={function (newEducation: Education): void {
                throw new Error("Function not implemented.");
              } } onDeleteEducation={function (educationId: string): void {
                throw new Error("Function not implemented.");
              } }            />
          </div>

          <div ref={sectionRefs.certification} className="py-6">
            <CertificationsForm
              certifications={formData.certifications}
              onChange={(certification) => {
                updateFormData("certifications", certification);
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
