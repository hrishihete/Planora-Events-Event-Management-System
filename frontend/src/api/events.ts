import type { CreateEventPayload, EventRecord, ProblemDetails } from "../types";

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ProblemDetails;

  constructor(status: number, problem: ProblemDetails) {
    super(problem.detail ?? problem.title ?? `Request failed (${status})`);
    this.status = status;
    this.problem = problem;
  }
}

export function apiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured === undefined || configured === "") {
    return "";
  }
  return configured.replace(/\/$/, "");
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ProblemDetails;
    return new ApiError(response.status, body);
  } catch {
    return new ApiError(response.status, { title: "Request failed", detail: response.statusText });
  }
}

export async function listEvents(): Promise<EventRecord[]> {
  const response = await fetch(`${apiBaseUrl()}/api/v1/events`);
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as EventRecord[];
}

export async function getEvent(id: string): Promise<EventRecord> {
  const response = await fetch(`${apiBaseUrl()}/api/v1/events/${id}`);
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as EventRecord;
}

export async function createEvent(payload: CreateEventPayload): Promise<EventRecord> {
  const response = await fetch(`${apiBaseUrl()}/api/v1/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as EventRecord;
}

export function toOffsetDateTime(date: string, time: string): string {
  if (!date || !time) {
    throw new Error("Date and time are required");
  }
  const local = new Date(`${date}T${time}`);
  if (Number.isNaN(local.getTime())) {
    throw new Error("Invalid date or time");
  }
  const offsetMinutes = -local.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}${sign}${hours}:${minutes}`;
}

export function dollarsToCents(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Budget must be a non-negative number");
  }
  return Math.round(parsed * 100);
}
