import { z } from "zod";

export const experienceSchema = z.array(
  z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    company: z.string().min(2, "Company must be at least 2 characters"),
    employmentType: z.enum([
      "full-time",
      "part-time",
      "contract",
      "internship",
    ]),
    location: z.string().min(2, "Location must be at least 2 characters"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date",
    }),
    endDate: z.string().refine(
      (date, ctx ) => {
        if (ctx.parent.currentlyWorking) return true;
        return !isNaN(Date.parse(date));
      },
      { message: "Invalid end date" }
    ),
    currentlyWorking: z.boolean(),
    currentCTC: z.string().optional(),
    expectedCTC: z.string().optional(),
  })
);
