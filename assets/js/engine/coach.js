/* ===================================================================
   Coach Mode — turns any open-ended answer into a ready-to-paste prompt
   for the user's Claude subscription (no API key needed). If the user
   has added an API key in Settings, offers an optional direct send.
   =================================================================== */
"use strict";
CE.buildCoachPrompt = function(cfg){
  const lines=[];
  lines.push(`You are an expert ${cfg.role||"interview coach"} helping me prepare for MBA recruiting.`);
  if(cfg.context) lines.push(`Context: ${cfg.context}`);
  lines.push("");
  lines.push(`THE PROMPT I WAS GIVEN:\n${cfg.question}`);
  lines.push("");
  lines.push(`MY ANSWER:\n${cfg.answer||"(I left this blank — please give me a strong model answer instead.)"}`);
  if(cfg.rubric && cfg.rubric.length){
    lines.push("");
    lines.push("SCORE ME (1–5) ON EACH AND EXPLAIN WHY:");
    cfg.rubric.forEach(r=>lines.push(`- ${r}`));
  }
  lines.push("");
  lines.push("Please give me: (1) a score on each criterion with specifics, (2) the two highest-leverage things to fix, (3) a concrete improved version, and (4) one follow-up question an interviewer would likely ask next.");
  return lines.join("\n");
};

CE.coach = function(cfg){
  const prompt=CE.buildCoachPrompt(cfg);
  const hasKey=!!(CE.state.settings.apiKey||"").trim();
  const modal=CE.modal(`
    <button class="modal-close">&times;</button>
    <h2>🧑‍🏫 Coach Mode</h2>
    <p class="lead" style="margin-bottom:12px">Copy this prompt and paste it into Claude (this app's chat, or claude.ai) to get personalized feedback — no API key or extra cost. Your Claude subscription handles it.</p>
    <pre class="coach-prompt" id="coachPrompt">${CE.esc(prompt)}</pre>
    <div class="btn-row" style="margin-top:14px">
      <button class="btn grad" id="coachCopy">📋 Copy prompt</button>
      <a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Open claude.ai ↗</a>
      ${hasKey?`<button class="btn" id="coachSend">⚡ Get AI feedback now</button>`:""}
    </div>
    ${cfg.model?`<hr class="sep"><details><summary style="cursor:pointer;font-weight:600">Peek at a model answer</summary><div class="callout" style="margin-top:10px">${cfg.model}</div></details>`:""}
    <div id="coachResult"></div>
  `);
  CE.$("#coachCopy",modal).onclick=()=>CE.copy(prompt);
  const sendBtn=CE.$("#coachSend",modal);
  if(sendBtn) sendBtn.onclick=()=>directSend(prompt, CE.$("#coachResult",modal), sendBtn);
};

async function directSend(prompt, out, btn){
  const key=(CE.state.settings.apiKey||"").trim();
  btn.disabled=true; btn.textContent="Thinking…";
  out.innerHTML=`<div class="callout" style="margin-top:14px">Contacting Claude…</div>`;
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "content-type":"application/json",
        "x-api-key":key,
        "anthropic-version":"2023-06-01",
        "anthropic-dangerous-direct-browser-access":"true"
      },
      body:JSON.stringify({model:"claude-sonnet-5", max_tokens:1200, messages:[{role:"user", content:prompt}]})
    });
    if(!res.ok){ throw new Error("API returned "+res.status+" — check your key in Settings."); }
    const data=await res.json();
    const text=(data.content||[]).map(b=>b.text||"").join("\n");
    out.innerHTML=`<hr class="sep"><h3>Claude's feedback</h3><div class="callout green" style="white-space:pre-wrap">${CE.esc(text)}</div>`;
  }catch(e){
    out.innerHTML=`<div class="callout amber" style="margin-top:14px"><b>Couldn't reach the API.</b> ${CE.esc(e.message)}<br>Use the copy-paste method above instead — it always works.</div>`;
  }finally{ btn.disabled=false; btn.textContent="⚡ Get AI feedback now"; }
}
