"use client";

import React, { useEffect, useState } from "react";

export default function TestDbPage() {
  const [users, setUsers] = useState<any[] | null>(null);
  const [comments, setComments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [uRes, cRes] = await Promise.all([
          fetch('/api/db/users'),
          fetch('/api/db/comments?interviewId=1'),
        ]);
        const [uJson, cJson] = await Promise.all([uRes.json(), cRes.json()]);
        if (!mounted) return;
        setUsers(uJson);
        setComments(cJson);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test DB Endpoints</h2>
      {loading && <p>Loading...</p>}

      <section className="mb-6">
        <h3 className="text-lg font-semibold">Users</h3>
        <pre className="bg-slate-900 text-white p-3 rounded">{users ? JSON.stringify(users, null, 2) : 'No users (yet)'}</pre>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Comments (interviewId=1)</h3>
        <pre className="bg-slate-900 text-white p-3 rounded">{comments ? JSON.stringify(comments, null, 2) : 'No comments (yet)'}</pre>
      </section>
    </div>
  );
}
