import React, { useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "../forms/basic-info-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "@/components/forms/experience-form";
import EducationForm from "../forms/education-form";
import CertificationsForm from "../forms/certification-form";
import { useProfileForm } from "@/hooks/useProfileForm";
import type { ProfileFormData } from "@/features/profile/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Checkmark from "@/assets/profile/completeprofile/checkmark.svg";
import { CheckCircle } from "lucide-react";

interface CompleteProfileModalProps {
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
  type: string;
  user: any;
  parsedData?: any;
  isParsed: boolean;
  goalId: string;
}

const CompleteProfileModal = ({
  type,
  onClose,
  user,
  goalId,
}: CompleteProfileModalProps) => {
  const {
    activeTab,
    setActiveTab,
    formData,
    isFresher,
    setIsFresher,
    hasCertifications,
    setHasCertifications,
    errors,
    userDetails,
    parsedBasicData,
    updateFormData,
    handleDelete,
    handleSaveSection,
    setIsImageDeleted,
    newlyUploadedImage,
    setNewlyUploadedImage,
    profileStatus,
  } = useProfileForm(type, user, goalId, onClose);

  const tabs = useMemo(
    () => [
      { id: "basic", label: "Basic Info" },
      { id: "skills", label: "Skills" },
      { id: "experience", label: "Experience" },
      { id: "education", label: "Education" },
      { id: "certification", label: "Certifications" },
    ],
    []
  );

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "basic":
        return (
          <>
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] mb-4">
              Basic Information
            </h2>
            <BasicInfoForm
              onChange={(
                basicInfo,
                socialProfiles,
                isImageDeleted,
                newlyUploadedImage
              ) => {
                updateFormData("basicInfo", basicInfo);
                updateFormData("socialProfiles", socialProfiles);
                setIsImageDeleted(isImageDeleted);
                setNewlyUploadedImage(newlyUploadedImage);
              }}
              errors={errors}
              initialData={{
                basicInfo: parsedBasicData.basicInfo,
                socialProfiles: parsedBasicData.socialProfiles,
              }}
            />
          </>
        );
      case "skills":
        return (
          <>
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] mb-4">
              Skills
            </h2>
            <SkillsForm
              skills={formData?.skills}
              allSkills={userDetails?.skills}
              onChange={(skills) => updateFormData("skills", skills)}
              errors={errors}
              onDeleteSkill={(index) => handleDelete("skills", index)}
            />
          </>
        );
      case "experience":
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]">
                Experience
              </h2>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="isFresher"
                  checked={isFresher}
                  disabled={userDetails?.experience?.length > 0}
                  onChange={(e) => {
                    setIsFresher(e.target.checked);
                    if (e.target.checked) {
                      updateFormData("experience", []);
                    } else {
                      updateFormData("experience", formData?.experience || []);
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label
                  htmlFor="isFresher"
                  className={`text-[#68696B] font-sf-pro text-sm font-normal leading-6 tracking-[0.21px] ${
                    userDetails?.experience?.length > 0 ? "opacity-50" : ""
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
          </>
        );
      case "education":
        return (
          <>
            <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px] mb-4">
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
          </>
        );
      case "certification":
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#000000] text-base font-medium font-ubuntu leading-[22px]">
                Certifications
              </h2>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="hasCertifications"
                  checked={hasCertifications}
                  disabled={userDetails?.certificates?.length > 0}
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
                    userDetails?.certificates?.length > 0 ? "opacity-50" : ""
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
          </>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    formData,
    errors,
    isFresher,
    hasCertifications,
    handleDelete,
    updateFormData,
    parsedBasicData,
    userDetails,
    setIsFresher,
    setHasCertifications,
    setIsImageDeleted,
    newlyUploadedImage,
    setNewlyUploadedImage,
  ]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white rounded-lg max-w-6xl p-[42px] flex flex-col h-[98vh]">
        <DialogHeader className="w-full flex justify-between items-start">
          <div className="flex flex-col items-start">
            <DialogTitle className="text-black text-[20px] font-medium leading-[26px] tracking-[-0.2px] font-ubuntu">
              Complete Your Profile
            </DialogTitle>
            <p className="text-[16px] font-normal leading-6 tracking-[0.24px] text-black/60 font-['SF Pro Display', sans-serif]">
              Enter your goal and tailor your learning path.
            </p>
          </div>
        </DialogHeader>

        <div className="flex mt-6 h-full">
          <div className="w-44 border-r">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 relative ${
                  activeTab === tab.id
                    ? "text-[#00183D] font-semibold bg-white border-r-2 border-[#00183D]"
                    : "text-[#68696B] hover:text-[#00183D] hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-between">
                  {tab.label}
                  {profileStatus[tab.id as keyof typeof profileStatus] ===
                    "updated" && (
                    <CheckCircle className="w-4 h-4 text-[#00183D]" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex-1 pl-6">
              <div className="h-[calc(98vh-240px)] overflow-y-auto pr-6 minimal-scrollbar scroll-smooth snap-y snap-mandatory">
                {renderTabContent()}
              </div>
            </div>

            <div className="pl-6 flex justify-end">
              <Button
                onClick={() => handleSaveSection(activeTab)}
                className="w-48 bg-[#00183D] hover:bg-[#062549] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Save {tabs.find((tab) => tab.id === activeTab)?.label}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CompleteProfileModal);
