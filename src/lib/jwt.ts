import jwt from "jsonwebtoken";

export type TokenPayload = {
  email?: string;
  name?: string;
  role?: string | null;
  iat?: number;
  exp?: number;
};

const SECRET = process.env.NEXTAUTH_SECRET || "";

export function signPayload(payload: TokenPayload, opts: jwt.SignOptions = {}) {
  return jwt.sign(payload as object, SECRET, { expiresIn: "1h", issuer: "codesync", ...opts });
}

export function verifyToken(token?: string): TokenPayload | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function extractJwtFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/CS_JWT=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
