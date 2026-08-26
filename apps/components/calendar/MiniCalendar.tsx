"use client";

import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface MiniCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function MiniCalendar({ selectedDate, onSelect }: MiniCalendarProps) {
  const [viewDate, setViewDate] = React.useState(startOfMonth(selectedDate));

  React.useEffect(() => {
    setViewDate(startOfMonth(selectedDate));
  }, [selectedDate]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 }),
  });

  return (
    <div className="w-full px-1">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          {capitalize(format(viewDate, "MMMM yyyy", { locale: fr }))}
        </span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            aria-label="Mois précédent"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            aria-label="Mois suivant"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={`weekday-${index}`}
            className="py-1 text-[0.65rem] font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const selected = isSameDay(day, selectedDate);
          const inCurrentMonth = isSameMonth(day, viewDate);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "flex h-7 w-full items-center justify-center rounded-full text-xs transition-colors",
                selected &&
                  "bg-primary font-medium text-primary-foreground hover:bg-primary/90",
                !selected && today && "text-primary font-medium",
                !selected &&
                  inCurrentMonth &&
                  !today &&
                  "text-foreground hover:bg-accent",
                !selected &&
                  !inCurrentMonth &&
                  "text-muted-foreground hover:bg-accent"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
