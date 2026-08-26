import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rooms } from "@/db/schema";
import { expireRound, getRoom, hydrateState } from "@/lib/game-server";
export async function GET(_request:Request,context:{params:Promise<{code:string}>}){
  const {code}=await context.params,room=await getRoom(code);if(!room)return Response.json({error:"Room not found"},{status:404});
  const state=hydrateState(JSON.parse(room.state));let version=room.updatedAt;
  if(await expireRound(state,room.id)){version=new Date().toISOString();await getDb().update(rooms).set({state:JSON.stringify(state),updatedAt:version}).where(eq(rooms.id,room.id));}
  return Response.json({code:room.code,state,version,serverNow:Date.now()},{headers:{"Cache-Control":"no-store"}});
}
