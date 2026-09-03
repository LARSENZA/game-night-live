import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contentUsage, eventTeams, gameContent, gameSessions, roomContentSettings, rooms, rounds } from "@/db/schema";
import { DEFAULT_CONTENT } from "./default-content";
import { ContentItem, GameState, GameType, ReviewItem, SpellingDifficulty, SpellingMode, TeamKey, initialState } from "./types";

export async function hashToken(token:string){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");}
export function randomToken(){return Array.from(crypto.getRandomValues(new Uint8Array(24)),b=>b.toString(16).padStart(2,"0")).join("");}
export function randomCode(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>c[b%c.length]).join("");}

export function hydrateState(raw:Partial<GameState>):GameState {
  const base=initialState();
  const legacyMode=String(raw.spelling?.mode??base.spelling.mode);
  const legacySelection:SpellingDifficulty[]=legacyMode==="hard_only"?["Hard"]:legacyMode==="medium_only"?["Medium"]:legacyMode==="medium_hard"?["Medium","Hard"]:legacyMode==="easy_only"?["Easy"]:base.spelling.selectedDifficulties;
  const suppliedSelection=(raw.spelling as {selectedDifficulties?:unknown} | undefined)?.selectedDifficulties;
  const selectedDifficulties=Array.isArray(suppliedSelection)?suppliedSelection.filter((value):value is SpellingDifficulty=>["Easy","Medium","Hard"].includes(String(value))):legacySelection;
  const spellingMode:SpellingMode=legacyMode==="adult_adaptive"?"adult_adaptive":"custom";
  return {...base,...raw,teams:{...base.teams,...raw.teams},timer:{...base.timer,...raw.timer},intermission:{...base.intermission,...raw.intermission},timerDefaults:{...base.timerDefaults,...raw.timerDefaults},spelling:{...base.spelling,...raw.spelling,mode:spellingMode,selectedDifficulties:selectedDifficulties.length?selectedDifficulties:base.spelling.selectedDifficulties,difficulty:{...base.spelling.difficulty,...raw.spelling?.difficulty},correctAtLevel:{...base.spelling.correctAtLevel,...raw.spelling?.correctAtLevel},fastAtLevel:{...base.spelling.fastAtLevel,...raw.spelling?.fastAtLevel}},bomb:{...base.bomb,...raw.bomb},wavelength:{...base.wavelength,...raw.wavelength},musicPoints:{...base.musicPoints,...raw.musicPoints},musicRound:{...base.musicRound,...raw.musicRound},moji:{...base.moji,...raw.moji},rapidFire:{...base.rapidFire,...raw.rapidFire},topAnswers:{...base.topAnswers,...raw.topAnswers},charades:{...base.charades,...raw.charades},scavenger:{...base.scavenger,...raw.scavenger},fiveAlive:{...base.fiveAlive,...raw.fiveAlive,items:raw.fiveAlive?.items??[]},audience:{...base.audience,...raw.audience,leaderboard:raw.audience?.leaderboard??{}},audienceLifelines:{...base.audienceLifelines,...raw.audienceLifelines},selectedGames:raw.selectedGames??[],completedGames:raw.completedGames??[],eventConfigured:raw.eventConfigured??false,eventStarted:raw.eventStarted??false,review:raw.review??[],usedContent:raw.usedContent??{},matchStartScores:raw.matchStartScores??{A:raw.teams?.A?.score??0,B:raw.teams?.B?.score??0},turnStartScores:raw.turnStartScores??{A:raw.teams?.A?.score??0,B:raw.teams?.B?.score??0},turnReviewStart:raw.turnReviewStart??0};
}

export async function ensureSeeded(){const db=getDb();const existing=await db.select({gameType:gameContent.gameType,prompt:gameContent.prompt}).from(gameContent).where(isNull(gameContent.ownerRoomId));const keys=new Set(existing.map(x=>`${x.gameType}\0${x.prompt}`));const missing=DEFAULT_CONTENT.filter(x=>!keys.has(`${x.gameType}\0${x.prompt}`)).map(x=>({gameType:x.gameType,prompt:x.prompt,answer:x.answer,category:x.category,metadata:JSON.stringify(x.metadata)}));for(let i=0;i<missing.length;i+=10)await db.insert(gameContent).values(missing.slice(i,i+10));}
export async function getRoom(code:string){const [room]=await getDb().select().from(rooms).where(eq(rooms.code,code.toUpperCase())).limit(1);return room??null;}

function triviaSubject(category:string|null){
  const value=(category??"General").trim();
  if(value.toLowerCase().startsWith("maths"))return "Maths";
  return value||"General";
}

export async function nextContent(state:GameState,gameType:GameType,roomId:string,categories?:string[]){
  // Default content is installed by D1 migrations. Running ensureSeeded here
  // scanned the entire global bank before every question and exhausted D1's
  // daily row-read allowance as the bank grew.
  const db=getDb();
  const rows=await db.select().from(gameContent).where(and(eq(gameContent.gameType,gameType),eq(gameContent.isActive,true),or(isNull(gameContent.ownerRoomId),eq(gameContent.ownerRoomId,roomId))));
  const settings=await db.select().from(roomContentSettings).where(eq(roomContentSettings.roomId,roomId)); const disabled=new Set(settings.filter(x=>!x.enabled).map(x=>x.contentId));
  const enabled=rows.filter(x=>!disabled.has(x.id)&&(!categories?.length||categories.includes(x.category??"")));if(!enabled.length)return null;
  const history=await db.select({id:contentUsage.id,contentId:contentUsage.contentId}).from(contentUsage).where(and(eq(contentUsage.roomId,roomId),eq(contentUsage.gameType,gameType)));
  const lastUse=new Map<number,number>();for(const item of history)lastUse.set(item.contentId,Math.max(lastUse.get(item.contentId)??0,item.id));
  const thisMatch=new Set(state.usedContent[gameType]??[]);
  // Prefer content never shown in this room. Once the whole enabled bank has
  // been seen, recycle the least-recently shown item without repeating within
  // the current match (or immediately repeating the item on screen).
  let candidates=enabled.filter(item=>!lastUse.has(item.id)&&!thisMatch.has(item.id));
  if(!candidates.length)candidates=enabled.filter(item=>!thisMatch.has(item.id)&&item.id!==state.currentContent?.id).sort((a,b)=>(lastUse.get(a.id)??0)-(lastUse.get(b.id)??0));
  // If this category has been exhausted during the current match, recycle it
  // without immediately repeating the card currently on screen. This matters
  // for Bomb because Word, Produce and Punctuation share one gameType history.
  if(!candidates.length){
    const enabledIds=new Set(enabled.map(item=>item.id));
    const retained=(state.usedContent[gameType]??[]).filter(id=>!enabledIds.has(id));
    state.usedContent[gameType]=retained;
    candidates=enabled.filter(item=>item.id!==state.currentContent?.id).sort((a,b)=>(lastUse.get(a.id)??0)-(lastUse.get(b.id)??0));
  }
  if(!candidates.length)return null;
  // Fifth Grader has a deliberately deep maths bank. Balance selection by
  // broad subject so row count does not turn into maths appearing every time.
  // All questions remain active and cycle within their subject.
  if(gameType==="trivia"){
    const usedSubjectCounts=new Map<string,number>();
    const enabledById=new Map(enabled.map(item=>[item.id,item]));
    for(const id of thisMatch){const item=enabledById.get(id);if(item){const subject=triviaSubject(item.category);usedSubjectCounts.set(subject,(usedSubjectCounts.get(subject)??0)+1);}}
    const availableSubjects=[...new Set(candidates.map(item=>triviaSubject(item.category)))];
    const subjectProgress=(subject:string)=>(usedSubjectCounts.get(subject)??0)/(subject==="Maths"?2:1);
    const lowest=Math.min(...availableSubjects.map(subject=>subjectProgress(subject)));
    const balancedSubjects=availableSubjects.filter(subject=>subjectProgress(subject)===lowest);
    const chosenSubject=balancedSubjects[Math.floor(Math.random()*balancedSubjects.length)];
    candidates=candidates.filter(item=>triviaSubject(item.category)===chosenSubject);
  }
  const unseen=candidates.filter(item=>!lastUse.has(item.id));
  const pool=unseen.length?unseen:candidates.filter(item=>(lastUse.get(item.id)??0)===(lastUse.get(candidates[0].id)??0));
  const picked=pool[Math.floor(Math.random()*pool.length)];state.usedContent[gameType]=[...thisMatch,picked.id];
  if(state.matchId)await db.insert(contentUsage).values({roomId,sessionId:state.matchId,contentId:picked.id,gameType,teamName:state.teams[state.activeTeam].name}).onConflictDoNothing();
  return picked as ContentItem;
}

function startTimer(state:GameState,seconds:number){state.timer={running:true,total:seconds,endsAt:Date.now()+seconds*1000,pausedRemaining:null};}
function stopTimer(state:GameState){state.timer={...state.timer,running:false,endsAt:null,pausedRemaining:null};}
function other(team:TeamKey):TeamKey{return team==="A"?"B":"A";}
function spellingStart(state:GameState):SpellingDifficulty{return state.spelling.mode==="adult_adaptive"?"Easy":state.spelling.selectedDifficulties[0]??"Easy";}
function spellingCategories(state:GameState):SpellingDifficulty[]{return state.spelling.mode==="adult_adaptive"?[state.spelling.difficulty[state.activeTeam]]:state.spelling.selectedDifficulties;}
async function nextSpellingContent(state:GameState,roomId:string){const content=await nextContent(state,"spelling",roomId,spellingCategories(state));if(content&&["Easy","Medium","Hard"].includes(content.category??""))state.spelling.difficulty[state.activeTeam]=content.category as SpellingDifficulty;return content;}
function timerDefault(state:GameState,game:GameType,fallback:number){const value=state.timerDefaults[game];return value===undefined?fallback:Math.max(0,Math.min(3600,Math.round(value)));}
function cleanTeamName(value:unknown,fallback:TeamKey){const name=String(value??"").replace(/\s+/g," ").slice(0,24);return name.trim()||`Team ${fallback}`;}
function detailFor(state:GameState){if(state.currentGame==="password")return `Clues: ${state.passwordClues.join(", ")}`;if(state.currentGame==="wavelength")return `Target ${state.wavelength.target}; guess ${state.wavelength.guess}`;if(state.currentGame==="bomb")return `${state.bomb.rule??""} ${state.currentContent?.prompt??""}`;if(["finish_lyric","original_source","beat_intro"].includes(state.currentGame??""))return `Clip ${state.musicRound.clip}`;return undefined;}

async function record(state:GameState,roomId:string,result:ReviewItem["result"],points:number,detail=detailFor(state)){
  if(!state.currentGame)return; const item:ReviewItem={id:crypto.randomUUID(),game:state.currentGame,team:state.activeTeam,teamName:state.teams[state.activeTeam].name,prompt:state.currentContent?.prompt??(state.currentGame==="music"?"External song":"Round"),answer:state.currentContent?.answer??null,result,points,detail,createdAt:new Date().toISOString()};
  state.review.push(item); if(state.review.length>250)state.review=state.review.slice(-250);
  if(state.matchId){await getDb().insert(rounds).values({id:item.id,sessionId:state.matchId,gameType:item.game,team:item.team,teamName:item.teamName,contentId:state.currentContent?.id,prompt:item.prompt,answer:item.answer,detail:item.detail,result:item.result,points:item.points});if(state.currentContent)await getDb().insert(contentUsage).values({roomId,sessionId:state.matchId,contentId:state.currentContent.id,gameType:item.game,teamName:item.teamName,result:item.result}).onConflictDoNothing();}
}

async function beginTurn(state:GameState,roomId:string){
  state.turnStartScores={A:state.teams.A.score,B:state.teams.B.score};
  state.turnReviewStart=state.review.length;
  state.answerShown=false;state.passwordClues=[];state.musicPoints={title:false,artist:false,lyrics:false};state.musicRound={clip:1};state.wavelength={target:Math.floor(Math.random()*11),guess:5,points:0};state.bomb={...state.bomb,rule:null,duration:0,holder:state.activeTeam,cardsPassed:0};state.timer={running:false,total:0,endsAt:null,pausedRemaining:null};
  state.moji={card:1,hintShown:false,stage:"guess",turnTeam:state.activeTeam};
  state.charades={card:1,stage:"reveal"};state.scavenger={card:1};
  if(state.currentGame==="five_alive"){state.fiveAlive={side:"A",items:[],solvedA:[],solvedB:[],stage:"ready"};for(let i=0;i<10;i++){const item=await nextContent(state,"five_alive",roomId);if(item)state.fiveAlive.items.push(item);}}
  state.currentContent=state.currentGame&&!(["music","finish_lyric","original_source","beat_intro","bomb","five_alive"].includes(state.currentGame))?(state.currentGame==="spelling"?await nextSpellingContent(state,roomId):await nextContent(state,state.currentGame,roomId)):null;
  if(state.currentGame==="bomb"&&state.bomb.mode!=="words")state.currentContent=await nextContent(state,"bomb",roomId,[state.bomb.mode==="veggies"?"Produce":"Punctuation"]);
  // Bomb must begin at the die-roll stage. Entering `playing` here would make
  // its zero-second, not-yet-started fuse appear to have already exploded.
  state.phase=state.currentGame==="bomb"?"guess":"playing";
  if(state.currentGame&&["spelling","taboo","trivia","password","music","finish_lyric","original_source","beat_intro"].includes(state.currentGame)){const duration=timerDefault(state,state.currentGame,state.currentGame==="password"||state.currentGame==="trivia"?60:120);if(duration)startTimer(state,duration);}
  if(state.currentGame==="moji")startTimer(state,timerDefault(state,"moji",30));
  if(state.currentGame==="rapid_fire"){state.rapidFire={question:1,stage:"open",buzzedTeam:null};startTimer(state,timerDefault(state,"rapid_fire",10));}
  if(state.currentGame==="top_answers"){state.topAnswers={revealed:[],pot:0,strikes:0,stage:"play",controlTeam:state.activeTeam};startTimer(state,timerDefault(state,"top_answers",120));}
  if(state.currentGame==="scavenger")startTimer(state,timerDefault(state,"scavenger",30));
}

async function finishMatch(state:GameState){
  state.phase="matchComplete";stopTimer(state);if(!state.matchId)return;
  const a=state.teams.A.score-state.matchStartScores.A,b=state.teams.B.score-state.matchStartScores.B,winner=a===b?null:a>b?"A":"B";
  const db=getDb();await db.update(gameSessions).set({endedAt:new Date().toISOString(),finalState:JSON.stringify(state)}).where(eq(gameSessions.id,state.matchId));
  for(const key of ["A","B"] as TeamKey[]){const name=state.teams[key].name,normalized=name.toLowerCase();const answers=state.review.filter(x=>x.team===key&&x.game===state.currentGame);await db.insert(eventTeams).values({name,normalizedName:normalized,totalScore:key==="A"?a:b,matchesPlayed:1,gamesWon:winner===key?1:0,correctAnswers:answers.filter(x=>x.result==="correct").length,answersPlayed:answers.length}).onConflictDoUpdate({target:eventTeams.normalizedName,set:{name,totalScore:sql`${eventTeams.totalScore}+${key==="A"?a:b}`,matchesPlayed:sql`${eventTeams.matchesPlayed}+1`,gamesWon:sql`${eventTeams.gamesWon}+${winner===key?1:0}`,correctAnswers:sql`${eventTeams.correctAnswers}+${answers.filter(x=>x.result==="correct").length}`,answersPlayed:sql`${eventTeams.answersPlayed}+${answers.length}`,updatedAt:new Date().toISOString()}});}
}

async function completeTurn(state:GameState,roomId:string){stopTimer(state);if(state.turnNumber===1){state.phase="turnComplete";}else await finishMatch(state);}

async function advanceRapid(state:GameState,roomId:string){
  if(state.rapidFire.question>=10){await finishMatch(state);return;}
  state.answerShown=false;
  state.rapidFire={question:state.rapidFire.question+1,stage:"open",buzzedTeam:null};
  state.currentContent=await nextContent(state,"rapid_fire",roomId);startTimer(state,10);
}
async function advanceMoji(state:GameState,roomId:string){
  const turnTeam=state.moji.turnTeam;state.activeTeam=turnTeam;
  if(state.moji.card>=5){await completeTurn(state,roomId);return;}
  state.answerShown=false;
  state.moji={card:state.moji.card+1,hintShown:false,stage:"guess",turnTeam};
  state.currentContent=await nextContent(state,"moji",roomId);startTimer(state,30);
}
async function advancePhysical(state:GameState,roomId:string,game:"charades"|"scavenger",limit:number){
  const current=game==="charades"?state.charades.card:state.scavenger.card;if(current>=limit){await finishMatch(state);return;}
  state.currentContent=await nextContent(state,game,roomId);state.answerShown=false;
  if(game==="charades"){state.charades={card:current+1,stage:"reveal"};stopTimer(state);}else{state.scavenger.card=current+1;startTimer(state,timerDefault(state,"scavenger",30));}
}
function topAnswerRows(state:GameState){try{const value=JSON.parse(state.currentContent?.metadata??"{}").answers;return Array.isArray(value)?value as Array<{text?:string;points?:number;aliases?:string[]}>:[];}catch{return [];}}
async function awardTopAndComplete(state:GameState,roomId:string,team:TeamKey,points:number,detail:string){state.activeTeam=team;state.teams[team].score+=points;await record(state,roomId,points?"correct":"zero",points,detail);await completeTurn(state,roomId);}

export async function expireRound(state:GameState,roomId:string){
  if(state.intermission.active&&state.intermission.running&&state.intermission.endsAt&&Date.now()>=state.intermission.endsAt){state.intermission={...state.intermission,running:false,endsAt:null,pausedRemaining:0};return true;}
  if(!state.timer.running||!state.timer.endsAt||Date.now()<state.timer.endsAt)return false;stopTimer(state);
  if(state.phase==="audience")return true;
  if(state.currentGame==="bomb")return true;
  if(state.currentGame==="rapid_fire"){
    if(state.rapidFire.stage==="answer"&&state.rapidFire.buzzedTeam){state.activeTeam=other(state.rapidFire.buzzedTeam);state.rapidFire={...state.rapidFire,stage:"steal"};startTimer(state,5);return true;}
    await advanceRapid(state,roomId);return true;
  }
  if(state.currentGame==="moji"){
    if(state.moji.stage==="guess"){await record(state,roomId,"zero",0,"Time expired");state.activeTeam=other(state.moji.turnTeam);state.moji={...state.moji,stage:"steal"};startTimer(state,10);return true;}
    await record(state,roomId,"zero",0,"Steal expired");await advanceMoji(state,roomId);return true;
  }
  if(state.currentGame==="top_answers"){
    if(state.topAnswers.stage==="play"){state.topAnswers.stage="steal";state.activeTeam=other(state.topAnswers.controlTeam);startTimer(state,10);return true;}
    await awardTopAndComplete(state,roomId,state.topAnswers.controlTeam,state.topAnswers.pot,"Steal timed out");return true;
  }
  if(state.currentGame==="charades"){await record(state,roomId,"zero",0,"Card timed out");state.charades.stage="complete";stopTimer(state);return true;}
  if(state.currentGame==="scavenger"){await record(state,roomId,"zero",0,"Challenge timed out");await advancePhysical(state,roomId,"scavenger",10);return true;}
  if(state.currentGame==="five_alive"){state.fiveAlive.stage="complete";stopTimer(state);return true;}
  await record(state,roomId,"zero",0,"Time expired");await completeTurn(state,roomId);return true;
}

export async function applyAction(input:GameState,action:Record<string,unknown>,roomId:string){
  const state=hydrateState(input),type=String(action.type??"");await expireRound(state,roomId);
  const selectable=["spelling","taboo","music","finish_lyric","original_source","beat_intro","password","bomb","trivia","wavelength","top_answers","moji","rapid_fire","charades","scavenger","five_alive"] as GameType[];
  if(type==="intermissionStart"){const seconds=Math.max(10,Math.min(86400,Math.round(Number(action.seconds)||300))),mode=action.mode==="break"?"break":"starting",fallbackTitle=mode==="break"?"QUICK BREAK":"LIVE GAME STARTS IN",fallbackMessage=mode==="break"?"We’ll be right back":"Get your team ready!",title=String(action.title??fallbackTitle).trim().replace(/\s+/g," ").slice(0,60)||fallbackTitle,message=String(action.message??fallbackMessage).trim().replace(/\s+/g," ").slice(0,100)||fallbackMessage;state.intermission={active:true,mode,title,message,running:true,total:seconds,endsAt:Date.now()+seconds*1000,pausedRemaining:null};return state;}
  if(type==="intermissionPause"&&state.intermission.active&&state.intermission.running&&state.intermission.endsAt){state.intermission={...state.intermission,running:false,pausedRemaining:Math.max(0,Math.ceil((state.intermission.endsAt-Date.now())/1000)),endsAt:null};return state;}
  if(type==="intermissionResume"&&state.intermission.active&&!state.intermission.running&&Number(state.intermission.pausedRemaining)>0){const seconds=Number(state.intermission.pausedRemaining);state.intermission={...state.intermission,running:true,endsAt:Date.now()+seconds*1000,pausedRemaining:null};return state;}
  if(type==="intermissionAdd"&&state.intermission.active){const delta=Math.max(-3600,Math.min(3600,Math.round(Number(action.seconds)||0)));if(state.intermission.running&&state.intermission.endsAt)state.intermission={...state.intermission,total:Math.max(10,state.intermission.total+delta),endsAt:Math.max(Date.now(),state.intermission.endsAt+delta*1000)};else state.intermission={...state.intermission,total:Math.max(10,state.intermission.total+delta),pausedRemaining:Math.max(0,(Number(state.intermission.pausedRemaining)||0)+delta)};return state;}
  if(type==="intermissionEnd"){state.intermission={...state.intermission,active:false,running:false,endsAt:null,pausedRemaining:state.intermission.total};return state;}
  if(type==="newGame")return initialState();
  if(type==="resetQuestionHistory"){await getDb().delete(contentUsage).where(eq(contentUsage.roomId,roomId));state.usedContent={};return state;}
  if(type==="setGameTimer"&&state.currentGame&&state.phase==="setup"){state.timerDefaults[state.currentGame]=Math.max(0,Math.min(3600,Math.round(Number(action.seconds)||0)));return state;}
  if(type==="setSpellingMode"&&state.currentGame==="spelling"&&state.phase==="setup"&&action.mode==="adult_adaptive"){state.spelling.mode="adult_adaptive";state.spelling.difficulty={A:"Easy",B:"Easy"};state.spelling.correctAtLevel={A:0,B:0};state.spelling.fastAtLevel={A:0,B:0};return state;}
  if(type==="toggleSpellingDifficulty"&&state.currentGame==="spelling"&&state.phase==="setup"&&["Easy","Medium","Hard"].includes(String(action.difficulty))){const difficulty=String(action.difficulty) as SpellingDifficulty,current=state.spelling.mode==="custom"?[...state.spelling.selectedDifficulties]:[],selected=current.includes(difficulty)?current.filter(item=>item!==difficulty):[...current,difficulty];if(selected.length){state.spelling.mode="custom";state.spelling.selectedDifficulties=(["Easy","Medium","Hard"] as SpellingDifficulty[]).filter(item=>selected.includes(item));const start=spellingStart(state);state.spelling.difficulty={A:start,B:start};state.spelling.correctAtLevel={A:0,B:0};state.spelling.fastAtLevel={A:0,B:0};}return state;}
  if(type==="setBombMode"&&state.currentGame==="bomb"&&state.phase==="setup"&&["words","veggies","punctuation"].includes(String(action.mode))){state.bomb.mode=action.mode as GameState["bomb"]["mode"];return state;}
  if(type==="adjustTimer"&&state.currentGame!=="bomb"){const delta=Math.round(Number(action.seconds)||0),remaining=state.timer.running&&state.timer.endsAt?Math.max(0,Math.ceil((state.timer.endsAt-Date.now())/1000)):Math.max(0,Number(state.timer.pausedRemaining)||0),next=Math.max(0,Math.min(3600,action.set===true?delta:remaining+delta));state.timer={running:next>0,total:Math.max(state.timer.total,next),endsAt:next>0?Date.now()+next*1000:null,pausedRemaining:next>0?null:0};return state;}
  if(type==="pauseTimer"&&state.timer.running&&state.timer.endsAt){state.timer={...state.timer,running:false,pausedRemaining:Math.max(0,Math.ceil((state.timer.endsAt-Date.now())/1000)),endsAt:null};return state;}
  if(type==="resumeTimer"&&state.phase==="playing"&&!state.timer.running&&Number(state.timer.pausedRemaining)>0){const n=Number(state.timer.pausedRemaining);state.timer={...state.timer,running:true,endsAt:Date.now()+n*1000,pausedRemaining:null};return state;}
  if(type==="setActiveTeam"&&(action.team==="A"||action.team==="B")&&!state.eventStarted&&["lobby","setup"].includes(state.phase)){state.activeTeam=action.team;state.startingTeam=action.team;}
  if(type==="addPoints"&&(action.team==="A"||action.team==="B")){state.teams[action.team].score=Math.max(0,Math.min(9999,state.teams[action.team].score+Math.max(-1000,Math.min(1000,Number(action.points)||0))));}
  if(type==="setScore"&&(action.team==="A"||action.team==="B"))state.teams[action.team].score=Math.max(0,Math.min(9999,Math.round(Number(action.score)||0)));
  if(type==="renameTeam"&&(action.team==="A"||action.team==="B")){if(state.eventStarted)throw new Error("Team names are locked after the game night starts.");const name=cleanTeamName(action.name,action.team);if(name.toLowerCase()===state.teams[other(action.team)].name.toLowerCase())throw new Error("Both sides cannot use the same team.");state.teams[action.team].name=name;}
  if(type==="configureEvent"&&!state.eventStarted){const games=Array.isArray(action.games)?action.games.filter((g):g is GameType=>selectable.includes(g as GameType)):[];if(!games.length)throw new Error("Choose at least one game.");state.selectedGames=[...new Set(games)];state.completedGames=[];state.eventConfigured=true;state.currentGame=state.selectedGames.length===1?state.selectedGames[0]:null;state.phase=state.currentGame?"setup":"lobby";return state;}
  if(type==="editEvent"&&!state.eventStarted){state.eventConfigured=false;state.currentGame=null;state.phase="lobby";return state;}
  if(type==="selectGame") {const game=action.game as GameType;if(!selectable.includes(game)||state.completedGames.includes(game)||(state.selectedGames.length&&!state.selectedGames.includes(game)))return state;state.currentGame=game;state.phase="setup";state.turnNumber=0;state.currentContent=null;state.timer={running:false,total:0,endsAt:null,pausedRemaining:null};state.answerShown=false;return state;}
  if(type==="beginGame"&&state.currentGame&&state.phase==="setup"){state.eventStarted=true;state.activeTeam=state.startingTeam;state.turnNumber=1;state.matchId=crypto.randomUUID();state.matchStartScores={A:state.teams.A.score,B:state.teams.B.score};state.usedContent[state.currentGame]=[];state.review=state.review.filter(x=>x.game!==state.currentGame);if(state.currentGame==="spelling"){const start=spellingStart(state);state.spelling={...state.spelling,difficulty:{A:start,B:start},correctAtLevel:{A:0,B:0},fastAtLevel:{A:0,B:0},lastResponseSeconds:null,lastFastThreshold:null};}await getDb().insert(gameSessions).values({id:state.matchId,roomId,gameType:state.currentGame,teamAName:state.teams.A.name,teamBName:state.teams.B.name});await beginTurn(state,roomId);return state;}
  if(type==="nextTeam"&&state.phase==="turnComplete"){state.activeTeam=other(state.startingTeam);state.turnNumber=2;await beginTurn(state,roomId);return state;}
  if(type==="restartTurn"&&state.currentGame&&state.matchId&&state.turnNumber>0&&!['turnComplete','matchComplete','eventComplete','setup','lobby'].includes(state.phase)){
    const db=getDb(),restarted=state.review.slice(state.turnReviewStart),ids=restarted.map(item=>item.id);
    state.teams.A.score=state.turnStartScores.A;state.teams.B.score=state.turnStartScores.B;
    state.review=state.review.slice(0,state.turnReviewStart);
    if(ids.length)await db.delete(rounds).where(inArray(rounds.id,ids));
    if(state.currentGame==="rapid_fire")state.activeTeam=state.startingTeam;
    if(state.currentGame==="top_answers")state.activeTeam=state.turnNumber===1?state.startingTeam:other(state.startingTeam);
    if(state.currentGame==="moji")state.activeTeam=state.moji.turnTeam;
    await beginTurn(state,roomId);
    return state;
  }
  if(type==="completeTurn"&&state.phase==="result"){await completeTurn(state,roomId);return state;}
  if(type==="useAudienceLifeline"&&(action.team==="A"||action.team==="B")&&!state.audienceLifelines[action.team]){state.audienceLifelines[action.team]=true;return state;}
  if(type==="startCrowdClash"&&state.phase==="matchComplete"){state.audience.currentContent=await nextContent(state,"crowd",roomId);state.phase="audience";startTimer(state,15);return state;}
  if(type==="crowdAward"&&state.phase==="audience"){const raw=String(action.username??"").trim().replace(/\s+/g,"_").slice(0,32);if(!raw)throw new Error("Enter the winning viewer's username.");const username=raw.startsWith("@")?raw:`@${raw}`;state.audience.leaderboard[username]=(state.audience.leaderboard[username]??0)+1;state.phase="matchComplete";stopTimer(state);return state;}
  if(type==="crowdSkip"&&state.phase==="audience"){state.phase="matchComplete";stopTimer(state);return state;}
  if(type==="gamesMenu"||type==="nextGame"){if(state.currentGame&&!state.completedGames.includes(state.currentGame))state.completedGames.push(state.currentGame);const remaining=state.selectedGames.filter(g=>!state.completedGames.includes(g));state.turnNumber=0;state.currentContent=null;stopTimer(state);if(!remaining.length){state.currentGame=null;state.phase="eventComplete";}else if(remaining.length===1){state.currentGame=remaining[0];state.phase="setup";}else{state.currentGame=null;state.phase="lobby";}return state;}
  if(type==="replayGame"&&state.currentGame){state.phase="setup";state.turnNumber=0;state.currentContent=null;return state;}
  if(type==="revealAnswer")state.answerShown=!state.answerShown;
  if(type==="passwordClue"&&state.currentGame==="password"&&state.passwordClues.length<3){const clue=String(action.clue??"").trim().slice(0,40);if(clue)state.passwordClues.push(clue);if(state.passwordClues.length===3)state.phase="guess";return state;}
  if(type==="musicToggle"&&state.currentGame==="music"){const key=action.key as keyof GameState["musicPoints"];if(["title","artist","lyrics"].includes(key))state.musicPoints[key]=!state.musicPoints[key];return state;}
  if(type==="musicConfirm"&&state.currentGame==="music"){const points=action.zero?0:(state.musicPoints.title?10:0)+(state.musicPoints.artist?10:0)+(state.musicPoints.lyrics?30:0);state.teams[state.activeTeam].score+=points;await record(state,roomId,points?"correct":"zero",points);await completeTurn(state,roomId);return state;}
  if(type==="musicModeScore"&&state.currentGame&&["finish_lyric","original_source","beat_intro"].includes(state.currentGame)){const points=[0,5,10].includes(Number(action.points))?Number(action.points):0;state.teams[state.activeTeam].score+=points;await record(state,roomId,points===10?"correct":points===5?"close":"zero",points,`${state.currentGame} · clip ${state.musicRound.clip}`);if(state.musicRound.clip>=5)await completeTurn(state,roomId);else state.musicRound.clip+=1;return state;}
  if(type==="mojiHint"&&state.currentGame==="moji"&&state.moji.stage==="guess"){state.moji.hintShown=true;return state;}
  if(type==="mojiCorrect"&&state.currentGame==="moji"){const steal=state.moji.stage==="steal",points=steal?10:state.moji.hintShown?10:20;state.teams[state.activeTeam].score+=points;await record(state,roomId,"correct",points,steal?"Steal":"Moji solved");await advanceMoji(state,roomId);return state;}
  if(type==="mojiMiss"&&state.currentGame==="moji"){
    if(state.moji.stage==="guess"){await record(state,roomId,"incorrect",0,"Passed to steal");state.activeTeam=other(state.moji.turnTeam);state.moji={...state.moji,stage:"steal"};startTimer(state,10);return state;}
    await record(state,roomId,"incorrect",0,"Steal missed");await advanceMoji(state,roomId);return state;
  }
  if(type==="rapidBuzz"&&state.currentGame==="rapid_fire"&&state.rapidFire.stage==="open"&&(action.team==="A"||action.team==="B")){state.activeTeam=action.team;state.rapidFire={...state.rapidFire,stage:"answer",buzzedTeam:action.team};startTimer(state,5);return state;}
  if(type==="rapidCorrect"&&state.currentGame==="rapid_fire"&&state.rapidFire.stage!=="open"){const points=state.rapidFire.stage==="steal"?5:10;state.teams[state.activeTeam].score+=points;await record(state,roomId,"correct",points,state.rapidFire.stage==="steal"?"Steal":"Buzzed first");await advanceRapid(state,roomId);return state;}
  if(type==="rapidWrong"&&state.currentGame==="rapid_fire"&&state.rapidFire.stage==="answer"&&state.rapidFire.buzzedTeam){await record(state,roomId,"incorrect",0,"Incorrect buzz");state.activeTeam=other(state.rapidFire.buzzedTeam);state.rapidFire={...state.rapidFire,stage:"steal"};startTimer(state,5);return state;}
  if(type==="rapidNoSteal"&&state.currentGame==="rapid_fire"&&state.rapidFire.stage==="steal"){await record(state,roomId,"zero",0,"No steal");await advanceRapid(state,roomId);return state;}
  if(type==="rapidSkip"&&state.currentGame==="rapid_fire"&&state.rapidFire.stage==="open"){await advanceRapid(state,roomId);return state;}
  if(type==="topReveal"&&state.currentGame==="top_answers"&&state.topAnswers.stage==="play"){const index=Math.round(Number(action.index)),answers=topAnswerRows(state);if(index<0||index>=answers.length||state.topAnswers.revealed.includes(index))return state;const points=Math.max(0,Number(answers[index]?.points)||0);state.topAnswers.revealed.push(index);state.topAnswers.pot+=points;if(state.topAnswers.revealed.length===answers.length)await awardTopAndComplete(state,roomId,state.topAnswers.controlTeam,state.topAnswers.pot,"Cleared the board");return state;}
  if(type==="topStrike"&&state.currentGame==="top_answers"&&state.topAnswers.stage==="play"){state.topAnswers.strikes+=1;if(state.topAnswers.strikes>=2){state.topAnswers.stage="steal";state.activeTeam=other(state.topAnswers.controlTeam);startTimer(state,10);}return state;}
  if(type==="topStealSuccess"&&state.currentGame==="top_answers"&&state.topAnswers.stage==="steal"){const index=Math.round(Number(action.index)),answers=topAnswerRows(state);if(index<0||index>=answers.length||state.topAnswers.revealed.includes(index))return state;const total=state.topAnswers.pot+Math.max(0,Number(answers[index]?.points)||0);state.topAnswers.revealed.push(index);await awardTopAndComplete(state,roomId,state.activeTeam,total,"Successful steal");return state;}
  if(type==="topStealFail"&&state.currentGame==="top_answers"&&state.topAnswers.stage==="steal"){await awardTopAndComplete(state,roomId,state.topAnswers.controlTeam,state.topAnswers.pot,"Steal missed");return state;}
  if(type==="fiveAliveFlip"&&state.currentGame==="five_alive"){state.fiveAlive.side=state.fiveAlive.side==="A"?"B":"A";return state;}
  if(type==="fiveAliveStart"&&state.currentGame==="five_alive"&&state.fiveAlive.stage==="ready"){state.fiveAlive.side="A";state.fiveAlive.stage="playing";startTimer(state,30);return state;}
  if(type==="fiveAliveToggle"&&state.currentGame==="five_alive"&&state.fiveAlive.stage==="playing"){const localIndex=Math.max(0,Math.min(4,Math.round(Number(action.index)||0))),globalIndex=(state.fiveAlive.side==="A"?0:5)+localIndex,key=state.turnNumber===1?"solvedA":"solvedB",solved=[...state.fiveAlive[key]];const pos=solved.indexOf(globalIndex);if(pos>=0){solved.splice(pos,1);state.teams[state.activeTeam].score=Math.max(0,state.teams[state.activeTeam].score-5);}else{solved.push(globalIndex);state.teams[state.activeTeam].score+=5;const item=state.fiveAlive.items[globalIndex];const old=state.currentContent;state.currentContent=item??old;await record(state,roomId,"correct",5,`Five Alive side ${state.fiveAlive.side} item ${localIndex+1}`);state.currentContent=old;}state.fiveAlive[key]=solved;if(solved.length>=10){state.fiveAlive.stage="complete";stopTimer(state);}return state;}
  if(type==="fiveAliveFinish"&&state.currentGame==="five_alive"&&state.fiveAlive.stage==="complete"){await completeTurn(state,roomId);return state;}
  if(type==="charadesStart"&&state.currentGame==="charades"&&state.charades.stage==="reveal"){state.charades.stage="acting";startTimer(state,timerDefault(state,"charades",60));return state;}
  if(type==="charadesAward"&&state.currentGame==="charades"&&state.charades.stage==="acting"&&(action.team==="A"||action.team==="B")){state.activeTeam=action.team;state.teams[action.team].score+=10;await record(state,roomId,"correct",10,"Guessed first");state.charades.stage="complete";stopTimer(state);return state;}
  if(type==="charadesSkip"&&state.currentGame==="charades"&&state.charades.stage==="acting"){await record(state,roomId,"zero",0,"Nobody guessed");state.charades.stage="complete";stopTimer(state);return state;}
  if(type==="charadesNext"&&state.currentGame==="charades"&&state.charades.stage==="complete"){await advancePhysical(state,roomId,"charades",5);return state;}
  if(type==="scavengerAward"&&state.currentGame==="scavenger"&&(action.team==="A"||action.team==="B")){state.activeTeam=action.team;state.teams[action.team].score+=10;await record(state,roomId,"correct",10,"Found first");await advancePhysical(state,roomId,"scavenger",10);return state;}
  if(type==="scavengerSkip"&&state.currentGame==="scavenger"){await record(state,roomId,"zero",0,"Neither team found it");await advancePhysical(state,roomId,"scavenger",10);return state;}
  if(type==="waveHide"&&state.currentGame==="wavelength"){state.phase="guess";startTimer(state,60);return state;}
  if(type==="waveGuess"&&state.currentGame==="wavelength"){const guess=Math.max(0,Math.min(10,Math.round(Number(action.guess)||0))),diff=Math.abs(guess-state.wavelength.target),points=diff===0?10:diff===1?5:0;state.wavelength={...state.wavelength,guess,points};state.teams[state.activeTeam].score+=points;await record(state,roomId,diff===0?"correct":diff===1?"close":"incorrect",points);state.phase="result";stopTimer(state);return state;}
  if(type==="completeWave"&&state.currentGame==="wavelength"&&state.phase==="result"){await completeTurn(state,roomId);return state;}
  if(type==="bombRoll"&&state.currentGame==="bomb"&&state.bomb.mode==="words"){state.currentContent=await nextContent(state,"bomb",roomId,["Fragment","Letter pair"]);const rules:GameState["bomb"]["rule"][]=["tick","ticktack","bomb"];state.bomb={...state.bomb,rule:rules[Math.floor(Math.random()*3)],duration:0};state.phase="guess";return state;}
  if(type==="bombStart"&&state.currentGame==="bomb"&&state.bomb.rule){const duration=5+Math.floor(Math.random()*41);state.bomb={...state.bomb,duration};state.phase="playing";startTimer(state,duration);return state;}
  if(type==="bombStart"&&state.currentGame==="bomb"&&state.bomb.mode!=="words"&&state.currentContent){const duration=15+Math.floor(Math.random()*31);state.bomb={...state.bomb,duration,holder:state.activeTeam};state.phase="playing";startTimer(state,duration);return state;}
  if(type==="bombPass"&&state.currentGame==="bomb"&&state.bomb.mode!=="words"&&state.phase==="playing"){await record(state,roomId,"correct",0,`${state.bomb.mode} card passed`);state.bomb.holder=other(state.bomb.holder);state.activeTeam=state.bomb.holder;state.bomb.cardsPassed+=1;state.currentContent=await nextContent(state,"bomb",roomId,[state.bomb.mode==="veggies"?"Produce":"Punctuation"]);state.answerShown=false;return state;}
  if(type==="bombSkip"&&state.currentGame==="bomb"&&state.bomb.mode!=="words"&&state.phase==="playing"){state.currentContent=await nextContent(state,"bomb",roomId,[state.bomb.mode==="veggies"?"Produce":"Punctuation"]);state.answerShown=false;return state;}
  if(type==="bombResolve"&&state.currentGame==="bomb"&&(action.losingTeam==="A"||action.losingTeam==="B")){const winner:TeamKey=action.losingTeam==="A"?"B":"A";state.teams[winner].score+=50;await record(state,roomId,state.activeTeam===winner?"correct":"incorrect",state.activeTeam===winner?50:0,`Team ${action.losingTeam} held the bomb`);await completeTurn(state,roomId);return state;}
  if((type==="correct"||type==="pass")&&state.currentGame){const correct=type==="correct";
    if(state.currentGame==="spelling"){
      const team=state.activeTeam,difficulty=state.spelling.difficulty[team],points=correct?(difficulty==="Easy"?5:difficulty==="Medium"?10:15):0,letters=(state.currentContent?.prompt??"").replace(/[^A-Za-z]/g,"").length,threshold=Math.max(4,letters),elapsed=Math.max(0,Math.min(300,Number(action.responseSeconds)||0)),fast=correct&&elapsed>0&&elapsed<=threshold;
      state.spelling.lastResponseSeconds=elapsed||null;state.spelling.lastFastThreshold=threshold;state.teams[team].score+=points;
      await record(state,roomId,correct?"correct":"incorrect",points,`${difficulty} · ${elapsed?`${elapsed.toFixed(1)}s`:`time not recorded`} · fast threshold ${threshold}s`);
      if(!correct){state.phase="result";stopTimer(state);return state;}
      state.spelling.correctAtLevel[team]+=1;if(fast)state.spelling.fastAtLevel[team]+=1;
      const adaptive=state.spelling.mode==="adult_adaptive";let next=difficulty;
      if(adaptive&&difficulty==="Easy"&&(fast||state.spelling.correctAtLevel[team]>=2))next="Medium";
      if(adaptive&&difficulty==="Medium"&&(state.spelling.fastAtLevel[team]>=2||state.spelling.correctAtLevel[team]>=3))next="Hard";
      if(next!==difficulty){state.spelling.difficulty[team]=next;state.spelling.correctAtLevel[team]=0;state.spelling.fastAtLevel[team]=0;}
      state.currentContent=await nextSpellingContent(state,roomId);state.answerShown=false;return state;
    }
    const points=correct?10:0;state.teams[state.activeTeam].score+=points;await record(state,roomId,correct?"correct":"pass",points);
    if(state.currentGame==="password"){state.phase="result";return state;}
    if(["taboo","trivia"].includes(state.currentGame)){state.currentContent=await nextContent(state,state.currentGame,roomId);state.answerShown=false;return state;}
  }
  return state;
}
