import type { AuthUser } from "../types";
import { apiFetch, parseError, storeToken } from "./http";

type AuthResponse = AuthUser & { token: string };

export async function register(payload: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  const body = (await response.json()) as AuthResponse;
  storeToken(body.token);
  return body;
}

export async function login(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  const body = (await response.json()) as AuthResponse;
  storeToken(body.token);
  return body;
}

export async function fetchMe(): Promise<AuthResponse> {
  const response = await apiFetch("/api/v1/me");
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as AuthResponse;
}
