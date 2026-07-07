import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      /** Role claim read at sign-in. Cheap filter only — admin surfaces re-check the DB. */
      role: string;
      /** Provider that authenticated this session: "credentials" | "google" | "discord". */
      provider?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    provider?: string;
  }
}
