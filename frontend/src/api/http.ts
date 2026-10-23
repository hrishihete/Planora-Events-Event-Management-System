import type { ProblemDetails } from "../types";

const TOKEN_KEY = "planora.token";

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

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${apiBaseUrl()}${path}`, { ...init, headers });
}

export async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ProblemDetails;
    return new ApiError(response.status, body);
  } catch {
    return new ApiError(response.status, { title: "Request failed", detail: response.statusText });
  }
}

export function authHeader(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
