/* ===================================================================
   Readiness scoring + Dashboard / Progress / Settings pages.
   =================================================================== */
"use strict";
CE.MODULES = [
  {key:"foundations", name:"Foundations", icon:"📚", path:"#/foundations"},
  {key:"structuring", name:"Structuring", icon:"🌳", path:"#/structuring"},
  {key:"sizing",      name:"Market Sizing", icon:"📐", path:"#/sizing"},
  {key:"math",        name:"Mental Math", icon:"⚡", path:"#/math"},
  {key:"exhibits",    name:"Exhibits", icon:"📊", path:"#/exhibits"},
  {key:"behavioral",  name:"Behavioral", icon:"🎤", path:"#/behavioral"},
];

CE.moduleReadiness = function(key){
  const s=CE.state;
  const vol=(n,target)=>Math.min(n/target,1);
  switch(key){
    case "foundations":{
      const total=CE.LESSON_COUNT||8, read=Object.keys(s.foundations.read).length;
      return Math.round(read/total*100);
    }
    case "math":{
      if(!s.math.total) return 0;
      const acc=s.math.correct/s.math.total;
      return Math.round(acc*100*vol(s.math.total,60));
    }
    case "structuring":{
      const avg=s.structuring.selfScores.length? s.structuring.selfScores.reduce((a,b)=>a+b,0)/s.structuring.selfScores.length : 0;
      return Math.round((avg/5*100)*vol(s.structuring.attempts,8));
    }
    case "sizing":
      return Math.round(vol(Object.keys(s.sizing.done).length,6)*100);
    case "exhibits":{
      if(!s.exhibits.att) return 0;
      return Math.round(s.exhibits.cor/s.exhibits.att*100*vol(s.exhibits.att,30));
    }
    case "behavioral":
      return Math.round(vol(s.behavioral.stories.length,6)*100);
    default: return 0;
  }
};
CE.overallReadiness = ()=>Math.round(CE.MODULES.reduce((a,m)=>a+CE.moduleReadiness(m.key),0)/CE.MODULES.length);

function readinessColor(p){ return p>=75?"var(--green)":p>=45?"var(--amber)":p>0?"var(--accent)":"var(--border2)"; }

/* ---------------- Dashboard ---------------- */
CE.route("#/", ()=>{
  const s=CE.state;
  const t=CE.tracks[s.activeTrack]||CE.tracks[CE.trackOrder[0]];
  const overall=CE.overallReadiness();
  const answeredToday=s.days[CE.todayStr()]||0;
  const beginner=overall<15;

  const weakest=CE.MODULES.slice().sort((a,b)=>CE.moduleReadiness(a.key)-CE.moduleReadiness(b.key));
  const plan=[
    {icon:"📚", text:"Read a Foundations lesson", path:"#/foundations", show:CE.moduleReadiness("foundations")<80},
    {icon:weakest[0].icon, text:`Drill your weakest skill: ${weakest[0].name}`, path:weakest[0].path, show:true},
    {icon:t?t.icon:"🎯", text:`Work your ${t?t.name:"target"} track`, path:t?"#/track/"+t.id:"#/", show:true},
    {icon:"⚡", text:"10 quick mental-math reps", path:"#/math", show:true},
  ].filter(x=>x.show).slice(0,4);

  return {
    html:`
    ${CE.pageHead("Welcome back 👋", `You're prepping for <b style="color:var(--text)">${t?CE.esc(t.name):"your targets"}</b> and ${CE.trackOrder.length-1} other paths. Small daily reps compound — keep the streak alive.`)}

    <div class="grid cols-4" style="margin-bottom:14px">
      <div class="stat"><div class="big">${overall}%</div><div class="lbl">overall readiness</div></div>
      <div class="stat"><div class="big">🔥 ${s.streak}</div><div class="lbl">day streak</div></div>
      <div class="stat"><div class="big">${answeredToday}</div><div class="lbl">reps today</div></div>
      <div class="stat"><div class="big">${CE.trackOrder.length}</div><div class="lbl">target tracks</div></div>
    </div>

    ${t?`<div class="track-hero">
      <div class="th-badge">${t.primary?"★ Primary target":"Active target"}</div>
      <h1>${t.icon} ${CE.esc(t.name)}</h1>
      <div class="th-role">${CE.esc(t.role||"")}</div>
      ${t.loop?`<div class="loop-steps">${t.loop.map((st,i)=>`<div class="loop-step"><span class="n">${i+1}</span>${CE.esc(st.short||st)}</div>`).join("")}</div>`:""}
      <div class="btn-row" style="margin-top:14px">
        <button class="btn grad" data-nav="#/track/${t.id}">Open ${CE.esc(t.name)} track →</button>
        <button class="btn" data-nav="#/settings">Change target</button>
      </div>
    </div>`:""}

    ${beginner?`<div class="callout"><div class="c-t">New here? Start with the fundamentals</div>
      You marked yourself a beginner — perfect. Do this in order: read <a data-nav="#/foundations">Foundations</a> → try <a data-nav="#/structuring">Structuring</a> → then a <a data-nav="#/math">Math</a> drill. Nothing here assumes prior knowledge.</div>`:""}

    <div class="grid cols-2">
      <div class="card">
        <h3>📋 Today's plan</h3>
        <div class="row-list" style="margin-top:10px">
          ${plan.map(p=>`<button class="rowcard" data-nav="${p.path}"><span class="r-ico">${p.icon}</span>
            <span class="r-main"><span class="r-title">${CE.esc(p.text)}</span></span><span class="r-arrow">→</span></button>`).join("")}
        </div>
      </div>
      <div class="card">
        <h3>📊 Skill readiness</h3>
        <div style="margin-top:10px">
        ${CE.MODULES.map(m=>{const p=CE.moduleReadiness(m.key);return `
          <div style="margin-bottom:11px; cursor:pointer" data-nav="${m.path}">
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px">
              <span>${m.icon} ${m.name}</span><span class="muted">${p}%</span></div>
            <div class="bar"><div style="width:${p}%; background:${readinessColor(p)}"></div></div>
          </div>`;}).join("")}
        </div>
      </div>
    </div>
    `};
});

/* ---------------- Progress ---------------- */
CE.route("#/progress", ()=>{
  const s=CE.state;
  const overall=CE.overallReadiness();
  const days=Object.keys(s.days).length;
  const totalReps=Object.values(s.days).reduce((a,b)=>a+b,0);
  return {
    html:`
    ${CE.pageHead("Progress", "Your readiness across skills and targets. Everything is saved on this device — export a backup any time.")}
    <div class="grid cols-4" style="margin-bottom:14px">
      <div class="stat"><div class="big">${overall}%</div><div class="lbl">overall readiness</div></div>
      <div class="stat"><div class="big">🔥 ${s.streak}</div><div class="lbl">day streak</div></div>
      <div class="stat"><div class="big">${totalReps}</div><div class="lbl">total reps</div></div>
      <div class="stat"><div class="big">${days}</div><div class="lbl">active days</div></div>
    </div>

    <div class="card">
      <h3>Skill modules</h3>
      <div style="margin-top:12px">
      ${CE.MODULES.map(m=>{const p=CE.moduleReadiness(m.key);return `
        <div class="topicrow" style="margin-bottom:13px; cursor:pointer" data-nav="${m.path}">
          <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:5px">
            <span>${m.icon} ${m.name}</span><span class="muted">${p}%</span></div>
          <div class="bar"><div style="width:${p}%; background:${readinessColor(p)}"></div></div>
        </div>`;}).join("")}
      </div>
    </div>

    <div class="card">
      <h3>Target tracks</h3>
      <div class="row-list" style="margin-top:10px">
      ${CE.trackOrder.map(id=>{const t=CE.tracks[id]; const ts=CE.trackState(id); const done=Object.keys(ts.done).length; const total=(t.checklist||[]).length||1;
        const p=Math.round(done/total*100);
        return `<button class="rowcard" data-nav="#/track/${id}"><span class="r-ico">${t.icon}</span>
          <span class="r-main"><span class="r-title">${CE.esc(t.name)} ${t.primary?"★":""}</span>
          <span class="r-desc">${done}/${total} prep steps done</span>
          <div class="bar" style="margin-top:6px"><div style="width:${p}%; background:${readinessColor(p)}"></div></div></span>
          <span class="r-arrow">→</span></button>`;}).join("")}
      </div>
    </div>

    <div class="card">
      <h3>Backup & reset</h3>
      <p class="lead">Progress lives in this browser. Export a JSON backup to keep it safe or move devices.</p>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" id="expBtn">⬇ Export progress</button>
        <button class="btn" id="impBtn">⬆ Import progress</button>
        <button class="btn danger" id="resetBtn">Reset everything</button>
      </div>
      <input type="file" id="impFile" accept="application/json" style="display:none">
    </div>
    `,
    mount(root){
      CE.$("#expBtn",root).onclick=()=>{
        const blob=new Blob([JSON.stringify(CE.state,null,2)],{type:"application/json"});
        const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
        a.download=`caseedge-progress-${CE.todayStr()}.json`; a.click(); URL.revokeObjectURL(a.href);
        CE.toast("Backup downloaded ✓");
      };
      CE.$("#impBtn",root).onclick=()=>CE.$("#impFile",root).click();
      CE.$("#impFile",root).onchange=e=>{
        const f=e.target.files[0]; if(!f)return;
        const r=new FileReader();
        r.onload=()=>{ try{ CE.state=JSON.parse(r.result); CE.save(); CE.toast("Progress imported ✓"); CE.go("#/progress"); }
          catch(_){ CE.toast("That file couldn't be read"); } };
        r.readAsText(f);
      };
      CE.$("#resetBtn",root).onclick=()=>{ if(confirm("Wipe ALL progress on this device?")){ CE.reset(); CE.go("#/"); } };
    }
  };
});

/* ---------------- Generic track page ---------------- */
CE.route("#/track/:id", (p)=>{
  const t=CE.tracks[p.id];
  if(!t) return `<div class="card"><h2>Unknown track</h2><p class="lead"><a data-nav="#/">Back home</a></p></div>`;
  const ts=CE.trackState(t.id);
  const isPrimary=CE.state.activeTrack===t.id;
  return {
    html:`
    <div class="breadcrumb"><a data-nav="#/">Home</a> › Targets › ${CE.esc(t.name)}</div>
    <div class="track-hero">
      <div class="th-badge">${t.primary?"★ Primary target":"Target track"}</div>
      <h1>${t.icon} ${CE.esc(t.name)}</h1>
      <div class="th-role">${CE.esc(t.role||"")}</div>
      <p class="lead" style="margin-top:10px">${t.tagline||""}</p>
      ${t.loop?`<div style="margin-top:12px"><div class="c-t" style="color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Interview loop</div>
        <div class="loop-steps">${t.loop.map((st,i)=>`<div class="loop-step"><span class="n">${i+1}</span>${CE.esc(st.short)}</div>`).join("")}</div></div>`:""}
      <div class="btn-row" style="margin-top:14px">
        <button class="btn ${isPrimary?"":"grad"}" id="setPrimary" ${isPrimary?"disabled":""}>${isPrimary?"★ Your primary target":"Set as primary target"}</button>
      </div>
    </div>

    ${t.loop && t.loop.some(s=>s.detail)?`<div class="card"><h3>The loop, step by step</h3>
      ${t.loop.map((st,i)=>st.detail?`<div style="margin:10px 0"><b>${i+1}. ${CE.esc(st.short)}</b><br><span class="muted small">${st.detail}</span></div>`:"").join("")}</div>`:""}

    ${t.tests?`<div class="card"><h3>What they're really testing</h3><ul style="margin:8px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.7">
      ${t.tests.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}

    <div class="card">
      <h3>✅ Your prep checklist</h3>
      <p class="lead">Work these in order. Check them off as you go — this drives your track readiness.</p>
      <div class="row-list" id="checklist" style="margin-top:12px">
        ${(t.checklist||[]).map(c=>{const done=ts.done[c.id];return `
          <div class="rowcard" style="cursor:default">
            <button class="icon-btn" data-check="${c.id}" style="font-size:20px">${done?"☑️":"⬜"}</button>
            <span class="r-main"><span class="r-title" style="${done?"opacity:.6;text-decoration:line-through":""}">${CE.esc(c.text)}</span></span>
            ${c.path?`<button class="btn sm" data-nav="${c.path}">Go →</button>`:""}
          </div>`;}).join("")}
      </div>
    </div>

    ${(t.sections||[]).map(sec=>`<div class="card"><h3>${sec.icon||""} ${CE.esc(sec.title)}</h3><div style="margin-top:8px">${sec.html}</div></div>`).join("")}
    `,
    mount(root){
      const sp=CE.$("#setPrimary",root);
      if(sp && !sp.disabled) sp.onclick=()=>{ CE.state.activeTrack=t.id; CE.save(); CE.toast(t.name+" is now your primary ✓"); CE.go("#/track/"+t.id); };
      CE.$$("[data-check]",root).forEach(b=>b.onclick=()=>{
        const id=b.dataset.check; if(ts.done[id])delete ts.done[id]; else { ts.done[id]=1; CE.bumpActivity(); }
        CE.save(); CE.go("#/track/"+t.id);
      });
    }
  };
});

/* ---------------- Settings ---------------- */
CE.route("#/settings", ()=>{
  const s=CE.state;
  return {
    html:`
    ${CE.pageHead("Settings", "Choose your primary target and optionally connect a Claude API key for automated Coach feedback.")}
    <div class="card">
      <h3>🎯 Primary target</h3>
      <p class="lead">Sets the headline track on your dashboard. All tracks stay available.</p>
      <div class="chips" id="trackChips" style="margin-top:12px">
        ${CE.trackOrder.map(id=>`<button class="chip ${s.activeTrack===id?"sel":""}" data-track="${id}">${CE.tracks[id].icon} ${CE.esc(CE.tracks[id].name)}</button>`).join("")}
      </div>
    </div>
    <div class="card">
      <h3>🔑 Claude API key <span class="badge">optional</span></h3>
      <p class="lead">Coach Mode works with <b style="color:var(--text)">no key</b> — it builds a prompt you paste into your Claude subscription. If you'd rather get feedback automatically inside the app, paste an <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Anthropic API key</a> (billed separately from your Claude.ai plan, pennies per use). It's stored only in this browser.</p>
      <label class="fl">API key</label>
      <input class="ti" id="apiKey" type="password" placeholder="sk-ant-..." value="${CE.esc(s.settings.apiKey||"")}">
      <div class="btn-row" style="margin-top:12px">
        <button class="btn primary" id="saveKey">Save key</button>
        <button class="btn" id="clearKey">Clear</button>
      </div>
      <div class="callout amber" style="margin-top:14px"><b>Note:</b> your Claude.ai subscription can't power in-app API calls — that needs a separate API key. The copy-paste Coach flow uses your subscription and costs nothing, so a key is never required.</div>
    </div>
    <div class="card" id="cloudSync"></div>
    `,
    mount(root){
      CE.$$("#trackChips .chip",root).forEach(c=>c.onclick=()=>{
        CE.state.activeTrack=c.dataset.track; CE.save();
        CE.$$("#trackChips .chip",root).forEach(x=>x.classList.toggle("sel",x===c));
        CE.toast("Primary target set ✓");
      });
      CE.$("#saveKey",root).onclick=()=>{ CE.state.settings.apiKey=CE.$("#apiKey",root).value.trim(); CE.save(); CE.toast("Key saved ✓"); };
      CE.$("#clearKey",root).onclick=()=>{ CE.state.settings.apiKey=""; CE.save(); CE.$("#apiKey",root).value=""; CE.toast("Key cleared"); };
      if(CE.sync) CE.sync.mountSettings(CE.$("#cloudSync",root)); else CE.$("#cloudSync",root).remove();
    }
  };
});
