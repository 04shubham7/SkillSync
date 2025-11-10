import { NextResponse } from "next/server";
import { extractJwtFromRequest, verifyToken } from "../../../../lib/jwt";

export async function GET(req: Request) {
  // Extract our app JWT from the cookie
  const token = extractJwtFromRequest(req);
  const payload = verifyToken(token || undefined);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: `Hello ${payload.email || "user"}!`, payload });
}
