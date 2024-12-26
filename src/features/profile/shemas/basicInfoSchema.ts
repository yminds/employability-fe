import { z } from "zod";

export const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z
  .string()
  .min(10, "Mobile number must be at least 10 digits")
  .max(12, "Mobile number must be at least 10 digits")
  .regex(/^\d+$/, "Mobile number must contain only digits"),  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const age = new Date().getFullYear() - dob.getFullYear();
    return age >= 15;
  }, "You must be at least 15 years old"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  profileImage: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      return allowedTypes.includes(file.type);
    }, "Only JPEG, PNG, or GIF files are allowed")
    .refine((file) => {
      if (!file) return true;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      return file.size <= maxSizeInBytes;
    }, "Image must be 5MB or less"),
});
