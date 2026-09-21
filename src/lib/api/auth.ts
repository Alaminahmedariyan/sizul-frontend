import { createAuthClient } from "better-auth/react";

export type UserRole = "ADMIN" | "STAFF" | "CLIENT";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
};

export type BetterAuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://sizul-backend.vercel.app",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;