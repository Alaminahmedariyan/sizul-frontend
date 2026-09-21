// Mirrors backend `UserRole` enum (prisma) exactly — keep in sync.
export type UserRole = "ADMIN" | "STAFF" | "CLIENT";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// Shape returned by the custom lightweight session endpoint:
// GET /api/v1/auth/session  ->  { id, email, role, emailVerified }
export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
};

// Shape returned by Better Auth's own `getSession` (fuller user object,
// used mainly on the client via authClient.useSession()).
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
