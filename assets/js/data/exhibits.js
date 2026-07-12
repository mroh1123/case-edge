/* ===================================================================
   Exhibits — timed chart/table interpretation. SVG-rendered charts,
   multiple-choice "what's the insight / do the math" questions.
   =================================================================== */
"use strict";
CE.chart = (function(){
  const C={accent:"#4f8ff7",a2:"#7c5cff",teal:"#39c5cf",amber:"#d29922",green:"#3fb950",pink:"#db61a2",grid:"#2d3540",muted:"#8b949e",text:"#e6edf3"};
  const pal=[C.accent,C.teal,C.amber,C.green,C.pink,C.a2];
  function bar(title, data, fmt){
    const W=520,H=260,padL=48,padB=46,padT=34,padR=16;
    const max=Math.max(...data.map(d=>d.value))*1.15;
    const bw=(W-padL-padR)/data.length*0.62, gap=(W-padL-padR)/data.length;
    const bars=data.map((d,i)=>{
      const h=(d.value/max)*(H-padT-padB);
      const x=padL+i*gap+(gap-bw)/2, y=H-padB-h;
      return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="4" fill="${pal[i%pal.length]}"></rect>
        <text x="${x+bw/2}" y="${y-6}" fill="${C.text}" font-size="12" font-weight="700" text-anchor="middle">${fmt?fmt(d.value):d.value}</text>
        <text x="${x+bw/2}" y="${H-padB+16}" fill="${C.muted}" font-size="11" text-anchor="middle">${d.label}</text>`;
    }).join("");
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto;background:#1f2630;border-radius:10px" xmlns="http://www.w3.org/2000/svg">
      <text x="${padL}" y="20" fill="${C.text}" font-size="13" font-weight="700">${title}</text>
      <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="${C.grid}"></line>
      ${bars}</svg>`;
  }
  function stacked(title, cats, series, fmt){
    // series: [{name,color,values[]}]  stacked bars per cat
    const W=520,H=270,padL=48,padB=46,padT=34,padR=16;
    const totals=cats.map((_,i)=>series.reduce((a,s)=>a+s.values[i],0));
    const max=Math.max(...totals)*1.15;
    const gap=(W-padL-padR)/cats.length, bw=gap*0.6;
    let bars="";
    cats.forEach((c,i)=>{
      let y=H-padB;
      series.forEach((s,si)=>{
        const h=(s.values[i]/max)*(H-padT-padB); y-=h;
        bars+=`<rect x="${padL+i*gap+(gap-bw)/2}" y="${y}" width="${bw}" height="${h}" fill="${s.color}"></rect>`;
      });
      bars+=`<text x="${padL+i*gap+gap/2}" y="${H-padB+16}" fill="${C.muted}" font-size="11" text-anchor="middle">${c}</text>`;
    });
    const legend=series.map((s,i)=>`<rect x="${padL+i*130}" y="${H-16}" width="10" height="10" fill="${s.color}"></rect><text x="${padL+i*130+15}" y="${H-7}" fill="${C.muted}" font-size="11">${s.name}</text>`).join("");
    return `<svg viewBox="0 0 ${W} ${H+10}" style="max-width:100%;height:auto;background:#1f2630;border-radius:10px" xmlns="http://www.w3.org/2000/svg">
      <text x="${padL}" y="20" fill="${C.text}" font-size="13" font-weight="700">${title}</text>
      <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="${C.grid}"></line>
      ${bars}${legend}</svg>`;
  }
  function line(title, labels, values, fmt){
    const W=520,H=250,padL=48,padB=44,padT=34,padR=16;
    const max=Math.max(...values)*1.15, min=Math.min(...values,0);
    const sx=i=>padL+i*((W-padL-padR)/(labels.length-1));
    const sy=v=>H-padB-((v-min)/(max-min))*(H-padT-padB);
    const pts=values.map((v,i)=>`${sx(i)},${sy(v)}`).join(" ");
    const dots=values.map((v,i)=>`<circle cx="${sx(i)}" cy="${sy(v)}" r="3.5" fill="${C.accent}"></circle><text x="${sx(i)}" y="${sy(v)-8}" fill="${C.text}" font-size="11" font-weight="700" text-anchor="middle">${fmt?fmt(v):v}</text>`).join("");
    const xl=labels.map((l,i)=>`<text x="${sx(i)}" y="${H-padB+16}" fill="${C.muted}" font-size="11" text-anchor="middle">${l}</text>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto;background:#1f2630;border-radius:10px" xmlns="http://www.w3.org/2000/svg">
      <text x="${padL}" y="20" fill="${C.text}" font-size="13" font-weight="700">${title}</text>
      <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="${C.grid}"></line>
      <polyline points="${pts}" fill="none" stroke="${C.accent}" stroke-width="2.5"></polyline>${dots}${xl}</svg>`;
  }
  return {bar,stacked,line,pal};
})();

/* each factory returns {svg, q, choices, correctIndex, how} */
CE.EXHIBITS = [
  function profitShare(){
    const segs=CE.shuffle([["A",CE.ri(30,50)],["B",CE.ri(20,35)],["C",CE.ri(10,20)],["D",CE.ri(5,15)]]);
    const rev=segs.map(s=>({label:s[0],value:s[1]}));
    // profit margins differ
    const margins={A:8,B:12,C:35,D:20};
    const profit=rev.map(r=>({label:r.label, value:Math.round(r.value*margins[r.label]/10)}));
    const svg=CE.chart.stacked("Revenue vs. profit by segment ($M)", rev.map(r=>r.label),
      [{name:"Revenue",color:CE.chart.pal[0],values:rev.map(r=>r.value)},{name:"Profit",color:CE.chart.pal[3],values:profit.map(p=>p.value)}]);
    const topProfit=profit.slice().sort((a,b)=>b.value-a.value)[0];
    const topRev=rev.slice().sort((a,b)=>b.value-a.value)[0];
    const choices=CE.shuffle([
      {t:`Segment ${topProfit.label} drives the most profit and deserves focus`, ok:true},
      {t:`Segment ${topRev.label} has the most revenue, so it's the most valuable`, ok:false},
      {t:`All segments contribute equally to profit`, ok:false},
      {t:`We should exit the smallest-revenue segment immediately`, ok:false},
    ]);
    return {svg, q:"Which takeaway is best supported?", choices:choices.map(c=>c.t), correctIndex:choices.findIndex(c=>c.ok),
      how:`The biggest revenue segment isn't the biggest profit segment. Segment ${topProfit.label} has the highest profit bar — that's where margin and focus should go. Classic revenue-vs-profit trap.`};
  },
  function growthRate(){
    const start=CE.pick([100,120,150,200]); const g=CE.pick([1.1,1.15,1.2,1.25]);
    const vals=[start]; for(let i=0;i<3;i++) vals.push(Math.round(vals[vals.length-1]*g));
    const svg=CE.chart.line("Annual revenue ($M)", ["Y1","Y2","Y3","Y4"], vals);
    const cagr=Math.round((Math.pow(vals[3]/vals[0],1/3)-1)*100);
    const opts=CE.shuffle([cagr, cagr+8, cagr-6, cagr+15].map(x=>Math.max(1,x)));
    return {svg, q:"Approximately what is the annual growth rate (CAGR)?", choices:opts.map(o=>o+"%"), correctIndex:opts.indexOf(cagr),
      how:`Revenue went ${vals[0]}→${vals[3]} over 3 years. Each year it grows ~${Math.round((g-1)*100)}%. (Rule of thumb: it roughly ${g>=1.24?"doubles in ~3yrs → ~25%":"grows steadily"}.)`};
  },
  function costBreakdown(){
    const data=[{label:"Labor",value:CE.ri(35,50)},{label:"Materials",value:CE.ri(20,30)},{label:"Logistics",value:CE.ri(10,18)},{label:"Overhead",value:CE.ri(8,15)}];
    const svg=CE.chart.bar("Cost structure (% of total)", data, v=>v+"%");
    const biggest=data.slice().sort((a,b)=>b.value-a.value)[0];
    const choices=CE.shuffle([
      {t:`${biggest.label} is the largest cost — the first place to look for savings`, ok:true},
      {t:`Overhead should be cut first because it adds no value`, ok:false},
      {t:`Costs are evenly split, so cut everything equally`, ok:false},
      {t:`Logistics is the priority because it's most visible`, ok:false},
    ]);
    return {svg, q:"Where should a cost-reduction effort start?", choices:choices.map(c=>c.t), correctIndex:choices.findIndex(c=>c.ok),
      how:`Start where the money is. ${biggest.label} is the biggest slice (${biggest.value}%), so even a small % improvement there beats big cuts to tiny line items.`};
  },
  function marketSizeCalc(){
    const users=CE.pick([2,4,5,8])*1e6; const arpu=CE.pick([20,30,40,50]);
    const svg=CE.chart.bar("Inputs", [{label:"Users (M)",value:users/1e6},{label:"Rev/user ($)",value:arpu}]);
    const ans=users*arpu;
    const opts=CE.shuffle([ans, ans*10, ans/10, ans*2]);
    return {svg, q:`If each of the ${CE.fmt(users)} users pays $${arpu}/year, what's annual revenue?`, choices:opts.map(o=>CE.fmt(o)), correctIndex:opts.indexOf(ans),
      how:`${CE.fmt(users/1e6)}M × $${arpu} = ${CE.fmt(users/1e6*arpu)}M = ${CE.fmt(ans)}. Multiply the small numbers, track the M.`};
  },
  function trendTrap(){
    const abs=[{label:"Q1",value:100},{label:"Q2",value:130},{label:"Q3",value:170},{label:"Q4",value:220}];
    const svg=CE.chart.line("Total revenue ($M) — growing fast", abs.map(a=>a.label), abs.map(a=>a.value));
    const choices=CE.shuffle([
      {t:"Revenue is growing, but we can't tell if it's profitable — we need cost/margin data", ok:true},
      {t:"The business is clearly healthy because revenue is up", ok:false},
      {t:"Growth is slowing and the company is in trouble", ok:false},
      {t:"We should raise prices since demand is strong", ok:false},
    ]);
    return {svg, q:"What's the right read of this chart?", choices:choices.map(c=>c.t), correctIndex:choices.findIndex(c=>c.ok),
      how:`Rising revenue ≠ rising profit. A disciplined answer flags what's missing (costs, margins) rather than over-claiming from a single top-line trend.`};
  },
];

CE.route("#/exhibits", ()=>({
  html:`
  ${CE.pageHead("Exhibits & Charts", "Read a chart, find the one insight that matters, tie it to the question. Beware the classic traps — revenue vs. profit, % vs. absolute, trend vs. profitability.")}
  <div class="card">
    <p class="lead">10 timed questions. Read the title and axes first, then answer. Explanations teach the reasoning each time.</p>
    <button class="btn grad" id="exStart" style="margin-top:10px">Start exhibit drill →</button>
  </div>
  <div id="exPlay"></div>`,
  mount(root){
    CE.$("#exStart",root).onclick=()=>{
      const play=CE.$("#exPlay",root);
      CE.Drill.run(play, {
        count:10, backPath:"#/exhibits",
        next(){ const ex=CE.pick(CE.EXHIBITS)(); return {type:"mc", topic:"Exhibit reading",
          q:`<div style="margin-bottom:14px">${ex.svg}</div><div style="font-size:20px">${ex.q}</div>`,
          choices:ex.choices, correctIndex:ex.correctIndex, how:ex.how}; },
        onResult(q,ok,ms){ CE.state.exhibits.att++; if(ok)CE.state.exhibits.cor++; CE.state.exhibits.time+=ms; CE.save(); }
      });
      play.scrollIntoView({behavior:"smooth", block:"start"});
    };
  }
}));
