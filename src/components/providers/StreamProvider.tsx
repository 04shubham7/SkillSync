"use client";

import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

export default function StreamProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    let localClient: StreamChat | null = null;
    (async () => {
      try {
        const res = await fetch("/api/stream/token");
        if (!res.ok) return;
        const { apiKey, token, userId } = await res.json();
        if (!apiKey || !token || !userId) return;
        localClient = StreamChat.getInstance(apiKey);
        await localClient.connectUser({ id: userId }, token);
        if (cancelled) {
          localClient.disconnectUser();
          return;
        }
        setClient(localClient);
      } catch {
        // swallow errors
      }
    })();
    return () => {
      cancelled = true;
      if (localClient) localClient.disconnectUser();
    };
  }, []);

  // If client connected, wrap children in Chat; else render children directly.
  if (client) return <Chat client={client}>{children}</Chat>;
  return <>{children}</>;
}
