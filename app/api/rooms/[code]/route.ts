import { getRoom } from "@/lib/game-server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const room = await getRoom(code);
  if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
  const state = JSON.parse(room.state);
  if (
    state.timer?.running &&
    state.timer.endsAt &&
    Date.now() >= state.timer.endsAt
  ) {
    state.timer.running = false;
    state.timer.endsAt = null;
    state.timer.pausedRemaining = 0;
    if (
      state.currentGame === "spelling" ||
      state.currentGame === "taboo" ||
      state.currentGame === "trivia"
    ) {
      state.phase = "ended";
    }
  }
  return Response.json(
    { code: room.code, state, version: room.updatedAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
