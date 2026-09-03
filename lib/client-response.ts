type ErrorPayload = { error?: string };

export async function readJsonResponse<T>(
  response: Response,
  fallback: string,
): Promise<T> {
  const body = await response.text();
  if (!body.trim()) {
    throw new Error(
      response.ok
        ? `${fallback}: the server returned an empty response.`
        : `${fallback} (server returned HTTP ${response.status}).`,
    );
  }

  let data: T & ErrorPayload;
  try {
    data = JSON.parse(body) as T & ErrorPayload;
  } catch {
    throw new Error(
      response.ok
        ? `${fallback}: the server returned an unreadable response.`
        : `${fallback} (server returned HTTP ${response.status}).`,
    );
  }

  if (!response.ok) throw new Error(data.error || fallback);
  return data;
}
