import { z } from "zod";

export const ValidationSchema = z
  .object({
    username: z.string().trim().min(1, "Username is required"),
    email: z
      .string()
      .trim()
      .email("Invalid Email address ")
      .min(1, "Email is required"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required ")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
      .regex(/\d/, "Password must contain at least one number.")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character."
      ).min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().trim().min(1, "Confirm Password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match",
        code: z.ZodIssueCode.custom,
      });
    }
  });
export type validateSchema = z.infer<typeof ValidationSchema>