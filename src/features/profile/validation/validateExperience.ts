import type { ExperienceItem } from "@/features/profile/types";

export const validateExperience = (
  experience: ExperienceItem[]
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  experience.forEach((exp, index) => {
    if (!exp.title.trim()) {
      errors[`experience.${index}.title`] = "Job title is required";
    }
    if (!exp.employment_type) {
      errors[`experience.${index}.employment_type`] =
        "Employment type is required";
    }
    if (!exp.company.trim()) {
      errors[`experience.${index}.company`] = "Company name is required";
    }
    if (!exp.location.trim()) {
      errors[`experience.${index}.location`] = "Location is required";
    }
    if (!exp.start_date) {
      errors[`experience.${index}.start_date`] = "Start date is required";
    }
    if (!exp.currently_working && !exp.end_date) {
      errors[`experience.${index}.end_date`] =
        "End date is required when not currently working";
    }
    if (!exp.description.trim()) {
      errors[`experience.${index}.description`] = "Description is required";
    }
    if (exp.current_ctc === 0) {
      errors[`experience.${index}.current_ctc`] = "Current CTC is required";
    }
    if (exp.expected_ctc === 0) {
      errors[`experience.${index}.expected_ctc`] = "Expected CTC is required";
    }
  });

  return errors;
};
