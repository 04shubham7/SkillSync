import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/nextAuthOptions';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // require authenticated user to resolve join-by-code
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { code } = body;
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

    const interview = await prisma.interview.findFirst({ where: { meetingCode: code } });
    if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // allow any authenticated user to join using a room code (no email invite required)
    // (owner and invited lists still exist for optional invite UX, but are not required)

    return NextResponse.json({ id: interview.id, meetingId: interview.id, redirect: `/meeting/${interview.id}` });
  } catch (err) {
    console.error('POST /api/interviews/join error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
