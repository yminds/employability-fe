import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} from "@/api/experienceApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ExperienceForm from "@/features/profile/forms/experience-form";
import type { ExperienceItem } from "@/features/profile/types";
import { toast } from "sonner";

interface AddEditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExperience: ExperienceItem[];
  mode: "add" | "edit" | null;
}

const AddEditExperienceModal: React.FC<AddEditExperienceModalProps> = ({
  isOpen,
  onClose,
  initialExperience,
  mode,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const user = useSelector((state: any) => state.auth.user);

  const [addExperience] = useAddExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  useEffect(() => {
    if (isOpen) {
      setExperience(
        mode === "add"
          ? [
              {
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
              },
            ]
          : initialExperience
      );
      setErrors({});
      setIsSaving(false);
    }
  }, [isOpen, initialExperience, mode]);

  const handleFormChange = (updatedExperience: ExperienceItem[]) => {
    setExperience(updatedExperience);
  };

  const handleAddExperience = () => {
    const newExperience: ExperienceItem = {
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
    };
    setExperience([...experience, newExperience]);
  };

  const handleDeleteExperience = async (index: number) => {

    const experienceToDelete = experience[index];
    if (experienceToDelete._id) {
      try {
        await deleteExperience(experienceToDelete._id).unwrap();
        toast.success("Experience entry delete successfully")
      } catch (error) {
        console.error("Failed to delete experience:", error);
        setErrors({ ...errors, delete: "Failed to delete experience" });
        toast.error("Failed to delete experience entry");
        return;
      }
    }
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    experience.forEach((exp, index) => {
      if (!exp.title.trim()) {
        newErrors[`experience.${index}.title`] = "Job title is required";
        isValid = false;
      }
      if (!exp.employment_type) {
        newErrors[`experience.${index}.employment_type`] =
          "Employment type is required";
        isValid = false;
      }
      if (!exp.company.trim()) {
        newErrors[`experience.${index}.company`] = "Company name is required";
        isValid = false;
      }
      if (!exp.location.trim()) {
        newErrors[`experience.${index}.location`] = "Location is required";
        isValid = false;
      }
      if (!exp.start_date) {
        newErrors[`experience.${index}.state_date`] = "Start date is required";
        isValid = false;
      }
      if (!exp.currently_working && !exp.end_date) {
        newErrors[`experience.${index}.end_date`] =
          "End date is required when not currently working";
        isValid = false;
      }
      if (!exp.description.trim()) {
        newErrors[`experience.${index}.description`] =
          "Description is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTimeout(() => setErrors({}), 2000);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      await Promise.all(
        experience.map(async (exp) => {
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
          };

          if (exp._id) {
            await updateExperience({
              id: exp._id,
              updatedExperience: experienceData,
            }).unwrap();
            toast.success("Experience entry updated successfully");
          } else {
            await addExperience(experienceData).unwrap();
            toast.success("New experience entry added successfully");
          }
        })
      );

      onClose();
    } catch (error) {
      console.error("Failed to save experiences:", error);
      setErrors({
        ...errors,
        saveExperience: "Failed to save experiences",
      });
      toast.error("Failed to save experience entries");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
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
              {mode === "add" ? "Add Experience" : "Edit Experience"}
            </DialogTitle>
            <p
              className="text-[16px] font-normal leading-6 tracking-[0.24px]"
              style={{
                color: "rgba(0, 0, 0, 0.60)",
                fontFamily: '"SF Pro Display", sans-serif',
              }}
            >
              {mode === "add"
                ? "Enter your new experience details"
                : "Edit your experience details"}
            </p>
          </div>
        </DialogHeader>
        <div className="max-h-[calc(98vh-300px)] overflow-y-auto pr-6 minimal-scrollbar">
          <ExperienceForm
            experience={experience}
            onChange={handleFormChange}
            errors={errors}
            onAddExperience={handleAddExperience}
            onDeleteExperience={handleDeleteExperience}
            mode={mode}
          />
          {errors.saveExperience && (
            <p className="text-red-500 text-sm mt-2">{errors.saveExperience}</p>
          )}
        </div>
        <Button
          onClick={handleSave}
          className="w-full mt-6 bg-[#00183D] hover:bg-[#062549] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          disabled={isSaving || Object.keys(errors).length > 0}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditExperienceModal;
