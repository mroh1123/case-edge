/* ===================================================================
   Mental Math — 12 adaptive topics, timed sprints with personal bests,
   a missed-question review pile, per-topic stats, and a strategy guide.
   =================================================================== */
"use strict";
CE.MATH_TOPICS = [

{id:"percent", name:"Percentages",
 gen(lvl){
   const kind = lvl===1 ? "plain" : lvl===2 ? CE.pick(["plain","plain","reverse"]) : CE.pick(["plain","reverse","stacked"]);
   if(kind==="reverse"){
     const p=CE.pick([10,20,25,50]); const whole=CE.ri(2,20)*20; const part=whole*p/100;
     return {q:`${CE.fmt(part)} is ${p}% of what?`, ans:whole, tol:0,
       how:`Scale up: if ${p}% is ${CE.fmt(part)}, then 100% is ×${100/p} → ${CE.fmt(whole)}.`};
   }
   if(kind==="stacked"){
     const [p1,p2]=CE.pick([[20,50],[25,40],[10,50],[20,25],[50,50],[10,20],[40,50]]);
     const b=CE.ri(2,10)*100; const ans=b*p1*p2/10000;
     return {q:`${p1}% of ${p2}% of ${CE.fmt(b)} = ?`, ans, tol:0,
       how:`Multiply the percents first: ${p1}% × ${p2}% = ${p1*p2/100}%. Then ${p1*p2/100}% of ${CE.fmt(b)} = ${CE.fmt(ans)}.`};
   }
   let p,b;
   if(lvl===1){ p=CE.pick([10,20,25,50,5]); b=CE.ri(2,20)*10; }
   else if(lvl===2){ p=CE.pick([15,30,40,12,6,75,35]); b=CE.ri(4,40)*5; }
   else { p=CE.pick([18,22,35,45,65,85,12.5]); b=CE.ri(8,99)*5; }
   const ans=Math.round(p*b)/100;
   return {q:`${p}% of ${CE.fmt(b)} = ?`, ans, tol:0,
     how:`Build ${p}% from 10s/5s/1s — 10% of ${CE.fmt(b)} is ${CE.fmt(b/10)}. Or flip it: ${p}% of ${CE.fmt(b)} = ${CE.fmt(b)}% of ${p}.`};
 }},

{id:"pctchange", name:"Percent change",
 gen(lvl){
   if(lvl===3 && Math.random()<.4){
     const p=CE.pick([10,20,30]); const base=CE.ri(2,10)*100;
     const ans=base*(10000-p*p)/10000;
     return {q:`${CE.fmt(base)} rises ${p}%, then falls ${p}%. Final value?`, ans, tol:0,
       how:`The trap: up ${p}% then down ${p}% is a net LOSS of ${p*p/100}% (multiply 1.${p<10?"0":""}${p} × 0.${100-p}). → ${CE.fmt(ans)}.`};
   }
   if(lvl>=2 && Math.random()<.45){
     const base=CE.ri(2,20)*20; const p=CE.pick([5,10,15,20,25,50]); const up=Math.random()<.5;
     const ans=base*(100+(up?p:-p))/100;
     return {q:`${CE.fmt(base)} after a ${p}% ${up?"increase":"decrease"}?`, ans, tol:0,
       how:`${p}% of ${CE.fmt(base)} is ${CE.fmt(base*p/100)}. ${up?"Add":"Subtract"} it → ${CE.fmt(ans)}.`};
   }
   const p1=[[80,100],[50,60],[100,75],[40,50],[200,150],[20,25]];
   const p2=[[60,45],[120,150],[80,60],[150,180],[250,200],[64,80]];
   const p3=[[88,110],[140,105],[160,200],[75,90],[320,400],[180,135]];
   const [a,b]=CE.pick(lvl===1?p1:lvl===2?p2:p3);
   const ans=Math.round((b-a)/a*1000)/10;
   return {q:`${CE.fmt(a)} → ${CE.fmt(b)}. % change?`, context:"Answer in percent (negative if it fell)",
     ans, tol:0, keys:["±"],
     how:`Difference ${CE.fmt(b-a)}. Divide by the OLD number: ${CE.fmt(b-a)}/${CE.fmt(a)} = ${ans}%.`};
 }},

{id:"mult", name:"Fast multiplication",
 gen(lvl){
   const kind=CE.pick(lvl===1?["x5","x11","x4"]:lvl===2?["x25","x11","x9","sq5","x15","x12"]:["x25","sq5","x11b","near100","x99","sq50"]);
   let q,ans,how;
   if(kind==="x5"){const n=CE.ri(12,98);ans=n*5;q=`${n} × 5 = ?`;how=`Halve then ×10: ${n}/2 = ${n/2}, ×10 = ${ans}.`;}
   else if(kind==="x4"){const n=CE.ri(13,99);ans=n*4;q=`${n} × 4 = ?`;how=`Double twice: ${n}→${n*2}→${ans}.`;}
   else if(kind==="x11"){const n=CE.ri(12,89);ans=n*11;q=`${n} × 11 = ?`;how=`Spread digits, add the middle: ${Math.floor(n/10)}_(${Math.floor(n/10)}+${n%10})_${n%10} = ${ans}.`;}
   else if(kind==="x11b"){const n=CE.ri(105,989);ans=n*11;q=`${n} × 11 = ?`;how=`×10 then add once more: ${n*10} + ${n} = ${ans}.`;}
   else if(kind==="x25"){const n=CE.pick([12,16,24,28,32,36,44,48,56,64,72,84,88,96]);ans=n*25;q=`${n} × 25 = ?`;how=`Quarter then ×100: ${n}/4 = ${n/4}, ×100 = ${ans}.`;}
   else if(kind==="x9"){const n=CE.ri(13,99);ans=n*9;q=`${n} × 9 = ?`;how=`×10 minus one: ${n*10} − ${n} = ${ans}.`;}
   else if(kind==="x15"){const n=CE.ri(12,98);ans=n*15;q=`${n} × 15 = ?`;how=`×10 plus half of that: ${n*10} + ${n*5} = ${ans}.`;}
   else if(kind==="x12"){const n=CE.ri(13,99);ans=n*12;q=`${n} × 12 = ?`;how=`×10 plus double: ${n*10} + ${n*2} = ${ans}.`;}
   else if(kind==="x99"){const n=CE.ri(12,99);ans=n*99;q=`${n} × 99 = ?`;how=`×100 minus one: ${n*100} − ${n} = ${ans}.`;}
   else if(kind==="sq5"){const t=CE.ri(3,12);ans=(t*10+5)**2;q=`${t*10+5}² = ?`;how=`n5² = n×(n+1) then append 25: ${t}×${t+1} = ${t*(t+1)} → ${ans}.`;}
   else if(kind==="sq50"){const n=CE.ri(43,57);const d=n-50;ans=n*n;q=`${n}² = ?`;how=`Anchor on 50: 50² = 2500, ${d>=0?"+":"−"} 2·${Math.abs(d)}·50 = ${d>=0?"+":"−"}${Math.abs(d)*100}, + ${d}² = ${d*d} → ${ans}.`;}
   else {const a=CE.ri(91,99),b=CE.ri(91,99);ans=a*b;q=`${a} × ${b} = ?`;how=`Near 100: ${a}−${100-b} = ${a-(100-b)} | ${100-a}×${100-b} = ${(100-a)*(100-b)} → ${ans}.`;}
   return {q,ans,tol:0,how};
 }},

{id:"division", name:"Division shortcuts",
 gen(lvl){
   const kind=CE.pick(lvl===1?["d5","d4"]:lvl===2?["d5","d4","d25","dbig"]:["d25","dbig","dbig"]);
   if(kind==="d5"){const ans=CE.ri(12,98);return {q:`${ans*5} ÷ 5 = ?`, ans, tol:0, how:`÷5 = ×2 then ÷10: ${ans*5}×2 = ${ans*10} → ${ans}.`};}
   if(kind==="d4"){const ans=CE.ri(11,99);return {q:`${ans*4} ÷ 4 = ?`, ans, tol:0, how:`Halve twice: ${ans*4}→${ans*2}→${ans}.`};}
   if(kind==="d25"){const ans=CE.ri(8,60);return {q:`${ans*25} ÷ 25 = ?`, ans, tol:0, how:`÷25 = ×4 then ÷100: ${ans*25}×4 = ${ans*100} → ${ans}.`};}
   const d=CE.pick(lvl===3?[6,7,8,9,12]:[3,4,6,8,12]); const ans=CE.ri(2,9)*1e5; const n=d*ans;
   return {q:`$${CE.fmt(n)} ÷ ${d} = ?`, ans, tol:0, inputmode:"text", keys:["K","M"],
     how:`Strip the zeros: ${CE.fmt(n/1e5)} ÷ ${d} = ${ans/1e5}, restore → ${CE.fmt(ans)}.`};
 }},

{id:"rule72", name:"Rule of 72 & growth",
 gen(lvl){
   const kind = lvl===1 ? CE.pick(["dbl","rate"]) : CE.pick(["dbl","rate","triple","value"]);
   if(kind==="dbl"){ const r=CE.pick([2,3,4,6,8,9,12,18,24,36]);
     return {q:`Growth is ${r}%/yr. Years to double?`, ans:72/r, tol:0, how:`Rule of 72: 72 ÷ ${r} = ${72/r} years.`}; }
   if(kind==="rate"){ const t=CE.pick([2,3,4,6,8,9,12,18,24]);
     return {q:`Doubled in ${t} years. Annual growth (%)?`, ans:72/t, tol:0, how:`72 ÷ ${t} = ${72/t}%.`}; }
   if(kind==="triple"){ const r=CE.pick([2,3,6,19]);
     return {q:`Growth is ${r}%/yr. Years to TRIPLE?`, ans:114/r, tol:0, how:`Rule of 114 for tripling: 114 ÷ ${r} = ${114/r} years. (72 doubles, 114 triples.)`}; }
   const P=CE.pick([25,50,100,200]); const r=CE.pick([4,6,8,9,12]); const quad=lvl===3&&Math.random()<.4;
   const yrs=(quad?2:1)*72/r; const ans=P*(quad?4:2)*1000;
   return {q:`$${P}K growing ${r}%/yr — value after ${yrs} years ≈ ?`, ans, tol:0.05, inputmode:"text", keys:["K","M"],
     context:"≈ estimate — within 5% counts",
     how:`72/${r} = ${72/r} yrs per doubling → ${quad?"two doublings (×4)":"one doubling (×2)"} → $${P*(quad?4:2)}K.`};
 }},

{id:"compound", name:"Compound growth",
 gen(lvl){
   if(lvl===1){ const p=CE.pick([10,20,50]); const ans=Math.round(((1+p/100)**2-1)*100);
     return {q:`Up ${p}% two years in a row. Total % gain?`, ans, tol:0,
       how:`Not ${2*p}%! (1.${p<10?"0":""}${p})² − 1 = ${ans}%. The second year grows off a bigger base.`}; }
   if(lvl===2 || Math.random()<.5){ const p=CE.pick([10,20,30]); const ans=-(p*p)/100;
     return {q:`Up ${p}%, then down ${p}%. Net % change?`, ans, tol:0, keys:["±"],
       how:`The classic trap: (1+${p}%)(1−${p}%) = 1 − ${p}²/10000 → net −${p*p/100}%. You never get back to even.`}; }
   const g=CE.pick([5,10,20]); const n=CE.pick([3,4]);
   const exact=Math.round(((1+g/100)**n-1)*1000)/10;
   return {q:`≈ total growth after ${g}%/yr for ${n} years?`, ans:exact, tol:0.05,
     context:"≈ estimate — within 5% counts",
     how:`Start with n×g = ${n*g}%, then add a compounding kicker (~add g²·n(n−1)/200 ≈ ${Math.round(g*g*n*(n-1)/200)}%) → ~${exact}%.`};
 }},

{id:"margin", name:"Margins & markup",
 gen(lvl){
   const kind = lvl===1 ? "margin" : lvl===2 ? CE.pick(["margin","price","profit"]) : CE.pick(["price","profit","convert"]);
   if(kind==="margin"){
     const [c,p]=CE.pick([[60,80],[30,40],[75,100],[45,60],[120,150],[80,100],[90,120],[160,200],[35,50],[70,100]]);
     return {q:`Cost $${c}, sells for $${p}. Margin %?`, context:"Margin = profit ÷ price", ans:Math.round((p-c)/p*1000)/10, tol:0,
       how:`Profit ${p-c}. Margin = ${p-c}/${p} = ${Math.round((p-c)/p*1000)/10}%.`};
   }
   if(kind==="price"){
     const [c,m,p]=CE.pick([[30,40,50],[60,25,80],[42,30,60],[21,30,30],[36,40,60],[49,30,70],[120,20,150],[63,30,90]]);
     return {q:`Cost $${c}, target margin ${m}%. Price?`, context:"price = cost ÷ (1 − margin)", ans:p, tol:0,
       how:`Price = ${c} ÷ ${(100-m)/100} = $${p}. A ${m}% margin means cost is ${100-m}% of price.`};
   }
   if(kind==="profit"){
     const R=CE.ri(2,20)*10; const m=CE.pick([10,20,30,40,50]);
     return {q:`Revenue $${R}K at a ${m}% margin. Profit?`, ans:R*m/100*1000, tol:0, inputmode:"text", keys:["K","M"],
       how:`Profit = margin × revenue = ${m}% of $${R}K = $${R*m/100}K.`};
   }
   const dir=Math.random()<.5;
   if(dir){ const [mk,mg]=CE.pick([[25,20],[50,33.3],[100,50],[20,16.7],[300,75]]);
     return {q:`A ${mk}% markup = what margin %?`, ans:mg, tol:0.01,
       how:`Margin = markup/(100+markup) = ${mk}/${100+mk} = ${mg}%. Markup divides by cost, margin by price.`}; }
   const [mg,mk]=CE.pick([[20,25],[25,33.3],[50,100],[40,66.7]]);
   return {q:`A ${mg}% margin = what markup %?`, ans:mk, tol:0.01,
     how:`Markup = margin/(100−margin) = ${mg}/${100-mg} = ${mk}%.`};
 }},

{id:"breakeven", name:"Breakeven",
 gen(lvl){
   const contrib=CE.pick(lvl===1?[10,20,25,50]:lvl===2?[15,30,40,60,75]:[12,35,45,80,125]);
   const units=CE.pick(lvl===1?[20,30,40,50,60,80]:[120,150,200,300,400])*(lvl===3?CE.pick([1,10]):1);
   const fixed=contrib*units;
   if(lvl>=2 && Math.random()<.4){
     const extra=CE.pick([10,20,50,100])*(lvl===3?10:1);
     return {q:`Fixed $${CE.fmt(fixed)}, contribution $${contrib}/unit. Units to earn $${CE.fmt(contrib*extra)} profit?`,
       context:"units = (fixed + target profit) ÷ contribution", ans:units+extra, tol:0,
       how:`(${CE.fmt(fixed)} + ${CE.fmt(contrib*extra)}) ÷ ${contrib} = ${CE.fmt(units+extra)} units — breakeven plus the profit units.`};
   }
   if(Math.random()<.5) return {q:`Fixed $${CE.fmt(fixed)}, contribution $${contrib}/unit. Breakeven units?`, ans:units, tol:0,
     how:`${CE.fmt(fixed)} ÷ ${contrib}: strip zeros, divide, restore → ${CE.fmt(units)} units.`};
   const price=contrib+CE.pick([10,20,15,25,40]);
   return {q:`Fixed $${CE.fmt(fixed)}. Price $${price}, var. cost $${price-contrib}. Breakeven units?`, context:"contribution = price − variable cost", ans:units, tol:0,
     how:`Contribution = ${price} − ${price-contrib} = $${contrib}. ${CE.fmt(fixed)}/${contrib} = ${CE.fmt(units)}.`};
 }},

{id:"bignum", name:"Big numbers",
 gen(lvl){
   const kind = lvl===1 ? "mult" : lvl===2 ? CE.pick(["mult","share"]) : CE.pick(["mult","share","percap"]);
   if(kind==="share"){
     const whole=CE.pick([2,3,4,5]); const p=CE.pick([5,10,15,20,25]); const part=whole*10*p;
     return {q:`Our revenue is $${CE.fmt(part*1e6)} in a $${whole}B market. Market share (%)?`, ans:p, tol:0,
       how:`${CE.fmt(part*1e6)} ÷ ${whole}B: match units first (${whole}B = ${whole*1000}M), then ${part}/${whole*1000} = ${p}%.`};
   }
   if(kind==="percap"){
     const people=CE.pick([20,25,50,100,200]); const pc=CE.pick([10,20,40,50,80]); const total=people*pc*1e6;
     return {q:`$${CE.fmt(total)} spread across ${people}M people — per person?`, ans:pc, tol:0,
       how:`Strip the millions from both sides: ${CE.fmt(total/1e6)}M ÷ ${people}M = $${pc}.`};
   }
   const a=CE.pick(lvl===1?[2,5,10,20,50]:[15,25,30,40,60,80,150])*1e6;
   const b=CE.pick(lvl===1?[10,20,50,100]:[15,25,40,80,120,250]);
   return {q:`${CE.fmt(a)} × $${b} = ?`, context:"You can answer like 2B or 750M", ans:a*b, tol:0, inputmode:"text", keys:["K","M","B"],
     how:`${CE.fmt(a/1e6)} × ${b} = ${CE.fmt(a*b/1e6)} million → ${CE.fmt(a*b)}. Multiply small numbers, track the M/B separately.`};
 }},

{id:"weighted", name:"Weighted averages",
 gen(lvl){
   if(lvl===3){
     const w=CE.pick([25,75]); const a=CE.ri(1,5)*20, b=CE.ri(6,12)*20;
     const ans=(w*a+(100-w)*b)/100;
     return {q:`${w}% of customers pay $${a}, the rest pay $${b}. Average revenue per customer?`, ans, tol:0,
       how:`Weight each: ${w}%×${a} = ${w*a/100}, ${100-w}%×${b} = ${(100-w)*b/100}. Sum → $${ans}. (Anchor on ${b} and subtract ${w}% of the gap.)`};
   }
   const w=CE.pick([20,30,40,50]); let a=CE.ri(1,5)*10, b=CE.ri(2,6)*10; if(a===b)b+=10;
   const ans=(w*a+(100-w)*b)/100;
   return {q:`${w}% of customers pay $${a}, the rest pay $${b}. Average revenue per customer?`, ans, tol:0,
     how:`Weight each side: ${w}%×${a} = ${w*a/100}, plus ${100-w}%×${b} = ${(100-w)*b/100} → $${ans}. Sanity check: it must sit between ${Math.min(a,b)} and ${Math.max(a,b)}, closer to the ${w>50?"first":"second"} group.`};
 }},

{id:"fractions", name:"Fractions ↔ %",
 gen(lvl){
   const dict={"1/2":50,"1/4":25,"3/4":75,"1/5":20,"2/5":40,"3/5":60,"4/5":80,"1/8":12.5,"3/8":37.5,"5/8":62.5,"7/8":87.5,"1/3":33.3,"2/3":66.7,"1/6":16.7,"5/6":83.3,"1/12":8.3,"1/16":6.25};
   if(lvl===3 && Math.random()<.4){
     const n=CE.pick([1,3,5,7]);
     return {q:`${n*12.5}% = ?/8`, ans:n, tol:0, placeholder:"numerator",
       how:`1/8 = 12.5%, so count the 12.5s: ${n*12.5} ÷ 12.5 = ${n} → ${n}/8.`};
   }
   const keys=lvl===1?["1/2","1/4","3/4","1/5","2/5","4/5"]:lvl===2?["3/5","1/8","3/8","1/3","2/3","5/8"]:["7/8","1/6","5/6","1/12","1/16"];
   const f=CE.pick(keys);
   return {q:`${f} as a percent?`, ans:dict[f], tol:0.01, how:`1/${f.split("/")[1]} = ${dict["1/"+f.split("/")[1]]}%, times the numerator.`};
 }},

{id:"estimation", name:"Estimation",
 gen(lvl){
   const kind=CE.pick(lvl===1?["mult","div"]:["mult","div","pct"]);
   if(kind==="pct"){
     const p=CE.pick([11,13,17,19,23,31,37,41]); const b=CE.ri(15,90)*10;
     return {q:`≈ ${p}% of ${CE.fmt(b)} ?`, context:"Estimate — within 5% counts", ans:p*b/100, tol:0.05,
       how:`10% is ${b/10}. Add ${p-10}% (${(p-10)/10}× of that, roughly) → exact: ${(p*b/100).toLocaleString()}.`};
   }
   if(kind==="mult"){
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

/* ---------------- strategy guide ---------------- */
CE.MATH_STRATEGIES = [
 {tid:"percent", title:"Percentages — build from 10% and 1%, or flip",
  body:`Never compute head-on. 10% is a decimal shift, 5% is half of that, 1% is two shifts — stack them. And <b>a% of b = b% of a</b>: 4% of 75 = 75% of 4 = 3. Reverse questions ("X is 20% of what?") just scale up: ×5.`,
  ex:`<b>18% of 250</b> → 25 + 12.5 + 7.5 = <b>45</b> · <b>16% of 25</b> → 25% of 16 = <b>4</b>`},
 {tid:"pctchange", title:"Percent change — anchor on the OLD number",
  body:`Change = difference ÷ <b>old</b>. Benchmark easy fractions (1/4=25%, 1/3≈33%). Applying a change: find the % chunk, add or subtract. Watch the trap: +20% then −20% is a net <b>loss</b> of 4%.`,
  ex:`<b>80 → 100</b>: 20/80 = <b>+25%</b> (not 20%!) · <b>500 +20% −20%</b> → 500 × 1.2 × 0.8 = <b>480</b>`},
 {tid:"mult", title:"Multiplication — reshape the problem",
  body:`×5: halve, ×10. ×25: quarter, ×100. ×11: spread digits, add the middle. ×15: ×10 plus half. ×9/×99: round up to 10/100, subtract once. Squares ending in 5: n×(n+1), append 25. Near 50: anchor on 2500 ± 100·d + d².`,
  ex:`<b>36 × 25</b> → 9 × 100 = <b>900</b> · <b>85²</b> → 72 → <b>7225</b> · <b>48²</b> → 2500 − 200 + 4 = <b>2304</b>`},
 {tid:"division", title:"Division — turn it into multiplication",
  body:`÷5 = ×2 then ÷10. ÷25 = ×4 then ÷100. ÷4 = halve twice. For big numbers, strip the zeros, divide the small numbers, restore the zeros.`,
  ex:`<b>435 ÷ 5</b> → 870 ÷ 10 = <b>87</b> · <b>$4.8M ÷ 12</b> → 48/12 = 4 → <b>$400K</b>`},
 {tid:"rule72", title:"Rule of 72 (and 114) — growth in your head",
  body:`Growing at r%/yr doubles in ~72/r years and <b>triples in ~114/r</b>. Works backwards too (doubled in t years ⇒ ~72/t %). Two doublings = ×4.`,
  ex:`<b>9% growth</b> → doubles in <b>8 yrs</b> · <b>$50K at 9% for 16 yrs</b> → two doublings ≈ <b>$200K</b>`},
 {tid:"compound", title:"Compounding — n×g plus a kicker",
  body:`Growth of g% for n years ≈ <b>n×g%, plus a bit</b> for compounding (bigger when n×g is big). Symmetric moves never cancel: ±p% nets −p²/100.`,
  ex:`<b>10% for 3 yrs</b> → 30% + kicker ≈ <b>33%</b> · <b>+20% then −20%</b> → <b>−4%</b>`},
 {tid:"margin", title:"Margin vs markup — know your denominator",
  body:`Margin = profit ÷ <b>price</b>; markup = profit ÷ <b>cost</b>. Convert: margin = markup/(100+markup). Price from cost + margin: cost ÷ (1 − margin). Interviewers love this distinction.`,
  ex:`<b>Cost 60, price 80</b> → margin 25%, markup 33% · <b>Cost $30, 40% margin</b> → 30/0.6 = <b>$50</b>`},
 {tid:"breakeven", title:"Breakeven — fixed ÷ contribution",
  body:`Breakeven units = fixed costs ÷ contribution (price − variable cost). Target profit? Add it to fixed costs first: (fixed + profit) ÷ contribution.`,
  ex:`<b>$1,200 fixed, $30 contribution</b> → <b>40 units</b>; want $600 profit → 1,800/30 = <b>60</b>`},
 {tid:"bignum", title:"Big numbers — handle zeros separately",
  body:`Multiply the small numbers, track K/M/B separately (M×K=B). For shares and per-capita, convert to the <b>same unit</b> first, then strip it from both sides.`,
  ex:`<b>50M × $40</b> → 2,000M = <b>$2B</b> · <b>$450M of $3B</b> → 450/3000 = <b>15%</b>`},
 {tid:"weighted", title:"Weighted averages — anchor and adjust",
  body:`Average = Σ(weight × value). Faster: anchor on one value and move by the other group's weight × the gap. The answer must land between the values, nearer the bigger group.`,
  ex:`<b>30% pay $10, 70% pay $20</b> → 20 − 30%×10 = <b>$17</b>`},
 {tid:"fractions", title:"The fraction–percent dictionary",
  body:`Memorize cold: 1/8=12.5, 1/6≈16.7, 1/5=20, 1/4=25, 1/3≈33.3, 3/8=37.5, 5/8=62.5, 1/12≈8.3, 1/16=6.25. Then 7/8 = 87.5 instantly, and ÷8 becomes ×12.5%.`,
  ex:`<b>5/8</b> → 5 × 12.5 = <b>62.5%</b> · <b>62.5% = ?/8</b> → <b>5</b>`},
 {tid:"estimation", title:"Estimation — be roughly right, fast",
  body:`Round to friendly numbers, compute, nudge back. For ugly percents build from 10% and 1%. In cases, an answer within ~5% with clean logic beats slow precision.`,
  ex:`<b>23 × 38</b> → 920 − 46 ≈ <b>874</b> · <b>17% of 400</b> → 40 + 28 = <b>68</b>`},
];

/* ---------------- shared stat + miss tracking ---------------- */
function mstat(id){ if(!CE.state.math.topics[id]) CE.state.math.topics[id]={att:0,cor:0,time:0,lvl:1,recent:[]}; return CE.state.math.topics[id]; }
function mSmartPick(exclude){
  const pool=CE.MATH_TOPICS.filter(t=>!exclude||!exclude.includes(t.id));
  const ws=pool.map(t=>{ const st=CE.state.math.topics[t.id]; if(!st||st.att<3)return 3; const acc=st.cor/st.att; return Math.max(.5,(1-acc)*8+.8); });
  let sum=ws.reduce((a,b)=>a+b,0), r=Math.random()*sum;
  for(let i=0;i<pool.length;i++){ r-=ws[i]; if(r<=0)return pool[i]; }
  return pool[0];
}
function recordMathResult(q, ok, ms){
  const st=mstat(q._tid); st.att++; st.time+=ms; if(ok)st.cor++;
  st.recent.push(ok?1:0); if(st.recent.length>20)st.recent.shift();
  const r6=st.recent.slice(-6); if(r6.length===6&&r6.every(x=>x)&&st.lvl<3){st.lvl++;st.recent=[];}
  const r5=st.recent.slice(-5); if(r5.length===5&&r5.filter(x=>!x).length>=3&&st.lvl>1){st.lvl--;st.recent=[];}
  CE.state.math.total++; if(ok)CE.state.math.correct++; CE.state.math.timeSum+=ms;
  if(!ok){
    const m=CE.state.math.missed;
    if(!m.some(x=>x.q===q.q)){
      m.push({q:q.q, ans:q.ans, tol:q.tol||0, how:q.how, topic:q.topic, tid:q._tid, inputmode:q.inputmode, keys:q.keys, context:q.context});
      if(m.length>40)m.shift();
    }
  }
  CE.save();
}
function makeQ(t){
  const st=mstat(t.id);
  const q=t.gen(st.lvl); q.type="numeric"; q.topic=t.name+" · lvl "+st.lvl; q._tid=t.id;
  return q;
}

/* ---------------- page ---------------- */
CE.route("#/math", ()=>{
  let selTopic="smart", selLen="10";
  const bests=CE.state.math.bests||{};
  return {
    html:`
    ${CE.pageHead("Mental Math", "Fast arithmetic for cases and markets. Adaptive difficulty, timed sprints with personal bests, and your misses come back until you clear them.")}

    <div class="card lesson">
      <div class="l-head" data-accordion><h3>📖 Strategies — the tricks behind every topic</h3><span class="r-arrow">▾</span></div>
      <div class="l-body">
        ${CE.MATH_STRATEGIES.map(s=>`
          <div class="example"><b>${CE.esc(s.title)}</b><br>
            <span class="muted">${s.body}</span><br>
            <span style="display:block; margin-top:6px">${s.ex}</span>
            <button class="btn sm" data-drill="${s.tid}" style="margin-top:8px">Drill this →</button>
          </div>`).join("")}
      </div>
    </div>

    <div class="card" id="setupCard">
      <h3>Topic</h3>
      <div class="chips" id="mTopics">
        <button class="chip sel" data-t="smart">🧠 Smart mix</button>
        ${CE.MATH_TOPICS.map(t=>`<button class="chip" data-t="${t.id}">${CE.esc(t.name)}</button>`).join("")}
      </div>
      <h3>Mode</h3>
      <div class="chips" id="mLen">
        <button class="chip sel" data-l="10">10 questions</button>
        <button class="chip" data-l="20">20</button>
        <button class="chip" data-l="5">Quick 5</button>
        <button class="chip" data-l="s60">⚡ 60s sprint${bests.s60?` · best ${bests.s60}`:""}</button>
        <button class="chip" data-l="s120">⚡ 120s sprint${bests.s120?` · best ${bests.s120}`:""}</button>
      </div>
      <div class="btn-row" style="margin-top:8px">
        <button class="btn grad" id="mStart">Start →</button>
        ${CE.state.math.missed.length?`<button class="btn" id="mReview">🔁 Review misses (${CE.state.math.missed.length})</button>`:""}
      </div>
      <p class="small muted" style="margin-top:10px">Sprints auto-submit the moment you type the right answer — no Enter needed. Big numbers accept <b style="color:var(--text)">300M</b>, <b style="color:var(--text)">1.5B</b>, <b style="color:var(--text)">45K</b>.</p>
    </div>

    <div class="card lesson">
      <div class="l-head" data-accordion><h3>📊 Your levels & accuracy</h3><span class="r-arrow">▾</span></div>
      <div class="l-body" id="mStats"></div>
    </div>

    <div id="mPlay"></div>`,
    mount(root){
      const chipsT=CE.$$("#mTopics .chip",root);
      chipsT.forEach(c=>c.onclick=()=>{ selTopic=c.dataset.t; chipsT.forEach(x=>x.classList.toggle("sel",x===c)); });
      CE.$$("#mLen .chip",root).forEach(c=>c.onclick=()=>{ selLen=c.dataset.l; CE.$$("#mLen .chip",root).forEach(x=>x.classList.toggle("sel",x===c)); });
      CE.$$("[data-drill]",root).forEach(b=>b.onclick=e=>{ e.stopPropagation();
        selTopic=b.dataset.drill;
        chipsT.forEach(x=>x.classList.toggle("sel",x.dataset.t===selTopic));
        CE.$("#setupCard",root).scrollIntoView({behavior:"smooth"});
      });

      // stats panel
      CE.$("#mStats",root).innerHTML = CE.MATH_TOPICS.map(t=>{
        const st=CE.state.math.topics[t.id];
        const acc=st&&st.att?Math.round(st.cor/st.att*100):null;
        const color=acc===null?"var(--border2)":acc>=85?"var(--green)":acc>=60?"var(--amber)":"var(--red)";
        return `<div style="margin-bottom:11px">
          <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px">
            <span>${CE.esc(t.name)} <span class="lvl muted">· lvl ${st?st.lvl:1}${st&&st.att?` · ${st.att} reps · ${(st.time/st.att/1000).toFixed(1)}s avg`:""}</span></span>
            <span class="muted">${acc===null?"—":acc+"%"}</span></div>
          <div class="bar"><div style="width:${acc||0}%; background:${color}"></div></div>
        </div>`;
      }).join("");

      const play=CE.$("#mPlay",root);
      CE.$("#mStart",root).onclick=()=>{
        if(selLen==="s60"||selLen==="s120"){
          const sec=selLen==="s60"?60:120;
          CE.Drill.sprint(play, {
            seconds:sec, backPath:"#/math",
            next(){ const t=selTopic==="smart"?mSmartPick(["estimation"]):MBY[selTopic]; return makeQ(t); },
            onResult:recordMathResult,
            onComplete(rs){
              const score=rs.filter(r=>r.ok).length;
              const key=selLen; const prev=CE.state.math.bests[key];
              const isRecord = score>0 && (prev==null || score>prev);
              if(isRecord)CE.state.math.bests[key]=score;
              CE.save();
              return {best:CE.state.math.bests[key]!=null?CE.state.math.bests[key]:score, isRecord};
            }
          });
        }else{
          CE.Drill.run(play, {
            count:+selLen, backPath:"#/math",
            next(){ const t=selTopic==="smart"?mSmartPick():MBY[selTopic]; return makeQ(t); },
            onResult:recordMathResult
          });
        }
        play.scrollIntoView({behavior:"smooth", block:"start"});
      };

      const rev=CE.$("#mReview",root);
      if(rev) rev.onclick=()=>{
        const items=CE.shuffle(CE.state.math.missed.slice()).slice(0,15);
        CE.Drill.run(play, {
          count:items.length, backPath:"#/math",
          next(i){ const m=items[i];
            return {type:"numeric", q:m.q, ans:m.ans, tol:m.tol, how:m.how, context:m.context,
              topic:"🔁 Review · "+(m.topic||""), inputmode:m.inputmode, keys:m.keys, _review:m}; },
          onResult(q, ok, ms){
            if(ok) CE.state.math.missed=CE.state.math.missed.filter(x=>x.q!==q.q);
            CE.state.math.total++; if(ok)CE.state.math.correct++; CE.state.math.timeSum+=ms;
            CE.save();
          }
        });
        play.scrollIntoView({behavior:"smooth", block:"start"});
      };
    }
  };
});
