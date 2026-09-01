import { and, eq, isNull, or } from "drizzle-orm";
import { getDb } from "@/db";
import { gameContent, roomContentSettings } from "@/db/schema";
import { ensureSeeded, getRoom, hashToken } from "@/lib/game-server";
import type { GameType } from "@/lib/types";

const GAME_TYPES: GameType[] = [
  "spelling",
  "taboo",
  "password",
  "bomb",
  "trivia",
  "wavelength",
  "top_answers",
  "moji",
  "rapid_fire",
  "charades",
  "scavenger",
  "five_alive",
  "crowd",
];

async function authorized(request: Request, code: string) {
  const room = await getRoom(code);
  if (!room)
    return {
      error: Response.json({ error: "Room not found" }, { status: 404 }),
    };
  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token || (await hashToken(token)) !== room.hostTokenHash)
    return {
      error: Response.json({ error: "Host access denied" }, { status: 403 }),
    };
  return { room };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params,
    auth = await authorized(request, code);
  if ("error" in auth) return auth.error;
  await ensureSeeded();
  const db = getDb(),
    rows = await db
      .select()
      .from(gameContent)
      .where(
        and(
          eq(gameContent.isActive, true),
          or(
            isNull(gameContent.ownerRoomId),
            eq(gameContent.ownerRoomId, auth.room.id),
          ),
        ),
      );
  const settings = await db
    .select()
    .from(roomContentSettings)
    .where(eq(roomContentSettings.roomId, auth.room.id));
  const settingMap = new Map(
    settings.map((item) => [item.contentId, item.enabled]),
  );
  return Response.json({
    items: rows.map((item) => ({
      ...item,
      enabled: settingMap.get(item.id) ?? true,
      isCustom: item.ownerRoomId === auth.room.id,
    })),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params,
    auth = await authorized(request, code);
  if ("error" in auth) return auth.error;
  const payload = (await request.json()) as { items?: unknown[] },
    raw = Array.isArray(payload.items) ? payload.items.slice(0, 500) : [];
  const items = raw
    .map(normalizeItem)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (items.length !== raw.length)
    return Response.json(
      {
        error:
          "One or more items are invalid. Taboo cards must contain exactly five unique prohibited words in metadata.taboo.",
      },
      { status: 400 },
    );
  if (!items.length)
    return Response.json(
      { error: "No valid content supplied" },
      { status: 400 },
    );
  const db = getDb();
  const created: (typeof gameContent.$inferSelect)[] = [];

  // D1 has a limit on bound values, so import in small batches.
  for (let index = 0; index < items.length; index += 10) {
    const batch = items.slice(index, index + 10);

    const inserted = await db
      .insert(gameContent)
      .values(
        batch.map((item) => ({
          ...item,
          ownerRoomId: auth.room.id,
        })),
      )
      .returning();

    created.push(...inserted);
  }

  return Response.json({ items: created }, { status: 201 });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params,
    auth = await authorized(request, code);
  if ("error" in auth) return auth.error;
  const body = (await request.json()) as Record<string, unknown>,
    id = Math.round(Number(body.id));
  if (!Number.isFinite(id))
    return Response.json(
      { error: "Valid content id required" },
      { status: 400 },
    );
  const db = getDb();
  if (body.action === "toggle") {
    const enabled = Boolean(body.enabled);
    const [existing] = await db
      .select()
      .from(roomContentSettings)
      .where(
        and(
          eq(roomContentSettings.roomId, auth.room.id),
          eq(roomContentSettings.contentId, id),
        ),
      )
      .limit(1);
    if (existing)
      await db
        .update(roomContentSettings)
        .set({ enabled })
        .where(eq(roomContentSettings.id, existing.id));
    else
      await db
        .insert(roomContentSettings)
        .values({ roomId: auth.room.id, contentId: id, enabled });
    return Response.json({ ok: true });
  }
  const item = normalizeItem(body);
  if (!item)
    return Response.json(
      {
        error:
          "Invalid content. Taboo cards must contain exactly five unique prohibited words in metadata.taboo.",
      },
      { status: 400 },
    );
  const updated = await db
    .update(gameContent)
    .set(item)
    .where(
      and(eq(gameContent.id, id), eq(gameContent.ownerRoomId, auth.room.id)),
    )
    .returning();
  if (!updated.length)
    return Response.json(
      { error: "Only custom content can be edited" },
      { status: 403 },
    );
  return Response.json({ item: updated[0] });
}

function normalizeItem(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>,
    gameType = String(raw.gameType ?? "") as GameType,
    prompt = String(raw.prompt ?? "")
      .trim()
      .slice(0, 300);
  if (!GAME_TYPES.includes(gameType) || !prompt) return null;
  let metadataValue: unknown = {};
  try {
    metadataValue =
      typeof raw.metadata === "string"
        ? JSON.parse(raw.metadata)
        : raw.metadata ?? {};
  } catch {
    return null;
  }
  if (
    !metadataValue ||
    typeof metadataValue !== "object" ||
    Array.isArray(metadataValue)
  )
    return null;

  const metadataObject = metadataValue as Record<string, unknown>;
  if (gameType === "taboo") {
    const supplied = metadataObject.taboo;
    if (
      !Array.isArray(supplied) ||
      supplied.length !== 5 ||
      supplied.some((word) => typeof word !== "string")
    )
      return null;
    const taboo = supplied.map((word) =>
      String(word).trim().replace(/\s+/g, " ").slice(0, 60),
    );
    const normalized = taboo.map((word) => word.toLowerCase());
    if (
      taboo.some((word) => !word) ||
      new Set(normalized).size !== 5 ||
      normalized.includes(prompt.toLowerCase())
    )
      return null;
    metadataObject.taboo = taboo;
  }
  if (gameType === "top_answers") {
    const answers = metadataObject.answers;
    if (!Array.isArray(answers) || answers.length !== 5) return null;
    const normalizedAnswers = answers.map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const answer = entry as Record<string, unknown>;
      const text = String(answer.text ?? "").trim().slice(0, 80);
      const points = Number(answer.points);
      return text && Number.isFinite(points) && points > 0
        ? { text, points: Math.round(points) }
        : null;
    });
    if (normalizedAnswers.some((answer) => !answer)) return null;
    const texts = normalizedAnswers.map((answer) => answer!.text.toLowerCase());
    if (new Set(texts).size !== 5) return null;
    metadataObject.answers = normalizedAnswers;
  }
  if (["moji", "rapid_fire", "charades", "five_alive", "crowd"].includes(gameType)) {
    const answer = String(raw.answer ?? "").trim();
    if (!answer) return null;
  }

  const metadata = JSON.stringify(metadataObject);
  return {
    gameType,
    prompt,
    answer:
      String(raw.answer ?? "")
        .trim()
        .slice(0, 300) || null,
    category:
      String(raw.category ?? "")
        .trim()
        .slice(0, 80) || null,
    metadata,
    isActive: true,
  };
}
