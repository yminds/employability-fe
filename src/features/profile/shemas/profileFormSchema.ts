import { z } from "zod";
import { basicInfoSchema } from "./basicInfoSchema";
import { socialProfilesSchema } from "./socialProfilesSchema";
import { skillsSchema } from "./skillsSchema";
import { experienceSchema } from "./experienceSchema";
import { educationSchema } from "./educationSchema";
// import { certificationsSchema } from "./certificationsSchema";

export const profileFormSchema = z.object({
  basicInfo: basicInfoSchema,
  socialProfiles: socialProfilesSchema,
  skills: skillsSchema,
  experience: experienceSchema,
  education: educationSchema,
//   certifications: certificationsSchema,
});
