import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const interviewId = url.searchParams.get("interviewId");
    if (!interviewId) return NextResponse.json([], { status: 200 });

    const comments = await prisma.comment.findMany({ where: { interviewId: Number(interviewId) }, orderBy: { createdAt: 'desc' as any } });
    return NextResponse.json(comments);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interviewId, content, rating, interviewerId } = body;
    const created = await prisma.comment.create({ data: { interviewId: Number(interviewId), content, rating: Number(rating), interviewerId: interviewerId ? Number(interviewerId) : undefined } });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create comment' }, { status: 500 });
  }
}
