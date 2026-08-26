"use client";

import * as React from "react";
import { addDays, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { CalendarEventItem } from "./CalendarEventItem";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import {
  END_HOUR,
  HOUR_HEIGHT,
  HOURS,
  START_HOUR,
  TIME_COLUMN_WIDTH,
} from "./constants";
import type { CalendarEvent } from "./types";

interface WeekViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  currentTime: Date | null;
  onEventClick?: (event: CalendarEvent) => void;
}

export function WeekView({
  selectedDate,
  events,
  currentTime,
  onEventClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const currentDayIndex = currentTime
    ? days.findIndex((d) => isSameDay(d, currentTime))
    : -1;
  const showCurrentTime =
    currentDayIndex >= 0 &&
    currentTime &&
    currentTime.getHours() >= START_HOUR &&
    currentTime.getHours() <= END_HOUR;

  // Positionne le défilement sur l'heure actuelle à l'ouverture,
  // pour que la partie utile de la grille (journée) soit visible.
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const dayHeaderRef = React.useRef<HTMLDivElement>(null);
  const didScrollToCurrentTime = React.useRef(false);

  React.useEffect(() => {
    if (didScrollToCurrentTime.current || !currentTime) return;
    didScrollToCurrentTime.current = true;
    const container = scrollContainerRef.current;
    if (container) {
      const headerHeight = dayHeaderRef.current?.offsetHeight ?? 80;
      container.scrollTop = Math.max(
        0,
        headerHeight + (currentTime.getHours() - 2) * HOUR_HEIGHT
      );
    }
  }, [currentTime]);

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Grille horaire : chaque jour est une colonne, les heures descendent de haut en bas.
          L'en-tête des dates vit dans le même conteneur défilant que la grille (sticky)
          afin que les colonnes restent parfaitement alignées malgré la barre de défilement. */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        {/* En-tête des jours — de gauche à droite, collé en haut */}
        <div
          ref={dayHeaderRef}
          className="sticky top-0 z-30 grid shrink-0 border-b bg-background"
          style={{
            gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
          }}
        >
          <div className="flex flex-col items-end justify-end gap-0 p-2 text-[0.65rem] leading-tight text-muted-foreground">
            <span>GMT+08</span>
            <span>GMT+02</span>
          </div>
          {days.map((day, i) => {
            const isCurrent = isToday(day);
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center border-l py-2 first:border-l-0"
              >
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wide",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {format(day, "EEE", { locale: fr })}
                </span>
                <span
                  className={cn(
                    "mt-1 flex size-10 items-center justify-center text-2xl",
                    isCurrent
                      ? "rounded-full bg-primary text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
            gridTemplateRows: `repeat(${HOURS.length}, ${HOUR_HEIGHT}px)`,
            minHeight: `${HOURS.length * HOUR_HEIGHT}px`,
          }}
        >
          {/* Colonne des heures — une cellule par heure, de haut en bas */}
          {HOURS.map((hour, hourIndex) => (
            <div
              key={`time-${hour}`}
              className="relative border-r border-t"
              style={{ gridColumn: 1, gridRow: hourIndex + 1 }}
            >
              <div className="absolute right-2 top-0 flex -translate-y-1/2 flex-col items-end text-[0.7rem] leading-tight text-muted-foreground">
                <span>
                  {format(
                    new Date(new Date().setHours((hour + 6) % 24, 0, 0, 0)),
                    "H'h'"
                  )}
                </span>
                <span>
                  {format(
                    new Date(new Date().setHours(hour, 0, 0, 0)),
                    "H'h'"
                  )}
                </span>
              </div>
            </div>
          ))}

          {/* Colonnes des jours : pour chaque jour (gauche → droite),
              les heures sont empilées de haut en bas */}
          {days.map((_, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {HOURS.map((hour, hourIndex) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className={cn(
                    "border-t border-l",
                    dayIndex === 6 && "border-r"
                  )}
                  style={{
                    gridColumn: dayIndex + 2,
                    gridRow: hourIndex + 1,
                  }}
                />
              ))}
            </React.Fragment>
          ))}

          {/* Événements — placés dans la colonne de leur jour, à leur heure */}
          {events.map((event) => (
            <div
              key={event.id}
              className="relative"
              style={{
                gridColumn: event.dayIndex + 2,
                gridRow: event.hour - START_HOUR + 1,
              }}
            >
              <CalendarEventItem
                event={event}
                onClick={() => onEventClick?.(event)}
              />
            </div>
          ))}

          {/* Indicateur de l'heure actuelle */}
          {showCurrentTime && currentTime && (
            <div
              className="relative z-20"
              style={{
                gridColumn: `${currentDayIndex + 2} / ${currentDayIndex + 3}`,
                gridRow: "1 / -1",
              }}
            >
              <CurrentTimeIndicator currentTime={currentTime} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
