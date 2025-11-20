"use client";

import { useSession } from "next-auth/react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, ArrowLeft, LogIn } from "lucide-react";
import { TIME_SLOTS } from "@/constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import LoaderUI from "@/components/LoaderUI";
import { signIn } from "next-auth/react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { useTheme as useNextTheme } from "next-themes";

function NewSchedulePage() {
  const client = useStreamVideoClient();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isInterviewer, isLoading: roleLoading } = useUserRole();
  const [isCreating, setIsCreating] = useState(false);
  const { resolvedTheme } = useNextTheme();

  // Removed user list fetch: participants join via meeting code.

  const muiTheme = createTheme({
    palette: {
      mode: resolvedTheme === "dark" ? "dark" : "light",
    },
  });

  // We no longer pre-assign candidates or interviewers; meeting code sharing handles participation.
  const currentUserEmail = session?.user?.email;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    meetingCode: "", // optional custom code
  });

  // Legacy interviewer selection removed; participants join via code.

  // Redirect if not authenticated or not an interviewer
  useEffect(() => {
    if (status === "authenticated" && !roleLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isInterviewer, roleLoading, router, status]);

  const scheduleMeeting = async () => {
    if (!client || !currentUserEmail) return;

    setIsCreating(true);

    try {
      const { title, description, date, time, meetingCode } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          startTime: meetingDate.getTime(),
          status: "scheduled",
          streamCallId: id,
          meetingCode: meetingCode || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to create interview');

      toast.success("Meeting scheduled successfully!");
      router.push("/schedule");
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading while checking authentication and role
  if (status === "loading" || roleLoading) {
    return <LoaderUI />;
  }

  // Show sign-in page if not authenticated
  if (status !== "authenticated") {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
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

  // Don't render if not an interviewer
  if (!isInterviewer) {
    return null;
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-24 justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/schedule")}
            className="flex items-center gap-2 justify-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Button>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Schedule New Interview</h1>
            <p className="text-muted-foreground mt-1">
              Create a new technical interview session
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interview Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter interview title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {/* Interview Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter interview description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>

            {/* Optional Custom Meeting Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Meeting Code (optional)</label>
              <Input
                placeholder="e.g. SDE2025"
                value={formData.meetingCode}
                onChange={(e) =>
                  setFormData({ ...formData, meetingCode: e.target.value.toUpperCase() })
                }
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground">Uppercase letters & numbers, 4-12 chars.</p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formData.date}
                    onChange={(newValue) =>
                      newValue && setFormData({ ...formData, date: newValue })
                    }
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        placeholder: "Select date",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "6px",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Select
                  value={formData.time}
                  onValueChange={(time) => setFormData({ ...formData, time })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => router.push("/schedule")}
              >
                Cancel
              </Button>
              <Button
                onClick={scheduleMeeting}
                disabled={isCreating}
                className="min-w-[140px]"
              >
                {isCreating ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Interview"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MuiThemeProvider>
  );
}

export default NewSchedulePage;
