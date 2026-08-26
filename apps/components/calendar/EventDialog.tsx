"use client";

import * as React from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlignLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CalendarEvent } from "./types";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTime(value: number): string {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

interface EventDialogProps {
  event: CalendarEvent | null;
  calendarLabel?: string;
  selectedDate: Date;
  onOpenChange: (open: boolean) => void;
}

export function EventDialog({
  event,
  calendarLabel,
  selectedDate,
  onOpenChange,
}: EventDialogProps) {
  return (
    <Dialog open={event !== null} onOpenChange={onOpenChange}>
      {event && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <span className="text-muted-foreground">
                {calendarLabel ?? "Agenda"}
              </span>
            </div>
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="size-4 shrink-0 text-muted-foreground" />
              <span>
                {formatTime(event.hour)} –{" "}
                {formatTime(event.hour + event.duration)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>
                {capitalize(
                  format(
                    addDays(
                      startOfWeek(selectedDate, { weekStartsOn: 1 }),
                      event.dayIndex
                    ),
                    "EEEE d MMMM yyyy",
                    { locale: fr }
                  )
                )}
              </span>
            </div>
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <User className="size-4 shrink-0 text-muted-foreground" />
                <span>{event.attendees.join(", ")}</span>
              </div>
            )}
            {event.description && (
              <div className="flex items-start gap-3 text-sm">
                <AlignLeft className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{event.description}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
