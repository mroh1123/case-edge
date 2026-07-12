/* ===================================================================
   Track: Palantir — Deployment Strategist (FDSE), Indo-Pacific. PRIMARY.
   Content is a general, editable study scaffold — verify specifics against
   your own research, networking, and Palantir's official materials.
   =================================================================== */
"use strict";
CE.registerTrack({
  id:"palantir", name:"Palantir FDSE", icon:"🛰️", primary:true,
  role:"Deployment Strategist / Forward-Deployed — Indo-Pacific",
  tagline:"Palantir's deployment strategists sit between the software and the mission: they parachute into a customer's hardest problem, figure out how data + Palantir's platform can solve it, and drive it to real-world impact. The interview rewards structured thinking under ambiguity, analytical fluency, and ownership.",
  loop:[
    {short:"Recruiter screen", detail:"Motivation, background, why deployment/why Palantir, comfort with ambiguity and travel."},
    {short:"Analytics / technical challenge", detail:"Reason over a dataset — spot patterns, do arithmetic, draw a defensible conclusion. Often light SQL/spreadsheet logic. They watch how you think, not whether you memorized syntax."},
    {short:"Deployment case", detail:"An open-ended, real-world problem ('help agency X do Y faster'). Structure it, ask sharp questions, and reason about where a data platform adds value."},
    {short:"Behavioral / values", detail:"Ownership, bias to action, handling ambiguity, working with non-technical stakeholders, mission alignment."},
    {short:"Final / onsite", detail:"Deeper dives with the team, sometimes a longer problem or presentation. Consistency and genuine curiosity matter."},
  ],
  tests:[
    "Structured problem-solving on <b>ambiguous, real-world</b> problems (not textbook cases)",
    "Analytical & data fluency — comfortable reasoning over numbers and datasets",
    "<b>Ownership and bias to action</b> — you drive things without being told exactly how",
    "Communicating with non-technical, senior, sometimes government stakeholders",
    "Genuine <b>mission alignment</b> — why this work, why the Indo-Pacific",
  ],
  checklist:[
    {id:"found", text:"Read the Foundations (esp. structuring & the target-loops lesson)", path:"#/foundations"},
    {id:"struct", text:"Do the 'Indo-Pacific disaster-relief logistics' structuring prompt", path:"#/structuring"},
    {id:"size", text:"Practice the Indo-Pacific flights market-sizing", path:"#/sizing"},
    {id:"exhibit", text:"Sharpen data/exhibit reading (their analytics round)", path:"#/exhibits"},
    {id:"star-amb", text:"Build 2 STAR stories: 'worked with little direction' + 'took ownership'", path:"#/behavioral"},
    {id:"why", text:"Draft & coach your 'Why Palantir / why deployment' answer", path:"#/behavioral"},
  ],
  sections:[
    {title:"The analytics / technical challenge", icon:"📊", html:`
      <p class="lead">You'll be handed data and asked to reason to a conclusion. You don't need to be an engineer — you need to be <b style="color:var(--text)">fluent and structured</b> with numbers. Prep by drilling <a data-nav="#/exhibits">Exhibits</a> and <a data-nav="#/math">Mental Math</a>, and practice narrating your logic out loud.</p>
      <div class="card lesson tight" style="margin-top:10px"><div class="l-head" data-accordion><h3 style="font-size:14px">Sample: reasoning over a dataset</h3><span class="r-arrow">▾</span></div>
        <div class="l-body"><div class="example"><b>Prompt:</b> "Here's a table of relief shipments: origin, destination island, weight, dispatch time, delivery time. What would you look at first?"<br><br><b>Strong answer:</b> "First I'd compute delivery <i>duration</i> per shipment (delivery − dispatch), then group by destination to find which islands are slowest. I'd separate that into wait-to-dispatch vs. in-transit time to locate the bottleneck, and check whether delay correlates with weight or distance. That tells us whether the fix is sourcing, transport capacity, or prioritization."</div></div></div>
      <div class="card lesson tight" style="margin-top:8px"><div class="l-head" data-accordion><h3 style="font-size:14px">Sample: a quick logic check</h3><span class="r-arrow">▾</span></div>
        <div class="l-body"><div class="example"><b>Prompt:</b> "Region A ships 400 tons in 8 days; Region B ships 300 tons in 5 days. Which is more efficient per day, and by how much?"<br><br><b>Answer:</b> A = 50 t/day, B = 60 t/day. B is 20% faster (60/50 − 1). Say the method, then the number.</div></div></div>`},
    {title:"The deployment case", icon:"🧭", html:`
      <p class="lead">An ambiguous, real problem: <i>"A customer wants to do X faster/better — how would you approach it?"</i> There's no framework to recite. Instead: <b style="color:var(--text)">map the real-world process, find the bottleneck, ask where better data/decisions help, and tie it to a measurable outcome.</b></p>
      <div class="callout"><div class="c-t">Try it now</div>The <a data-nav="#/structuring">Structuring module</a> has a Palantir-style prompt: <i>"reduce time to move disaster-relief supplies to remote islands after a typhoon."</i> Build the tree, reveal the model, and get AI coaching.</div>
      <div class="callout green"><div class="c-t">What good looks like</div>You resist jumping to "Palantir software fixes it." You first understand the workflow and stakeholders, isolate where time is actually lost, and only then show where a common data picture speeds up decisions — with a clear metric (e.g., request-to-delivery time).</div>`},
    {title:"Behavioral & values", icon:"🎤", html:`
      <p class="lead">Deployment work is high-ownership and ambiguous, so stories should show you <b style="color:var(--text)">acting without a playbook</b>, owning outcomes, and bringing along non-technical people. Build these in the <a data-nav="#/behavioral">Behavioral module</a>.</p>
      <ul style="margin:8px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.7">
        <li>A time you <b>structured chaos</b> — little direction, you made a plan and moved.</li>
        <li>A time you <b>owned</b> a bad outcome and fixed it.</li>
        <li>A time you got a <b>non-technical / skeptical stakeholder</b> on board.</li>
        <li>Your authentic <b>"why Palantir / why the Indo-Pacific mission"</b> — this should feel personal, not rehearsed.</li>
      </ul>`},
    {title:"Indo-Pacific context primer", icon:"🌏", html:`
      <p class="lead">You don't need to be a geopolitics expert, but being <b style="color:var(--text)">conversant</b> in the themes shows genuine interest. Skim reputable sources and form a point of view. (General starting themes — verify and go deeper on your own.)</p>
      <ul style="margin:8px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.7">
        <li><b>Logistics & supply chains</b> across a vast maritime region of thousands of islands.</li>
        <li><b>Disaster response</b> — the region is highly exposed to typhoons, earthquakes, and floods.</li>
        <li><b>Allied coordination</b> — many partners and agencies needing a shared operating picture.</li>
        <li><b>Maritime domain awareness</b> — tracking and making sense of activity at sea.</li>
      </ul>
      <div class="callout amber" style="margin-top:12px"><div class="c-t">Keep it grounded</div>Talk about publicly-known, humanitarian/operational themes and your motivation. Steer clear of anything you'd only know from non-public sources.</div>`},
  ]
});
