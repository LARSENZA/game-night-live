export const PUNCTUATION_EXAMPLES: Readonly<Record<string, string>> = {
  ".": "The game is over.",
  ",": "Ready, set, go!",
  "?": "Are you ready?",
  "!": "Hi!",
  ":": "Bring three things: water, shoes and a hat.",
  ";": "It was late; we kept playing.",
  "'": "Lerato's turn",
  '"': 'She said, "Go!"',
  "()": "The answer (ten) is correct.",
  "[]": "Add the missing word: She [runs] daily.",
  "{}": "Set = {1, 2, 3}",
  "/": "and/or",
  "\\": "C:\\Games\\Bomb",
  "-": "twenty-one",
  "_": "team_name",
  "…": "Wait for it…",
  "@": "player@example.com",
  "#": "#GameNight",
  "&": "music & games",
  "*": "Winner*",
  "–": "Pages 10–15",
  "—": "The winner—Team A—celebrated.",
  "<>": "3 < 5 > 2",
  "|": "|-5| = 5",
};

export function getPunctuationExample(
  symbol: string | null | undefined,
  storedExample?: unknown,
): string {
  if (typeof storedExample === "string" && storedExample.trim()) {
    return storedExample;
  }
  return PUNCTUATION_EXAMPLES[symbol ?? ""] ?? "";
}
