"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
// import LoaderUI from "../LoaderUI";
// We now fetch token via API route to avoid server action issues client-side
import toast from "react-hot-toast";
import { sanitizeUserId } from "@/lib/utils";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();
  const clientRef = useRef<StreamVideoClient | null>(null);
  const isInitializingRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializingRef.current) return;

    if (status !== "authenticated" || !session?.user) {
      return;
    }

    const sanitizedUserId = sanitizeUserId(session?.user?.email || "unknown");
    
    // If we already have a client for this user, don't reinitialize
    if (clientRef.current && userIdRef.current === sanitizedUserId) {
      return;
    }

    const initializeClient = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializingRef.current) return;
      
      // Clean up existing client if user changed
      if (clientRef.current && userIdRef.current !== sanitizedUserId) {
        try {
          await clientRef.current.disconnectUser();
        } catch (error) {
          console.error("Error disconnecting previous user:", error);
        }
        clientRef.current = null;
        setStreamVideoClient(undefined);
      }

      try {
        isInitializingRef.current = true;

        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        if (!apiKey) {
          // Missing API key; skip initialization
          return;
        }

        userIdRef.current = sanitizedUserId;

        const tokenProvider = async () => {
          try {
            const res = await fetch("/api/stream/video/token");
            if (!res.ok) throw new Error("Token fetch failed");
            const data = await res.json();
            if (!data.token) throw new Error("No token returned");
            return data.token;
          } catch (err) {
            console.error("Stream token error", err);
            toast.error("Video token error");
            throw err;
          }
        };

        // Create client with minimal configuration
        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: sanitizedUserId,
            name: session?.user?.name || session?.user?.email || "Unknown",
          },
          tokenProvider,
        });

        try {
          await client.connectUser({
            id: sanitizedUserId,
            name: session?.user?.name || session?.user?.email || "Unknown",
          });

          clientRef.current = client;
          setStreamVideoClient(client);
        } catch (error) {
          console.error("Stream connection error:", error);
            toast.error("Video connect failed");
        }
      } catch (error) {
        console.error("Stream initialization error:", error);
        toast.error("Stream init failed");
      } finally {
        isInitializingRef.current = false;
      }
    };

    initializeClient();

    return () => {
      // Cleanup function
      if (clientRef.current) {
        try {
          clientRef.current.disconnectUser();
        } catch (error) {
          console.error("Error disconnecting user:", error);
        }
        clientRef.current = null;
      }
    };
  }, [session?.user, status]); // Added session?.user to dependencies

  // Handle session changes
  useEffect(() => {
    if (status === "unauthenticated" && clientRef.current) {
      try {
        clientRef.current.disconnectUser();
      } catch (error) {
        console.error("Error disconnecting user:", error);
      }
      clientRef.current = null;
      setStreamVideoClient(undefined);
    }
  }, [status]);

  // Always render children; wrap only when client exists.
  return streamVideoClient ? (
    <StreamVideo client={streamVideoClient}>{children}</StreamVideo>
  ) : (
    <>{children}</>
  );
};

export default StreamVideoProvider;
