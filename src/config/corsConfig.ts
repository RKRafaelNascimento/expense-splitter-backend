import { CorsOptions } from "cors";

export const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "group_id", "member_id"],
} as CorsOptions;
