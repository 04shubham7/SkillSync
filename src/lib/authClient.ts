// Small client helper to request a server-signed JWT after NextAuth sign-in.
// This will hit the server endpoint that signs a JWT from the NextAuth session and sets
// an HttpOnly cookie `CS_JWT` for subsequent requests.

export async function fetchAndSetJwt(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) return false;
    // The server sets an HttpOnly cookie; we can also return and inspect the JSON body if needed.
    return true;
  } catch {
    return false;
  }
}
