import { ofetch } from "ofetch";

/**
 * For public marketing pages only (Server Components, no auth needed).
 * Unlike server-api-client.ts, this does NOT forward cookies — public
 * endpoints don't need a session, and skipping cookies() means these
 * pages can be statically generated / cached by Next.js.
 */
export const publicApiClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
