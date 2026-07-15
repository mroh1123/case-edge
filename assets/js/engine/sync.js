/* ===================================================================
   Cloud Sync (Supabase, sync-code style) — optional cross-device sync.
   Data lives on the USER'S own free Supabase project. No per-use login:
   you paste a one-time "setup string" (URL + anon key + code) per device.
   The app works fully without this; it's a convenience mirror on top of
   localStorage, designed so a real login can replace the code later.
   =================================================================== */
"use strict";
(function(){
  const origSave = CE.save;             // raw localStorage persist (no push)
  let pushTimer=null, applyingRemote=false, statusText="";

  function s(){ return CE.state.sync; }
  function cleanUrl(u){ return (u||"").trim().replace(/\/+$/,""); }
  function ready(){ const x=s(); return x.enabled && x.url && x.key && x.code; }
  function serialize(){ const c=JSON.parse(JSON.stringify(CE.state)); delete c.sync; return c; }
  function looksValid(d){ return d && typeof d==="object" && (d.v || d.math || d.foundations); }

  function b64urlEncode(obj){
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  }
  function b64urlDecode(str){
    str=str.trim().replace(/-/g,"+").replace(/_/g,"/"); while(str.length%4)str+="=";
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  }
  function newCode(){
    const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let out="";
    const arr=new Uint8Array(16); (crypto||window.crypto).getRandomValues(arr);
    for(let i=0;i<16;i++){ out+=a[arr[i]%a.length]; if(i%4===3&&i<15)out+="-"; }
    return out; // e.g. "K7P2-9QMR-..."
  }
  function setupString(){ const x=s(); return b64urlEncode({u:x.url,k:x.key,c:x.code}); }

  function status(msg){ statusText=msg||""; const el=document.getElementById("syncStatus"); if(el)el.textContent=statusText; }
  function explain(code){
    if(code===404) return "⚠️ Table not found — run the setup SQL in Supabase (SQL Editor), then Sync now.";
    if(code===401 || code===403) return "⚠️ Invalid URL or anon key — double-check both in Settings.";
    return "⚠️ Couldn't reach your Supabase ("+code+") — working locally.";
  }

  function applyRemote(data){
    applyingRemote=true;
    for(const k in data){ if(k==="sync")continue; CE.state[k]=data[k]; }
    origSave();
    applyingRemote=false;
  }

  async function pull(){
    const x=s(); if(!x.url||!x.key||!x.code) return {ok:false};
    try{
      const res=await fetch(`${x.url}/rest/v1/progress?code=eq.${encodeURIComponent(x.code)}&select=data,updated_at`,
        {headers:{apikey:x.key, Authorization:"Bearer "+x.key}});
      if(!res.ok) return {ok:false, status:res.status};
      const rows=await res.json();
      if(!Array.isArray(rows)||!rows.length) return {ok:true, empty:true};
      return {ok:true, data:rows[0].data, updated_at:Date.parse(rows[0].updated_at)||0};
    }catch(e){ return {ok:false, error:e.message}; }
  }

  async function push(){
    const x=s(); if(!ready()) return {ok:false};
    try{
      const res=await fetch(`${x.url}/rest/v1/progress`,{
        method:"POST",
        headers:{apikey:x.key, Authorization:"Bearer "+x.key, "Content-Type":"application/json",
                 Prefer:"resolution=merge-duplicates,return=minimal"},
        body:JSON.stringify({code:x.code, data:serialize(), updated_at:new Date(x.updatedAt||Date.now()).toISOString()})
      });
      if(res.ok){ x.lastSync=Date.now(); origSave(); status("Synced ✓ "+new Date().toLocaleTimeString()); return {ok:true}; }
      status(explain(res.status)); return {ok:false, status:res.status};
    }catch(e){ status("Offline — will retry"); return {ok:false, error:e.message}; }
  }

  /* pull remote; adopt it only if it's valid AND newer than local. Never
     wipes local on error/empty — worst case we just push local up. */
  async function reconcile(reRender){
    if(!ready()) return;
    const r=await pull();
    if(r.ok && !r.empty && looksValid(r.data)){
      if((r.updated_at||0) > (s().updatedAt||0)){
        applyRemote(r.data); s().updatedAt=r.updated_at; s().lastSync=Date.now(); origSave();
        status("Pulled latest ✓");
        if(reRender) CE.go(location.hash);
      } else {
        push();  // local is newer-or-equal → send it up
      }
    } else if(r.ok && r.empty){
      push();    // nothing stored yet → seed the row
    } else {
      status(explain(r.status||0));
    }
  }

  /* wrap CE.save: stamp a local change time + debounce a push */
  CE.save=function(){
    if(ready() && !applyingRemote) s().updatedAt=Date.now();
    origSave();
    if(ready() && !applyingRemote){ clearTimeout(pushTimer); pushTimer=setTimeout(()=>push(), 2500); }
  };

  CE.sync={
    push, pull, reconcile, setupString, _status:status,
    enable(url,key,code){
      const x=s(); x.url=cleanUrl(url); x.key=(key||"").trim(); x.code=(code||newCode()).trim().toUpperCase();
      x.enabled=true; x.updatedAt=Date.now(); origSave();
      return x.code;
    },
    linkFrom(str){
      const o=b64urlDecode(str); if(!o||!o.u||!o.k||!o.c) throw new Error("That setup string isn't valid.");
      const x=s(); x.url=cleanUrl(o.u); x.key=o.k; x.code=o.c; x.enabled=true; x.updatedAt=0; origSave();
    },
    disconnect(){ const x=s(); x.enabled=false; x.url=""; x.key=""; x.code=""; x.updatedAt=0; x.lastSync=null; origSave(); },

    mountSettings(root){
      if(!root) return;
      const x=s();
      if(!x.enabled){
        root.innerHTML=`
          <h3>☁️ Cross-device sync <span class="badge">optional</span></h3>
          <p class="lead">Sync progress across your MacBook, iPhone, and PC using your <b style="color:var(--text)">own free Supabase project</b> (data stays on infrastructure you control). One-time setup, then link each device with a code.</p>
          <details style="margin:10px 0">
            <summary style="cursor:pointer;font-weight:600">Setup steps (do this once, ~5 min)</summary>
            <ol style="margin:10px 0 0 18px; color:var(--muted); font-size:13.5px; line-height:1.7">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a>.</li>
              <li>Open <b>SQL Editor</b> and run the snippet below (creates one table).</li>
              <li>In <b>Project Settings → API</b>, copy your <b>Project URL</b> and <b>anon public</b> key.</li>
              <li>Paste both here and press <b>Enable sync</b>.</li>
            </ol>
            <pre class="coach-prompt" style="margin-top:10px">create table if not exists public.progress (
  code text primary key,
  data jsonb,
  updated_at timestamptz default now()
);
alter table public.progress enable row level security;
drop policy if exists "sync by code" on public.progress;
create policy "sync by code" on public.progress
  for all to anon using (true) with check (true);</pre>
          </details>
          <label class="fl">Supabase Project URL</label>
          <input class="ti" id="syUrl" placeholder="https://xxxx.supabase.co">
          <label class="fl">anon public key</label>
          <input class="ti" id="syKey" type="password" placeholder="eyJhbGci...">
          <div class="btn-row" style="margin-top:12px">
            <button class="btn grad" id="syEnable">Enable sync →</button>
          </div>
          <hr class="sep">
          <label class="fl">Already set up on another device? Paste its setup string</label>
          <textarea class="ta" id="syLink" style="min-height:70px" placeholder="paste the setup string from your first device"></textarea>
          <button class="btn" id="syLinkBtn" style="margin-top:8px">Link this device</button>
          <div class="callout amber" style="margin-top:14px"><b>Privacy:</b> anyone with your setup string / code can read and overwrite your progress. Keep it private. Your Supabase anon key is safe to store in-browser (it's meant for client apps). This is a lightweight code-based link — upgradeable to a full login later.</div>`;
        CE.$("#syEnable",root).onclick=()=>{
          const url=CE.$("#syUrl",root).value, key=CE.$("#syKey",root).value;
          if(!url.trim()||!key.trim()){ CE.toast("Paste both the URL and the anon key"); return; }
          const code=CE.sync.enable(url,key);
          CE.sync.reconcile(true);
          CE.toast("Sync enabled ✓"); CE.go("#/settings");
        };
        CE.$("#syLinkBtn",root).onclick=()=>{
          try{ CE.sync.linkFrom(CE.$("#syLink",root).value); }
          catch(e){ CE.toast(e.message); return; }
          CE.sync.reconcile(true);
          CE.toast("Device linked ✓"); CE.go("#/settings");
        };
      } else {
        root.innerHTML=`
          <h3>☁️ Cross-device sync <span class="badge" style="color:var(--green)">on</span></h3>
          <p class="lead">Syncing to your Supabase project. Link another device by copying the setup string below and pasting it there.</p>
          <div class="small muted" id="syncStatus" style="margin:6px 0">${x.lastSync?"Last synced "+new Date(x.lastSync).toLocaleString():"Not synced yet"}</div>
          <label class="fl">Your sync code</label>
          <input class="ti" id="syCode" readonly value="${CE.esc(x.code)}">
          <label class="fl">Setup string (paste this on your other devices)</label>
          <textarea class="ta" id="sySetup" readonly style="min-height:70px">${CE.esc(setupString())}</textarea>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn grad" id="syCopy">📋 Copy setup string</button>
            <button class="btn" id="sySync">🔄 Sync now</button>
            <button class="btn danger" id="syOff">Disconnect</button>
          </div>`;
        CE.$("#syCopy",root).onclick=()=>CE.copy(setupString());
        CE.$("#sySync",root).onclick=async()=>{ status("Syncing…"); await CE.sync.reconcile(true); await push(); CE.toast("Synced ✓"); };
        CE.$("#syOff",root).onclick=()=>{ if(confirm("Disconnect sync on this device? Your local progress stays; it just stops syncing.")){ CE.sync.disconnect(); CE.go("#/settings"); } };
      }
    }
  };

  /* on load: if enabled, reconcile in the background and re-render if remote won */
  if(ready()){ setTimeout(()=>CE.sync.reconcile(true), 400); }
})();
