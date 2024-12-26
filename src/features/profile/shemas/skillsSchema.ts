import { z } from "zod";

export const skillsSchema = z.array(
  z.object({
    name: z.string().min(2, "Skill name must be at least 2 characters"),
  })
);
