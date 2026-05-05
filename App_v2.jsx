import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────
const T = {
  white:   "#FFFFFF",
  bg:      "#F8F9FB",
  navy:    "#0A1628",
  navySoft:"#1E2D45",
  navyFade:"#4A5568",
  orange:  "#F97316",
  orangeLt:"#FFF7ED",
  orangeMd:"#FED7AA",
  blue:    "#1A56DB",
  blueLt:  "#EBF5FF",
  green:   "#059669",
  greenLt: "#ECFDF5",
  red:     "#DC2626",
  redLt:   "#FEF2F2",
  amber:   "#D97706",
  amberLt: "#FFFBEB",
  line:    "#E5E7EB",
  lineSoft:"#F3F4F6",
};

// ─── GLOBAL CSS ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  html, body, #root { height:100%; overflow:hidden; }
  body { background:${T.white}; font-family:'Inter',sans-serif; color:${T.navy}; -webkit-font-smoothing:antialiased; }

  @keyframes fadeIn    { from{opacity:0}                    to{opacity:1}                       }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeLeft  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes drawLine  { from{stroke-dashoffset:var(--len,1000)} to{stroke-dashoffset:0}       }
  @keyframes scaleUp   { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.08)} }
  @keyframes countUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glow      { 0%,100%{box-shadow:0 0 0 0 ${T.orange}40} 50%{box-shadow:0 0 0 12px ${T.orange}00} }
  @keyframes drawCircle{ from{stroke-dashoffset:283} to{stroke-dashoffset:0} }
  @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

  .fu1{animation:fadeUp .6s ease .1s both}
  .fu2{animation:fadeUp .6s ease .25s both}
  .fu3{animation:fadeUp .6s ease .4s both}
  .fu4{animation:fadeUp .6s ease .55s both}
  .fu5{animation:fadeUp .6s ease .7s both}
  .fu6{animation:fadeUp .6s ease .85s both}
  .fi {animation:fadeIn .5s ease both}
  .su {animation:scaleUp .5s cubic-bezier(.22,1,.36,1) both}

  .screen { position:absolute; inset:0; overflow-y:auto; overflow-x:hidden; }
  .screen::-webkit-scrollbar{display:none}

  .nav-arrow {
    position:fixed; top:50%; transform:translateY(-50%);
    width:48px; height:48px; border-radius:50%;
    background:${T.white}; border:1.5px solid ${T.line};
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; z-index:100;
    transition: all .2s ease;
    box-shadow: 0 2px 12px rgba(0,0,0,.08);
  }
  .nav-arrow:hover { border-color:${T.orange}; color:${T.orange}; transform:translateY(-50%) scale(1.08); }

  .metric-big {
    font-family:'Syne',sans-serif;
    font-weight:800;
    letter-spacing:-0.03em;
    line-height:1;
  }

  .icon-ring {
    width:56px; height:56px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }

  .tag {
    font-family:'JetBrains Mono',monospace;
    font-size:10px; letter-spacing:.12em;
    padding:3px 10px; border-radius:4px;
    font-weight:500;
  }

  .supplier-row { transition:background .15s; border-radius:8px; cursor:pointer; }
  .supplier-row:hover { background:${T.lineSoft}; }

  .pill {
    font-size:11px; font-weight:600;
    padding:3px 10px; border-radius:20px;
    display:inline-flex; align-items:center; gap:4px;
  }

  .card {
    background:${T.white};
    border:1.5px solid ${T.line};
    border-radius:14px;
    transition: box-shadow .2s, border-color .2s;
  }
  .card:hover { box-shadow:0 6px 24px rgba(0,0,0,.06); border-color:${T.orange}40; }
`;

// ─── ICONS (SVG inline) ──────────────────────────────────────
const Icon = {
  chaos:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M6.6 6.6l1.4 1.4M15.4 15.4l1.4 1.4M6.6 17.4l1.4-1.4M15.4 8.6l1.4-1.4M3 12h2M19 12h2M12 3v2M12 19v2"/></svg>,
  process:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  risk:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
  manual:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  ai:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 014 4v2a4 4 0 01-4 4 4 4 0 01-4-4V6a4 4 0 014-4z"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>,
  shield:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  rocket:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>,
  check:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowL:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  signal:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10"/><path d="M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6"/><circle cx="12" cy="12" r="2"/></svg>,
  warning:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  trend:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  data:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
};

// ─── SCREEN INDICATOR ───────────────────────────────────────
function ScreenDots({ current, total, onGo }) {
  return (
    <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, zIndex:100 }}>
      {Array.from({length:total}).map((_,i) => (
        <button key={i} onClick={() => onGo(i)} style={{
          width: i === current ? 24 : 8, height:8, borderRadius:4,
          background: i === current ? T.orange : T.line,
          border:"none", cursor:"pointer", padding:0,
          transition:"all .3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── PROGRESS BAR (top) ─────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:3, background:T.line, zIndex:200 }}>
      <div style={{ height:"100%", background:T.orange, width:`${((current+1)/total)*100}%`, transition:"width .4s ease" }} />
    </div>
  );
}

// ─── LABEL HELPER ───────────────────────────────────────────
function Label({ children, color = T.orange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
      <div style={{ width:28, height:2, background:color, borderRadius:1 }} />
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color, letterSpacing:"0.16em", fontWeight:500 }}>
        {children}
      </span>
    </div>
  );
}

// ─── SCREEN 0: ENTRY ────────────────────────────────────────
function Entry({ onEnter }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3200);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div onClick={() => phase >= 2 && onEnter()} style={{
      position:"fixed", inset:0,
      background:T.white,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      cursor: phase >= 2 ? "pointer" : "default",
      padding:"40px",
    }}>
      {/* Animated orange line top */}
      <div style={{
        position:"absolute", top:0, left:0, height:4, background:T.orange,
        width: phase >= 1 ? "100%" : "0%",
        transition:"width 1s ease",
      }} />

      {/* Big statement */}
      <div style={{ maxWidth:720, textAlign:"center" }}>
        <div style={{
          fontFamily:"'Syne',sans-serif",
          fontSize:"clamp(36px,5vw,72px)",
          fontWeight:800,
          lineHeight:1.1,
          color:T.navy,
          letterSpacing:"-0.02em",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(24px)",
          transition:"opacity .8s ease .3s, transform .8s ease .3s",
          marginBottom:32,
        }}>
          I spent my first weeks<br />
          asking <span style={{ color:T.orange }}>questions.</span>
        </div>

        <div style={{
          fontFamily:"'Syne',sans-serif",
          fontSize:"clamp(36px,5vw,72px)",
          fontWeight:800,
          lineHeight:1.1,
          color:T.navy,
          letterSpacing:"-0.02em",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(24px)",
          transition:"opacity .8s ease, transform .8s ease",
          marginBottom:48,
        }}>
          What I found<br />
          <span style={{ color:T.orange }}>changed everything.</span>
        </div>

        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transition:"opacity .6s ease",
          display:"flex", alignItems:"center", justifyContent:"center", gap:12,
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:"11px", color:T.navyFade, letterSpacing:"0.15em",
            animation: phase >= 3 ? "pulse 2s ease infinite" : "none",
          }}>
            CLICK ANYWHERE TO ENTER
          </div>
          <div style={{ width:16, color:T.orange, animation: phase >= 3 ? "pulse 2s ease infinite" : "none" }}>{Icon.arrow}</div>
        </div>
      </div>

      {/* Bottom credit */}
      <div style={{
        position:"absolute", bottom:32,
        fontFamily:"'JetBrains Mono',monospace",
        fontSize:"10px", color:T.navyFade, letterSpacing:"0.12em",
        opacity: phase >= 2 ? 1 : 0, transition:"opacity .6s ease 1s",
      }}>
        VISHNU PRATAP KUMAR — DELL TECHNOLOGIES SCA
      </div>
    </div>
  );
}

// ─── SCREEN 1: DISCOVERY ────────────────────────────────────
function Discovery() {
  return (
    <div style={{ minHeight:"100vh", background:T.white, padding:"72px 80px 80px", display:"flex", flexDirection:"column", justifyContent:"center" }}>

      <div className="fu1"><Label>BEFORE ANYTHING WAS BUILT</Label></div>

      {/* Hero statement */}
      <div className="fu2" style={{ marginBottom:48 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,3.5vw,52px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.02em", maxWidth:760 }}>
          Nobody knew what Dell had,{" "}
          <span style={{ color:T.orange }}>who was using it,</span>{" "}
          or what risk it created.
        </h1>
      </div>

      {/* 4 discoveries as icon + text rows — NOT boxes */}
      <div className="fu3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"28px 60px", marginBottom:48 }}>
        {[
          { icon:Icon.chaos,   color:T.red,   bg:T.redLt,   num:"01", title:"Everything was everywhere", body:"Employees passed through 4–5 people to get one answer. No single owner. No single place. Chaos by design." },
          { icon:Icon.process, color:T.amber, bg:T.amberLt, num:"02", title:"Nobody knew the next step",  body:"Zero visibility into where a request was or who owned it. The process existed only in individuals' heads." },
          { icon:Icon.risk,    color:T.blue,  bg:T.blueLt,  num:"03", title:"Compliance was invisible",   body:"Most employees had no idea if their software was enterprise-licensed. Compliance risk grew silently — untracked." },
          { icon:Icon.manual,  color:T.orange,bg:T.orangeLt,num:"04", title:"A tech giant running manually", body:"The biggest surprise: Dell, a global technology company, managed software on manual processes with week-long delays." },
        ].map((d,i) => (
          <div key={i} style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
            {/* Icon */}
            <div className="icon-ring" style={{ background:d.bg, color:d.color, flexShrink:0 }}>
              <div style={{ width:24 }}>{d.icon}</div>
            </div>
            {/* Text */}
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:d.color, letterSpacing:"0.14em", marginBottom:6, fontWeight:500 }}>
                DISCOVERY {d.num}
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"16px", fontWeight:700, color:T.navy, marginBottom:6 }}>
                {d.title}
              </div>
              <div style={{ fontSize:"13px", color:T.navyFade, lineHeight:1.7 }}>
                {d.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pull quote */}
      <div className="fu4" style={{
        borderLeft:`4px solid ${T.orange}`,
        paddingLeft:24,
        maxWidth:600,
      }}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:600, fontStyle:"italic", color:T.navySoft, lineHeight:1.5 }}>
          "The problem was not missing technology.<br />It was missing clarity."
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN 2: PROGRAM ──────────────────────────────────────
function Program() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => s < 3 ? s+1 : s), 700);
    return () => clearInterval(t);
  }, []);

  const nodes = [
    { label:"Software Catalog",       sub:"AI search · RAG/LLM\n365K assets",          color:T.blue,  icon:Icon.data },
    { label:"Compliance Agent",        sub:"Silent removal · AI\n98K endpoints",          color:T.red,   icon:Icon.shield },
    { label:"Deployment Automation",   sub:"Camunda workflow\n5K+ requests",              color:T.green, icon:Icon.rocket },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, padding:"72px 80px 80px", display:"flex", flexDirection:"column", justifyContent:"center" }}>

      <div className="fu1"><Label>THE PROGRAM</Label></div>

      <div className="fu2" style={{ marginBottom:40 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,3.2vw,48px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.02em" }}>
          Three workstreams nobody had connected.{" "}
          <span style={{ color:T.orange }}>One program</span>{" "}
          that became the CIO initiative.
        </h1>
      </div>

      {/* Connection diagram */}
      <div className="fu3" style={{ display:"flex", alignItems:"center", gap:0, marginBottom:40, background:T.white, border:`1.5px solid ${T.line}`, borderRadius:16, padding:"36px 40px", position:"relative", overflow:"hidden" }}>

        {/* Three nodes */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, flex:1 }}>
          {nodes.map((n,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:14,
              background:T.white, border:`1.5px solid ${n.color}30`,
              borderLeft:`4px solid ${n.color}`,
              borderRadius:10, padding:"14px 18px",
              animation:`fadeLeft .5s ease ${.1+i*.15}s both`,
            }}>
              <div className="icon-ring" style={{ background:`${n.color}15`, color:n.color, width:40, height:40 }}>
                <div style={{ width:20 }}>{n.icon}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"14px", fontWeight:700 }}>{n.label}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, whiteSpace:"pre-line", lineHeight:1.6, marginTop:2 }}>{n.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SVG Connector */}
        <div style={{ width:120, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
            {[20,80,140].map((y,i) => (
              <line key={i} x1="0" y1={y} x2="90" y2="80"
                stroke={T.orange} strokeWidth="2" opacity=".7"
                strokeDasharray="200"
                strokeDashoffset={step > i ? 0 : 200}
                style={{ transition:`stroke-dashoffset .5s ease ${i*.15}s` }}
              />
            ))}
            <polygon points="90,74 108,80 90,86" fill={T.orange} opacity={step >= 3 ? .9 : 0} style={{ transition:"opacity .3s ease .6s" }} />
          </svg>
        </div>

        {/* Outcome */}
        <div style={{
          flex:1, textAlign:"center",
          background:`linear-gradient(135deg, ${T.orangeLt}, ${T.white})`,
          border:`2px solid ${T.orange}40`,
          borderRadius:14, padding:"32px 24px",
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? "scale(1)" : "scale(.92)",
          transition:"opacity .5s ease .7s, transform .5s ease .7s",
        }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:T.orange, letterSpacing:"0.14em", marginBottom:12 }}>CIO INITIATIVE</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:800, color:T.navy, marginBottom:4 }}>Software<br/>Modernisation</div>
          <div style={{ width:40, height:2, background:T.orange, borderRadius:1, margin:"16px auto" }} />
          <div className="metric-big" style={{ fontSize:44, color:T.orange }}>$400M</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginTop:4 }}>PROJECTED SAVINGS</div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="fu4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
        {[
          { val:"100K+", label:"Users reached",      sub:"Dell employees",    color:T.blue  },
          { val:"20K",   label:"Monthly active",     sub:"Regular users",     color:T.navy  },
          { val:"70%",   label:"Cycle time reduced", sub:"45 days → 15 min",  color:T.green },
          { val:"4 yrs", label:"Zero escalations",   sub:"No manager issues", color:T.orange},
        ].map((m,i) => (
          <div key={i} className="card" style={{ padding:"20px 22px" }}>
            <div className="metric-big" style={{ fontSize:36, color:m.color, marginBottom:6 }}>{m.val}</div>
            <div style={{ fontSize:"13px", fontWeight:600, color:T.navy }}>{m.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginTop:3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* SNOW callout */}
      <div className="fu5" style={{ background:T.orangeLt, border:`1.5px solid ${T.orange}30`, borderRadius:10, padding:"16px 24px", display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:32, color:T.orange, flexShrink:0 }}>{Icon.trend}</div>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"14px", fontWeight:700, color:T.navy }}>ServiceNow took 3 quarters to replicate what was already built.</div>
          <div style={{ fontSize:"12px", color:T.navyFade, marginTop:2 }}>Our catalog data became the reference dataset for their migration. Built with 5 junior developers.</div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3: AGENT ────────────────────────────────────────
function Agent() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setTimeout(() => setDrawn(true), 400); }, []);

  const stages = [
    { label:"Internal Testing",    sub:"You + developer · iterate and fix",    color:T.blue  },
    { label:"30-Member Pilot",     sub:"Controlled group · feedback cycles",   color:T.blue  },
    { label:"Formal Intake",       sub:"Packaging · engineering · validation", color:T.navy  },
    { label:"Go / No-Go",          sub:"Security · support · engineering",     color:T.orange},
    { label:"Ring Deployment",     sub:"Pre-agreed criteria · 98K devices",    color:T.green },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.white, padding:"72px 80px 80px", display:"flex", flexDirection:"column", justifyContent:"center" }}>

      <div className="fu1"><Label color={T.red}>RISK INTELLIGENCE — BUILT FROM ZERO</Label></div>

      <div className="fu2" style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,3.2vw,48px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.02em", maxWidth:760 }}>
          First of its kind.{" "}
          <span style={{ color:T.red }}>No industry precedent.</span>{" "}
          No team. Just a process that worked.
        </h1>
      </div>

      {/* Governance timeline */}
      <div className="fu3" style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, letterSpacing:"0.14em", marginBottom:20 }}>
          5-STAGE GOVERNANCE — DESIGNED FROM SCRATCH
        </div>
        <div style={{ position:"relative" }}>
          {/* Connecting line */}
          <div style={{
            position:"absolute", top:24, left:24, right:24, height:2,
            background:T.lineSoft, borderRadius:1, zIndex:0,
          }}>
            <div style={{
              height:"100%", background:T.orange, borderRadius:1,
              width: drawn ? "100%" : "0%",
              transition:"width 1.2s ease .3s",
            }} />
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", position:"relative", zIndex:1 }}>
            {stages.map((s,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", width:`${100/stages.length}%` }}>
                {/* Node */}
                <div style={{
                  width:48, height:48, borderRadius:"50%",
                  background:T.white, border:`2.5px solid ${s.color}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:"12px", fontWeight:500, color:s.color,
                  marginBottom:12,
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "scale(1)" : "scale(.7)",
                  transition:`opacity .4s ease ${.5+i*.12}s, transform .4s ease ${.5+i*.12}s`,
                  boxShadow: s.color === T.orange ? `0 0 0 4px ${T.orange}20` : "none",
                }}>
                  {String(i+1).padStart(2,"0")}
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"11px", fontWeight:700, color:T.navy, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", color:T.navyFade, lineHeight:1.5 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics + Crisis */}
      <div className="fu4" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

        {/* Metrics 2x2 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { val:"95%+", label:"Removal efficiency", color:T.green },
            { val:"98K",  label:"Global endpoints",   color:T.blue  },
            { val:"100K+",label:"Removals done",      color:T.red   },
            { val:"<2d",  label:"Crisis resolved",    color:T.orange},
          ].map((m,i) => (
            <div key={i} className="card" style={{ padding:"18px 20px", textAlign:"center" }}>
              <div className="metric-big" style={{ fontSize:34, color:m.color }}>{m.val}</div>
              <div style={{ fontSize:"11px", color:T.navyFade, marginTop:4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Crisis panel */}
        <div style={{ background:T.redLt, border:`1.5px solid ${T.red}25`, borderRadius:14, padding:"22px 24px", borderLeft:`4px solid ${T.red}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.red, letterSpacing:"0.14em", marginBottom:14 }}>
            POST-LAUNCH CRISIS — RESOLVED IN &lt;2 DAYS
          </div>
          <div style={{ fontSize:"13px", color:T.navy, lineHeight:1.65, marginBottom:14 }}>
            Silent removal triggered auto-restarts across all 98K endpoints after full deployment.
          </div>
          {[
            ["Engineering", "Root cause identified in hours, not days"],
            ["Leadership",  "VP updated every 4 hours throughout"],
            ["Users",       "Communication out within the first hour"],
            ["Resolution",  "Fix deployed to all devices in under 2 days"],
          ].map(([who,what],i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:T.red, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                <div style={{ width:10, color:T.white }}>{Icon.check}</div>
              </div>
              <div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.red, fontWeight:500 }}>{who} — </span>
                <span style={{ fontSize:"12px", color:T.navySoft }}>{what}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture bridge */}
      <div className="fu5" style={{ marginTop:20, background:T.lineSoft, border:`1.5px solid ${T.line}`, borderRadius:10, padding:"14px 24px" }}>
        <p style={{ fontSize:"13px", color:T.navySoft, fontStyle:"italic" }}>
          Detect signal → govern the response → act at scale → measure outcome. This is the same architecture supplier risk monitoring needs.
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN 4: VISION ───────────────────────────────────────
const SUPPLIERS = [
  { name:"Supplier Alpha",   country:"Taiwan",   tier:"T1", cat:"Semiconductors",  score:87, status:"high",   signal:"Credit rating downgraded Q1 2026",      action:"Schedule executive review",        trend:"↑" },
  { name:"Supplier Beta",    country:"Malaysia", tier:"T2", cat:"PCB Assembly",     score:52, status:"medium", signal:"Delivery SLA trending down 3 months",   action:"Monitor monthly — flag if <90%",   trend:"↓" },
  { name:"Supplier Gamma",   country:"China",    tier:"T1", cat:"Display Panels",   score:91, status:"high",   signal:"Single source — no qualified alternate",action:"Qualify alternate by Q3",           trend:"↑" },
  { name:"Supplier Delta",   country:"Mexico",   tier:"T1", cat:"Logistics",         score:21, status:"low",    signal:"All SLAs met — no adverse signals",     action:"Routine quarterly review only",    trend:"→" },
  { name:"Supplier Epsilon", country:"India",    tier:"T2", cat:"Cable Assembly",   score:44, status:"medium", signal:"RBA audit overdue by 6 weeks",           action:"Confirm audit date this week",     trend:"→" },
];
const SC = { high:{bg:T.redLt,  color:T.red,   border:`${T.red}25`   },
             medium:{bg:T.amberLt,color:T.amber, border:`${T.amber}25`},
             low:{bg:T.greenLt,color:T.green, border:`${T.green}25`} };

function RiskGauge({ value, color }) {
  const r = 36, circ = 2 * Math.PI * r;
  const pct = value / 100;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} stroke={T.lineSoft} strokeWidth="8" fill="none"/>
      <circle cx="45" cy="45" r={r} stroke={color} strokeWidth="8" fill="none"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ animation:"drawCircle .8s ease forwards" }}
      />
      <text x="45" y="49" textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize="16" fill={color}>{value}</text>
    </svg>
  );
}

function Vision() {
  const [active, setActive] = useState(null);
  const summary = [
    { val:"2", label:"High Risk",   note:"↑ 1 vs last week", color:T.red    },
    { val:"2", label:"Medium Risk", note:"unchanged",         color:T.amber  },
    { val:"1", label:"Low Risk",    note:"↓ 1 resolved",      color:T.green  },
    { val:"3", label:"Actions Due", note:"this week",         color:T.blue   },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, padding:"72px 80px 80px", display:"flex", flexDirection:"column", justifyContent:"center" }}>

      <div className="fu1" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Label color={T.green}>ILLUSTRATIVE · DUMMY DATA</Label>
        <span className="tag" style={{ background:T.greenLt, color:T.green, border:`1px solid ${T.green}30` }}>
          PROACTIVE RISK MONITORING
        </span>
      </div>

      <div className="fu2" style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,2.8vw,42px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.02em" }}>
          What proactive risk monitoring looks like{" "}
          <span style={{ color:T.green }}>when it's built for the person who has to act.</span>
        </h1>
      </div>

      {/* Summary */}
      <div className="fu3" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {summary.map((s,i) => (
          <div key={i} className="card" style={{ padding:"16px 18px", textAlign:"center" }}>
            <div className="metric-big" style={{ fontSize:38, color:s.color }}>{s.val}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"12px", fontWeight:700, color:T.navy, marginTop:4 }}>{s.label}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginTop:3 }}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Supplier table */}
      <div className="fu4" style={{ background:T.white, border:`1.5px solid ${T.line}`, borderRadius:14, overflow:"hidden", marginBottom:16 }}>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 100px 2fr 2.5fr 100px", gap:12, padding:"10px 20px", background:T.lineSoft, borderBottom:`1px solid ${T.line}` }}>
          {["SUPPLIER","TIER","RISK","PRIMARY SIGNAL","RECOMMENDED ACTION","STATUS"].map((h,i) => (
            <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, letterSpacing:"0.1em" }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {SUPPLIERS.map((s,i) => (
          <div key={i}>
            <div className="supplier-row"
              onClick={() => setActive(active===i?null:i)}
              style={{ display:"grid", gridTemplateColumns:"2fr 1fr 100px 2fr 2.5fr 100px", gap:12, padding:"12px 20px", borderBottom: i < SUPPLIERS.length-1 ? `1px solid ${T.lineSoft}` : "none", background: active===i ? T.orangeLt : T.white }}>
              <div>
                <div style={{ fontSize:"13px", fontWeight:600, color:T.navy }}>{s.name}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginTop:2 }}>{s.country} · {s.cat}</div>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:T.navyFade, paddingTop:2 }}>{s.tier}</div>
              <div>
                <div style={{ height:4, background:T.lineSoft, borderRadius:2, marginBottom:4 }}>
                  <div style={{ width:`${s.score}%`, height:"100%", background:SC[s.status].color, borderRadius:2, transition:"width .6s ease" }} />
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:SC[s.status].color, fontWeight:500 }}>{s.score} {s.trend}</span>
              </div>
              <div style={{ fontSize:"12px", color:T.navySoft, lineHeight:1.4 }}>{s.signal}</div>
              <div style={{ fontSize:"12px", color:T.navyFade, fontStyle:"italic", lineHeight:1.4 }}>{s.action}</div>
              <div>
                <span className="pill" style={{ background:SC[s.status].bg, color:SC[s.status].color, border:`1px solid ${SC[s.status].border}` }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:SC[s.status].color, display:"inline-block" }} />
                  {s.status}
                </span>
              </div>
            </div>
            {active===i && (
              <div style={{ background:T.orangeLt, padding:"14px 20px 16px", borderBottom:`1px solid ${T.line}`, animation:"fadeUp .2s ease both" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginBottom:4 }}>RISK SIGNAL</div>
                    <div style={{ fontSize:"13px", color:SC[s.status].color, fontWeight:500 }}>{s.signal}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginBottom:4 }}>RECOMMENDED ACTION</div>
                    <div style={{ fontSize:"13px", color:T.navy, fontWeight:500 }}>{s.action}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.navyFade, marginBottom:4 }}>RISK SCORE</div>
                    <RiskGauge value={s.score} color={SC[s.status].color} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Two principles */}
      <div className="fu5" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background:T.greenLt, border:`1.5px solid ${T.green}25`, borderRadius:10, padding:"16px 20px" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.green, letterSpacing:"0.12em", marginBottom:8 }}>THE PRINCIPLE</div>
          <p style={{ fontSize:"13px", color:T.navySoft, lineHeight:1.65 }}>
            Leading indicators — not news articles. Structured signals, not internet noise. Built for the analyst who acts, not the engineer who builds.
          </p>
        </div>
        <div style={{ background:T.orangeLt, border:`1.5px solid ${T.orange}25`, borderRadius:10, padding:"16px 20px" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.orange, letterSpacing:"0.12em", marginBottom:8 }}>THE COMMITMENT</div>
          <p style={{ fontSize:"13px", color:T.navySoft, lineHeight:1.65 }}>
            I don't describe what I'd build. I build a version of it. This took an afternoon. The real one — with SCA's data — is where the work starts.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────
const SCREENS = [Discovery, Program, Agent, Vision];

export default function App() {
  const [entered, setEntered] = useState(false);
  const [idx, setIdx]         = useState(0);

  const go = (i) => { if(i >= 0 && i < SCREENS.length) setIdx(i); };
  const Screen = SCREENS[idx];

  return (
    <>
      <style>{CSS}</style>
      {!entered ? (
        <Entry onEnter={() => setEntered(true)} />
      ) : (
        <>
          <ProgressBar current={idx} total={SCREENS.length} />

          {/* Left arrow */}
          {idx > 0 && (
            <button className="nav-arrow" onClick={() => go(idx-1)} style={{ left:16, color:T.navyFade }}>
              <div style={{ width:20 }}>{Icon.arrowL}</div>
            </button>
          )}

          {/* Right arrow */}
          {idx < SCREENS.length-1 && (
            <button className="nav-arrow" onClick={() => go(idx+1)} style={{ right:16, color:T.navyFade }}>
              <div style={{ width:20 }}>{Icon.arrow}</div>
            </button>
          )}

          {/* Screen dots */}
          <ScreenDots current={idx} total={SCREENS.length} onGo={go} />

          {/* Screen content */}
          <div className="screen" key={idx}>
            <Screen />
          </div>
        </>
      )}
    </>
  );
}
