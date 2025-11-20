"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { LogIn, Plus, Zap, Copy } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import MeetingCard from "@/components/MeetingCard";
import { Button } from "@/components/ui/button";
import type { Interview } from '@/types';

function SchedulePage() {
  const router = useRouter();
  const { status } = useSession();
  const { isInterviewer, isLoading } = useUserRole();
  const [interviews, setInterviews] = useState<Interview[] | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  // Must declare before any early returns to satisfy hooks rules
  const [instantMeeting, setInstantMeeting] = useState<any | null>(null);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingList(true);
      try {
        const res = await fetch('/api/interviews');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (!cancelled) setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setInterviews([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    };
    if (status === 'authenticated') load();
    return () => { cancelled = true; };
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && !isLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isInterviewer, isLoading, router, status]);

  if (status === "loading" || isLoading) return <LoaderUI />;

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold">Schedule Interviews</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Sign in to access the interview scheduling feature and manage your
            technical assessments.
          </p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!isInterviewer) {
    return null;
  }

  const startInstantMeeting = async () => {
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ instant: true, title: 'Instant Meeting' })
      });
      if (!res.ok) throw new Error('Failed to create instant meeting');
      const data = await res.json();
      if (data?.id) {
        setInstantMeeting(data);
        toast.success('Instant meeting created');
      } else {
        toast.error('Invalid response');
      }
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || 'Failed to start instant meeting');
    }
  };

  const copyCode = () => {
    if (!instantMeeting?.meetingCode) return;
    navigator.clipboard.writeText(instantMeeting.meetingCode).then(() => {
      toast.success('Meeting code copied');
    });
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-6">
      <Dialog open={!!instantMeeting} onOpenChange={(o) => !o && setInstantMeeting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between w-full">
              Instant Meeting Ready
            </DialogTitle>
            <DialogDescription>
              Share this code with participants so they can join.
            </DialogDescription>
          </DialogHeader>
          {instantMeeting && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono tracking-wider font-semibold">
                  {instantMeeting.meetingCode}
                </span>
                <Button variant="outline" size="sm" onClick={copyCode}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => router.push(`/meeting/${instantMeeting.id}`)}>
                  Enter Meeting Room
                </Button>
                <Button variant="secondary" onClick={() => setInstantMeeting(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-between py-6 glass-surface rounded-xl px-6 mb-8 shadow-xl">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">Interviews</h1>
          <p className="text-zinc-300 mt-2 text-sm">Plan, launch and manage interview sessions</p>
        </div>
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={() => router.push("/schedule/new")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={startInstantMeeting}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Start Instant Meeting
          </Button>
        </div>
      </div>

      {/* LOADING STATE & MEETING CARDS */}
      {loadingList || interviews === null ? (
        <div className="flex justify-center py-12">
          <LoaderUI />
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-lg mb-4 ">No interviews scheduled yet</p>
          <p className="mb-6">Get started by scheduling your first interview</p>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
