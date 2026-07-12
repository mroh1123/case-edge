/* ===================================================================
   Track: Tier 2 / Booz Allen Hamilton — cases + public-sector flavor.
   =================================================================== */
"use strict";
CE.registerTrack({
  id:"tier2", name:"Tier 2 / Booz Allen", icon:"🏛️", primary:false,
  role:"Consulting — Deloitte, LEK, Kearney, Strategy&, Booz Allen Hamilton",
  tagline:"Tier-2 and specialist firms use case interviews much like MBB, often a touch more practical and industry-specific. Booz Allen in particular does heavy public-sector and government/defense work — which pairs naturally with your Palantir mission interest.",
  loop:[
    {short:"Behavioral / fit", detail:"Why this firm, why consulting, teamwork and leadership stories. Booz Allen also screens for public-service motivation."},
    {short:"Case interview", detail:"Structure + math + recommendation, often grounded in a real industry (health, gov, energy, defense)."},
    {short:"Final round", detail:"Additional cases and fit with senior staff; sometimes a group or written exercise."},
  ],
  tests:[
    "Solid case fundamentals — structure, math, exhibits (same core as MBB)",
    "<b>Practical, industry-grounded</b> judgment over abstract theory",
    "For Booz Allen: genuine interest in <b>public-sector / mission</b> work",
    "Communication and coachability",
  ],
  checklist:[
    {id:"fw", text:"Master the core frameworks", path:"#/structuring"},
    {id:"struct", text:"Practice structuring — include the government logistics prompt", path:"#/structuring"},
    {id:"math", text:"Sharpen case math", path:"#/math"},
    {id:"exhibit", text:"Practice exhibits", path:"#/exhibits"},
    {id:"mission", text:"Prepare a 'why public-sector / why Booz Allen' answer", path:"#/behavioral"},
    {id:"stories", text:"Build teamwork & leadership STAR stories", path:"#/behavioral"},
  ],
  sections:[
    {title:"The public-sector angle (Booz Allen)", icon:"🇺🇸", html:`
      <p class="lead">Booz Allen's work leans heavily toward government, defense, and civil agencies. That's a natural bridge to your Palantir Indo-Pacific interest — the <b style="color:var(--text)">same mission motivation</b> and comfort with large, complex public problems applies.</p>
      <div class="callout"><div class="c-t">Reuse your prep</div>Your Palantir structuring practice (government logistics) and mission-driven behavioral stories transfer directly here. Emphasize impact, stakeholder complexity, and working within real-world constraints.</div>`},
    {title:"How Tier-2 cases differ from MBB", icon:"🔍", html:`
      <ul style="margin:6px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.7">
        <li>Often <b>more concrete / industry-specific</b> — less abstract than a pure MBB case.</li>
        <li>Fit and <b>motivation for that specific firm</b> carry more weight — do your homework.</li>
        <li>The case fundamentals are the same, so your MBB prep covers you. Just tune your 'why this firm' story.</li>
      </ul>`},
  ]
});
