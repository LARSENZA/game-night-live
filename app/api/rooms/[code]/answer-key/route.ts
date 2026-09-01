import { getRoom, hashToken, hydrateState } from "@/lib/game-server";
import { getDb } from "@/db";
import { gameSessions,rounds } from "@/db/schema";
import { desc,eq } from "drizzle-orm";

export async function GET(request:Request,context:{params:Promise<{code:string}>}){
  const {code}=await context.params,room=await getRoom(code);
  if(!room)return Response.json({error:"Room not found"},{status:404});
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")??"";
  if(!token||await hashToken(token)!==room.hostTokenHash)return Response.json({error:"Host access denied"},{status:403});
  const state=hydrateState(JSON.parse(room.state));
  const history=await getDb().select({id:rounds.id,gameType:rounds.gameType,team:rounds.team,teamName:rounds.teamName,prompt:rounds.prompt,answer:rounds.answer,detail:rounds.detail,result:rounds.result,points:rounds.points,createdAt:rounds.createdAt}).from(rounds).innerJoin(gameSessions,eq(rounds.sessionId,gameSessions.id)).where(eq(gameSessions.roomId,room.id)).orderBy(desc(rounds.createdAt)).limit(200);
  return Response.json({code:room.code,version:room.updatedAt,history,answerKey:{currentGame:state.currentGame,phase:state.phase,turnNumber:state.turnNumber,activeTeam:state.activeTeam,teamName:state.teams[state.activeTeam].name,currentContent:state.currentContent,wavelength:state.wavelength,bomb:state.bomb,musicRound:state.musicRound,rapidFire:state.rapidFire,topAnswers:state.topAnswers,spelling:state.spelling}},{headers:{"Cache-Control":"no-store"}});
}
