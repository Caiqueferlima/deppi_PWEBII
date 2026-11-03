import { API_URL } from "../config/api";
import { getAccessToken } from "../lib/tokenStorage";
import { refreshAccessToken } from "./authService";
import type { Institution, InstitutionInput } from "../types/instituicao";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const makeRequest = (token: string | null) =>
    fetch(`${API_URL}/instituicoes${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

  let response = await makeRequest(getAccessToken());

  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    response = await makeRequest(refreshedToken);
  }

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (typeof result === "object" && result !== null) {
      const body = result as Record<string, unknown>;
      if (typeof body.error === "string") {
        throw new Error(body.error);
      }
      if (typeof body.message === "string") {
        throw new Error(body.message);
      }
    }
    throw new Error("Não foi possível concluir a operação.");
  }

  return result as T;
}

export function listInstitutions() {
  return request<Institution[]>("/");
}

export function createInstitution(data: InstitutionInput) {
  return request<Institution>("/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateInstitution(id: string, data: InstitutionInput) {
  return request<Institution>(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteInstitution(id: string) {
  return request<{ message: string }>(`/${id}`, { method: "DELETE" });
}
