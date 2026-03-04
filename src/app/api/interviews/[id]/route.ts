import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/nextAuthOptions';
import prisma from '@/lib/prisma';

function serialize(interview: any) {
  if (!interview) return interview;
  return {
    ...interview,
    startTime: interview.startTime ? Number(interview.startTime) : null,
    endTime: interview.endTime ? Number(interview.endTime) : null,
  };
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const interview = await prisma.interview.findUnique({ where: { id } });
    if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(serialize(interview));
  } catch (err) {
    console.error('GET /api/interviews/[id] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const interview = await prisma.interview.findUnique({ where: { id } });
    if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Only owner or interviewer role can edit
    if (user.id !== interview.ownerId && user.role !== 'interviewer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, startTime, streamCallId } = body;

    const updated = await prisma.interview.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        startTime: startTime !== undefined ? BigInt(startTime) : undefined,
        streamCallId: streamCallId ?? undefined,
      },
    });

    // Try to re-upsert channel so new invitees are added
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/stream/channels/upsert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ meetingId: updated.id }),
      });
    } catch (err) {
      console.error('Failed to upsert stream channel after interview update', err);
    }

    return NextResponse.json(serialize(updated));
  } catch (err) {
    console.error('PATCH /api/interviews/[id] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const interview = await prisma.interview.findUnique({ where: { id } });
    if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Only owner or interviewer role can delete
    if (user.id !== interview.ownerId && user.role !== 'interviewer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.interview.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/interviews/[id] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
