/* ===================================================================
   Market Sizing — guided estimation walkthroughs. Enter your estimate,
   then reveal a step-by-step model approach and sanity check.
   =================================================================== */
"use strict";
CE.SIZING = [
  {id:"gas", icon:"⛽", prompt:"How many gas stations are there in the United States?",
   approach:"Top-down from population and cars, or bottom-up from cars per station. We'll go top-down.",
   steps:[
     {label:"US population", val:"≈ 330M"},
     {label:"Cars on the road", val:"≈ 250M (most adults drive; ~0.75 cars/person)"},
     {label:"Fill-ups per car per year", val:"≈ 50 (roughly once a week)"},
     {label:"Total fill-ups / year", val:"250M × 50 = 12.5B"},
     {label:"Fill-ups one station serves / year", val:"~8 pumps × ~40 cars/day × 365 ≈ 115K"},
     {label:"Stations = fill-ups ÷ per-station", val:"12.5B ÷ 115K ≈ 110K stations"},
   ],
   answer:"≈ 110,000 gas stations. (Actual is ~115,000 — a great estimate.)",
   sanity:"Sanity check: ~330M people / 110K stations ≈ 3,000 people per station. Feels right for a mix of dense cities and empty highways."},

  {id:"coffee", icon:"☕", prompt:"How many cups of coffee are sold in New York City each day?",
   approach:"Bottom-up from population, coffee-drinker share, and cups per person.",
   steps:[
     {label:"NYC population", val:"≈ 8.5M"},
     {label:"Share who buy coffee out daily", val:"≈ 50% → 4.25M people"},
     {label:"Cups bought out per coffee-buyer/day", val:"≈ 1.5"},
     {label:"Resident cups/day", val:"4.25M × 1.5 ≈ 6.4M"},
     {label:"Add commuters & tourists", val:"~1.5M extra buyers × 1.5 ≈ 2.3M"},
     {label:"Total", val:"≈ 8–9M cups/day"},
   ],
   answer:"≈ 8–9 million cups per day.",
   sanity:"Sanity check: ~1 cup per NYC person per day including visitors — very reasonable for a coffee-heavy city."},

  {id:"ev", icon:"🔌", prompt:"What is the annual US market size (in $) for public EV charging?",
   approach:"Estimate EVs, energy from public charging, and price per kWh.",
   steps:[
     {label:"EVs on US roads", val:"≈ 4M (and rising fast)"},
     {label:"Share of charging done in public", val:"≈ 20% (most charge at home)"},
     {label:"Energy per EV/year", val:"≈ 3,500 kWh; 20% public ≈ 700 kWh"},
     {label:"Public kWh/year", val:"4M × 700 ≈ 2.8B kWh"},
     {label:"Price per public kWh", val:"≈ $0.40"},
     {label:"Market = kWh × price", val:"2.8B × $0.40 ≈ $1.1B"},
   ],
   answer:"≈ $1B/year today — small but growing quickly with EV adoption.",
   sanity:"Sanity check: divide by 4M EVs → ~$280/EV/year on public charging. Plausible for the ~20% who can't charge at home."},

  {id:"indo-flights", icon:"✈️", prompt:"Roughly how many commercial flights depart daily across the Indo-Pacific region?",
   approach:"A government/logistics-flavored estimate. Anchor on major hubs and scale. (Great warm-up for a Palantir-style problem.)",
   steps:[
     {label:"Major commercial airports in region", val:"≈ 200 sizeable airports"},
     {label:"Average departures per airport/day", val:"Big hubs ~600, small ~30; blended ≈ 120"},
     {label:"Total from these", val:"200 × 120 ≈ 24,000"},
     {label:"Add many small/regional fields", val:"+ ~30% ≈ 7,000"},
     {label:"Total", val:"≈ 30,000+ departures/day"},
   ],
   answer:"≈ 30,000 commercial departures per day across the Indo-Pacific.",
   sanity:"Sanity check: the region holds ~4.3B people and dense aviation markets (China, India, SE Asia, Australia) — tens of thousands of daily flights is the right order of magnitude."},

  {id:"rideshare", icon:"🚗", prompt:"How many ride-share trips happen per day in a large city like Chicago?",
   approach:"Tech/PM-flavored. Population → active riders → trips each.",
   steps:[
     {label:"City population", val:"≈ 2.7M"},
     {label:"Share who use ride-share in a given week", val:"≈ 25% → 675K"},
     {label:"Trips per active user per week", val:"≈ 3 → 2M trips/week"},
     {label:"Per day", val:"2M ÷ 7 ≈ 290K"},
     {label:"Add visitors/business travel", val:"+ ~20% ≈ 60K"},
     {label:"Total", val:"≈ 350K trips/day"},
   ],
   answer:"≈ 300–350K trips per day.",
   sanity:"Sanity check: ~0.13 trips per resident per day. Reasonable — most people don't ride daily, but frequent users pull the average up."},
];

CE.route("#/sizing", ()=>({
  html:`
  ${CE.pageHead("Market Sizing", "Estimate anything with clean logic. Read the prompt, commit to your own estimate, then reveal a guided solution and sanity check. State assumptions out loud like you would in the room.")}
  <div class="card">
    <div class="chips" id="szChips">
      ${CE.SIZING.map((s,i)=>`<button class="chip ${i===0?"sel":""}" data-i="${i}">${s.icon} ${CE.esc(s.prompt.split(" ").slice(0,4).join(" "))}…</button>`).join("")}
    </div>
    <div id="szBody"></div>
  </div>`,
  mount(root){
    let cur=0;
    const chips=CE.$$("#szChips .chip",root);
    chips.forEach(c=>c.onclick=()=>{ cur=+c.dataset.i; chips.forEach(x=>x.classList.toggle("sel",x===c)); draw(); });
    draw();
    function draw(){
      const s=CE.SIZING[cur];
      const done=CE.state.sizing.done[s.id];
      const body=CE.$("#szBody",root);
      body.innerHTML=`
        <div class="callout amber"><div class="c-t">Prompt ${done?'· <span style="color:var(--green)">✓ done</span>':""}</div>${CE.esc(s.prompt)}</div>
        <p class="small muted">${CE.esc(s.approach)}</p>
        <label class="fl">Your estimate (commit before revealing — order of magnitude is fine)</label>
        <input class="ti" id="szGuess" placeholder="e.g. 100,000 or 100K">
        <div class="btn-row" style="margin-top:12px">
          <button class="btn grad" id="szReveal">Reveal guided solution →</button>
        </div>
        <div id="szSolution"></div>`;
      CE.$("#szReveal",body).onclick=()=>{
        const guess=CE.$("#szGuess",body).value.trim();
        const sol=CE.$("#szSolution",body);
        sol.innerHTML=`
          <hr class="sep">
          ${guess?`<p class="small muted">Your estimate: <b style="color:var(--text)">${CE.esc(guess)}</b></p>`:""}
          <h3>Guided solution</h3>
          <div class="model-tree"><ul>
            ${s.steps.map((st,i)=>`<li>${CE.esc(st.label)}<ul><li>${CE.esc(st.val)}</li></ul></li>`).join("")}
          </ul></div>
          <div class="callout green"><div class="c-t">Answer</div>${CE.esc(s.answer)}</div>
          <div class="callout"><div class="c-t">${CE.esc(s.sanity.split(":")[0])}</div>${CE.esc(s.sanity.split(":").slice(1).join(":").trim())}</div>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn primary" id="szDone">Mark complete</button>
            <button class="btn" id="szCoach">🧑‍🏫 Coach my approach</button>
          </div>`;
        CE.$("#szDone",sol).onclick=()=>{ CE.state.sizing.done[s.id]=1; CE.state.sizing.attempts++; CE.bumpActivity(); CE.toast("Marked complete ✓"); draw(); };
        CE.$("#szCoach",sol).onclick=()=>CE.coach({
          role:"market-sizing coach",
          context:"MBA consulting/tech recruiting; beginner practicing estimation.",
          question:s.prompt+" (My final estimate: "+(guess||"none")+")",
          answer:"My estimate was "+(guess||"(none)")+". Please critique my number and, more importantly, the reasoning path I should have taken.",
          rubric:["Picked a sensible anchor & approach (top-down vs bottom-up)","Assumptions are reasonable and stated","Arithmetic is clean","Sanity-checked the final number"],
          model:s.steps.map(st=>`<b>${CE.esc(st.label)}</b>: ${CE.esc(st.val)}`).join("<br>")+"<br><b>→ "+CE.esc(s.answer)+"</b>"
        });
        sol.scrollIntoView({behavior:"smooth", block:"nearest"});
      };
    }
  }
}));
