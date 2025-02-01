import { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Education, type ProfileFormData } from "../../features/profile/types";
import BasicInfoForm from "../forms/basic-info-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "@/features/profile/forms/experience-form";
import EducationForm from "../forms/education-form";
import { profileFormSchema } from "../../features/profile/shemas/profileFormSchema";
import CertificationsForm from "../forms/certification-form";
import { ZodError } from "zod";
import throttle from "lodash.throttle"; // Install lodash.debounce
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { useVerifySkillsMutation } from "@/api/skillApiSlice";
import { transformFormDataForDB } from "@/utils/transformData";
import { useUpdateUserMutation } from "@/api/userApiSlice";
import { useAddExperienceMutation } from "@/api/experienceApiSlice";
import { useUpdateExperienceMutation } from "@/api/experienceApiSlice";
import { useAddEducationMutation } from "@/api/educationSlice";
import { useUpdateEducationMutation } from "@/api/educationSlice";
import { useAddCertificationMutation } from "@/api/certificatesApiSlice";
import { useUpdateCertificationMutation } from "@/api/certificatesApiSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/features/authentication/authSlice";
import { validateExperience } from "@/features/profile/validation/validateExperience";
import { validateEducation } from "@/features/profile/validation/validateEducation";
import { validateCertifications } from "@/features/profile/validation/validateCertification";
import { useGetExperiencesByUserIdQuery } from "@/api/experienceApiSlice";
import { useGetEducationByIdQuery } from "@/api/educationSlice";
import { useGetCertificationsByUserIdQuery } from "@/api/certificatesApiSlice";
import { parseAddress } from "@/utils/addressParser";

interface CompleteProfileModalProps {
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
  type: string;
  userId: string; // or userId: string if always required
  parsedData?: any;
  isParsed: boolean;
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
  parsedData,
  isParsed,
}: CompleteProfileModalProps) {
  const user = useSelector((state: any) => state.auth.user);
  const resume = useSelector((state:any) => state.resume.parsedData)

  console.log("Resume", resume);
  

  const data = parsedData;

  const { data: fetchedExperiences } = useGetExperiencesByUserIdQuery(userId);
  const { data: fetchedEducation } = useGetEducationByIdQuery(userId);
  const { data: fetchedCertification } =
    useGetCertificationsByUserIdQuery(userId);

  const [updateUser] = useUpdateUserMutation();
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [addCertification] = useAddCertificationMutation();
  const [updateCertification] = useUpdateCertificationMutation();
  const dispatch = useDispatch();

  const [verifySkills, { isLoading: isVerifyingSkills }] =
    useVerifySkillsMutation();
  const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkill[]>([]);

  // const [verifiedSkills, setVerifiedSkills] = useState<VerifiedSkill[]>([]);
  // const [isVerifyingSkills, setIsVerifyingSkills] = useState(false);

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<any>({});

  const parsedBasicData = isParsed
  ? (() => {
      const address = resume?.contact.address || ""
      const { city, stateCode, countryCode } = parseAddress(address)
      
      return {
        basicInfo: {
          name: resume?.name || "",
          mobile: resume?.contact?.phone || "",
          email: user.email || "",
          date_of_birth: resume?.date_of_birth || "",
          gender: resume?.gender || "",
          country: countryCode,
          state: stateCode,
          city: city,
          profile_image: resume?.profile_image || "",
        },
        socialProfiles: {
          gitHub: resume?.contact?.github || "",
          linkedIn: resume?.contact?.linkedin || "",
          portfolio: resume?.contact?.portfolio || "",
        },
      }
    })()
  : {
      basicInfo: {
        name: user.name || "",
        mobile: user.phone_number || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        country: user.address.country || "",
        state: user.address.state || "",
        city: user.address.city || "",
        profile_image: user.profile_image || "",
      },
      socialProfiles: {
        gitHub: user.github || "",
        linkedIn: user.linkedIn || "",
        portfolio: user.portfolio || "",
      },
    }

  const [isScrolling, setIsScrolling] = useState(false);

  const transformData = async (data: any) => {
    // let validatedSkills: VerifiedSkill[] = [];
    // if (data.skills && data.skills.length > 0) {
    //   try {
    //     const normalizedSkills = data.skills.map((skill: string) =>
    //       skill.toLowerCase()
    //     );
    //     const response = await verifySkills(normalizedSkills).unwrap();
    //     validatedSkills = response.data;
    //   } catch (error) {
    //     console.error("Error verifying skills:", error);
    //   }
    // }

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
        date_of_birth: "",
        gender: "",
        country: "",
        state: "",
        city: "",
        profile_image: "",
      },
      socialProfiles: {
        gitHub: data.contact?.github || "",
        linkedIn: data.contact?.linkedIn || "",
        portfolio: data.contact?.portfolio || "",
      },
      // skills: validatedSkills,
      skills: [],
      experience:
        data.experience?.map((exp: any) => {
          const startDate = transformDate(exp.startDate);
          const endDate =
            exp.endDate === "Present" ? null : transformDate(exp.endDate);
          return {
            title: exp.jobTitle || "",
            employment_type: "",
            company: exp.company || "",
            location: exp.location || "",
            start_date: startDate,
            end_date: endDate,
            currently_working: exp.endDate === "Present",
            description: exp.responsibilities?.join("\n") || "",
            current_ctc: "",
            expected_ctc: "",
            companyLogo: "",
            isVerified: undefined,
          };
        }) || [],
      education:
        data.education?.map((edu: any) => ({
          education_level: "",
          degree: edu.degree || "",
          institute: edu.institution || "",
          board_or_certification: "",
          from_date: "",
          till_date: "",
          cgpa_or_marks: "",
          // location: edu.location || "",
          // till_date: edu.graduationYear || "",
        })) || [],
      certifications:
        data.certifications?.map((cert: any) => ({
          title: cert.name || "",
          issued_by: cert.issuer || "",
          issue_date: transformDate(cert.dateObtained) || "",
          expiration_date: transformDate(cert.expiryDate) || "",
          certificate_s3_url: "",
        })) || [],
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      if (data) {
        console.log("==============================");

        try {
          const transformedData = await transformData(data);
          setFormData((prevData: any) => ({
            ...prevData,
            ...transformedData,
          }));
          console.log("Transformed data:", transformedData);
          console.log("Form data", formData);

          console.log("==============================");
        } catch (error) {
          console.error("Error transforming data:", error);
        }
      }
    };

    initializeData();
  }, [data]);

  useEffect(() => {
    if (fetchedExperiences) {
      setFormData((prevData: any) => ({
        ...prevData,
        experience: fetchedExperiences.data.map((exp: any) => ({
          id: exp._id,
          title: exp.title,
          employment_type: exp.employment_type,
          company: exp.company,
          location: exp.location,
          start_date: exp.start_date,
          end_date: exp.end_date,
          currently_working: exp.currently_working,
          description: exp.description,
          current_ctc: exp.current_ctc,
          expected_ctc: exp.expected_ctc,
          companyLogo: exp.companyLogo || "",
          isVerified: exp.isVerified || false,
        })),
      }));
    }
  }, [fetchedExperiences]);

  useEffect(() => {
    if (fetchedEducation) {
      setFormData((prevData: any) => ({
        ...prevData,
        education: fetchedEducation.data.map((edu: any) => ({
          id: edu._id,
          education_level: edu.education_level,
          degree: edu.degree,
          institute: edu.institute,
          board_or_certification: edu.board_or_certification,
          from_date: edu.from_date,
          till_date: edu.till_date,
          cgpa_or_marks: edu.cgpa_or_marks,
        })),
      }));
    }
  }, [fetchedEducation]);

  useEffect(() => {
    if (fetchedCertification) {
      setFormData((prevData: any) => ({
        ...prevData,
        certifications: fetchedCertification.data.map((cert: any) => ({
          id: cert._id,
          title: cert.title,
          issued_by: cert.issued_by,
          issue_date: cert.issue_date,
          expiration_date: cert.expiration_date,
          certificate_s3_url: cert.certificate_s3_url,
        })),
      }));
    }
  }, [fetchedCertification]);

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
    setIsScrolling(true);
    sectionRefs[tab as keyof typeof sectionRefs]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => setIsScrolling(false), 1000); // Adjust the delay as needed
  };

  const handleScroll = useCallback(
    throttle(() => {
      if (!containerRef.current || isScrolling) return;

      const container = containerRef.current;
      const scrollPosition = container.scrollTop;
      const offset = 100; // Adjust this value as needed

      let closestSection = "";
      let minDistance = Number.POSITIVE_INFINITY;

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (!ref.current) return;
        const element = ref.current;
        const { top } = element.getBoundingClientRect();
        const distance = Math.abs(top - offset);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = key;
        }
      });

      if (closestSection !== activeTab) {
        setActiveTab(closestSection);
      }
    }, 100),
    [activeTab, isScrolling]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const updateFormData = (section: keyof ProfileFormData, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: data,
    }));
  };

  const validateForm = (): boolean => {
    const experienceErrors = validateExperience(formData.experience || []);
    const educationErrors = validateEducation(formData.education || []);
    const certificationErrors = validateCertifications(
      formData.certifications || []
    );

    const newErrors = {
      ...experienceErrors,
      ...educationErrors,
      ...certificationErrors,
    };

    setErrors(newErrors);
    setTimeout(() => setErrors({}), 2000);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log(formData);

    try {
      console.log("button clicked");

      if (!validateForm()) {
        return;
      }

      const transformedData = transformFormDataForDB(formData);

      // Add new experiences
      if (transformedData.experience && transformedData.experience.length > 0) {
        await Promise.all(
          transformedData.experience.map(async (exp: any) => {
            console.log("exp", exp);

            const experienceData = {
              user_id: userId,
              title: exp.title,
              employment_type: exp.employment_type,
              company: exp.company,
              location: exp.location,
              start_date: exp.start_date,
              end_date: exp.currently_working ? null : exp.end_date,
              currently_working: exp.currently_working,
              description: exp.description,
              current_ctc: exp.current_ctc,
              expected_ctc: exp.expected_ctc,
            };
            if (exp._id) {
              // Update existing experience

              await updateExperience({
                id: exp._id,
                updatedExperience: experienceData,
              }).unwrap();
            } else {
              // Add new experience
              await addExperience(experienceData).unwrap();
            }
          })
        );
      }

      // Add new education entries
      if (transformedData.education && transformedData.education.length > 0) {
        await Promise.all(
          transformedData.education.map(async (edu: any) => {
            const educationData = {
              user_id: userId,
              education_level: edu.education_level,
              degree: edu.degree,
              institute: edu.institute,
              from_date: edu.from_date,
              till_date: edu.till_date,
              cgpa_or_marks: edu.cgpa_or_marks,
            };
            if (edu._id) {
              // Update existing education
              await updateEducation({
                id: edu._id,
                updatedEducation: educationData,
              }).unwrap();
            } else {
              // Add new education
              await addEducation(educationData).unwrap();
            }
          })
        );
      }

      // Update or add certification entries
      if (
        transformedData.certificates &&
        transformedData.certificates.length > 0
      ) {
        await Promise.all(
          transformedData.certificates.map(async (cert: any) => {
            const certificationData = {
              user_id: userId,
              title: cert.title,
              issued_by: cert.issued_by,
              issue_date: cert.issue_date,
              expiration_date: cert.expiration_date,
              certificate_s3_url: cert.certificate_s3_url,
            };
            if (cert._id) {
              // Update existing certification
              await updateCertification({
                id: cert._id,
                updatedCertification: certificationData,
              }).unwrap();
            } else {
              // Add new certification
              await addCertification(certificationData).unwrap();
            }
          })
        );
      }

      console.log("Transformde data complete", transformedData);

      const { experience, education, certificates, ...updatedUserData } =
        transformedData;

      const response = await fetch(
        `http://localhost:3000/api/v1/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      // const response = await updateUser({
      //   userId,
      //   data: updatedUserData,
      // }).unwrap();

      dispatch(
        updateUserProfile({
          ...updatedUserData,
          profile_image: transformedData.profile_image ?? "",
        })
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // const result = await response.json();
      // console.log("API Response:", result);

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
    { id: "certification", label: "Certifications" },
  ];
  console.log("Form Data in complete last", formData);

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white rounded-lg max-w-4xl p-[42px] flex flex-col justify-center">
        <DialogHeader className="w-full flex justify-between items-start">
          <div className="flex flex-col items-start">
            <DialogTitle className="text-black text-[20px] font-medium leading-[26px] tracking-[-0.2px] font-ubuntu">
              Complete Your Profile
            </DialogTitle>
            <p
              className="text-[16px] font-normal leading-6 tracking-[0.24px]"
              style={{
                color: "rgba(0, 0, 0, 0.60)",
                fontFamily: '"SF Pro Display", sans-serif',
              }}
            >
              Enter your goal and tailor your learning path.
            </p>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex mt-6 justify-between bg-gray-100 text-center rounded-lg overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`pb-2 pt-2 px-4 relative flex-1 ${
                activeTab === tab.id
                  ? "text-[#00183D] font-semibold bg-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00183D] rounded-t" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div
          ref={containerRef}
          className="flex-1 max-h-[calc(98vh-300px)] overflow-y-auto pr-6 minimal-scrollbar scroll-smooth snap-y snap-mandatory"
          onScroll={handleScroll}
        >
          {/* Basic Info Section */}
          <div ref={sectionRefs.basic} className="py-6 snap-start">
            <BasicInfoForm
              // basicData={formData?.basicInfo}
              // socialData={formData.socialProfiles}
              onChange={(basicInfo, socialProfiles) => {
                updateFormData("basicInfo", basicInfo);
                updateFormData("socialProfiles", socialProfiles);
              }}
              errors={errors}
              initialData={{
                basicInfo: parsedBasicData.basicInfo,
                socialProfiles: parsedBasicData.socialProfiles,
              }}
            />
          </div>

          {/* Skills Section */}
          <div ref={sectionRefs.skills} className="snap-start">
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] py-6">
              Skills
            </h2>
            {isVerifyingSkills ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-2 text-gray-600">Verifying skills...</span>
              </div>
            ) : (
              <SkillsForm
                skills={formData?.skills}
                onChange={(skills) => updateFormData("skills", skills)}
                errors={errors}
              />
            )}
          </div>

          {/* Experience Section */}
          <div ref={sectionRefs.experience} className="snap-start">
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] py-6">
              Experience
            </h2>
            <ExperienceForm
              experience={formData?.experience || []}
              onChange={(updatedExperience) =>
                updateFormData("experience", updatedExperience)
              }
              errors={errors}
              onAddExperience={() => {
                const newExperience = {
                  id: "",
                  title: "",
                  employment_type: "",
                  location: "",
                  start_date: "",
                  end_date: "",
                  currently_working: false,
                  description: "",
                  company: "",
                  isVerified: false,
                  companyLogo: "",
                  current_ctc: 0,
                  expected_ctc: 0,
                };
                updateFormData("experience", [
                  ...(formData?.experience || []),
                  newExperience,
                ]);
              }}
              onDeleteExperience={(index) => {
                const updatedExperience = formData?.experience.filter(
                  (_: any, i: number) => i !== index
                );
                updateFormData("experience", updatedExperience);
              }}
              mode="add"
            />
          </div>

          {/* Education Section */}
          <div ref={sectionRefs.education} className="snap-start">
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] py-6">
              Education
            </h2>
            <EducationForm
              education={formData?.education || []}
              onChange={(updatedEducation) =>
                updateFormData("education", updatedEducation)
              }
              errors={errors}
              onAddEducation={() => {
                const newEducation = {
                  id: "",
                  education_level: "",
                  degree: "",
                  institute: "",
                  board_or_certification: "",
                  from_date: "",
                  till_date: "",
                  cgpa_or_marks: "",
                };
                updateFormData("education", [
                  ...(formData?.education || []),
                  newEducation,
                ]);
              }}
              onDeleteEducation={(index) => {
                const updatedEducation = formData?.education.filter(
                  (_: any, i: number) => i !== index
                );
                updateFormData("education", updatedEducation);
              }}
              mode="add"
            />
          </div>

          <div ref={sectionRefs.certification} className="snap-start">
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] py-6">
              Certification
            </h2>
            <CertificationsForm
              certifications={formData?.certifications || []}
              onChange={(updatedCertifications) =>
                updateFormData("certifications", updatedCertifications)
              }
              errors={errors}
              onAddCertification={() => {
                const newCertification = {
                  id: "",
                  title: "",
                  issued_by: "",
                  issue_date: "",
                  expiration_date: "",
                  certificate_s3_url: "",
                };
                updateFormData("certifications", [
                  ...(formData?.certifications || []),
                  newCertification,
                ]);
              }}
              onDeleteCertification={(index) => {
                const updatedCertifications = formData?.certifications.filter(
                  (_: any, i: number) => i !== index
                );
                updateFormData("certifications", updatedCertifications);
              }}
              mode="add"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <Button
          onClick={handleSave}
          className="w-full mt-6 bg-[#00183D] hover:bg-[#062549] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Save Details
        </Button>
      </DialogContent>
    </Dialog>
  );
}
