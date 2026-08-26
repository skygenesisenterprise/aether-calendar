"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
  Menu,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface CalendarHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function CalendarHeader({
  selectedDate,
  onDateChange,
  isSidebarOpen,
  onSidebarToggle,
}: CalendarHeaderProps) {
  const today = new Date();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSidebarToggle}
        aria-label={isSidebarOpen ? "Masquer le panneau" : "Afficher le panneau"}
        aria-pressed={isSidebarOpen}
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex items-center gap-2 pr-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#1a73e8] text-white shadow-sm">
          <span className="text-lg font-medium">{format(today, "d")}</span>
        </div>
        <span className="text-[1.35rem] font-normal text-foreground">
          Calendar
        </span>
      </div>

      <Button
        variant="outline"
        className="rounded-full px-5 font-medium"
        onClick={() => onDateChange(new Date())}
      >
        Aujourd&apos;hui
      </Button>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDateChange(addDays(selectedDate, -7))}
          aria-label="Semaine précédente"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDateChange(addDays(selectedDate, 7))}
          aria-label="Semaine suivante"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <h1 className="min-w-40 text-[1.35rem] font-normal">
        {capitalize(format(selectedDate, "MMMM yyyy", { locale: fr }))}
      </h1>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Rechercher">
          <Search className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Aide">
          <HelpCircle className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Paramètres">
          <Settings className="size-5" />
        </Button>

        <Select defaultValue="week">
          <SelectTrigger className="w-32" aria-label="Vue du calendrier">
            <SelectValue placeholder="Semaine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Jour</SelectItem>
            <SelectItem value="week">Semaine</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" aria-label="Calendrier">
          <CalendarIcon className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Tâches">
          <CheckSquare className="size-5" />
        </Button>

        <Button
          variant="outline"
          className="gap-2 rounded-lg px-3 font-medium"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="size-4" />
          <span className="hidden sm:inline">Actualiser</span>
        </Button>

        <Button variant="ghost" size="icon" aria-label="Applications">
          <LayoutGrid className="size-5" />
        </Button>

        <Avatar>
          <AvatarFallback className="bg-[#1a73e8] text-sm font-medium text-white">
            LA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
