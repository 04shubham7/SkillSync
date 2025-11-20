import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  // Try to get the NextAuth session token (JWT) from the incoming request
  // Import getToken dynamically to avoid TypeScript type discrepancies between next-auth versions
  let token: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod: any = await import("next-auth/jwt");
    const getToken = mod.getToken || mod.default?.getToken;
    if (getToken) {
      token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    }
  } catch {
    // If we cannot read the next-auth token via library, try reading session cookie as fallback
    token = null;
  }

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = {
    email: token.email,
    name: token.name,
    role: token.role,
  };

  const signed = jwt.sign(payload, process.env.NEXTAUTH_SECRET || "", {
    expiresIn: "1h",
    issuer: "codesync",
  });

  const res = NextResponse.json({ token: signed });

  // Set HttpOnly cookie so front-end can use it automatically for same-site requests
  try {
    res.cookies.set("CS_JWT", signed, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } catch {
    // some older Next versions may not support res.cookies.set; ignore silently
  }

  return res;
}
