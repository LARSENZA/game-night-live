import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rooms } from "@/db/schema";
import { applyAction, getRoom, hashToken } from "@/lib/game-server";
import { GameState } from "@/lib/types";
import { apiErrorResponse, isD1DailyLimitError } from "@/lib/api-error";

export async function POST(request: Request, context: { params: Promise<{ code:string }> }) {
  try {
    const { code } = await context.params;
    const room = await getRoom(code);
    if (!room) return Response.json({ error:"Room not found" }, { status:404 });
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!token || await hashToken(token) !== room.hostTokenHash) return Response.json({ error:"Host access denied" }, { status:403 });
    let action: Record<string, unknown>;
    try { action = await request.json() as Record<string, unknown>; }
    catch { return Response.json({ error:"Invalid action" }, { status:400 }); }
    let state:GameState;
    try {
      state=await applyAction(JSON.parse(room.state) as GameState,action,room.id);
    } catch(error) {
      if (isD1DailyLimitError(error)) return apiErrorResponse(error, "Action temporarily unavailable.");
      return Response.json({error:error instanceof Error?error.message:"Action failed"},{status:400});
    }
    const updatedAt = new Date().toISOString();
    await getDb().update(rooms).set({ state:JSON.stringify(state), updatedAt }).where(eq(rooms.code, room.code));
    return Response.json({ code:room.code, state, version:updatedAt, serverNow:Date.now() });
  } catch (error) {
    return apiErrorResponse(error, "Action temporarily unavailable.");
  }
}
