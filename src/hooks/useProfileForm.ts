import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/api/userApiSlice";
import {
  useAddExperienceMutation,
  useUpdateExperienceMutation,
} from "@/api/experienceApiSlice";
import {
  useAddEducationMutation,
  useUpdateEducationMutation,
} from "@/api/educationSlice";
import {
  useAddCertificationMutation,
  useUpdateCertificationMutation,
} from "@/api/certificatesApiSlice";
import {
  useCreateUserSkillsMutation,
  useGetUserSkillsMutation,
} from "@/api/skillsApiSlice";
import { useVerifyMultipleSkillsMutation } from "@/api/skillsPoolApiSlice";
import { validateBasicInfo } from "@/features/profile/validation/validateBasicInfo";
import { validateExperience } from "@/features/profile/validation/validateExperience";
import { validateEducation } from "@/features/profile/validation/validateEducation";
import { validateCertifications } from "@/features/profile/validation/validateCertification";
import { parsedTransformData } from "@/utils/parsedTransformData";
import { parseAddress } from "@/utils/addressParser";
import { transformFormDataForDB } from "@/utils/transformData";
import { ProfileFormData } from "@/features/profile/types";
import { updateUserProfile } from "@/features/authentication/authSlice";

export const useProfileForm = (
  type: string,
  user: any,
  goalId: string,
  onClose: () => void
) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(type);
  const [formData, setFormData] = useState<any>({});
  const [isFresher, setIsFresher] = useState(!user.is_experienced);
  const [hasCertifications, setHasCertifications] = useState(
    !user.has_certificates
  );
  const [transformData, setTransformData] = useState<any>({});
  const [errors, setErrors] = useState({});
  const [parsedSkills, setParsedSkills] = useState([]);

  const { data: userDetails } = useGetUserByIdQuery(user._id, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  const [updateUser] = useUpdateUserMutation();
  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [addCertification] = useAddCertificationMutation();
  const [updateCertification] = useUpdateCertificationMutation();
  const [createUserSkills] = useCreateUserSkillsMutation();
  const [getUserSkills] = useGetUserSkillsMutation();
  const [getVerifySkills] = useVerifyMultipleSkillsMutation();

  const parsedBasicData = useMemo(() => {
    if (!user.is_basic_info) {
      const data = user.parsedResume;
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
    }

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
  }, [user]);

  useEffect(() => {
    const initializeData = async () => {
      let transformedData = {
        skills: [],
        experience: [],
        education: [],
        certifications: [],
      };

      if (user.parsedResume) {
        try {
          const result = await getVerifySkills(
            user.parsedResume.skills
          ).unwrap();
          transformedData = await parsedTransformData(
            user.parsedResume,
            result.data
          );
          setParsedSkills(transformedData.skills);
          setTransformData(transformedData);
        } catch (error) {
          console.error("Error transforming data:", error);
        }
      }

      setFormData((prevData: any) => ({
        ...prevData,
        experience:
          userDetails?.experience?.length > 0
            ? userDetails.experience
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
          userDetails?.education?.length > 0
            ? userDetails.education
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
          userDetails?.certificates?.length > 0
            ? userDetails.certificates
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
  }, [userDetails]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (user._id && goalId) {
          const response = await getUserSkills({
            userId: user._id,
            goalId,
          }).unwrap();
          if (response?.data.optional && response.data.optional.length > 0) {
            setFormData((prevData: any) => ({
              ...prevData,
              skills: response.data.optional.map((skill) => ({
                skill_Id: skill.skill_pool_id._id,
                name: skill.skill_pool_id.name,
                rating: skill.self_rating,
                level: skill.level,
                visibility: "All users",
              })),
            }));
          } else if (parsedSkills.length > 0) {
            let updatedSkills = parsedSkills.filter(
              (parsedSkill: any) =>
                !response.data.all.some(
                  (skill: any) =>
                    skill.skill_pool_id._id === parsedSkill.skill_Id
                )
            );
            setFormData((prevData: any) => ({
              ...prevData,
              skills: updatedSkills,
            }));
          } else {
            setFormData((prevData: any) => ({
              ...prevData,
              skills: [
                {
                  skill_Id: "",
                  name: "",
                  rating: 0,
                  level: "1",
                  visibility: "All users",
                },
              ],
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [parsedSkills]);

  const updateFormData = useCallback(
    (section: keyof ProfileFormData, data: any) => {
      setFormData((prev: any) => ({
        ...prev,
        [section]: data,
      }));
    },
    []
  );

  const validateSection = useCallback(
    (section: string): boolean => {
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
    },
    [formData]
  );

  const handleDelete = useCallback(
    async (section: keyof ProfileFormData, index: number) => {
      const updatedData = formData[section].filter(
        (_: any, i: number) => i !== index
      );
      const updatedResume = user.parsedResume[section].filter(
        (_: any, i: number) => i !== index
      );
      const deletedItem = formData[section][index];
      updateFormData(section, updatedData);

      try {
        if (section === "skills") {
          if (deletedItem.transformedSkill) {
            await updateUserParsedResume(section, updatedResume);
          }
        } else if (!deletedItem._id) {
          await updateUserParsedResume(section, updatedResume);
        }
      } catch (error) {
        console.error(`Error deleting ${section}:`, error);
      }
    },
    [formData, updateFormData]
  );

  const updateUserParsedResume = useCallback(
    async (section: string, updatedData: any[]) => {
      const response = await updateUser({
        userId: user._id,
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
    },
    [user._id, user, dispatch, updateUser]
  );

  const handleSaveSection = useCallback(
    async (section: string) => {
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
                userId: user._id,
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
                user_id: user._id,
                skills: transformedData.skills,
                goal_id: goalId,
              };
              await createUserSkills(skillsPayload).unwrap();
              if (user.parsedResume !== null) {
                await updateUser({
                  userId: user._id,
                  data: { parsedResume: { ...user.parsedResume, skills: [] } },
                });
              }
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
                userId: user._id,
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
                userId: user._id,
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
                      user_id: user._id,
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
                if (user.parsedResume !== null) {
                  await updateUser({
                    userId: user._id,
                    data: {
                      parsedResume: { ...user.parsedResume, experience: [] },
                    },
                  });
                }
              }
            }
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
                    user_id: user._id,
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
              if (user.parsedResume !== null) {
                await updateUser({
                  userId: user._id,
                  data: {
                    parsedResume: { ...user.parsedResume, education: [] },
                  },
                });
              }
            }
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
                userId: user._id,
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
                userId: user._id,
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
                      user_id: user._id,
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
                      certificates: [
                        ...user.certificates,
                        ...newCertificateIds,
                      ],
                    })
                  );
                }
                if (user.parsedResume !== null) {
                  await updateUser({
                    userId: user._id,
                    data: {
                      parsedResume: {
                        ...user.parsedResume,
                        certifications: [],
                      },
                    },
                  });
                }
              }
            }
            break;
          default:
            throw new Error("Invalid section");
        }

        console.log(`${section} section saved successfully`);

        // Move to the next tab after saving
        const currentIndex = [
          "basic",
          "skills",
          "experience",
          "education",
          "certification",
        ].indexOf(activeTab);
        if (currentIndex < 4) {
          setActiveTab(
            ["basic", "skills", "experience", "education", "certification"][
              currentIndex + 1
            ]
          );
        } else {
          onClose();
        }
      } catch (err) {
        console.error(`Error saving ${section} section:`, err);
        if (err instanceof Error) {
          setErrors({ [section]: err.message });
        }
      }
    },
    [
      validateSection,
      formData,
      isFresher,
      activeTab,
      onClose,
      user._id,
      user,
      dispatch,
      updateUser,
      createUserSkills,
      addExperience,
      updateExperience,
      addEducation,
      updateEducation,
      addCertification,
      updateCertification,
      goalId,
      hasCertifications,
    ]
  );

  return {
    activeTab,
    setActiveTab,
    formData,
    isFresher,
    setIsFresher,
    hasCertifications,
    setHasCertifications,
    errors,
    parsedSkills,
    userDetails,
    parsedBasicData,
    updateFormData,
    validateSection,
    handleDelete,
    handleSaveSection,
  };
};
