import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "@/api/educationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EducationForm from "../forms/education-form";
import type { Education } from "@/features/profile/types";
import { toast } from "sonner";

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEducation: Education[];
  mode: "add" | "edit" | null;
}

const AddEditEducationModal: React.FC<AddEducationModalProps> = ({
  isOpen,
  onClose,
  initialEducation,
  mode,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [education, setEducation] = useState<Education[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const user = useSelector((state: any) => state.auth.user);

  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  useEffect(() => {
    if (isOpen) {
      setEducation(
        mode === "add"
          ? [
              {
                id: "",
                highest_education_level: "",
                education_level: "",
                degree: "",
                institute: "",
                board_or_certification: "",
                from_date: "",
                till_date: "",
                cgpa_or_marks: "",
              },
            ]
          : initialEducation
      );
      setErrors({});
      setIsSaving(false);
    }
  }, [isOpen, initialEducation, mode]);

  const handleFormChange = (updatedEducation: Education[]) => {
    setEducation(updatedEducation);
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      education_level: "",
      degree: "",
      institute: "",
      board_or_certification: "",
      from_date: "",
      till_date: "",
      cgpa_or_marks: "",
      id: "",
      highest_education_level: undefined,
    };
    setEducation([...education, newEducation]);
  };

  const handleDeleteEducation = async (index: number) => {
    const educationToDelete = education[index];
    if (educationToDelete._id) {
      try {
        await deleteEducation(educationToDelete._id).unwrap();
        toast.success("Education entry deleted successfully");
      } catch (error) {
        console.error("Failed to delete education:", error);
        setErrors({ ...errors, delete: "Failed to delete education" });
        toast.error("Failed to delete education entry");
        return;
      }
    }
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    education.forEach((edu, index) => {
      if (!edu.education_level.trim()) {
        newErrors[`education.${index}.education_level`] =
          "Education level is required";
        isValid = false;
      }
      if (!edu.degree.trim()) {
        newErrors[`education.${index}.degree`] = "Degree is required";
        isValid = false;
      }
      if (!edu.institute.trim()) {
        newErrors[`education.${index}.institute`] = "Institute is required";
        isValid = false;
      }
      if (!edu.from_date) {
        newErrors[`education.${index}.from_date`] = "From date is required";
        isValid = false;
      }
      if (
        !edu.cgpa_or_marks ||
        (typeof edu.cgpa_or_marks === "string" && !edu.cgpa_or_marks.trim())
      ) {
        newErrors[`education.${index}.cgpa_or_marks`] =
          "CGPA/Marks are required";
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
        education.map(async (edu) => {
          if (edu._id) {
            await updateEducation({
              id: edu._id,
              updatedEducation: edu,
            }).unwrap();
            toast.success("Education entry updated successfully");
          } else {
            await addEducation({
              ...edu,
              user_id: user._id,
            }).unwrap();
            toast.success("New education entry added successfully");
          }
        })
      );

      onClose();
    } catch (error) {
      console.error("Failed to save education:", error);
      setErrors({
        ...errors,
        saveEducation: "Failed to save education",
      });
      toast.error("Failed to save education entries");
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
              {mode === "add" ? "Add Education" : "Edit Education"}
            </DialogTitle>
            <p
              className="text-[16px] font-normal leading-6 tracking-[0.24px]"
              style={{
                color: "rgba(0, 0, 0, 0.60)",
                fontFamily: '"SF Pro Display", sans-serif',
              }}
            >
              {mode === "add"
                ? "Enter your new education details"
                : "Edit your education details"}
            </p>
          </div>
        </DialogHeader>
        <div className="max-h-[calc(98vh-300px)] overflow-y-auto pr-6 minimal-scrollbar">
          <EducationForm
            education={education}
            onChange={handleFormChange}
            errors={errors}
            onAddEducation={handleAddEducation}
            onDeleteEducation={handleDeleteEducation}
            mode={mode}
          />
          {errors.saveEducation && (
            <p className="text-red-500 text-sm mt-2">{errors.saveEducation}</p>
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

export default AddEditEducationModal;
