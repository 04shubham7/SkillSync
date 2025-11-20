import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role } = body;
    if (!email || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const updated = await prisma.user.updateMany({ where: { email }, data: { role } });
    if (updated.count === 0) {
      // create if not exists
      await prisma.user.create({ data: { email, role } });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/db/users/role error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
