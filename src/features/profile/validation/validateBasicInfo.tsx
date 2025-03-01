import type { BasicInfo } from "@/features/profile/types";

export const validateBasicInfo = (
  basicInfo: BasicInfo
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Name validation
  if (!basicInfo.name.trim()) {
    errors["name"] = "Name is required";
  }

  // Mobile number validation
  // if (!basicInfo.mobile.trim()) {
  //   errors["mobile"] = "Mobile number is required";
  // } else if (!/^\+?[1-9]\d{1,14}$/.test(basicInfo.mobile)) {
  //   errors["mobile"] = "Invalid mobile number format";
  // }

  // Email validation
  if (!basicInfo.email.trim()) {
    errors["email"] = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(basicInfo.email)) {
    errors["email"] = "Invalid email format";
  }

  // Date of birth validation
  if (!basicInfo.date_of_birth) {
    errors["date_of_birth"] = "Date of birth is required";
  } else {
    const dob = new Date(basicInfo.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      errors["date_of_birth"] = "You must be at least 18 years old";
    }
  }

  // Gender validation
  if (!basicInfo.gender) {
    errors["gender"] = "Gender is required";
  }

  // Country validation
  if (!basicInfo.country) {
    errors["country"] = "Country is required";
  }

  // State validation
  if (basicInfo.country && !basicInfo.state) {
    errors["state"] = "State is required";
  }

  // City validation
  if (basicInfo.state && !basicInfo.city) {
    errors["city"] = "City is required";
  }

  // Profile image validation (optional)
  if (basicInfo.profile_image && !basicInfo.profile_image.trim()) {
    errors["profile_image"] = "Invalid profile image URL";
  }

  return errors;
};
