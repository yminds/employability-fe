import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { UseSelector } from "react-redux";
export interface TransformedData {
  name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  address: {
    country: string;
    state: string;
    city: string;
  };
  skills: Array<{
    skill_pool_id: string;
    self_rating: number;
  }>;
  education: Array<{
    education_level: string;
    degree: string;
    institute: string;
    board_or_certification: string;
    from_date: string;
    till_date: string;
    cgpa_or_marks: number;
  }>;
  certificates: any[];
  experience: any[];
  linkedIn: string;
  profileImage?:string | null;
}

export const transformFormDataForDB = (formData: any): TransformedData => {
  console.log(formData);

//   const userId = useSelector((state: any) => state.auth.user);
//   console.log(userId);

  return {
    name: formData.basicInfo.name,
    email: formData.basicInfo.email,
    date_of_birth: formData.basicInfo.dateOfBirth,
    gender: formData.basicInfo.gender,
    address: {
      country: formData.basicInfo.country,
      state: formData.basicInfo.state,
      city: formData.basicInfo.city,
    },
    skills: formData.skills.map((skill: any) => ({
      skill_pool_id: skill._id,
      self_rating: skill.rating || 0,
    })),
    education: formData.education.map((edu: any) => ({
      education_level: "",
      degree: edu.degree,
      institute: edu.institution,
      board_or_certification: "",
      from_date: edu.fromDate || "",
      till_date: edu.tillDate || "",
      cgpa_or_marks: parseFloat(edu.cgpa) || 0,
    })),
    certificates: formData.certifications || [],

    experience: formData.experience.map((exp: any) => ({
      title: exp.jobTitle,
      company: exp.companyName,
      employment_type: exp.employmentType,
      location: exp.location,
      start_date: exp.startDate,
      end_date: exp.endDate,
      currently_working: exp.currentlyWorking,
      description: exp.description,
    })),
    linkedIn: formData.socialProfiles.linkedin,
    profileImage:formData.basicInfo.profileImage || null
  };
};
