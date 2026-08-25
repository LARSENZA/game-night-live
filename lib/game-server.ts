import { and, eq, isNull, or } from "drizzle-orm";
import { getDb } from "@/db";
import { gameContent, roomContentSettings, rooms } from "@/db/schema";
import { DEFAULT_CONTENT } from "./default-content";
import { ContentItem, GameState, GameType, TeamKey } from "./types";

export async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, b => chars[b % chars.length]).join("");
}

export async function ensureSeeded() {
  const db = getDb();
  const existing = await db.select({ gameType:gameContent.gameType, prompt:gameContent.prompt }).from(gameContent).where(isNull(gameContent.ownerRoomId));
  const existingKeys = new Set(existing.map(item=>`${item.gameType}\u0000${item.prompt}`));
  const missing = DEFAULT_CONTENT.filter(item=>!existingKeys.has(`${item.gameType}\u0000${item.prompt}`)).map(item => ({
    gameType: item.gameType,
    prompt: item.prompt,
    answer: item.answer,
    category: item.category,
    metadata: JSON.stringify(item.metadata),
  }));
  // D1 limits the number of bound values in one statement. Small batches also
  // make seeding resumable if a deployment is interrupted halfway through.
  for(let index=0; index<missing.length; index+=10) {
    await db.insert(gameContent).values(missing.slice(index,index+10));
  }
}

export async function getRoom(code: string) {
  const db = getDb();
  const [room] = await db.select().from(rooms).where(eq(rooms.code, code.toUpperCase())).limit(1);
  return room ?? null;
}

export async function nextContent(state: GameState, gameType: GameType, roomId: string): Promise<ContentItem | null> {
  await ensureSeeded();
  const db = getDb();
  const rows = await db.select().from(gameContent).where(and(eq(gameContent.gameType, gameType), eq(gameContent.isActive, true), or(isNull(gameContent.ownerRoomId),eq(gameContent.ownerRoomId,roomId))));
  const settings = await db.select().from(roomContentSettings).where(eq(roomContentSettings.roomId,roomId));
  const disabled = new Set(settings.filter(item=>!item.enabled).map(item=>item.contentId));
  const eligible = rows.filter(row=>!disabled.has(row.id));
  if (!eligible.length) return null;
  let used = state.usedContent[gameType] ?? [];
  let available = eligible.filter(row => !used.includes(row.id));
  if (!available.length) {
    used = [];
    available = eligible;
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  state.usedContent[gameType] = [...used, selected.id];
  return selected as ContentItem;
}

function startTimer(state: GameState, seconds: number) {
  state.timer = { running: true, total: seconds, endsAt: Date.now() + seconds * 1000 };
}

export async function applyAction(state: GameState, action: Record<string, unknown>, roomId: string) {
  const type = String(action.type ?? "");
  if (type === "setActiveTeam" && (action.team === "A" || action.team === "B")) state.activeTeam = action.team;
  if (type === "addPoints" && (action.team === "A" || action.team === "B")) {
    const points = Math.max(-1000, Math.min(1000, Number(action.points) || 0));
    state.teams[action.team].score = Math.max(0, state.teams[action.team].score + points);
  }
  if (type === "setScore" && (action.team === "A" || action.team === "B")) state.teams[action.team].score = Math.max(0, Math.round(Number(action.score) || 0));
  if (type === "renameTeam" && (action.team === "A" || action.team === "B")) state.teams[action.team].name = String(action.name ?? "").trim().slice(0, 28) || `Team ${action.team}`;

  if (type === "startGame") {
    const game = action.game as GameType;
    if (!["spelling","taboo","music","password","bomb","trivia","wavelength"].includes(game)) return state;
    state.currentGame = game;
    state.phase = "playing";
    state.answerShown = false;
    state.passwordClues = [];
    state.musicPoints = { title:false, artist:false, lyrics:false };
    state.timer = { running:false, total:0, endsAt:null };
    state.currentContent = game === "music" ? null : await nextContent(state, game, roomId);
    if (["spelling","taboo","trivia"].includes(game)) startTimer(state, 120);
    if (game === "wavelength") state.wavelength = { target: Math.floor(Math.random()*11), guess:5, points:0 };
    if (game === "bomb") { state.phase = "setup"; state.bomb = { rule:null, duration:0 }; }
  }

  if (type === "next" || type === "pass" || type === "correct") {
    if (type === "correct") {
      const defaultPoints = state.currentGame === "bomb" ? 50 : 10;
      state.teams[state.activeTeam].score += Number(action.points) || defaultPoints;
    }
    if (state.currentGame && state.currentGame !== "music") {
      state.currentContent = await nextContent(state, state.currentGame, roomId);
      state.answerShown = false;
      state.passwordClues = [];
      state.phase = "playing";
      if (["spelling","taboo","trivia"].includes(state.currentGame)) startTimer(state, 120);
      if (state.currentGame === "wavelength") state.wavelength = { target:Math.floor(Math.random()*11), guess:5, points:0 };
    }
  }

  if (type === "revealAnswer") state.answerShown = !state.answerShown;
  if (type === "passwordClue" && state.currentGame === "password" && state.passwordClues.length < 3) {
    const clue = String(action.clue ?? "").trim().slice(0, 40);
    if (clue) state.passwordClues.push(clue);
    if (state.passwordClues.length === 3) state.phase = "guess";
  }
  if (type === "musicToggle" && state.currentGame === "music") {
    const key = action.key as keyof GameState["musicPoints"];
    if (["title","artist","lyrics"].includes(key)) state.musicPoints[key] = !state.musicPoints[key];
  }
  if (type === "musicConfirm" && state.currentGame === "music") {
    const points = (state.musicPoints.title?10:0)+(state.musicPoints.artist?10:0)+(state.musicPoints.lyrics?30:0);
    state.teams[state.activeTeam].score += points;
    state.musicPoints = { title:false, artist:false, lyrics:false };
  }
  if (type === "waveHide" && state.currentGame === "wavelength") {
    state.phase = "guess";
    startTimer(state, 60);
  }
  if (type === "waveGuess" && state.currentGame === "wavelength") {
    const guess = Math.max(0, Math.min(10, Math.round(Number(action.guess) || 0)));
    const diff = Math.abs(guess-state.wavelength.target);
    const points = diff===0?10:diff===1?5:0;
    state.wavelength = { ...state.wavelength, guess, points };
    state.teams[state.activeTeam].score += points;
    state.phase = "result";
    state.timer.running = false;
  }
  if (type === "bombRoll" && state.currentGame === "bomb") {
    const rules: GameState["bomb"]["rule"][] = ["tick","ticktack","bomb"];
    state.bomb = { rule:rules[Math.floor(Math.random()*3)], duration:5+Math.floor(Math.random()*41) };
    state.phase = "ready";
  }
  if (type === "bombStart" && state.currentGame === "bomb" && state.bomb.duration) {
    state.phase = "playing";
    startTimer(state, state.bomb.duration);
  }
  if (type === "bombResolve" && state.currentGame === "bomb" && (action.losingTeam === "A" || action.losingTeam === "B")) {
    const winner: TeamKey = action.losingTeam === "A" ? "B" : "A";
    state.teams[winner].score += 50;
    state.phase = "ended";
    state.timer.running = false;
  }
  return state;
}
