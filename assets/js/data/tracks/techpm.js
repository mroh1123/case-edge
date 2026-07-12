/* ===================================================================
   Track: Tech / Product Management — product sense, metrics, behavioral.
   =================================================================== */
"use strict";
CE.registerTrack({
  id:"techpm", name:"Tech / PM", icon:"💡", primary:false,
  role:"Product / Program Management at tech companies (post-MBA)",
  tagline:"Tech PM interviews blend product sense (design a product, improve a feature), analytical/metrics thinking, light estimation, and behavioral. Structure still wins — but the frameworks are user- and metric-centric rather than profitability-centric.",
  loop:[
    {short:"Recruiter screen", detail:"Background, why product, why this company."},
    {short:"Product sense", detail:"'Design X for user Y' or 'improve product Z.' Start from the user's problem, prioritize, define success metrics."},
    {short:"Analytical / metrics", detail:"'How would you measure success?' / 'This metric dropped 20% — why?' Structured diagnosis + estimation."},
    {short:"Behavioral / leadership", detail:"Cross-functional influence, conflict, shipping under ambiguity."},
    {short:"Sometimes: technical or execution", detail:"System/estimation or execution trade-off questions, depending on the role."},
  ],
  tests:[
    "<b>Product sense</b> — user empathy, prioritization, clear trade-offs",
    "<b>Metrics thinking</b> — define and diagnose the right numbers",
    "Structured <b>estimation</b> (market/usage sizing)",
    "Influence without authority (behavioral)",
  ],
  checklist:[
    {id:"gtm", text:"Study the Go-to-Market framework", path:"#/structuring"},
    {id:"struct", text:"Practice the SaaS growth structuring prompt", path:"#/structuring"},
    {id:"metrics", text:"Drill exhibits/metrics reading", path:"#/exhibits"},
    {id:"size", text:"Practice usage estimation (ride-share sizing)", path:"#/sizing"},
    {id:"stories", text:"Build cross-functional influence STAR stories", path:"#/behavioral"},
  ],
  sections:[
    {title:"A product-sense answer structure", icon:"🧩", html:`
      <ol style="margin:8px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.8">
        <li><b>Clarify</b> the goal & constraints ("Improve engagement? For which users?").</li>
        <li><b>Pick a user segment</b> and state their core problem / job-to-be-done.</li>
        <li><b>Brainstorm solutions</b>, then <b>prioritize</b> (impact vs. effort) and pick one.</li>
        <li><b>Define success metrics</b> (adoption, retention, the north-star).</li>
        <li><b>Trade-offs & risks</b> — what you'd watch and test.</li>
      </ol>`},
    {title:"Metrics diagnosis pattern", icon:"📉", html:`
      <p class="lead">"Metric X dropped 20% — why?" Structure it: <b style="color:var(--text)">internal vs. external</b>, then <b style="color:var(--text)">segment</b> (new vs. existing, platform, geography), then <b style="color:var(--text)">funnel step</b>. Isolate where the drop concentrates before hypothesizing a cause.</p>
      <div class="callout"><div class="c-t">Reuse</div>This is the same MECE muscle as a consulting case. Your <a data-nav="#/structuring">Structuring</a> and <a data-nav="#/exhibits">Exhibits</a> practice both feed it.</div>`},
  ]
});
