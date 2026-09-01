export type TeamKey = "A" | "B";
export type SpellingDifficulty = "Easy" | "Medium" | "Hard";
export type SpellingMode = "adult_adaptive" | "custom";
export type GameType = "spelling" | "taboo" | "music" | "finish_lyric" | "original_source" | "beat_intro" | "password" | "bomb" | "trivia" | "wavelength" | "top_answers" | "moji" | "rapid_fire" | "charades" | "scavenger" | "five_alive" | "crowd";
export type GamePhase = "lobby" | "setup" | "playing" | "guess" | "result" | "turnComplete" | "matchComplete" | "eventComplete" | "audience" | "ended";
export type ContentItem = { id:number; gameType:GameType; prompt:string; answer:string|null; category:string|null; metadata:string };
export type ReviewItem = { id:string; game:GameType; team:TeamKey; teamName:string; prompt:string; answer:string|null; result:"correct"|"incorrect"|"pass"|"zero"|"close"; points:number; detail?:string; createdAt:string };
export type GameState = {
  teams: Record<TeamKey,{name:string;score:number}>; activeTeam:TeamKey; startingTeam:TeamKey; selectedGames:GameType[]; completedGames:GameType[]; eventConfigured:boolean; eventStarted:boolean;
  currentGame:GameType|null; phase:GamePhase; turnNumber:0|1|2; matchId:string|null; matchStartScores:Record<TeamKey,number>; turnStartScores:Record<TeamKey,number>; turnReviewStart:number;
  currentContent:ContentItem|null; usedContent:Partial<Record<GameType,number[]>>; review:ReviewItem[];
  answerShown:boolean; passwordClues:string[]; musicPoints:{title:boolean;artist:boolean;lyrics:boolean};
  wavelength:{target:number;guess:number;points:number}; bomb:{mode:"words"|"veggies"|"punctuation";rule:"tick"|"ticktack"|"bomb"|null;duration:number;holder:TeamKey;cardsPassed:number};
  musicRound:{clip:number};
  moji:{card:number;hintShown:boolean;stage:"guess"|"steal";turnTeam:TeamKey};
  rapidFire:{question:number;stage:"open"|"answer"|"steal";buzzedTeam:TeamKey|null};
  topAnswers:{revealed:number[];pot:number;strikes:number;stage:"play"|"steal";controlTeam:TeamKey};
  charades:{card:number;stage:"reveal"|"acting"|"complete"};scavenger:{card:number};
  fiveAlive:{side:"A"|"B";items:ContentItem[];solvedA:number[];solvedB:number[];stage:"ready"|"playing"|"complete"};
  audience:{leaderboard:Record<string,number>;currentContent:ContentItem|null};
  audienceLifelines:Record<TeamKey,boolean>;
  timer:{running:boolean;total:number;endsAt:number|null;pausedRemaining:number|null};
  intermission:{active:boolean;mode:"starting"|"break";title:string;message:string;running:boolean;total:number;endsAt:number|null;pausedRemaining:number|null};
  timerDefaults:Partial<Record<GameType,number>>;
  spelling:{mode:SpellingMode;selectedDifficulties:SpellingDifficulty[];difficulty:Record<TeamKey,SpellingDifficulty>;correctAtLevel:Record<TeamKey,number>;fastAtLevel:Record<TeamKey,number>;lastResponseSeconds:number|null;lastFastThreshold:number|null};
};
export type RoomPayload = {code:string;state:GameState;version:string;serverNow?:number};
export function initialState():GameState { return {
  teams:{A:{name:"Team A",score:0},B:{name:"Team B",score:0}}, activeTeam:"A",startingTeam:"A",selectedGames:[],completedGames:[],eventConfigured:false,eventStarted:false,currentGame:null,phase:"lobby",turnNumber:0,matchId:null,matchStartScores:{A:0,B:0},turnStartScores:{A:0,B:0},turnReviewStart:0,
  currentContent:null,usedContent:{},review:[],answerShown:false,passwordClues:[],musicPoints:{title:false,artist:false,lyrics:false},
  wavelength:{target:5,guess:5,points:0},bomb:{mode:"words",rule:null,duration:0,holder:"A",cardsPassed:0},musicRound:{clip:1},
  moji:{card:1,hintShown:false,stage:"guess",turnTeam:"A"},rapidFire:{question:1,stage:"open",buzzedTeam:null},topAnswers:{revealed:[],pot:0,strikes:0,stage:"play",controlTeam:"A"},charades:{card:1,stage:"reveal"},scavenger:{card:1},fiveAlive:{side:"A",items:[],solvedA:[],solvedB:[],stage:"ready"},
  audience:{leaderboard:{},currentContent:null},audienceLifelines:{A:false,B:false},timer:{running:false,total:0,endsAt:null,pausedRemaining:null},
  intermission:{active:false,mode:"starting",title:"LIVE GAME STARTS IN",message:"Get your team ready!",running:false,total:300,endsAt:null,pausedRemaining:300},
  timerDefaults:{spelling:120,taboo:120,music:0,finish_lyric:0,original_source:0,beat_intro:0,password:60,bomb:0,trivia:60,wavelength:60,top_answers:120,moji:30,rapid_fire:10,charades:60,scavenger:30,five_alive:30,crowd:15},
  spelling:{mode:"adult_adaptive",selectedDifficulties:["Easy","Medium","Hard"],difficulty:{A:"Easy",B:"Easy"},correctAtLevel:{A:0,B:0},fastAtLevel:{A:0,B:0},lastResponseSeconds:null,lastFastThreshold:null},
}; }
