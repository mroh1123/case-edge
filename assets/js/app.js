/* ===================================================================
   CaseEdge core framework: namespace, state, storage, router, nav.
   Loaded first. Modules/tracks register into CE.* then CE.start() runs.
   =================================================================== */
"use strict";
window.CE = (function(){
  const CE = {};

  /* ---------- tiny helpers ---------- */
  CE.$  = (s,r=document)=>r.querySelector(s);
  CE.$$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  CE.ri = (a,b)=>a+Math.floor(Math.random()*(b-a+1));
  CE.pick = a=>a[Math.floor(Math.random()*a.length)];
  CE.shuffle = a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  CE.esc = s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  CE.fmt = n=>{
    if(!isFinite(n))return String(n);
    if(Math.abs(n)>=1e9 && n%1e8===0) return (n/1e9)+"B";
    if(Math.abs(n)>=1e6 && n%1e5===0) return (n/1e6)+"M";
    return n.toLocaleString("en-US",{maximumFractionDigits:2});
  };
  CE.uid = ()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  CE.todayStr = ()=>new Date().toISOString().slice(0,10);

  /* ---------- state ---------- */
  const DEFAULT = {
    v:1,
    activeTrack:"palantir",
    streak:0, lastDay:null, days:{},
    onboarded:false,
    math:{topics:{}, total:0, correct:0, timeSum:0},
    structuring:{attempts:0, done:{}, selfScores:[]},
    sizing:{attempts:0, done:{}},
    exhibits:{att:0, cor:0, time:0, done:{}},
    behavioral:{stories:[], practiced:{}},
    foundations:{read:{}},
    tracks:{},            // per-track {done:{}}
    settings:{apiKey:""}
  };
  function load(){
    try{
      const raw=JSON.parse(localStorage.getItem("caseedge")||"null");
      if(!raw) return structuredClone(DEFAULT);
      return deepMerge(structuredClone(DEFAULT), raw);
    }catch(e){ return structuredClone(DEFAULT); }
  }
  function deepMerge(base, over){
    for(const k in over){
      if(over[k] && typeof over[k]==="object" && !Array.isArray(over[k]) && typeof base[k]==="object" && !Array.isArray(base[k]))
        deepMerge(base[k], over[k]);
      else base[k]=over[k];
    }
    return base;
  }
  CE.state = load();
  CE.save = ()=>{ try{ localStorage.setItem("caseedge", JSON.stringify(CE.state)); }catch(e){} };
  CE.reset = ()=>{ CE.state=structuredClone(DEFAULT); CE.save(); };
  CE.trackState = id=>{ if(!CE.state.tracks[id]) CE.state.tracks[id]={done:{}}; return CE.state.tracks[id]; };

  /* activity + streak: call once per completed drill/session action */
  CE.bumpActivity = ()=>{
    const d=CE.todayStr();
    CE.state.days[d]=(CE.state.days[d]||0)+1;
    if(CE.state.lastDay!==d){
      const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
      CE.state.streak = (CE.state.lastDay===y) ? CE.state.streak+1 : 1;
      CE.state.lastDay=d;
    }
    CE.save();
  };

  /* ---------- track registry ---------- */
  CE.tracks = {};              // id -> track object
  CE.trackOrder = [];
  CE.registerTrack = t=>{ CE.tracks[t.id]=t; if(!CE.trackOrder.includes(t.id))CE.trackOrder.push(t.id); };

  /* ---------- router ---------- */
  CE.routes = [];              // {re, keys, handler}
  CE.route = (pattern, handler)=>{
    const keys=[];
    const re=new RegExp("^"+pattern.replace(/:[^/]+/g,m=>{keys.push(m.slice(1));return "([^/]+)";})+"$");
    CE.routes.push({re, keys, handler, pattern});
  };
  CE.go = path=>{ if(location.hash===path){ renderApp(); } else { location.hash=path; } };
  function currentPath(){ return location.hash || "#/"; }
  function matchRoute(path){
    const clean=path.split("?")[0];
    for(const r of CE.routes){
      const m=clean.match(r.re);
      if(m){ const p={}; r.keys.forEach((k,i)=>p[k]=decodeURIComponent(m[i+1])); return {r, params:p}; }
    }
    return null;
  }

  function renderApp(){
    const path=currentPath();
    const app=CE.$("#app");
    const match=matchRoute(path);
    let out;
    if(match){ try{ out=match.r.handler(match.params); }catch(e){ console.error(e); out=`<div class="card"><h2>Something went wrong</h2><p class="lead">${CE.esc(e.message)}</p></div>`; } }
    else out=`<div class="card"><h2>Not found</h2><p class="lead">No page at <code>${CE.esc(path)}</code>. <a data-nav="#/">Go home</a>.</p></div>`;
    if(out && typeof out==="object"){ app.innerHTML=out.html||""; if(out.mount)out.mount(app); }
    else app.innerHTML=out||"";
    highlightNav(path);
    app.scrollTop=0; window.scrollTo(0,0);
    document.querySelector(".app-shell").classList.remove("menu-open");
  }
  window.addEventListener("hashchange", renderApp);

  /* ---------- navigation UI ---------- */
  CE.nav = [
    {label:null, items:[
      {icon:"🏠", text:"Dashboard", path:"#/"},
      {icon:"📚", text:"Foundations", path:"#/foundations"},
    ]},
    {label:"Skills", items:[
      {icon:"🌳", text:"Structuring", path:"#/structuring"},
      {icon:"📐", text:"Market Sizing", path:"#/sizing"},
      {icon:"⚡", text:"Mental Math", path:"#/math"},
      {icon:"📊", text:"Exhibits", path:"#/exhibits"},
      {icon:"🎤", text:"Behavioral", path:"#/behavioral"},
    ]},
    {label:"Targets", items:"TRACKS"},   // filled at start()
    {label:null, items:[
      {icon:"📈", text:"Progress", path:"#/progress"},
      {icon:"⚙️", text:"Settings", path:"#/settings"},
    ]},
  ];
  function buildSidebar(){
    const trackItems=CE.trackOrder.map(id=>{
      const t=CE.tracks[id];
      return {icon:t.icon, text:t.name, path:"#/track/"+id, pill:t.primary?"★":null};
    });
    const groups=CE.nav.map(g=>({label:g.label, items:g.items==="TRACKS"?trackItems:g.items}));
    const html=groups.map(g=>`
      ${g.label?`<div class="nav-group-label">${g.label}</div>`:`<div class="nav-group"></div>`}
      ${g.items.map(it=>`<button class="nav-item" data-nav="${it.path}">
        <span class="ico">${it.icon}</span><span>${CE.esc(it.text)}</span>${it.pill?`<span class="pill">${it.pill}</span>`:""}
      </button>`).join("")}
    `).join("");
    CE.$("#sidebarNav").innerHTML=html;
  }
  function highlightNav(path){
    CE.$$(".nav-item").forEach(b=>{
      const p=b.getAttribute("data-nav");
      const active = p===path || (p!=="#/" && path.startsWith(p));
      b.classList.toggle("active", active);
    });
  }

  /* ---------- global click delegation ---------- */
  document.addEventListener("click", e=>{
    const nav=e.target.closest("[data-nav]");
    if(nav){ e.preventDefault(); CE.go(nav.getAttribute("data-nav")); return; }
    const acc=e.target.closest("[data-accordion]");
    if(acc){ acc.closest(".lesson").classList.toggle("open"); return; }
    if(e.target.id==="menuToggle"||e.target.closest("#menuToggle")){ document.querySelector(".app-shell").classList.toggle("menu-open"); }
    if(e.target.classList.contains("scrim")){ document.querySelector(".app-shell").classList.remove("menu-open"); }
  });

  /* ---------- toast + clipboard ---------- */
  let toastTimer=null;
  CE.toast = msg=>{
    let t=CE.$("#toast");
    if(!t){ t=document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
    t.textContent=msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"), 2200);
  };
  CE.copy = async text=>{
    try{ await navigator.clipboard.writeText(text); CE.toast("Copied to clipboard ✓"); }
    catch(e){
      const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); CE.toast("Copied to clipboard ✓"); }catch(_){ CE.toast("Copy failed — select manually"); }
      document.body.removeChild(ta);
    }
  };

  /* ---------- modal ---------- */
  CE.modal = html=>{
    closeModal();
    const bg=document.createElement("div"); bg.className="modal-bg"; bg.id="modalBg";
    bg.innerHTML=`<div class="modal">${html}</div>`;
    bg.addEventListener("click", e=>{ if(e.target===bg || e.target.closest(".modal-close")) closeModal(); });
    document.body.appendChild(bg);
    return bg;
  };
  function closeModal(){ const m=CE.$("#modalBg"); if(m)m.remove(); }
  CE.closeModal = closeModal;
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });

  /* ---------- shared page helpers ---------- */
  CE.pageHead = (title, sub, crumb)=>`
    ${crumb?`<div class="breadcrumb">${crumb}</div>`:""}
    <div class="page-head"><h1>${CE.esc(title)}</h1>${sub?`<p>${sub}</p>`:""}</div>`;

  /* ---------- boot ---------- */
  CE.start = ()=>{
    buildSidebar();
    if(!location.hash) location.hash="#/";
    renderApp();
  };

  return CE;
})();
