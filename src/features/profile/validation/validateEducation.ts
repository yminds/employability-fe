import type { Education } from "@/features/profile/types";

export const validateEducation = (
  education: Education[]
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  education.forEach((edu, index) => {
    if (!edu.education_level.trim()) {
      errors[`education.${index}.education_level`] =
        "Education level is required";
    }
    if (!edu.degree.trim()) {
      errors[`education.${index}.degree`] = "Degree is required";
    }
    if (!edu.institute.trim()) {
      errors[`education.${index}.institute`] = "Institute is required";
    }
    if (!edu.from_date) {
      errors[`education.${index}.from_date`] = "From date is required";
    }
    if (
      !edu.cgpa_or_marks ||
      (typeof edu.cgpa_or_marks === "string" && !edu.cgpa_or_marks.trim())
    ) {
      errors[`education.${index}.cgpa_or_marks`] = "CGPA/Marks are required";
    }
  });

  return errors;
};
