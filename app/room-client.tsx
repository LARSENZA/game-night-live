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
  const [exitConfirmOpen,setExitConfirmOpen]=useState(false);
  const [transitionMessage,setTransitionMessage]=useState("");
  const [transitionLeaving,setTransitionLeaving]=useState(false);
  const [lobbyVolume,setLobbyVolume]=useState(0.22);
  const previousScore = useRef<{ A: number; B: number } | null>(null);
  const suppressScoreSoundUntil = useRef(0);
  const previousSpokenWord = useRef("");
  const serverClockOffset = useRef(0);

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
      if (key === "f")
        void (document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen());
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [role]);

  useEffect(()=>{if(role!=="host")return;const audio=getLobbyAudio();audio.volume=lobbyVolume;const lobby=room?.state.phase==="lobby";if(soundReady&&!ambientMuted&&lobby)void audio.play().catch(()=>{});else{audio.pause();audio.currentTime=0;}return()=>audio.pause();},[role,room?.state.phase,soundReady,ambientMuted,lobbyVolume]);

  async function act(action: Record<string, unknown>) {
    if (action.type === "addPoints" || action.type === "setScore")
      suppressScoreSoundUntil.current = Date.now() + 2000;
    const token = localStorage.getItem(`host-token:${code}`);
    if (!token)
      return setError("This browser does not have the host key for this room.");
    const requestStarted = Date.now();
    const transitionTypes=["configureEvent","selectGame","beginGame","nextGame","editEvent"];
    const hasTransition=transitionTypes.includes(String(action.type));
    if(hasTransition){setTransitionLeaving(false);setTransitionMessage(action.type==="beginGame"?"GET READY…":action.type==="nextGame"?"LOADING NEXT GAME…":"SETTING UP GAME NIGHT…")}
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

  return (
    <main
      className={`room-shell ${role} ${controlsHidden ? "controls-hidden" : ""}`}
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
          <div className="header-actions">{role==="host"&&<><button className="ambient-button" aria-label={ambientMuted?"Turn clock and lobby music on":"Mute clock and lobby music"} title={ambientMuted?"Clock and lobby music off":"Clock and lobby music on"} onClick={()=>setAmbientMuted(value=>!value)}><SpeakerIcon muted={ambientMuted}/></button><button className="main-menu-button" onClick={exitGame}>Main menu</button><button className="settings-button" aria-label="Open settings" onClick={()=>setSettingsOpen(true)}><GearIcon/></button></>}</div>
        </header>
      )}
      {state.eventStarted&&<Scoreboard state={state} host={hostControls} act={act} />}
      <section className="game-stage">
        {state.phase==="eventComplete"?<EventComplete state={state} host={hostControls} onNewGame={()=>router.push("/")} onReview={()=>setReviewOpen(true)}/>:!state.eventConfigured?(
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
      {settingsOpen&&<SettingsPanel code={code} soundReady={soundReady} setSoundReady={setSoundReady} lobbyVolume={lobbyVolume} setLobbyVolume={setLobbyVolume} close={()=>setSettingsOpen(false)} fullscreen={toggleFullscreen} broadcast={()=>{setControlsHidden(true);setSettingsOpen(false)}} review={()=>{setReviewOpen(true);setSettingsOpen(false)}} leaderboard={()=>{setLeaderboardOpen(true);setSettingsOpen(false)}} content={()=>router.push(`/host/${code}/content`)} mainMenu={exitGame} newSeason={()=>{setSeasonOpen(true);setSettingsOpen(false)}}/>}
      {seasonOpen&&<NewSeasonPanel close={()=>setSeasonOpen(false)}/>} 
      {exitConfirmOpen&&<ExitConfirmPanel cancel={()=>setExitConfirmOpen(false)} continueExit={()=>router.push("/")}/>} 
      {transitionMessage&&<div className={`transition-screen ${transitionLeaving?"leaving":""}`}><div className="transition-emblem">GN</div><div className="loading-bar"><span/></div><strong>{transitionMessage}</strong></div>}
    </main>
  );
}

function LobbySetup({state,host,act,onBack}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>;onBack:()=>void}){const [games,setGames]=useState<GameType[]>(state.selectedGames);return <div className="setup-card lobby-setup"><span className="setup-kicker">Create game night</span><h1>Set up your teams</h1><p>Choose team names, who plays first, and the games for tonight.</p><div className="lobby-teams">{(["A","B"] as TeamKey[]).map(team=><article key={team} className={state.startingTeam===team?"selected":""}><TeamNameEditor team={team} state={state} act={act}/><button disabled={!host} onClick={()=>act({type:"setActiveTeam",team})}>{state.startingTeam===team?`${state.teams[team].name} · PLAYING FIRST`:"Choose to play first"}</button></article>)}</div><h2>Choose your games</h2><div className="event-game-grid">{GAMES.map(g=><button key={g.id} className={games.includes(g.id)?"selected":""} onClick={()=>setGames(v=>v.includes(g.id)?v.filter(x=>x!==g.id):[...v,g.id])}><GameIcon game={g.id}/>{g.name}</button>)}</div>{host&&<div className="flow-actions"><button onClick={onBack}>Back</button><button className="primary-control" disabled={!games.length} onClick={()=>act({type:"configureEvent",games})}>Continue</button></div>}</div>}
function GameChoice({state,host,pending,setPending,onBack,onContinue}:{state:GameState;host:boolean;pending:GameType|null;setPending:(g:GameType|null)=>void;onBack?:()=>void;onContinue:()=>void}){const remainingGames=state.selectedGames.filter(g=>!state.completedGames.includes(g));useEffect(()=>{if(pending&&!remainingGames.includes(pending))setPending(null)},[state.completedGames.join(","),state.selectedGames.join(",")]);return <div className="setup-card game-choice"><span className="setup-kicker">Game Night ZA</span><h1>Choose a game</h1><p>{state.eventStarted?"Choose from the games still left to play.":"Choose the first game to begin."}</p><div className="event-game-grid">{remainingGames.map(id=>{const g=GAMES.find(item=>item.id===id)!;return <button key={id} className={pending===id?"selected":""} onClick={()=>setPending(id)}><GameIcon game={id}/>{g.name}</button>})}</div>{host&&<div className="flow-actions">{onBack&&<button onClick={onBack}>Back</button>}<button className="primary-control" disabled={!pending} onClick={onContinue}>Continue</button></div>}</div>}
function EventComplete({state,host,onNewGame,onReview}:{state:GameState;host:boolean;onNewGame:()=>void;onReview:()=>void}){const a=state.teams.A.score,b=state.teams.B.score;return <div className="round-summary event-complete"><span className="setup-kicker">Game night complete</span><h1>{a===b?"It’s a draw!":`${a>b?state.teams.A.name:state.teams.B.name} wins!`}</h1><div className="match-points"><b>{state.teams.A.name}<strong>{a}</strong></b><b>{state.teams.B.name}<strong>{b}</strong></b></div>{host&&<div className="summary-actions"><button onClick={onReview}>Review game</button><button className="primary-control" onClick={onNewGame}>New game</button></div>}</div>}
function SettingsPanel(p:{code:string;soundReady:boolean;setSoundReady:(v:boolean)=>void;lobbyVolume:number;setLobbyVolume:(v:number)=>void;close:()=>void;fullscreen:()=>void;broadcast:()=>void;review:()=>void;leaderboard:()=>void;content:()=>void;mainMenu:()=>void;newSeason:()=>void}){return <div className="review-backdrop" role="dialog" aria-modal="true" onClick={p.close}><section className="review-panel settings-panel" onClick={e=>e.stopPropagation()}><header><div><span className="setup-kicker">Game Night ZA</span><h2>Settings</h2></div><button onClick={p.close}>Close</button></header><div className="settings-list"><button onClick={p.fullscreen}>Fullscreen <kbd>F</kbd></button><button onClick={p.broadcast}>Broadcast mode <kbd>H</kbd></button><button onClick={p.review}>Review</button><button onClick={p.leaderboard}>Leaderboard</button><button onClick={p.content}>Content</button><button className="sound-button" onClick={()=>p.setSoundReady(!p.soundReady)}>Sound {p.soundReady?"on":"off"}</button><label>Lobby music volume<input type="range" min="0" max="0.6" step="0.02" value={p.lobbyVolume} onChange={e=>p.setLobbyVolume(Number(e.target.value))}/></label><div className="settings-room">ROOM <strong>{p.code}</strong><button onClick={()=>navigator.clipboard.writeText(p.code)}>Copy</button></div><hr/><button onClick={p.mainMenu}>Main menu</button><button className="danger" onClick={p.newSeason}>Start new season</button></div></section></div>}
function ExitConfirmPanel({cancel,continueExit}:{cancel:()=>void;continueExit:()=>void}){return <div className="review-backdrop exit-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="exit-confirm-title" onClick={cancel}><section className="review-panel confirm-panel" onClick={e=>e.stopPropagation()}><span className="setup-kicker">Leave game night?</span><h2 id="exit-confirm-title">Return to the start screen?</h2><p>Your current room will remain unchanged, but starting again from the main menu creates a new room.</p><div className="confirm-actions"><button onClick={cancel}>Cancel</button><button className="primary-control" onClick={continueExit}>Continue</button></div></section></div>}
function NewSeasonPanel({close}:{close:()=>void}){const [key,setKey]=useState(""),[confirmation,setConfirmation]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);async function reset(){setBusy(true);const r=await fetch("/api/admin/start-new-season",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,confirmation})});const d=await r.json();setBusy(false);setMessage(d.error||d.message);if(r.ok)setTimeout(()=>location.reload(),900)}return <div className="review-backdrop" role="dialog" aria-modal="true"><section className="review-panel season-panel"><header><div><span className="setup-kicker">Danger zone</span><h2>Start new season</h2></div><button onClick={close}>Close</button></header><p>This clears standings, matches, reviews and usage history for everyone. Questions remain untouched.</p><label>Administrator PIN<input type="password" value={key} onChange={e=>setKey(e.target.value)}/></label><label>Type <b>START NEW SEASON</b><input value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>{message&&<p>{message}</p>}<button className="danger primary-control" disabled={busy||confirmation!=="START NEW SEASON"||!key} onClick={reset}>{busy?"Resetting…":"Start new season"}</button></section></div>}

function SetupScreen({state,host,act}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>}) {
  const title=GAMES.find(g=>g.id===state.currentGame)?.name;
  return <div className="setup-card">
    <span className="setup-kicker">Ready to play</span><GameIcon game={state.currentGame!}/><h1>{title}</h1>
    <p>Content and timers stay hidden until the host starts the game.</p>
    <div className="playing-team-banner">{state.teams[state.startingTeam].name} · PLAYING FIRST</div>
    {host&&<button className="primary-control start-match" onClick={()=>act({type:"beginGame"})}>Start {title}</button>}
  </div>;
}

function TurnComplete({state,host,act}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>}) {
  const next=state.startingTeam==="A"?"B":"A";
  return <div className="round-summary"><span className="setup-kicker">First turn complete</span><h1>{state.teams[state.activeTeam].name}</h1><p>Next up: <strong>{state.teams[next].name}</strong></p>{host&&<button className="primary-control" onClick={()=>act({type:"nextTeam"})}>Start {state.teams[next].name}&apos;s turn</button>}</div>;
}

function MatchComplete({state,host,act,onReview}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>Promise<void>;onReview:()=>void}) {
  const a=state.teams.A.score-state.matchStartScores.A,b=state.teams.B.score-state.matchStartScores.B;
  return <div className="round-summary match-complete"><span className="setup-kicker">Game complete</span><h1>{a===b?"It’s a draw!":`${a>b?state.teams.A.name:state.teams.B.name} wins!`}</h1><div className="match-points"><b>{state.teams.A.name}<strong>+{a}</strong></b><b>{state.teams.B.name}<strong>+{b}</strong></b></div>{host&&<div className="summary-actions"><button onClick={onReview}>Review answers</button><button className="primary-control" onClick={()=>act({type:"nextGame"})}>Next game</button></div>}</div>;
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

function TeamNameEditor({team,state,act}:{team:TeamKey;state:GameState;act:(a:Record<string,unknown>)=>Promise<void>}){const [draft,setDraft]=useState(state.teams[team].name),[note,setNote]=useState("");useEffect(()=>setDraft(state.teams[team].name),[state.teams[team].name]);async function save(){const name=draft.trim().replace(/\s+/g," ");if(!name)return setNote("Enter a team name.");if(name.toLowerCase()===state.teams[team==="A"?"B":"A"].name.toLowerCase())return setNote("Both sides cannot use the same team.");const response=await fetch(`/api/leaderboard?name=${encodeURIComponent(name)}`,{cache:"no-store"}),data=await response.json();setNote(data.teams?.length?"Existing leaderboard team selected.":"New team ready.");await act({type:"renameTeam",team,name});}return <div className="team-name-editor" onClick={e=>e.stopPropagation()}><input className="team-name-input" value={draft} maxLength={24} aria-label={`${team} team name`} onChange={e=>setDraft(e.target.value)} onBlur={()=>void save()} onKeyDown={e=>{if(e.key==="Enter")void save()}}/>{note&&<small>{note}</small>}</div>}

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
                {state.timer.running ? <><PauseIcon/> Pause</> : <><PlayIcon/> Resume</>}
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

function SpeakerIcon({muted}:{muted:boolean}) {
  return <svg className="speaker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{muted?<><path d="m16 9 5 6"/><path d="m21 9-5 6"/></>:<><path d="M15 8.5a5 5 0 0 1 0 7"/><path d="M18 5.5a9 9 0 0 1 0 13"/></>}</svg>;
}

function GearIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.18.38.48.7.86.9.3.16.64.23.98.2H21v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/></svg>}
function PauseIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>}
function PlayIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 4 13 8-13 8V4Z"/></svg>}
function BanIcon(){return <svg className="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/></svg>}

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
