import { useState, useEffect, useRef } from "react";

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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
body{background:#060C15;font-family:'Inter',sans-serif;color:#EDE9E1;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}

@keyframes rise     {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade     {from{opacity:0}to{opacity:1}}
@keyframes extend   {from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes drawPath {to{stroke-dashoffset:0}}
@keyframes drift1   {0%,100%{transform:translate(0,0)}50%{transform:translate(4%,6%)}}
@keyframes drift2   {0%,100%{transform:translate(0,0)}50%{transform:translate(-5%,-4%)}}
@keyframes drift3   {0%,100%{transform:translate(0,0)}40%{transform:translate(3%,-5%)}80%{transform:translate(-3%,3%)}}
@keyframes shimmer  {0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes pulse    {0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
@keyframes countUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

.scene{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}

/* Radial vignette */
.vig::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 85% 85% at 50% 50%,transparent 35%,rgba(6,12,21,.7) 100%);pointer-events:none;z-index:1}

/* Left editorial gold rule */
.rule::before{content:'';position:absolute;left:48px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,rgba(201,169,110,.25) 25%,rgba(201,169,110,.25) 75%,transparent);pointer-events:none}

/* Gold shimmer — for $3M */
.shimmer{background:linear-gradient(90deg,#C9A96E 20%,#F0D49A 50%,#C9A96E 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear 1.5s infinite}

.lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:.22em;text-transform:uppercase}
.mono{font-family:'JetBrains Mono',monospace}
.serif{font-family:'Cormorant Garamond',Georgia,serif}

.srow{transition:background .12s;border-radius:6px;cursor:pointer}
.srow:hover{background:#F1F5F9}
`;

// ── ATMOSPHERE — drifting gradient orbs on dark scenes ────────
function Atmosphere({ blue = true, gold = true, teal = false }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {blue && (
        <div style={{
          position: "absolute", top: "-15%", left: "-10%",
          width: "55vw", height: "55vw",
          background: "radial-gradient(circle, rgba(29,78,216,.08) 0%, transparent 65%)",
          animation: "drift1 28s ease-in-out infinite",
        }} />
      )}
      {gold && (
        <div style={{
          position: "absolute", bottom: "-10%", right: "-8%",
          width: "45vw", height: "45vw",
          background: "radial-gradient(circle, rgba(201,169,110,.07) 0%, transparent 65%)",
          animation: "drift2 35s ease-in-out infinite",
        }} />
      )}
      {teal && (
        <div style={{
          position: "absolute", top: "40%", left: "30%",
          width: "35vw", height: "35vw",
          background: "radial-gradient(circle, rgba(4,120,87,.05) 0%, transparent 65%)",
          animation: "drift3 22s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}

// ── DOT GRID — subtle texture on dark scenes ──────────────────
function DotGrid({ opacity = 0.055 }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `radial-gradient(circle, rgba(237,233,225,${opacity}) 1px, transparent 1px)`,
      backgroundSize: "28px 28px",
    }} />
  );
}

// ── DATA BAR — animated horizontal progress line ───────────────
function Bar({ pct, color, delay = 0, thick = 1 }) {
  return (
    <div style={{ position: "relative", height: thick, background: "rgba(237,233,225,.08)", width: "100%", marginTop: 16, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        width: `${pct}%`, background: color,
        transformOrigin: "left", animation: `extend .9s cubic-bezier(.22,1,.36,1) ${delay}ms both`,
      }} />
    </div>
  );
}

// ── COUNTER ───────────────────────────────────────────────────
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
    if (target >= 1e6) return prefix + "$" + (n / 1e6).toFixed(0) + "M" + suffix;
    if (target >= 1e3) return prefix + n.toLocaleString() + suffix;
    return prefix + String(n) + suffix;
  };
  return (
    <span className="serif" style={{ fontSize: size || "clamp(44px,7vw,96px)", fontWeight: 300, color: color || T.cream, letterSpacing: "-0.04em", lineHeight: 1, animation: "countUp .5s ease both" }}>
      {fmt(v)}
    </span>
  );
}

// ── GAUGE ─────────────────────────────────────────────────────
function Gauge({ value, color }) {
  const r = 28, c = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} stroke={`${color}22`} strokeWidth="6" fill="none" />
      <circle cx="36" cy="36" r={r} stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset .8s ease" }} />
      <text x="36" y="40" textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight="600" fontSize="16" fill={color}>{value}</text>
    </svg>
  );
}

// ── FLOW DIAGRAM — three streams merging into one result ───────
function FlowDiagram({ visible }) {
  if (!visible) return null;
  const pathStyle = (dashLen, delay, stroke) => ({
    stroke, fill: "none", strokeWidth: 1.5,
    strokeDasharray: dashLen, strokeDashoffset: dashLen,
    animation: `drawPath .75s ease ${delay}ms forwards`,
  });
  return (
    <div style={{ width: "100%", marginTop: 32, animation: "fade .5s ease both" }}>
      <svg viewBox="0 0 520 120" width="100%" height="80" preserveAspectRatio="xMidYMid meet">
        {/* Three input lines converging to center */}
        <path d="M 0 18 C 100 18 160 60 220 60" style={pathStyle(260, 0,   "#1D4ED8")} />
        <path d="M 0 60 L 220 60"               style={pathStyle(220, 150, "#C9A96E")} />
        <path d="M 0 102 C 100 102 160 60 220 60" style={pathStyle(260, 300, "#047857")} />

        {/* Node labels */}
        <text x="4" y="14"  fontFamily="JetBrains Mono" fontSize="8" fill="rgba(29,78,216,.8)">Software Catalog</text>
        <text x="4" y="56"  fontFamily="JetBrains Mono" fontSize="8" fill="rgba(201,169,110,.8)">Compliance Agent</text>
        <text x="4" y="98" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(4,120,87,.8)">Deployment Engine</text>

        {/* Convergence node */}
        <circle cx="220" cy="60" r="4" fill="#EDE9E1" style={{ animation: "fade .4s ease 480ms both" }} />

        {/* Output line */}
        <path d="M 220 60 L 380 60" style={pathStyle(160, 540, "#EDE9E1")} />

        {/* Result */}
        <g style={{ animation: "fade .6s ease 780ms both" }}>
          <text x="390" y="52" fontFamily="Cormorant Garamond" fontSize="26" fontWeight="600" fill="#C9A96E">$3M</text>
          <text x="390" y="68" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(237,233,225,.4)">proven savings</text>
          <text x="390" y="80" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(237,233,225,.4)">100K+ users</text>
        </g>

        {/* Subtle grid lines behind paths */}
        <line x1="0" y1="60" x2="520" y2="60" stroke="rgba(237,233,225,.04)" strokeWidth="1" />
        <line x1="220" y1="0" x2="220" y2="120" stroke="rgba(237,233,225,.04)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 0 — ENTRY
// ══════════════════════════════════════════════════════════════
function SceneEntry({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),
      setTimeout(() => setPh(2), 1600),
      setTimeout(() => setPh(3), 2900),
      setTimeout(() => setPh(4), 4500),
      setTimeout(() => setPh(5), 5800),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene vig rule" style={{ background: T.void, cursor: ph >= 5 ? "pointer" : "default" }} onClick={ph >= 5 ? onNext : undefined}>
      <Atmosphere blue gold />
      <DotGrid />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 880, padding: "0 96px", width: "100%" }}>
        {ph >= 1 && (
          <div className="serif" style={{ fontSize: "clamp(36px,5.8vw,88px)", fontWeight: 300, color: T.cream, lineHeight: 1.18, letterSpacing: "-0.025em", marginBottom: 6, animation: "rise .95s cubic-bezier(.16,1,.3,1) both" }}>
            100,000 people.
          </div>
        )}
        {ph >= 2 && (
          <div className="serif" style={{ fontSize: "clamp(36px,5.8vw,88px)", fontWeight: 300, color: T.cream, lineHeight: 1.18, letterSpacing: "-0.025em", marginBottom: 6, animation: "rise .95s cubic-bezier(.16,1,.3,1) both" }}>
            Twelve thousand software titles.
          </div>
        )}
        {ph >= 3 && (
          <div className="serif" style={{ fontSize: "clamp(36px,5.8vw,88px)", fontWeight: 600, color: T.gold, lineHeight: 1.18, letterSpacing: "-0.025em", fontStyle: "italic", animation: "rise .95s cubic-bezier(.16,1,.3,1) both" }}>
            No one knew what was installed.
          </div>
        )}
        {ph >= 4 && (
          <div style={{ marginTop: 60, animation: "rise .85s ease both" }}>
            <div style={{ width: 32, height: 1, background: T.gold, opacity: .5, marginBottom: 24 }} />
            <div className="serif" style={{ fontSize: "clamp(17px,2.3vw,28px)", fontWeight: 300, color: T.stone, lineHeight: 1.65, fontStyle: "italic" }}>
              — I was asked to change that.
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 36, left: 96, right: 96, zIndex: 2, display: "flex", justifyContent: "space-between" }}>
        <span className="lbl" style={{ color: T.fog }}>Vishnu Pratap Kumar · Dell SCA · 2026</span>
        {ph >= 5 && <span className="lbl" style={{ color: T.fog, animation: "fade 1.2s ease both" }}>click or → to begin</span>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 1 — THE QUESTION
// ══════════════════════════════════════════════════════════════
const HOPS = [
  { text: "You submit a request.",                              indent: false, gold: false },
  { text: 'IT Helpdesk  —  "Check with procurement."',         indent: true,  gold: false },
  { text: 'Procurement  —  "Needs manager sign-off."',         indent: true,  gold: false },
  { text: 'Manager  —  "Talk to the vendor directly."',        indent: true,  gold: false },
  { text: 'Vendor  —  "Not in our contract."',                 indent: true,  gold: false },
  { text: "Back to you. Start over.",                           indent: false, gold: true  },
];

function SceneQuestion({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const base = 1500;
    const ts = [
      setTimeout(() => setPh(1), 200),
      setTimeout(() => setPh(2), base),
      setTimeout(() => setPh(3), base + HOPS.length * 200 + 600),
      setTimeout(() => setPh(4), base + HOPS.length * 200 + 2000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene vig rule" style={{ background: T.void, cursor: ph >= 4 ? "pointer" : "default" }} onClick={ph >= 4 ? onNext : undefined}>
      <Atmosphere blue={false} gold />
      <DotGrid opacity={0.04} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 880, padding: "0 96px", width: "100%" }}>
        {ph >= 1 && (
          <div style={{ marginBottom: 52 }}>
            <div className="lbl" style={{ color: T.gold, marginBottom: 18, animation: "fade .7s ease both" }}>
              The question that drove three weeks of discovery
            </div>
            <div className="serif" style={{
              fontSize: "clamp(52px,9vw,130px)", fontWeight: 600,
              color: T.cream, lineHeight: 1.05, letterSpacing: "-0.025em", fontStyle: "italic",
              animation: "rise .95s cubic-bezier(.16,1,.3,1) .08s both",
            }}>
              "Who owns this?"
            </div>
          </div>
        )}

        {ph >= 2 && (
          <div style={{ marginBottom: 44 }}>
            {HOPS.map((h, i) => (
              <div key={i} className="mono" style={{
                fontSize: "11px", lineHeight: "2.4",
                color: h.gold ? T.gold : h.indent ? T.stone : T.cream,
                paddingLeft: h.indent || h.gold ? 20 : 0,
                borderLeft: h.gold ? `2px solid ${T.gold}` : h.indent ? `1px solid ${T.fog}` : "none",
                animation: `rise .45s ease ${i * 185}ms both`,
              }}>{h.text}</div>
            ))}
          </div>
        )}

        {ph >= 3 && (
          <div className="serif" style={{
            fontSize: "clamp(28px,4.5vw,62px)", fontWeight: 300,
            color: T.cream, lineHeight: 1.2, letterSpacing: "-0.02em",
            animation: "rise .85s ease both",
          }}>
            Four to five people.{" "}
            <span style={{ color: T.stone }}>Every single time.</span>
          </div>
        )}
      </div>

      {ph >= 4 && (
        <div style={{ position: "absolute", bottom: 36, right: 96, zIndex: 2 }}>
          <span className="lbl" style={{ color: T.fog, animation: "fade .8s ease both" }}>click to continue →</span>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 2 — THE GAPS (with animated data bars)
// Resume: $3M savings · 365K assets · 98K endpoints
// ══════════════════════════════════════════════════════════════
const GAPS = [
  {
    num: "365,000", lbl: "Software Assets", pct: 88, barColor: "#60A5FA",
    desc: "No searchable catalog. Every request meant a phone call and days of waiting.",
    sub: "→ built workstream 01 — AI-powered catalog with RAG/LLM", gold: false,
  },
  {
    num: "$3M", lbl: "Proven Savings", pct: 100, barColor: T.gold,
    desc: "Delivered by the Software Management Platform. 100K+ users. $3M in measurable ITAM savings.",
    sub: "→ the mandate — a CIO-level initiative", gold: true,
  },
  {
    num: "98,000", lbl: "Global Endpoints", pct: 60, barColor: "#34D399",
    desc: "No compliance automation. No visibility into what was licensed or who was using what.",
    sub: "→ built workstream 02 — silent compliance agent", gold: false,
  },
];

function SceneGaps({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 200),
      setTimeout(() => setPh(2), 1100),
      setTimeout(() => setPh(3), 2000),
      setTimeout(() => setPh(4), 3200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene vig rule" style={{ background: T.void, cursor: ph >= 4 ? "pointer" : "default" }} onClick={ph >= 4 ? onNext : undefined}>
      <Atmosphere blue gold teal />
      <DotGrid />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 960, padding: "0 96px", width: "100%" }}>
        {GAPS.map((g, i) => ph >= i + 1 && (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 36, marginBottom: 20, animation: "rise .85s cubic-bezier(.16,1,.3,1) both" }}>
            {/* Number */}
            <div style={{ minWidth: "36%", textAlign: "right", flexShrink: 0 }}>
              <div className={`serif${g.gold ? " shimmer" : ""}`} style={{
                fontSize: "clamp(44px,7vw,108px)", fontWeight: 300,
                color: g.gold ? undefined : T.cream,
                letterSpacing: "-0.04em", lineHeight: 1,
              }}>{g.num}</div>
              {/* Animated bar */}
              <div style={{ position: "relative", height: 1, background: "rgba(237,233,225,.08)", marginTop: 10, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${g.pct}%`, background: g.barColor, transformOrigin: "right", animation: `extend .9s cubic-bezier(.22,1,.36,1) .3s both` }} />
              </div>
            </div>

            {/* Label + desc */}
            <div style={{ borderLeft: `1px solid ${g.gold ? T.gold + "44" : T.fog}`, paddingLeft: 28, paddingTop: 6 }}>
              <div className="lbl" style={{ color: g.gold ? T.gold : "rgba(237,233,225,.28)", marginBottom: 8 }}>{g.lbl}</div>
              <div style={{ fontSize: "clamp(12px,1.4vw,15px)", fontWeight: 300, color: T.stone, lineHeight: 1.7, marginBottom: 8 }}>{g.desc}</div>
              <div className="mono" style={{ fontSize: "9px", color: g.gold ? T.gold : T.fog, opacity: .7 }}>{g.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {ph >= 4 && (
        <div style={{ position: "absolute", bottom: 36, right: 96, zIndex: 2 }}>
          <span className="lbl" style={{ color: T.fog, animation: "fade .8s ease both" }}>click to continue →</span>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 3 — WHAT I BUILT (with SVG flow diagram)
// Resume: 365K assets · 98K endpoints · 30-45d → 2wks
// ══════════════════════════════════════════════════════════════
const STREAMS = [
  {
    num: "01", name: "Software Catalog", color: T.blue,
    desc: "AI-powered discovery across 365K assets using open-source LLM with RAG. Any Dell employee could find, understand, and request software in seconds.",
    meta: ["RAG · LLM", "365K assets", "20K MAU"],
  },
  {
    num: "02", name: "Compliance Agent", color: T.gold,
    desc: "Silent removal of 100K+ unlicensed installs across 98,000 global endpoints. First of its kind at Dell — no precedent, no existing team. Built from zero.",
    meta: ["98K+ endpoints", "100K+ removals", "95%+ efficiency"],
  },
  {
    num: "03", name: "Deployment Engine", color: T.green,
    desc: "Camunda-orchestrated workflow automation. n8n + LLM proof-of-concept validated the hypothesis before enterprise rollout. Cut 30-45 day cycles to 2 weeks.",
    meta: ["30-45d → 2 weeks", "70% faster", "5K+ requests"],
  },
];

function SceneBuild({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 200),
      setTimeout(() => setPh(2), 2600),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene rule" style={{ background: T.void, cursor: "pointer" }} onClick={onNext}>
      <Atmosphere blue gold teal />
      <DotGrid opacity={0.04} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1020, padding: "0 96px", width: "100%" }}>
        <div style={{ marginBottom: 44, animation: "rise .85s ease both" }}>
          <div className="lbl" style={{ color: T.gold, marginBottom: 16 }}>Three workstreams. One program.</div>
          <div className="serif" style={{ fontSize: "clamp(26px,3.8vw,52px)", fontWeight: 300, color: T.cream, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            I connected what nobody else had.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {STREAMS.map((s, i) => (
            <div key={i} style={{ borderTop: `2px solid ${s.color}`, paddingTop: 22, animation: `rise .75s ease ${.1 + i * .13}s both` }}>
              <div className="lbl" style={{ color: s.color, marginBottom: 12 }}>{s.num}</div>
              <div className="serif" style={{ fontSize: "clamp(18px,2.2vw,26px)", fontWeight: 600, color: T.cream, lineHeight: 1.2, marginBottom: 12 }}>
                {s.name}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 300, color: T.stone, lineHeight: 1.85, marginBottom: 16 }}>{s.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {s.meta.map((m, j) => (
                  <span key={j} className="mono" style={{ fontSize: "8px", color: s.color, opacity: .8, padding: "3px 8px", border: `1px solid ${s.color}28`, borderRadius: 3 }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SVG convergence diagram */}
        <FlowDiagram visible={ph >= 2} />
      </div>

      <div style={{ position: "absolute", bottom: 36, right: 96, zIndex: 2 }}>
        <span className="lbl" style={{ color: T.fog }}>click to continue →</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 4 — THE PROOF (with animated data bars + counter)
// Resume: 100K+ · 78% perf · $3M savings · 70% cycle time
// ══════════════════════════════════════════════════════════════
const RESULTS = [
  { lbl: "Users reached globally",               pct: 92, color: T.cream,  counter: { target: 100000, suffix: "K+" }, barMsg: "100K+" },
  { lbl: "Search performance improvement",        pct: 78, color: "#60A5FA",counter: { target: 78, suffix: "%"     }, barMsg: "78%" },
  { lbl: "In proven ITAM savings delivered",      pct: 65, color: T.gold,   counter: { target: 3e6                }, barMsg: "$3M" },
  { lbl: "Deployment cycle time reduction",       pct: 70, color: "#34D399",counter: { target: 70, suffix: "%"     }, barMsg: "70%" },
];

function SceneProof({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 200),
      setTimeout(() => setPh(2), 2600),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene vig rule" style={{ background: T.void, cursor: ph >= 2 ? "pointer" : "default" }} onClick={ph >= 2 ? onNext : undefined}>
      <Atmosphere blue gold />
      <DotGrid />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 940, padding: "0 96px", width: "100%" }}>
        <div style={{ marginBottom: 44, animation: "rise .8s ease both" }}>
          <div className="lbl" style={{ color: T.gold }}>The outcome — from the resume</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 64px" }}>
          {RESULTS.map((r, i) => (
            <div key={i} style={{ paddingTop: 20, borderTop: `1px solid ${T.fog}`, animation: `rise .75s cubic-bezier(.16,1,.3,1) ${.08 + i * .18}s both` }}>
              {ph >= 1 && (
                <Counter
                  target={r.counter.target}
                  suffix={r.counter.suffix || ""}
                  color={r.color}
                  size="clamp(40px,6.5vw,88px)"
                />
              )}
              {/* Animated progress bar */}
              <div style={{ position: "relative", height: 1, background: "rgba(237,233,225,.07)", marginTop: 12, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0, width: `${r.pct}%`, background: r.color,
                  transformOrigin: "left", animation: `extend .9s cubic-bezier(.22,1,.36,1) ${.6 + i * .18}s both`,
                }} />
              </div>
              <div style={{ fontSize: "12px", fontWeight: 300, color: T.stone, marginTop: 10, lineHeight: 1.6 }}>{r.lbl}</div>
            </div>
          ))}
        </div>

        {ph >= 2 && (
          <div style={{ marginTop: 40, paddingTop: 22, borderTop: `1px solid ${T.fog}`, animation: "rise .65s ease both" }}>
            <div className="serif" style={{ fontSize: "clamp(15px,2vw,22px)", fontWeight: 300, color: T.stone, fontStyle: "italic" }}>
              All three workstreams delivered. On time. Zero escalations to leadership.
            </div>
          </div>
        )}
      </div>

      {ph >= 2 && (
        <div style={{ position: "absolute", bottom: 36, right: 96, zIndex: 2 }}>
          <span className="lbl" style={{ color: T.fog, animation: "fade .8s ease both" }}>click to continue →</span>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCENE 5 — THE VISION (supplier risk dashboard)
// ══════════════════════════════════════════════════════════════
const SUPPLIERS = [
  { name: "Supplier Alpha",   country: "Taiwan",   tier: "T1", cat: "Semiconductors", score: 87, status: "high",   signal: "Credit downgraded Q1 2026",         action: "Schedule exec review",          trend: "↑" },
  { name: "Supplier Beta",    country: "Malaysia", tier: "T2", cat: "PCB Assembly",   score: 52, status: "medium", signal: "Delivery SLA declining 3 months",   action: "Monitor monthly — flag if <90%", trend: "↓" },
  { name: "Supplier Gamma",   country: "China",    tier: "T1", cat: "Display Panels", score: 91, status: "high",   signal: "Single source — no alternate",      action: "Qualify alternate by Q3",        trend: "↑" },
  { name: "Supplier Delta",   country: "Mexico",   tier: "T1", cat: "Logistics",      score: 21, status: "low",    signal: "All SLAs met — no adverse signals", action: "Routine quarterly review",       trend: "→" },
  { name: "Supplier Epsilon", country: "India",    tier: "T2", cat: "Cable Assembly", score: 44, status: "medium", signal: "RBA audit overdue 6 weeks",         action: "Confirm audit date this week",   trend: "→" },
];
const SC = {
  high:   { bg: "#FEF2F2", color: "#DC2626", border: "rgba(220,38,38,.22)" },
  medium: { bg: "#FFFBEB", color: "#B45309", border: "rgba(180,83,9,.22)"  },
  low:    { bg: "#F0FDF4", color: "#047857", border: "rgba(4,120,87,.22)"  },
};

function SceneVision() {
  const [active, setActive] = useState(null);
  return (
    <div className="scene" style={{ background: T.offW, overflowY: "auto", alignItems: "flex-start" }}>
      <div style={{ width: "100%", maxWidth: 1060, padding: "52px 72px 88px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, animation: "fade .6s ease both" }}>
          <div className="lbl" style={{ color: T.green }}>Illustrative · Dummy Data</div>
          <span className="lbl" style={{ color: T.muted, padding: "3px 10px", border: `1px solid ${T.line}`, borderRadius: 4 }}>Proactive Risk Monitoring</span>
        </div>

        <div className="serif" style={{ fontSize: "clamp(22px,3vw,44px)", fontWeight: 600, lineHeight: 1.15, color: T.navy, letterSpacing: "-0.015em", marginBottom: 10, animation: "rise .75s ease .08s both" }}>
          Here is how I think{" "}
          <span style={{ fontStyle: "italic", color: T.amber }}>about your challenge.</span>
        </div>
        <p style={{ fontSize: "13px", fontWeight: 300, color: T.muted, lineHeight: 1.7, marginBottom: 24, animation: "fade .6s ease .2s both" }}>
          Built in an afternoon. The real version starts with SCA's data and the analysts who use it every day.
        </p>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, animation: "rise .6s ease .22s both" }}>
          {[
            { val: "2", label: "High Risk",   note: "↑ 1 vs last week", color: T.red   },
            { val: "2", label: "Medium Risk", note: "unchanged",         color: T.amber },
            { val: "1", label: "Low Risk",    note: "↓ 1 resolved",      color: T.green },
            { val: "3", label: "Actions Due", note: "this week",         color: T.blue  },
          ].map((s, i) => (
            <div key={i} style={{ background: "#FFFFFF", border: `1.5px solid ${T.line}`, borderRadius: 10, padding: "16px 18px", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: "38px", fontWeight: 600, color: s.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: T.navy, marginTop: 5 }}>{s.label}</div>
              <div className="mono" style={{ fontSize: "9px", color: T.muted, marginTop: 3 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#FFFFFF", border: `1.5px solid ${T.line}`, borderRadius: 12, overflow: "hidden", marginBottom: 16, animation: "rise .6s ease .3s both" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 90px 2fr 2.5fr 100px", gap: 12, padding: "10px 22px", background: "#F8FAFC", borderBottom: `1px solid ${T.line}` }}>
            {["SUPPLIER", "TIER", "RISK", "SIGNAL", "ACTION", "STATUS"].map((h, i) => (
              <div key={i} className="lbl" style={{ color: T.muted }}>{h}</div>
            ))}
          </div>
          {SUPPLIERS.map((s, i) => (
            <div key={i}>
              <div className="srow" onClick={() => setActive(active === i ? null : i)}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 90px 2fr 2.5fr 100px", gap: 12, padding: "12px 22px", background: active === i ? "#FFF8F0" : "#FFFFFF", borderBottom: i < SUPPLIERS.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: T.navy }}>{s.name}</div>
                  <div className="mono" style={{ fontSize: "9px", color: T.muted, marginTop: 2 }}>{s.country} · {s.cat}</div>
                </div>
                <div className="mono" style={{ fontSize: "11px", color: T.muted, paddingTop: 2 }}>{s.tier}</div>
                <div>
                  <div style={{ height: 3, background: "#F1F5F9", borderRadius: 2, marginBottom: 5, width: 56 }}>
                    <div style={{ width: `${s.score}%`, height: "100%", background: SC[s.status].color, borderRadius: 2, transition: "width .6s ease" }} />
                  </div>
                  <span className="mono" style={{ fontSize: "11px", color: SC[s.status].color, fontWeight: 600 }}>{s.score} {s.trend}</span>
                </div>
                <div style={{ fontSize: "12px", color: T.slate, lineHeight: 1.45 }}>{s.signal}</div>
                <div style={{ fontSize: "12px", color: T.muted, fontStyle: "italic", lineHeight: 1.45 }}>{s.action}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: SC[s.status].bg, color: SC[s.status].color, border: `1px solid ${SC[s.status].border}`, alignSelf: "center" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: SC[s.status].color, display: "inline-block" }} />
                  {s.status}
                </span>
              </div>
              {active === i && (
                <div style={{ background: "#FFF8F0", padding: "14px 22px 16px", borderBottom: "1px solid #E2E8F0", animation: "fade .2s ease both", display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 24, alignItems: "center" }}>
                  <div>
                    <div className="lbl" style={{ color: T.muted, marginBottom: 5 }}>Risk Signal</div>
                    <div style={{ fontSize: "13px", color: SC[s.status].color, fontWeight: 500 }}>{s.signal}</div>
                  </div>
                  <div>
                    <div className="lbl" style={{ color: T.muted, marginBottom: 5 }}>Recommended Action</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: T.navy }}>{s.action}</div>
                  </div>
                  <Gauge value={s.score} color={SC[s.status].color} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Principles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "rise .6s ease .4s both" }}>
          <div style={{ background: "#F0FDF4", border: `1.5px solid rgba(4,120,87,.18)`, borderRadius: 10, padding: "20px 22px", borderLeft: `4px solid ${T.green}` }}>
            <div className="lbl" style={{ color: T.green, marginBottom: 10 }}>The Principle</div>
            <p style={{ fontSize: "13px", fontWeight: 300, color: T.slate, lineHeight: 1.75 }}>Leading indicators, not news articles. Structured signals, not internet noise. Built for the analyst who acts — not the engineer who builds.</p>
          </div>
          <div style={{ background: "#FFFBEB", border: `1.5px solid rgba(180,83,9,.18)`, borderRadius: 10, padding: "20px 22px", borderLeft: `4px solid ${T.amber}` }}>
            <div className="lbl" style={{ color: T.amber, marginBottom: 10 }}>The Commitment</div>
            <p style={{ fontSize: "13px", fontWeight: 300, color: T.slate, lineHeight: 1.75 }}>I don't describe what I'd build. I build a version of it. This took an afternoon. The real one starts with SCA's data and the people who use it every day.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
const SCENES = [SceneEntry, SceneQuestion, SceneGaps, SceneBuild, SceneProof, SceneVision];
const LIGHT = new Set([5]);

export default function App() {
  const [scene, setScene] = useState(0);
  const [cutting, setCutting] = useState(false);
  const isDark = !LIGHT.has(scene);
  const Scene = SCENES[scene];

  const cut = fn => {
    setCutting(true);
    setTimeout(() => fn(), 260);
    setTimeout(() => setCutting(false), 280);
  };
  const next = () => cut(() => setScene(s => Math.min(s + 1, SCENES.length - 1)));
  const prev = () => cut(() => setScene(s => Math.max(s - 1, 0)));

  useEffect(() => {
    const h = e => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []); // eslint-disable-line

  const chrome = isDark ? "rgba(237,233,225,.2)" : "rgba(11,24,39,.22)";

  return (
    <>
      <style>{CSS}</style>

      {cutting && <div style={{ position: "fixed", inset: 0, zIndex: 999, background: T.void, pointerEvents: "none" }} />}

      {scene > 0 && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 1, background: isDark ? "rgba(237,233,225,.06)" : "rgba(11,24,39,.06)", zIndex: 500 }}>
          <div style={{ height: "100%", background: T.gold, width: `${(scene / (SCENES.length - 1)) * 100}%`, transition: "width .55s cubic-bezier(.22,1,.36,1)" }} />
        </div>
      )}

      {scene > 0 && (
        <div className="lbl" style={{ position: "fixed", top: 18, right: 40, color: chrome, zIndex: 500, transition: "color .3s ease" }}>
          {String(scene).padStart(2, "0")} / {String(SCENES.length - 1).padStart(2, "0")}
        </div>
      )}

      {scene > 1 && scene < SCENES.length - 1 && (
        <button onClick={prev} style={{
          position: "fixed", bottom: 28, right: 40, zIndex: 500, cursor: "pointer",
          background: "transparent",
          border: `1px solid ${isDark ? "rgba(237,233,225,.14)" : "rgba(11,24,39,.14)"}`,
          color: chrome, padding: "6px 14px", borderRadius: 4,
          fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 500,
          letterSpacing: ".18em", textTransform: "uppercase", transition: "all .2s ease",
        }}>← Back</button>
      )}

      <div key={scene} style={{ position: "fixed", inset: 0, animation: "fade .5s ease" }}>
        <Scene onNext={next} />
      </div>
    </>
  );
}
