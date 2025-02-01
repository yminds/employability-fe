import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export interface TransformedData {
  name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  address: {
    country: string;
    state: string;
    city: string;
  };
  education: any[];
  certificates: any[];
  experience: any[];
  portfolio: string;
  linkedIn: string;
  gitHub?: string;
  profile_image?: string | null;
}

export const transformFormDataForDB = (formData: any): TransformedData => {
  console.log("Original formData in transform function:", formData);

  const transformedData: TransformedData = {
    name: formData.basicInfo?.name || "",
    email: formData.basicInfo?.email || "",
    phone_number: formData.basicInfo?.mobile || "",
    date_of_birth: formData.basicInfo?.date_of_birth || "",
    gender: formData.basicInfo?.gender || "",
    address: {
      country: formData.basicInfo?.country || "",
      state: formData.basicInfo?.state || "",
      city: formData.basicInfo?.city || "",
    },
    education: [],
    certificates: [],
    experience: [],
    portfolio: formData.socialProfiles?.portfolio || "",
    linkedIn: formData.socialProfiles?.linkedIn || "",
    gitHub: formData.socialProfiles?.gitHub || "",
    profile_image: formData.basicInfo?.profile_image || null,
  };

  // Transform education data
  if (Array.isArray(formData.education)) {
    transformedData.education = formData.education.map((edu: any) => {
      return {
        _id: edu.id || "",
        education_level: edu.education_level || "",
        degree: edu.degree || "",
        institute: edu.institute || "",
        from_date: edu.from_date || "",
        till_date: edu.till_date || "",
        cgpa_or_marks: edu.cgpa_or_marks || "",
      };
    });
  } else {
    console.error("Education data is not an array:", formData.education);
  }

  // Transform certificates data
  if (Array.isArray(formData.certifications)) {
    transformedData.certificates = formData.certifications.map((cert: any) => {
      return {
        _id: cert.id || "",
        title: cert.title || "",
        issued_by: cert.issued_by || "",
        issue_date: cert.issue_date || "",
        expiration_date: cert.expiration_date || "",
        certificate_s3_url: cert.certificate_s3_url || "",
      };
    });
  } else {
    console.error(
      "Certifications data is not an array:",
      formData.certifications
    );
  }

  // Transform experience data
  if (Array.isArray(formData.experience)) {
    transformedData.experience = formData.experience.map((exp: any) => {
      return {
        _id: exp.id || "",
        title: exp.title || "",
        company: exp.company || "",
        employment_type: exp.employment_type || "",
        location: exp.location || "",
        start_date: exp.start_date || "",
        end_date: exp.end_date || "",
        currently_working: exp.currently_working || false,
        description: exp.description || "",
        current_ctc: exp.current_ctc || "",
        expected_ctc: exp.expected_ctc || "",
      };
    });
  } else {
    console.error("Experience data is not an array:", formData.experience);
  }

  console.log("Final transformed data:", transformedData);
  return transformedData;
};
