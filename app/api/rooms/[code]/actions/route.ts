import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rooms } from "@/db/schema";
import { applyAction, getRoom, hashToken } from "@/lib/game-server";
import { GameState } from "@/lib/types";

export async function POST(request: Request, context: { params: Promise<{ code:string }> }) {
  const { code } = await context.params;
  const room = await getRoom(code);
  if (!room) return Response.json({ error:"Room not found" }, { status:404 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token || await hashToken(token) !== room.hostTokenHash) return Response.json({ error:"Host access denied" }, { status:403 });
  const action = await request.json() as Record<string, unknown>;
  const state = await applyAction(JSON.parse(room.state) as GameState, action, room.id);
  const updatedAt = new Date().toISOString();
  await getDb().update(rooms).set({ state:JSON.stringify(state), updatedAt }).where(eq(rooms.code, room.code));
  return Response.json({ code:room.code, state, version:updatedAt });
}
