import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { eventTeams } from "@/db/schema";
export async function GET(){const teams=await getDb().select().from(eventTeams).orderBy(desc(eventTeams.totalScore)).limit(100);return Response.json({teams},{headers:{"Cache-Control":"no-store"}});}
