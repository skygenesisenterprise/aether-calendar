"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface AgendaSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AgendaSection({
  title,
  action,
  children,
  defaultOpen = true,
}: AgendaSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="px-1">
      <div className="mb-1 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1 text-sm font-medium text-foreground",
            "hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          )}
          aria-expanded={isOpen}
        >
          {title}
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {action}
      </div>
      {isOpen && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}
