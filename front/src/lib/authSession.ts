import { getAccessToken } from "./tokenStorage";

export type AppRole = "ADMIN" | "DEPPI" | "PROFESSOR" | "ALUNO";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    const result: unknown = JSON.parse(decoded);

    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function getSessionUser(): SessionUser | null {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodePayload(token);
  if (
    !payload ||
    typeof payload.sub !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.email !== "string" ||
    !Array.isArray(payload.roles) ||
    !payload.roles.every((role): role is string => typeof role === "string")
  ) {
    return null;
  }

  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    roles: payload.roles,
  };
}

export function getPrimaryRole(user: SessionUser): AppRole | null {
  const role = (["ADMIN", "DEPPI", "PROFESSOR", "ALUNO"] as const).find((candidate) =>
    user.roles.includes(candidate),
  );
  return role ?? null;
}

