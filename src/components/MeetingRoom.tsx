import {
  CallControls,
  CallingState,
  CallParticipantsList,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { memo, useCallback } from "react";
import {
  LayoutListIcon,
  LoaderIcon,
  UsersIcon,
  AlertCircleIcon,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CollaborativeCodeEditor from "./CollaborativeCodeEditor";
import {
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { useChatContext } from "stream-chat-react";
import MeetingVideo from "./MeetingVideo";
import { ChannelList } from "stream-chat-react";
import toast from "react-hot-toast";

// Channel preview used by ChannelList to show unread badge
const ChannelListPreview = memo(({ channel, setActiveChannel }: any) => {
  const unread = typeof channel.countUnread === 'function' ? channel.countUnread() : channel.state?.unread_count || 0;
  const title = channel.data?.name || channel.id;
  return (
    <div
      className="p-3 cursor-pointer hover:bg-accent/50 flex items-center justify-between"
      onClick={() => setActiveChannel(channel)}
    >
      <div className="text-sm">{title}</div>
      {unread > 0 && (
        <div className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
          {unread}
        </div>
      )}
    </div>
  );
});
ChannelListPreview.displayName = 'ChannelListPreview';

const MeetingRoom = memo(() => {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();
  const [showChatPanel, setShowChatPanel] = useState(false);

  // Check if Stream API is configured - memoized to prevent re-renders
  const isStreamConfigured = useMemo(() => {
    return !!process.env.NEXT_PUBLIC_STREAM_API_KEY;
  }, []);

  // Handle connection errors with debouncing
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      setConnectionError("You have left the video call");
    } else if (callingState === CallingState.JOINED) {
      setConnectionError(null);
    }
  }, [callingState]);

  const getConnectionStatusMessage = useMemo(() => {
    switch (callingState) {
      case CallingState.JOINING:
        return "Joining video call...";
      case CallingState.RINGING:
        return "Call is ringing...";
      case CallingState.LEFT:
        return "You left the call";
      case CallingState.UNKNOWN:
        return "Connecting to video call...";
      default:
        return "Connecting to video call...";
    }
  }, [callingState]);

  const handleReconnect = useCallback(() => {
    setConnectionError(null);
    // Don't reload the page, just reset the error state
    // The Stream client should handle reconnection automatically
  }, []);

  // Fetch meeting code
  const params = useParams() as { id?: string };
  const meetingId = params?.id;
  const [meetingCode, setMeetingCode] = useState<string | null>(null);
  // Guard against invalid meeting id
  useEffect(() => {
    if (meetingId === 'null' || meetingId === undefined) {
      toast.error('Invalid meeting id');
      router.push('/schedule');
    }
  }, [meetingId, router]);
  useEffect(() => {
    let cancelled = false;
    async function fetchCode() {
      if (!meetingId) return;
      try {
        const res = await fetch(`/api/interviews/${meetingId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMeetingCode(data.meetingCode || null);
      } catch (e) {
        console.error('Failed to fetch meeting code', e);
      }
    }
    fetchCode();
    return () => { cancelled = true; };
  }, [meetingId]);

  const copyMeetingCode = useCallback(() => {
    if (!meetingCode) return;
    navigator.clipboard.writeText(meetingCode).then(() => toast.success('Code copied'));
  }, [meetingCode]);

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      {meetingCode && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-background/90 backdrop-blur px-4 py-2 rounded-b-md shadow flex items-center gap-3 border border-border">
          <span className="text-xs uppercase text-muted-foreground">Meeting Code:</span>
          <span className="font-mono text-sm tracking-wider font-semibold">{meetingCode}</span>
          <Button size="sm" variant="outline" onClick={copyMeetingCode}>Copy</Button>
        </div>
      )}
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={100}
          className="relative"
        >
          {/* VIDEO LAYOUT */}
          {!isStreamConfigured ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-6">
                <AlertCircleIcon className="size-8 text-yellow-500 mx-auto" />
                <h3 className="text-lg font-semibold">
                  Video Call Not Configured
                </h3>
                <p className="text-muted-foreground text-sm">
                  Stream API keys are not configured. Video calls are disabled.
                </p>
                <p className="text-xs text-muted-foreground">
                  Add NEXT_PUBLIC_STREAM_API_KEY to your environment variables.
                </p>
              </div>
            </div>
          ) : callingState === CallingState.JOINED ? (
            <div className="absolute inset-0">
              {/* Use MeetingVideo wrapper (renders PaginatedGridLayout or SpeakerLayout) */}
              <MeetingVideo layout={layout === "grid" ? "grid" : "speaker"} />

              {/* PARTICIPANTS LIST OVERLAY */}
              {showParticipants && (
                <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <CallParticipantsList
                    onClose={() => setShowParticipants(false)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                {connectionError ? (
                  <>
                    <AlertCircleIcon className="size-8 text-red-500 mx-auto" />
                    <p className="text-red-600 font-medium">
                      {connectionError}
                    </p>
                    <Button onClick={handleReconnect} variant="outline">
                      Reconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <LoaderIcon className="size-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground">
                      {getConnectionStatusMessage}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* VIDEO CONTROLS */}
          {isStreamConfigured && callingState === CallingState.JOINED && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                  <CallControls onLeave={() => router.push("/")} />

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-10"
                        >
                          <LayoutListIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setLayout("grid")}>
                          Grid View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLayout("speaker")}>
                          Speaker View
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10"
                      onClick={() => setShowParticipants(!showParticipants)}
                    >
                      <UsersIcon className="size-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10"
                      onClick={() => setShowChatPanel((s) => !s)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </Button>

                    <EndCallButton />
                  </div>
                </div>
              </div>
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75} minSize={25}>
          <div className="h-full grid grid-rows-[1fr_auto] gap-2">
            <CollaborativeCodeEditor />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Collapsible chat panel (right side) */}
      {showChatPanel && (
        <div className="absolute right-0 top-0 h-full w-[340px] glass-surface border-l border-white/10 z-40 shadow-2xl">
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-white/10 bg-gradient-to-b from-slate-900/50 to-transparent">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">Chat</h4>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 text-xs rounded-md bg-slate-800/60 hover:bg-slate-700/70 transition-colors border border-white/10 focus-visible:ring-2 focus-visible:ring-blue-400/40"
                    onClick={() => setShowChatPanel(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
              <div className="w-1/3 border-r border-white/10 overflow-auto bg-slate-950/40">
                {/* Channel list: channels where the user is a member */}
                <ChannelList
                  filters={{ type: "messaging", members: { $in: ["__current_user__"] } }}
                  sort={{ last_message_at: -1 }}
                  Preview={ChannelListPreview}
                />
              </div>

              <div className="flex-1 overflow-auto">
                <InterviewChat />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MeetingRoom.displayName = "MeetingRoom";
export default MeetingRoom;

const InterviewChat = memo(() => {
  // determines interview id from the URL param `[id]` and opens channel `interview-<id>`
  const params = useParams() as { id?: string };
  const interviewId = params?.id || "unknown";
  const channelId = `interview-${interviewId}`;
  const { client } = useChatContext();
  const [channel, setChannel] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function initChannel() {
      if (!client) return;
      // Ensure server upserts the interview channel and adds members
      try {
        await fetch('/api/stream/channels/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId: interviewId }),
        });
        // notify user that channel creation/join was attempted
        toast.success('Joining interview chat...');
      } catch (err) {
        console.error('Failed to upsert channel on server', err);
        toast.error('Failed to prepare chat channel');
      }

      const ch = client.channel("messaging", channelId, {
        name: `Interview ${interviewId}`,
      });
      await ch.watch();
      if (mounted) setChannel(ch);
    }
    initChannel();
    return () => {
      mounted = false;
      // don't disconnect client here
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, channelId]);

  if (!channel) return (
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-800/50 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-slate-800/50 rounded animate-pulse w-1/2" />
      <div className="h-4 bg-slate-800/50 rounded animate-pulse w-2/3" />
    </div>
  );

  return (
    <Channel channel={channel}>
      <div className="h-full flex flex-col">
        <ChannelHeader />
        <div className="flex-1 overflow-auto">
          <MessageList />
        </div>
        <div className="p-2">
          <MessageInput />
        </div>
      </div>
    </Channel>
  );
});

InterviewChat.displayName = "InterviewChat";
