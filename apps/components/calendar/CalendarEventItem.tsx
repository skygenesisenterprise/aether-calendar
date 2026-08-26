"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { HOUR_HEIGHT } from "./constants";
import type { CalendarEvent } from "./types";

interface CalendarEventItemProps {
  event: CalendarEvent;
  onClick?: () => void;
}

export function CalendarEventItem({ event, onClick }: CalendarEventItemProps) {
  const height = Math.max(event.duration * HOUR_HEIGHT, 22);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute inset-x-1 top-0 z-10 flex items-center gap-1.5 overflow-hidden rounded border-l-[3px] px-2 py-0.5 text-left text-xs",
        "cursor-pointer transition-all hover:shadow-sm hover:brightness-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      style={{
        height: `${height}px`,
        backgroundColor: `${event.color}14`,
        borderLeftColor: event.color,
        color: event.color,
      }}
      title={event.title}
    >
      <span
        className="size-2.5 shrink-0 rounded-full border"
        style={{ borderColor: event.color }}
      />
      <span className="truncate">{event.title}</span>
    </button>
  );
}
