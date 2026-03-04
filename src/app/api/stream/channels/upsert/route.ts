import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from '@/lib/nextAuthOptions';
import prisma from '@/lib/prisma';
import { StreamChat } from 'stream-chat';

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const meetingId = body?.meetingId || new URL(req.url).searchParams.get('meetingId');
    if (!meetingId) return NextResponse.json({ error: 'meetingId required' }, { status: 400 });

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET || process.env.STREAM_SECRET_KEY;
    if (!apiKey || !apiSecret) return NextResponse.json({ error: 'Stream API keys not configured' }, { status: 500 });

    // Resolve current user and interview owner in DB
    const currentEmail = session.user.email as string;
    const currentUser = await prisma.user.findUnique({ where: { email: currentEmail } });

    const interview = await prisma.interview.findUnique({ where: { id: Number(meetingId) } });
    if (!interview) return NextResponse.json({ error: 'Interview not found' }, { status: 404 });

    // Use Prisma User.id as Stream userId (string)
    const ownerId = String(interview.ownerId);
    const currentUserId = currentUser ? String(currentUser.id) : currentEmail;

    // No invite list handling — channels are created with owner and current user only.
    const invitedIds: string[] = [];

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    const channelId = `interview:${meetingId}`;

    // Check if channel exists
    const existing = await serverClient.queryChannels({ id: { $eq: channelId } });
    if (!existing || existing.length === 0) {
      // create channel with owner and current user as members
      // mark channel as private/members-only via visibility/private flags
      // Build member list: owner + current user
      const members = Array.from(new Set([ownerId, currentUserId, ...invitedIds]));
      const channel = serverClient.channel('messaging', channelId, {
        name: `Interview ${meetingId}`,
        meetingId: String(meetingId),
        members,
        // Try to mark private; Stream uses members to restrict visibility, and
        // explicit flags help enforce members-only behavior.
        private: true,
        visibility: 'private',
      });
      try {
        await channel.create();
      } catch (err) {
        // ignore if already exists
        console.error('Channel create error (ignored):', err);
      }
    } else {
      // ensure members include owner and current user
      const ch = existing[0];
      const membersExisting = ch?.state?.members ? Object.keys(ch.state.members) : [];
      const toAdd = [] as string[];
      const needed = Array.from(new Set([ownerId, currentUserId, ...invitedIds]));
      for (const m of needed) if (!membersExisting.includes(m)) toAdd.push(m);
      if (toAdd.length > 0) {
        try {
          await ch.addMembers(toAdd);
        } catch (err) {
          console.error('Error adding members to channel:', err);
        }
      }
    }

    return NextResponse.json({ ok: true, channelId });
  } catch (err) {
    console.error('Upsert channel error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
