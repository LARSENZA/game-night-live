export type TeamKey = "A" | "B";
export type GameType = "spelling" | "taboo" | "music" | "password" | "bomb" | "trivia" | "wavelength";

export type ContentItem = {
  id: number;
  gameType: GameType;
  prompt: string;
  answer: string | null;
  category: string | null;
  metadata: string;
};

export type GameState = {
  teams: Record<TeamKey, { name: string; score: number }>;
  activeTeam: TeamKey;
  currentGame: GameType | null;
  phase: string;
  currentContent: ContentItem | null;
  usedContent: Partial<Record<GameType, number[]>>;
  answerShown: boolean;
  passwordClues: string[];
  musicPoints: { title: boolean; artist: boolean; lyrics: boolean };
  wavelength: { target: number; guess: number; points: number };
  bomb: { rule: "tick" | "ticktack" | "bomb" | null; duration: number };
  timer: { running: boolean; total: number; endsAt: number | null };
};

export type RoomPayload = { code: string; state: GameState; version: string };

export function initialState(): GameState {
  return {
    teams: { A: { name: "Team A", score: 0 }, B: { name: "Team B", score: 0 } },
    activeTeam: "A",
    currentGame: null,
    phase: "lobby",
    currentContent: null,
    usedContent: {},
    answerShown: false,
    passwordClues: [],
    musicPoints: { title: false, artist: false, lyrics: false },
    wavelength: { target: 5, guess: 5, points: 0 },
    bomb: { rule: null, duration: 0 },
    timer: { running: false, total: 0, endsAt: null },
  };
}
