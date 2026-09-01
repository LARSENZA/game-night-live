"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameState, GameType, RoomPayload, TeamKey } from "@/lib/types";
import { WikiProduceImage } from "./wiki-produce-image";
import { getPunctuationExample } from "@/lib/punctuation-examples";

const GAMES: { id: GameType; name: string }[] = [
  { id: "spelling", name: "SPELLING BEE" },
  { id: "taboo", name: "TABOO" },
  { id: "music", name: "MUSIC CHALLENGE" },
  { id: "finish_lyric", name: "FINISH THE LYRIC" },
  { id: "original_source", name: "ORIGINAL SOURCE" },
  { id: "beat_intro", name: "BEAT THE INTRO" },
  { id: "password", name: "PASSWORD" },
  { id: "bomb", name: "BOMB" },
  { id: "trivia", name: "FIFTH GRADER" },
  { id: "wavelength", name: "WAVE LENGTH" },
  { id: "top_answers", name: "TOP ANSWERS" },
  { id: "moji", name: "MOJI" },
  { id: "rapid_fire", name: "RAPID FIRE" },
  { id: "charades", name: "CHARADES RELAY" },
  { id: "scavenger", name: "SCAVENGER HUNT" },
  { id: "five_alive", name: "FIVE ALIVE" },
];
const MUSIC_MODES=GAMES.filter(game=>["music","finish_lyric","original_source","beat_intro"].includes(game.id));
const MAIN_GAMES=GAMES.filter(game=>!["music","finish_lyric","original_source","beat_intro"].includes(game.id));

const BOMB_LOTTERY = [
  { id: "tick", label: "TICK", description: "The word cannot start with the letters" },
  { id: "ticktack", label: "TICK TACK", description: "The letters can go anywhere in the word" },
  { id: "bomb", label: "BOMB", description: "The word cannot end with the letters" },
] as const;

type DisplayFont = "show" | "clean" | "arial" | "verdana" | "georgia" | "mono";
type PromptSize = "small" | "standard" | "large" | "xl";

const DISPLAY_PREFS_KEY = "game-night-display-preferences";
const DISPLAY_FONTS: { id: DisplayFont; name: string }[] = [
  { id: "show", name: "Game Show" },
  { id: "clean", name: "Clean Sans" },
  { id: "arial", name: "Arial" },
  { id: "verdana", name: "Verdana" },
  { id: "georgia", name: "Georgia" },
  { id: "mono", name: "Monospace" },
];
const PROMPT_SIZES: { id: PromptSize; name: string }[] = [
  { id: "small", name: "Small · 85%" },
  { id: "standard", name: "Standard · 100%" },
  { id: "large", name: "Large · 115%" },
  { id: "xl", name: "Extra large · 130%" },
];

function applyDisplayPreferences(font: DisplayFont, promptSize: PromptSize) {
  document.documentElement.dataset.gameFont = font;
  document.documentElement.dataset.promptSize = promptSize;
}

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
function intermissionRemaining(state: GameState, now: number) {
  const timer=state.intermission;
  if(timer.running&&timer.endsAt&&now)return Math.max(0,Math.min(timer.total,Math.ceil((timer.endsAt-now)/1000)));
  return Math.max(0,Number(timer.pausedRemaining)||0);
}
function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function syncServerClock(
  serverNow: unknown,
  requestStarted: number,
  offsetRef: { current: number },
) {
  const serverTime = Number(serverNow);
  if (!Number.isFinite(serverTime)) return;
  const responseReceived = Date.now();
  const halfRoundTrip = (responseReceived - requestStarted) / 2;
  const measuredOffset = serverTime + halfRoundTrip - responseReceived;
  // Network latency varies slightly between polls. Smooth later measurements
  // so the visible countdown never jumps forward/backward between seconds.
  offsetRef.current =
    offsetRef.current === 0
      ? measuredOffset
      : offsetRef.current * 0.85 + measuredOffset * 0.15;
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
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [pendingGame, setPendingGame] = useState<GameType | null>(null);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [seasonOpen,setSeasonOpen]=useState(false);
  const [questionHistoryOpen,setQuestionHistoryOpen]=useState(false);
  const [exitConfirmOpen,setExitConfirmOpen]=useState(false);
  const [mainMenuConfirmOpen,setMainMenuConfirmOpen]=useState(false);
  const [restartConfirmOpen,setRestartConfirmOpen]=useState(false);
  const [intermissionOpen,setIntermissionOpen]=useState(false);
  const [transitionMessage,setTransitionMessage]=useState("");
  const [transitionLeaving,setTransitionLeaving]=useState(false);
  const [lobbyVolume,setLobbyVolume]=useState(0.22);
  const [displayFont,setDisplayFont]=useState<DisplayFont>("show");
  const [promptSize,setPromptSize]=useState<PromptSize>("standard");
  const previousScore = useRef<{ A: number; B: number } | null>(null);
  const suppressScoreSoundUntil = useRef(0);
  const previousSpokenWord = useRef("");
  const spellingWordStartedAt=useRef(0);
  const serverClockOffset = useRef(0);

  useEffect(() => {
    const readPreferences = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(DISPLAY_PREFS_KEY) || "{}");
        const font = DISPLAY_FONTS.some(item => item.id === saved.font) ? saved.font as DisplayFont : "show";
        const size = PROMPT_SIZES.some(item => item.id === saved.promptSize) ? saved.promptSize as PromptSize : "standard";
        setDisplayFont(font);
        setPromptSize(size);
        applyDisplayPreferences(font, size);
      } catch {
        applyDisplayPreferences("show", "standard");
      }
    };
    readPreferences();
    const sync = (event: StorageEvent) => { if (event.key === DISPLAY_PREFS_KEY) readPreferences(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const startingPixelRatio = window.devicePixelRatio || 1;
    const updateBroadcastScale = () => {
      // Chrome page zoom changes both innerWidth and devicePixelRatio. Undo
      // that zoom when calculating the fitted canvas size, so page zoom can
      // enlarge the canvas and expose normal scrollable overflow.
      const zoomRatio = (window.devicePixelRatio || startingPixelRatio) / startingPixelRatio;
      const availableWidth = window.innerWidth * zoomRatio;
      const availableHeight = window.innerHeight * zoomRatio;
      const scale = Math.max(0.1, Math.min(availableWidth / 1800, availableHeight / 1000));
      root.style.setProperty("--broadcast-scale", String(scale));
      root.style.setProperty("--broadcast-width", `${1800 * scale}px`);
      root.style.setProperty("--broadcast-height", `${1000 * scale}px`);
      root.style.setProperty("--broadcast-left", `${Math.max(0, (window.innerWidth - 1800 * scale) / 2)}px`);
      root.style.setProperty("--broadcast-top", `${Math.max(0, (window.innerHeight - 1000 * scale) / 2)}px`);
    };
    updateBroadcastScale();
    window.addEventListener("resize", updateBroadcastScale);
    return () => {
      window.removeEventListener("resize", updateBroadcastScale);
      root.style.removeProperty("--broadcast-scale");
      root.style.removeProperty("--broadcast-width");
      root.style.removeProperty("--broadcast-height");
      root.style.removeProperty("--broadcast-left");
      root.style.removeProperty("--broadcast-top");
    };
  }, []);

  const updateDisplayFont = (font: DisplayFont) => {
    setDisplayFont(font);
    applyDisplayPreferences(font, promptSize);
    localStorage.setItem(DISPLAY_PREFS_KEY, JSON.stringify({ font, promptSize }));
  };
  const updatePromptSize = (size: PromptSize) => {
    setPromptSize(size);
    applyDisplayPreferences(displayFont, size);
    localStorage.setItem(DISPLAY_PREFS_KEY, JSON.stringify({ font: displayFont, promptSize: size }));
  };

  const load = useCallback(async () => {
    try {
      const requestStarted = Date.now();
      const response = await fetch(`/api/rooms/${code}`, { cache: "no-store" });
      const data = await response.json();
      syncServerClock(data.serverNow, requestStarted, serverClockOffset);
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
    if (
      soundReady &&
      prev &&
      (next.A > prev.A || next.B > prev.B) &&
      Date.now() > suppressScoreSoundUntil.current
    )
      playSuccess();
    previousScore.current = next;
  }, [room, soundReady]);

  const tickSeconds = room ? remaining(room.state, now) : 0;
  const breakSeconds = room ? intermissionRemaining(room.state, now) : 0;
  useEffect(() => {
    const running=Boolean(room?.state.timer.running),endsAt=Number(room?.state.timer.endsAt)||0;
    if(!running||!endsAt||!soundReady||ambientMuted)return;
    const play=()=>{const left=Math.ceil((endsAt-(Date.now()+serverClockOffset.current))/1000);if(left>0)playTick(left<=10)};
    play();
    // Audio has its own steady cadence. It must not depend on the 250ms render
    // clock or 800ms room polling, both of which can shift under network load.
    const cadence=window.setInterval(play,1000);
    const stopAfter=Math.max(0,endsAt-(Date.now()+serverClockOffset.current)+80);
    const stop=window.setTimeout(()=>window.clearInterval(cadence),stopAfter);
    return()=>{window.clearInterval(cadence);window.clearTimeout(stop)};
  }, [room?.state.timer.running,room?.state.timer.endsAt,soundReady,ambientMuted]);
  useEffect(()=>{
    const running=Boolean(room?.state.intermission.active&&room.state.intermission.running),endsAt=Number(room?.state.intermission.endsAt)||0;
    if(!running||!endsAt||!soundReady||ambientMuted)return;
    const play=()=>{const left=Math.ceil((endsAt-(Date.now()+serverClockOffset.current))/1000);if(left>0&&left<=10)playTick(true)};
    const cadence=window.setInterval(play,1000);return()=>window.clearInterval(cadence);
  },[room?.state.intermission.active,room?.state.intermission.running,room?.state.intermission.endsAt,soundReady,ambientMuted]);

  const previousBombSeconds = useRef<number | null>(null);
  useEffect(() => {
    if (!room || room.state.currentGame !== "bomb") return;
    if (soundReady && previousBombSeconds.current && previousBombSeconds.current > 0 && tickSeconds === 0)
      playSound("explode.mp3", 0.95);
    previousBombSeconds.current = tickSeconds;
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
    const speakDelay = window.setTimeout(() => speakWord(word,()=>{spellingWordStartedAt.current=performance.now()}), 180);
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
      if (key === "f")
        void (document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen());
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [role]);

  useEffect(()=>{if(role!=="host")return;const audio=getLobbyAudio();audio.volume=lobbyVolume;const lobby=room?.state.phase==="lobby"||room?.state.intermission.active;if(soundReady&&!ambientMuted&&lobby)void audio.play().catch(()=>{});else{audio.pause();audio.currentTime=0;}return()=>audio.pause();},[role,room?.state.phase,room?.state.intermission.active,soundReady,ambientMuted,lobbyVolume]);

  async function act(action: Record<string, unknown>) {
    if (action.type === "addPoints" || action.type === "setScore")
      suppressScoreSoundUntil.current = Date.now() + 2000;
    const token = localStorage.getItem(`host-token:${code}`);
    if (!token)
      return setError("This browser does not have the host key for this room.");
    const requestStarted = Date.now();
    const transitionTypes=["configureEvent","selectGame","beginGame","nextGame","editEvent","newGame"];
    const hasTransition=transitionTypes.includes(String(action.type));
    if(hasTransition){setTransitionLeaving(false);setTransitionMessage(action.type==="beginGame"?"GET READY…":action.type==="nextGame"?"LOADING NEXT GAME…":action.type==="newGame"?"RESETTING THIS ROOM…":"SETTING UP GAME NIGHT…")}
    const started=Date.now();
    // Let the entrance animation establish itself before changing server state.
    // This also prevents a round timer from spending the full transition hidden.
    if(hasTransition)await new Promise(resolve=>setTimeout(resolve,700));
    const response = await fetch(`/api/rooms/${code}/actions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(action),
    });
    const data = await response.json();
    if(hasTransition)await new Promise(resolve=>setTimeout(resolve,Math.max(0,1150-(Date.now()-started))));
    syncServerClock(data.serverNow, requestStarted, serverClockOffset);
    if (!response.ok){setTransitionMessage("");return setError(data.error || "Action failed")}
    setRoom(data);
    if(hasTransition){setTransitionLeaving(true);await new Promise(resolve=>setTimeout(resolve,280));setTransitionMessage("");setTransitionLeaving(false)}
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
        <div className="loading-bar" aria-label="Loading"><span /></div>
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
  const exitGame = () => setExitConfirmOpen(true);
  const returnToRoomMenu=async()=>{setMainMenuConfirmOpen(false);setSettingsOpen(false);setPendingGame(null);await act({type:"newGame"});};
  const openDisplay=()=>window.open(`/display/${code}`,"_blank","noopener,noreferrer");
  const openAnswerKey=()=>{const popup=window.open(`/host/${code}/answer-key`,`game-night-answer-key-${code}`,"popup=yes,width=520,height=760,resizable=yes,scrollbars=yes");popup?.focus()};

  return (
    <div className="broadcast-viewport">
    <main
      className={`room-shell broadcast-canvas ${role} ${controlsHidden ? "controls-hidden" : ""}`}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if(soundReady&&!ambientMuted&&state.phase==="lobby")void getLobbyAudio().play().catch(()=>{});
        if (soundReady && target.closest("button") && !target.closest(".sound-button")) playSound("click.mp3", 0.65);
      }}
    >
      {!controlsHidden && (
        <header className="room-header">
          <div className="host-nav" />
          <div className="room-brand">
            GAME <b>NIGHT</b> ZA
          </div>
          <div className="header-actions">{role==="host"&&<><button className="ambient-button" aria-pressed={ambientMuted} aria-label={ambientMuted?"Turn clock and lobby music on":"Mute clock and lobby music"} title={ambientMuted?"Clock and lobby music off":"Clock and lobby music on"} onClick={()=>setAmbientMuted(value=>!value)}><SpeakerIcon muted={ambientMuted}/></button><button className="answer-key-button" onClick={openAnswerKey}>Answer key ↗</button><button className={`break-button ${state.intermission.active?"active":""}`} onClick={()=>setIntermissionOpen(true)}>{state.intermission.active?"Countdown":"Break"}</button><button className="main-menu-button" onClick={()=>setMainMenuConfirmOpen(true)}>New Game</button><button className="settings-button" aria-label="Open settings" onClick={()=>setSettingsOpen(true)}><GearIcon/></button></>}</div>
        </header>
      )}
      {state.eventStarted&&!state.intermission.active&&<Scoreboard state={state} host={hostControls} act={act} />}
      <section className="game-stage">
        {state.intermission.active?<IntermissionScreen state={state} seconds={breakSeconds}/>:state.phase==="eventComplete"?<EventComplete state={state} host={hostControls} onNewGame={()=>void returnToRoomMenu()} onReview={()=>setReviewOpen(true)}/>:state.phase==="audience"?<CrowdClash state={state} host={hostControls} seconds={seconds} act={act}/>:!state.eventConfigured?(
          <LobbySetup state={state} host={hostControls} act={act} onBack={exitGame}/>
        ):!state.currentGame ? (
          <GameChoice state={state} host={hostControls} pending={pendingGame} setPending={setPendingGame} onBack={!state.eventStarted?()=>act({type:"editEvent"}):undefined} onContinue={()=>pendingGame&&act({type:"selectGame",game:pendingGame})}/>
        ) : state.phase === "setup" ? (
          <SetupScreen state={state} host={hostControls} act={act} />
        ) : state.phase === "turnComplete" ? (
          <TurnComplete state={state} host={hostControls} act={act} />
        ) : state.phase === "matchComplete" ? (
          <MatchComplete state={state} host={hostControls} act={act} onReview={() => setReviewOpen(true)} />
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
            onRestart={()=>setRestartConfirmOpen(true)}
            spellingWordStartedAt={spellingWordStartedAt}
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
      {reviewOpen && <ReviewPanel state={state} onClose={() => setReviewOpen(false)} />}
      {leaderboardOpen && <LeaderboardPanel onClose={() => setLeaderboardOpen(false)} />}
      {settingsOpen&&<SettingsPanel code={code} soundReady={soundReady} setSoundReady={setSoundReady} lobbyVolume={lobbyVolume} setLobbyVolume={setLobbyVolume} displayFont={displayFont} setDisplayFont={updateDisplayFont} promptSize={promptSize} setPromptSize={updatePromptSize} close={()=>setSettingsOpen(false)} fullscreen={toggleFullscreen} openDisplay={openDisplay} breakTime={()=>{setSettingsOpen(false);setIntermissionOpen(true)}} broadcast={()=>{setControlsHidden(true);setSettingsOpen(false)}} review={()=>{setReviewOpen(true);setSettingsOpen(false)}} leaderboard={()=>{setLeaderboardOpen(true);setSettingsOpen(false)}} content={()=>router.push(`/host/${code}/content`)} mainMenu={()=>{setSettingsOpen(false);setMainMenuConfirmOpen(true)}} resetQuestionHistory={()=>{setSettingsOpen(false);setQuestionHistoryOpen(true)}} quitRoom={()=>{setSettingsOpen(false);setExitConfirmOpen(true)}} newSeason={()=>{setSeasonOpen(true);setSettingsOpen(false)}}/>}
      {intermissionOpen&&<IntermissionPanel state={state} act={act} close={()=>setIntermissionOpen(false)}/>} 
      {seasonOpen&&<NewSeasonPanel close={()=>setSeasonOpen(false)}/>} 
      {questionHistoryOpen&&<ResetQuestionHistoryPanel cancel={()=>setQuestionHistoryOpen(false)} reset={()=>{setQuestionHistoryOpen(false);void act({type:"resetQuestionHistory"})}}/>}
      {mainMenuConfirmOpen&&<RoomMenuConfirmPanel code={code} cancel={()=>setMainMenuConfirmOpen(false)} restart={()=>void returnToRoomMenu()}/>} 
      {exitConfirmOpen&&<ExitConfirmPanel cancel={()=>setExitConfirmOpen(false)} continueExit={()=>router.push("/")}/>} 
      {restartConfirmOpen&&<RestartTurnPanel teamName={state.teams[state.activeTeam].name} cancel={()=>setRestartConfirmOpen(false)} restart={()=>{setRestartConfirmOpen(false);void act({type:"restartTurn"})}}/>}
      {transitionMessage&&<div className={`transition-screen ${transitionLeaving?"leaving":""}`}><div className="transition-emblem">GN</div><div className="loading-bar"><span/></div><strong>{transitionMessage}</strong></div>}
    </main>
    </div>
  );
}

function LobbySetup({state,host,act,onBack}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>;onBack:()=>void}){
  const [games,setGames]=useState<GameType[]>(state.selectedGames),[musicOpen,setMusicOpen]=useState(state.selectedGames.some(game=>MUSIC_MODES.some(mode=>mode.id===game)));
  const toggle=(game:GameType)=>setGames(value=>value.includes(game)?value.filter(item=>item!==game):[...value,game]);
  const musicSelected=games.some(game=>MUSIC_MODES.some(mode=>mode.id===game));
  return <div className="setup-card lobby-setup"><span className="setup-kicker">Create game night</span><h1>Set up your teams</h1><p>Choose team names, who plays first, and the games for tonight.</p><div className="lobby-teams">{(["A","B"] as TeamKey[]).map(team=><article key={team} className={state.startingTeam===team?"selected":""}><TeamNameEditor team={team} state={state} act={act}/><button disabled={!host} onClick={()=>act({type:"setActiveTeam",team})}>{state.startingTeam===team?`${state.teams[team].name} · PLAYING FIRST`:"Choose to play first"}</button></article>)}</div><h2>Choose your games</h2><div className="event-game-grid">{MAIN_GAMES.map(g=><button key={g.id} className={games.includes(g.id)?"selected":""} onClick={()=>toggle(g.id)}><GameIcon game={g.id}/>{g.name}</button>)}<button className={`music-folder ${musicSelected?"selected":""}`} onClick={()=>setMusicOpen(value=>!value)}><GameIcon game="music"/>MUSIC ROUND <small>{musicSelected?`${games.filter(game=>MUSIC_MODES.some(mode=>mode.id===game)).length} selected`:"Choose modes"}</small></button></div>{musicOpen&&<div className="music-mode-picker">{MUSIC_MODES.map(mode=><button key={mode.id} className={games.includes(mode.id)?"selected":""} onClick={()=>toggle(mode.id)}><span>{games.includes(mode.id)?"✓":"○"}</span><b>{mode.name}</b></button>)}</div>}{host&&<div className="flow-actions"><button onClick={onBack}>Back</button><button className="primary-control" disabled={!games.length} onClick={()=>act({type:"configureEvent",games})}>Continue</button></div>}</div>
}
function GameChoice({state,host,pending,setPending,onBack,onContinue}:{state:GameState;host:boolean;pending:GameType|null;setPending:(g:GameType|null)=>void;onBack?:()=>void;onContinue:()=>void}){const remainingGames=state.selectedGames.filter(g=>!state.completedGames.includes(g)),[audienceVote,setAudienceVote]=useState(false);useEffect(()=>{if(pending&&!remainingGames.includes(pending))setPending(null)},[state.completedGames.join(","),state.selectedGames.join(",")]);return <div className="setup-card game-choice"><span className="setup-kicker">Game Night ZA</span><h1>{audienceVote?"Audience Choice":"Choose a game"}</h1><p>{audienceVote?"Ask viewers to type the number of the game they want next.":state.eventStarted?"Choose from the games still left to play.":"Choose the first game to begin."}</p><div className="event-game-grid">{remainingGames.map((id,index)=>{const g=GAMES.find(item=>item.id===id)!;return <button key={id} className={pending===id?"selected":""} onClick={()=>setPending(id)}>{audienceVote&&<strong className="vote-number">{index+1}</strong>}<GameIcon game={id}/>{g.name}</button>})}</div>{host&&<div className="flow-actions">{onBack&&<button onClick={onBack}>Back</button>}<button onClick={()=>setAudienceVote(value=>!value)}>{audienceVote?"Close audience vote":"Audience vote"}</button><button className="primary-control" disabled={!pending} onClick={onContinue}>Continue</button></div>}</div>}
function EventComplete({state,host,onNewGame,onReview}:{state:GameState;host:boolean;onNewGame:()=>void;onReview:()=>void}){const a=state.teams.A.score,b=state.teams.B.score,audience=Object.entries(state.audience.leaderboard).sort((x,y)=>y[1]-x[1]).slice(0,3);return <div className="round-summary event-complete"><span className="setup-kicker">Game night complete</span><h1>{a===b?"It’s a draw!":`${a>b?state.teams.A.name:state.teams.B.name} wins!`}</h1><div className="match-points"><b>{state.teams.A.name}<strong>{a}</strong></b><b>{state.teams.B.name}<strong>{b}</strong></b></div>{audience.length>0&&<div className="audience-mvp"><span>Audience MVP</span>{audience.map(([name,score],index)=><b key={name}>{index+1}. {name}<strong>{score}</strong></b>)}</div>}{host&&<div className="summary-actions"><button onClick={onReview}>Review game</button><button className="primary-control" onClick={onNewGame}>New game</button></div>}</div>}
function IntermissionScreen({state,seconds}:{state:GameState;seconds:number}){const done=seconds<=0&&!state.intermission.running;return <div className={`intermission-screen ${state.intermission.mode} ${done?"complete":""}`}><div className="intermission-beams"/><div className="intermission-orbit orbit-one"/><div className="intermission-orbit orbit-two"/><div className="intermission-content"><div className="intermission-logo"><span>GAME</span><b>NIGHT</b><span>ZA</span></div><p className="intermission-title">{done?"STARTING NOW…":state.intermission.title}</p><div className="intermission-clock" aria-live="polite">{formatTime(seconds)}</div><p className="intermission-message">{state.intermission.message}</p>{!state.intermission.running&&seconds>0&&<span className="intermission-paused">PAUSED</span>}<div className="intermission-dots"><i/><i/><i/><i/><i/></div></div></div>}
function IntermissionPanel({state,act,close}:{state:GameState;act:(a:Record<string,unknown>)=>Promise<void>;close:()=>void}){const current=state.intermission,[mode,setMode]=useState<"starting"|"break">(current.mode),[minutes,setMinutes]=useState(Math.max(1,Math.round(current.total/60))),[title,setTitle]=useState(current.title),[message,setMessage]=useState(current.message),[busy,setBusy]=useState(false);const chooseMode=(next:"starting"|"break")=>{setMode(next);setTitle(next==="break"?"QUICK BREAK":"LIVE GAME STARTS IN");setMessage(next==="break"?"We’ll be right back":"Get your team ready!")};async function start(){setBusy(true);if(state.timer.running)await act({type:"pauseTimer"});await act({type:"intermissionStart",mode,title,message,seconds:Math.max(1,minutes)*60});setBusy(false)}return <div className="review-backdrop" role="dialog" aria-modal="true" aria-labelledby="intermission-panel-title" onClick={close}><section className="review-panel intermission-panel" onClick={e=>e.stopPropagation()}><header><div><span className="setup-kicker">Audience screen</span><h2 id="intermission-panel-title">Countdown / Break</h2></div><button onClick={close}>Close</button></header>{current.active?<><div className="intermission-mini"><b>{current.title}</b><strong>{current.running?"LIVE":Number(current.pausedRemaining)===0?"FINISHED":"PAUSED"}</strong></div><div className="intermission-live-controls"><button onClick={()=>act({type:current.running?"intermissionPause":"intermissionResume"})} disabled={!current.running&&Number(current.pausedRemaining)<=0}>{current.running?"Pause":"Resume"}</button><button onClick={()=>act({type:"intermissionAdd",seconds:-60})}>−1 minute</button><button onClick={()=>act({type:"intermissionAdd",seconds:60})}>+1 minute</button><button className="danger" onClick={async()=>{await act({type:"intermissionEnd"});close()}}>Return to game</button></div></>:<><div className="intermission-modes"><button className={mode==="starting"?"selected":""} onClick={()=>chooseMode("starting")}>Game starting</button><button className={mode==="break"?"selected":""} onClick={()=>chooseMode("break")}>Quick break</button></div><label>Duration<div className="duration-presets">{[1,3,5,10,15,30].map(value=><button key={value} className={minutes===value?"selected":""} onClick={()=>setMinutes(value)}>{value} min</button>)}</div><input type="number" min="1" max="1440" value={minutes} onChange={e=>setMinutes(Math.max(1,Math.min(1440,Number(e.target.value)||1)))} /></label><label>Heading<input maxLength={60} value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Message<input maxLength={100} value={message} onChange={e=>setMessage(e.target.value)}/></label>{state.timer.running&&<p className="timer-pause-note">The current game timer will be paused automatically.</p>}<button className="primary-control start-intermission" disabled={busy||!title.trim()} onClick={start}>{busy?"Starting…":"Show countdown"}</button></>}</section></div>}
function SettingsPanel(p:{code:string;soundReady:boolean;setSoundReady:(v:boolean)=>void;lobbyVolume:number;setLobbyVolume:(v:number)=>void;displayFont:DisplayFont;setDisplayFont:(v:DisplayFont)=>void;promptSize:PromptSize;setPromptSize:(v:PromptSize)=>void;close:()=>void;fullscreen:()=>void;openDisplay:()=>void;breakTime:()=>void;broadcast:()=>void;review:()=>void;leaderboard:()=>void;content:()=>void;mainMenu:()=>void;resetQuestionHistory:()=>void;quitRoom:()=>void;newSeason:()=>void}){return <div className="review-backdrop" role="dialog" aria-modal="true" onClick={p.close}><section className="review-panel settings-panel" onClick={e=>e.stopPropagation()}><header><div><span className="setup-kicker">Game Night ZA</span><h2>Settings</h2></div><button onClick={p.close}>Close</button></header><div className="settings-list"><div className="settings-display-group"><div className="settings-section-title"><b>Display</b><span>Applies to host and display tabs on this browser</span></div><label className="settings-select-row"><span>Font</span><select value={p.displayFont} onChange={e=>p.setDisplayFont(e.target.value as DisplayFont)}>{DISPLAY_FONTS.map(font=><option key={font.id} value={font.id}>{font.name}</option>)}</select></label><label className="settings-select-row"><span>Prompt size</span><select value={p.promptSize} onChange={e=>p.setPromptSize(e.target.value as PromptSize)}>{PROMPT_SIZES.map(size=><option key={size.id} value={size.id}>{size.name}</option>)}</select></label><div className="settings-font-preview"><small>Preview</small><strong>Game Night ZA</strong><span>The next question will look like this.</span></div></div><button className="open-display-control" onClick={p.openDisplay}>Open display <span>Room {p.code} ↗</span></button><button onClick={p.breakTime}>Countdown / Break</button><button onClick={p.fullscreen}>Fullscreen <kbd>F</kbd></button><button onClick={p.broadcast}>Broadcast mode <kbd>H</kbd></button><button onClick={p.review}>Review</button><button onClick={p.leaderboard}>Leaderboard</button><button onClick={p.content}>Content</button><button className="sound-button" onClick={()=>p.setSoundReady(!p.soundReady)}>Sound {p.soundReady?"on":"off"}</button><label>Lobby music volume<input type="range" min="0" max="0.6" step="0.02" value={p.lobbyVolume} onChange={e=>p.setLobbyVolume(Number(e.target.value))}/></label><div className="settings-room">ROOM <strong>{p.code}</strong><button onClick={()=>navigator.clipboard.writeText(p.code)}>Copy</button></div><hr/><button onClick={p.mainMenu}>New Game · same room</button><button onClick={p.resetQuestionHistory}>Reset question history</button><button className="danger" onClick={p.quitRoom}>Quit room</button><button className="danger" onClick={p.newSeason}>Start new season</button></div></section></div>}
function RoomMenuConfirmPanel({code,cancel,restart}:{code:string;cancel:()=>void;restart:()=>void}){return <div className="review-backdrop" role="dialog" aria-modal="true" aria-labelledby="room-menu-title" onClick={cancel}><section className="review-panel confirm-panel" onClick={e=>e.stopPropagation()}><span className="setup-kicker">Stay in room {code}</span><h2 id="room-menu-title">Start a new game?</h2><p>This resets team names, scores, selected games and current progress, then returns to team setup. The room code, leaderboard and question history stay unchanged.</p><div className="confirm-actions"><button onClick={cancel}>Cancel</button><button className="primary-control" onClick={restart}>New Game</button></div></section></div>}
function ExitConfirmPanel({cancel,continueExit}:{cancel:()=>void;continueExit:()=>void}){return <div className="review-backdrop exit-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="exit-confirm-title" onClick={cancel}><section className="review-panel confirm-panel" onClick={e=>e.stopPropagation()}><span className="setup-kicker">Quit this room?</span><h2 id="exit-confirm-title">Return to the start screen?</h2><p>You will leave this host screen. Selecting Start game from the landing page creates a new room code.</p><div className="confirm-actions"><button onClick={cancel}>Cancel</button><button className="danger quit-room-confirm" onClick={continueExit}>Quit room</button></div></section></div>}
function RestartTurnPanel({teamName,cancel,restart}:{teamName:string;cancel:()=>void;restart:()=>void}){return <div className="review-backdrop" role="dialog" aria-modal="true" aria-labelledby="restart-turn-title" onClick={cancel}><section className="review-panel confirm-panel" onClick={e=>e.stopPropagation()}><span className="setup-kicker">Restart current turn?</span><h2 id="restart-turn-title">Restart {teamName}&apos;s turn?</h2><p>Points and answer history earned during this turn will be removed. The other team and previous games will not be changed.</p><div className="confirm-actions"><button onClick={cancel}>Cancel</button><button className="danger restart-confirm" onClick={restart}>Restart turn</button></div></section></div>}
function ResetQuestionHistoryPanel({cancel,reset}:{cancel:()=>void;reset:()=>void}){return <div className="review-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-history-title" onClick={cancel}><section className="review-panel confirm-panel" onClick={e=>e.stopPropagation()}><span className="setup-kicker">Room content</span><h2 id="reset-history-title">Reset question history?</h2><p>Questions previously shown in this room may appear again. Team names, scores, leaderboard records and question banks will not be changed.</p><div className="confirm-actions"><button onClick={cancel}>Cancel</button><button className="danger restart-confirm" onClick={reset}>Reset history</button></div></section></div>}
function NewSeasonPanel({close}:{close:()=>void}){const [key,setKey]=useState(""),[confirmation,setConfirmation]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);async function reset(){setBusy(true);const r=await fetch("/api/admin/start-new-season",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,confirmation})});const d=await r.json();setBusy(false);setMessage(d.error||d.message);if(r.ok)setTimeout(()=>location.reload(),900)}return <div className="review-backdrop" role="dialog" aria-modal="true"><section className="review-panel season-panel"><header><div><span className="setup-kicker">Danger zone</span><h2>Start new season</h2></div><button onClick={close}>Close</button></header><p>This clears standings, matches, reviews and usage history for everyone. Questions remain untouched.</p><label>Administrator PIN<input type="password" value={key} onChange={e=>setKey(e.target.value)}/></label><label>Type <b>START NEW SEASON</b><input value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>{message&&<p>{message}</p>}<button className="danger primary-control" disabled={busy||confirmation!=="START NEW SEASON"||!key} onClick={reset}>{busy?"Resetting…":"Start new season"}</button></section></div>}

function SetupScreen({state,host,act}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>}) {
  const title=GAMES.find(g=>g.id===state.currentGame)?.name;
  const timerSeconds=state.currentGame?state.timerDefaults[state.currentGame]??0:0;
  const spellingDifficulties=["Easy","Medium","Hard"] as const;
  return <div className="setup-card">
    <span className="setup-kicker">Ready to play</span><GameIcon game={state.currentGame!}/><h1>{title}</h1>
    <p>Content and timers stay hidden until the host starts the game.</p>
    <div className="playing-team-banner">{state.teams[state.startingTeam].name} · PLAYING FIRST</div>
    {host&&state.currentGame==="bomb"&&<div className="spelling-mode-setup"><span>Bomb mode</span><div>{[{id:"words",name:"Word Bomb"},{id:"veggies",name:"Produce Bomb"},{id:"punctuation",name:"Punctuation Bomb"}].map(mode=><button key={mode.id} className={state.bomb.mode===mode.id?"selected":""} onClick={()=>act({type:"setBombMode",mode:mode.id})}>{mode.name}</button>)}</div><small>The random fuse remains hidden in every mode.</small></div>}
    {host&&state.currentGame!=="bomb"&&state.currentGame!=="five_alive"&&<div className="game-timer-setup"><span>Round timer</span><div>{[0,30,60,120,180].map(seconds=><button key={seconds} className={timerSeconds===seconds?"selected":""} onClick={()=>act({type:"setGameTimer",seconds})}>{seconds?`${seconds/60} min`:"No timer"}</button>)}</div></div>}
    {state.currentGame==="five_alive"&&<div className="five-alive-setup-note"><b>30 seconds per team</b><span>10 possible answers · flip either side · 5 points each</span></div>}
    {host&&state.currentGame==="spelling"&&<div className="spelling-mode-setup"><span>Difficulty mode</span><div><button className={state.spelling.mode==="adult_adaptive"?"selected":""} onClick={()=>act({type:"setSpellingMode",mode:"adult_adaptive"})}>ADAPTIVE</button>{spellingDifficulties.map(difficulty=><button key={difficulty} className={state.spelling.mode==="custom"&&state.spelling.selectedDifficulties.includes(difficulty)?"selected":""} onClick={()=>act({type:"toggleSpellingDifficulty",difficulty})}>{difficulty.toUpperCase()}</button>)}</div><small>Adaptive stands alone · otherwise select any combination of Easy, Medium and Hard</small></div>}
    {host&&<button className="primary-control start-match" onClick={()=>act({type:"beginGame"})}>Start {title}</button>}
  </div>;
}

function TurnComplete({state,host,act}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>}) {
  const next=state.startingTeam==="A"?"B":"A";
  return <div className="round-summary"><span className="setup-kicker">First turn complete</span><h1>{state.teams[state.activeTeam].name}</h1><p>Next up: <strong>{state.teams[next].name}</strong></p>{host&&<button className="primary-control" onClick={()=>act({type:"nextTeam"})}>Start {state.teams[next].name}&apos;s turn</button>}</div>;
}

function MatchComplete({state,host,act,onReview}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>;onReview:()=>void}) {
  const a=state.teams.A.score-state.matchStartScores.A,b=state.teams.B.score-state.matchStartScores.B;
  return <div className="round-summary match-complete"><span className="setup-kicker">Game complete</span><h1>{a===b?"It’s a draw!":`${a>b?state.teams.A.name:state.teams.B.name} wins!`}</h1><div className="match-points"><b>{state.teams.A.name}<strong>+{a}</strong></b><b>{state.teams.B.name}<strong>+{b}</strong></b></div>{host&&<div className="summary-actions"><button onClick={onReview}>Review answers</button><button className="crowd-clash-button" onClick={()=>act({type:"startCrowdClash"})}>Crowd Clash</button><button className="primary-control" onClick={()=>act({type:"nextGame"})}>Next game</button></div>}</div>;
}

function CrowdClash({state,host,seconds,act}:{state:GameState;host:boolean;seconds:number;act:(a:Record<string,unknown>)=>Promise<void>}){
  const [username,setUsername]=useState(""),item=state.audience.currentContent;
  return <div className="crowd-clash"><span className="setup-kicker">Audience only</span><h1>Crowd Clash</h1><div className="crowd-timer">{seconds}</div><span className="crowd-category">{item?.category}</span><div className={item?.category==="Moji"?"crowd-prompt emoji-prompt":"crowd-prompt"}>{item?.prompt}</div>{seconds===0&&<div className="crowd-answer">Answer: <strong>{item?.answer}</strong></div>}{host&&<div className="crowd-controls"><input value={username} onChange={event=>setUsername(event.target.value)} placeholder="Winning username"/><button disabled={!username.trim()} onClick={()=>act({type:"crowdAward",username})}>Award audience point</button><button onClick={()=>act({type:"crowdSkip"})}>{seconds===0?"No correct answer":"Skip challenge"}</button></div>}</div>;
}

function ReviewPanel({state,onClose}:{state:GameState;onClose:()=>void}) {
  return <div className="review-backdrop" role="dialog" aria-modal="true" aria-label="Answer review"><section className="review-panel"><header><div><span className="setup-kicker">Match history</span><h2>Answer review</h2></div><button onClick={onClose}>Close</button></header>{state.review.length?<div className="review-list">{[...state.review].reverse().map(item=><article key={item.id} className={`review-${item.result}`}><div><b>{item.teamName}</b><span>{GAMES.find(g=>g.id===item.game)?.name}</span></div><h3>{item.prompt}</h3>{item.answer&&<p>Answer: <strong>{item.answer}</strong></p>}{item.detail&&<p>{item.detail}</p>}<strong className="review-result">{item.result} · {item.points>=0?"+":""}{item.points}</strong></article>)}</div>:<p>No answers recorded in this room yet.</p>}</section></div>;
}

type LeaderTeam={id:number;name:string;totalScore:number;matchesPlayed:number;gamesWon:number;correctAnswers:number;answersPlayed:number};
function LeaderboardPanel({onClose}:{onClose:()=>void}) {
  const [teams,setTeams]=useState<LeaderTeam[]>([]),[loading,setLoading]=useState(true);
  useEffect(()=>{let live=true;fetch("/api/leaderboard",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(live)setTeams(d.teams??[])}).catch(()=>{}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[]);
  return <div className="review-backdrop" role="dialog" aria-modal="true" aria-label="Leaderboard"><section className="review-panel leaderboard-panel"><header><div><span className="setup-kicker">Game Night ZA</span><h2>Leaderboard</h2></div><button onClick={onClose}>Close</button></header>{loading?<p>Loading scores…</p>:teams.length?<div className="leader-table"><div className="leader-head"><span>#</span><span>Team</span><span>Score</span><span>Played</span><span>Wins</span><span>Accuracy</span></div>{teams.map((team,i)=><div key={team.id}><b>{i+1}</b><strong>{team.name}</strong><b>{team.totalScore}</b><span>{team.matchesPlayed}</span><span>{team.gamesWon}</span><span>{team.answersPlayed?Math.round(team.correctAnswers/team.answersPlayed*100):0}%</span></div>)}</div>:<p>The leaderboard will appear after the first completed game.</p>}</section></div>;
}

function TeamNameEditor({team,state,act}:{team:TeamKey;state:GameState;act:(a:Record<string,unknown>)=>Promise<void>}){const [draft,setDraft]=useState(state.teams[team].name),[note,setNote]=useState("");async function save(){const name=draft.trim().replace(/\s+/g," ");if(!name)return setNote("Enter a team name.");if(name.toLowerCase()===state.teams[team==="A"?"B":"A"].name.toLowerCase())return setNote("Both sides cannot use the same team.");const response=await fetch(`/api/leaderboard?name=${encodeURIComponent(name)}`,{cache:"no-store"}),data=await response.json();setNote(data.teams?.length?"Existing leaderboard team selected.":"New team ready.");await act({type:"renameTeam",team,name});}return <div className="team-name-editor" onClick={e=>e.stopPropagation()}><input className="team-name-input" value={draft} maxLength={24} aria-label={`${team} team name`} onChange={e=>setDraft(e.target.value)} onBlur={()=>void save()} onKeyDown={e=>{if(e.key==="Enter")void save()}}/>{note&&<small>{note}</small>}</div>}

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
          data-team-name={state.teams[team].name}
          aria-current={state.activeTeam === team ? "true" : undefined}
          className={state.activeTeam === team ? "active" : ""}
          onClick={() => host && act({ type: "setActiveTeam", team })}
        >
          {host ? (
            <TeamNameEditor team={team} state={state} act={act}/>
          ) : (
            <span className="team-name">{state.teams[team].name}</span>
          )}
          {host ? (
            <input
              className="score-input"
              type="number"
              step="5"
              min="0"
              max="9999"
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
  onRestart,
  spellingWordStartedAt,
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
  onRestart: () => void;
  spellingWordStartedAt:{current:number};
}) {
  const game = state.currentGame!;
  const selectedBombRule = BOMB_LOTTERY.find(
    (rule) => rule.id === state.bomb.rule,
  );
  const punctuationExample = getPunctuationExample(
    state.currentContent?.prompt,
    meta.example,
  );
  const [topKeyFor,setTopKeyFor]=useState<number|null>(null),[lifelineSeconds,setLifelineSeconds]=useState(0);
  const [expansionFeedback,setExpansionFeedback]=useState<"correct"|"wrong"|null>(null);
  const topAnswers=Array.isArray(meta.answers)?meta.answers as Array<{text:string;points:number;aliases?:string[]}>:[];
  const showTopKey=topKeyFor===state.currentContent?.id;
  useEffect(()=>{if(lifelineSeconds<=0)return;const timer=window.setInterval(()=>setLifelineSeconds(value=>Math.max(0,value-1)),1000);return()=>window.clearInterval(timer)},[lifelineSeconds>0]);
  async function askCrowd(){if(state.audienceLifelines[state.activeTeam])return;if(state.timer.running)await act({type:"pauseTimer"});await act({type:"useAudienceLifeline",team:state.activeTeam});setLifelineSeconds(15)}
  async function closeCrowdHelp(){setLifelineSeconds(0);if(state.timer.pausedRemaining)await act({type:"resumeTimer"})}
  function expansionAction(action:Record<string,unknown>,result:"correct"|"wrong",playCorrectSound=false){
    if(expansionFeedback)return;
    setExpansionFeedback(result);
    if(result==="wrong")playWrong();else if(playCorrectSound)playSuccess();
    void act(action);
    window.setTimeout(()=>setExpansionFeedback(null),650);
  }
  useEffect(() => { setGuess(5); }, [state.turnNumber, state.currentContent?.id, setGuess]);
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
      void act({ type: "completeTurn" });
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
    playSound("dice.mp3", 0.8);
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

  async function answerSpelling(result: "correct" | "wrong") {
    if (spellingFeedback) return;

    setAnsweredWord(state.currentContent?.prompt || "");
    setSpellingFeedback(result);

    if (result === "wrong") {
      playWrong();
    }

    // Update the score and prepare the next word immediately.
    // The answered word remains displayed during the animation.
    await act({
      type: result === "correct" ? "correct" : "pass",
      responseSeconds:spellingWordStartedAt.current?Number(((performance.now()-spellingWordStartedAt.current)/1000).toFixed(2)):0,
    });

    window.setTimeout(() => {
      if (result === "wrong") void act({ type: "completeTurn" });
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
      } ${
        game === "bomb" && state.phase === "playing" && seconds === 0
          ? "bomb-exploded"
          : ""
      } ${expansionFeedback?`expansion-feedback-${expansionFeedback}`:""
      } ${game==="bomb"?`bomb-mode-${state.bomb.mode}`:""}`}
    >
      <div className="game-heading">
        <span>{GAMES.find((g) => g.id === game)?.name}</span>
        {(host || state.timer.total > 0) && (
          <div className="timer-tools">
            {host&&<button className="restart-turn-button" onClick={onRestart}>Restart turn</button>}
            {host&&game!=="moji"&&!state.audienceLifelines[state.activeTeam]&&<button className="ask-crowd-button" onClick={()=>void askCrowd()}>Crowd</button>}
            {state.timer.total > 0 && <>
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
                {state.timer.running ? <><PauseIcon/> Pause</> : <><PlayIcon/> Resume</>}
              </button>
            )}
            {host&&game!=="bomb"&&<><button className="timer-adjust" onClick={()=>act({type:"adjustTimer",seconds:-15})}>−15s</button><button className="timer-adjust" onClick={()=>act({type:"adjustTimer",seconds:15})}>+15s</button><button className="timer-adjust" onClick={()=>act({type:"adjustTimer",seconds:state.timerDefaults[game]||60,set:true})}>Restart</button></>}
            </>}
            {host&&game!=="bomb"&&state.timer.total===0&&<button className="timer-control" onClick={()=>act({type:"adjustTimer",seconds:state.timerDefaults[game]||60,set:true})}>Start timer</button>}
          </div>
        )}
      </div>
      {lifelineSeconds>0&&<div className="ask-crowd-overlay"><span>Ask the Crowd</span><strong>{lifelineSeconds}</strong><p>Viewers: type your suggestions now!</p>{host&&<button onClick={()=>void closeCrowdHelp()}>Close &amp; resume</button>}</div>}
      {game === "spelling" && (
        <>
          <div className={`spelling-difficulty ${state.spelling.difficulty[state.activeTeam].toLowerCase()}`}>{state.spelling.difficulty[state.activeTeam]} · {state.spelling.difficulty[state.activeTeam]==="Easy"?5:state.spelling.difficulty[state.activeTeam]==="Medium"?10:15} points</div>
          <div className="hero-word spelling-word">
            {spellingFeedback ? answeredWord : state.currentContent?.prompt}
          </div>

          {host && (
            <button
              className="pronounce-button"
              disabled={Boolean(spellingFeedback)}
              onClick={() => speakWord(state.currentContent?.prompt || "",()=>{spellingWordStartedAt.current=performance.now()})}
            >
              <SpeakerIcon muted={false}/> Repeat word
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
                Correct +{state.spelling.difficulty[state.activeTeam]==="Easy"?5:state.spelling.difficulty[state.activeTeam]==="Medium"?10:15}
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
              <span key={word}><BanIcon/> {word}</span>
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
            <div className="actions music-actions"><button className="zero-control" onClick={() => act({ type: "musicConfirm", zero: true })}>0 points</button><button className="primary-control" onClick={() => act({ type: "musicConfirm" })}>Confirm round</button></div>
          )}
        </>
      )}
      {["finish_lyric","original_source","beat_intro"].includes(game) && (
        <>
          <div className="music-mode-count">Clip {state.musicRound.clip} of 5</div>
          <div className="music-prompt">{game==="finish_lyric"?"Play a song, pause it, and let the team finish the next line.":game==="original_source"?"Play the newer song. The team must identify its original source.":"Play the short intro. Extend it only if the team needs another clue."}</div>
          <div className="music-mode-guide">{game==="finish_lyric"?"Complete line = 10 · Half the line = 5":game==="original_source"?"Title + artist = 10 · Either one = 5":"Short intro = 10 · Extended intro = 5"}</div>
          {host&&<div className="actions music-mode-actions"><button onClick={()=>act({type:"musicModeScore",points:0})}>Don&apos;t know · 0</button><button onClick={()=>act({type:"musicModeScore",points:5})}>Partial · +5</button><button className="correct" onClick={()=>act({type:"musicModeScore",points:10})}>Correct · +10</button></div>}
        </>
      )}
      {game === "moji" && (
        <>
          <div className="round-counter">Puzzle {state.moji.card} of 5 · {state.moji.stage==="steal"?"STEAL":"20 POINTS"}</div>
          <div className="category">{state.currentContent?.category}</div>
          <div className="moji-sequence">{state.currentContent?.prompt}</div>
          {state.moji.hintShown&&<div className="moji-hint">Hint: {String(meta.hint??"")} · now worth 10 points</div>}
          {state.answerShown&&<div className="answer">{state.currentContent?.answer}</div>}
          {host&&<><div className="moji-tools"><button className="answer-control" onClick={()=>act({type:"revealAnswer"})}>Answer</button>{state.moji.stage==="guess"&&!state.moji.hintShown&&<button className="hint-control" onClick={()=>act({type:"mojiHint"})}>Hint</button>}{!state.audienceLifelines[state.activeTeam]&&<button className="ask-crowd-button" onClick={()=>void askCrowd()}>Crowd</button>}</div><div className="actions"><button onClick={()=>expansionAction({type:"mojiMiss"},"wrong")}>{state.moji.stage==="steal"?"No steal":"Incorrect / Pass"}</button><button className="correct" onClick={()=>expansionAction({type:"mojiCorrect"},"correct")}>Correct +{state.moji.stage==="steal"||state.moji.hintShown?10:20}</button></div></>}
        </>
      )}
      {game === "rapid_fire" && (
        <>
          <div className="round-counter">Question {state.rapidFire.question} of 10</div>
          <div className="category">{state.currentContent?.category}</div>
          <div className="question rapid-question">{state.currentContent?.prompt}</div>
          {state.answerShown&&<div className="answer">{state.currentContent?.answer}</div>}
          {host&&<button className="reveal" onClick={()=>act({type:"revealAnswer"})}>{state.answerShown?"Hide":"Show"} answer</button>}
          {host&&state.rapidFire.stage==="open"&&<div className="rapid-buzzers"><button className="team-a-buzzer" onClick={()=>act({type:"rapidBuzz",team:"A"})}>{state.teams.A.name} buzzed</button><button className="team-b-buzzer" onClick={()=>act({type:"rapidBuzz",team:"B"})}>{state.teams.B.name} buzzed</button><button className="no-buzz-button" onClick={()=>expansionAction({type:"rapidSkip"},"wrong")}>No buzz</button></div>}
          {state.rapidFire.stage!=="open"&&<div className="rapid-status">{state.rapidFire.stage==="steal"?`${state.teams[state.activeTeam].name} can steal`:`${state.teams[state.activeTeam].name} answers`}</div>}
          {host&&state.rapidFire.stage==="answer"&&<div className="actions"><button onClick={()=>expansionAction({type:"rapidWrong"},"wrong")}>Incorrect</button><button className="correct" onClick={()=>expansionAction({type:"rapidCorrect"},"correct")}>Correct +10</button></div>}
          {host&&state.rapidFire.stage==="steal"&&<div className="actions"><button onClick={()=>expansionAction({type:"rapidNoSteal"},"wrong")}>No steal</button><button className="correct" onClick={()=>expansionAction({type:"rapidCorrect"},"correct")}>Steal +5</button></div>}
        </>
      )}
      {game === "top_answers" && (
        <>
          <div className="question top-question">{state.currentContent?.prompt}</div>
          <div className="top-status"><b>Board {state.turnNumber} of 2 · {state.topAnswers.pot} points</b><span>{state.topAnswers.stage==="steal"?`${state.teams[state.activeTeam].name} has one steal guess`:`${state.teams[state.topAnswers.controlTeam].name} controls · ${state.topAnswers.strikes}/2 strikes`}</span></div>
          <div className="top-answer-board">{topAnswers.map((answer,index)=>{const revealed=state.topAnswers.revealed.includes(index);const finalReveal=state.topAnswers.stage==="steal"||state.topAnswers.revealed.length===topAnswers.length-1;return <button key={index} disabled={!host||revealed} className={revealed?"revealed":""} onClick={()=>expansionAction({type:state.topAnswers.stage==="steal"?"topStealSuccess":"topReveal",index},"correct",!finalReveal)}><b>{index+1}</b><span>{revealed||showTopKey?answer.text:"••••••"}</span><strong>{revealed?answer.points:""}</strong></button>})}</div>
          {host&&<div className="top-controls"><button className="answer-key-control" onClick={()=>setTopKeyFor(showTopKey?null:state.currentContent?.id??null)}>{showTopKey?"Hide":"Show"} host answer key</button>{state.topAnswers.stage==="play"?<button className="strike-control" onClick={()=>expansionAction({type:"topStrike"},"wrong")}>Strike ✕</button>:<button className="strike-control" onClick={()=>expansionAction({type:"topStealFail"},"wrong")}>Steal incorrect</button>}</div>}
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
                  onClick={() => act({ type: "completeWave" })}
                >
                  Complete turn
                </button>
              )}
            </>
          )}
        </>
      )}
      {game === "charades" && <>
        <div className="round-counter">Card {state.charades.card} of 5</div>
        {state.charades.stage==="reveal"?<><div className="category">Actors only · Guessers close your eyes</div><div className="charades-prompt">{state.currentContent?.prompt}</div><p className="physical-rule">No speaking, mouthing letters, spelling or pointing to written answers.</p>{host&&<button className="primary-control" onClick={()=>act({type:"charadesStart"})}>Hide word &amp; Start</button>}</>:state.charades.stage==="complete"?<><div className="charades-acting"><GameIcon game="charades"/><strong>ROUND COMPLETE</strong><span>{state.charades.card>=5?"That was the final card":"Ready when you are for the next card"}</span></div>{host&&<button className="primary-control" onClick={()=>act({type:"charadesNext"})}>{state.charades.card>=5?"Finish Charades":"Next question"}</button>}</>:<><div className="charades-acting"><GameIcon game="charades"/><strong>CHARADES IN PROGRESS</strong><span>Both teams guess · first correct answer wins</span></div>{host&&<div className="actions physical-actions"><button onClick={()=>expansionAction({type:"charadesSkip"},"wrong")}>Nobody / Skip</button><button className="team-a-buzzer" onClick={()=>expansionAction({type:"charadesAward",team:"A"},"correct",true)}>{state.teams.A.name} guessed</button><button className="team-b-buzzer" onClick={()=>expansionAction({type:"charadesAward",team:"B"},"correct",true)}>{state.teams.B.name} guessed</button></div>}</>}
      </>}
      {game === "five_alive" && <FiveAliveGame state={state} host={host} seconds={seconds} act={act}/>}
      {game === "scavenger" && <>
        <div className="round-counter">Challenge {state.scavenger.card} of 10</div><div className="category">Camera race</div><div className="scavenger-prompt">{state.currentContent?.prompt}</div><p className="physical-rule">Show a real, safe item clearly on camera. Images on another screen do not count.</p>
        {host&&<div className="actions physical-actions"><button onClick={()=>expansionAction({type:"scavengerSkip"},"wrong")}>Neither / Skip</button><button className="team-a-buzzer" onClick={()=>expansionAction({type:"scavengerAward",team:"A"},"correct",true)}>{state.teams.A.name} found it</button><button className="team-b-buzzer" onClick={()=>expansionAction({type:"scavengerAward",team:"B"},"correct",true)}>{state.teams.B.name} found it</button></div>}
      </>}
      {game === "bomb" && (
        <>
          {state.phase === "playing" ? (
            <>
              <div className="bomb-icon bomb-live"><GameIcon game="bomb" /></div>
              {state.bomb.mode==="veggies"?<div className="bomb-picture-card"><WikiProduceImage title={String(meta.wikipediaTitle??state.currentContent?.prompt??"")}/><small>Photo: Wikipedia / Wikimedia Commons</small></div>:<div className={`hero-word ${state.bomb.mode==="punctuation"?"punctuation-symbol":""}`}>{state.currentContent?.prompt}</div>}
              {state.bomb.mode==="punctuation"&&punctuationExample&&<div className="punctuation-example"><span>Example</span><strong>{punctuationExample}</strong></div>}
              {state.bomb.mode==="words"?<p className="rule"><strong>{selectedBombRule?.label}</strong> — {selectedBombRule?.description}{" "}<b>{state.currentContent?.prompt}</b></p>:<><div className="bomb-holder">Bomb holder: <strong>{state.teams[state.bomb.holder].name}</strong></div>{host&&seconds>0&&<div className="actions bomb-pass-actions"><button onClick={()=>act({type:"bombSkip"})}>Skip card</button><button className="correct" onClick={()=>act({type:"bombPass"})}>Correct · Pass Bomb</button></div>}</>}

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
                    {state.teams.A.name} held it
                  </button>

                  <button
                    onClick={() =>
                      act({
                        type: "bombResolve",
                        losingTeam: "B",
                      })
                    }
                  >
                    {state.teams.B.name} held it
                  </button>
                </div>
              )}
            </>
          ) : (
            state.bomb.mode==="words"?<>
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
            </>:<><div className="bomb-mode-preview"><span>{state.bomb.mode==="veggies"?"Produce Bomb":"Punctuation Bomb"}</span>{state.bomb.mode==="veggies"?<div className="bomb-picture-card"><WikiProduceImage title={String(meta.wikipediaTitle??state.currentContent?.prompt??"")}/></div>:<><div className="punctuation-symbol preview">{state.currentContent?.prompt}</div>{punctuationExample&&<div className="punctuation-example preview-example"><span>Example</span><strong>{punctuationExample}</strong></div>}</>}<p>Name it correctly, then pass the bomb. The fuse duration stays hidden.</p></div>{host&&<button className="primary-control" onClick={()=>act({type:"bombStart"})}>Start Bomb</button>}</>
          )}
        </>
      )}
    </div>
  );
}

function SpeakerIcon({muted}:{muted:boolean}) {
  return <svg className="speaker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{muted?<><path d="m16 9 5 6"/><path d="m21 9-5 6"/></>:<><path d="M15 8.5a5 5 0 0 1 0 7"/><path d="M18 5.5a9 9 0 0 1 0 13"/></>}</svg>;
}

function GearIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.18.38.48.7.86.9.3.16.64.23.98.2H21v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/></svg>}
function PauseIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>}
function PlayIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 4 13 8-13 8V4Z"/></svg>}
function BanIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/></svg>}

function FiveAliveGame({state,host,seconds,act}:{state:GameState;host:boolean;seconds:number;act:(a:Record<string,unknown>)=>Promise<void>}){
  const fa=state.fiveAlive, offset=fa.side==="A"?0:5, items=fa.items.slice(offset,offset+5), solved=state.turnNumber===1?fa.solvedA:fa.solvedB;
  return <div className="five-alive-game">
    <div className="five-alive-heading"><span className="setup-kicker">{state.teams[state.activeTeam].name} · {fa.stage==="complete"?"ROUND COMPLETE":"30 SECOND ROUND"}</span><h1>FIVE ALIVE</h1><span className="five-alive-score">{solved.length}/10</span></div>
    <div className={`five-alive-card ${fa.side==="B"?"side-b":"side-a"}`}>
      <div className="five-alive-card-top"><b>SIDE {fa.side}</b><span>{solved.length}/10 GUESSED</span></div>
      <ol>{items.map((item,index)=>{const globalIndex=offset+index,isSolved=solved.includes(globalIndex);return <li key={item.id} className={isSolved?"solved":""}><button disabled={!host||fa.stage!=="playing"} onClick={()=>act({type:"fiveAliveToggle",index})}><span>{index+1}</span><strong>{item.prompt}</strong>{isSolved&&<em>✓</em>}</button></li>})}</ol>
      <button className="five-alive-flip" disabled={!host} onClick={()=>act({type:"fiveAliveFlip"})}>↻ Flip card</button>
    </div>
    <p className="physical-rule">Describe the answers without saying any part of the answer, spelling it, giving the first letter, or directly translating it. Flip between both sides whenever you want.</p>
    {fa.stage==="ready"&&host&&<button className="primary-control" onClick={()=>act({type:"fiveAliveStart"})}>Start 30 seconds</button>}
    {fa.stage==="complete"&&<><div className="five-alive-result"><b>TIME / CARD COMPLETE</b><strong>{solved.length}/10 · +{solved.length*5} points</strong></div>{host&&<button className="primary-control" onClick={()=>act({type:"fiveAliveFinish"})}>{state.turnNumber===1?`Finish ${state.teams[state.activeTeam].name}'s round`:"Finish Five Alive"}</button>}</>}
  </div>;
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
  if (["music","finish_lyric","original_source","beat_intro"].includes(game))
    return <svg className="game-icon" {...common}><path d="M27 45V16l26-5v28"/><path d="M27 22 53 17"/><ellipse cx="19" cy="46" rx="8" ry="6"/><ellipse cx="45" cy="40" rx="8" ry="6"/></svg>;
  if (game === "password")
    return <svg className="game-icon" {...common}><circle cx="22" cy="28" r="11"/><path d="m31 35 20 20m-8-8 6-6m-13-1 6-6"/></svg>;
  if (game === "bomb")
    return <svg className="game-icon" {...common}><circle cx="30" cy="37" r="18"/><path d="m42 24 7-8m-14 4 5-7m8 5 5 4"/><path d="M23 31h14"/></svg>;
  if (game === "trivia")
    return <svg className="game-icon" {...common}><path d="m7 25 25-13 25 13-25 13L7 25Z"/><path d="M17 32v11c9 7 21 7 30 0V32m10-7v18"/></svg>;
  if (game === "top_answers")
    return <svg className="game-icon" {...common}><rect x="9" y="11" width="46" height="42" rx="6"/><path d="M17 22h30M17 32h24M17 42h17"/><circle cx="49" cy="42" r="2" fill="currentColor" stroke="none"/></svg>;
  if (game === "moji")
    return <svg className="game-icon" {...common}><circle cx="32" cy="32" r="23"/><circle cx="24" cy="27" r="2.5" fill="currentColor" stroke="none"/><circle cx="40" cy="27" r="2.5" fill="currentColor" stroke="none"/><path d="M20 38c7 8 17 8 24 0"/></svg>;
  if (game === "rapid_fire")
    return <svg className="game-icon" {...common}><path d="M36 8 15 36h16l-3 20 21-29H34l2-19Z"/><path d="M8 18h13M6 27h10M10 46h11"/></svg>;
  if(game==="charades")
    return <svg className="game-icon" {...common}><circle cx="32" cy="15" r="7"/><path d="M32 22v17m0-10-14 8m14-8 14 8M32 39 20 55m12-16 13 16"/></svg>;
  if(game==="five_alive")
    return <svg className="game-icon" {...common}><rect x="10" y="8" width="44" height="48" rx="7"/><circle cx="20" cy="19" r="2.5" fill="currentColor" stroke="none"/><circle cx="20" cy="28" r="2.5" fill="currentColor" stroke="none"/><circle cx="20" cy="37" r="2.5" fill="currentColor" stroke="none"/><circle cx="20" cy="46" r="2.5" fill="currentColor" stroke="none"/><path d="M28 19h16M28 28h16M28 37h16M28 46h16"/></svg>;
  if(game==="scavenger")
    return <svg className="game-icon" {...common}><circle cx="25" cy="25" r="14"/><path d="m35 35 17 17M12 52h26M18 45h14"/><path d="M21 20h8M25 16v8"/></svg>;
  if (game === "wavelength")
    return <svg className="game-icon" {...common}><path d="M8 38c7-18 14 18 22 0s15 18 26-8"/><path d="M8 22h48M8 50h48"/></svg>;
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

let sharedAudioContext: AudioContext | null = null;
function audioContext() {
  sharedAudioContext ??= new window.AudioContext();
  if (sharedAudioContext.state === "suspended") void sharedAudioContext.resume();
  return sharedAudioContext;
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
function getLobbyAudio(){const audio=gameSounds["lobby.mp3"]??(gameSounds["lobby.mp3"]=new Audio("/sounds/lobby.mp3"));audio.loop=true;return audio;}

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
function speakWord(word: string,onEnd?:()=>void) {
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
  utterance.onend=()=>onEnd?.();
  utterance.onerror=()=>onEnd?.();
  synth.speak(utterance);
}
