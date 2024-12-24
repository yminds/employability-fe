import { z } from "zod";

export const educationSchema = z.array(
  z.object({
    level: z.enum(["bachelors", "masters", "phd"]),
    degree: z.string().min(2, "Degree must be at least 2 characters"),
    institute: z.string().min(2, "Institute must be at least 2 characters"),
    fromDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid from date",
    }),
    tillDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid till date",
    }),
    cgpa: z.string().min(1, "CGPA/Marks scored is required"),
  })
);
