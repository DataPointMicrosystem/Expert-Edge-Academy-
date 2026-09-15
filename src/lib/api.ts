const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("currentUser");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL is not configured.", 0, "CONFIG_ERROR");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok || body.success === false) {
      if (response.status === 401) clearAuthSession();
      const message =
        response.status >= 500 || body.message === "Internal server error"
          ? "The service is temporarily unavailable. Please try again in a moment."
          : body.message || "Request failed. Please try again.";
      throw new ApiError(message, response.status, body.error?.code);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "The request timed out. Please try again.",
        408,
        "TIMEOUT",
      );
    }
    throw new ApiError(
      "Unable to reach the server. Please try again.",
      0,
      "NETWORK_ERROR",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "instructor" | "admin";
  isVerified: boolean;
  avatar?: string;
};

export type AuthResponse = {
  success: boolean;
  data: { token: string; user: ApiUser };
};
