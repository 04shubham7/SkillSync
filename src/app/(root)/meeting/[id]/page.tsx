"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useSession } from "next-auth/react";
import { StreamCall, StreamTheme, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<any>(null);
  const [isCallLoading, setIsCallLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Fetch interview and create/join Stream call
  useEffect(() => {
    if (status !== "authenticated" || !client || !id) return;

    const setupCall = async () => {
      try {
        setIsCallLoading(true);
        
        // Fetch the interview to get or create a Stream call
        const res = await fetch(`/api/interviews/${id}`);
        if (!res.ok) {
          toast.error("Interview not found");
          router.push("/schedule");
          return;
        }

        const interview = await res.json();
        
        // Use existing streamCallId or create a new one
        const callId = interview.streamCallId || `meeting-${id}`;
        const streamCall = client.call("default", callId);
        
        await streamCall.getOrCreate({
          data: {
            starts_at: interview.startTime ? new Date(interview.startTime).toISOString() : new Date().toISOString(),
            custom: {
              description: interview.title || "Interview Meeting",
            },
          },
        });

        // Update interview with streamCallId if it didn't have one
        if (!interview.streamCallId) {
          await fetch(`/api/interviews/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ streamCallId: callId }),
          });
        }

        setCall(streamCall);
      } catch (error) {
        console.error("Error setting up call:", error);
        toast.error("Failed to join meeting");
      } finally {
        setIsCallLoading(false);
      }
    };

    setupCall();
  }, [client, id, status, router]);

  if (status === "loading") {
    return <LoaderUI />;
  }

  if (status !== "authenticated") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Sign in to join meeting
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to join this meeting.
          </p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-200 font-medium shadow-lg mx-auto"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (isCallLoading) {
    return <LoaderUI />;
  }

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  return (
    <>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </>
  );
}

export default MeetingPage;
