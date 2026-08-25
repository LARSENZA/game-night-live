import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  hostTokenHash: text("host_token_hash").notNull(),
  state: text("state").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});

export const gameContent = sqliteTable("game_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameType: text("game_type").notNull(),
  prompt: text("prompt").notNull(),
  answer: text("answer"),
  category: text("category"),
  metadata: text("metadata").notNull().default("{}"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ownerRoomId: text("owner_room_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const roomContentSettings = sqliteTable("room_content_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: text("room_id").notNull(),
  contentId: integer("content_id").notNull(),
  enabled: integer("enabled", { mode:"boolean" }).notNull().default(true),
});

export const gameSessions = sqliteTable("game_sessions", {
  id: text("id").primaryKey(),
  roomId: text("room_id").notNull(),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  endedAt: text("ended_at"),
  finalState: text("final_state"),
});

export const rounds = sqliteTable("rounds", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  gameType: text("game_type").notNull(),
  team: text("team").notNull(),
  contentId: integer("content_id"),
  result: text("result"),
  points: integer("points").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
