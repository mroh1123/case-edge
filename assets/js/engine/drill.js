/* ===================================================================
   Generic drill runner. Handles numeric and multiple-choice questions,
   timer, feedback, results. Modules supply a question stream + hooks.
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

/* config:
   { mount(el), count, next()->question, onResult(q,ok,ms), onComplete(results),
     title }
   question:
   { type:'numeric'|'mc', q, context, tol, ans, choices, correctIndex, how,
     placeholder }
*/
CE.Drill = {
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
          <input id="dInput" inputmode="text" autocomplete="off" placeholder="${c.placeholder||"answer"}">
          <button class="btn primary" id="dGo">Go</button></div>
          ${c.tol>=0.05?`<div class="small muted" style="margin-top:8px">≈ estimate — within ${Math.round(c.tol*100)}% counts</div>`:""}`;
        const inp=CE.$("#dInput",area); inp.focus();
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
