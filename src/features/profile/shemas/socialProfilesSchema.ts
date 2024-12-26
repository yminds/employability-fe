import { z } from "zod";

export const socialProfilesSchema = z.object({
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  dribbble: z.string().url("Invalid URL").optional().or(z.literal("")),
  behance: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
});
