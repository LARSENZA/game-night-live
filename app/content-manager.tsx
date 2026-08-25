"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameType } from "@/lib/types";

type Item={id:number;gameType:GameType;prompt:string;answer:string|null;category:string|null;metadata:string;enabled:boolean;isCustom:boolean};
const TYPES:GameType[]=["spelling","taboo","password","bomb","trivia","wavelength"];
const EMPTY={gameType:"trivia" as GameType,prompt:"",answer:"",category:"",metadata:"{}"};

export function ContentManager({code}:{code:string}){
  const router=useRouter(),[items,setItems]=useState<Item[]>([]),[filter,setFilter]=useState<GameType|"all">("all"),[form,setForm]=useState(EMPTY),[editing,setEditing]=useState<number|null>(null),[importText,setImportText]=useState(""),[status,setStatus]=useState(""),[loading,setLoading]=useState(true),[token,setToken]=useState<string|null>(null),[tokenChecked,setTokenChecked]=useState(false);
  const headers=useMemo(()=>({"content-type":"application/json",authorization:`Bearer ${token??""}`}),[token]);
  const load=useCallback(async()=>{if(!token)return;setLoading(true);const r=await fetch(`/api/rooms/${code}/content`,{headers});const d=await r.json();if(r.ok)setItems(d.items);else setStatus(d.error);setLoading(false)},[code,headers,token]);
  useEffect(()=>{const id=setTimeout(()=>{setToken(localStorage.getItem(`host-token:${code}`));setTokenChecked(true)},0);return()=>clearTimeout(id)},[code]);
  useEffect(()=>{if(!token)return;const id=setTimeout(()=>void load(),0);return()=>clearTimeout(id)},[load,token]);
  const shown=items.filter(item=>filter==="all"||item.gameType===filter);

  async function save(){
    setStatus("");const body={...form,metadata:form.metadata||"{}",...(editing?{id:editing}:{})};
    const r=await fetch(`/api/rooms/${code}/content`,{method:editing?"PATCH":"POST",headers,body:JSON.stringify(editing?body:{items:[body]})});const d=await r.json();
    if(!r.ok)return setStatus(d.error||"Could not save content");setForm(EMPTY);setEditing(null);setStatus(editing?"Custom item updated.":"Custom item added.");await load();
  }
  async function toggle(item:Item){await fetch(`/api/rooms/${code}/content`,{method:"PATCH",headers,body:JSON.stringify({id:item.id,action:"toggle",enabled:!item.enabled})});await load()}
  function edit(item:Item){setEditing(item.id);setForm({gameType:item.gameType,prompt:item.prompt,answer:item.answer??"",category:item.category??"",metadata:item.metadata});window.scrollTo({top:0,behavior:"smooth"})}
  async function importItems(){
    setStatus("");let parsed:unknown[]=[];try{const text=importText.trim();parsed=text.startsWith("[")?JSON.parse(text):parseCsv(text)}catch{return setStatus("Import could not be parsed. Use a JSON array or the CSV columns shown below.")}
    const r=await fetch(`/api/rooms/${code}/content`,{method:"POST",headers,body:JSON.stringify({items:parsed})});const d=await r.json();if(!r.ok)return setStatus(d.error||"Import failed");setImportText("");setStatus(`${d.items.length} items imported.`);await load();
  }

  if(!tokenChecked)return <main className="center-state"><div className="spinner"/><p>Checking host access…</p></main>;
  if(!token)return <main className="center-state"><h1>Host access required</h1><p>Open this page from the room’s host dashboard.</p><button onClick={()=>router.push("/")}>Back home</button></main>;
  return <main className="content-shell">
    <header className="content-header"><div><button className="ghost" onClick={()=>router.push(`/host/${code}`)}>← Host dashboard</button><p className="eyebrow">Room {code}</p><h1>Content manager</h1><p>Default content is protected. Custom content belongs only to this room.</p></div><div className="content-count"><b>{items.filter(i=>i.enabled).length}</b><span>enabled items</span></div></header>
    <section className="editor-card"><h2>{editing?"Edit custom item":"Add custom content"}</h2><div className="editor-grid"><label>Game<select value={form.gameType} onChange={e=>setForm({...form,gameType:e.target.value as GameType})}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></label><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="e.g. Geography"/></label><label className="wide">Prompt or word<textarea value={form.prompt} onChange={e=>setForm({...form,prompt:e.target.value})} placeholder="Enter the question, word or scale prompt"/></label><label>Answer<input value={form.answer} onChange={e=>setForm({...form,answer:e.target.value})} placeholder="Optional"/></label><label>Metadata JSON<input value={form.metadata} onChange={e=>setForm({...form,metadata:e.target.value})} placeholder='{"low":"easy","high":"hard"}'/></label></div><div className="editor-actions">{editing&&<button onClick={()=>{setEditing(null);setForm(EMPTY)}}>Cancel</button>}<button className="primary-action" onClick={save}>{editing?"Save changes":"Add item"}</button></div></section>
    <section className="import-card"><div><h2>Bulk import</h2><p>Paste a JSON array or CSV with: <code>gameType,prompt,answer,category,metadata</code></p></div><textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={'gameType,prompt,answer,category,metadata\ntrivia,What is 9 × 9?,81,Maths,{}'}/><button onClick={importItems}>Import content</button></section>
    {status&&<p className="manager-status">{status}</p>}
    <section className="library-card"><div className="library-toolbar"><div><h2>Content library</h2><p>Disable any default or custom item for this room.</p></div><select value={filter} onChange={e=>setFilter(e.target.value as GameType|"all")}><option value="all">All games</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
      {loading?<p>Loading content…</p>:<div className="content-table">{shown.map(item=><article key={item.id} className={!item.enabled?"disabled":""}><div className="content-badges"><span>{item.gameType}</span><span className={item.isCustom?"custom":"system"}>{item.isCustom?"Custom":"Default"}</span></div><h3>{item.prompt}</h3><p>{[item.category,item.answer].filter(Boolean).join(" · ")||"No answer required"}</p><div className="row-actions">{item.isCustom&&<button onClick={()=>edit(item)}>Edit</button>}<button onClick={()=>toggle(item)}>{item.enabled?"Disable":"Enable"}</button></div></article>)}</div>}
    </section>
  </main>
}

function parseCsv(text:string){
  const lines=text.split(/\r?\n/).filter(Boolean),headers=splitCsv(lines.shift()||"");
  return lines.map(line=>{const values=splitCsv(line),row:Record<string,string>={};headers.forEach((h,i)=>row[h.trim()]=values[i]?.trim()||"");return row});
}
function splitCsv(line:string){const values:string[]=[],pattern=/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g;let match:RegExpExecArray|null;while((match=pattern.exec(line)))values.push(match[1].replace(/^"|"$/g,"").replace(/""/g,'"'));return values}
