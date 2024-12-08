import React from "react";
import TextInput from "@/components/TextInput";

interface PersonalInfoSectionProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  formErrors: any;
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateOfBirthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  email,
  phoneNumber,
  dateOfBirth,
  formErrors,
  onFullNameChange,
  onEmailChange,
  onPhoneNumberChange,
  onDateOfBirthChange,
}) => {
  return (
    <>
      <TextInput
        label="Full Name"
        value={fullName}
        onChange={onFullNameChange}
        required
        error={formErrors.fullName}
      />
      <TextInput
        label="Email"
        value={email}
        onChange={onEmailChange}
        error={formErrors.email}
      />
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChange={onPhoneNumberChange}
        error={formErrors.phoneNumber}
      />
      <TextInput
        label="Date of Birth"
        value={dateOfBirth}
        onChange={onDateOfBirthChange}
        type="date"
        error={formErrors.dateOfBirth}
      />
    </>
  );
};

export default PersonalInfoSection;
