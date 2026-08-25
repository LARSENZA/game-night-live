"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameState, GameType, RoomPayload, TeamKey } from "@/lib/types";

const GAMES: {id:GameType; icon:string; name:string}[] = [
  {id:"spelling",icon:"🔤",name:"Spelling Bee"},{id:"taboo",icon:"🙊",name:"Taboo"},{id:"music",icon:"🎵",name:"Music Round"},{id:"password",icon:"🔑",name:"Password"},{id:"bomb",icon:"💣",name:"Bomb"},{id:"trivia",icon:"🎓",name:"Fifth Grader"},{id:"wavelength",icon:"📡",name:"Wavelength"},
];

function metadata(state:GameState) { try { return JSON.parse(state.currentContent?.metadata || "{}"); } catch { return {}; } }
function remaining(state:GameState, now:number) { return state.timer.running && state.timer.endsAt && now ? Math.max(0, Math.ceil((state.timer.endsAt-now)/1000)) : 0; }
function formatTime(seconds:number) { return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`; }

export function RoomClient({ code, role }:{ code:string; role:"host"|"display" }) {
  const router = useRouter();
  const [room,setRoom] = useState<RoomPayload|null>(null);
  const [error,setError] = useState("");
  const [now,setNow] = useState(0);
  const [clue,setClue] = useState("");
  const [guess,setGuess] = useState(5);
  const [soundReady,setSoundReady] = useState(role==="host");
  const [gamePickerOpen,setGamePickerOpen] = useState(true);
  const [controlsHidden,setControlsHidden] = useState(false);
  const [isFullscreen,setIsFullscreen] = useState(false);
  const previousScore = useRef<{A:number;B:number}|null>(null);
  const previousTick = useRef<number|null>(null);

  const load = useCallback(async()=>{
    try {
      const response = await fetch(`/api/rooms/${code}`, { cache:"no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Room unavailable");
      setRoom(data); setError("");
    } catch(e) { setError(e instanceof Error?e.message:"Room unavailable"); }
  },[code]);

  useEffect(()=>{ const initial=setTimeout(()=>{void load();setNow(Date.now())},0); const poll=setInterval(load,800); const clock=setInterval(()=>setNow(Date.now()),250); return()=>{clearTimeout(initial);clearInterval(poll);clearInterval(clock)}; },[load]);
  useEffect(()=>{
    if(!room) return;
    const prev=previousScore.current, next={A:room.state.teams.A.score,B:room.state.teams.B.score};
    if(soundReady&&prev && (next.A>prev.A||next.B>prev.B)) playSuccess();
    previousScore.current=next;
  },[room,soundReady]);

  const tickSeconds = room ? remaining(room.state,now) : 0;
  useEffect(()=>{
    if(!room||!room.state.timer.running||tickSeconds<=0) return;
    if(previousTick.current!==tickSeconds) {
      previousTick.current=tickSeconds;
      if(soundReady&&(room.state.currentGame==="wavelength"||room.state.currentGame==="bomb")) playTick(tickSeconds<=10);
    }
  },[tickSeconds,room,soundReady]);

  useEffect(()=>{
    const update=()=>setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange",update);
    return()=>document.removeEventListener("fullscreenchange",update);
  },[]);

  useEffect(()=>{
    if(role!=="host") return;
    const shortcut=(event:KeyboardEvent)=>{
      const target=event.target as HTMLElement|null;
      if(target&&["INPUT","TEXTAREA","SELECT"].includes(target.tagName)) return;
      const key=event.key.toLowerCase();
      if(key==="h") setControlsHidden(value=>!value);
      if(key==="g") setGamePickerOpen(value=>!value);
      if(key==="f") void (document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen());
    };
    window.addEventListener("keydown",shortcut);
    return()=>window.removeEventListener("keydown",shortcut);
  },[role]);

  async function act(action:Record<string,unknown>) {
    const token=localStorage.getItem(`host-token:${code}`);
    if(!token) return setError("This browser does not have the host key for this room.");
    const response=await fetch(`/api/rooms/${code}/actions`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${token}`},body:JSON.stringify(action)});
    const data=await response.json(); if(!response.ok) return setError(data.error||"Action failed"); setRoom(data);
  }

  if(error&&!room) return <main className="center-state"><h1>Room unavailable</h1><p>{error}</p><button onClick={()=>router.push("/")}>Back home</button></main>;
  if(!room) return <main className="center-state"><div className="spinner"/><p>Connecting to room {code}…</p></main>;
  const state=room.state, meta=metadata(state), seconds=remaining(state,now);

  const hostControls=role==="host"&&!controlsHidden;
  const toggleFullscreen=()=>void (document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen());

  return <main className={`room-shell ${role} ${controlsHidden?"controls-hidden":""}`}>
    {!controlsHidden&&<header className="room-header">
      <div className="host-nav"><button className="ghost" onClick={()=>router.push("/")}>← Home</button>{role==="host"&&<button className="ghost" onClick={()=>router.push(`/host/${code}/content`)}>Content</button>}</div>
      <div className="room-brand">GAME <b>NIGHT</b> LIVE</div>
      <div className="header-actions"><button className="sound-button" onClick={()=>{setSoundReady(value=>!value);playTick(false)}}>{soundReady?"🔊 Sound on":"🔇 Sound off"}</button><div className="room-code">ROOM <strong>{code}</strong></div></div>
    </header>}
    <Scoreboard state={state} host={hostControls} act={act}/>
    {role==="host"&&!controlsHidden&&<div className="stream-toolbar"><button onClick={()=>setGamePickerOpen(value=>!value)}>🎲 {gamePickerOpen?"Hide games":"Choose game"} <kbd>G</kbd></button><button onClick={toggleFullscreen}>{isFullscreen?"↙ Exit fullscreen":"⛶ Fullscreen"} <kbd>F</kbd></button><button onClick={()=>setControlsHidden(true)}>◉ Hide controls <kbd>H</kbd></button></div>}
    {role==="host"&&!controlsHidden&&gamePickerOpen&&<nav className="game-tabs">{GAMES.map(g=><button key={g.id} className={state.currentGame===g.id?"selected":""} onClick={()=>{void act({type:"startGame",game:g.id});setGamePickerOpen(false)}}><span>{g.icon}</span>{g.name}</button>)}</nav>}
    <section className="game-stage">
      {!state.currentGame ? <div className="waiting"><div>🎲</div><h2>Choose a game</h2><p>Use the game picker above to begin.</p></div> : <GameView state={state} meta={meta} seconds={seconds} host={hostControls} act={act} clue={clue} setClue={setClue} guess={guess} setGuess={setGuess}/>} 
    </section>
    {role==="host"&&controlsHidden&&<button className="floating-controls" onClick={()=>setControlsHidden(false)}>Show controls <kbd>H</kbd></button>}
    {error&&<div className="toast error">{error}</div>}
  </main>;
}

function Scoreboard({state,host,act}:{state:GameState;host:boolean;act:(a:Record<string,unknown>)=>void}) {
  return <section className="scoreboard">{(["A","B"] as TeamKey[]).map(team=><article key={team} className={state.activeTeam===team?"active":""} onClick={()=>host&&act({type:"setActiveTeam",team})}>
    {host?<input className="team-name-input" value={state.teams[team].name} onClick={e=>e.stopPropagation()} onChange={e=>act({type:"renameTeam",team,name:e.target.value})}/>:<span className="team-name">{state.teams[team].name}</span>}
    {host?<input className="score-input" type="number" step="5" min="0" value={state.teams[team].score} onClick={e=>e.stopPropagation()} onChange={e=>act({type:"setScore",team,score:e.target.value})}/>:<strong>{state.teams[team].score}</strong>}
    {host&&<div className="score-buttons" onClick={e=>e.stopPropagation()}><button onClick={()=>act({type:"addPoints",team,points:-5})}>−5</button><button onClick={()=>act({type:"addPoints",team,points:5})}>+5</button></div>}
  </article>)}</section>;
}

function GameView({state,meta,seconds,host,act,clue,setClue,guess,setGuess}:{state:GameState;meta:Record<string,unknown>;seconds:number;host:boolean;act:(a:Record<string,unknown>)=>void;clue:string;setClue:(v:string)=>void;guess:number;setGuess:(v:number)=>void}) {
  const game=state.currentGame!;
  return <div className={`game-panel ${game}`}>
    <div className="game-heading"><span>{GAMES.find(g=>g.id===game)?.name}</span>{state.timer.total>0&&<div className={`timer ${seconds<=10&&seconds>0?"urgent":""}`}>{formatTime(seconds)}</div>}</div>
    {game==="spelling"&&<><div className="hero-word">{state.currentContent?.prompt}</div>{host&&<Actions act={act}/>}</>}
    {game==="taboo"&&<><div className="hero-word">{state.currentContent?.prompt}</div><div className="taboo-list">{((meta.taboo as string[])||[]).map(w=><span key={w}>🚫 {w}</span>)}</div>{host&&<Actions act={act}/>}</>}
    {game==="trivia"&&<><div className="category">{state.currentContent?.category}</div><div className="question">{state.currentContent?.prompt}</div>{state.answerShown&&<div className="answer">{state.currentContent?.answer}</div>}{host&&<><button className="reveal" onClick={()=>act({type:"revealAnswer"})}>{state.answerShown?"Hide":"Show"} answer</button><Actions act={act}/></>}</>}
    {game==="password"&&<>{state.phase!=="guess"?<><div className="category">Secret word</div><div className="hero-word">{state.currentContent?.prompt}</div><div className="clue-progress">{[0,1,2].map(i=><span key={i} className={state.passwordClues.length>i?"done":""}>{i+1}</span>)}</div>{host&&<form className="clue-form" onSubmit={e=>{e.preventDefault();act({type:"passwordClue",clue});setClue("")}}><input value={clue} onChange={e=>setClue(e.target.value)} placeholder={`Type clue ${state.passwordClues.length+1}`} /><button>Lock clue</button></form>}</>:<><div className="category">Player 4 · Final guess</div><div className="hero-word hidden">HIDDEN</div><div className="revealed-clues">{state.passwordClues.map((c,i)=><span key={i}>{i+1}. {c}</span>)}</div>{host&&<Actions act={act}/>}</>}</>}
    {game==="music"&&<><div className="music-prompt">Play your own song now</div><div className="music-grid">{([['title','Got the title',10],['artist','Got the artist',10],['lyrics','Sang 2+ lines',30]] as const).map(([key,label,pts])=><button disabled={!host} className={state.musicPoints[key]?"on":""} key={key} onClick={()=>act({type:"musicToggle",key})}><span>{label}</span><b>+{pts}</b></button>)}</div>{host&&<button className="primary-control" onClick={()=>act({type:"musicConfirm"})}>Confirm round</button>}</>}
    {game==="wavelength"&&<>{state.phase==="playing"?<><div className="question">{state.currentContent?.prompt}</div><Scale meta={meta}/><div className="wave-target">{state.wavelength.target}</div>{host&&<button className="primary-control" onClick={()=>act({type:"waveHide"})}>Hide target · start 60s</button>}</>:state.phase==="guess"?<><div className="question">{state.currentContent?.prompt}</div><Scale meta={meta}/>{host?<><input className="range" type="range" min="0" max="10" value={guess} onChange={e=>setGuess(Number(e.target.value))}/><div className="wave-target">{guess}</div><button className="primary-control" onClick={()=>act({type:"waveGuess",guess})}>Lock guess</button></>:<div className="hero-word hidden">TARGET HIDDEN</div>}</>:<><div className="result-row"><div><span>Guess</span><b>{state.wavelength.guess}</b></div><div><span>Target</span><b>{state.wavelength.target}</b></div><div><span>Points</span><b>{state.wavelength.points}</b></div></div>{host&&<button className="primary-control" onClick={()=>act({type:"next"})}>Next round</button>}</>}</>}
    {game==="bomb"&&<>{state.phase==="playing"?<><div className="bomb-icon">💣</div><div className="hero-word">{state.currentContent?.prompt}</div><p className="rule">{state.bomb.rule==="tick"?"Word cannot start with":state.bomb.rule==="bomb"?"Word cannot end with":"Letters can appear anywhere"} <b>{state.currentContent?.prompt}</b></p>{seconds===0&&<div className="boom">BOOM!</div>}{host&&seconds===0&&<div className="actions"><button onClick={()=>act({type:"bombResolve",losingTeam:"A"})}>Team A held it</button><button onClick={()=>act({type:"bombResolve",losingTeam:"B"})}>Team B held it</button></div>}</>:<><div className="bomb-icon">🎲</div>{state.bomb.rule&&<p className="rule">Rule ready · fuse is hidden</p>}{host&&<button className="primary-control" onClick={()=>state.bomb.rule?act({type:"bombStart"}):act({type:"bombRoll"})}>{state.bomb.rule?"Start bomb":"Roll rule"}</button>}</>}</>}
  </div>;
}

function Scale({meta}:{meta:Record<string,unknown>}) { return <div className="scale"><span>0 · {String(meta.low||"low")}</span><span>10 · {String(meta.high||"high")}</span></div> }
function Actions({act}:{act:(a:Record<string,unknown>)=>void}) { return <div className="actions"><button onClick={()=>{playWrong();act({type:"pass"})}}>Pass</button><button className="correct" onClick={()=>{playSuccess();act({type:"correct"})}}>Correct +10</button></div> }

function audioContext(){return new window.AudioContext()}
function noiseBurst(c:AudioContext,time:number,duration:number,frequency:number,gainValue:number){const length=Math.max(1,Math.floor(c.sampleRate*duration)),buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=buffer;filter.type="bandpass";filter.frequency.value=frequency;filter.Q.value=.85;gain.gain.setValueAtTime(gainValue,time);gain.gain.exponentialRampToValueAtTime(.001,time+duration);source.connect(filter);filter.connect(gain);gain.connect(c.destination);source.start(time);source.stop(time+duration)}
function playSuccess(){try{const c=audioContext(),n=c.currentTime;[0,.06,.13,.21,.3,.41,.54,.69,.86].forEach(offset=>{const t=n+offset+Math.random()*.015;noiseBurst(c,t,.045,900+Math.random()*500,.18+Math.random()*.1);noiseBurst(c,t+.012,.08,1800+Math.random()*900,.25+Math.random()*.12)})}catch{}}
function playWrong(){try{const c=audioContext(),n=c.currentTime;[185,92.5].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type=i?"square":"sawtooth";o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*.72,n+.55);g.gain.setValueAtTime(.16,n);g.gain.exponentialRampToValueAtTime(.001,n+.58);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+.6)})}catch{}}
function playTick(urgent:boolean){try{const c=audioContext(),n=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(urgent?1250:920,n);o.frequency.exponentialRampToValueAtTime(urgent?780:610,n+.045);g.gain.setValueAtTime(urgent?.18:.09,n);g.gain.exponentialRampToValueAtTime(.001,n+.055);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+.06)}catch{}}
