import { desc,eq } from "drizzle-orm";
import { getDb } from "@/db";
import { eventTeams } from "@/db/schema";
export async function GET(request:Request){const name=new URL(request.url).searchParams.get("name")?.trim().replace(/\s+/g," ").toLowerCase();const teams=name?await getDb().select().from(eventTeams).where(eq(eventTeams.normalizedName,name)).limit(1):await getDb().select().from(eventTeams).orderBy(desc(eventTeams.totalScore)).limit(100);return Response.json({teams},{headers:{"Cache-Control":"no-store"}});}
