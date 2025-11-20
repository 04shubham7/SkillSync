import type { Interview } from "@/types";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function MeetingCard({ interview }: { interview: Interview }) {
    const router = useRouter();
    const status = getMeetingStatus(interview);
    const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

    return (
        <Card className="group h-full w-full flex flex-col rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 dark:from-white/5 dark:to-white/1 backdrop-blur-md hover:border-blue-400/40 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-transparent pointer-events-none transition-opacity" />
            <CardHeader className="space-y-3 flex-grow relative z-10">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarIcon className="h-4 w-4 text-blue-400" />
                            <span>{formattedDate}</span>
                        </div>
                        <Badge
                            className="mt-2"
                            variant={
                                status === "live"
                                    ? "default"
                                    : status === "upcoming"
                                    ? "secondary"
                                    : "outline"
                            }
                        >
                            {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
                        </Badge>
                    </div>
                    {interview.meetingCode && (
                        <div className="text-[10px] uppercase tracking-wide font-medium text-blue-300 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                            Code: {interview.meetingCode}
                        </div>
                    )}
                </div>
                <CardTitle className="text-lg font-semibold text-white tracking-tight">
                    {interview.title}
                </CardTitle>
                {interview.description && (
                    <CardDescription className="line-clamp-2 text-zinc-300">
                        {interview.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="relative z-10 space-y-3">
                {status === "live" && (
                    <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => router.push(`/meeting/${interview.id}`)}
                    >
                        Join Meeting
                    </Button>
                )}
                {status === "upcoming" && (
                    <Button variant="subtle" className="w-full" disabled>
                        Waiting to Start
                    </Button>
                )}
                <div className="flex flex-wrap gap-2 items-center justify-between pt-1">
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => router.push(`/meetings/${interview.id}`)}>
                            View
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                if (!confirm("Delete this meeting?")) return;
                                try {
                                    const res = await fetch(`/api/interviews/${interview.id}`, { method: "DELETE" });
                                    if (!res.ok) throw new Error("Delete failed");
                                    router.refresh();
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to delete meeting");
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                    {status !== "live" && interview.meetingCode && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                try {
                                    navigator.clipboard.writeText(interview.meetingCode as string);
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        >
                            Copy Code
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default MeetingCard;
