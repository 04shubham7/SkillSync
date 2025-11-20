import { NextResponse } from "next/server";
import { streamTokenProvider } from "@/actions/stream.actions";

export async function GET() {
  try {
    const token = await streamTokenProvider();
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_STREAM_API_KEY" }, { status: 500 });
    }
    return NextResponse.json({ apiKey, token });
  } catch (err) {
    console.error("Error creating video token", err);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
