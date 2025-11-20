"use client";

import React, { useEffect, useState } from 'react';
import type { Interview } from '@/types';
import { Button } from './ui/button';

export default function MeetingDetail({ id }: { id: string }) {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchInterview() {
    setLoading(true);
    try {
      const res = await fetch(`/api/interviews/${id}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setInterview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  if (!id) return <div>Missing id</div>;

  if (loading) return <div>Loading...</div>;

  if (!interview) return <div>No interview found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{interview.title}</h2>
      <p className="text-sm text-muted-foreground mb-4">Code: {interview.meetingCode}</p>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Interview Details</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Status:</span> {interview.status || 'Scheduled'}</p>
          {interview.candidateId && (
            <p><span className="font-medium">Candidate ID:</span> {interview.candidateId}</p>
          )}
          {interview.interviewerIds && interview.interviewerIds.length > 0 && (
            <p><span className="font-medium">Interviewers:</span> {interview.interviewerIds.length}</p>
          )}
          {interview.startTime && (
            <p><span className="font-medium">Start Time:</span> {new Date(Number(interview.startTime)).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => window.location.href = `/meeting/${interview.id}`}>Go to Room</Button>
      </div>
    </div>
  );
}
