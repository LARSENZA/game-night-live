import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { contentUsage,eventTeams,gameSessions,rooms,rounds } from "@/db/schema";
import { initialState } from "@/lib/types";

async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return new Uint8Array(bytes);}
function same(a:Uint8Array,b:Uint8Array){if(a.length!==b.length)return false;let result=0;for(let i=0;i<a.length;i++)result|=a[i]^b[i];return result===0;}

export async function POST(request:Request){
  const configured=String((env as unknown as Record<string,unknown>).ADMIN_RESET_KEY??"");
  if(!configured)return Response.json({error:"Administrator reset is not configured."},{status:503});
  let body:{key?:string;confirmation?:string};
  try{body=await request.json();}catch{return Response.json({error:"Invalid request."},{status:400});}
  if(body.confirmation!=="START NEW SEASON")return Response.json({error:"Type START NEW SEASON exactly."},{status:400});
  if(!body.key||!same(await digest(body.key),await digest(configured)))return Response.json({error:"Incorrect administrator PIN."},{status:403});
  const db=getDb(),now=new Date().toISOString();
  await db.batch([
    db.delete(contentUsage),db.delete(rounds),db.delete(gameSessions),db.delete(eventTeams),
    db.update(rooms).set({state:JSON.stringify(initialState()),updatedAt:now}),
  ]);
  return Response.json({ok:true,message:"A new season has started."},{headers:{"Cache-Control":"no-store"}});
}
