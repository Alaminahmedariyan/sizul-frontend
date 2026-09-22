import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/*
 * IMPORTANT: baseURL is intentionally left empty (relative).
 *
 * If this pointed directly at the backend's absolute URL
 * (e.g. https://sizul-backend.vercel.app), every request would
 * be a cross-site call — bypassing the Next.js rewrite in
 * next.config.ts entirely. Modern browsers treat *.vercel.app
 * subdomains as different sites and silently drop the
 * Better Auth state/session cookies on cross-site requests,
 * which is what was causing the Google OAuth "state_mismatch"
 * error.
 *
 * With baseURL left relative, requests go to the frontend's
 * own origin (e.g. https://sizul-frontend.vercel.app/api/auth/...),
 * which the rewrite in next.config.ts proxies server-side to the
 * backend. From the browser's point of view everything is
 * same-origin, so cookies are set and read correctly.
 */
export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [emailOTPClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;