export const EVENT_TYPES = [
  "WEDDING",
  "CORPORATE",
  "PRIVATE_PARTY",
  "FESTIVAL",
  "CULTURAL",
  "BIRTHDAY",
  "GRADUATION",
  "OTHER",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type EventStatus =
  | "DRAFT_REQUEST"
  | "DETAILS_PENDING"
  | "REJECTED"
  | "PLANNING";

export type EventRecord = {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string | null;
  eventName: string;
  eventType: EventType;
  startsAt: string;
  location: string;
  headcount: number;
  budgetCents: number;
  currency: string;
  details: string | null;
  specialRequests: string | null;
  status: EventStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventPayload = {
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  eventName: string;
  eventType: EventType;
  startsAt: string;
  location: string;
  headcount: number;
  budgetCents: number;
  currency: string;
  details?: string;
  specialRequests?: string;
};

export type ProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string>;
};
