import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Antigravity optimization: Only select needed fields to reduce payload size
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' } as any,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      }
    });
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch users' }, { status: 500 });
  }
}
