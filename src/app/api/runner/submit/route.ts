import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const judge0Url = process.env.JUDGE0_API_URL; // e.g. https://judge0.p.rapidapi.com or your Judge0 instance
    const judge0Key = process.env.JUDGE0_API_KEY;
    if (!judge0Url) return NextResponse.json({ error: 'Judge0 URL not configured' }, { status: 500 });

    // Forward the submission to Judge0. Expect the client to send the correct payload (language_id, source_code, stdin, etc.)
    const res = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(judge0Key ? { 'X-RapidAPI-Key': judge0Key } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Runner submit error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
