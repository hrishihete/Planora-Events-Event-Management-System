import type { EventType } from "../types";

const TYPE_LABELS: Record<EventType, string> = {
  WEDDING: "Wedding",
  CORPORATE: "Corporate",
  PRIVATE_PARTY: "Private Party",
  FESTIVAL: "Festival",
  CULTURAL: "Cultural",
  BIRTHDAY: "Birthday",
  GRADUATION: "Graduation",
  OTHER: "Other",
};

export function eventTypeLabel(type: EventType): string {
  return TYPE_LABELS[type];
}

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function statusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
