import type { Certification } from "@/features/profile/types";

export const validateCertifications = (
  certifications: Certification[]
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  certifications.forEach((cert, index) => {
    if (!cert.title.trim()) {
      errors[`certifications.${index}.title`] = "Title is required";
    }
    if (!cert.issued_by.trim()) {
      errors[`certifications.${index}.issued_by`] = "Issuer is required";
    }
    if (!cert.issue_date) {
      errors[`certifications.${index}.issue_date`] = "Issue date is required";
    }
    if (!cert.certificate_s3_url.trim()) {
      errors[`certifications.${index}.certificate_s3_url`] =
        "Certificate URL is required";
    }
  });

  return errors;
};
