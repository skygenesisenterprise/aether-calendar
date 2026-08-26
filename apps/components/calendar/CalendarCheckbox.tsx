"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface CalendarCheckboxProps {
  color: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export function CalendarCheckbox({
  color,
  checked,
  onCheckedChange,
  label,
}: CalendarCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-pressed={checked}
    >
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded border"
        style={{
          backgroundColor: checked ? color : "transparent",
          borderColor: color,
        }}
      >
        {checked && <Check className="size-3 text-white" />}
      </span>
      <span className="flex-1 truncate text-sm">{label}</span>
    </button>
  );
}
