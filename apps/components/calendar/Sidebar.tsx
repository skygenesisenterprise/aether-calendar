"use client";

import * as React from "react";
import { ChevronDown, Plus, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AgendaSection } from "./AgendaSection";
import { CalendarCheckbox } from "./CalendarCheckbox";
import { MiniCalendar } from "./MiniCalendar";
import type { CalendarGroup } from "./types";

interface CalendarSidebarProps {
  isOpen: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  groups: CalendarGroup[];
  onGroupChange: (groupId: string, calendarId: string, checked: boolean) => void;
  onCreate?: () => void;
}

export function CalendarSidebar({
  isOpen,
  selectedDate,
  onSelectDate,
  groups,
  onGroupChange,
  onCreate,
}: CalendarSidebarProps) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col gap-5 overflow-hidden border-r bg-background transition-all duration-200",
        isOpen ? "w-64 px-3 py-4" : "w-0 px-0 py-0 opacity-0"
      )}
      aria-hidden={!isOpen}
    >
      <Button
        onClick={onCreate}
        className="w-fit gap-2 rounded-2xl bg-background px-5 py-5 text-base text-foreground shadow-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="size-5" />
        Créer
        <ChevronDown className="size-4" />
      </Button>

      <MiniCalendar selectedDate={selectedDate} onSelect={onSelectDate} />

      <Button
        variant="ghost"
        className="h-auto justify-start gap-3 px-2 py-2 text-sm text-muted-foreground"
      >
        <Search className="size-4" />
        <span className="truncate">Rechercher des co…</span>
      </Button>

      <AgendaSection
        title="Pages de réservation"
        action={
          <Button variant="ghost" size="icon" className="size-7" aria-label="Ajouter une page de réservation">
            <Plus className="size-4" />
          </Button>
        }
        defaultOpen={false}
      >
        <p className="px-2 text-xs text-muted-foreground">
          Aucune page de réservation
        </p>
      </AgendaSection>

      {groups.map((group) => (
        <AgendaSection
          key={group.id}
          title={group.title}
          action={
            <Button variant="ghost" size="icon" className="size-7" aria-label={`Ajouter un agenda à ${group.title}`}>
              <Plus className="size-4" />
            </Button>
          }
        >
          {group.calendars.map((calendar) => (
            <CalendarCheckbox
              key={calendar.id}
              color={calendar.color}
              checked={calendar.checked}
              onCheckedChange={(checked) =>
                onGroupChange(group.id, calendar.id, checked)
              }
              label={calendar.label}
            />
          ))}
        </AgendaSection>
      ))}

      <div className="mt-auto pt-4">
        <button
          type="button"
          className="px-2 text-xs text-muted-foreground hover:underline"
        >
          Conditions – Confidentialité
        </button>
      </div>
    </aside>
  );
}
