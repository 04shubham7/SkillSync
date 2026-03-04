"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type Interview = {
  id: number;
  title: string;
  description?: string | null;
  ownerId: number;
  startTime: number;
  status: string;
};

export default function MeetingsPage() {
  const { data: session } = useSession();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreated, setShowCreated] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    const res = await fetch("/api/interviews");
    if (res.ok) {
      const data = await res.json();
      setInterviews(data || []);
    }
  }

  async function createInterview(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          startTime: new Date(startTime).getTime(),
          description: "",
          meetingCode: customCode && customCode.trim().length > 0 ? customCode.trim() : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTitle("");
        setStartTime("");
        setCustomCode("");
        setCreatedCode(data?.meetingCode || null);
        setCreatedId(data?.id ?? null);
        setShowCreated(true);
        await fetchList();
      } else {
        const err = await res.json();
        alert(err?.error || "Failed to create");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Meetings</h2>

      {(session as any)?.user?.role !== "interviewer" ? (
        <p className="text-sm text-muted-foreground">You can view upcoming meetings here.</p>
      ) : (
        <form onSubmit={createInterview} className="mb-6 space-y-2">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mt-1">Only interviewers can create meetings. Share the meeting code to let participants join.</p>
          </div>
          <div>
            <label className="block text-sm">Custom meeting code (optional)</label>
            <input value={customCode} onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="w-full p-2 border rounded" placeholder="ABC123 (alphanumeric)" />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate a code.</p>
          </div>
          <div>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Meeting'}</Button>
          </div>
        </form>
      )}

      {/* Creation confirmation dialog - show code after create */}
      {showCreated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black/50 absolute inset-0" onClick={() => setShowCreated(false)} />
          <div className="bg-white p-6 rounded shadow z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Meeting Created</h3>
            <p className="mb-4">Share this meeting code with participants to join:</p>
            <div className="flex items-center gap-2">
              <code className="px-3 py-2 bg-muted rounded text-sm">{createdCode}</code>
              <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(createdCode || ''); alert('Code copied'); }}>Copy</Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => { setShowCreated(false); if (createdId) window.location.href = `/meeting/${createdId}`; }}>Go to Room</Button>
            </div>
          </div>
        </div>
      )}

      <div className="my-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">Join by code</h3>
        <div className="flex gap-2">
          <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Enter meeting code" className="p-2 border rounded flex-1" />
          <Button onClick={async () => {
            if (!joinCode) return alert('Enter code');
            const res = await fetch('/api/interviews/join', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: joinCode.trim() }) });
            if (!res.ok) {
              const err = await res.json();
              return alert(err?.error || 'Not found');
            }
            const data = await res.json();
            window.location.href = data.redirect || `/meeting/${data.id}`;
          }}>Join</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((iv) => (
          <div key={iv.id} className="p-4 border rounded">
            <h3 className="font-semibold">{iv.title}</h3>
            <p className="text-sm text-muted-foreground">{iv.description}</p>
            <p className="text-xs text-muted-foreground">Start: {new Date(iv.startTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
