const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    signal: options.signal ?? AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    throw new Error(
      "A API retornou uma resposta inválida. Confira VITE_API_URL.",
    );
  }
  
  if (!response.ok) {
    const error = data as { message?: string; error?: string } | undefined;
    throw new Error(
      error?.message ||
        error?.error ||
        `Não foi possível concluir a operação (${response.status}).`,
    );
  }
  return data as T;
}
