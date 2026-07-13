/* ===================================================================
   Generic drill runners.
   - CE.Drill.run   : question-count rounds (numeric + multiple-choice)
   - CE.Drill.sprint: timed rounds (Zetamac-style) — auto-submit on an
     exact match, instant advance, countdown clock.
   Modules supply a question stream + hooks.
   =================================================================== */
"use strict";
CE.parseAns = function(s){
  s=String(s).trim().toLowerCase().replace(/[$,%\s]/g,"");
  let mult=1;
  if(s.endsWith("k")){mult=1e3;s=s.slice(0,-1);}
  else if(s.endsWith("m")){mult=1e6;s=s.slice(0,-1);}
  else if(s.endsWith("b")){mult=1e9;s=s.slice(0,-1);}
  const v=parseFloat(s);
  return isNaN(v)?null:v*mult;
};

/* question:
   { type:'numeric'|'mc', q, context, tol, ans, choices, correctIndex, how,
     placeholder, inputmode ('decimal' default | 'text'), keys (['K','M','B'] or ['±']) }
*/
function answerKeysHTML(c){
  if(!c.keys||!c.keys.length) return "";
  return `<div class="btn-row" style="justify-content:center;margin-top:10px">${
    c.keys.map(k=>`<button class="btn sm" data-anskey="${k}" type="button">${k}</button>`).join("")}</div>`;
}
function wireAnswerKeys(area, input){
  CE.$$("[data-anskey]",area).forEach(b=>b.onclick=()=>{
    const k=b.dataset.anskey;
    if(k==="±") input.value = input.value.startsWith("-") ? input.value.slice(1) : "-"+input.value;
    else input.value += k;
    input.focus();
    input.dispatchEvent(new Event("input"));
  });
}
const exactMatch=(v,ans)=>v!==null && Math.abs(v-ans)<1e-9;

CE.Drill = {
  /* ---------- classic question-count round ---------- */
  run(target, cfg){
    const state={i:0, results:[], cur:null, answered:false, qStart:0, timer:null};
    const count=cfg.count||10;

    function render(){
      target.innerHTML=`
        <div class="drill-top">
          <span id="dQCount">Q 1 / ${count}</span>
          <span id="dQTopic"></span>
          <span id="dQTimer">0.0s</span>
        </div>
        <div class="progressbar"><div id="dPbar" style="width:0%"></div></div>
        <div class="card qbox">
          <div class="qcontext" id="dContext"></div>
          <div class="qtext" id="dQ"></div>
          <div id="dInputArea"></div>
          <div class="feedback" id="dFeedback" style="display:none"></div>
        </div>`;
      nextQ();
    }

    function nextQ(){
      state.cur=cfg.next(state.i);
      state.answered=false;
      const c=state.cur;
      CE.$("#dQCount",target).textContent=`Q ${state.i+1} / ${count}`;
      CE.$("#dQTopic",target).textContent=c.topic||"";
      CE.$("#dPbar",target).style.width=(state.i/count*100)+"%";
      CE.$("#dContext",target).textContent=c.context||"";
      CE.$("#dQ",target).innerHTML=c.q;
      CE.$("#dFeedback",target).style.display="none";
      const area=CE.$("#dInputArea",target);
      if(c.type==="mc"){
        area.innerHTML=`<div class="mc-opts">${c.choices.map((ch,idx)=>
          `<div class="mc-opt" data-idx="${idx}">${ch}</div>`).join("")}</div>`;
        CE.$$(".mc-opt",area).forEach(o=>o.onclick=()=>submitMC(+o.dataset.idx));
      }else{
        area.innerHTML=`<div class="answer-row">
          <input id="dInput" inputmode="${c.inputmode||"decimal"}" autocomplete="off" placeholder="${c.placeholder||"answer"}">
          <button class="btn primary" id="dGo">Go</button></div>
          ${answerKeysHTML(c)}
          ${c.tol>=0.05?`<div class="small muted" style="margin-top:8px">≈ estimate — within ${Math.round(c.tol*100)}% counts</div>`:""}`;
        const inp=CE.$("#dInput",area); inp.focus();
        wireAnswerKeys(area, inp);
        CE.$("#dGo",area).onclick=submitNum;
        inp.onkeydown=e=>{ if(e.key==="Enter") state.answered?advance():submitNum(); };
      }
      state.qStart=performance.now();
      clearInterval(state.timer);
      state.timer=setInterval(()=>{ const t=CE.$("#dQTimer",target); if(t)t.textContent=((performance.now()-state.qStart)/1000).toFixed(1)+"s"; },100);
    }

    function submitNum(){
      const v=CE.parseAns(CE.$("#dInput",target).value);
      if(v===null){ CE.$("#dInput",target).focus(); return; }
      const c=state.cur;
      const ok = c.tol>0 ? Math.abs(v-c.ans)<=Math.abs(c.ans)*c.tol+1e-9 : Math.abs(v-c.ans)<1e-6;
      finishQ(ok, v);
    }
    function submitMC(idx){
      if(state.answered)return;
      const c=state.cur;
      const ok=idx===c.correctIndex;
      CE.$$(".mc-opt",target).forEach((o,i)=>{
        o.style.pointerEvents="none";
        if(i===c.correctIndex)o.classList.add("correct");
        else if(i===idx)o.classList.add("wrong");
        else o.classList.add("dim");
      });
      finishQ(ok, idx);
    }

    function finishQ(ok, given){
      state.answered=true;
      clearInterval(state.timer);
      const ms=performance.now()-state.qStart;
      const c=state.cur;
      state.results.push({q:c.q, ans:c.ans, given, ok, ms, how:c.how, topic:c.topic, choices:c.choices, correctIndex:c.correctIndex});
      if(cfg.onResult)cfg.onResult(c, ok, ms);
      const fb=CE.$("#dFeedback",target);
      fb.style.display="block";
      fb.className="feedback "+(ok?"good":"bad");
      let head;
      if(c.type==="mc") head=ok?`✅ <b>Correct</b> in ${(ms/1000).toFixed(1)}s`:`❌ <b>Not quite.</b> Correct answer highlighted above.`;
      else head=ok?`✅ <b>Correct</b> — ${CE.fmt(c.ans)} in ${(ms/1000).toFixed(1)}s`:`❌ <b>Not quite.</b> Answer: <b>${CE.fmt(c.ans)}</b> (you said ${CE.fmt(given)})`;
      fb.innerHTML=head+(c.how?`<div class="how">💡 ${c.how}</div>`:"")+
        `<div style="margin-top:12px"><button class="btn primary sm" id="dNext">${state.i+1>=count?"See results →":"Next →"}</button></div>`;
      CE.$("#dNext",target).onclick=advance;
      CE.$("#dNext",target).focus();
    }

    function advance(){
      state.i++;
      if(state.i>=count) done();
      else nextQ();
    }
    function done(){
      clearInterval(state.timer);
      CE.bumpActivity();
      if(cfg.onComplete)cfg.onComplete(state.results);
      CE.renderResults(target, state.results, cfg);
    }
    render();
  },

  /* ---------- timed sprint ----------
     cfg: {seconds, next(), onResult(q,ok,ms), onComplete(results)->{best,isRecord}|void,
           backPath, restart()}                                            */
  sprint(target, cfg){
    const state={results:[], cur:null, qStart:0, over:false, locked:false};
    const total=cfg.seconds*1000;
    const t0=performance.now();
    let timer=null, flashTO=null;

    target.innerHTML=`
      <div class="drill-top">
        <span id="sScore">✅ 0</span>
        <span id="sTopic"></span>
        <span id="sTimer" style="font-weight:800; color:var(--text)">${cfg.seconds}s</span>
      </div>
      <div class="progressbar"><div id="sPbar" style="width:100%"></div></div>
      <div class="card qbox">
        <div class="qcontext" id="sContext"></div>
        <div class="qtext" id="sQ"></div>
        <div class="answer-row">
          <input id="sInput" autocomplete="off" placeholder="type answer — exact match auto-submits">
          <button class="btn primary" id="sGo">Go</button>
        </div>
        <div id="sKeys"></div>
        <div id="sFlash" style="margin-top:14px; min-height:22px; font-size:15px; font-weight:600"></div>
      </div>`;

    const inp=CE.$("#sInput",target);
    const flash=CE.$("#sFlash",target);

    function tick(){
      const left=Math.max(0, total-(performance.now()-t0));
      CE.$("#sTimer",target).textContent=Math.ceil(left/1000)+"s";
      CE.$("#sPbar",target).style.width=(left/total*100)+"%";
      if(left<=0) end();
    }
    timer=setInterval(tick,100);

    function nextQ(){
      if(state.over)return;
      clearTimeout(flashTO);
      state.locked=false;
      state.cur=cfg.next();
      const c=state.cur;
      CE.$("#sTopic",target).textContent=c.topic||"";
      CE.$("#sContext",target).textContent=c.context||"";
      CE.$("#sQ",target).innerHTML=c.q;
      inp.setAttribute("inputmode", c.inputmode||"decimal");
      CE.$("#sKeys",target).innerHTML=answerKeysHTML(c);
      wireAnswerKeys(CE.$("#sKeys",target), inp);
      flash.textContent="";
      inp.value=""; inp.disabled=false; inp.focus();
      state.qStart=performance.now();
    }

    function record(ok, given){
      const ms=performance.now()-state.qStart;
      state.results.push({q:state.cur.q, ans:state.cur.ans, given, ok, ms, how:state.cur.how, topic:state.cur.topic});
      if(cfg.onResult)cfg.onResult(state.cur, ok, ms);
      CE.$("#sScore",target).textContent="✅ "+state.results.filter(r=>r.ok).length;
    }

    inp.addEventListener("input",()=>{
      if(state.over||state.locked)return;
      const v=CE.parseAns(inp.value);
      if(exactMatch(v,state.cur.ans)){        // auto-submit on exact match
        record(true, v);
        flash.innerHTML=`<span style="color:var(--green)">✓</span>`;
        nextQ();
      }
    });
    function submit(){
      if(state.over||state.locked)return;
      const v=CE.parseAns(inp.value);
      if(v===null){ inp.focus(); return; }
      const c=state.cur;
      const ok=c.tol>0 ? Math.abs(v-c.ans)<=Math.abs(c.ans)*c.tol+1e-9 : Math.abs(v-c.ans)<1e-6;
      record(ok, v);
      if(ok){ flash.innerHTML=`<span style="color:var(--green)">✓</span>`; nextQ(); }
      else{
        state.locked=true; inp.disabled=true;
        flash.innerHTML=`<span style="color:var(--red)">✗ ${CE.fmt(c.ans)}</span>`;
        flashTO=setTimeout(nextQ, 1300);
      }
    }
    inp.onkeydown=e=>{ if(e.key==="Enter") submit(); };
    CE.$("#sGo",target).onclick=submit;

    function end(){
      state.over=true;
      clearInterval(timer); clearTimeout(flashTO);
      CE.bumpActivity();
      const meta=(cfg.onComplete&&cfg.onComplete(state.results))||{};
      const rs=state.results;
      const cor=rs.filter(r=>r.ok).length;
      const acc=rs.length?Math.round(cor/rs.length*100):0;
      const misses=rs.filter(r=>!r.ok);
      target.innerHTML=`
        <div class="card">
          <h2>${meta.isRecord?"🏆 New personal best!":"⏱️ Sprint over"}</h2>
          <div class="resgrid">
            <div class="res"><div class="big">${cor}</div><div class="lbl">correct in ${cfg.seconds}s</div></div>
            <div class="res"><div class="big">${acc}%</div><div class="lbl">accuracy (${rs.length} attempted)</div></div>
            <div class="res"><div class="big">${meta.best!=null?meta.best:"–"}</div><div class="lbl">personal best</div></div>
          </div>
          ${misses.length?`<h3>Misses to study</h3>`+misses.map(m=>`
            <div class="miss"><b>${m.q}</b> → ${CE.fmt(m.ans)}${m.how?`<br><span class="muted">💡 ${m.how}</span>`:""}</div>`).join(""):""}
          <div class="btn-row" style="margin-top:14px">
            <button class="btn grad" id="sAgain">Sprint again</button>
            ${cfg.backPath?`<button class="btn" data-nav="${cfg.backPath}">Back</button>`:""}
          </div>
        </div>`;
      CE.$("#sAgain",target).onclick=()=>CE.Drill.sprint(target, cfg);
    }
    nextQ();
  }
};

CE.renderResults = function(target, rs, cfg){
  const cor=rs.filter(r=>r.ok).length;
  const avg=rs.reduce((a,r)=>a+r.ms,0)/rs.length/1000;
  const best=Math.min(...rs.map(r=>r.ms))/1000;
  const title = cor===rs.length?"💯 Perfect round!":cor/rs.length>=0.8?"🎯 Strong round!":"Round complete — review below";
  const misses=rs.filter(r=>!r.ok);
  target.innerHTML=`
    <div class="card">
      <h2>${title}</h2>
      <div class="resgrid">
        <div class="res"><div class="big">${Math.round(cor/rs.length*100)}%</div><div class="lbl">accuracy</div></div>
        <div class="res"><div class="big">${avg.toFixed(1)}s</div><div class="lbl">avg / question</div></div>
        <div class="res"><div class="big">${best.toFixed(1)}s</div><div class="lbl">fastest</div></div>
      </div>
      ${misses.length?`<h3>Review your misses</h3>`+misses.map(m=>`
        <div class="miss"><b>${m.q}</b> → ${m.correctIndex!=null?CE.esc(m.choices[m.correctIndex]):CE.fmt(m.ans)}
        ${m.how?`<br><span class="muted">💡 ${m.how}</span>`:""}</div>`).join("")
        :`<p class="lead">No misses — difficulty will scale up as you keep going.</p>`}
      <div class="btn-row" style="margin-top:14px">
        <button class="btn grad" id="rAgain">Drill again</button>
        ${cfg.backPath?`<button class="btn" data-nav="${cfg.backPath}">Back</button>`:""}
      </div>
    </div>`;
  CE.$("#rAgain",target).onclick=()=>CE.Drill.run(target, cfg);
};
