import { API_URL } from "../config/api";
import { getAccessToken } from "../lib/tokenStorage";
import { refreshAccessToken } from "./authService";
import type { Papel, Usuario } from "../types/usuario";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const makeRequest = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

  let response = await makeRequest(getAccessToken());
  if (response.status === 401) {
    response = await makeRequest(await refreshAccessToken());
  }

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (typeof result === "object" && result !== null) {
      const body = result as Record<string, unknown>;
      if (typeof body.error === "string") throw new Error(body.error);
      if (typeof body.message === "string") throw new Error(body.message);
    }
    throw new Error("Não foi possível concluir a operação.");
  }
  return result as T;
}

export function listUsers() {
  return request<Usuario[]>("/usuarios");
}

export function listRoles() {
  return request<Papel[]>("/permissoes/papeis");
}

export function grantRole(userId: string, papelId: string) {
  return request<{ message: string }>(`/permissoes/usuarios/${userId}/papeis`, {
    method: "POST",
    body: JSON.stringify({ papelId }),
  });
}
