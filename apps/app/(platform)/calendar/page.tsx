"use client";

import * as React from "react";

import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { EventDialog } from "@/components/calendar/EventDialog";
import { CalendarHeader } from "@/components/calendar/Header";
import { CalendarSidebar } from "@/components/calendar/Sidebar";
import { WeekView } from "@/components/calendar/WeekView";
import { GOOGLE_BLUE, GOOGLE_GREEN } from "@/components/calendar/constants";
import type { CalendarEvent, CalendarGroup } from "@/components/calendar/types";

function buildSampleEvents(groups: CalendarGroup[]): CalendarEvent[] {
  const colorOf = (calendarId: string): string =>
    groups
      .flatMap((group) => group.calendars)
      .find((calendar) => calendar.id === calendarId)?.color ?? GOOGLE_BLUE;

  const list: CalendarEvent[] = [];
  const add = (
    calendarId: string,
    dayIndex: number,
    hour: number,
    title: string,
    duration: number,
    description?: string,
    attendee?: string
  ) => {
    list.push({
      id: `${calendarId}-${dayIndex}-${hour}`,
      title,
      calendarId,
      dayIndex,
      hour,
      duration,
      color: colorOf(calendarId),
      description,
      attendees: attendee ? [attendee] : undefined,
    });
  };

  // Rituels quotidiens — agenda « Liam Von Astoria »
  for (let d = 0; d < 7; d++) {
    add("liam", d, 12, "Pause déjeuner", 0.5);
    add("liam", d, 15, "Pause de l'après-midi", 0.5);
    add("liam", d, 18, "Fin de journée", 0.5);
  }

  // Réunions en semaine — agenda « Liam Von Astoria »
  add(
    "liam",
    0,
    10,
    "Réunion d'équipe",
    1,
    "Point hebdomadaire avec l'équipe produit.",
    "Équipe produit"
  );
  add(
    "liam",
    1,
    10,
    "Réunion d'équipe",
    1,
    "Point hebdomadaire avec l'équipe produit.",
    "Équipe produit"
  );
  add(
    "liam",
    2,
    10,
    "Réunion d'équipe",
    1,
    "Point hebdomadaire avec l'équipe produit.",
    "Équipe produit"
  );
  add("liam", 3, 14, "Point avec le client", 1, undefined, "Acme Corp");
  add("liam", 4, 14, "Point avec le client", 1, undefined, "Acme Corp");

  // Soirées — agenda « Liam Von Astoria »
  add("liam", 1, 19, "Sport", 1);
  add("liam", 4, 20, "Soirée entre amis", 2, "Retrouvailles chez Hugo.");

  // Tâches — agenda « Tasks »
  add("tasks", 2, 11, "Préparer le rapport mensuel", 1);
  add("tasks", 4, 11, "Relire les devis en attente", 0.5);

  // Anniversaires — agenda « Anniversaires »
  add("anniversaires", 1, 9, "Anniversaire de Léa", 0.5);
  add("anniversaires", 4, 9, "Anniversaire de Hugo", 0.5);

  return list;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [calendarGroups, setCalendarGroups] = React.useState<CalendarGroup[]>([
    {
      id: "my-calendars",
      title: "Mes agendas",
      calendars: [
        { id: "liam", label: "Liam Von Astoria", color: GOOGLE_BLUE, checked: true },
        { id: "anniversaires", label: "Anniversaires", color: GOOGLE_GREEN, checked: true },
        { id: "tasks", label: "Tasks", color: GOOGLE_BLUE, checked: true },
      ],
    },
    {
      id: "other-calendars",
      title: "Autres agendas",
      calendars: [
        { id: "belgium", label: "Jours fériés en Belgique", color: GOOGLE_GREEN, checked: true },
      ],
    },
  ]);

  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [events, setEvents] = React.useState<CalendarEvent[]>(() =>
    buildSampleEvents(calendarGroups)
  );

  React.useEffect(() => {
    setCurrentTime(new Date());
    const id = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const calendars = React.useMemo(
    () => calendarGroups.flatMap((group) => group.calendars),
    [calendarGroups]
  );

  const selectedCalendar = selectedEvent
    ? calendars.find((calendar) => calendar.id === selectedEvent.calendarId)
    : undefined;

  const handleGroupChange = React.useCallback(
    (groupId: string, calendarId: string, checked: boolean) => {
      setCalendarGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                calendars: group.calendars.map((calendar) =>
                  calendar.id === calendarId ? { ...calendar, checked } : calendar
                ),
              }
            : group
        )
      );
    },
    []
  );

  const handleCreateEvent = React.useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((v) => !v)}
      />

      <div className="flex min-h-0 flex-1">
        <CalendarSidebar
          isOpen={isSidebarOpen}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          groups={calendarGroups}
          onGroupChange={handleGroupChange}
          onCreate={() => setIsCreateDialogOpen(true)}
        />

        <WeekView
          selectedDate={selectedDate}
          events={events}
          currentTime={currentTime}
          onEventClick={setSelectedEvent}
        />
      </div>

      <EventDialog
        event={selectedEvent}
        calendarLabel={selectedCalendar?.label}
        selectedDate={selectedDate}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      />

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        calendars={calendars}
        selectedDate={selectedDate}
        onCreate={handleCreateEvent}
      />
    </div>
  );
}
