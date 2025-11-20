"use client";

import React from "react";
import { PaginatedGridLayout, SpeakerLayout } from "@stream-io/video-react-sdk";

export default function MeetingVideo({ layout = "speaker" }: { layout?: "grid" | "speaker" }) {
  // Minimal wrapper for Stream Video layouts. Assumes app is wrapped in StreamVideoProvider.
  return (
    <div className="h-full w-full">
      {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
    </div>
  );
}
