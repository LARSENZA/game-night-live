export type TeamKey = "A" | "B";
export type GameType = "spelling" | "taboo" | "music" | "password" | "bomb" | "trivia" | "wavelength";
export type GamePhase = "lobby" | "setup" | "playing" | "guess" | "result" | "turnComplete" | "matchComplete" | "ended";
export type ContentItem = { id:number; gameType:GameType; prompt:string; answer:string|null; category:string|null; metadata:string };
export type ReviewItem = { id:string; game:GameType; team:TeamKey; teamName:string; prompt:string; answer:string|null; result:"correct"|"incorrect"|"pass"|"zero"|"close"; points:number; detail?:string; createdAt:string };
export type GameState = {
  teams: Record<TeamKey,{name:string;score:number}>; activeTeam:TeamKey; startingTeam:TeamKey;
  currentGame:GameType|null; phase:GamePhase; turnNumber:0|1|2; matchId:string|null; matchStartScores:Record<TeamKey,number>;
  currentContent:ContentItem|null; usedContent:Partial<Record<GameType,number[]>>; review:ReviewItem[];
  answerShown:boolean; passwordClues:string[]; musicPoints:{title:boolean;artist:boolean;lyrics:boolean};
  wavelength:{target:number;guess:number;points:number}; bomb:{rule:"tick"|"ticktack"|"bomb"|null;duration:number};
  timer:{running:boolean;total:number;endsAt:number|null;pausedRemaining:number|null};
};
export type RoomPayload = {code:string;state:GameState;version:string;serverNow?:number};
export function initialState():GameState { return {
  teams:{A:{name:"Team A",score:0},B:{name:"Team B",score:0}}, activeTeam:"A",startingTeam:"A",currentGame:null,phase:"lobby",turnNumber:0,matchId:null,matchStartScores:{A:0,B:0},
  currentContent:null,usedContent:{},review:[],answerShown:false,passwordClues:[],musicPoints:{title:false,artist:false,lyrics:false},
  wavelength:{target:5,guess:5,points:0},bomb:{rule:null,duration:0},timer:{running:false,total:0,endsAt:null,pausedRemaining:null},
}; }
