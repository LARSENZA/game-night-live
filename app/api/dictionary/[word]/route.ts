type DictionaryEntry = {
  word?: string;
  source?: string;
  phonetic?: string;
  origin?: string;
  phonetics?: Array<{text?:string;audio?:string}>;
  meanings?: Array<{
    partOfSpeech?: string;
    synonyms?: string[];
    definitions?: Array<{definition?:string;example?:string;synonyms?:string[]}>;
  }>;
};

const cache=new Map<string,{entry:DictionaryEntry|null;expires:number}>();
const CACHE_TIME=24*60*60*1000;

async function timedFetch(url:string,milliseconds:number){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),milliseconds);
  try{return await fetch(url,{signal:controller.signal,headers:{Accept:"application/json"}})}finally{clearTimeout(timeout)}
}

async function freeDictionary(word:string):Promise<DictionaryEntry|null>{
  const response=await timedFetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,2500);
  if(response.status===404)return null;
  if(!response.ok)throw new Error(`Primary dictionary returned ${response.status}`);
  const data=await response.json() as DictionaryEntry[];
  const entry=Array.isArray(data)?data[0]:null;
  return entry?{...entry,source:"Free Dictionary API"}:null;
}

type DatamuseEntry={word?:string;defs?:string[];tags?:string[]};
async function datamuse(word:string):Promise<DictionaryEntry|null>{
  const response=await timedFetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=dpr&max=10`,5000);
  if(!response.ok)throw new Error(`Fallback dictionary returned ${response.status}`);
  const data=await response.json() as DatamuseEntry[];
  const match=Array.isArray(data)?data.find(item=>item.word?.toLowerCase()===word):undefined;
  if(!match)return null;
  const names:Record<string,string>={n:"noun",v:"verb",adj:"adjective",adv:"adverb",u:"unknown"};
  const groups=new Map<string,Array<{definition:string}>>();
  for(const raw of match.defs??[]){const [tag,...parts]=raw.split("\t"),definition=parts.join(" ").trim();if(!definition)continue;const partOfSpeech=names[tag]??tag??"unknown",definitions=groups.get(partOfSpeech)??[];definitions.push({definition});groups.set(partOfSpeech,definitions)}
  const pronunciation=(match.tags??[]).find(tag=>tag.startsWith("pron:"))?.slice(5).trim();
  if(!groups.size&&!pronunciation)return null;
  return {word:match.word,source:"Datamuse fallback",phonetic:pronunciation,phonetics:pronunciation?[{text:pronunciation}]:[],meanings:[...groups].map(([partOfSpeech,definitions])=>({partOfSpeech,definitions}))};
}

export async function GET(_request:Request,context:{params:Promise<{word:string}>}){
  const {word:raw}=await context.params;
  const word=raw.trim().toLowerCase();
  if(!word||word.length>80||!/^[-a-z' ]+$/i.test(word))return Response.json({error:"Invalid word"},{status:400});
  const saved=cache.get(word);
  if(saved&&saved.expires>Date.now())return saved.entry?Response.json({entry:saved.entry},{headers:{"Cache-Control":"public, max-age=86400"}}):Response.json({error:"Word not found"},{status:404,headers:{"Cache-Control":"public, max-age=3600"}});
  try{
    let entry:DictionaryEntry|null=null;
    try{entry=await freeDictionary(word)}catch{entry=null}
    if(!entry)entry=await datamuse(word);
    if(!entry){cache.set(word,{entry:null,expires:Date.now()+60*60*1000});return Response.json({error:"Word not found"},{status:404});}
    cache.set(word,{entry,expires:Date.now()+CACHE_TIME});
    return Response.json({entry},{headers:{"Cache-Control":"public, max-age=86400"}});
  }catch{return Response.json({error:"Both dictionary services are unavailable"},{status:503,headers:{"Cache-Control":"no-store"}})}
}
