import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } as any });
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch users' }, { status: 500 });
  }
}
