/* ===================================================================
   Mental Math — ported from MentalEdge, wired into the shared drill
   engine with adaptive per-topic leveling and smart weak-topic mixing.
   =================================================================== */
"use strict";
CE.MATH_TOPICS = [
  {id:"percent", name:"Percentages",
   gen(lvl){
     let p,b;
     if(lvl===1){ p=CE.pick([10,20,25,50,5]); b=CE.ri(2,20)*10; }
     else if(lvl===2){ p=CE.pick([15,30,40,12,6,75,35]); b=CE.ri(4,40)*5; }
     else { p=CE.pick([18,22,35,45,65,85,12.5]); b=CE.ri(8,99)*5; }
     const ans=Math.round(p*b)/100;
     return {q:`${p}% of ${CE.fmt(b)} = ?`, ans, tol:0,
       how:`Build ${p}% from 10s/5s/1s — 10% of ${CE.fmt(b)} is ${CE.fmt(b/10)} — or flip it: ${p}% of ${CE.fmt(b)} = ${CE.fmt(b)}% of ${p}.`};
   }},
  {id:"pctchange", name:"Percent change",
   gen(lvl){
     const p1=[[80,100],[50,60],[100,75],[40,50],[200,150],[20,25]];
     const p2=[[60,45],[120,150],[80,60],[150,180],[250,200],[64,80]];
     const p3=[[88,110],[140,105],[160,200],[75,90],[320,400],[180,135]];
     const [a,b]=CE.pick(lvl===1?p1:lvl===2?p2:p3);
     const ans=Math.round((b-a)/a*1000)/10;
     return {q:`${CE.fmt(a)} → ${CE.fmt(b)}. % change?`, context:"Answer in percent (negative if it fell)", ans, tol:0,
       how:`Difference ${CE.fmt(b-a)}. Divide by the OLD number: ${CE.fmt(b-a)}/${CE.fmt(a)} = ${ans}%.`};
   }},
  {id:"mult", name:"Fast multiplication",
   gen(lvl){
     const kind=CE.pick(lvl===1?["x5","x11","x4"]:lvl===2?["x25","x11","x9","sq5"]:["x25","sq5","x11b","near100"]);
     let q,ans,how;
     if(kind==="x5"){const n=CE.ri(12,98);ans=n*5;q=`${n} × 5 = ?`;how=`Halve then ×10: ${n}/2 = ${n/2}, ×10 = ${ans}.`;}
     else if(kind==="x4"){const n=CE.ri(13,99);ans=n*4;q=`${n} × 4 = ?`;how=`Double twice: ${n}→${n*2}→${ans}.`;}
     else if(kind==="x11"){const n=CE.ri(12,89);ans=n*11;q=`${n} × 11 = ?`;how=`Spread digits, add the middle: ${Math.floor(n/10)}_(${Math.floor(n/10)}+${n%10})_${n%10} = ${ans}.`;}
     else if(kind==="x11b"){const n=CE.ri(105,989);ans=n*11;q=`${n} × 11 = ?`;how=`×10 then add once more: ${n*10} + ${n} = ${ans}.`;}
     else if(kind==="x25"){const n=CE.pick([12,16,24,28,32,36,44,48,56,64,72,84,88,96]);ans=n*25;q=`${n} × 25 = ?`;how=`Quarter then ×100: ${n}/4 = ${n/4}, ×100 = ${ans}.`;}
     else if(kind==="x9"){const n=CE.ri(13,99);ans=n*9;q=`${n} × 9 = ?`;how=`×10 minus one: ${n*10} − ${n} = ${ans}.`;}
     else if(kind==="sq5"){const t=CE.ri(3,12);ans=(t*10+5)**2;q=`${t*10+5}² = ?`;how=`n5² = n×(n+1) then append 25: ${t}×${t+1} = ${t*(t+1)} → ${ans}.`;}
     else {const a=CE.ri(91,99),b=CE.ri(91,99);ans=a*b;q=`${a} × ${b} = ?`;how=`Near 100: ${a}−${100-b} = ${a-(100-b)} | ${100-a}×${100-b} = ${(100-a)*(100-b)} → ${ans}.`;}
     return {q,ans,tol:0,how};
   }},
  {id:"rule72", name:"Rule of 72",
   gen(lvl){
     if(lvl===1||Math.random()<.5){ const r=CE.pick([2,3,4,6,8,9,12,18,24,36]);
       return {q:`Growth is ${r}%/yr. Years to double?`, ans:72/r, tol:0, how:`Rule of 72: 72 ÷ ${r} = ${72/r} years.`}; }
     const t=CE.pick([2,3,4,6,8,9,12,18,24]);
     return {q:`Doubled in ${t} years. Annual growth (%)?`, ans:72/t, tol:0, how:`72 ÷ ${t} = ${72/t}%.`};
   }},
  {id:"margin", name:"Margins & markup",
   gen(lvl){
     if(lvl===1||Math.random()<.55){
       const [c,p]=CE.pick([[60,80],[30,40],[75,100],[45,60],[120,150],[80,100],[90,120],[160,200],[35,50],[70,100]]);
       return {q:`Cost $${c}, sells for $${p}. Margin %?`, context:"Margin = profit ÷ price", ans:Math.round((p-c)/p*1000)/10, tol:0,
         how:`Profit ${p-c}. Margin = ${p-c}/${p} = ${Math.round((p-c)/p*1000)/10}%.`};
     }
     const [c,m,p]=CE.pick([[30,40,50],[60,25,80],[42,30,60],[21,30,30],[36,40,60],[49,30,70],[120,20,150],[63,30,90]]);
     return {q:`Cost $${c}, target margin ${m}%. Price?`, context:"price = cost ÷ (1 − margin)", ans:p, tol:0,
       how:`Price = ${c} ÷ ${(100-m)/100} = $${p}. A ${m}% margin means cost is ${100-m}% of price.`};
   }},
  {id:"breakeven", name:"Breakeven",
   gen(lvl){
     const contrib=CE.pick(lvl===1?[10,20,25,50]:lvl===2?[15,30,40,60,75]:[12,35,45,80,125]);
     const units=CE.pick(lvl===1?[20,30,40,50,60,80]:[120,150,200,300,400])*(lvl===3?CE.pick([1,10]):1);
     const fixed=contrib*units;
     if(Math.random()<.5) return {q:`Fixed $${CE.fmt(fixed)}, contribution $${contrib}/unit. Breakeven units?`, ans:units, tol:0,
       how:`${CE.fmt(fixed)} ÷ ${contrib}: strip zeros, divide, restore → ${CE.fmt(units)} units.`};
     const price=contrib+CE.pick([10,20,15,25,40]);
     return {q:`Fixed $${CE.fmt(fixed)}. Price $${price}, var. cost $${price-contrib}. Breakeven units?`, context:"contribution = price − variable cost", ans:units, tol:0,
       how:`Contribution = ${price} − ${price-contrib} = $${contrib}. ${CE.fmt(fixed)}/${contrib} = ${CE.fmt(units)}.`};
   }},
  {id:"bignum", name:"Big numbers",
   gen(lvl){
     const a=CE.pick(lvl===1?[2,5,10,20,50]:[15,25,30,40,60,80,150])*1e6;
     const b=CE.pick(lvl===1?[10,20,50,100]:[15,25,40,80,120,250]);
     return {q:`${CE.fmt(a)} × $${b} = ?`, context:"You can answer like 2B or 750M", ans:a*b, tol:0,
       how:`${CE.fmt(a/1e6)} × ${b} = ${CE.fmt(a*b/1e6)} million → ${CE.fmt(a*b)}. Multiply small numbers, track the M/B separately.`};
   }},
  {id:"fractions", name:"Fractions ↔ %",
   gen(lvl){
     const dict={"1/2":50,"1/4":25,"3/4":75,"1/5":20,"2/5":40,"3/5":60,"4/5":80,"1/8":12.5,"3/8":37.5,"5/8":62.5,"7/8":87.5,"1/3":33.3,"2/3":66.7,"1/6":16.7,"5/6":83.3,"1/12":8.3,"1/16":6.25};
     const keys=lvl===1?["1/2","1/4","3/4","1/5","2/5","4/5"]:lvl===2?["3/5","1/8","3/8","1/3","2/3","5/8"]:["7/8","1/6","5/6","1/12","1/16"];
     const f=CE.pick(keys);
     return {q:`${f} as a percent?`, ans:dict[f], tol:0.01, how:`1/${f.split("/")[1]} = ${dict["1/"+f.split("/")[1]]}%, times the numerator.`};
   }},
  {id:"estimation", name:"Estimation",
   gen(lvl){
     if(Math.random()<.5){
       const a=CE.ri(lvl===1?12:21,lvl===1?29:89), b=CE.ri(lvl===1?11:18,lvl===1?29:79);
       return {q:`≈ ${a} × ${b} ?`, context:"Estimate — within 5% counts", ans:a*b, tol:0.05,
         how:`Round one factor: ${a} × ${Math.round(b/10)*10} = ${a*Math.round(b/10)*10}, adjust. Exact: ${(a*b).toLocaleString()}.`};
     }
     const d=CE.pick([3,4,6,7,8,9,12]); const res=CE.ri(lvl===1?20:110,lvl===1?90:900); const a=d*res+(lvl===3?CE.ri(-d+1,d-1):0);
     return {q:`≈ ${CE.fmt(a)} ÷ ${d} ?`, context:"Estimate — within 5% counts", ans:a/d, tol:0.05,
       how:`Nearest friendly multiple: ${d*res} ÷ ${d} = ${res}. Exact: ${(a/d).toLocaleString("en-US",{maximumFractionDigits:1})}.`};
   }},
];
const MBY = Object.fromEntries(CE.MATH_TOPICS.map(t=>[t.id,t]));

function mstat(id){ if(!CE.state.math.topics[id]) CE.state.math.topics[id]={att:0,cor:0,time:0,lvl:1,recent:[]}; return CE.state.math.topics[id]; }
function mSmartPick(){
  const ws=CE.MATH_TOPICS.map(t=>{ const st=CE.state.math.topics[t.id]; if(!st||st.att<3)return 3; const acc=st.cor/st.att; return Math.max(.5,(1-acc)*8+.8); });
  let sum=ws.reduce((a,b)=>a+b,0), r=Math.random()*sum;
  for(let i=0;i<CE.MATH_TOPICS.length;i++){ r-=ws[i]; if(r<=0)return CE.MATH_TOPICS[i]; }
  return CE.MATH_TOPICS[0];
}

CE.route("#/math", ()=>{
  let selTopic="smart", selLen=10;
  return {
    html:`
    ${CE.pageHead("Mental Math", "Fast arithmetic for cases and markets — percentages, growth, margins, breakeven, big numbers. Adaptive: it scales difficulty and feeds you your weak spots.")}
    <div class="card">
      <h3>Topic</h3>
      <div class="chips" id="mTopics">
        <button class="chip sel" data-t="smart">🧠 Smart mix</button>
        ${CE.MATH_TOPICS.map(t=>`<button class="chip" data-t="${t.id}">${CE.esc(t.name)}</button>`).join("")}
      </div>
      <h3>Length</h3>
      <div class="chips" id="mLen">
        <button class="chip sel" data-l="10">10</button>
        <button class="chip" data-l="20">20</button>
        <button class="chip" data-l="5">Quick 5</button>
      </div>
      <button class="btn grad" id="mStart" style="margin-top:8px">Start drill →</button>
      <p class="small muted" style="margin-top:10px">Tip: type answers and hit <kbd>Enter</kbd>. Big numbers accept <b style="color:var(--text)">300M</b>, <b style="color:var(--text)">1.5B</b>, or <b style="color:var(--text)">45K</b>.</p>
    </div>
    <div id="mPlay"></div>`,
    mount(root){
      CE.$$("#mTopics .chip",root).forEach(c=>c.onclick=()=>{ selTopic=c.dataset.t; CE.$$("#mTopics .chip",root).forEach(x=>x.classList.toggle("sel",x===c)); });
      CE.$$("#mLen .chip",root).forEach(c=>c.onclick=()=>{ selLen=+c.dataset.l; CE.$$("#mLen .chip",root).forEach(x=>x.classList.toggle("sel",x===c)); });
      CE.$("#mStart",root).onclick=()=>{
        const play=CE.$("#mPlay",root);
        CE.Drill.run(play, {
          count:selLen, backPath:"#/math",
          next(){ const t=selTopic==="smart"?mSmartPick():MBY[selTopic]; const st=mstat(t.id); const q=t.gen(st.lvl); q.type="numeric"; q.topic=t.name+" · lvl "+st.lvl; q._tid=t.id; return q; },
          onResult(q,ok,ms){
            const st=mstat(q._tid); st.att++; st.time+=ms; if(ok)st.cor++;
            st.recent.push(ok?1:0); if(st.recent.length>20)st.recent.shift();
            const r6=st.recent.slice(-6); if(r6.length===6&&r6.every(x=>x)&&st.lvl<3){st.lvl++;st.recent=[];}
            const r5=st.recent.slice(-5); if(r5.length===5&&r5.filter(x=>!x).length>=3&&st.lvl>1){st.lvl--;st.recent=[];}
            CE.state.math.total++; if(ok)CE.state.math.correct++; CE.state.math.timeSum+=ms; CE.save();
          }
        });
        play.scrollIntoView({behavior:"smooth", block:"start"});
      };
    }
  };
});
