/* ===================================================================
   Track: Amazon — behavioral-heavy, built on the 16 Leadership Principles.
   =================================================================== */
"use strict";
CE.AMAZON_LPS = [
  ["Customer Obsession","Start from the customer and work backwards.","Tell me about a time you went above and beyond for a customer."],
  ["Ownership","Act on behalf of the whole company; never say 'that's not my job.'","Describe a time you took on something outside your responsibilities."],
  ["Invent and Simplify","Find new, simpler ways to do things.","Tell me about an innovative solution you created."],
  ["Are Right, A Lot","Strong judgment; seek diverse perspectives.","Describe a tough decision you made with incomplete data."],
  ["Learn and Be Curious","Always seek to improve and explore.","Tell me about a time you taught yourself a new skill for a project."],
  ["Hire and Develop the Best","Raise the bar; coach others.","Describe how you helped someone grow."],
  ["Insist on the Highest Standards","Relentlessly high bar; fix defects.","Tell me about a time you refused to accept 'good enough.'"],
  ["Think Big","Bold direction that inspires results.","Describe a bold goal you set and pursued."],
  ["Bias for Action","Speed matters; many decisions are reversible.","Tell me about a time you took a calculated risk quickly."],
  ["Frugality","Do more with less; constraints breed resourcefulness.","Describe achieving a lot with limited resources."],
  ["Earn Trust","Listen, speak candidly, treat others with respect.","Tell me about a time you rebuilt a damaged relationship."],
  ["Dive Deep","Operate at all levels; audit the details.","Describe a time digging into the data revealed the real problem."],
  ["Have Backbone; Disagree and Commit","Challenge respectfully, then commit fully.","Tell me about a time you disagreed with your manager."],
  ["Deliver Results","Focus on key inputs and deliver with quality, on time.","Describe overcoming a major obstacle to hit a deadline."],
  ["Strive to be Earth's Best Employer","Create a safer, more productive, empathetic workplace.","Tell me about improving your team's environment or morale."],
  ["Success and Scale Bring Broad Responsibility","Act thoughtfully about broader impact.","Describe considering the wider impact of a decision."],
];

CE.registerTrack({
  id:"amazon", name:"Amazon", icon:"📦", primary:false,
  role:"Product / Program Management, Ops, or general management (MBA paths)",
  tagline:"Amazon's interview is famously behavioral: nearly every question maps to one of its 16 Leadership Principles, answered in STAR form and pressure-tested by a 'Bar Raiser.' Win Amazon by mapping strong STAR stories to the principles — not by cramming trivia.",
  loop:[
    {short:"Recruiter / phone screen", detail:"Background + 1–2 Leadership Principle behavioral questions."},
    {short:"Online assessment (some roles)", detail:"Work-style survey and/or role-specific case or technical questions."},
    {short:"Onsite loop (4–6 interviewers)", detail:"Each interviewer owns a few Leadership Principles and asks STAR behavioral questions; may include a case or product exercise for PM roles."},
    {short:"Bar Raiser", detail:"A specially-trained interviewer from outside the team who safeguards the hiring bar and probes deeply. Expect follow-ups digging into your specific actions and data."},
  ],
  tests:[
    "Depth and authenticity of your <b>STAR stories</b> under follow-up pressure",
    "Coverage across the <b>16 Leadership Principles</b> — especially Customer Obsession, Ownership, Dive Deep, Bias for Action, Deliver Results",
    "<b>Data and specifics</b> — Amazon interviewers push for metrics and <i>your</i> exact role",
    "Candor and self-awareness (learnings from failures)",
  ],
  checklist:[
    {id:"star6", text:"Build 6+ STAR stories in the Behavioral module", path:"#/behavioral"},
    {id:"map", text:"Map each story to 2–3 Leadership Principles (see below)", path:null},
    {id:"metrics", text:"Add hard metrics to every 'Result' (Amazon loves data)", path:"#/behavioral"},
    {id:"fail", text:"Prepare 2 genuine failure/learning stories for the Bar Raiser", path:"#/behavioral"},
    {id:"why", text:"Draft your 'why Amazon' answer & get it coached", path:"#/behavioral"},
  ],
  sections:[
    {title:"The 16 Leadership Principles — with sample questions", icon:"📜", html:`
      <p class="lead">Tap any principle for a sample behavioral question. Aim to have a story ready for each cluster; strong stories cover several principles at once.</p>
      <div style="margin-top:10px">${CE.AMAZON_LPS.map((lp,i)=>`
        <div class="card lesson tight" style="margin-bottom:6px"><div class="l-head" data-accordion>
          <h3 style="font-size:14px">${i+1}. ${CE.esc(lp[0])}</h3><span class="r-arrow">▾</span></div>
          <div class="l-body"><p class="small muted">${CE.esc(lp[1])}</p>
          <div class="example" style="margin-top:8px"><b>Sample:</b> ${CE.esc(lp[2])}</div></div>
        </div>`).join("")}</div>`},
    {title:"How the Bar Raiser round works", icon:"🚧", html:`
      <p class="lead">The Bar Raiser is a trained interviewer from <b style="color:var(--text)">outside the hiring team</b> with veto power, there to keep the quality bar high and reduce bias. They dig relentlessly: <i>"What exactly did you do? What was the data? What would you do differently?"</i></p>
      <div class="callout"><div class="c-t">Survive it</div>Use real stories you can defend three layers deep. Always say <b>"I"</b> not "we," bring numbers, and have a genuine failure with a real learning. Vague or borrowed stories fall apart under follow-ups.</div>`},
    {title:"For PM / product roles: working backwards", icon:"🔄", html:`
      <p class="lead">Amazon PMs "work backwards" from the customer — often literally drafting a press release and FAQ before building. Pair this with <a data-nav="#/exhibits">metrics</a> and <a data-nav="#/structuring">structuring</a> practice for product-sense questions.</p>
      <ul style="margin:8px 0 0 18px; color:var(--muted); font-size:14px; line-height:1.7">
        <li>Start every product answer with <b>the customer and their problem</b>.</li>
        <li>Define <b>success metrics</b> before features.</li>
        <li>Prioritize ruthlessly and explain the trade-offs.</li>
      </ul>`},
  ]
});
