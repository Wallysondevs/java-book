import{c as o,j as e,a as l,r as i,m as h}from"./index-BpXci30S.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=o("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=o("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=o("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=o("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=o("StickyNote",[["path",{d:"M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z",key:"qazsjp"}],["path",{d:"M15 3v4a2 2 0 0 0 2 2h4",key:"40519r"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=o("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);function j({level:t}){const r={iniciante:"bg-secondary/10 text-secondary border-secondary/20",intermediario:"bg-yellow-500/10 text-yellow-500 border-yellow-500/20",avancado:"bg-red-500/10 text-red-500 border-red-500/20"},n={iniciante:"Iniciante",intermediario:"Intermediário",avancado:"Avançado"};return e.jsx("span",{className:l("px-3 py-1 text-xs font-semibold rounded-full border",r[t]),children:n[t]})}function C({title:t,subtitle:r,difficulty:n,timeToRead:s,children:a}){const[x,m]=i.useState(0);return i.useEffect(()=>{const c=()=>{const p=document.documentElement.scrollTop,d=document.documentElement.scrollHeight-document.documentElement.clientHeight,g=d>0?p/d:0;m(g)};return window.addEventListener("scroll",c),()=>window.removeEventListener("scroll",c)},[]),e.jsxs("div",{className:"max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 pb-32 min-h-[60vh]",children:[e.jsx("div",{className:"fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 z-50 transition-all duration-150",style:{width:`${x*100}%`}}),e.jsxs(h.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4},children:[e.jsxs("header",{className:"mb-10",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3 mb-4",children:[n&&e.jsx(j,{level:n}),s&&e.jsxs("span",{className:"text-sm text-muted-foreground flex items-center gap-1.5",children:["⏱ ",s]})]}),e.jsx("h1",{className:"text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3",children:t}),r&&e.jsx("p",{className:"text-lg text-muted-foreground leading-relaxed",children:r})]}),e.jsx("article",{className:"prose prose-lg max-w-none",children:a})]})]})}const v={info:"bg-blue-500/10 border-blue-500/20",warning:"bg-yellow-500/10 border-yellow-500/20",danger:"bg-red-500/10 border-red-500/20",success:"bg-emerald-500/10 border-emerald-500/20",tip:"bg-[#ED8B00]/10 border-[#ED8B00]/30",note:"bg-purple-500/10 border-purple-500/20"},N={info:"text-blue-400",warning:"text-yellow-400",danger:"text-red-400",success:"text-emerald-400",tip:"text-[#ED8B00]",note:"text-purple-400"},E={info:b,warning:w,danger:u,success:y,tip:f,note:k};function M({type:t="info",title:r,children:n,className:s}){const a=E[t];return e.jsxs("div",{className:l("rounded-xl border p-5 my-6 flex gap-4 items-start",v[t],s),children:[e.jsx(a,{className:l("w-6 h-6 shrink-0 mt-0.5",N[t])}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h5",{className:"font-semibold text-foreground mb-1",children:r}),e.jsx("div",{className:"text-sm leading-relaxed text-foreground/85 [&_code]:bg-black/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#FFC56B]",children:n})]})]})}export{M as A,C as P};
