"use client";

import { useState, useEffect } from "react";
import type { ProfileFormData } from "../../features/profile/types";
import BasicInfoForm from "../forms/basic-info-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "@/features/profile/forms/experience-form";
import EducationForm from "../forms/education-form";
import CertificationsForm from "../forms/certification-form";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation } from "@/api/userApiSlice";
import {
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useGetExperiencesByUserIdQuery,
} from "@/api/experienceApiSlice";
import {
  useAddEducationMutation,
  useUpdateEducationMutation,
  useGetEducationByIdQuery,
} from "@/api/educationSlice";
import {
  useAddCertificationMutation,
  useUpdateCertificationMutation,
  useGetCertificationsByUserIdQuery,
} from "@/api/certificatesApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { validateExperience } from "@/features/profile/validation/validateExperience";
import { validateEducation } from "@/features/profile/validation/validateEducation";
import { validateCertifications } from "@/features/profile/validation/validateCertification";
import { parseAddress } from "@/utils/addressParser";
import {
  useCreateUserSkillsMutation,
  useGetUserSkillsMutation,
} from "@/api/skillsApiSlice";
import { useVerifyMultipleSkillsMutation } from "@/api/skillsPoolApiSlice";
import { parsedTransformData } from "@/utils/parsedTransformData";
import { validateBasicInfo } from "@/features/profile/validation/validateBasicInfo";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { updateUserProfile } from "@/features/authentication/authSlice";
import { ZodError } from "zod";
import { transformFormDataForDB } from "@/utils/transformData";

interface CompleteProfileModalProps {
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
  type: string;
  userId: string;
  parsedData?: any;
  isParsed: boolean;
  goalId: string;
  refetchUserDetails:()=> Promise<void>
}

export default function CompleteProfileModal({
  onClose,
  onSave,
  type,
  userId,
  parsedData,
  isParsed,
  goalId,
  refetchUserDetails
}: CompleteProfileModalProps) {
  const user = useSelector((state: any) => state.auth.user);
  // const resume = useSelector((state: any) => state.resume.parsedData);
  const dispatch = useDispatch();

  const data = user.parsedResume;

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<any>({});
  const [isFresher, setIsFresher] = useState(!user.is_experienced);
  const [hasCertifications, setHasCertifications] = useState(
    !user.has_certificates
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [parsedSkills, setParsedSkills] = useState<any[]>([]);

  const { data: fetchedExperiences } = useGetExperiencesByUserIdQuery(userId);
  const { data: fetchedEducation } = useGetEducationByIdQuery(userId);
  const { data: fetchedCertification } =
    useGetCertificationsByUserIdQuery(userId);

  const [getUserSkills] = useGetUserSkillsMutation();
  const [getVerifySkills] = useVerifyMultipleSkillsMutation();
  const [updateUser] = useUpdateUserMutation();
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [addCertification] = useAddCertificationMutation();
  const [updateCertification] = useUpdateCertificationMutation();
  const [createUserSkills] = useCreateUserSkillsMutation();

  const parsedBasicData = !user.is_basic_info
    ? (() => {
        if (!data) {
          return {
            basicInfo: {
              name: user.name || "",
              mobile: user.phone_number || "",
              email: user.email || "",
              date_of_birth: user.date_of_birth || "",
              gender: user.gender || "",
              country: user?.address?.country || "",
              state: user?.address?.state || "",
              city: user?.address?.city || "",
              profile_image: user.profile_image || "",
            },
            socialProfiles: {
              gitHub: user.github || "",
              linkedIn: user.linkedIn || "",
              portfolio: user.portfolio || "",
            },
          };
        }

        const address = data?.contact?.address || "";
        const { city, stateCode, countryCode } = parseAddress(address);

        return {
          basicInfo: {
            name: data?.name || "",
            mobile: user.phone_number || "",
            email: user.email || "",
            date_of_birth: data?.date_of_birth || "",
            gender: data?.gender || "",
            country: countryCode,
            state: stateCode,
            city: city,
            profile_image: data?.profile_image || "",
          },
          socialProfiles: {
            gitHub: data?.contact?.github || "",
            linkedIn: data?.contact?.linkedin || "",
            portfolio: data?.contact?.portfolio || "",
          },
        };
      })()
    : {
        basicInfo: {
          name: user.name || "",
          mobile: user.phone_number || "",
          email: user.email || "",
          date_of_birth: user.date_of_birth || "",
          gender: user.gender || "",
          country: user?.address?.country || "",
          state: user?.address?.state || "",
          city: user?.address?.city || "",
          profile_image: user.profile_image || "",
        },
        socialProfiles: {
          gitHub: user.github || "",
          linkedIn: user.linkedIn || "",
          portfolio: user.portfolio || "",
        },
      };

  useEffect(() => {
    const initializeData = async () => {
      let transformedData = {
        skills: [],
        experience: [],
        education: [],
        certifications: [],
      };

      if (data) {
        try {
          const result = await getVerifySkills(data.skills).unwrap();
          transformedData = await parsedTransformData(data, result.data);
          console.log("TransformedData", transformedData);

          setParsedSkills(transformedData.skills);
        } catch (error) {
          console.error("Error transforming data:", error);
        }
      }

      setFormData((prevData: any) => ({
        ...prevData,
        skills:
          transformedData.skills.length > 0
            ? transformedData.skills
            : [
                {
                  skill_Id: "",
                  name: "",
                  rating: 0,
                  level: "1",
                  visibility: "All users",
                },
              ],
        experience:
          fetchedExperiences?.data?.length > 0
            ? fetchedExperiences.data
            : transformedData.experience.length > 0
            ? transformedData.experience
            : [
                {
                  title: "",
                  employment_type: "",
                  company: "",
                  location: "",
                  start_date: "",
                  end_date: "",
                  currently_working: false,
                  description: "",
                  current_ctc: "",
                  expected_ctc: "",
                  companyLogo: "",
                  isVerified: undefined,
                },
              ],
        education:
          fetchedEducation?.data?.length > 0
            ? fetchedEducation.data
            : transformedData.education.length > 0
            ? transformedData.education
            : [
                {
                  education_level: "",
                  degree: "",
                  institute: "",
                  board_or_certification: "",
                  from_date: "",
                  till_date: "",
                  cgpa_or_marks: "",
                },
              ],
        certifications:
          fetchedCertification?.data?.length > 0
            ? fetchedCertification.data
            : transformedData.certifications.length > 0
            ? transformedData.certifications
            : [
                {
                  title: "",
                  issued_by: "",
                  issue_date: "",
                  expiration_date: "",
                  certificate_s3_url: "",
                },
              ],
      }));
    };

    initializeData();
  }, [
    fetchedExperiences,
    fetchedEducation,
    fetchedCertification,
    getVerifySkills,
  ]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (userId && goalId) {
          const response = await getUserSkills({ userId, goalId }).unwrap();
          if (response?.data.optional && response.data.optional.length > 0) {
            setFormData((prevData: any) => ({
              ...prevData,
              skills: response.data.optional.map((skill: any) => ({
                skill_Id: skill.skill_pool_id._id,
                name: skill.skill_pool_id.name,
                rating: skill.self_rating,
                level: skill.level,
                visibility: "All users",
              })),
            }));
          } else if (parsedSkills.length > 0) {
            setFormData((prevData: any) => ({
              ...prevData,
              skills: parsedSkills,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [userId, goalId, getUserSkills, parsedSkills]);

  const updateFormData = (section: keyof ProfileFormData, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: data,
    }));
  };

  const validateSection = (section: string): boolean => {
    let sectionErrors: { [key: string]: string } = {};

    switch (section) {
      case "basic":
        sectionErrors = validateBasicInfo(formData.basicInfo || {});
        break;
      case "skills":
        // Add skills validation if needed
        break;
      case "experience":
        sectionErrors = validateExperience(formData.experience || []);
        break;
      case "education":
        sectionErrors = validateEducation(formData.education || []);
        break;
      case "certification":
        sectionErrors = validateCertifications(formData.certifications || []);
        break;
      default:
        break;
    }

    setErrors(sectionErrors);
    setTimeout(() => setErrors({}), 2000);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleSaveSection = async (section: string) => {
    if (!validateSection(section)) {
      return;
    }

    console.log("Clicked");

    try {
      const transformedData = transformFormDataForDB(formData);
      transformedData.is_experienced = !isFresher;

      switch (section) {
        case "basic":
          const {
            experience,
            education,
            certificates,
            skills,
            ...updatedUserData
          } = transformedData;

          try {
            const response = await updateUser({
              userId,
              data: updatedUserData,
            }).unwrap();

            if (response.error) {
              throw new Error("Failed to update user");
            }

            dispatch(
              updateUserProfile({
                ...updatedUserData,
                profile_image: transformedData.profile_image ?? "",
              })
            );
            await refetchUserDetails();
          } catch (error) {
            console.error(
              "Error saving basic info and social profiles:",
              error
            );
            throw error;
          }
          break;
        case "skills":
          if (transformedData.skills && transformedData.skills.length > 0) {
            const skillsPayload = {
              user_id: userId,
              skills: transformedData.skills,
              goal_id: goalId,
            };
            await createUserSkills(skillsPayload).unwrap();
          }
          break;
        case "experience":
          if (isFresher) {
            transformedData.experience = [];
            dispatch(
              updateUserProfile({
                ...user,
                is_experienced: false,
                parsedResume: {
                  ...user.parsedResume,
                  experience: [],
                },
              })
            );
            await updateUser({
              userId,
              data: {
                is_experienced: false,
                parsedResume: {
                  ...user.parsedResume,
                  experience: [],
                },
              },
            }).unwrap();
          } else {
            dispatch(
              updateUserProfile({
                ...user,
                is_experienced: true,
              })
            );
            await updateUser({
              userId,
              data: {
                is_experienced: true,
              },
            }).unwrap();

            if (
              transformedData.experience &&
              transformedData.experience.length > 0
            ) {
              const newExperienceIds: any[] = [];
              await Promise.all(
                transformedData.experience.map(async (exp: any) => {
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
                    await updateExperience({
                      id: exp._id,
                      updatedExperience: experienceData,
                    }).unwrap();
                  } else {
                    const response = await addExperience(
                      experienceData
                    ).unwrap();
                    newExperienceIds.push(response.data._id);
                  }
                })
              );
              if (newExperienceIds.length > 0) {
                dispatch(
                  updateUserProfile({
                    experience: [...user.experience, ...newExperienceIds],
                  })
                );
              }
            }
          }
          await refetchUserDetails()
          break;
        case "education":
          if (
            transformedData.education &&
            transformedData.education.length > 0
          ) {
            const newEducationIds: any[] = [];
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
                  await updateEducation({
                    id: edu._id,
                    updatedEducation: educationData,
                  }).unwrap();
                } else {
                  const response = await addEducation(educationData).unwrap();
                  newEducationIds.push(response.data._id);
                }
              })
            );
            if (newEducationIds.length > 0) {
              dispatch(
                updateUserProfile({
                  education: [...user.education, ...newEducationIds],
                })
              );
            }
          }
          await refetchUserDetails()
          break;
        case "certification":
          if (hasCertifications) {
            transformedData.certificates = [];
            dispatch(
              updateUserProfile({
                ...user,
                has_certificates: false,
                parsedResume: {
                  ...user.parsedResume,
                  certificates: [],
                },
              })
            );
            await updateUser({
              userId,
              data: {
                has_certificates: false,
                parsedResume: {
                  ...user.parsedResume,
                  certificates: [],
                },
              },
            }).unwrap();
          } else {
            dispatch(
              updateUserProfile({
                ...user,
                has_certificates: true,
              })
            );
            await updateUser({
              userId,
              data: {
                has_certificates: true,
              },
            }).unwrap();
            if (
              transformedData.certificates &&
              transformedData.certificates.length > 0
            ) {
              const newCertificateIds: any[] = [];
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
                    await updateCertification({
                      id: cert._id,
                      updatedCertification: certificationData,
                    }).unwrap();
                  } else {
                    const response = await addCertification(
                      certificationData
                    ).unwrap();
                    newCertificateIds.push(response.data._id);
                  }
                })
              );
              if (newCertificateIds.length > 0) {
                dispatch(
                  updateUserProfile({
                    certificates: [...user.certificates, ...newCertificateIds],
                  })
                );
              }
            }
          }
          await refetchUserDetails()
          break;
        default:
          throw new Error("Invalid section");
      }

      console.log(`${section} section saved successfully`);

      // Move to the next tab after saving
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      } else {
        onClose();
      }
    } catch (err) {
      console.error(`Error saving ${section} section:`, err);
      if (err instanceof ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          const path = error.path.join(".");
          fieldErrors[path] = error.message;
        });
        setErrors(fieldErrors);
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

  const handleDelete = async (
    section: keyof ProfileFormData,
    index: number
  ) => {
    const updatedData = formData[section].filter(
      (_: any, i: number) => i !== index
    );
    const deletedItem = formData[section][index];
    updateFormData(section, updatedData);

    try {
      if (section === "skills") {
        if (deletedItem.transformedSkill) {
          await updateUserParsedResume(section, updatedData);
        }
      } else if (!deletedItem._id) {
        await updateUserParsedResume(section, updatedData);
      }
    } catch (error) {
      console.error(`Error deleting ${section}:`, error);
    }
  };

  const updateUserParsedResume = async (
    section: string,
    updatedData: any[]
  ) => {
    const response = await updateUser({
      userId,
      data: {
        parsedResume: {
          ...user.parsedResume,
          [section]: updatedData,
        },
      },
    }).unwrap();

    if (response.error) {
      throw new Error(`Failed to update user ${section}`);
    }

    dispatch(
      updateUserProfile({
        ...user,
        parsedResume: {
          ...user.parsedResume,
          [section]: updatedData,
        },
      })
    );
  };

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
              onClick={() => setActiveTab(tab.id)}
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

        {/* Content Area */}
        <div className="flex-1 max-h-[calc(98vh-300px)] overflow-y-auto pr-6 minimal-scrollbar scroll-smooth snap-y snap-mandatory">
          {activeTab === "basic" && (
            <div className="py-6">
              <BasicInfoForm
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
          )}

          {activeTab === "skills" && (
            <div>
              <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] py-6">
                Skills
              </h2>
              <SkillsForm
                skills={formData?.skills}
                onChange={(skills) => updateFormData("skills", skills)}
                errors={errors}
                goalId={goalId}
                userId={userId}
                onDeleteSkill={(index) => handleDelete("skills", index)}
              />
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <div className="flex justify-between items-center py-6">
                <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]">
                  Experience
                </h2>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="isFresher"
                    checked={isFresher}
                    disabled={fetchedExperiences?.data?.length > 0}
                    onChange={(e) => {
                      setIsFresher(e.target.checked);
                      if (e.target.checked) {
                        updateFormData("experience", []);
                      } else {
                        updateFormData(
                          "experience",
                          formData?.experience || []
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor="isFresher"
                    className={`text-[#68696B] font-sf-pro text-sm font-normal leading-6 tracking-[0.21px] ${
                      fetchedExperiences?.data?.length > 0 ? "opacity-50" : ""
                    }`}
                  >
                    I am a Fresher
                  </Label>
                </div>
              </div>
              {!isFresher && (
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
                  onDeleteExperience={(index) =>
                    handleDelete("experience", index)
                  }
                  mode="add"
                />
              )}
            </div>
          )}

          {activeTab === "education" && (
            <div>
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
                onDeleteEducation={(index) => handleDelete("education", index)}
                mode="add"
              />
            </div>
          )}

          {activeTab === "certification" && (
            <div>
              <div className="flex justify-between items-center py-6">
                <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]">
                  Certification
                </h2>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="hasCertifications"
                    checked={hasCertifications}
                    disabled={fetchedCertification?.data.length > 0}
                    onChange={(e) => {
                      setHasCertifications(e.target.checked);
                      if (e.target.checked) {
                        updateFormData("certifications", []);
                      } else {
                        updateFormData(
                          "certifications",
                          formData?.certifications || []
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor="hasCertifications"
                    className={`text-[#68696B] font-sf-pro text-sm font-normal leading-6 tracking-[0.21px] ${
                      fetchedCertification?.data?.length > 0 ? "opacity-50" : ""
                    }`}
                  >
                    I have no certifications
                  </Label>
                </div>
              </div>
              {!hasCertifications && (
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
                  onDeleteCertification={(index) =>
                    handleDelete("certifications", index)
                  }
                  mode="add"
                />
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={() => handleSaveSection(activeTab)}
          className="w-full mt-6 bg-[#00183D] hover:bg-[#062549] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Save {tabs.find((tab) => tab.id === activeTab)?.label}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
