import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/nextAuthOptions';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error('GET /api/users error', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
