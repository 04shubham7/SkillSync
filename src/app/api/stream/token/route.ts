import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/nextAuthOptions';
import prisma from '@/lib/prisma';

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const apiKey = process.env.STREAM_API_KEY || process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET || process.env.STREAM_SECRET_KEY;
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Stream API keys not configured', missing: { apiKey: !apiKey, apiSecret: !apiSecret } }, { status: 500 });
  }

  // Resolve internal user id from Postgres (Prisma)
  const email = session.user.email as string;
  const dbUser = await prisma.user.findUnique({ where: { email } });
  const userId = dbUser ? String(dbUser.id) : email;

  const serverClient = StreamChat.getInstance(apiKey, apiSecret);

  // Upsert minimal profile on Stream
  try {
    await serverClient.upsertUser({ id: userId, name: session.user.name || email });
  } catch (err) {
    // continue even if upsert fails
    console.error('Stream upsertUser failed', err);
  }

  const token = serverClient.createToken(userId);

  return NextResponse.json({ apiKey, token, userId });
}
