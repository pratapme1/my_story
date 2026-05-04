import { useState, useEffect, useRef } from "react";

// ── COLOR TOKENS ──────────────────────────────────────────────────
const T = {
  void:  "#060C15",
  cream: "#EDE9E1",
  stone: "rgba(237,233,225,.42)",
  fog:   "rgba(237,233,225,.14)",
  edge:  "rgba(201,169,110,.22)",
  gold:  "#C9A96E",
  goldLt:"#F0D49A",
  navy:  "#0B1827",
  offW:  "#F7F4EF",
  muted: "#94A3B8",
  line:  "#E2E8F0",
  slate: "#475569",
  red:   "#DC2626",
  green: "#047857",
  blue:  "#1D4ED8",
  amber: "#B45309",
};

// ── GLOBAL CSS ────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
body{background:#060C15;font-family:'DM Sans',sans-serif;color:#EDE9E1;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}

@keyframes rise     {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade     {from{opacity:0}to{opacity:1}}
@keyframes extend   {from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes growX    {from{width:0}to{width:100%}}
@keyframes drawPath {to{stroke-dashoffset:0}}
@keyframes drift1   {0%,100%{transform:translate(0,0)}50%{transform:translate(4%,6%)}}
@keyframes drift2   {0%,100%{transform:translate(0,0)}50%{transform:translate(-5%,-4%)}}
@keyframes drift3   {0%,100%{transform:translate(0,0)}40%{transform:translate(3%,-5%)}80%{transform:translate(-3%,3%)}}
@keyframes shimmer  {0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes pulse    {0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
@keyframes countUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink    {0%,100%{opacity:1}50%{opacity:0}}

.scene{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}

/* Radial vignette */
.vig::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 85% 85% at 50% 50%,transparent 35%,rgba(6,12,21,.7) 100%);pointer-events:none;z-index:1}

/* Gold shimmer */
.shimmer{background:linear-gradient(90deg,#C9A96E 20%,#F0D49A 50%,#C9A96E 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear 1.5s infinite}

/* Left editorial gold rail */
.rail::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,transparent 5%,#C9A96E 25%,#C9A96E 75%,transparent 95%);pointer-events:none;z-index:10}

/* Ruled lines */
.ruled{background-image:repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(237,233,225,.035) 48px);position:absolute;inset:0;pointer-events:none}

.lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.2em;text-transform:uppercase}
.mono{font-family:'IBM Plex Mono',monospace}
.serif{font-family:'Cormorant Garamond',Georgia,serif}

/* Code block */
.code-block{
  background:#020509;
  border:1px solid rgba(237,233,225,.07);
  border-radius:5px;
  padding:14px 16px;
  font-family:'IBM Plex Mono',monospace;
  font-size:10px;
  line-height:1.85;
  color:rgba(237,233,225,.38);
}
.code-comment{color:#C9A96E;font-weight:500}
.code-highlight{color:#EDE9E1;font-weight:500}

/* Table row hover */
.srow{transition:background .12s;border-radius:6px;cursor:pointer}
.srow:hover{background:#F1F5F9}

/* Bridge row hover */
.bridge-row:hover td{background:rgba(201,169,110,.06)!important}
`;

// ── ATMOSPHERE ─────────────────────────────────────────────────
function Atmosphere({ blue = true, gold = true, teal = false }) {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:0, pointerEvents:"none" }}>
      {blue && <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"55vw", height:"55vw", background:"radial-gradient(circle, rgba(29,78,216,.08) 0%, transparent 65%)", animation:"drift1 28s ease-in-out infinite" }} />}
      {gold && <div style={{ position:"absolute", bottom:"-10%", right:"-8%",  width:"45vw", height:"45vw", background:"radial-gradient(circle, rgba(201,169,110,.07) 0%, transparent 65%)", animation:"drift2 35s ease-in-out infinite" }} />}
      {teal && <div style={{ position:"absolute", top:"40%", left:"30%",       width:"35vw", height:"35vw", background:"radial-gradient(circle, rgba(4,120,87,.05) 0%, transparent 65%)",   animation:"drift3 22s ease-in-out infinite" }} />}
    </div>
  );
}

// ── DOT GRID ───────────────────────────────────────────────────
function DotGrid({ opacity = 0.05 }) {
  return (
    <div style={{
      position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
      backgroundImage:`radial-gradient(circle, rgba(237,233,225,${opacity}) 1px, transparent 1px)`,
      backgroundSize:"28px 28px",
    }} />
  );
}

// ── COUNTER ────────────────────────────────────────────────────
function Counter({ target, duration = 1800, color, size, prefix = "", suffix = "" }) {
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
  const fmt = n => {
    if (target >= 1e8) return prefix + "$" + (n / 1e6).toFixed(0) + "M" + suffix;
    if (target >= 1e6) return prefix + "$" + (n / 1e6).toFixed(0) + "M" + suffix;
    if (target >= 1e3) return prefix + n.toLocaleString() + suffix;
    return prefix + String(n) + suffix;
  };
  return (
    <span className="serif" style={{ fontSize:size||"clamp(44px,7vw,96px)", fontWeight:300, color:color||T.cream, letterSpacing:"-0.04em", lineHeight:1, animation:"countUp .5s ease both" }}>
      {fmt(v)}
    </span>
  );
}

// ── GAUGE ──────────────────────────────────────────────────────
function Gauge({ value, color }) {
  const r = 28, c = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} stroke={`${color}22`} strokeWidth="6" fill="none" />
      <circle cx="36" cy="36" r={r} stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={c} strokeDashoffset={c*(1-value/100)}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition:"stroke-dashoffset .8s ease" }} />
      <text x="36" y="40" textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight="600" fontSize="16" fill={color}>{value}</text>
    </svg>
  );
}

// ── FLOW DIAGRAM ───────────────────────────────────────────────
function FlowDiagram({ visible }) {
  if (!visible) return null;
  const ps = (dashLen, delay, stroke) => ({
    stroke, fill:"none", strokeWidth:1.5,
    strokeDasharray:dashLen, strokeDashoffset:dashLen,
    animation:`drawPath .75s ease ${delay}ms forwards`,
  });
  return (
    <div style={{ width:"100%", marginTop:28, animation:"fade .5s ease both" }}>
      <svg viewBox="0 0 520 120" width="100%" height="72" preserveAspectRatio="xMidYMid meet">
        <path d="M 0 18 C 100 18 160 60 220 60" style={ps(260,0,  "#1D4ED8")} />
        <path d="M 0 60 L 220 60"               style={ps(220,150,T.gold)} />
        <path d="M 0 102 C 100 102 160 60 220 60" style={ps(260,300,"#047857")} />
        <text x="4" y="14"  fontFamily="IBM Plex Mono" fontSize="7.5" fill="rgba(29,78,216,.75)">Software Catalog</text>
        <text x="4" y="56"  fontFamily="IBM Plex Mono" fontSize="7.5" fill="rgba(201,169,110,.75)">Compliance Agent</text>
        <text x="4" y="98"  fontFamily="IBM Plex Mono" fontSize="7.5" fill="rgba(4,120,87,.75)">Deployment Engine</text>
        <circle cx="220" cy="60" r="4" fill="#EDE9E1" style={{ animation:"fade .4s ease 480ms both" }} />
        <path d="M 220 60 L 390 60" style={ps(170,540,"#EDE9E1")} />
        <g style={{ animation:"fade .6s ease 780ms both" }}>
          <text x="402" y="50" fontFamily="Cormorant Garamond" fontSize="28" fontWeight="600" fill={T.gold}>$400M</text>
          <text x="402" y="66" fontFamily="IBM Plex Mono" fontSize="7.5" fill="rgba(237,233,225,.38)">projected savings</text>
          <text x="402" y="79" fontFamily="IBM Plex Mono" fontSize="7.5" fill="rgba(237,233,225,.38)">CIO initiative</text>
        </g>
        <line x1="0" y1="60" x2="520" y2="60" stroke="rgba(237,233,225,.03)" strokeWidth="1" />
        <line x1="220" y1="0" x2="220" y2="120" stroke="rgba(237,233,225,.03)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 0 — SIGNAL
// Opens from HER domain — supply chain risk — not Vishnu's history
// ══════════════════════════════════════════════════════════════
function SceneSignal({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 400),
      setTimeout(() => setPh(2), 1300),
      setTimeout(() => setPh(3), 2400),
      setTimeout(() => setPh(4), 3600),
      setTimeout(() => setPh(5), 5000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene rail" style={{ background:T.void, cursor:ph>=5?"pointer":"default" }} onClick={ph>=5?onNext:undefined}>
      <Atmosphere blue gold />
      <DotGrid opacity={0.04} />
      <div className="ruled" />

      <div style={{ position:"relative", zIndex:2, maxWidth:820, padding:"0 80px", width:"100%" }}>

        {/* Gold separator line */}
        <div style={{
          height:1, background:`linear-gradient(to right, ${T.gold}, transparent)`,
          marginBottom:48,
          width: ph>=1 ? "100%" : "0%",
          transition:"width 1.1s cubic-bezier(.22,1,.36,1)",
          opacity: ph>=1 ? 1 : 0,
        }} />

        {/* Three lines */}
        <div style={{ display:"flex", flexDirection:"column", gap:18, marginBottom:56 }}>
          {[
            { text:"Suppliers don't fail overnight.", weight:300, color:T.cream,    italic:false, phase:2 },
            { text:"The signals were always there.", weight:300, color:T.stone,     italic:true,  phase:3 },
            { text:"You needed someone reading them.", weight:600, color:T.gold,     italic:false, phase:4 },
          ].map((l,i) => (
            <div key={i} className="serif" style={{
              fontSize:"clamp(28px,4vw,58px)",
              fontWeight:l.weight,
              fontStyle:l.italic?"italic":"normal",
              color:l.color,
              lineHeight:1.18,
              letterSpacing:"-0.025em",
              opacity:ph>=l.phase?1:0,
              transform:ph>=l.phase?"none":"translateY(20px)",
              transition:"opacity .65s ease, transform .65s ease",
            }}>
              {l.text}
            </div>
          ))}
        </div>

        {/* Bottom separator */}
        <div style={{
          height:1, background:`linear-gradient(to right, rgba(201,169,110,.3), transparent)`,
          marginBottom:32,
          width: ph>=1 ? "100%" : "0%",
          transition:"width 1.1s cubic-bezier(.22,1,.36,1) .4s",
        }} />

        {/* Name + prompt */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", opacity:ph>=5?1:0, transition:"opacity .6s ease" }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:".22em", color:T.gold, marginBottom:8 }}>
              VISHNU PRATAP KUMAR
            </div>
            <div className="lbl" style={{ color:T.stone }}>DELL TECHNOLOGIES · SCA TPM · MAY 2026</div>
          </div>
          <div className="lbl" style={{ color:T.gold, animation:"blink 2s ease infinite" }}>CLICK TO ENTER →</div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 1 — THE PARALLEL
// Same structural problem. Different domain. I've solved it.
// ══════════════════════════════════════════════════════════════
function SceneParallel({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 200),
      setTimeout(() => setPh(2), 800),
      setTimeout(() => setPh(3), 1600),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene rail" style={{ background:T.void, cursor:"pointer" }} onClick={onNext}>
      <Atmosphere blue={false} gold />
      <DotGrid opacity={0.04} />
      <div className="ruled" />

      <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:1040, padding:"0 80px" }}>

        <div style={{ marginBottom:36, animation:"rise .8s ease both" }}>
          <div className="lbl" style={{ color:T.gold, marginBottom:16 }}>THE STRUCTURAL PROBLEM</div>
          <div className="serif" style={{ fontSize:"clamp(26px,3.4vw,50px)", fontWeight:300, color:T.cream, lineHeight:1.2, letterSpacing:"-0.02em" }}>
            I've solved this problem before.{" "}
            <span style={{ color:T.gold, fontStyle:"italic" }}>In a different domain.</span>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1px 1fr", gap:"0 48px", opacity:ph>=2?1:0, transition:"opacity .6s ease" }}>

          {/* Left — Dell past */}
          <div>
            <div className="lbl" style={{ color:T.stone, marginBottom:20 }}>THREE YEARS AGO · DELL ITAM</div>
            <div style={{ display:"flex", flexDirection:"column", gap:18, marginBottom:24 }}>
              {[
                { num:"100,000", txt:"employees. No single source of truth." },
                { num:"12,000",  txt:"software titles. Zero risk visibility." },
                { num:"$0",      txt:"in structured compliance reporting." },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", gap:20, alignItems:"baseline" }}>
                  <div className="serif" style={{ fontSize:"clamp(24px,2.8vw,40px)", fontWeight:300, color:T.cream, letterSpacing:"-0.03em", lineHeight:1, minWidth:90, flexShrink:0 }}>{r.num}</div>
                  <div style={{ fontSize:"13px", fontWeight:300, color:T.stone, lineHeight:1.5 }}>{r.txt}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:"14px 20px", borderLeft:`3px solid ${T.gold}`, background:"rgba(201,169,110,.06)", borderRadius:"0 6px 6px 0" }}>
              <div className="serif" style={{ fontSize:"clamp(15px,1.7vw,20px)", fontStyle:"italic", color:T.cream, lineHeight:1.55 }}>
                "Data existed. Nobody trusted it enough to act on it."
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ background:"rgba(201,169,110,.18)" }} />

          {/* Right — SCA today */}
          <div>
            <div className="lbl" style={{ color:T.gold, marginBottom:20 }}>TODAY · DELL SCA</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
              {[
                "Supplier inventory — fragmented, siloed, untrusted by leadership.",
                "Risk signals buried across teams, systems, and news feeds.",
                "Reporting is reactive, narrative-driven, too slow to prevent.",
              ].map((txt,i) => (
                <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold, marginTop:9, flexShrink:0 }} />
                  <div style={{ fontSize:"13px", fontWeight:300, color:T.stone, lineHeight:1.65 }}>{txt}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:"14px 20px", borderLeft:`3px solid ${T.gold}`, background:"rgba(201,169,110,.06)", borderRadius:"0 6px 6px 0" }}>
              <div className="serif" style={{ fontSize:"clamp(15px,1.7vw,20px)", color:T.gold, fontWeight:600, lineHeight:1.55 }}>
                "Same problem. Same fix. Different domain."
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="lbl" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", color:T.fog, zIndex:10 }}>CLICK TO CONTINUE →</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 2 — THE METHOD
// Evidence for each requirement: get hands dirty, clean messy data,
// lead without authority
// ══════════════════════════════════════════════════════════════
const METHODS = [
  {
    tag: "GET HANDS DIRTY",
    title: "I build before I pitch.",
    color: "#60A5FA",
    code: [
      { t:"comment", v:"// Enterprise AI deployment PoC — built in a weekend" },
      { t:"code",    v:"n8n + LLM classifier → deployment rules" },
      { t:"code",    v:"automation success: 45%" },
      { t:"gap",     v:"" },
      { t:"comment", v:"// Result: executive approval → enterprise rollout" },
    ],
    result: "Never needed a budget to prove a hypothesis. I prototype, validate, then ask for resources.",
  },
  {
    tag: "CLEAN MESSY DATA",
    title: "I find problems in the data.",
    color: T.gold,
    code: [
      { t:"comment", v:"-- SQL: search_logs, 60-day window" },
      { t:"code",    v:"SELECT search_query, AVG(response_ms)" },
      { t:"code",    v:"ORDER BY avg_ms DESC LIMIT 10;" },
      { t:"gap",     v:"" },
      { t:"highlight", v:"-- avg_ms: 14,320  ← found it here" },
    ],
    result: "14,320ms → 3,100ms. Nobody had checked. I pulled the data. Fixed in 3 weeks. 78% improvement.",
  },
  {
    tag: "WORK WITH TOP LEADERS",
    title: "I hold the room under pressure.",
    color: "#34D399",
    code: [
      { t:"comment", v:"// 100K-user CIO launch · pre-launch URL failure" },
      { t:"code",    v:"T+00:15  VP briefed. Status + next action." },
      { t:"code",    v:"T+00:30  Root cause isolated." },
      { t:"highlight", v:"T+02:00  Resolved. On-time launch." },
      { t:"comment", v:"// Cadence: every 15 min. Zero surprises." },
    ],
    result: "CIO platform launched on schedule. Four years, zero escalations above VP level.",
  },
];

function SceneMethod({ onNext }) {
  return (
    <div className="scene rail" style={{ background:T.void, cursor:"pointer" }} onClick={onNext}>
      <Atmosphere blue gold teal />
      <DotGrid opacity={0.04} />
      <div className="ruled" />

      <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:1060, padding:"0 80px" }}>
        <div style={{ marginBottom:36, animation:"rise .8s ease both" }}>
          <div className="lbl" style={{ color:T.gold, marginBottom:16 }}>THE METHOD</div>
          <div className="serif" style={{ fontSize:"clamp(24px,3.2vw,46px)", fontWeight:300, color:T.cream, lineHeight:1.2, letterSpacing:"-0.02em" }}>
            How I actually operate.
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18 }}>
          {METHODS.map((m,i) => (
            <div key={i} style={{
              borderTop:`2px solid ${m.color}`,
              paddingTop:20,
              animation:`rise .65s ease ${.1+i*.14}s both`,
            }}>
              <div className="lbl" style={{ color:m.color, marginBottom:14 }}>{m.tag}</div>
              <div className="serif" style={{ fontSize:"clamp(16px,1.8vw,23px)", fontWeight:600, color:T.cream, lineHeight:1.25, marginBottom:18, letterSpacing:"-0.01em" }}>
                {m.title}
              </div>

              {/* Code block */}
              <div className="code-block" style={{ marginBottom:16 }}>
                {m.code.map((line,j) => (
                  <div key={j} style={{
                    color: line.t==="comment"  ? T.gold :
                           line.t==="highlight" ? T.cream :
                           line.t==="gap"       ? undefined : "rgba(237,233,225,.38)",
                    fontWeight: (line.t==="comment"||line.t==="highlight") ? 500 : 300,
                    minHeight: line.t==="gap" ? "0.5em" : undefined,
                  }}>
                    {line.v || " "}
                  </div>
                ))}
              </div>

              <div style={{ fontSize:"12px", fontWeight:300, color:T.stone, lineHeight:1.7 }}>
                {m.result}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lbl" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", color:T.fog, zIndex:10 }}>CLICK TO CONTINUE →</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 3 — THE PROGRAM
// Three workstreams. No team. $400M CIO initiative.
// ══════════════════════════════════════════════════════════════
const STREAMS = [
  {
    num:"01", name:"Software Catalog", color:T.blue,
    desc:"AI-powered discovery across 365K assets using open-source LLM with RAG. Any Dell employee finds, understands, and requests software in seconds.",
    meta:["RAG · LLM","365K assets","20K MAU"],
  },
  {
    num:"02", name:"Compliance Agent", color:T.gold,
    desc:"Silent removal of 100K+ unlicensed installs across 98,000 global endpoints. First of its kind at Dell — no precedent, no existing team, built from zero.",
    meta:["98K endpoints","100K+ removals","95%+ efficiency"],
  },
  {
    num:"03", name:"Deployment Engine", color:T.green,
    desc:"Camunda-orchestrated workflow automation. Built n8n + LLM PoC to validate before enterprise spend. Cut 30–45 day deployment cycles to 2 weeks.",
    meta:["30–45d → 2 weeks","70% faster","5K+ requests"],
  },
];

function SceneProgram({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 200),
      setTimeout(() => setPh(2), 2400),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene rail" style={{ background:T.void, cursor:"pointer" }} onClick={onNext}>
      <Atmosphere blue gold teal />
      <DotGrid opacity={0.04} />
      <div className="ruled" />

      <div style={{ position:"relative", zIndex:2, maxWidth:1020, padding:"0 80px", width:"100%" }}>
        <div style={{ marginBottom:40, animation:"rise .8s ease both" }}>
          <div className="lbl" style={{ color:T.gold, marginBottom:16 }}>THE PROGRAM</div>
          <div className="serif" style={{ fontSize:"clamp(24px,3.2vw,48px)", fontWeight:300, color:T.cream, lineHeight:1.2, letterSpacing:"-0.02em" }}>
            I didn't pitch three projects.{" "}
            <span style={{ color:T.gold, fontStyle:"italic" }}>I built one program.</span>
          </div>
          <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:32, height:1, background:T.gold, opacity:.5 }} />
            <div className="lbl" style={{ color:T.stone }}>NO TEAM · FIRST OF ITS KIND · ZERO ESCALATIONS</div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
          {STREAMS.map((s,i) => (
            <div key={i} style={{ borderTop:`2px solid ${s.color}`, paddingTop:22, animation:`rise .7s ease ${.1+i*.13}s both` }}>
              <div className="lbl" style={{ color:s.color, marginBottom:12 }}>{s.num}</div>
              <div className="serif" style={{ fontSize:"clamp(17px,2vw,25px)", fontWeight:600, color:T.cream, lineHeight:1.2, marginBottom:12 }}>
                {s.name}
              </div>
              <div style={{ fontSize:"12px", fontWeight:300, color:T.stone, lineHeight:1.85, marginBottom:16 }}>{s.desc}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {s.meta.map((m,j) => (
                  <span key={j} className="mono" style={{ fontSize:"8px", color:s.color, opacity:.8, padding:"3px 8px", border:`1px solid ${s.color}28`, borderRadius:3 }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <FlowDiagram visible={ph>=2} />
      </div>

      <div className="lbl" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", color:T.fog, zIndex:10 }}>CLICK TO CONTINUE →</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 4 — THE BRIDGE
// Explicit domain mapping: ITAM → Supply Chain Risk
// Addresses the gap directly and confidently
// ══════════════════════════════════════════════════════════════
const BRIDGE_ROWS = [
  { left:"100K-user software catalog & self-service insights",   right:"Supplier inventory, profiles & risk data products" },
  { left:"License compliance monitoring (98K endpoints)",        right:"Contract, SLA & regulatory compliance monitoring" },
  { left:"Endpoint risk signals — silent, data-driven alerts",  right:"Supplier risk signals — Tier-N, leading indicators" },
  { left:"AI compliance agent (n8n + LLM, 45% automation)",     right:"AI-assisted risk triage and workflow automation" },
  { left:"Cross-functional governance across 4 teams",          right:"Cross-functional governance across SCA workstreams" },
  { left:"Executive dashboard → CIO-level program narrative",   right:"Executive risk briefings → SCA leadership decisions" },
];

function SceneBridge({ onNext }) {
  return (
    <div className="scene rail" style={{ background:T.void, cursor:"pointer" }} onClick={onNext}>
      <Atmosphere blue={false} gold />
      <DotGrid opacity={0.04} />
      <div className="ruled" />

      <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:1020, padding:"0 80px" }}>
        <div style={{ marginBottom:32, animation:"rise .75s ease both" }}>
          <div className="lbl" style={{ color:T.gold, marginBottom:16 }}>THE BRIDGE</div>
          <div className="serif" style={{ fontSize:"clamp(22px,2.9vw,44px)", fontWeight:300, color:T.cream, lineHeight:1.2, letterSpacing:"-0.02em" }}>
            ITAM and supply chain risk are the same problem.{" "}
            <span style={{ color:T.gold, fontStyle:"italic" }}>Different domain. Identical structure.</span>
          </div>
        </div>

        {/* Mapping table */}
        <div style={{ animation:"rise .7s ease .15s both", background:"rgba(6,12,21,.6)", border:"1px solid rgba(237,233,225,.07)", borderRadius:8, overflow:"hidden", marginBottom:20 }}>
          {/* Header */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 44px 1fr", background:"rgba(201,169,110,.07)", borderBottom:"1px solid rgba(201,169,110,.14)", padding:"10px 20px" }}>
            <div className="lbl" style={{ color:T.stone }}>WHAT I'VE DONE AT DELL</div>
            <div />
            <div className="lbl" style={{ color:T.gold }}>MAPS TO SCA</div>
          </div>

          {/* Rows */}
          {BRIDGE_ROWS.map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 44px 1fr", borderBottom:i<BRIDGE_ROWS.length-1?"1px solid rgba(237,233,225,.04)":"none" }}>
              <div style={{ padding:"11px 20px", fontSize:"12px", fontWeight:300, color:T.stone, lineHeight:1.55 }}>{r.left}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(201,169,110,.06)" }}>
                <div style={{ color:T.gold, fontSize:"13px", fontWeight:300 }}>→</div>
              </div>
              <div style={{ padding:"11px 20px", fontSize:"12px", fontWeight:500, color:T.cream, lineHeight:1.55 }}>{r.right}</div>
            </div>
          ))}
        </div>

        {/* Closing quote */}
        <div style={{ animation:"rise .7s ease .3s both", padding:"14px 24px", borderLeft:`3px solid ${T.gold}`, background:"rgba(201,169,110,.06)", borderRadius:"0 8px 8px 0" }}>
          <div className="serif" style={{ fontSize:"clamp(15px,1.7vw,21px)", fontStyle:"italic", color:T.cream, lineHeight:1.55 }}>
            "The domain is new. The capability is not. I've been doing supply chain risk management — for software, at enterprise scale, inside Dell."
          </div>
        </div>
      </div>

      <div className="lbl" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", color:T.fog, zIndex:10 }}>CLICK TO CONTINUE →</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 5 — THE PROTOTYPE (supplier risk dashboard)
// ══════════════════════════════════════════════════════════════
const SUPPLIERS = [
  { name:"Supplier Alpha",   country:"Taiwan",   tier:"T1", cat:"Semiconductors", score:87, status:"high",   signal:"Credit downgraded Q1 2026",         action:"Schedule exec review",           trend:"↑" },
  { name:"Supplier Beta",    country:"Malaysia", tier:"T2", cat:"PCB Assembly",   score:52, status:"medium", signal:"Delivery SLA declining 3 months",   action:"Monitor monthly — flag if <90%",  trend:"↓" },
  { name:"Supplier Gamma",   country:"China",    tier:"T1", cat:"Display Panels", score:91, status:"high",   signal:"Single source — no alternate",      action:"Qualify alternate by Q3",         trend:"↑" },
  { name:"Supplier Delta",   country:"Mexico",   tier:"T1", cat:"Logistics",      score:21, status:"low",    signal:"All SLAs met — no adverse signals", action:"Routine quarterly review",        trend:"→" },
  { name:"Supplier Epsilon", country:"India",    tier:"T2", cat:"Cable Assembly", score:44, status:"medium", signal:"RBA audit overdue 6 weeks",         action:"Confirm audit date this week",    trend:"→" },
];
// Dark-mode status tokens
const SC = {
  high:   { bg:"rgba(220,38,38,.1)",  color:"#F87171", border:"rgba(220,38,38,.28)" },
  medium: { bg:"rgba(217,119,6,.1)",  color:"#FCD34D", border:"rgba(217,119,6,.28)" },
  low:    { bg:"rgba(4,120,87,.1)",   color:"#34D399", border:"rgba(4,120,87,.28)"  },
};

function SceneVision() {
  const [active, setActive] = useState(null);

  return (
    <div className="scene rail" style={{ background:T.void, overflowY:"auto", alignItems:"flex-start", justifyContent:"flex-start" }}>
      <Atmosphere blue gold teal />
      <DotGrid opacity={0.04} />
      <div className="ruled" />

      <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:1060, padding:"48px 80px 72px" }}>

        {/* Header */}
        <div style={{ marginBottom:8, animation:"rise .7s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div className="lbl" style={{ color:"#34D399" }}>ILLUSTRATIVE · DUMMY DATA</div>
            <div style={{ width:1, height:12, background:"rgba(237,233,225,.15)" }} />
            <div className="lbl" style={{ color:T.stone }}>PROACTIVE RISK MONITORING</div>
          </div>
          <div className="serif" style={{ fontSize:"clamp(22px,3vw,44px)", fontWeight:600, lineHeight:1.15, color:T.cream, letterSpacing:"-0.02em" }}>
            Here is how I think{" "}
            <span style={{ fontStyle:"italic", color:T.gold }}>about your challenge.</span>
          </div>
        </div>

        <p style={{ fontSize:"13px", fontWeight:300, color:T.stone, lineHeight:1.7, marginBottom:28, animation:"fade .6s ease .15s both" }}>
          Built in an afternoon — to demonstrate how I think, not just describe it.
          The real version starts with SCA's data and the analysts who use it every day.
        </p>

        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16, animation:"rise .6s ease .2s both" }}>
          {[
            { val:"2", label:"High Risk",   note:"↑ 1 vs last week", color:"#F87171" },
            { val:"2", label:"Medium Risk", note:"unchanged",         color:"#FCD34D" },
            { val:"1", label:"Low Risk",    note:"↓ 1 resolved",      color:"#34D399" },
            { val:"3", label:"Actions Due", note:"this week",         color:"#60A5FA" },
          ].map((s,i) => (
            <div key={i} style={{ background:"rgba(237,233,225,.04)", border:`1px solid rgba(237,233,225,.08)`, borderTop:`2px solid ${s.color}`, borderRadius:8, padding:"14px 16px", textAlign:"center" }}>
              <div className="serif" style={{ fontSize:"36px", fontWeight:600, color:s.color, lineHeight:1, letterSpacing:"-0.03em" }}>{s.val}</div>
              <div style={{ fontSize:"11px", fontWeight:500, color:T.cream, marginTop:5 }}>{s.label}</div>
              <div className="mono" style={{ fontSize:"8px", color:T.stone, marginTop:3 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:"rgba(237,233,225,.02)", border:"1px solid rgba(237,233,225,.08)", borderRadius:10, overflow:"hidden", marginBottom:14, animation:"rise .6s ease .28s both" }}>
          {/* Header */}
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 84px 2fr 2.5fr 96px", gap:12, padding:"9px 20px", background:"rgba(237,233,225,.05)", borderBottom:"1px solid rgba(237,233,225,.07)" }}>
            {["SUPPLIER","TIER","RISK","SIGNAL","ACTION","STATUS"].map((h,i) => (
              <div key={i} className="lbl" style={{ color:T.stone }}>{h}</div>
            ))}
          </div>

          {SUPPLIERS.map((s,i) => (
            <div key={i}>
              {/* Row */}
              <div
                onClick={() => setActive(active===i?null:i)}
                style={{
                  display:"grid", gridTemplateColumns:"2fr 1fr 84px 2fr 2.5fr 96px",
                  gap:12, padding:"11px 20px", cursor:"pointer",
                  background: active===i ? "rgba(201,169,110,.08)" : "transparent",
                  borderBottom: i<SUPPLIERS.length-1 ? "1px solid rgba(237,233,225,.05)" : "none",
                  transition:"background .15s ease",
                }}>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:600, color:T.cream }}>{s.name}</div>
                  <div className="mono" style={{ fontSize:"9px", color:T.stone, marginTop:2 }}>{s.country} · {s.cat}</div>
                </div>
                <div className="mono" style={{ fontSize:"11px", color:T.stone, paddingTop:2 }}>{s.tier}</div>
                <div>
                  <div style={{ height:2, background:"rgba(237,233,225,.1)", borderRadius:2, marginBottom:5, width:52 }}>
                    <div style={{ width:`${s.score}%`, height:"100%", background:SC[s.status].color, borderRadius:2, transition:"width .6s ease" }} />
                  </div>
                  <span className="mono" style={{ fontSize:"11px", color:SC[s.status].color, fontWeight:600 }}>{s.score} {s.trend}</span>
                </div>
                <div style={{ fontSize:"12px", color:"rgba(237,233,225,.55)", lineHeight:1.45 }}>{s.signal}</div>
                <div style={{ fontSize:"12px", color:T.stone, fontStyle:"italic", lineHeight:1.45 }}>{s.action}</div>
                <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:"10px", fontWeight:600, padding:"3px 10px", borderRadius:20, background:SC[s.status].bg, color:SC[s.status].color, border:`1px solid ${SC[s.status].border}`, alignSelf:"center", whiteSpace:"nowrap" }}>
                  <span style={{ width:4, height:4, borderRadius:"50%", background:SC[s.status].color, display:"inline-block", flexShrink:0 }} />
                  {s.status}
                </span>
              </div>

              {/* Expanded */}
              {active===i && (
                <div style={{ background:"rgba(201,169,110,.06)", padding:"12px 20px 14px", borderBottom:"1px solid rgba(237,233,225,.06)", animation:"fade .2s ease both", display:"grid", gridTemplateColumns:"1fr 1fr 72px", gap:20, alignItems:"center" }}>
                  <div>
                    <div className="lbl" style={{ color:T.stone, marginBottom:5 }}>RISK SIGNAL</div>
                    <div style={{ fontSize:"13px", color:SC[s.status].color, fontWeight:500, lineHeight:1.4 }}>{s.signal}</div>
                  </div>
                  <div>
                    <div className="lbl" style={{ color:T.stone, marginBottom:5 }}>RECOMMENDED ACTION</div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:T.cream, lineHeight:1.4 }}>{s.action}</div>
                  </div>
                  <Gauge value={s.score} color={SC[s.status].color} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Principles */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, animation:"rise .6s ease .38s both" }}>
          <div style={{ background:"rgba(52,211,153,.05)", border:"1px solid rgba(52,211,153,.15)", borderRadius:8, padding:"16px 20px", borderLeft:"3px solid #34D399" }}>
            <div className="lbl" style={{ color:"#34D399", marginBottom:10 }}>THE PRINCIPLE</div>
            <p style={{ fontSize:"12px", fontWeight:300, color:T.stone, lineHeight:1.75 }}>Leading indicators, not news articles. Structured signals, not internet noise. Built for the analyst who acts — not the engineer who builds.</p>
          </div>
          <div style={{ background:"rgba(201,169,110,.05)", border:"1px solid rgba(201,169,110,.15)", borderRadius:8, padding:"16px 20px", borderLeft:`3px solid ${T.gold}` }}>
            <div className="lbl" style={{ color:T.gold, marginBottom:10 }}>THE COMMITMENT</div>
            <p style={{ fontSize:"12px", fontWeight:300, color:T.stone, lineHeight:1.75 }}>I don't describe what I'd build. I build a version of it. This took an afternoon. The real one starts with SCA's data and the people who use it every day.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
const SCENES = [SceneSignal, SceneParallel, SceneMethod, SceneProgram, SceneBridge, SceneVision];

export default function App() {
  const [scene, setScene] = useState(0);
  const [cutting, setCutting] = useState(false);
  const Scene = SCENES[scene];

  const cut = fn => {
    setCutting(true);
    setTimeout(() => fn(), 240);
    setTimeout(() => setCutting(false), 260);
  };
  const next = () => cut(() => setScene(s => Math.min(s+1, SCENES.length-1)));
  const prev = () => cut(() => setScene(s => Math.max(s-1, 0)));

  useEffect(() => {
    const h = e => {
      if (e.key==="ArrowRight"||e.key===" ") { e.preventDefault(); next(); }
      if (e.key==="ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []); // eslint-disable-line

  const chrome = "rgba(237,233,225,.2)";

  return (
    <>
      <style>{CSS}</style>

      {cutting && <div style={{ position:"fixed", inset:0, zIndex:999, background:T.void, pointerEvents:"none" }} />}

      {scene>0 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, height:1, background:"rgba(237,233,225,.06)", zIndex:500 }}>
          <div style={{ height:"100%", background:T.gold, width:`${(scene/(SCENES.length-1))*100}%`, transition:"width .55s cubic-bezier(.22,1,.36,1)" }} />
        </div>
      )}

      {scene>0 && (
        <div className="lbl" style={{ position:"fixed", top:18, right:40, color:chrome, zIndex:500, transition:"color .3s ease" }}>
          {String(scene).padStart(2,"0")} / {String(SCENES.length-1).padStart(2,"0")}
        </div>
      )}

      {scene>1 && scene<SCENES.length-1 && (
        <button onClick={prev} style={{
          position:"fixed", bottom:28, right:40, zIndex:500, cursor:"pointer",
          background:"transparent",
          border:"1px solid rgba(237,233,225,.14)",
          color:chrome, padding:"6px 14px", borderRadius:4,
          fontFamily:"'DM Sans',sans-serif", fontSize:"9px", fontWeight:500,
          letterSpacing:".18em", textTransform:"uppercase", transition:"all .2s ease",
        }}>← BACK</button>
      )}

      <div key={scene} style={{ position:"fixed", inset:0, animation:"fade .45s ease" }}>
        <Scene onNext={next} />
      </div>
    </>
  );
}
