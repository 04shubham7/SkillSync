import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/nextAuthOptions';
import prisma from '@/lib/prisma';

// Helper to safely serialize BigInt fields for JSON
function serializeInterview(i: any) {
  if (!i) return i;
  return {
    ...i,
    startTime: i.startTime ? Number(i.startTime) : null,
    endTime: i.endTime ? Number(i.endTime) : null,
  };
}

export async function GET() {
  try {
    // Antigravity optimization: Limit to 50 most recent records to improve response latency
    const interviews = await prisma.interview.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(interviews.map(serializeInterview));
  } catch (err) {
    console.error('GET /api/interviews error', err);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // Creator user (allow any authenticated user; interviewer role optional)
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, startTime, meetingCode, candidateId, interviewerIds, streamCallId, status, instant } = body;
    // For instant meetings we auto-fill startTime
    const effectiveStart = instant ? Date.now() : startTime;
    if (!effectiveStart) {
      return NextResponse.json({ error: 'Missing startTime (or set instant=true)' }, { status: 400 });
    }
    const finalTitle = title && title.trim().length > 0 ? title.trim() : (instant ? 'Instant Meeting' : 'Untitled Interview');

    // if client provided a custom code, validate uniqueness and format
    const makeCode = (len = 6) => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let s = '';
      for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
      return s;
    };

    let code = meetingCode && String(meetingCode).trim().length > 0 ? String(meetingCode).trim() : makeCode();
    if (meetingCode) {
      // validate pattern (alphanumeric uppercase, 4-12 chars)
      const ok = /^[A-Z0-9]{4,12}$/.test(code);
      if (!ok) return NextResponse.json({ error: 'Invalid custom code. Use 4-12 uppercase letters/numbers.' }, { status: 400 });
      const exists = await prisma.interview.findUnique({ where: { meetingCode: code } });
      if (exists) return NextResponse.json({ error: 'Meeting code already taken' }, { status: 409 });
    } else {
      // ensure uniqueness for generated codes (rudimentary retry)
      for (let i = 0; i < 5; i++) {
        const exists = await prisma.interview.findUnique({ where: { meetingCode: code } });
        if (!exists) break;
        code = makeCode();
      }
    }

    const interview = await prisma.interview.create({
      data: {
        title: finalTitle,
        description: description || undefined,
        ownerId: user.id,
        candidateId: candidateId || null, // Will be populated later via join-by-code flow
        interviewerIds: Array.isArray(interviewerIds) ? interviewerIds : [], // Additional interviewers join later
        startTime: BigInt(effectiveStart),
        endTime: null,
        status: status || (instant ? 'active' : 'scheduled'),
        meetingCode: code,
        streamCallId: streamCallId || null,
      },
    });

    // Upsert the Stream channel so chat exists immediately. Call the internal endpoint server-side.
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const upsertUrl = new URL('/api/stream/channels/upsert', baseUrl).toString();
      await fetch(upsertUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ meetingId: interview.id }),
      });
    } catch (err) {
      console.error('Failed to upsert stream channel after interview create', err);
    }

    return NextResponse.json(serializeInterview(interview), { status: 201 });
  } catch (err) {
    console.error('POST /api/interviews error', err);
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}
