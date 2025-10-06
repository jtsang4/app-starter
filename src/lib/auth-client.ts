import { adminClient, phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.VITE_APP_URL || "http://localhost:3000",
  plugins: [adminClient(), phoneNumberClient()],
});

export type AuthClient = typeof authClient;
