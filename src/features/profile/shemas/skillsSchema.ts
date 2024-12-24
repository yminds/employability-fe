import { z } from "zod";

export const skillsSchema = z.array(
  z.object({
    name: z.string().min(2, "Skill name must be at least 2 characters"),
    rating: z.number().min(0).max(10, "Rating must be between 0 and 10"),
  })
);
