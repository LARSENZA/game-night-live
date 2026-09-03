import { getDb } from "@/db";
import { rooms } from "@/db/schema";
import { getRoom, hashToken, randomCode, randomToken } from "@/lib/game-server";
import { initialState } from "@/lib/types";
import { apiErrorResponse } from "@/lib/api-error";

export async function POST() {
  try {
    const db = getDb();
    let code = randomCode();
    while (await getRoom(code)) code = randomCode();
    const hostToken = randomToken();
    const now = new Date();
    await db.insert(rooms).values({
      id: crypto.randomUUID(), code, hostTokenHash: await hashToken(hostToken),
      state: JSON.stringify(initialState()), updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime()+24*60*60*1000).toISOString(),
    });
    return Response.json({ code, hostToken }, { status:201 });
  } catch (error) {
    return apiErrorResponse(error, "Could not create room.");
  }
}
