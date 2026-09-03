export function isD1DailyLimitError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("7500") || /D1.*daily row read limit/i.test(message);
}

export function apiErrorResponse(error: unknown, fallback: string) {
  console.error(fallback, error);
  if (isD1DailyLimitError(error)) {
    return Response.json(
      {
        error:
          "Game data is temporarily unavailable because the Cloudflare D1 daily limit was reached. It resets at 00:00 UTC.",
      },
      { status: 503 },
    );
  }
  return Response.json({ error: fallback }, { status: 500 });
}
