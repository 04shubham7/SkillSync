"use server";
"use server";

const tokenCache = new Map<string, { token: string; expiresAt: number }>();
const TOKEN_EXPIRY_TIME = 50 * 60 * 1000; // 50 minutes (tokens valid for 1 hour)

import { getServerSession } from "next-auth/next";
import { StreamClient } from "@stream-io/node-sdk";
import { sanitizeUserId } from "@/lib/utils";

export const streamTokenProvider = async () => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    const sanitizedUserId = sanitizeUserId(session.user.email);
    
    // Check cache first
    const cached = tokenCache.get(sanitizedUserId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const secretKey = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !secretKey) {
      throw new Error("Stream API key or secret key not configured");
    }

    const streamClient = new StreamClient(apiKey, secretKey);

    const token = streamClient.generateUserToken({ user_id: sanitizedUserId });

    // Cache the token
    tokenCache.set(sanitizedUserId, {
      token,
      expiresAt: Date.now() + TOKEN_EXPIRY_TIME,
    });

    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error instanceof Error ? error.message : "Unknown");
    throw error;
  }
};
