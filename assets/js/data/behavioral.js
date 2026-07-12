/* ===================================================================
   Behavioral / Fit — STAR story builder mapped to competencies, plus a
   fit-question bank. Stories are reusable across every target track.
   =================================================================== */
"use strict";
CE.COMPETENCIES = ["Leadership","Teamwork / Conflict","Failure / Resilience","Impact / Achievement","Ambiguity / Initiative","Influence / Persuasion"];

CE.FIT_QUESTIONS = [
  {cat:"Motivation", q:"Why consulting?", tip:"Tie problem-solving + variety + steep learning to a real moment you enjoyed it. Avoid clichés like 'I like solving problems' with no evidence."},
  {cat:"Motivation", q:"Why this firm specifically?", tip:"Name 2–3 concrete reasons: people you've met, a practice area, culture, a project. Generic answers sink you."},
  {cat:"Motivation", q:"Why an MBA / why now?", tip:"Connect your past, the gap the MBA fills, and your target role. Keep it a clear narrative."},
  {cat:"Leadership", q:"Tell me about a time you led a team.", tip:"STAR. Emphasize how YOU set direction, motivated others, and handled a setback. Use 'I'."},
  {cat:"Teamwork / Conflict", q:"Describe a conflict on a team and how you handled it.", tip:"Show empathy + a concrete action + resolution. Don't villainize the other person."},
  {cat:"Failure / Resilience", q:"Tell me about a time you failed.", tip:"Pick a real failure, own it, focus on what you changed afterward. Growth is the point."},
  {cat:"Impact / Achievement", q:"What's your proudest professional accomplishment?", tip:"Quantify impact. Make your specific contribution unmistakable."},
  {cat:"Ambiguity / Initiative", q:"Tell me about a time you worked with little direction.", tip:"Great for Palantir/startup roles. Show bias to action, structuring the unknown, and ownership."},
  {cat:"Influence / Persuasion", q:"Describe convincing someone senior to change their mind.", tip:"Show how you used data + stakeholder empathy, not just authority."},
  {cat:"Motivation", q:"Why Palantir / why a deployment role?", tip:"Mission + comfort with ambiguity + wanting to be close to real-world impact. Reference the Indo-Pacific interest authentically."},
];

CE.route("#/behavioral", ()=>{
  return {
    html:`
    ${CE.pageHead("Behavioral & Fit", "Every firm asks these. Build a bank of STAR stories once, tag them by competency, and reuse them across all your targets. Then rehearse fit questions with AI coaching.")}
    <div class="card">
      <h3>🏗️ STAR story builder</h3>
      <p class="lead">Aim for 5–6 flexible stories covering the competencies below. Spend most of your words on <b style="color:var(--text)">Action</b> — what <i>you</i> did.</p>
      <div id="compCoverage" style="margin:12px 0"></div>
      <div id="storyForm"></div>
      <div id="storyList" style="margin-top:16px"></div>
    </div>

    <div class="card">
      <h3>🎤 Fit question bank</h3>
      <p class="lead">Tap a question to rehearse. Type an answer and get AI coaching, or just review the tip.</p>
      <div id="fitList" style="margin-top:10px"></div>
    </div>`,
    mount(root){
      renderCoverage(); renderForm(); renderList(); renderFit();

      function renderCoverage(){
        const used=new Set(CE.state.behavioral.stories.map(s=>s.competency));
        CE.$("#compCoverage",root).innerHTML=CE.COMPETENCIES.map(c=>
          `<span class="comp-tag" style="${used.has(c)?"background:rgba(63,185,80,.18);color:var(--green)":""}">${used.has(c)?"✓ ":""}${c}</span>`).join(" ");
      }
      function renderForm(edit){
        const s=edit||{title:"",competency:CE.COMPETENCIES[0],situation:"",task:"",action:"",result:""};
        CE.$("#storyForm",root).innerHTML=`
          <label class="fl">Story title (for your own reference)</label>
          <input class="ti" id="sfTitle" placeholder="e.g. Turned around the failing club event" value="${CE.esc(s.title)}">
          <label class="fl">Competency it best demonstrates</label>
          <div class="chips" id="sfComp">${CE.COMPETENCIES.map(c=>`<button class="chip ${s.competency===c?"sel":""}" data-c="${CE.esc(c)}">${c}</button>`).join("")}</div>
          <label class="fl">Situation — brief context</label>
          <textarea class="ta" id="sfS" style="min-height:60px">${CE.esc(s.situation)}</textarea>
          <label class="fl">Task — your specific goal or challenge</label>
          <textarea class="ta" id="sfT" style="min-height:60px">${CE.esc(s.task)}</textarea>
          <label class="fl">Action — what <b>you</b> did (spend the most here)</label>
          <textarea class="ta" id="sfA" style="min-height:100px">${CE.esc(s.action)}</textarea>
          <label class="fl">Result — outcome + what you learned (quantify!)</label>
          <textarea class="ta" id="sfR" style="min-height:60px">${CE.esc(s.result)}</textarea>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn grad" id="sfSave">${edit?"Update story":"Save story"}</button>
            ${edit?`<button class="btn" id="sfCancel">Cancel</button>`:""}
          </div>`;
        let comp=s.competency;
        CE.$$("#sfComp .chip",root).forEach(b=>b.onclick=()=>{ comp=b.dataset.c; CE.$$("#sfComp .chip",root).forEach(x=>x.classList.toggle("sel",x===b)); });
        CE.$("#sfSave",root).onclick=()=>{
          const obj={id:edit?edit.id:CE.uid(), title:CE.$("#sfTitle",root).value.trim()||"Untitled story", competency:comp,
            situation:CE.$("#sfS",root).value.trim(), task:CE.$("#sfT",root).value.trim(), action:CE.$("#sfA",root).value.trim(), result:CE.$("#sfR",root).value.trim()};
          if(edit){ const i=CE.state.behavioral.stories.findIndex(x=>x.id===edit.id); CE.state.behavioral.stories[i]=obj; }
          else CE.state.behavioral.stories.push(obj);
          CE.bumpActivity(); CE.toast("Story saved ✓");
          renderForm(); renderList(); renderCoverage();
        };
        if(edit) CE.$("#sfCancel",root).onclick=()=>renderForm();
      }
      function renderList(){
        const list=CE.state.behavioral.stories;
        const el=CE.$("#storyList",root);
        if(!list.length){ el.innerHTML=`<div class="empty"><div class="e-ico">📝</div>No stories yet — build your first one above.</div>`; return; }
        el.innerHTML=`<h3 style="font-size:14px; margin-bottom:8px">Your stories (${list.length})</h3>`+list.map(s=>`
          <div class="rowcard" style="cursor:default">
            <span class="r-ico">🎬</span>
            <span class="r-main"><span class="r-title">${CE.esc(s.title)}</span>
              <span class="r-desc"><span class="comp-tag">${CE.esc(s.competency)}</span> ${CE.esc((s.action||"").slice(0,70))}${(s.action||"").length>70?"…":""}</span></span>
            <span style="display:flex;gap:4px">
              <button class="icon-btn" data-coach="${s.id}" title="AI coaching">🧑‍🏫</button>
              <button class="icon-btn" data-edit="${s.id}" title="edit">✏️</button>
              <button class="icon-btn" data-del="${s.id}" title="delete">🗑️</button>
            </span>
          </div>`).join("");
        CE.$$("[data-edit]",el).forEach(b=>b.onclick=()=>{ renderForm(CE.state.behavioral.stories.find(x=>x.id===b.dataset.edit)); CE.$("#storyForm",root).scrollIntoView({behavior:"smooth",block:"nearest"}); });
        CE.$$("[data-del]",el).forEach(b=>b.onclick=()=>{ if(confirm("Delete this story?")){ CE.state.behavioral.stories=CE.state.behavioral.stories.filter(x=>x.id!==b.dataset.del); CE.save(); renderList(); renderCoverage(); } });
        CE.$$("[data-coach]",el).forEach(b=>b.onclick=()=>{ const s=CE.state.behavioral.stories.find(x=>x.id===b.dataset.coach);
          CE.coach({ role:"behavioral interview coach", context:`MBA recruiting; competency: ${s.competency}.`,
            question:`Behavioral story titled "${s.title}" (${s.competency}). Interviewer prompt style: "Tell me about a time you demonstrated ${s.competency}."`,
            answer:`Situation: ${s.situation}\nTask: ${s.task}\nAction: ${s.action}\nResult: ${s.result}`,
            rubric:["Clear STAR structure","Action focuses on the candidate ('I'), specific and substantial","Result is quantified and includes a learning","Concise and compelling (no rambling)"] }); });
      }
      function renderFit(){
        const cats=[...new Set(CE.FIT_QUESTIONS.map(q=>q.cat))];
        CE.$("#fitList",root).innerHTML=cats.map(cat=>`
          <div class="nav-group-label" style="padding-left:0">${cat}</div>
          ${CE.FIT_QUESTIONS.filter(q=>q.cat===cat).map(q=>`
            <div class="card lesson tight" style="margin-bottom:8px">
              <div class="l-head" data-accordion><h3 style="font-size:14px">${CE.esc(q.q)}</h3><span class="r-arrow">▾</span></div>
              <div class="l-body">
                <div class="callout"><div class="c-t">Coach tip</div>${CE.esc(q.tip)}</div>
                <textarea class="ta" placeholder="Draft your answer here…" data-fit="${CE.esc(q.q)}"></textarea>
                <button class="btn primary sm" data-fitcoach="${CE.esc(q.q)}" style="margin-top:8px">🧑‍🏫 Coach my answer</button>
              </div>
            </div>`).join("")}`).join("");
        CE.$$("[data-fitcoach]",root).forEach(b=>b.onclick=e=>{ e.stopPropagation();
          const q=b.dataset.fitcoach; const ta=CE.$(`[data-fit="${CSS.escape(q)}"]`,root);
          CE.coach({ role:"MBA fit / behavioral interview coach", context:"Consulting & tech recruiting.",
            question:q, answer:ta.value.trim(),
            rubric:["Directly answers the question","Specific and authentic (not generic)","Structured and concise","Leaves a memorable, positive impression"] }); });
      }
    }
  };
});
