/* ===================================================================
   Foundations — beginner lessons. Teach from scratch before drilling.
   =================================================================== */
"use strict";
CE.FOUNDATIONS = [
  {id:"what-is-case", icon:"🧩", tag:"Start here", title:"What a case interview actually is",
   body:`A <b>case interview</b> is a business problem an interviewer walks through <i>with</i> you — "Our client, a coffee chain, is losing money. Why, and what should they do?" It's not about knowing the answer; it's about <b>how you think</b>: do you break the problem into logical pieces, use data sensibly, do quick math, and land on a clear recommendation? Consulting firms (McKinsey, Bain, BCG, Booz Allen) and even Palantir and Amazon use case-style problems because the job <i>is</i> structured problem-solving under ambiguity.`,
   examples:[
     `<b>The interviewer is a partner, not a judge.</b> They want to hire someone they'd put in front of a client. Think out loud, be coachable, and treat it like a collaboration.`,
     `<b>Four things they score:</b> structure (a logical breakdown), quantitative (clean math), business judgment (sensible insights), and communication (clear, top-down).`],
   practice:{text:"See the frameworks that give you structure", path:"#/structuring"}},

  {id:"mece", icon:"🌳", tag:"Core skill", title:"MECE & the issue tree",
   body:`<b>MECE</b> = <i>Mutually Exclusive, Collectively Exhaustive</i>. It's the single most important habit: break a problem into buckets that don't overlap (mutually exclusive) and together cover everything (collectively exhaustive). An <b>issue tree</b> is that breakdown drawn out. Profit problem? Profit = Revenue − Cost. Revenue = Price × Volume. Cost = Fixed + Variable. Each split is MECE, so nothing is double-counted and nothing is missed.`,
   examples:[
     `<b>MECE:</b> splitting customers into "new vs. returning" — clean, no overlap, covers all. <b>Not MECE:</b> "young, students, and price-sensitive" — a young student who's price-sensitive lands in all three.`,
     `<b>Why interviewers love it:</b> a MECE tree proves you won't miss the real driver and won't waste time on overlapping ideas. It's the backbone of every framework.`],
   practice:{text:"Build your own issue trees", path:"#/structuring"}},

  {id:"case-flow", icon:"🔄", tag:"Core skill", title:"How a case unfolds, start to finish",
   body:`Most cases follow the same arc. <b>1) Prompt</b> — the interviewer states the situation and the question. <b>2) Clarify & structure</b> — you ask 1–2 sharp questions, then lay out your MECE framework (take 30–60 seconds to plan on paper). <b>3) Analysis</b> — you work through branches, request data, do math, read exhibits. <b>4) Synthesis</b> — you pull it together into a clear <b>recommendation</b> with reasons and risks. Being <b>top-down</b> ("My recommendation is X, for three reasons…") is what separates strong candidates.`,
   examples:[
     `<b>Structure out loud:</b> "I'd like to look at three areas — revenue, costs, and the competitive landscape. Can I walk you through each?" Then go.`,
     `<b>Always end with a recommendation</b>, even if you're not 100% sure. "Based on what we found, I'd recommend X. The main risk is Y, which I'd check by Z."`],
   practice:{text:"Practice structuring a prompt", path:"#/structuring"}},

  {id:"market-sizing", icon:"📐", tag:"Core skill", title:"Market sizing — estimate anything",
   body:`"How many gas stations are in the US?" You're not expected to <i>know</i> — you're expected to <b>estimate logically</b>. The method: start from a number you can anchor (US population ≈ 330M), break it into steps with reasonable assumptions, do the math, and <b>sanity-check</b> the result. State assumptions out loud so the interviewer can follow (and nudge) your logic. Being roughly right with clean reasoning beats a lucky guess.`,
   examples:[
     `<b>Top-down:</b> 330M people ÷ ~2.5 per household ≈ 130M households → scale down by a driver you define. <b>Bottom-up:</b> count units × throughput. Pick whichever is cleaner for the question.`,
     `<b>Round aggressively:</b> use 300M not 331M, 3 not 2.9. Precision isn't the point; structure and sanity are.`],
   practice:{text:"Try a guided market-sizing", path:"#/sizing"}},

  {id:"exhibits", icon:"📊", tag:"Core skill", title:"Reading charts & exhibits fast",
   body:`Mid-case, the interviewer slides you a chart: "What do you take from this?" The skill is pulling the <b>one insight that matters</b> quickly. Method: read the <b>title and axes first</b> (what is this even showing?), find the <b>biggest gap, trend, or outlier</b>, tie it back to the <b>case question</b>, then do any quick math the exhibit invites. Don't narrate every number — lead with the takeaway.`,
   examples:[
     `<b>Say the insight, not the data:</b> "Segment C drives 60% of profit on 20% of volume — that's where we should focus," not "Segment A is 12, B is 18…"`,
     `<b>Watch the trap:</b> % vs. absolute. A segment can be the biggest slice of revenue but the smallest slice of <i>profit</i>. Always check which one the chart shows.`],
   practice:{text:"Drill exhibit interpretation", path:"#/exhibits"}},

  {id:"case-math", icon:"⚡", tag:"Core skill", title:"Mental math without panic",
   body:`Case math is arithmetic under mild pressure — percentages, growth rates, breakevens, big-number multiplication. The trick is <b>decomposition</b> (build 18% from 10% + 5% + 1%), <b>handling zeros separately</b> (50M × $40 → 50×40 then track the M), and <b>rounding to friendly numbers</b>. It's a muscle: a few minutes of daily reps and it stops being scary.`,
   examples:[
     `<b>Rule of 72:</b> anything growing at r% doubles in ~72/r years. 9% → 8 years. Interviewers slip this into growth cases.`,
     `<b>Margin ≠ markup:</b> margin = profit ÷ <i>price</i>; markup = profit ÷ <i>cost</i>. Cost 60, price 80 → 25% margin, 33% markup.`],
   practice:{text:"Warm up with math drills", path:"#/math"}},

  {id:"star", icon:"🎤", tag:"Core skill", title:"The STAR method for behavioral",
   body:`Every firm asks "Tell me about a time you…". The best structure is <b>STAR</b>: <b>Situation</b> (brief context), <b>Task</b> (your specific goal/challenge), <b>Action</b> (what <i>you</i> did — the heart of it, use "I" not "we"), <b>Result</b> (the outcome, quantified if possible, plus what you learned). Prepare 5–6 flexible stories covering leadership, conflict, failure, and impact, and you can answer almost anything.`,
   examples:[
     `<b>Spend 70% on Action.</b> Interviewers want <i>your</i> decisions and reasoning, not a group summary. "I decided to…", "I pushed for…", "I handled the pushback by…".`,
     `<b>Quantify the Result:</b> "cut turnaround from 5 days to 2," "grew signups 30%." Numbers make stories credible and memorable.`],
   practice:{text:"Build your STAR stories", path:"#/behavioral"}},

  {id:"loops", icon:"🎯", tag:"Orientation", title:"What your target interviews look like",
   body:`Your targets test overlapping skills in different mixes. <b>MBB & Tier 2 / Booz Allen</b> lean hardest on cases (structuring, math, exhibits) plus a personal-experience interview. <b>Amazon</b> is behavioral-heavy, organized around its <b>16 Leadership Principles</b> and the STAR method, with a "bar raiser" interviewer. <b>Tech / PM</b> adds product sense and metrics. <b>Palantir (Deployment Strategist)</b> blends light analytics/data reasoning, an ambiguous real-world deployment problem, and behavioral around ownership and comfort with ambiguity. Open any track for a tailored plan.`,
   examples:[
     `<b>Good news:</b> the core skills transfer. Structuring, sizing, math, exhibits, and STAR stories serve every one of your targets — build them once, aim them everywhere.`,
     `<b>Then specialize:</b> each track adds firm-specific prep on top of the shared skills. Palantir is your primary; the rest are close behind.`],
   practice:{text:"Open your primary track", path:"#/track/palantir"}},
];
CE.LESSON_COUNT = CE.FOUNDATIONS.length;

CE.route("#/foundations", ()=>({
  html:`
  ${CE.pageHead("Foundations", "Start here. Eight short lessons that teach the fundamentals from scratch — no prior knowledge assumed. Tap one to expand; opening it marks it read.")}
  <div id="foundList">
    ${CE.FOUNDATIONS.map(l=>{
      const read=CE.state.foundations.read[l.id];
      return `<div class="card lesson" data-lid="${l.id}">
        <div class="l-head" data-accordion>
          <h3>${l.icon} ${CE.esc(l.title)} ${read?'<span class="badge green" style="color:var(--green)">✓ read</span>':""}</h3>
          <span class="tag">${l.tag}</span>
        </div>
        <div class="l-body">
          <p style="color:var(--muted); font-size:14.5px; line-height:1.6">${l.body}</p>
          ${l.examples.map(e=>`<div class="example">${e}</div>`).join("")}
          <button class="btn primary sm" data-nav="${l.practice.path}" style="margin-top:6px">${CE.esc(l.practice.text)} →</button>
        </div>
      </div>`;}).join("")}
  </div>`,
  mount(root){
    CE.$$("#foundList .lesson",root).forEach(el=>{
      el.querySelector("[data-accordion]").addEventListener("click",()=>{
        const id=el.dataset.lid;
        if(!CE.state.foundations.read[id]){ CE.state.foundations.read[id]=1; CE.save(); }
      });
    });
  }
}));
