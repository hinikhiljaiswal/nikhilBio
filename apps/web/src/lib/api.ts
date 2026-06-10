const API_URL = "/api";

export type ApiResult<T> = {
  data?: T;
  error?: string;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.message) {
        return { error: payload.message };
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (response.status === 404 && contentType.includes("text/html")) {
        return {
          error:
            "API endpoint not found. Set API_BASE_URL on the web service to the Nest API URL, for example https://your-api-service.onrender.com/api."
        };
      }

      return { error: `Request failed with ${response.status}` };
    }

    return { data: (await response.json()) as T };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function login(email: string, password: string) {
  return apiFetch<{ accessToken: string; user: { email: string; role: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}
