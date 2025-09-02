import { z } from "zod";

export const AUTH_ZOD_SCHEMA = z.object({
  username: z
    .string()
    .min(1, { message: "username required" })
    .max(10, { message: "Username must be less than 10 charatcers" }),
  password: z
    .string()
    .min(4, { message: "Password length must be greater than 4" }),
});

export const ADD_WEBSITE_ZOD_SCHEMA = z.object({
    url:z.string().min(1)
})
