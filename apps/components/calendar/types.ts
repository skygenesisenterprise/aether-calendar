export interface CalendarEvent {
  id: string;
  title: string;
  calendarId: string;
  dayIndex: number;
  hour: number;
  duration: number;
  color: string;
  description?: string;
  attendees?: string[];
}

export interface CalendarSource {
  id: string;
  label: string;
  color: string;
  checked: boolean;
}

export interface CalendarGroup {
  id: string;
  title: string;
  calendars: CalendarSource[];
}
