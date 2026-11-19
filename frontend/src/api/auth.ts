import type { AuthResponse, User } from "../types/api";
import { api } from "./client";

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  display_name: string;
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login/", credentials);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register/", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout/");
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me/");
  return data;
}