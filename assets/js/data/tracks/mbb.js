/* ===================================================================
   Track: MBB — McKinsey, Bain, BCG. Case-heavy.
   =================================================================== */
"use strict";
CE.registerTrack({
  id:"mbb", name:"MBB (McKinsey/Bain/BCG)", icon:"📈", primary:false,
  role:"Management consulting — Associate / Consultant (post-MBA)",
  tagline:"The gold-standard case interview: structure a business problem, drive the analysis with clean math and exhibit reading, and deliver a crisp, top-down recommendation — plus a personal-experience interview. Bain and BCG cases are often interviewer- or candidate-led; McKinsey uses a more interviewer-led format with its Personal Experience Interview (PEI).",
  loop:[
    {short:"Fit / PEI", detail:"Personal Experience Interview (McKinsey) or fit questions: leadership, impact, drive. STAR stories with depth."},
    {short:"Case interview (round 1)", detail:"1–2 cases: structure, market math, exhibits, recommendation. Bain/BCG often candidate-led; McKinsey interviewer-led."},
    {short:"Case interview (final round)", detail:"More cases with senior partners; sometimes a written or group case."},
  ],
  tests:[
    "<b>Structure</b> — MECE frameworks tailored to the prompt, not memorized",
    "<b>Quantitative</b> — fast, accurate case math and market sizing",
    "<b>Exhibit reading</b> — pull the insight, do the math the chart invites",
    "<b>Synthesis</b> — top-down recommendation with reasons and risks",
    "<b>PEI / fit</b> — genuine leadership and impact stories",
  ],
  checklist:[
    {id:"fw", text:"Learn the core frameworks (profitability, entry, M&A, pricing)", path:"#/structuring"},
    {id:"struct", text:"Practice 3+ structuring prompts and self-score", path:"#/structuring"},
    {id:"size", text:"Do 3 market-sizing walkthroughs", path:"#/sizing"},
    {id:"math", text:"Get math avg under ~6s (Smart mix drills)", path:"#/math"},
    {id:"exhibit", text:"Run the exhibit drill until 80%+", path:"#/exhibits"},
    {id:"pei", text:"Build 3 PEI/fit stories (leadership, impact, drive)", path:"#/behavioral"},
  ],
  sections:[
    {title:"How to run a case", icon:"🎯", html:`
      <ol style="margin:8px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.8">
        <li><b>Play back & clarify</b> the objective in one sentence, ask 1–2 sharp questions.</li>
        <li><b>Structure</b> (take 30–60s): lay out a MECE framework and walk the interviewer through it top-down.</li>
        <li><b>Drive the analysis</b>: pick a branch, request data, do the math, read exhibits, state insights as you go.</li>
        <li><b>Synthesize</b>: "My recommendation is X, for three reasons… the key risk is Y, which I'd validate by Z."</li>
      </ol>
      <div class="callout" style="margin-top:12px"><div class="c-t">The difference-maker</div>Be <b>hypothesis-driven</b> and <b>top-down</b>. Lead with your answer, then support it. Silence while you compute is fine — narrate the plan first.</div>`},
    {title:"Firm flavor", icon:"🏢", html:`
      <ul style="margin:6px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.7">
        <li><b>McKinsey</b> — interviewer-led cases; strong emphasis on the PEI (a deep, single-story-per-theme format). Prepare 2–3 rich stories you can go three layers deep on.</li>
        <li><b>Bain</b> — candidate-led, warm culture; often results-oriented cases. Drive the case yourself.</li>
        <li><b>BCG</b> — mix of formats; values creativity and structure. Expect exhibits.</li>
      </ul>`},
  ]
});
