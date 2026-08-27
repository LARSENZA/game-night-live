import { and, eq, isNull, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contentUsage, eventTeams, gameContent, gameSessions, roomContentSettings, rooms, rounds } from "@/db/schema";
import { DEFAULT_CONTENT } from "./default-content";
import { ContentItem, GameState, GameType, ReviewItem, TeamKey, initialState } from "./types";

export async function hashToken(token:string){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");}
export function randomToken(){return Array.from(crypto.getRandomValues(new Uint8Array(24)),b=>b.toString(16).padStart(2,"0")).join("");}
export function randomCode(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>c[b%c.length]).join("");}

export function hydrateState(raw:Partial<GameState>):GameState {
  const base=initialState();
  return {...base,...raw,teams:{...base.teams,...raw.teams},timer:{...base.timer,...raw.timer},bomb:{...base.bomb,...raw.bomb},wavelength:{...base.wavelength,...raw.wavelength},musicPoints:{...base.musicPoints,...raw.musicPoints},selectedGames:raw.selectedGames??[],completedGames:raw.completedGames??[],eventConfigured:raw.eventConfigured??false,eventStarted:raw.eventStarted??false,review:raw.review??[],usedContent:raw.usedContent??{},matchStartScores:raw.matchStartScores??{A:raw.teams?.A?.score??0,B:raw.teams?.B?.score??0},turnStartScores:raw.turnStartScores??{A:raw.teams?.A?.score??0,B:raw.teams?.B?.score??0}};
}

export async function ensureSeeded(){const db=getDb();const existing=await db.select({gameType:gameContent.gameType,prompt:gameContent.prompt}).from(gameContent).where(isNull(gameContent.ownerRoomId));const keys=new Set(existing.map(x=>`${x.gameType}\0${x.prompt}`));const missing=DEFAULT_CONTENT.filter(x=>!keys.has(`${x.gameType}\0${x.prompt}`)).map(x=>({gameType:x.gameType,prompt:x.prompt,answer:x.answer,category:x.category,metadata:JSON.stringify(x.metadata)}));for(let i=0;i<missing.length;i+=10)await db.insert(gameContent).values(missing.slice(i,i+10));}
export async function getRoom(code:string){const [room]=await getDb().select().from(rooms).where(eq(rooms.code,code.toUpperCase())).limit(1);return room??null;}

export async function nextContent(state:GameState,gameType:GameType,roomId:string){
  await ensureSeeded(); const db=getDb();
  const rows=await db.select().from(gameContent).where(and(eq(gameContent.gameType,gameType),eq(gameContent.isActive,true),or(isNull(gameContent.ownerRoomId),eq(gameContent.ownerRoomId,roomId))));
  const settings=await db.select().from(roomContentSettings).where(eq(roomContentSettings.roomId,roomId)); const disabled=new Set(settings.filter(x=>!x.enabled).map(x=>x.contentId));
  const used=new Set(state.usedContent[gameType]??[]); const available=rows.filter(x=>!disabled.has(x.id)&&!used.has(x.id)); if(!available.length)return null;
  const picked=available[Math.floor(Math.random()*available.length)]; state.usedContent[gameType]=[...used,picked.id]; return picked as ContentItem;
}

function startTimer(state:GameState,seconds:number){state.timer={running:true,total:seconds,endsAt:Date.now()+seconds*1000,pausedRemaining:null};}
function stopTimer(state:GameState){state.timer={...state.timer,running:false,endsAt:null,pausedRemaining:null};}
function other(team:TeamKey):TeamKey{return team==="A"?"B":"A";}
function cleanTeamName(value:unknown,fallback:TeamKey){const name=String(value??"").replace(/\s+/g," ").slice(0,24);return name.trim()||`Team ${fallback}`;}
function detailFor(state:GameState){if(state.currentGame==="password")return `Clues: ${state.passwordClues.join(", ")}`;if(state.currentGame==="wavelength")return `Target ${state.wavelength.target}; guess ${state.wavelength.guess}`;if(state.currentGame==="bomb")return `${state.bomb.rule??""} ${state.currentContent?.prompt??""}`;return undefined;}

async function record(state:GameState,roomId:string,result:ReviewItem["result"],points:number,detail=detailFor(state)){
  if(!state.currentGame)return; const item:ReviewItem={id:crypto.randomUUID(),game:state.currentGame,team:state.activeTeam,teamName:state.teams[state.activeTeam].name,prompt:state.currentContent?.prompt??(state.currentGame==="music"?"External song":"Round"),answer:state.currentContent?.answer??null,result,points,detail,createdAt:new Date().toISOString()};
  state.review.push(item); if(state.review.length>250)state.review=state.review.slice(-250);
  if(state.matchId){await getDb().insert(rounds).values({id:item.id,sessionId:state.matchId,gameType:item.game,team:item.team,teamName:item.teamName,contentId:state.currentContent?.id,prompt:item.prompt,answer:item.answer,detail:item.detail,result:item.result,points:item.points});if(state.currentContent)await getDb().insert(contentUsage).values({roomId,sessionId:state.matchId,contentId:state.currentContent.id,gameType:item.game,teamName:item.teamName,result:item.result}).onConflictDoNothing();}
}

async function beginTurn(state:GameState,roomId:string){
  state.turnStartScores={A:state.teams.A.score,B:state.teams.B.score};
  state.answerShown=false;state.passwordClues=[];state.musicPoints={title:false,artist:false,lyrics:false};state.wavelength={target:Math.floor(Math.random()*11),guess:5,points:0};state.bomb={rule:null,duration:0};state.timer={running:false,total:0,endsAt:null,pausedRemaining:null};
  state.currentContent=state.currentGame&&state.currentGame!=="music"&&state.currentGame!=="bomb"?await nextContent(state,state.currentGame,roomId):null;
  // Bomb must begin at the die-roll stage. Entering `playing` here would make
  // its zero-second, not-yet-started fuse appear to have already exploded.
  state.phase=state.currentGame==="bomb"?"guess":"playing";
  if(state.currentGame&&["spelling","taboo","trivia"].includes(state.currentGame))startTimer(state,120);
}

async function finishMatch(state:GameState){
  state.phase="matchComplete";stopTimer(state);if(!state.matchId)return;
  const a=state.teams.A.score-state.matchStartScores.A,b=state.teams.B.score-state.matchStartScores.B,winner=a===b?null:a>b?"A":"B";
  const db=getDb();await db.update(gameSessions).set({endedAt:new Date().toISOString(),finalState:JSON.stringify(state)}).where(eq(gameSessions.id,state.matchId));
  for(const key of ["A","B"] as TeamKey[]){const name=state.teams[key].name,normalized=name.toLowerCase();const answers=state.review.filter(x=>x.team===key&&x.game===state.currentGame);await db.insert(eventTeams).values({name,normalizedName:normalized,totalScore:key==="A"?a:b,matchesPlayed:1,gamesWon:winner===key?1:0,correctAnswers:answers.filter(x=>x.result==="correct").length,answersPlayed:answers.length}).onConflictDoUpdate({target:eventTeams.normalizedName,set:{name,totalScore:sql`${eventTeams.totalScore}+${key==="A"?a:b}`,matchesPlayed:sql`${eventTeams.matchesPlayed}+1`,gamesWon:sql`${eventTeams.gamesWon}+${winner===key?1:0}`,correctAnswers:sql`${eventTeams.correctAnswers}+${answers.filter(x=>x.result==="correct").length}`,answersPlayed:sql`${eventTeams.answersPlayed}+${answers.length}`,updatedAt:new Date().toISOString()}});}
}

async function completeTurn(state:GameState,roomId:string){stopTimer(state);if(state.turnNumber===1){state.phase="turnComplete";}else await finishMatch(state);}

export async function expireRound(state:GameState,roomId:string){if(!state.timer.running||!state.timer.endsAt||Date.now()<state.timer.endsAt)return false;stopTimer(state);if(state.currentGame==="bomb")return true;await record(state,roomId,"zero",0,"Time expired");await completeTurn(state,roomId);return true;}

export async function applyAction(input:GameState,action:Record<string,unknown>,roomId:string){
  const state=hydrateState(input),type=String(action.type??"");await expireRound(state,roomId);
  if(type==="newGame")return initialState();
  if(type==="pauseTimer"&&state.timer.running&&state.timer.endsAt){state.timer={...state.timer,running:false,pausedRemaining:Math.max(0,Math.ceil((state.timer.endsAt-Date.now())/1000)),endsAt:null};return state;}
  if(type==="resumeTimer"&&state.phase==="playing"&&!state.timer.running&&Number(state.timer.pausedRemaining)>0){const n=Number(state.timer.pausedRemaining);state.timer={...state.timer,running:true,endsAt:Date.now()+n*1000,pausedRemaining:null};return state;}
  if(type==="setActiveTeam"&&(action.team==="A"||action.team==="B")&&!state.eventStarted&&["lobby","setup"].includes(state.phase)){state.activeTeam=action.team;state.startingTeam=action.team;}
  if(type==="addPoints"&&(action.team==="A"||action.team==="B")){state.teams[action.team].score=Math.max(0,Math.min(9999,state.teams[action.team].score+Math.max(-1000,Math.min(1000,Number(action.points)||0))));}
  if(type==="setScore"&&(action.team==="A"||action.team==="B"))state.teams[action.team].score=Math.max(0,Math.min(9999,Math.round(Number(action.score)||0)));
  if(type==="renameTeam"&&(action.team==="A"||action.team==="B")){if(state.eventStarted)throw new Error("Team names are locked after the game night starts.");const name=cleanTeamName(action.name,action.team);if(name.toLowerCase()===state.teams[other(action.team)].name.toLowerCase())throw new Error("Both sides cannot use the same team.");state.teams[action.team].name=name;}
  if(type==="configureEvent"&&!state.eventStarted){const valid=["spelling","taboo","music","password","bomb","trivia","wavelength"] as GameType[],games=Array.isArray(action.games)?action.games.filter((g):g is GameType=>valid.includes(g as GameType)):[];if(!games.length)throw new Error("Choose at least one game.");state.selectedGames=[...new Set(games)];state.completedGames=[];state.eventConfigured=true;state.currentGame=state.selectedGames.length===1?state.selectedGames[0]:null;state.phase=state.currentGame?"setup":"lobby";return state;}
  if(type==="editEvent"&&!state.eventStarted){state.eventConfigured=false;state.currentGame=null;state.phase="lobby";return state;}
  if(type==="selectGame") {const game=action.game as GameType;if(!["spelling","taboo","music","password","bomb","trivia","wavelength"].includes(game)||state.completedGames.includes(game)||(state.selectedGames.length&&!state.selectedGames.includes(game)))return state;state.currentGame=game;state.phase="setup";state.turnNumber=0;state.currentContent=null;state.timer={running:false,total:0,endsAt:null,pausedRemaining:null};state.answerShown=false;return state;}
  if(type==="beginGame"&&state.currentGame&&state.phase==="setup"){state.eventStarted=true;state.activeTeam=state.startingTeam;state.turnNumber=1;state.matchId=crypto.randomUUID();state.matchStartScores={A:state.teams.A.score,B:state.teams.B.score};state.usedContent[state.currentGame]=[];state.review=state.review.filter(x=>x.game!==state.currentGame);await getDb().insert(gameSessions).values({id:state.matchId,roomId,gameType:state.currentGame,teamAName:state.teams.A.name,teamBName:state.teams.B.name});await beginTurn(state,roomId);return state;}
  if(type==="nextTeam"&&state.phase==="turnComplete"){state.activeTeam=other(state.startingTeam);state.turnNumber=2;await beginTurn(state,roomId);return state;}
  if(type==="restartTurn"&&state.currentGame&&state.matchId&&state.turnNumber>0&&!['turnComplete','matchComplete','eventComplete','setup','lobby'].includes(state.phase)){
    const team=state.activeTeam,teamName=state.teams[team].name,db=getDb();
    state.teams[team].score=state.turnStartScores[team];
    state.review=state.review.filter(item=>!(item.game===state.currentGame&&item.team===team));
    await db.delete(rounds).where(and(eq(rounds.sessionId,state.matchId),eq(rounds.team,team)));
    await db.delete(contentUsage).where(and(eq(contentUsage.sessionId,state.matchId),eq(contentUsage.teamName,teamName)));
    await beginTurn(state,roomId);
    return state;
  }
  if(type==="completeTurn"&&state.phase==="result"){await completeTurn(state,roomId);return state;}
  if(type==="gamesMenu"||type==="nextGame"){if(state.currentGame&&!state.completedGames.includes(state.currentGame))state.completedGames.push(state.currentGame);const remaining=state.selectedGames.filter(g=>!state.completedGames.includes(g));state.turnNumber=0;state.currentContent=null;stopTimer(state);if(!remaining.length){state.currentGame=null;state.phase="eventComplete";}else if(remaining.length===1){state.currentGame=remaining[0];state.phase="setup";}else{state.currentGame=null;state.phase="lobby";}return state;}
  if(type==="replayGame"&&state.currentGame){state.phase="setup";state.turnNumber=0;state.currentContent=null;return state;}
  if(type==="revealAnswer")state.answerShown=!state.answerShown;
  if(type==="passwordClue"&&state.currentGame==="password"&&state.passwordClues.length<3){const clue=String(action.clue??"").trim().slice(0,40);if(clue)state.passwordClues.push(clue);if(state.passwordClues.length===3)state.phase="guess";return state;}
  if(type==="musicToggle"&&state.currentGame==="music"){const key=action.key as keyof GameState["musicPoints"];if(["title","artist","lyrics"].includes(key))state.musicPoints[key]=!state.musicPoints[key];return state;}
  if(type==="musicConfirm"&&state.currentGame==="music"){const points=action.zero?0:(state.musicPoints.title?10:0)+(state.musicPoints.artist?10:0)+(state.musicPoints.lyrics?30:0);state.teams[state.activeTeam].score+=points;await record(state,roomId,points?"correct":"zero",points);await completeTurn(state,roomId);return state;}
  if(type==="waveHide"&&state.currentGame==="wavelength"){state.phase="guess";startTimer(state,60);return state;}
  if(type==="waveGuess"&&state.currentGame==="wavelength"){const guess=Math.max(0,Math.min(10,Math.round(Number(action.guess)||0))),diff=Math.abs(guess-state.wavelength.target),points=diff===0?10:diff===1?5:0;state.wavelength={...state.wavelength,guess,points};state.teams[state.activeTeam].score+=points;await record(state,roomId,diff===0?"correct":diff===1?"close":"incorrect",points);state.phase="result";stopTimer(state);return state;}
  if(type==="completeWave"&&state.currentGame==="wavelength"&&state.phase==="result"){await completeTurn(state,roomId);return state;}
  if(type==="bombRoll"&&state.currentGame==="bomb"){state.currentContent=await nextContent(state,"bomb",roomId);const rules:GameState["bomb"]["rule"][]=["tick","ticktack","bomb"];state.bomb={rule:rules[Math.floor(Math.random()*3)],duration:0};state.phase="guess";return state;}
  if(type==="bombStart"&&state.currentGame==="bomb"&&state.bomb.rule){const duration=5+Math.floor(Math.random()*41);state.bomb={...state.bomb,duration};state.phase="playing";startTimer(state,duration);return state;}
  if(type==="bombResolve"&&state.currentGame==="bomb"&&(action.losingTeam==="A"||action.losingTeam==="B")){const winner:TeamKey=action.losingTeam==="A"?"B":"A";state.teams[winner].score+=50;await record(state,roomId,state.activeTeam===winner?"correct":"incorrect",state.activeTeam===winner?50:0,`Team ${action.losingTeam} held the bomb`);await completeTurn(state,roomId);return state;}
  if((type==="correct"||type==="pass")&&state.currentGame){const correct=type==="correct",points=correct?10:0;state.teams[state.activeTeam].score+=points;await record(state,roomId,correct?"correct":state.currentGame==="spelling"?"incorrect":"pass",points);
    if(state.currentGame==="spelling"&&!correct){state.phase="result";stopTimer(state);return state;}
    if(state.currentGame==="password"){state.phase="result";return state;}
    if(["spelling","taboo","trivia"].includes(state.currentGame)){state.currentContent=await nextContent(state,state.currentGame,roomId);state.answerShown=false;return state;}
  }
  return state;
}
