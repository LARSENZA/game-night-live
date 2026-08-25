import { and, eq, isNull, or } from "drizzle-orm";
import { getDb } from "@/db";
import { gameContent, roomContentSettings } from "@/db/schema";
import { ensureSeeded, getRoom, hashToken } from "@/lib/game-server";
import type { GameType } from "@/lib/types";

const GAME_TYPES: GameType[] = ["spelling","taboo","password","bomb","trivia","wavelength"];

async function authorized(request:Request,code:string) {
  const room=await getRoom(code);
  if(!room) return { error:Response.json({error:"Room not found"},{status:404}) };
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")??"";
  if(!token||await hashToken(token)!==room.hostTokenHash) return { error:Response.json({error:"Host access denied"},{status:403}) };
  return { room };
}

export async function GET(request:Request,context:{params:Promise<{code:string}>}) {
  const {code}=await context.params, auth=await authorized(request,code);
  if("error" in auth) return auth.error;
  await ensureSeeded();
  const db=getDb(), rows=await db.select().from(gameContent).where(or(isNull(gameContent.ownerRoomId),eq(gameContent.ownerRoomId,auth.room.id)));
  const settings=await db.select().from(roomContentSettings).where(eq(roomContentSettings.roomId,auth.room.id));
  const settingMap=new Map(settings.map(item=>[item.contentId,item.enabled]));
  return Response.json({items:rows.map(item=>({...item,enabled:settingMap.get(item.id)??true,isCustom:item.ownerRoomId===auth.room.id}))});
}

export async function POST(request:Request,context:{params:Promise<{code:string}>}) {
  const {code}=await context.params, auth=await authorized(request,code);
  if("error" in auth) return auth.error;
  const payload=await request.json() as {items?:unknown[]}, raw=Array.isArray(payload.items)?payload.items.slice(0,500):[];
  const items=raw.map(normalizeItem).filter((item):item is NonNullable<typeof item>=>Boolean(item));
  if(!items.length) return Response.json({error:"No valid content supplied"},{status:400});
  const created=await getDb().insert(gameContent).values(items.map(item=>({...item,ownerRoomId:auth.room.id}))).returning();
  return Response.json({items:created},{status:201});
}

export async function PATCH(request:Request,context:{params:Promise<{code:string}>}) {
  const {code}=await context.params, auth=await authorized(request,code);
  if("error" in auth) return auth.error;
  const body=await request.json() as Record<string,unknown>, id=Math.round(Number(body.id));
  if(!Number.isFinite(id)) return Response.json({error:"Valid content id required"},{status:400});
  const db=getDb();
  if(body.action==="toggle") {
    const enabled=Boolean(body.enabled);
    const [existing]=await db.select().from(roomContentSettings).where(and(eq(roomContentSettings.roomId,auth.room.id),eq(roomContentSettings.contentId,id))).limit(1);
    if(existing) await db.update(roomContentSettings).set({enabled}).where(eq(roomContentSettings.id,existing.id));
    else await db.insert(roomContentSettings).values({roomId:auth.room.id,contentId:id,enabled});
    return Response.json({ok:true});
  }
  const item=normalizeItem(body);
  if(!item) return Response.json({error:"Invalid content"},{status:400});
  const updated=await db.update(gameContent).set(item).where(and(eq(gameContent.id,id),eq(gameContent.ownerRoomId,auth.room.id))).returning();
  if(!updated.length) return Response.json({error:"Only custom content can be edited"},{status:403});
  return Response.json({item:updated[0]});
}

function normalizeItem(value:unknown) {
  if(!value||typeof value!=="object") return null;
  const raw=value as Record<string,unknown>, gameType=String(raw.gameType??"") as GameType, prompt=String(raw.prompt??"").trim().slice(0,300);
  if(!GAME_TYPES.includes(gameType)||!prompt) return null;
  let metadata="{}";
  try { metadata=typeof raw.metadata==="string"?JSON.stringify(JSON.parse(raw.metadata)):JSON.stringify(raw.metadata??{}); } catch { return null; }
  return {gameType,prompt,answer:String(raw.answer??"").trim().slice(0,300)||null,category:String(raw.category??"").trim().slice(0,80)||null,metadata,isActive:true};
}
