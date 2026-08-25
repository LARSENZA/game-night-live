"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameState, GameType, RoomPayload, TeamKey } from "@/lib/types";

const GAMES: { id: GameType; name: string }[] = [
  { id: "spelling", name: "Spelling Bee" },
  { id: "taboo", name: "Taboo" },
  { id: "music", name: "Music Round" },
  { id: "password", name: "Password" },
  { id: "bomb", name: "Bomb" },
  { id: "trivia", name: "Fifth Grader" },
  { id: "wavelength", name: "Wavelength" },
];

const BOMB_LOTTERY = [
  { id: "tick", label: "TICK", description: "The word cannot start with the letters" },
  { id: "ticktack", label: "TICK TACK", description: "The letters can go anywhere in the word" },
  { id: "bomb", label: "BOMB", description: "The word cannot end with the letters" },
] as const;

function metadata(state: GameState) {
  try {
    return JSON.parse(state.currentContent?.metadata || "{}");
  } catch {
    return {};
  }
}
function remaining(state: GameState, now: number) {
  if (state.timer.running && state.timer.endsAt && now)
    return Math.max(
      0,
      Math.min(
        state.timer.total,
        Math.ceil((state.timer.endsAt - now) / 1000),
      ),
    );
  return Math.max(0, Number(state.timer.pausedRemaining) || 0);
}
function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function syncServerClock(
  response: Response,
  requestStarted: number,
  offsetRef: { current: number },
) {
  const serverDate = response.headers.get("date");
  if (!serverDate) return;
  const serverTime = Date.parse(serverDate);
  if (!Number.isFinite(serverTime)) return;
  const responseReceived = Date.now();
  const halfRoundTrip = (responseReceived - requestStarted) / 2;
  offsetRef.current = serverTime + halfRoundTrip - responseReceived;
}

export function RoomClient({
  code,
  role,
}: {
  code: string;
  role: "host" | "display";
}) {
  const router = useRouter();
  const [room, setRoom] = useState<RoomPayload | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(0);
  const [clue, setClue] = useState("");
  const [guess, setGuess] = useState(5);
  const [soundReady, setSoundReady] = useState(role === "host");
  const [gamePickerOpen, setGamePickerOpen] = useState(true);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previousScore = useRef<{ A: number; B: number } | null>(null);
  const previousTick = useRef<number | null>(null);
  const previousSpokenWord = useRef("");
  const serverClockOffset = useRef(0);

  const load = useCallback(async () => {
    try {
      const requestStarted = Date.now();
      const response = await fetch(`/api/rooms/${code}`, { cache: "no-store" });
      syncServerClock(response, requestStarted, serverClockOffset);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Room unavailable");
      setRoom(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Room unavailable");
    }
  }, [code]);

  useEffect(() => {
    const initial = setTimeout(() => {
      void load();
      setNow(Date.now() + serverClockOffset.current);
    }, 0);
    const poll = setInterval(load, 800);
    const clock = setInterval(
      () => setNow(Date.now() + serverClockOffset.current),
      250,
    );
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
      clearInterval(clock);
    };
  }, [load]);
  useEffect(() => {
    if (!room) return;
    const prev = previousScore.current,
      next = { A: room.state.teams.A.score, B: room.state.teams.B.score };
    if (soundReady && prev && (next.A > prev.A || next.B > prev.B))
      playSuccess();
    previousScore.current = next;
  }, [room, soundReady]);

  const tickSeconds = room ? remaining(room.state, now) : 0;
  useEffect(() => {
    if (!room || !room.state.timer.running || tickSeconds <= 0) return;
    if (previousTick.current !== tickSeconds) {
      previousTick.current = tickSeconds;
      if (soundReady) playTick(tickSeconds <= 10);
    }
  }, [tickSeconds, room, soundReady]);

  useEffect(() => {
    if (
      role !== "host" ||
      room?.state.currentGame !== "spelling" ||
      !room.state.currentContent?.prompt
    )
      return;
    const word = room.state.currentContent.prompt;
    if (previousSpokenWord.current === word) return;
    previousSpokenWord.current = word;
    const speakDelay = window.setTimeout(() => speakWord(word), 180);
    return () => window.clearTimeout(speakDelay);
  }, [room?.state.currentContent?.prompt, room?.state.currentGame, role]);

  useEffect(() => {
    const update = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => {
    if (role !== "host") return;
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
        return;
      const key = event.key.toLowerCase();
      if (key === "h") setControlsHidden((value) => !value);
      if (key === "g") setGamePickerOpen((value) => !value);
      if (key === "f")
        void (document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen());
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [role]);

  async function act(action: Record<string, unknown>) {
    const token = localStorage.getItem(`host-token:${code}`);
    if (!token)
      return setError("This browser does not have the host key for this room.");
    const requestStarted = Date.now();
    const response = await fetch(`/api/rooms/${code}/actions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(action),
    });
    syncServerClock(response, requestStarted, serverClockOffset);
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Action failed");
    setRoom(data);
  }

  if (error && !room)
    return (
      <main className="center-state">
        <h1>Room unavailable</h1>
        <p>{error}</p>
        <button onClick={() => router.push("/")}>Back home</button>
      </main>
    );
  if (!room)
    return (
      <main className="center-state">
        <div className="spinner" />
        <p>Connecting to room {code}…</p>
      </main>
    );
  const state = room.state,
    meta = metadata(state),
    seconds = remaining(state, now);

  const hostControls = role === "host" && !controlsHidden;
  const toggleFullscreen = () =>
    void (document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen());
  const exitGame = () => {
    if (
      window.confirm(
        "Exit this game and return to the Game Night ZA start screen?",
      )
    )
      router.push("/");
  };

  return (
    <main
      className={`room-shell ${role} ${controlsHidden ? "controls-hidden" : ""}`}
    >
      {!controlsHidden && (
        <header className="room-header">
          <div className="host-nav">
            <button className="ghost exit-game" onClick={exitGame}>
              Exit game
            </button>
            {role === "host" && (
              <button
                className="ghost"
                onClick={() => router.push(`/host/${code}/content`)}
              >
                Content
              </button>
            )}
          </div>
          <div className="room-brand">
            GAME <b>NIGHT</b> ZA
          </div>
          <div className="header-actions">
            <button
              className="sound-button"
              onClick={() => {
                setSoundReady((value) => !value);
                playTick(false);
              }}
            >
              {soundReady ? "Sound on" : "Sound off"}
            </button>
            <div className="room-code">
              ROOM <strong>{code}</strong>
            </div>
          </div>
        </header>
      )}
      <Scoreboard state={state} host={hostControls} act={act} />
      {role === "host" && !controlsHidden && (
        <div className="stream-toolbar">
          <button onClick={() => setGamePickerOpen((value) => !value)}>
            {gamePickerOpen ? "Close games menu" : "Games menu"} <kbd>G</kbd>
          </button>
          <button onClick={toggleFullscreen}>
            {isFullscreen ? "↙ Exit fullscreen" : "⛶ Fullscreen"} <kbd>F</kbd>
          </button>
          <button onClick={() => setControlsHidden(true)}>
            Broadcast mode <kbd>H</kbd>
          </button>
        </div>
      )}
      {role === "host" && !controlsHidden && gamePickerOpen && (
        <nav className="game-tabs">
          {GAMES.map((g) => (
            <button
              key={g.id}
              className={state.currentGame === g.id ? "selected" : ""}
              onClick={() => {
                void act({ type: "startGame", game: g.id });
                setGamePickerOpen(false);
              }}
            >
              <GameIcon game={g.id} />
              {g.name}
            </button>
          ))}
        </nav>
      )}
      <section className="game-stage">
        {!state.currentGame ? (
          <div className="waiting">
            <div className="waiting-icon"><GameIcon game="wavelength" /></div>
            <h2>Choose a game</h2>
            <p>Use the game picker above to begin.</p>
          </div>
        ) : (
          <GameView
            state={state}
            meta={meta}
            seconds={seconds}
            host={hostControls}
            act={act}
            clue={clue}
            setClue={setClue}
            guess={guess}
            setGuess={setGuess}
          />
        )}
      </section>
      {role === "host" && controlsHidden && (
        <button
          className="floating-controls"
          onClick={() => setControlsHidden(false)}
        >
          Show host controls <kbd>H</kbd>
        </button>
      )}
      {error && <div className="toast error">{error}</div>}
    </main>
  );
}

function Scoreboard({
  state,
  host,
  act,
}: {
  state: GameState;
  host: boolean;
  act: (a: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <section className="scoreboard">
      {(["A", "B"] as TeamKey[]).map((team) => (
        <article
          key={team}
          data-team={team}
          aria-current={state.activeTeam === team ? "true" : undefined}
          className={state.activeTeam === team ? "active" : ""}
          onClick={() => host && act({ type: "setActiveTeam", team })}
        >
          {host ? (
            <input
              className="team-name-input"
              value={state.teams[team].name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                act({ type: "renameTeam", team, name: e.target.value })
              }
            />
          ) : (
            <span className="team-name">{state.teams[team].name}</span>
          )}
          {host ? (
            <input
              className="score-input"
              type="number"
              step="5"
              min="0"
              value={state.teams[team].score}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                act({ type: "setScore", team, score: e.target.value })
              }
            />
          ) : (
            <strong>{state.teams[team].score}</strong>
          )}
          {host && (
            <div className="score-buttons" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => act({ type: "addPoints", team, points: -5 })}
              >
                −5
              </button>
              <button
                onClick={() => act({ type: "addPoints", team, points: 5 })}
              >
                +5
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

function GameView({
  state,
  meta,
  seconds,
  host,
  act,
  clue,
  setClue,
  guess,
  setGuess,
}: {
  state: GameState;
  meta: Record<string, unknown>;
  seconds: number;
  host: boolean;
  act: (a: Record<string, unknown>) => Promise<void>;
  clue: string;
  setClue: (v: string) => void;
  guess: number;
  setGuess: (v: number) => void;
}) {
  const game = state.currentGame!;
  const selectedBombRule = BOMB_LOTTERY.find(
    (rule) => rule.id === state.bomb.rule,
  );
  const [spellingFeedback, setSpellingFeedback] = useState<
    "correct" | "wrong" | null
  >(null);

  const [tabooFeedback, setTabooFeedback] = useState<
    "correct" | "wrong" | null
  >(null);

  const [answeredTaboo, setAnsweredTaboo] = useState<{
    prompt: string;
    forbidden: string[];
  }>({
    prompt: "",
    forbidden: [],
  });
  const [triviaFeedback, setTriviaFeedback] = useState<
    "correct" | "wrong" | null
  >(null);

  const [answeredTrivia, setAnsweredTrivia] = useState({
    category: "",
    question: "",
    answer: "",
  });
  const [passwordFeedback, setPasswordFeedback] = useState<
    "correct" | "wrong" | null
  >(null);
  const [answeredPasswordClues, setAnsweredPasswordClues] = useState<string[]>(
    [],
  );

  function answerPassword(result: "correct" | "wrong") {
    if (passwordFeedback) return;
    setAnsweredPasswordClues([...state.passwordClues]);
    setPasswordFeedback(result);
    if (result === "wrong") playWrong();
    void act({ type: result === "correct" ? "correct" : "pass" });
    window.setTimeout(() => {
      setPasswordFeedback(null);
      setAnsweredPasswordClues([]);
    }, 650);
  }
  const [waveFeedback, setWaveFeedback] = useState<
    "correct" | "close" | "wrong" | null
  >(null);

  function lockWaveGuess() {
    if (waveFeedback) return;
    const difference = Math.abs(guess - state.wavelength.target);
    const feedback =
      difference === 0 ? "correct" : difference === 1 ? "close" : "wrong";
    setWaveFeedback(feedback);
    if (feedback === "wrong") playWrong();
    void act({ type: "waveGuess", guess });
    window.setTimeout(() => setWaveFeedback(null), 800);
  }

  function answerTrivia(result: "correct" | "wrong") {
    if (triviaFeedback) return;

    setAnsweredTrivia({
      category: state.currentContent?.category || "",
      question: state.currentContent?.prompt || "",
      answer: state.currentContent?.answer || "",
    });

    setTriviaFeedback(result);

    if (result === "wrong") {
      playWrong();
    }

    void act({
      type: result === "correct" ? "correct" : "pass",
    });

    window.setTimeout(() => {
      setTriviaFeedback(null);
      setAnsweredTrivia({
        category: "",
        question: "",
        answer: "",
      });
    }, 650);
  }

  const [rollingBombDie, setRollingBombDie] = useState(false);
  const [bombLotteryIndex, setBombLotteryIndex] = useState(0);

  async function rollBombDie() {
    if (rollingBombDie) return;
    setRollingBombDie(true);
    let nextIndex = 0;
    const cycle = window.setInterval(() => {
      nextIndex = (nextIndex + 1) % BOMB_LOTTERY.length;
      setBombLotteryIndex(nextIndex);
    }, 140);
    await new Promise((resolve) => window.setTimeout(resolve, 1260));
    window.clearInterval(cycle);
    await act({ type: "bombRoll" });
    setRollingBombDie(false);
  }

  function answerTaboo(result: "correct" | "wrong") {
    if (tabooFeedback) return;

    setAnsweredTaboo({
      prompt: state.currentContent?.prompt || "",
      forbidden: (meta.taboo as string[]) || [],
    });

    setTabooFeedback(result);

    if (result === "wrong") {
      playWrong();
    }

    void act({
      type: result === "correct" ? "correct" : "pass",
    });

    window.setTimeout(() => {
      setTabooFeedback(null);
      setAnsweredTaboo({
        prompt: "",
        forbidden: [],
      });
    }, 650);
  }

  const [answeredWord, setAnsweredWord] = useState("");

  function answerSpelling(result: "correct" | "wrong") {
    if (spellingFeedback) return;

    setAnsweredWord(state.currentContent?.prompt || "");
    setSpellingFeedback(result);

    if (result === "wrong") {
      playWrong();
    }

    // Update the score and prepare the next word immediately.
    // The answered word remains displayed during the animation.
    void act({
      type: result === "correct" ? "correct" : "pass",
    });

    window.setTimeout(() => {
      setSpellingFeedback(null);
      setAnsweredWord("");
    }, 650);
  }
  return (
    <div
      className={`game-panel ${game} ${
        game === "spelling" && spellingFeedback
          ? `spelling-feedback-${spellingFeedback}`
          : ""
      } ${
        game === "taboo" && tabooFeedback
          ? `taboo-feedback-${tabooFeedback}`
          : ""
      }
      ${
        game === "trivia" && triviaFeedback
          ? `trivia-feedback-${triviaFeedback}`
          : ""
      } ${
        game === "password" && passwordFeedback
          ? `password-feedback-${passwordFeedback}`
          : ""
      } ${
        game === "wavelength" && waveFeedback
          ? `wavelength-feedback-${waveFeedback}`
          : ""
      }`}
    >
      <div className="game-heading">
        <span>{GAMES.find((g) => g.id === game)?.name}</span>
        {state.timer.total > 0 && (
          <div className="timer-tools">
            {game === "bomb" ? (
              <div className="bomb-fuse-status">
                {state.timer.running
                  ? "Fuse active"
                  : seconds > 0
                    ? "Fuse paused"
                    : "Exploded"}
              </div>
            ) : (
              <div
                className={`timer ${
                  seconds <= 10 && seconds > 0 ? "urgent" : ""
                }`}
              >
                {formatTime(seconds)}
              </div>
            )}

            {game !== "bomb" && !state.timer.running && seconds > 0 && (
              <span className="paused-label">Paused</span>
            )}

            {host && seconds > 0 && (
              <button
                className="timer-control"
                onClick={() =>
                  act({
                    type: state.timer.running ? "pauseTimer" : "resumeTimer",
                  })
                }
              >
                {state.timer.running ? "⏸ Pause" : "▶ Resume"}
              </button>
            )}
          </div>
        )}
      </div>
      {game === "spelling" && (
        <>
          <div className="hero-word spelling-word">
            {spellingFeedback ? answeredWord : state.currentContent?.prompt}
          </div>

          {host && (
            <button
              className="pronounce-button"
              disabled={Boolean(spellingFeedback)}
              onClick={() => speakWord(state.currentContent?.prompt || "")}
            >
              🔊 Repeat word
            </button>
          )}

          {state.phase === "ended" ? (
            <div className="time-up">
              {seconds > 0 ? "Round over — incorrect answer!" : "Time’s up!"}
            </div>
          ) : Number(state.timer.pausedRemaining) > 0 ? (
            <div className="round-paused">Round paused</div>
          ) : host ? (
            <div className="actions spelling-actions">
              <button
                disabled={Boolean(spellingFeedback)}
                onClick={() => answerSpelling("wrong")}
              >
                Incorrect / Pass
              </button>

              <button
                className="correct"
                disabled={Boolean(spellingFeedback)}
                onClick={() => answerSpelling("correct")}
              >
                Correct +10
              </button>
            </div>
          ) : null}
        </>
      )}
      {game === "taboo" && (
        <>
          <div className="hero-word taboo-word">
            {tabooFeedback
              ? answeredTaboo.prompt
              : state.currentContent?.prompt}
          </div>

          <div className="taboo-list">
            {(tabooFeedback
              ? answeredTaboo.forbidden
              : (meta.taboo as string[]) || []
            ).map((word) => (
              <span key={word}>🚫 {word}</span>
            ))}
          </div>

          {state.phase === "ended" ? (
            <div className="time-up">Time&apos;s up!</div>
          ) : Number(state.timer.pausedRemaining) > 0 ? (
            <div className="round-paused">Round paused</div>
          ) : host ? (
            <div className="actions taboo-actions">
              <button
                disabled={Boolean(tabooFeedback)}
                onClick={() => answerTaboo("wrong")}
              >
                Pass
              </button>

              <button
                className="correct"
                disabled={Boolean(tabooFeedback)}
                onClick={() => answerTaboo("correct")}
              >
                Correct +10
              </button>
            </div>
          ) : null}
        </>
      )}
      {game === "trivia" && (
        <>
          <div className="category">
            {triviaFeedback
              ? answeredTrivia.category
              : state.currentContent?.category}
          </div>

          <div className="question trivia-question">
            {triviaFeedback
              ? answeredTrivia.question
              : state.currentContent?.prompt}
          </div>

          {!triviaFeedback && state.answerShown && (
            <div className="answer">{state.currentContent?.answer}</div>
          )}

          {state.phase === "ended" ? (
            <div className="time-up">Time&apos;s up!</div>
          ) : Number(state.timer.pausedRemaining) > 0 ? (
            <div className="round-paused">Round paused</div>
          ) : host ? (
            <>
              <button
                className="reveal"
                disabled={Boolean(triviaFeedback)}
                onClick={() => act({ type: "revealAnswer" })}
              >
                {state.answerShown ? "Hide" : "Show"} answer
              </button>

              <div className="actions trivia-actions">
                <button
                  disabled={Boolean(triviaFeedback)}
                  onClick={() => answerTrivia("wrong")}
                >
                  Incorrect / Pass
                </button>

                <button
                  className="correct"
                  disabled={Boolean(triviaFeedback)}
                  onClick={() => answerTrivia("correct")}
                >
                  Correct +10
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
      {game === "password" && (
        <>
          {passwordFeedback ? (
            <>
              <div className="category">Final guess</div>
              <div className={`password-result ${passwordFeedback}`}>
                {passwordFeedback === "correct" ? "Correct" : "Incorrect"}
              </div>
              <div className="revealed-clues">
                {answeredPasswordClues.map((c, i) => (
                  <span key={i}>{i + 1}. {c}</span>
                ))}
              </div>
            </>
          ) : state.phase !== "guess" ? (
            <>
              <div className="category">Secret word</div>
              <div className="hero-word">{state.currentContent?.prompt}</div>
              <div className="clue-progress">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={state.passwordClues.length > i ? "done" : ""}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              {host && (
                <form
                  className="clue-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    act({ type: "passwordClue", clue });
                    setClue("");
                  }}
                >
                  <input
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder={`Type clue ${state.passwordClues.length + 1}`}
                  />
                  <button>Lock clue</button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="category">Player 4 · Final guess</div>
              <div className="hero-word hidden">HIDDEN</div>
              <div className="revealed-clues">
                {state.passwordClues.map((c, i) => (
                  <span key={i}>
                    {i + 1}. {c}
                  </span>
                ))}
              </div>
              {host && (
                <div className="actions password-actions">
                  <button
                    disabled={Boolean(passwordFeedback)}
                    onClick={() => answerPassword("wrong")}
                  >
                    Incorrect / Pass
                  </button>
                  <button
                    className="correct"
                    disabled={Boolean(passwordFeedback)}
                    onClick={() => answerPassword("correct")}
                  >
                    Correct +10
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      {game === "music" && (
        <>
          <div className="music-prompt">Play your own song now</div>
          <div className="music-grid">
            {(
              [
                ["title", "Got the title", 10],
                ["artist", "Got the artist", 10],
                ["lyrics", "Sang 2+ lines", 30],
              ] as const
            ).map(([key, label, pts]) => (
              <button
                disabled={!host}
                className={state.musicPoints[key] ? "on" : ""}
                key={key}
                onClick={() => act({ type: "musicToggle", key })}
              >
                <span>{label}</span>
                <b>+{pts}</b>
              </button>
            ))}
          </div>
          {host && (
            <button
              className="primary-control"
              onClick={() => act({ type: "musicConfirm" })}
            >
              Confirm round
            </button>
          )}
        </>
      )}
      {game === "wavelength" && (
        <>
          {state.phase === "playing" ? (
            <>
              <div className="question">{state.currentContent?.prompt}</div>
              <Scale meta={meta} />
              <div className="wave-target">{state.wavelength.target}</div>
              {host && (
                <button
                  className="primary-control"
                  onClick={() => act({ type: "waveHide" })}
                >
                  Hide target · start 60s
                </button>
              )}
            </>
          ) : state.phase === "guess" ? (
            <>
              <div className="question">{state.currentContent?.prompt}</div>
              <Scale meta={meta} />
              {host ? (
                <>
                  <input
                    className="range"
                    type="range"
                    min="0"
                    max="10"
                    value={guess}
                    onChange={(e) => setGuess(Number(e.target.value))}
                  />
                  <div className="wave-target">{guess}</div>
                  <button
                    className="primary-control"
                    disabled={Boolean(waveFeedback)}
                    onClick={lockWaveGuess}
                  >
                    Lock guess
                  </button>
                </>
              ) : (
                <div className="hero-word hidden">TARGET HIDDEN</div>
              )}
            </>
          ) : (
            <>
              <div className="result-row">
                <div>
                  <span>Guess</span>
                  <b>{state.wavelength.guess}</b>
                </div>
                <div>
                  <span>Target</span>
                  <b>{state.wavelength.target}</b>
                </div>
                <div>
                  <span>Points</span>
                  <b>{state.wavelength.points}</b>
                </div>
              </div>
              {waveFeedback && (
                <div className={`wave-feedback-label ${waveFeedback}`}>
                  {waveFeedback === "correct"
                    ? "Exact match · 10 points"
                    : waveFeedback === "close"
                      ? "So close · 5 points"
                      : "Too far · 0 points"}
                </div>
              )}
              {host && (
                <button
                  className="primary-control"
                  onClick={() => act({ type: "next" })}
                >
                  Next round
                </button>
              )}
            </>
          )}
        </>
      )}
      {game === "bomb" && (
        <>
          {state.phase === "playing" ? (
            <>
              <div className="bomb-icon bomb-live"><GameIcon game="bomb" /></div>

              <div className="hero-word">{state.currentContent?.prompt}</div>

              <p className="rule">
                <strong>{selectedBombRule?.label}</strong> — {selectedBombRule?.description}{" "}
                <b>{state.currentContent?.prompt}</b>
              </p>

              {seconds === 0 && <div className="boom">BOOM!</div>}

              {host && seconds === 0 && (
                <div className="actions">
                  <button
                    onClick={() =>
                      act({
                        type: "bombResolve",
                        losingTeam: "A",
                      })
                    }
                  >
                    Team A held it
                  </button>

                  <button
                    onClick={() =>
                      act({
                        type: "bombResolve",
                        losingTeam: "B",
                      })
                    }
                  >
                    Team B held it
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`bomb-die ${rollingBombDie ? "rolling" : ""}`}>
                <DieIcon />
              </div>

              {rollingBombDie ? (
                <div className="bomb-lottery" aria-live="polite">
                  <strong key={bombLotteryIndex}>
                    {BOMB_LOTTERY[bombLotteryIndex].label}
                  </strong>
                  <span>{BOMB_LOTTERY[bombLotteryIndex].description}</span>
                </div>
              ) : state.phase === "ended" ? (
                <p className="rule">Round complete · roll the next bomb</p>
              ) : selectedBombRule ? (
                <div className="bomb-rule-card">
                  <span>Selected rule</span>
                  <strong>{selectedBombRule.label}</strong>
                  <p>{selectedBombRule.description} <b>{state.currentContent?.prompt}</b></p>
                  <small>The fuse duration will remain hidden.</small>
                </div>
              ) : (
                <p className="rule">Roll to choose TICK, TICK TACK, or BOMB</p>
              )}

              {host && (
                <button
                  className="primary-control"
                  disabled={rollingBombDie}
                  onClick={() => {
                    if (state.phase === "ended") {
                      rollBombDie();
                    } else if (state.bomb.rule) {
                      void act({ type: "bombStart" });
                    } else {
                      rollBombDie();
                    }
                  }}
                >
                  {rollingBombDie
                    ? "Rolling…"
                    : state.phase === "ended"
                      ? "Next bomb"
                      : state.bomb.rule
                        ? "Start bomb"
                        : "Roll die"}
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function GameIcon({ game }: { game: GameType }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (game === "spelling")
    return <svg className="game-icon" {...common}><path d="M10 48 23 14l13 34M15 36h17M39 18h8a8 8 0 0 1 0 16h-8V18Zm0 16h10a8 8 0 0 1 0 16H39V34Z" /></svg>;
  if (game === "taboo")
    return <svg className="game-icon" {...common}><path d="M12 14h40v30H30L18 54V44h-6V14Z"/><path d="m16 51 34-38" /></svg>;
  if (game === "music")
    return <svg className="game-icon" {...common}><path d="M27 45V16l26-5v28"/><path d="M27 22 53 17"/><ellipse cx="19" cy="46" rx="8" ry="6"/><ellipse cx="45" cy="40" rx="8" ry="6"/></svg>;
  if (game === "password")
    return <svg className="game-icon" {...common}><circle cx="22" cy="28" r="11"/><path d="m31 35 20 20m-8-8 6-6m-13-1 6-6"/></svg>;
  if (game === "bomb")
    return <svg className="game-icon" {...common}><circle cx="30" cy="37" r="18"/><path d="m42 24 7-8m-14 4 5-7m8 5 5 4"/><path d="M23 31h14"/></svg>;
  if (game === "trivia")
    return <svg className="game-icon" {...common}><path d="m7 25 25-13 25 13-25 13L7 25Z"/><path d="M17 32v11c9 7 21 7 30 0V32m10-7v18"/></svg>;
  return <svg className="game-icon" {...common}><path d="M8 38c7-18 14 18 22 0s15 18 26-8"/><path d="M8 22h48M8 50h48"/></svg>;
}

function DieIcon() {
  return (
    <svg className="die-icon" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="8" width="48" height="48" rx="10" />
      <circle cx="21" cy="21" r="3" />
      <circle cx="43" cy="21" r="3" />
      <circle cx="32" cy="32" r="3" />
      <circle cx="21" cy="43" r="3" />
      <circle cx="43" cy="43" r="3" />
    </svg>
  );
}

function Scale({ meta }: { meta: Record<string, unknown> }) {
  return (
    <div className="scale">
      <span>0 · {String(meta.low || "low")}</span>
      <span>10 · {String(meta.high || "high")}</span>
    </div>
  );
}
function Actions({ act }: { act: (a: Record<string, unknown>) => void }) {
  return (
    <div className="actions">
      <button
        onClick={() => {
          playWrong();
          act({ type: "pass" });
        }}
      >
        Pass
      </button>
      <button
        className="correct"
        onClick={() => {
          act({ type: "correct" });
        }}
      >
        Correct +10
      </button>
    </div>
  );
}

function audioContext() {
  return new window.AudioContext();
}
function noiseBurst(
  c: AudioContext,
  time: number,
  duration: number,
  frequency: number,
  gainValue: number,
) {
  const length = Math.max(1, Math.floor(c.sampleRate * duration)),
    buffer = c.createBuffer(1, length, c.sampleRate),
    data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++)
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = c.createBufferSource(),
    filter = c.createBiquadFilter(),
    gain = c.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.85;
  gain.gain.setValueAtTime(gainValue, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start(time);
  source.stop(time + duration);
}
const gameSounds: Record<string, HTMLAudioElement> = {};

function playSound(file: string, volume = 1) {
  try {
    if (typeof window === "undefined") return;

    const sound =
      gameSounds[file] ?? (gameSounds[file] = new Audio(`/sounds/${file}`));

    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;

    void sound.play().catch(() => {
      // Browsers may block sound until the host interacts with the page.
    });
  } catch {
    // Audio failure should never interrupt the game.
  }
}

function playSuccess() {
  playSound("correct.mp3", 0.8);
}

function playWrong() {
  playSound("incorrect.mp3", 0.8);
}

function playTick(urgent: boolean) {
  playSound("tick.mp3", urgent ? 0.55 : 0.3);
}
function speakWord(word: string) {
  if (!word || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = synth.getVoices();
  const voice =
    voices.find((v) => v.lang.toLowerCase() === "en-za") ??
    voices.find((v) => v.lang.toLowerCase() === "en-gb") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = voice?.lang || "en-ZA";
  if (voice) utterance.voice = voice;
  utterance.rate = 0.82;
  utterance.pitch = 1;
  synth.speak(utterance);
}
