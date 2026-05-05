import { useState, useEffect } from "react";

// ── TOKENS ────────────────────────────────────────────────────────
const T = {
  bg:    "#0C0A08",
  bgSft: "#141109",
  cream: "#EDE9E0",
  muted: "rgba(237,233,224,.42)",
  faint: "rgba(237,233,224,.14)",
  ghost: "rgba(237,233,224,.05)",
  gold:  "#C9A96E",
  goldA: "rgba(201,169,110,.1)",
  line:  "rgba(237,233,224,.09)",
  red:   "#F87171",
  amber: "#FCD34D",
  green: "#34D399",
  blue:  "#60A5FA",
};


// ── CSS ───────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html,body,#root { height:100%; overflow:hidden; }
body { background:#0C0A08; font-family:'DM Sans',sans-serif; color:#EDE9E0; -webkit-font-smoothing:antialiased; }

@keyframes snap    { from{opacity:0} to{opacity:1} }
@keyframes rise    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fade    { from{opacity:0} to{opacity:1} }
@keyframes countUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes growX   { from{width:0} to{width:100%} }
@keyframes drawPth { to{stroke-dashoffset:0} }
@keyframes nodeIn  { from{opacity:0;transform:scale(.6)} to{opacity:1;transform:scale(1)} }
@keyframes pulseGlow { 0%,100%{opacity:.55} 50%{opacity:.9} }
@keyframes scanY { 0%{transform:translateY(-100%);opacity:0} 12%{opacity:.8} 88%{opacity:.35} 100%{transform:translateY(100%);opacity:0} }

.scene {
  position:fixed; inset:0;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  overflow:hidden;
}

.slide-shell {
  width:min(1120px, calc(100vw - 156px));
  margin:0 auto;
  padding:0 clamp(20px,3.5vw,48px);
  position:relative;
  z-index:2;
}

.slide-shell--wide {
  width:min(1180px, calc(100vw - 156px));
}

.slide-shell--dashboard {
  width:min(1160px, calc(100vw - 156px));
  padding:44px clamp(20px,3.5vw,48px) 68px;
}

@media (max-width: 760px) {
  .slide-shell,
  .slide-shell--wide,
  .slide-shell--dashboard {
    width:calc(100vw - 44px);
    padding-left:18px;
    padding-right:18px;
  }
}

.serif { font-family:'Cormorant Garamond',serif; }
.mono  { font-family:'IBM Plex Mono',monospace; }

.lbl {
  font-family:'IBM Plex Mono',monospace;
  font-size:9px; letter-spacing:.2em; text-transform:uppercase;
  color:rgba(237,233,224,.36);
}

.gold-lbl {
  font-family:'IBM Plex Mono',monospace;
  font-size:9px; letter-spacing:.22em; text-transform:uppercase;
  color:#C9A96E;
  display:flex; align-items:center; gap:8px;
}
.gold-lbl::before {
  content:''; width:4px; height:4px;
  border-radius:50%; background:#C9A96E; display:inline-block; flex-shrink:0;
}

.ev-block {
  background: rgba(237,233,224,.03);
  border: 1px solid rgba(237,233,224,.08);
  border-radius: 8px;
  padding: 22px 24px;
  position: relative;
  overflow: hidden;
}

.code-box {
  font-family:'IBM Plex Mono',monospace;
  font-size:10.5px; line-height:1.95;
  color:rgba(237,233,224,.38);
  background:rgba(0,0,0,.25);
  padding:13px 15px; border-radius:5px;
  margin-bottom:16px;
}

.d-row { transition:background .12s ease; cursor:pointer; }
.d-row:hover { background:rgba(201,169,110,.06); }

.prove-stage {
  display:grid;
  grid-template-columns:minmax(0, .9fr) minmax(390px, 1.28fr);
  gap:24px;
  align-items:center;
}

.proof-card {
  position:relative;
  overflow:hidden;
  min-height:112px;
  padding:14px 18px;
  border-radius:8px;
  border:1px solid rgba(237,233,224,.08);
  background:linear-gradient(135deg, rgba(237,233,224,.055), rgba(0,0,0,.18));
  backdrop-filter:blur(5px);
}

.proof-card::after {
  content:'';
  position:absolute;
  inset:-120% 0;
  background:linear-gradient(to bottom, transparent, rgba(201,169,110,.08), transparent);
  animation:scanY 4.4s ease-in-out infinite;
  pointer-events:none;
}

.proof-grid {
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:12px;
}

.proof-metric {
  border-top:1px solid rgba(237,233,224,.12);
  padding-top:12px;
}

.build-grid {
  display:grid;
  grid-template-columns:repeat(3, minmax(0, 1fr));
  gap:12px;
}

.build-card {
  position:relative;
  min-height:218px;
  padding:14px 16px 12px;
  border-radius:8px;
  border:1px solid rgba(237,233,224,.1);
  background:linear-gradient(180deg, rgba(237,233,224,.055), rgba(0,0,0,.24));
  overflow:hidden;
  backdrop-filter:blur(4px);
}

.build-card__num {
  position:absolute;
  right:12px;
  top:6px;
  font-family:'Cormorant Garamond',serif;
  font-size:72px;
  line-height:1;
  font-weight:700;
  color:rgba(237,233,224,.045);
  pointer-events:none;
}

.build-metric-list {
  display:grid;
  grid-template-columns:repeat(2, minmax(0, 1fr));
  gap:7px;
  margin-top:10px;
}

.build-metric {
  border-top:1px solid rgba(237,233,224,.1);
  padding-top:8px;
}

.build-hub {
  display:grid;
  grid-template-columns:minmax(260px, .8fr) minmax(0, 1.2fr);
  gap:14px;
  align-items:center;
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid rgba(237,233,224,.1);
}

@media (max-width: 980px) {
  .build-grid,
  .build-hub {
    grid-template-columns:1fr;
  }
}

@media (max-width: 760px) {
  .build-scene {
    overflow-y:auto;
    justify-content:flex-start;
  }

  .build-scene .slide-shell--wide {
    padding-top:32px;
    padding-bottom:82px;
  }
}

@media (max-width: 980px) {
  .prove-stage {
    grid-template-columns:1fr;
    gap:16px;
  }

  .proof-grid {
    grid-template-columns:1fr;
  }
}

@media (max-width: 760px) {
  .prove-scene {
    overflow-y:auto;
    justify-content:flex-start;
  }

  .prove-scene .slide-shell--wide {
    padding-top:32px;
    padding-bottom:78px;
  }

  .proof-card {
    min-height:0;
    padding:14px 16px;
  }
}

.side-progress {
  position:fixed;
  right:16px;
  top:50%;
  transform:translateY(-50%);
  z-index:500;
  width:86px;
  pointer-events:auto;
  user-select:none;
}

.side-progress__count {
  font-family:'IBM Plex Mono',monospace;
  font-size:10px;
  color:#C9A96E;
  text-align:right;
  margin-bottom:12px;
}

.side-progress__list {
  position:relative;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.side-progress__track {
  position:absolute;
  top:7px;
  right:4px;
  bottom:7px;
  width:1px;
  background:rgba(237,233,224,.09);
  border-radius:2px;
}

.side-progress__fill {
  position:absolute;
  top:0;
  left:0;
  width:100%;
  background:#C9A96E;
  border-radius:2px;
  box-shadow:0 0 9px rgba(201,169,110,.45);
  transition:height .32s ease;
}

.side-progress__step {
  position:relative;
  z-index:1;
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:8px;
  height:18px;
  border:0;
  background:transparent;
  color:rgba(237,233,224,.16);
  font-family:'IBM Plex Mono',monospace;
  font-size:8px;
  text-transform:uppercase;
  cursor:pointer;
}

.side-progress__step.is-past { color:rgba(201,169,110,.42); }
.side-progress__step.is-current { color:#C9A96E; }

.side-progress__dot {
  width:7px;
  height:7px;
  border-radius:50%;
  border:1px solid rgba(237,233,224,.16);
  background:#0C0A08;
  flex:0 0 auto;
  transition:all .2s ease;
}

.side-progress__step.is-past .side-progress__dot {
  border-color:rgba(201,169,110,.5);
  background:rgba(201,169,110,.5);
}

.side-progress__step.is-current .side-progress__dot {
  width:10px;
  height:10px;
  border-color:#C9A96E;
  background:#C9A96E;
  box-shadow:0 0 9px rgba(201,169,110,.8);
}

@media (max-width: 760px) {
  .side-progress {
    right:8px;
    width:44px;
  }

  .side-progress__label {
    display:none;
  }
}
`;

// ── COUNTER ───────────────────────────────────────────────────────
function Counter({ target, duration = 2000, color = T.gold, size = "clamp(72px,10vw,136px)" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);
  const fmt = n => target >= 1e8 ? "$" + Math.floor(n / 1e6) + "M" : String(n);
  return (
    <span className="serif" style={{
      fontSize: size, fontWeight: 700, color,
      letterSpacing: "-0.045em", lineHeight: 1,
      animation: "countUp .5s ease both",
    }}>
      {fmt(v)}
    </span>
  );
}

// ── GAUGE ─────────────────────────────────────────────────────────
function Gauge({ value, color }) {
  const r = 28, c = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} stroke={`${color}22`} strokeWidth="6" fill="none" />
      <circle cx="36" cy="36" r={r} stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset .8s ease" }} />
      <text x="36" y="40" textAnchor="middle"
        fontFamily="Cormorant Garamond" fontWeight="700" fontSize="16" fill={color}>
        {value}
      </text>
    </svg>
  );
}

function SlideProgress({ scene, labels, onJump }) {
  const total = labels.length;
  const progress = total > 1 ? (scene / (total - 1)) * 100 : 100;
  const pad = n => String(n).padStart(2, "0");

  return (
    <nav className="side-progress" aria-label="Slide progress" onClick={e => e.stopPropagation()}>
      <div className="side-progress__count">{pad(scene + 1)} / {pad(total)}</div>
      <div className="side-progress__list">
        <div className="side-progress__track" aria-hidden="true">
          <div className="side-progress__fill" style={{ height: `${progress}%` }} />
        </div>
        {labels.map((label, i) => {
          const state = i === scene ? "is-current" : i < scene ? "is-past" : "";
          return (
            <button
              key={label}
              type="button"
              className={`side-progress__step ${state}`}
              aria-label={`Go to slide ${i + 1}: ${label}`}
              aria-current={i === scene ? "step" : undefined}
              onClick={() => onJump(i)}
            >
              <span className="side-progress__label">{label}</span>
              <span className="side-progress__dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── FLOW DIAGRAM ──────────────────────────────────────────────────
function FlowDiagram({ visible }) {
  if (!visible) return null;
  const p = (d, delay, stroke) => ({
    stroke, fill: "none", strokeWidth: 1.2,
    strokeDasharray: d, strokeDashoffset: d,
    animation: `drawPth .7s ease ${delay}ms forwards`,
  });
  return (
    <div style={{ width: "100%", marginTop: 20, animation: "fade .4s ease both" }}>
      <svg viewBox="0 0 520 96" width="100%" height="56" preserveAspectRatio="xMidYMid meet">
        <path d="M 0 14 C 90 14 140 48 200 48" style={p(215, 0,   T.blue)} />
        <path d="M 0 48 L 200 48"               style={p(200, 110, T.gold)} />
        <path d="M 0 82 C 90 82 140 48 200 48"  style={p(215, 220, T.green)} />
        <text x="4" y="10"  fontFamily="IBM Plex Mono" fontSize="7" fill="rgba(96,165,250,.65)">Software Catalog</text>
        <text x="4" y="44"  fontFamily="IBM Plex Mono" fontSize="7" fill="rgba(201,169,110,.65)">Compliance Agent</text>
        <text x="4" y="78"  fontFamily="IBM Plex Mono" fontSize="7" fill="rgba(52,211,153,.65)">Deployment Engine</text>
        <circle cx="200" cy="48" r="3.5" fill={T.cream} style={{ animation: "fade .3s ease 400ms both" }} />
        <path d="M 200 48 L 375 48" style={p(175, 460, T.cream)} />
        <g style={{ animation: "fade .5s ease 700ms both" }}>
          <text x="384" y="40" fontFamily="Cormorant Garamond" fontSize="28" fontWeight="700" fill={T.gold}>$400M</text>
          <text x="384" y="55" fontFamily="IBM Plex Mono" fontSize="7" fill="rgba(237,233,224,.32)">projected savings · CIO initiative</text>
        </g>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SCENE 0 — OPENING
// Three words. One identity.
// ══════════════════════════════════════════════════════════════════
function SceneOpen({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 500),
      setTimeout(() => setPh(2), 1400),
      setTimeout(() => setPh(3), 2300),
      setTimeout(() => setPh(4), 3400),
      setTimeout(() => setPh(5), 4200),
      setTimeout(() => setPh(6), 5400),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene"
      style={{ cursor: ph >= 5 ? "pointer" : "default" }}
      onClick={ph >= 5 ? onNext : undefined}>

      {/* Cinematic neural background */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"url(/bg-cinematic-open.png)",
        backgroundSize:"cover", backgroundPosition:"center",
        backgroundRepeat:"no-repeat",
        opacity:.42,
      }}/>
      {/* Extra dark gradient at bottom for text legibility */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to top, rgba(12,10,8,.85) 0%, transparent 60%)",
      }}/>

      <div style={{ maxWidth: 860, padding: "0 clamp(24px,5vw,72px)", width: "min(100%, 860px)", position: "relative", zIndex: 2 }}>

        {/* The three verbs — snap in one by one */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 52 }}>
          {[
            { word: "SEARCH.", phase: 1 },
            { word: "PROVE.",  phase: 2 },
            { word: "BUILD.",  phase: 3 },
          ].map((v) => (
            <div key={v.word} className="serif" style={{
              fontSize: "clamp(64px,9.5vw,124px)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              lineHeight: 1.06,
              color: T.gold,
              opacity: ph >= v.phase ? 1 : 0,
              transition: "opacity .12s ease",
            }}>
              {v.word}
            </div>
          ))}
        </div>

        {/* Separator */}
        {ph >= 4 && (
          <div style={{
            height: 1,
            background: `linear-gradient(to right, ${T.gold}, transparent)`,
            marginBottom: 30,
            animation: "growX .75s cubic-bezier(.22,1,.36,1) both",
          }} />
        )}

        {/* Statement */}
        {ph >= 4 && (
          <div className="serif" style={{
            fontSize: "clamp(18px,2.3vw,30px)",
            fontWeight: 300, fontStyle: "italic",
            color: T.muted, lineHeight: 1.5,
            marginBottom: 44,
            animation: "rise .65s ease .05s both",
          }}>
            This is how I work.
          </div>
        )}

        {/* Name + entry prompt */}
        {ph >= 5 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            animation: "fade .6s ease both",
          }}>
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "10px", letterSpacing: ".22em",
                color: T.gold, marginBottom: 8,
              }}>VISHNU PRATAP KUMAR</div>
              <div className="lbl">DELL TECHNOLOGIES · SCA TPM · MAY 2026</div>
            </div>
            {ph >= 6 && (
              <div className="gold-lbl" style={{ animation: "fade 1s ease both" }}>
                CLICK TO BEGIN →
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SCENE 1 — SEARCH  (knowledge graph — discovery story)
// ══════════════════════════════════════════════════════════════════

// Small SVG icons rendered at a translated origin (0,0)
function NodeIcon({ type, color }) {
  switch (type) {
    case "alert":
      return (
        <>
          <polygon points="0,-8 8,6 -8,6" fill="none" stroke={color} strokeWidth={1.3} strokeLinejoin="round"/>
          <line x1="0" y1="-3" x2="0" y2="2" stroke={color} strokeWidth={1.3} strokeLinecap="round"/>
          <circle cx="0" cy="4.5" r=".9" fill={color}/>
        </>
      );
    case "clock":
      return (
        <>
          <circle r="7.5" fill="none" stroke={color} strokeWidth={1.3}/>
          <line x1="0" y1="0" x2="0" y2="-4.5" stroke={color} strokeWidth={1.3} strokeLinecap="round"/>
          <line x1="0" y1="0" x2="3.5" y2="2" stroke={color} strokeWidth={1.3} strokeLinecap="round"/>
          <circle cx="0" cy="0" r=".8" fill={color}/>
        </>
      );
    case "eye":
      return (
        <>
          <path d="M-8,0 C-5,-5.5 5,-5.5 8,0 C5,5.5 -5,5.5 -8,0 Z" fill="none" stroke={color} strokeWidth={1.3}/>
          <circle r="2.5" fill="none" stroke={color} strokeWidth={1.3}/>
          <line x1="-7" y1="-5" x2="7" y2="5" stroke={color} strokeWidth={1.2} opacity=".7"/>
        </>
      );
    case "mail":
      return (
        <>
          <rect x="-8" y="-5.5" width="16" height="11" rx="1.5" fill="none" stroke={color} strokeWidth={1.3}/>
          <polyline points="-8,-5.5 0,1.5 8,-5.5" fill="none" stroke={color} strokeWidth={1.3} strokeLinejoin="round"/>
        </>
      );
    case "hourglass":
      return (
        <>
          <path d="M-6.5,-8 L6.5,-8 L0,0 L6.5,8 L-6.5,8 L0,0 Z" fill="none" stroke={color} strokeWidth={1.3} strokeLinejoin="round"/>
          <line x1="-6.5" y1="-8" x2="6.5" y2="-8" stroke={color} strokeWidth={1.3}/>
          <line x1="-6.5" y1="8" x2="6.5" y2="8" stroke={color} strokeWidth={1.3}/>
          <path d="M-4,5 L4,5" stroke={color} strokeWidth={2} strokeLinecap="round" opacity=".5"/>
        </>
      );
    default: return null;
  }
}

function SceneSearch({ onNext }) {
  const [ph, setPh] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 400),
      setTimeout(() => setPh(2), 1000),
      setTimeout(() => setPh(3), 3000),
      setTimeout(() => setPh(4), 5200),
      setTimeout(() => setPh(5), 7200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const handle = () => ph >= 5 ? onNext() : setPh(p => Math.min(p + 1, 5));

  // Layout geometry
  const CX = 430, CY = 245, CR = 68;
  const OX = 950, OY = 245;
  const EDGE_START_X = 210; // all chaos edges start from same vertical line

  const chaos = [
    { x:62,  y:60,  m:"5,000+",  s:"INCIDENTS / QTR",     color:T.red,   icon:"alert",     d:0   },
    { x:44,  y:160, m:"2 WEEKS", s:"MANUAL BUILD TIME",   color:T.amber, icon:"clock",     d:90  },
    { x:74,  y:255, m:"ZERO",    s:"SOFTWARE VISIBILITY", color:T.cream, icon:"eye",       d:180 },
    { x:44,  y:350, m:"EMAIL",   s:"CHAINS / REQUEST",    color:T.muted, icon:"mail",      d:270 },
    { x:68,  y:440, m:"45 DAYS", s:"AVG INTAKE TIME",     color:T.amber, icon:"hourglass", d:360 },
  ];

  const insights = [
    { x:614, y:135, label:"No software home",    color:T.blue,  d:0   },
    { x:614, y:255, label:"Removal = confusion", color:T.gold,  d:220 },
    { x:614, y:375, label:"Intake unstructured", color:T.green, d:440 },
  ];

  return (
    <div className="scene" onClick={handle} style={{ cursor:"pointer" }}>
      {/* SEARCH — misty forest panel (left third of triptych) */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"url(/bg-cinematic-search.png)",
        backgroundSize:"cover", backgroundPosition:"center",
        backgroundRepeat:"no-repeat",
        opacity:.38,
      }}/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 70% at 38% 55%, transparent 30%, rgba(12,10,8,.88) 100%)",
      }}/>

      <div className="slide-shell slide-shell--wide">

        {/* Tight header */}
        {ph >= 1 && (
          <div style={{ marginBottom:10, animation:"rise .5s ease both" }}>
            <div className="gold-lbl" style={{ marginBottom:9 }}>SEARCH · DISCOVERY</div>
            <div className="serif" style={{
              fontSize:"clamp(18px,2.5vw,34px)", fontWeight:300, fontStyle:"italic",
              color:T.cream, lineHeight:1.15,
            }}>
              I find what's broken before anyone tells me to look.
            </div>
          </div>
        )}

        {/* ── KNOWLEDGE GRAPH SVG ── */}
        <svg viewBox="0 0 1060 490" width="100%" style={{ overflow:"visible", display:"block" }}>
          <defs>
            {/* Radial glow behind center */}
            <radialGradient id="srchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#C9A96E" stopOpacity=".25"/>
              <stop offset="60%"  stopColor="#C9A96E" stopOpacity=".06"/>
              <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
            </radialGradient>
            {/* Red glow for incidents */}
            <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#F87171" stopOpacity=".3"/>
              <stop offset="100%" stopColor="#F87171" stopOpacity="0"/>
            </radialGradient>
            <filter id="glo" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="gloSm" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="gloXs" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ─── Radar rings — atmosphere ─── */}
          {[90, 175, 265, 355, 445].map((r, i) => (
            <circle key={i} cx={CX} cy={CY} r={r} fill="none"
              stroke="rgba(201,169,110,.022)" strokeWidth={1}
              strokeDasharray={i % 2 === 0 ? "none" : `${r * 0.25} ${r * 0.12}`}/>
          ))}

          {/* ─── PHASE 2: Chaos signal nodes ─── */}
          {ph >= 2 && chaos.map((n, i) => {
            const isTop = n.m === "5,000+";
            return (
              <g key={i} style={{ animation:`fade .5s ease ${n.d}ms both` }}>
                {/* Icon glyph */}
                <g transform={`translate(${n.x}, ${n.y})`} opacity={isTop ? 1 : .75}>
                  <NodeIcon type={n.icon} color={n.color}/>
                </g>
                {/* Number — size varies by drama */}
                <text x={n.x + 18} y={n.y - (isTop ? 8 : 5)} textAnchor="start"
                  fontFamily="IBM Plex Mono"
                  fontSize={isTop ? 22 : 14}
                  fontWeight={isTop ? 700 : 400}
                  fill={n.color}
                  filter={isTop ? "url(#gloXs)" : undefined}>
                  {n.m}
                </text>
                {/* Sub-label */}
                <text x={n.x + 18} y={n.y + (isTop ? 14 : 10)} textAnchor="start"
                  fontFamily="IBM Plex Mono" fontSize={7}
                  letterSpacing={1}
                  fill="rgba(237,233,224,.28)">
                  {n.s}
                </text>
                {/* Dim connector dot at edge-start */}
                <circle cx={EDGE_START_X - 4} cy={n.y} r={2}
                  fill={n.color} opacity={.35}/>
              </g>
            );
          })}

          {/* ─── PHASE 3: Edges chaos→center + center node ─── */}
          {ph >= 3 && chaos.map((n, i) => (
            <path key={i}
              d={`M ${EDGE_START_X} ${n.y} C ${(EDGE_START_X + CX - CR) / 2 + 30} ${n.y} ${(EDGE_START_X + CX - CR) / 2 + 30} ${CY} ${CX - CR} ${CY}`}
              fill="none"
              stroke={`${n.color}28`}
              strokeWidth={n.m === "5,000+" ? 1.5 : 1}
              strokeDasharray={800} strokeDashoffset={800}
              style={{ animation:`drawPth 1.1s cubic-bezier(.4,0,.2,1) ${i * 80}ms forwards` }}
            />
          ))}

          {ph >= 3 && (
            <g style={{ animation:"fade .7s ease .2s both" }}>
              {/* Ambient glow halo */}
              <circle cx={CX} cy={CY} r={CR * 2.4} fill="url(#srchGlow)"
                style={{ animation:"pulseGlow 3.2s ease-in-out infinite" }}/>
              {/* Outer dashed ring */}
              <circle cx={CX} cy={CY} r={CR + 16} fill="none"
                stroke="rgba(201,169,110,.14)" strokeWidth={1}
                strokeDasharray="4 6"/>
              {/* Main circle */}
              <circle cx={CX} cy={CY} r={CR}
                fill="rgba(10,8,6,.97)" stroke={T.gold} strokeWidth={2}
                filter="url(#glo)"/>
              {/* Label */}
              <text x={CX} y={CY - 11} textAnchor="middle"
                fontFamily="Cormorant Garamond" fontWeight={700} fontSize={24} fill={T.gold}>
                60 DAYS
              </text>
              <text x={CX} y={CY + 8} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize={8} letterSpacing={2.5}
                fill="rgba(201,169,110,.55)">
                FIELD RESEARCH
              </text>
              <text x={CX} y={CY + 24} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={1}
                fill="rgba(201,169,110,.28)">
                5K INCIDENTS · 60 INTERVIEWS
              </text>
            </g>
          )}

          {/* ─── PHASE 4: Insight pill cards + edges ─── */}
          {ph >= 4 && insights.map((ins, i) => (
            <g key={i}>
              {/* Edge center → insight node */}
              <path
                d={`M ${CX + CR} ${CY} C ${CX + CR + 80} ${CY} ${ins.x - 60} ${ins.y} ${ins.x} ${ins.y}`}
                fill="none" stroke={`${ins.color}55`} strokeWidth={1.4}
                strokeDasharray={450} strokeDashoffset={450}
                style={{ animation:`drawPth .8s cubic-bezier(.4,0,.2,1) ${ins.d}ms forwards` }}
              />
              {/* Node dot */}
              <circle cx={ins.x} cy={ins.y} r={5}
                fill="rgba(10,8,6,.97)" stroke={ins.color} strokeWidth={1.8}
                filter="url(#gloXs)"
                style={{ animation:`fade .3s ease ${ins.d + 550}ms both` }}/>
              {/* Pill card */}
              <g style={{ animation:`fade .4s ease ${ins.d + 600}ms both` }}>
                <rect x={ins.x + 12} y={ins.y - 24} width={200} height={48} rx={6}
                  fill={`${ins.color}09`}
                  stroke={`${ins.color}35`} strokeWidth={1}/>
                {/* Colored left accent bar */}
                <rect x={ins.x + 12} y={ins.y - 24} width={3.5} height={48} rx={2}
                  fill={ins.color} filter="url(#gloSm)"/>
                {/* Label text */}
                <text x={ins.x + 26} y={ins.y + 8} textAnchor="start"
                  fontFamily="Cormorant Garamond" fontStyle="italic" fontSize={22}
                  fill={ins.color}>
                  {ins.label}
                </text>
              </g>
            </g>
          ))}

          {/* ─── PHASE 5: ONE PLATFORM outcome ─── */}
          {ph >= 5 && (
            <>
              {/* Edges insight pills → outcome */}
              {insights.map((ins, i) => (
                <path key={i}
                  d={`M ${ins.x + 212} ${ins.y} C 880 ${ins.y} 890 ${OY} ${OX - 66} ${OY}`}
                  fill="none" stroke="rgba(237,233,224,.1)" strokeWidth={1}
                  strokeDasharray={400} strokeDashoffset={400}
                  style={{ animation:`drawPth .7s ease ${i * 80}ms forwards` }}
                />
              ))}
              {/* Ambient glow */}
              <circle cx={OX} cy={OY} r={80} fill="rgba(237,233,224,.03)"
                style={{ animation:"fade .6s ease .3s both" }}/>
              {/* Outer ring */}
              <circle cx={OX} cy={OY} r={68} fill="none"
                stroke="rgba(237,233,224,.12)" strokeWidth={1}
                strokeDasharray="3 5"
                style={{ animation:"fade .5s ease .35s both" }}/>
              {/* Main circle */}
              <circle cx={OX} cy={OY} r={60}
                fill="rgba(10,8,6,.97)" stroke="rgba(237,233,224,.32)" strokeWidth={2}
                style={{ animation:"fade .5s ease .4s both" }}/>
              {/* Labels */}
              <text x={OX} y={OY - 18} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize={8} letterSpacing={2.5}
                fill="rgba(237,233,224,.38)"
                style={{ animation:"fade .4s ease .55s both" }}>
                ONE PLATFORM
              </text>
              <text x={OX} y={OY + 8} textAnchor="middle"
                fontFamily="Cormorant Garamond" fontWeight={700} fontSize={28} fill={T.gold}
                filter="url(#gloXs)"
                style={{ animation:"fade .5s ease .6s both" }}>
                $400M
              </text>
              <text x={OX} y={OY + 26} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={1.5}
                fill="rgba(237,233,224,.3)"
                style={{ animation:"fade .4s ease .7s both" }}>
                VP DEMO · CIO APPROVED
              </text>
            </>
          )}
        </svg>

        {/* Bottom nav */}
        <div style={{
          marginTop:2, display:"flex", alignItems:"center", gap:16,
          animation:"fade .5s ease both",
        }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right, ${T.gold}55, transparent)` }}/>
          <div className="lbl">{ph >= 5 ? "CLICK FOR NEXT →" : "CLICK TO CONTINUE →"}</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SCENE 2 — PROVE
// ══════════════════════════════════════════════════════════════════

function ProofConstellation({ phase }) {
  const paths = [
    { d:"M 94 114 C 176 88 252 103 326 168", color:T.gold, delay:0, live:phase >= 2 },
    { d:"M 94 246 C 182 246 246 230 326 206", color:T.blue, delay:120, live:phase >= 3 },
    { d:"M 94 378 C 178 414 260 340 326 246", color:T.green, delay:240, live:phase >= 4 },
    { d:"M 444 206 C 508 202 558 174 636 132", color:T.gold, delay:360, live:phase >= 2 },
    { d:"M 444 206 C 510 218 560 246 636 268", color:T.blue, delay:500, live:phase >= 3 },
    { d:"M 444 206 C 508 250 560 326 636 376", color:T.green, delay:640, live:phase >= 4 },
  ];
  const nodes = [
    { x:94,  y:114, label:"DEMO", sub:"VP live", color:T.gold, live:phase >= 2 },
    { x:94,  y:246, label:"n8n", sub:"AI PoC", color:T.blue, live:phase >= 3 },
    { x:94,  y:378, label:"AGENT", sub:"Win + Linux", color:T.green, live:phase >= 4 },
    { x:385, y:206, label:"PROOF", sub:"show first", color:T.cream, live:phase >= 1, hub:true },
    { x:636, y:132, label:"APPROVE", sub:"funded", color:T.gold, live:phase >= 2 },
    { x:636, y:268, label:"SHIP", sub:"<2 months", color:T.blue, live:phase >= 3 },
    { x:636, y:376, label:"SCALE", sub:"100K+", color:T.green, live:phase >= 4 },
  ];

  return (
    <svg viewBox="0 0 720 480" width="100%" style={{ display:"block", overflow:"visible", maxHeight:430 }}>
      <defs>
        <radialGradient id="proofHub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity=".26"/>
          <stop offset="65%" stopColor="#C9A96E" stopOpacity=".05"/>
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
        </radialGradient>
        <filter id="proofGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {[120, 205, 292].map((r, i) => (
        <ellipse key={r} cx="384" cy="232" rx={r} ry={r * .45}
          fill="none" stroke="rgba(237,233,224,.04)" strokeWidth="1"
          strokeDasharray={i === 1 ? "5 9" : "none"} />
      ))}

      {paths.map((p, i) => p.live && (
        <path key={i} d={p.d} fill="none" stroke={`${p.color}70`} strokeWidth="1.4"
          strokeDasharray="720" strokeDashoffset="720"
          style={{ animation:`drawPth .85s cubic-bezier(.22,1,.36,1) ${p.delay}ms forwards` }} />
      ))}

      {phase >= 1 && (
        <circle cx="385" cy="206" r="104" fill="url(#proofHub)"
          style={{ animation:"pulseGlow 3.5s ease-in-out infinite" }} />
      )}

      {nodes.map((n, i) => n.live && (
        <g key={i} style={{ animation:`nodeIn .45s ease ${n.hub ? 0 : i * 70}ms both` }}>
          <circle cx={n.x} cy={n.y} r={n.hub ? 54 : 34}
            fill={n.hub ? "rgba(10,8,6,.96)" : "rgba(10,8,6,.86)"}
            stroke={n.color} strokeWidth={n.hub ? 2 : 1.4}
            filter="url(#proofGlow)" />
          <circle cx={n.x} cy={n.y} r={n.hub ? 66 : 43}
            fill="none" stroke={`${n.color}28`} strokeWidth="1"
            strokeDasharray="4 7" />
          <text x={n.x} y={n.y - 3} textAnchor="middle"
            fontFamily="IBM Plex Mono" fontSize={n.hub ? 10 : 8}
            fontWeight="500" letterSpacing={n.hub ? 1.8 : .9} fill={n.color}>
            {n.label}
          </text>
          <text x={n.x} y={n.y + 15} textAnchor="middle"
            fontFamily="IBM Plex Mono" fontSize={n.hub ? 6.7 : 6.4}
            letterSpacing={.35} fill="rgba(237,233,224,.38)">
            {n.sub}
          </text>
        </g>
      ))}

      {phase >= 5 && (
        <g style={{ animation:"fade .5s ease both" }}>
          <rect x="244" y="430" width="280" height="34" rx="17"
            fill="rgba(52,211,153,.08)" stroke="rgba(52,211,153,.32)" />
          <text x="384" y="452" textAnchor="middle"
            fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="2"
            fill={T.green}>
            WORKING PROOF → EXECUTIVE TRUST
          </text>
        </g>
      )}
    </svg>
  );
}

function SceneProve({ onNext }) {
  const [phase, setPhase] = useState(1);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(2), 650),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2550),
      setTimeout(() => setPhase(5), 3500),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const handle = () => phase >= 5 ? onNext() : setPhase(p => Math.min(p + 1, 5));

  const artifacts = [
    {
      live: phase >= 2,
      tag: "01 · CATALOG",
      title: "Live VP demo, not a proposal",
      detail: "Built the complete end experience for the Software Catalog platform, demoed it live, earned development approval, and deployed with the team in under 2 months.",
      color: T.gold,
    },
    {
      live: phase >= 3,
      tag: "02 · AUTOMATION",
      title: "n8n + AI proved the next leap",
      detail: "Built an n8n demo using AI, RAG, and existing deployment data to show software intake could move from email handoffs to an automated workflow.",
      color: T.blue,
    },
    {
      live: phase >= 4,
      tag: "03 · AGENTS",
      title: "Silent removal at enterprise scale",
      detail: "Redesigned the Windows removal agent for scheduled, server-controlled removals across 100K+ endpoints, then built a Linux agent PoC now used in server and lab pilots.",
      color: T.green,
    },
  ];

  return (
    <div className="scene prove-scene" onClick={handle} style={{ cursor:"pointer" }}>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"url(/bg-cinematic-prove.png)",
        backgroundSize:"cover", backgroundPosition:"50% 50%",
        backgroundRepeat:"no-repeat",
        opacity:.68,
      }}/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(90deg, rgba(12,10,8,.86) 0%, rgba(12,10,8,.42) 45%, rgba(12,10,8,.82) 100%), radial-gradient(ellipse 72% 74% at 55% 48%, transparent 20%, rgba(12,10,8,.78) 100%)",
      }}/>

      <div className="slide-shell slide-shell--wide">

        <div className="prove-stage">
          <div>
            <div style={{ marginBottom:18, animation:"rise .65s ease both" }}>
              <div className="gold-lbl" style={{ marginBottom:18 }}>PROVE · WORKING EVIDENCE</div>
              <div className="serif" style={{
                fontSize:"clamp(28px,3.5vw,48px)",
                fontWeight:300, fontStyle:"italic",
                color:T.cream, lineHeight:1.08, letterSpacing:"0",
              }}>
                I don't ask for belief.<br />I put proof on the table.
              </div>
            </div>

            <div style={{ display:"grid", gap:10 }}>
              {artifacts.map((item, i) => (
                <div key={item.tag} className="proof-card" style={{
                  opacity:item.live ? 1 : .25,
                  transform:item.live ? "translateX(0)" : "translateX(-12px)",
                  transition:"opacity .35s ease, transform .35s ease",
                  borderColor:item.live ? `${item.color}45` : "rgba(237,233,224,.07)",
                }}>
                  <div className="lbl" style={{ color:item.color, marginBottom:8 }}>{item.tag}</div>
                  <div className="serif" style={{
                    fontSize:"clamp(17px,1.7vw,23px)", fontWeight:700,
                    color:T.cream, lineHeight:1.14, marginBottom:8,
                  }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize:"11.5px", color:T.muted, lineHeight:1.58, maxWidth:500 }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ animation:"fade .55s ease .1s both" }}>
            <ProofConstellation phase={phase} />
          </div>
        </div>

        {phase >= 5 && (
          <div className="proof-grid" style={{ marginTop:16, animation:"rise .5s ease both" }}>
            {[
              { val:"<2 mo", label:"Catalog approval to deployment", color:T.gold },
              { val:"45%", label:"n8n AI automation success in PoC", color:T.blue },
              { val:"100K+", label:"Endpoints controlled by removal agents", color:T.green },
            ].map((m) => (
              <div key={m.label} className="proof-metric">
                <div className="serif" style={{
                  fontSize:"clamp(28px,3.2vw,48px)", color:m.color,
                  fontWeight:700, lineHeight:1, letterSpacing:"0",
                }}>
                  {m.val}
                </div>
                <div className="lbl" style={{ marginTop:7 }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop:18, animation:"fade .6s ease .35s both",
          display:"flex", alignItems:"center", gap:16,
        }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right, ${T.gold}60, transparent)` }}/>
          <div className="lbl">{phase >= 5 ? "CLICK FOR NEXT →" : "CLICK TO REVEAL PROOF →"}</div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SCENE 3 — BUILD
// Whatever I'm given, I do it the best way I know how.
// ══════════════════════════════════════════════════════════════════
function WorkstreamSignal({ color }) {
  return (
    <svg viewBox="0 0 220 54" width="100%" height="54" style={{ display:"block", margin:"10px 0 6px" }}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          {i > 0 && (
            <path d={`M ${i * 50 - 11} 27 L ${i * 50 + 6} 27`}
              stroke="rgba(237,233,224,.18)" strokeWidth="1" />
          )}
          <rect x={i * 50 + 6} y="14" width="34" height="26" rx="5"
            fill={`${color}12`} stroke={`${color}70`} strokeWidth="1" />
          <circle cx={i * 50 + 23} cy="27" r={i === 3 ? 5 : 3}
            fill={i === 3 ? color : `${color}90`} />
        </g>
      ))}
      <path d="M 174 27 C 190 27 196 16 210 16" fill="none" stroke={`${color}80`} strokeWidth="1.2" />
      <path d="M 174 27 C 190 27 196 38 210 38" fill="none" stroke={`${color}55`} strokeWidth="1.2" />
    </svg>
  );
}

function BuildHubDiagram({ phase }) {
  const streams = [
    { y:66, label:"CATALOG", color:T.gold, live:phase >= 1 },
    { y:136, label:"DEPLOY", color:T.blue, live:phase >= 2 },
    { y:206, label:"REMOVE", color:T.green, live:phase >= 3 },
  ];
  return (
    <svg viewBox="0 0 560 270" width="100%" style={{ display:"block", overflow:"visible", maxHeight:200 }}>
      <defs>
        <filter id="buildGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {streams.map((s, i) => s.live && (
        <g key={s.label}>
          <path d={`M 84 ${s.y} C 180 ${s.y} 224 136 285 136`}
            fill="none" stroke={`${s.color}70`} strokeWidth="1.3"
            strokeDasharray="430" strokeDashoffset="430"
            style={{ animation:`drawPth .75s ease ${i * 130}ms forwards` }} />
          <circle cx="84" cy={s.y} r="32" fill="rgba(10,8,6,.88)" stroke={s.color} strokeWidth="1.5" filter="url(#buildGlow)" />
          <text x="84" y={s.y + 4} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8" letterSpacing="1" fill={s.color}>{s.label}</text>
        </g>
      ))}
      <g style={{ animation:"nodeIn .45s ease both" }}>
        <circle cx="302" cy="136" r="62" fill="rgba(10,8,6,.96)" stroke={T.cream} strokeWidth="1.5" filter="url(#buildGlow)" />
        <circle cx="302" cy="136" r="82" fill="none" stroke="rgba(201,169,110,.16)" strokeDasharray="4 7" />
        <text x="302" y="124" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="2" fill={T.gold}>CENTER</text>
        <text x="302" y="144" textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight="700" fontSize="22" fill={T.cream}>POC</text>
        <text x="302" y="160" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="6.5" letterSpacing=".8" fill="rgba(237,233,224,.36)">VP · ENG · SEC · OPS</text>
      </g>
      {phase >= 3 && (
        <g style={{ animation:"fade .5s ease .3s both" }}>
          <path d="M 370 136 C 430 136 454 112 504 94" fill="none" stroke="rgba(201,169,110,.55)" strokeWidth="1.2" />
          <path d="M 370 136 C 430 136 454 160 504 182" fill="none" stroke="rgba(52,211,153,.55)" strokeWidth="1.2" />
          <circle cx="510" cy="94" r="26" fill="rgba(10,8,6,.86)" stroke={T.gold} />
          <circle cx="510" cy="182" r="26" fill="rgba(10,8,6,.86)" stroke={T.green} />
          <text x="510" y="91" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="7" fill={T.gold}>VISION</text>
          <text x="510" y="101" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="5.5" fill="rgba(237,233,224,.38)">12K→1K</text>
          <text x="510" y="179" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="7" fill={T.green}>FIXED</text>
          <text x="510" y="189" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="5.5" fill="rgba(237,233,224,.38)">14s→3s</text>
        </g>
      )}
    </svg>
  );
}

function SceneBuild({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 400),
      setTimeout(() => setPh(2), 1200),
      setTimeout(() => setPh(3), 2100),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const workstreams = [
    {
      title:"Software Catalog",
      kicker:"employee experience",
      color:T.gold,
      body:"One landing place for employees, SAM, software owners, admins and approvers. Search, install, renew, approve and manage software from one product surface.",
      metrics:[
        ["5K→200", "incidents reduced"],
        ["4K", "quarterly approvals"],
        ["50K", "unique searches"],
        ["500+", "software owners"],
      ],
    },
    {
      title:"Deployment Automation",
      kicker:"intake to deployment",
      color:T.blue,
      body:"Rebuilt the intake path from email and disconnected forms into tracked workflow, then pushed automation with AI and n8n proof.",
      metrics:[
        ["45d→<1d", "cycle time"],
        ["70%", "apps automated"],
        ["5K+", "intake requests"],
        ["CAB", "change governance"],
      ],
    },
    {
      title:"Removal Agent",
      kicker:"risk action at scale",
      color:T.green,
      body:"Scheduled, server-controlled silent removals for Windows, expanded with Linux PoC for servers and labs, and governed through rings.",
      metrics:[
        ["200K+", "installs removed"],
        ["3K+", "distinct titles"],
        ["2w→<1d", "removal time"],
        ["95%", "efficiency"],
      ],
    },
  ];

  return (
    <div className="scene build-scene" onClick={onNext} style={{ cursor: "pointer" }}>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"url(/bg-cinematic-build.png)",
        backgroundSize:"cover", backgroundPosition:"center",
        backgroundRepeat:"no-repeat",
        opacity:.42,
      }}/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(90deg, rgba(12,10,8,.92), rgba(12,10,8,.66) 48%, rgba(12,10,8,.88)), radial-gradient(ellipse 65% 65% at 55% 50%, transparent 24%, rgba(12,10,8,.9) 100%)",
      }}/>

      <div className="slide-shell slide-shell--wide">

        <div style={{ marginBottom: 12, animation: "rise .65s ease both" }}>
          <div className="gold-lbl" style={{ marginBottom: 12 }}>BUILD</div>
          <div className="serif" style={{
            fontSize: "clamp(24px,3vw,42px)",
            fontWeight: 300, fontStyle: "italic",
            color: T.cream, lineHeight: 1.12, letterSpacing: "0",
          }}>
            Three workstreams.<br />One operating system for software.
          </div>
        </div>

        <div className="build-grid">
          {workstreams.map((w, i) => (
            <div key={w.title} className="build-card" style={{
              borderColor:`${w.color}38`,
              animation:`rise .55s ease ${i * 120}ms both`,
              opacity:ph >= i + 1 ? 1 : .42,
              transition:"opacity .35s ease",
            }}>
              <div className="build-card__num">0{i + 1}</div>
              <div className="lbl" style={{ color:w.color, marginBottom:10 }}>{w.kicker}</div>
              <div className="serif" style={{ fontSize:"clamp(20px,2vw,28px)", fontWeight:700, color:T.cream, lineHeight:1.08 }}>
                {w.title}
              </div>
              <WorkstreamSignal color={w.color} />
              <p style={{ fontSize:"10.8px", color:T.muted, lineHeight:1.48, minHeight:58 }}>
                {w.body}
              </p>
              <div className="build-metric-list">
                {w.metrics.map(([val, label]) => (
                  <div key={label} className="build-metric">
                    <div className="serif" style={{ fontSize:"clamp(20px,2vw,30px)", lineHeight:1, color:w.color, fontWeight:700 }}>{val}</div>
                    <div className="lbl" style={{ marginTop:5, fontSize:7.5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="build-hub" style={{ animation:"rise .55s ease .35s both" }}>
          <div>
            <div className="lbl" style={{ color:T.gold, marginBottom:7 }}>MY USP · END TO END OWNERSHIP</div>
            <div className="serif" style={{ fontSize:"clamp(19px,2.1vw,28px)", lineHeight:1.12, color:T.cream, fontWeight:700 }}>
              Single point of contact across VP, senior consultants, engineering, validation, security, managers and development.
            </div>
            <p style={{ fontSize:"11px", color:T.muted, lineHeight:1.5, marginTop:8 }}>
              I drove prioritization, vision, issue fixes, approvals and delivery rhythm, including the search latency fix from 14 seconds to 3 seconds.
            </p>
          </div>
          <BuildHubDiagram phase={ph} />
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SCENE 4 — DASHBOARD (dark, consistent)
// Applied to your context.
// ══════════════════════════════════════════════════════════════════
const SUPPLIERS = [
  { name:"Supplier Alpha",   country:"Taiwan",   tier:"T1", cat:"Semiconductors", score:87, status:"high",   signal:"Credit downgraded Q1 2026",         action:"Schedule exec review",          trend:"↑" },
  { name:"Supplier Beta",    country:"Malaysia", tier:"T2", cat:"PCB Assembly",   score:52, status:"medium", signal:"Delivery SLA declining 3 months",   action:"Monitor monthly — flag if <90%", trend:"↓" },
  { name:"Supplier Gamma",   country:"China",    tier:"T1", cat:"Display Panels", score:91, status:"high",   signal:"Single source — no alternate",      action:"Qualify alternate by Q3",        trend:"↑" },
  { name:"Supplier Delta",   country:"Mexico",   tier:"T1", cat:"Logistics",      score:21, status:"low",    signal:"All SLAs met — no adverse signals", action:"Routine quarterly review",       trend:"→" },
  { name:"Supplier Epsilon", country:"India",    tier:"T2", cat:"Cable Assembly", score:44, status:"medium", signal:"RBA audit overdue 6 weeks",         action:"Confirm audit date this week",   trend:"→" },
];
const SC = {
  high:   { bg:"rgba(248,113,113,.1)",  color:"#F87171", border:"rgba(248,113,113,.28)" },
  medium: { bg:"rgba(252,211,77,.1)",   color:"#FCD34D", border:"rgba(252,211,77,.28)"  },
  low:    { bg:"rgba(52,211,153,.1)",   color:"#34D399", border:"rgba(52,211,153,.28)"  },
};

function SceneDashboard() {
  const [active, setActive] = useState(null);
  return (
    <div className="scene"
      style={{ cursor:"default", overflowY:"auto", alignItems:"flex-start", justifyContent:"flex-start" }}>

      <div className="slide-shell slide-shell--dashboard">

        {/* Header */}
        <div style={{ marginBottom: 8, animation: "rise .65s ease both" }}>
          <div className="gold-lbl" style={{ marginBottom: 20 }}>FOR THIS ROLE</div>
          <div className="serif" style={{
            fontSize: "clamp(24px,3.2vw,46px)",
            fontWeight: 300, fontStyle: "italic",
            color: T.cream, lineHeight: 1.2, letterSpacing: "-0.015em",
          }}>
            I applied how I work<br />
            <span style={{ color: T.gold }}>to your context.</span>
          </div>
        </div>

        <p style={{
          fontSize: "13px", fontWeight: 300, color: T.muted, lineHeight: 1.75,
          marginBottom: 26, maxWidth: 640, animation: "fade .6s ease .15s both",
        }}>
          Built for this interview — to demonstrate how I think, not describe it.
          The real one starts with SCA's data and the analysts who act on it.
        </p>

        {/* Summary cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10,
          marginBottom: 14, animation: "rise .6s ease .2s both",
        }}>
          {[
            { val:"2", label:"High Risk",   note:"↑ 1 vs last week", color:T.red   },
            { val:"2", label:"Medium Risk", note:"unchanged",         color:T.amber },
            { val:"1", label:"Low Risk",    note:"↓ 1 resolved",      color:T.green },
            { val:"3", label:"Actions Due", note:"this week",         color:T.blue  },
          ].map((s,i) => (
            <div key={i} style={{
              background: T.bgSft, borderRadius: 8,
              border: `1px solid ${T.line}`, borderTop: `2px solid ${s.color}`,
              padding: "14px 16px", textAlign: "center",
            }}>
              <div className="serif" style={{
                fontSize: "34px", fontWeight: 700,
                color: s.color, lineHeight: 1, letterSpacing: "-0.04em",
              }}>{s.val}</div>
              <div style={{ fontSize:"11px", fontWeight:500, color:T.cream, marginTop:5 }}>{s.label}</div>
              <div className="mono" style={{ fontSize:"8px", color:T.muted, marginTop:3 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: "rgba(237,233,224,.02)",
          border: `1px solid ${T.line}`, borderRadius: 10, overflow: "hidden",
          marginBottom: 12, animation: "rise .6s ease .26s both",
        }}>
          {/* Header row */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 80px 2fr 2.5fr 96px",
            gap: 12, padding: "9px 20px",
            background: "rgba(237,233,224,.04)", borderBottom: `1px solid ${T.line}`,
          }}>
            {["SUPPLIER","TIER","RISK","SIGNAL","ACTION","STATUS"].map((h,i) => (
              <div key={i} className="lbl">{h}</div>
            ))}
          </div>

          {/* Supplier rows */}
          {SUPPLIERS.map((s,i) => (
            <div key={i}>
              <div
                className="d-row"
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 80px 2fr 2.5fr 96px",
                  gap: 12, padding: "11px 20px",
                  background: active === i ? "rgba(201,169,110,.08)" : "transparent",
                  borderBottom: i < SUPPLIERS.length - 1 ? `1px solid ${T.ghost}` : "none",
                }}>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:600, color:T.cream }}>{s.name}</div>
                  <div className="mono" style={{ fontSize:"9px", color:T.muted, marginTop:2 }}>
                    {s.country} · {s.cat}
                  </div>
                </div>
                <div className="mono" style={{ fontSize:"11px", color:T.muted, paddingTop:2 }}>{s.tier}</div>
                <div>
                  <div style={{ height:2, background:T.ghost, borderRadius:2, marginBottom:5, width:52 }}>
                    <div style={{ width:`${s.score}%`, height:"100%", background:SC[s.status].color, borderRadius:2 }} />
                  </div>
                  <span className="mono" style={{ fontSize:"11px", color:SC[s.status].color, fontWeight:500 }}>
                    {s.score} {s.trend}
                  </span>
                </div>
                <div style={{ fontSize:"12px", color:T.faint, lineHeight:1.5 }}>{s.signal}</div>
                <div style={{ fontSize:"12px", color:T.muted, fontStyle:"italic", lineHeight:1.5 }}>{s.action}</div>
                <span style={{
                  display:"inline-flex", alignItems:"center", gap:4,
                  fontSize:"10px", fontWeight:600, padding:"3px 10px", borderRadius:20,
                  background:SC[s.status].bg, color:SC[s.status].color,
                  border:`1px solid ${SC[s.status].border}`, alignSelf:"center", whiteSpace:"nowrap",
                }}>
                  <span style={{ width:4, height:4, borderRadius:"50%", background:SC[s.status].color, display:"inline-block" }} />
                  {s.status}
                </span>
              </div>

              {/* Expanded row */}
              {active === i && (
                <div style={{
                  background: "rgba(201,169,110,.05)",
                  padding: "12px 20px 14px",
                  borderBottom: `1px solid ${T.ghost}`,
                  animation: "fade .2s ease both",
                  display: "grid", gridTemplateColumns: "1fr 1fr 72px",
                  gap: 20, alignItems: "center",
                }}>
                  <div>
                    <div className="lbl" style={{ marginBottom: 5 }}>RISK SIGNAL</div>
                    <div style={{ fontSize:"13px", color:SC[s.status].color, fontWeight:500, lineHeight:1.4 }}>
                      {s.signal}
                    </div>
                  </div>
                  <div>
                    <div className="lbl" style={{ marginBottom: 5 }}>RECOMMENDED ACTION</div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:T.cream, lineHeight:1.4 }}>
                      {s.action}
                    </div>
                  </div>
                  <Gauge value={s.score} color={SC[s.status].color} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Closing cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
          animation: "rise .6s ease .36s both",
        }}>
          <div style={{
            background: "rgba(52,211,153,.05)", borderRadius: 8, padding: "16px 20px",
            border: "1px solid rgba(52,211,153,.14)", borderLeft: "3px solid #34D399",
          }}>
            <div className="gold-lbl" style={{ color:T.green, marginBottom:10 }}>THE PRINCIPLE</div>
            <p style={{ fontSize:"12px", fontWeight:300, color:T.muted, lineHeight:1.8 }}>
              Leading indicators, not news articles. Structured signals, not noise.
              Built for the analyst who acts — not the engineer who builds.
            </p>
          </div>
          <div style={{
            background: T.goldA, borderRadius: 8, padding: "16px 20px",
            border: `1px solid rgba(201,169,110,.16)`, borderLeft: `3px solid ${T.gold}`,
          }}>
            <div className="gold-lbl" style={{ marginBottom:10 }}>THE COMMITMENT</div>
            <p style={{ fontSize:"12px", fontWeight:300, color:T.muted, lineHeight:1.8 }}>
              Search. Prove. Build. I applied it here.
              The real one starts with your data and the people who use it every day.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════
const SCENE_LABELS = ["OPEN", "SEARCH", "PROVE", "BUILD", "BOARD"];
const SCENES = [SceneOpen, SceneSearch, SceneProve, SceneBuild, SceneDashboard];

export default function App() {
  const [scene, setScene] = useState(0);
  const [cutting, setCutting] = useState(false);
  const Scene = SCENES[scene];

  const cut = fn => {
    setCutting(true);
    setTimeout(() => fn(), 220);
    setTimeout(() => setCutting(false), 240);
  };
  const next = () => cut(() => setScene(s => Math.min(s + 1, SCENES.length - 1)));
  const prev = () => cut(() => setScene(s => Math.max(s - 1, 0)));
  const jump = target => {
    if (target !== scene) cut(() => setScene(target));
  };

  useEffect(() => {
    const h = e => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft")                   { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []); // eslint-disable-line

  const chrome = "rgba(237,233,224,.22)";

  return (
    <>
      <style>{CSS}</style>

      {/* Flash cut between scenes */}
      {cutting && (
        <div style={{ position:"fixed", inset:0, zIndex:999, background:T.bg, pointerEvents:"none" }} />
      )}

      <SlideProgress scene={scene} labels={SCENE_LABELS} onJump={jump} />

      {/* Back button */}
      {scene > 1 && scene < SCENES.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          style={{
            position:"fixed", bottom:28, left:40, zIndex:500, cursor:"pointer",
            background:"transparent", border:"1px solid rgba(237,233,224,.14)",
            color:chrome, padding:"6px 14px", borderRadius:4,
            fontFamily:"'IBM Plex Mono',monospace", fontSize:"9px",
            letterSpacing:".16em", textTransform:"uppercase", transition:"all .2s ease",
          }}>
          ← BACK
        </button>
      )}

      <div key={scene} style={{ position:"fixed", inset:0, zIndex:2, animation:"fade .35s ease" }}>
        <Scene onNext={next} />
      </div>
    </>
  );
}
