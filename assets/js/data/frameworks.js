/* ===================================================================
   Structuring & Frameworks — a framework library + an interactive
   issue-tree builder that compares your tree to a model MECE answer.
   =================================================================== */
"use strict";
CE.FRAMEWORKS = [
  {id:"profit", name:"Profitability", icon:"💰",
   when:"“Profits are falling / how do we raise profit?” The workhorse of case interviews.",
   tree:[
     {b:"Revenue", s:["Price (per unit, mix, discounts)","Volume (# customers × purchase frequency × units)","Product mix / segments"]},
     {b:"Costs", s:["Fixed costs (rent, salaries, equipment)","Variable costs (materials, shipping, commissions)","Cost per unit trends"]},
     {b:"External context", s:["Market growth / decline","Competitor moves","Regulation, input prices"]},
   ]},
  {id:"market-entry", name:"Market Entry", icon:"🚪",
   when:"“Should client enter market/geography X?”",
   tree:[
     {b:"Market attractiveness", s:["Size & growth rate","Profitability / margins","Segments & unmet needs"]},
     {b:"Competition", s:["Who's there, market share","Barriers to entry","Likely competitive response"]},
     {b:"Company capability", s:["Do we have the assets/skills?","Cost to enter, time to scale","Synergies with existing business"]},
     {b:"Entry mode & economics", s:["Build vs. buy vs. partner","Expected ROI / payback","Key risks"]},
   ]},
  {id:"ma", name:"M&A / Acquisition", icon:"🤝",
   when:"“Should client acquire company Y?”",
   tree:[
     {b:"Why acquire (rationale)", s:["Strategic fit / capabilities","Revenue or cost synergies","Defensive / market access"]},
     {b:"Target attractiveness", s:["Standalone financials & growth","Market position","Risks / liabilities"]},
     {b:"Deal economics", s:["Price vs. value (synergies)","Financing & returns","Integration cost"]},
     {b:"Alternatives & risks", s:["Build or partner instead?","Integration/culture risk","Regulatory approval"]},
   ]},
  {id:"pricing", name:"Pricing", icon:"🏷️",
   when:"“How should client price a new product?”",
   tree:[
     {b:"Cost-based", s:["Unit cost + target margin","Breakeven volume"]},
     {b:"Competitor-based", s:["Substitutes' prices","Our differentiation vs. them"]},
     {b:"Value-based", s:["Willingness to pay","Value created for customer","Segment price sensitivity"]},
   ]},
  {id:"growth", name:"Growth / Declining Sales", icon:"📈",
   when:"“How do we grow revenue?” / “Why are sales down?”",
   tree:[
     {b:"Grow existing customers", s:["Higher price / upsell","More frequency / volume","Reduce churn"]},
     {b:"Win new customers", s:["New segments","New geographies / channels"]},
     {b:"New products / adjacencies", s:["Line extensions","Bundling, cross-sell"]},
   ]},
  {id:"ops", name:"Operations / Process", icon:"⚙️",
   when:"“Costs too high / process too slow / capacity issues.”",
   tree:[
     {b:"Process steps", s:["Map the flow end-to-end","Find the bottleneck","Cycle time per step"]},
     {b:"Inputs", s:["Labor, materials, machines","Utilization & waste"]},
     {b:"Outputs / quality", s:["Throughput vs. demand","Defects / rework"]},
   ]},
  {id:"gtm", name:"Go-to-Market", icon:"🚀",
   when:"“How do we launch / sell this?” (common in Tech/PM).",
   tree:[
     {b:"Customer & segment", s:["Target user & job-to-be-done","Segment size & priority"]},
     {b:"Value prop & positioning", s:["Core benefit","Differentiation vs. alternatives"]},
     {b:"Channel & pricing", s:["How we reach them","Pricing & packaging"]},
     {b:"Metrics", s:["Adoption / activation","Retention & unit economics"]},
   ]},
];

CE.STRUCT_PROMPTS = [
  {id:"coffee", prompt:"A national coffee-shop chain has seen profits fall 15% over the past year, even though revenue is flat. What could be driving this, and how would you structure your analysis?",
   context:"Classic profitability case. Flat revenue + falling profit points you somewhere specific — but structure the whole space first.",
   model:[
     {b:"Revenue (flat — but check the mix)", s:["Price vs. volume — is a price cut hiding a volume gain, or vice versa?","Product mix shift to lower-margin items","Promotions / discounting eating into net revenue"]},
     {b:"Costs (likely culprit — profit fell on flat revenue)", s:["Variable: coffee bean / milk / cup input prices rising","Fixed: rent, wages (minimum-wage hikes), utilities","New costs: delivery-app commissions, equipment"]},
     {b:"External", s:["Competitive pressure forcing promotions","Wage / commodity inflation","Changing customer behavior (WFH → less foot traffic)"]},
   ],
   rubric:["Structure is MECE (no overlaps, covers the space)","Correctly zeroes in on costs given flat revenue","Breaks costs into fixed vs. variable","Communicates the tree clearly and top-down"]},

  {id:"gym-entry", prompt:"A boutique fitness company is considering entering the Southeast Asian market. How would you structure whether they should?",
   context:"Market-entry case. Don't jump to 'yes/no' — lay out what would make it attractive and feasible.",
   model:[
     {b:"Market attractiveness", s:["Size & growth of fitness market in target countries","Willingness to pay / disposable income","Underserved segments (premium, women-only, etc.)"]},
     {b:"Competition", s:["Existing gyms & boutique players","Barriers to entry (real estate, brand)","Local substitutes (outdoor, home)"]},
     {b:"Company fit", s:["Brand transferability & format fit","Operational capability abroad","Capital & talent required"]},
     {b:"Entry mode & economics", s:["Own vs. franchise vs. partner","Payback period / expected ROI","Key risks (regulatory, cultural, FX)"]},
   ],
   rubric:["Covers market, competition, company, and entry mode","Buckets are MECE","Includes economics / ROI, not just qualitative","Names concrete, region-relevant factors"]},

  {id:"palantir-logistics", prompt:"A government agency in the Indo-Pacific wants to reduce the time it takes to move disaster-relief supplies to remote islands after a typhoon. As a deployment strategist, how would you structure the problem?",
   context:"Palantir-style deployment/operations problem under ambiguity. Structure the real-world system, then think about where software/data helps.",
   model:[
     {b:"Understand the current flow", s:["Map steps: request → sourcing → transport → last-mile → confirmation","Where's the delay (the bottleneck)?","Who are the stakeholders / decision-makers?"]},
     {b:"Data & visibility", s:["Do they know inventory locations in real time?","Can they see transport assets (ships, aircraft) and their status?","Is demand (which islands need what) accurate & timely?"]},
     {b:"Decision-making & coordination", s:["Who prioritizes across islands, and how?","Cross-agency / allied coordination friction","Manual vs. automated dispatch decisions"]},
     {b:"Constraints & risks", s:["Weather, infrastructure damage","Limited transport capacity","Security / access limitations"]},
     {b:"Where a data platform helps", s:["Single common operating picture of supply + demand + assets","Faster prioritization & routing decisions","Measurable metric: time from request to delivery"]},
   ],
   rubric:["Maps the real-world process before jumping to solutions","Separates data/visibility from decision-making","Comfort structuring an ambiguous, non-classic prompt","Ties structure to a measurable outcome (delivery time)","Considers where a software platform actually adds value"]},

  {id:"saas-growth", prompt:"A B2B SaaS product has strong sign-ups but revenue is growing slowly. How would you structure finding the problem?",
   context:"Tech/PM-flavored growth case. Sign-ups strong but revenue slow — think funnel and unit economics.",
   model:[
     {b:"Activation & retention", s:["Do sign-ups actually activate (reach value)?","Churn rate — are they leaving fast?","Which segments retain vs. churn?"]},
     {b:"Monetization", s:["Free → paid conversion rate","Pricing / packaging fit","Expansion revenue (upsell, seats)"]},
     {b:"Customer mix", s:["Are sign-ups the right ICP?","SMB vs. enterprise value","Acquisition channel quality"]},
     {b:"Metrics to pull", s:["Activation %, churn %, ARPU","LTV : CAC","Cohort revenue over time"]},
   ],
   rubric:["Distinguishes sign-up (top of funnel) from revenue (activation/retention/monetization)","Uses product metrics (activation, churn, conversion)","MECE and clearly communicated","Identifies data to validate the hypothesis"]},
];

/* ---------------- Structuring page ---------------- */
CE.route("#/structuring", ()=>({
  html:`
  ${CE.pageHead("Structuring & Frameworks", "The core case-interview skill. Learn the frameworks, then practice building your own MECE issue trees and compare to a model answer.")}

  <div class="card">
    <h3>🎯 Practice building an issue tree</h3>
    <p class="lead">Pick a prompt, structure your approach, then reveal a model MECE tree, score yourself, and get AI coaching. This is exactly what interviewers watch you do.</p>
    <div class="chips" id="promptChips" style="margin-top:12px">
      ${CE.STRUCT_PROMPTS.map((p,i)=>`<button class="chip ${i===0?"sel":""}" data-i="${i}">${CE.esc(p.prompt.split(".")[0].slice(0,42))}…</button>`).join("")}
    </div>
    <div id="structPractice"></div>
  </div>

  <h2 style="margin:22px 0 10px; font-size:18px">📖 Framework library</h2>
  <p class="lead" style="margin-bottom:12px">Frameworks are starting templates — adapt them, don't recite them. Tap to expand.</p>
  <div id="fwList">
    ${CE.FRAMEWORKS.map(f=>`
      <div class="card lesson">
        <div class="l-head" data-accordion>
          <h3>${f.icon} ${CE.esc(f.name)}</h3><span class="tag">framework</span>
        </div>
        <div class="l-body">
          <div class="callout"><div class="c-t">When to use</div>${CE.esc(f.when)}</div>
          <div class="model-tree"><ul>
            ${f.tree.map(br=>`<li>${CE.esc(br.b)}<ul>${br.s.map(x=>`<li>${CE.esc(x)}</li>`).join("")}</ul></li>`).join("")}
          </ul></div>
        </div>
      </div>`).join("")}
  </div>`,
  mount(root){
    let cur=0;
    const chips=CE.$$("#promptChips .chip",root);
    chips.forEach(c=>c.onclick=()=>{ cur=+c.dataset.i; chips.forEach(x=>x.classList.toggle("sel",x===c)); renderPractice(); });
    renderPractice();

    function renderPractice(){
      const p=CE.STRUCT_PROMPTS[cur];
      const area=CE.$("#structPractice",root);
      // tree model: array of {text, subs:[]}
      let tree=[{text:"",subs:[""]},{text:"",subs:[""]},{text:"",subs:[""]}];
      area.innerHTML=`
        <div class="callout amber"><div class="c-t">Prompt</div>${CE.esc(p.prompt)}</div>
        <p class="small muted">${CE.esc(p.context)}</p>
        <div id="treeBuilder"></div>
        <button class="btn sm" id="addBranch" style="margin-top:8px">+ Add branch</button>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn grad" id="revealBtn">Reveal model & score →</button>
        </div>
        <div id="revealArea"></div>`;
      const tb=CE.$("#treeBuilder",area);
      function drawTree(){
        tb.innerHTML=tree.map((br,bi)=>`
          <div class="tree-branch">
            <div class="tb-top">
              <input placeholder="Branch ${bi+1} (e.g. Revenue)" value="${CE.esc(br.text)}" data-bi="${bi}" data-role="branch">
              <button class="icon-btn" data-del-branch="${bi}" title="remove branch">✕</button>
            </div>
            <div class="tree-sub">
              ${br.subs.map((sub,si)=>`<div class="tb-top">
                <input placeholder="sub-point" value="${CE.esc(sub)}" data-bi="${bi}" data-si="${si}" data-role="sub">
                <button class="icon-btn" data-del-sub="${bi}.${si}">✕</button></div>`).join("")}
              <button class="icon-btn" data-add-sub="${bi}" style="align-self:flex-start">+ sub-point</button>
            </div>
          </div>`).join("");
        // wire inputs
        CE.$$('[data-role="branch"]',tb).forEach(inp=>inp.oninput=()=>{ tree[+inp.dataset.bi].text=inp.value; });
        CE.$$('[data-role="sub"]',tb).forEach(inp=>inp.oninput=()=>{ tree[+inp.dataset.bi].subs[+inp.dataset.si]=inp.value; });
        CE.$$('[data-add-sub]',tb).forEach(b=>b.onclick=()=>{ tree[+b.dataset.addSub].subs.push(""); drawTree(); });
        CE.$$('[data-del-sub]',tb).forEach(b=>b.onclick=()=>{ const [bi,si]=b.dataset.delSub.split(".").map(Number); tree[bi].subs.splice(si,1); drawTree(); });
        CE.$$('[data-del-branch]',tb).forEach(b=>b.onclick=()=>{ tree.splice(+b.dataset.delBranch,1); drawTree(); });
      }
      drawTree();
      CE.$("#addBranch",area).onclick=()=>{ tree.push({text:"",subs:[""]}); drawTree(); };

      CE.$("#revealBtn",area).onclick=()=>{
        const ra=CE.$("#revealArea",area);
        const userText=tree.filter(b=>b.text.trim()).map(b=>`• ${b.text}\n${b.subs.filter(s=>s.trim()).map(s=>"   - "+s).join("\n")}`).join("\n");
        ra.innerHTML=`
          <hr class="sep">
          <h3>Model MECE structure</h3>
          <div class="model-tree"><ul>
            ${p.model.map(br=>`<li>${CE.esc(br.b)}<ul>${br.s.map(x=>`<li>${CE.esc(x)}</li>`).join("")}</ul></li>`).join("")}
          </ul></div>
          <h3 style="margin-top:16px">Score yourself (1–5)</h3>
          <div id="rubric"></div>
          <div class="btn-row" style="margin-top:14px">
            <button class="btn primary" id="saveScore">Save my score</button>
            <button class="btn" id="coachBtn">🧑‍🏫 Get AI coaching on my tree</button>
          </div>`;
        // rubric rows
        const scores={};
        CE.$("#rubric",ra).innerHTML=p.rubric.map((r,ri)=>`
          <div style="margin:10px 0">
            <div class="small" style="margin-bottom:6px">${CE.esc(r)}</div>
            <div class="chips" style="margin:0" data-ri="${ri}">
              ${[1,2,3,4,5].map(n=>`<button class="chip" data-score="${ri}.${n}" style="padding:6px 12px">${n}</button>`).join("")}
            </div></div>`).join("");
        CE.$$('[data-score]',ra).forEach(b=>b.onclick=()=>{
          const [ri,n]=b.dataset.score.split(".").map(Number); scores[ri]=n;
          CE.$$(`[data-ri="${ri}"] .chip`,ra).forEach(x=>x.classList.toggle("sel",x===b));
        });
        CE.$("#saveScore",ra).onclick=()=>{
          const vals=Object.values(scores); if(!vals.length){ CE.toast("Tap a score for at least one row"); return; }
          const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
          CE.state.structuring.selfScores.push(avg);
          CE.state.structuring.attempts++;
          CE.state.structuring.done[p.id]=1;
          CE.bumpActivity();
          CE.toast("Saved ✓ — nice work");
        };
        CE.$("#coachBtn",ra).onclick=()=>CE.coach({
          role:"case interview structuring coach",
          context:"MBA consulting recruiting; the candidate is a beginner building MECE issue trees.",
          question:p.prompt,
          answer:userText||"(no structure entered)",
          rubric:p.rubric,
          model:p.model.map(b=>`<b>${CE.esc(b.b)}</b>: ${b.s.map(CE.esc).join("; ")}`).join("<br>")
        });
        ra.scrollIntoView({behavior:"smooth", block:"nearest"});
      };
    }
  }
}));
