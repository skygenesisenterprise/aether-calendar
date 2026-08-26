"use client";

import * as React from "react";

import { HOUR_HEIGHT, START_HOUR } from "./constants";

interface CurrentTimeIndicatorProps {
  currentTime: Date;
}

export function CurrentTimeIndicator({ currentTime }: CurrentTimeIndicatorProps) {
  const minutesFromStart =
    (currentTime.getHours() - START_HOUR) * 60 + currentTime.getMinutes();
  const top = (minutesFromStart / 60) * HOUR_HEIGHT;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{ top: `${top}px` }}
      aria-hidden="true"
    >
      <div className="absolute left-0 right-0 h-[2px] bg-red-500" />
      <div className="absolute -left-[5px] -top-[4px] size-[10px] rounded-full bg-red-500" />
    </div>
  );
}
