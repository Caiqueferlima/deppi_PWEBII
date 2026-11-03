import type { LoginCredentials, LoginResponse } from "../types/auth";
import { API_URL } from "../config/api";
import {
  clearTokens,
  getRefreshToken,
  saveAccessToken,
  saveTokens,
} from "../lib/tokenStorage";

function getErrorMessage(result: unknown) {
  if (typeof result === "object" && result !== null) {
    const body = result as Record<string, unknown>;

    if (typeof body.error === "string") {
      return body.error;
    }

    if (typeof body.message === "string") {
      return body.message;
    }
  }

  return "Não foi possível realizar login";
}

function isLoginResponse(result: unknown): result is LoginResponse {
  if (typeof result !== "object" || result === null) {
    return false;
  }

  const body = result as Record<string, unknown>;
  return (
    typeof body.accessToken === "string" &&
    typeof body.refreshToken === "string"
  );
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/autenticacao/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  if (!isLoginResponse(result)) {
    throw new Error("A API retornou uma resposta inesperada.");
  }

  saveTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(`${API_URL}/autenticacao/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearTokens();
  }
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await fetch(`${API_URL}/autenticacao/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const result: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    typeof result !== "object" ||
    result === null ||
    typeof (result as Record<string, unknown>).accessToken !== "string"
  ) {
    clearTokens();
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const accessToken = (result as Record<string, string>).accessToken;
  saveAccessToken(accessToken);
  return accessToken;
}
