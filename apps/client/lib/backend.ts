const BACKEND_URL = process.env.BACKEND_URL;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

type BackendRequestOptions = {
  method?: string;
  body?: unknown;
  userId: string;
};

export async function callBackend(
  path: string,
  { method = "GET", body, userId }: BackendRequestOptions,
) {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not configured");
  }

  if (!INTERNAL_API_SECRET) {
    throw new Error("INTERNAL_API_SECRET is not configured");
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": INTERNAL_API_SECRET,
      "x-user-id": userId,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

export async function callBackendPublic(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {},
) {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not configured");
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}
