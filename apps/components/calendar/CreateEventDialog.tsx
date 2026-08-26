"use client";

import * as React from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GOOGLE_BLUE } from "./constants";
import type { CalendarEvent, CalendarSource } from "./types";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTime(hour: number): string {
  return `${hour}h00`;
}

function formatDuration(duration: number): string {
  if (duration < 1) return `${Math.round(duration * 60)} min`;
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  return minutes > 0
    ? `${hours}h${minutes.toString().padStart(2, "0")}`
    : `${hours}h`;
}

const DURATION_OPTIONS = [0.5, 1, 1.5, 2, 3, 4];

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendars: CalendarSource[];
  selectedDate: Date;
  onCreate: (event: CalendarEvent) => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  calendars,
  selectedDate,
  onCreate,
}: CreateEventDialogProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [title, setTitle] = React.useState("");
  const [calendarId, setCalendarId] = React.useState("");
  const [dayIndex, setDayIndex] = React.useState(0);
  const [hour, setHour] = React.useState(9);
  const [duration, setDuration] = React.useState(1);
  const [attendee, setAttendee] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Réinitialise le formulaire à chaque ouverture.
  React.useEffect(() => {
    if (!open) return;
    const initialDayIndex = weekDays.findIndex((day) =>
      isSameDay(day, selectedDate)
    );
    setTitle("");
    setCalendarId(calendars[0]?.id ?? "");
    setDayIndex(initialDayIndex >= 0 ? initialDayIndex : 0);
    setHour(9);
    setDuration(1);
    setAttendee("");
    setDescription("");
  }, [open, calendars, weekDays, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const calendar = calendars.find((c) => c.id === calendarId);
    const trimmedAttendee = attendee.trim();

    onCreate({
      id: `created-${Date.now()}`,
      title: trimmedTitle,
      calendarId,
      dayIndex,
      hour,
      duration,
      color: calendar?.color ?? GOOGLE_BLUE,
      description: description.trim() || undefined,
      attendees: trimmedAttendee ? [trimmedAttendee] : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvel événement</DialogTitle>
            <DialogDescription>
              Renseignez les informations de l&apos;événement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Titre</Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Réunion d'équipe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agenda</Label>
                <Select value={calendarId} onValueChange={setCalendarId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: calendar.color }}
                          />
                          {calendar.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Jour</Label>
                <Select
                  value={String(dayIndex)}
                  onValueChange={(value) => setDayIndex(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekDays.map((day, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {capitalize(format(day, "EEEE d", { locale: fr }))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure de début</Label>
                <Select
                  value={String(hour)}
                  onValueChange={(value) => setHour(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, h) => (
                      <SelectItem key={h} value={String(h)}>
                        {formatTime(h)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Durée</Label>
                <Select
                  value={String(duration)}
                  onValueChange={(value) => setDuration(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {formatDuration(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-attendee">
                Personne (facultatif)
              </Label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="event-attendee"
                  className="pl-9"
                  value={attendee}
                  onChange={(e) => setAttendee(e.target.value)}
                  placeholder="Ex. Marie Dupont"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajouter une description…"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!title.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
