import { useState, useEffect, useRef } from "react";

const T = {
  white:"#FFFFFF", navy:"#0B1524", navyMid:"#162236",
  navySoft:"#1E3048", navyFade:"#5A7490", cream:"#F7F4EE",
  orange:"#F97316", orangeLt:"#FFF4ED",
  blue:"#1D4ED8", blueLt:"#EFF6FF",
  green:"#047857", greenLt:"#F0FDF4",
  red:"#B91C1C", redLt:"#FEF2F2",
  amber:"#B45309", amberLt:"#FFFBEB",
  line:"#E2E8F0", lineSoft:"#F1F5F9",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
body{background:${T.navy};font-family:'Inter',sans-serif;color:${T.white};-webkit-font-smoothing:antialiased}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeOut{from{opacity:1}to{opacity:0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes countUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.4)}50%{box-shadow:0 0 0 20px rgba(249,115,22,0)}}
@keyframes pulseRed{0%,100%{box-shadow:0 0 0 0 rgba(185,28,28,.5)}50%{box-shadow:0 0 0 20px rgba(185,28,28,0)}}
@keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 rgba(4,120,87,.4)}50%{box-shadow:0 0 0 16px rgba(4,120,87,0)}}
@keyframes typeChar{from{width:0}to{width:100%}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes drawLine{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
@keyframes slideRight{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideLeft{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
@keyframes ripple{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.5);opacity:0}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px rgba(249,115,22,.6))}50%{filter:drop-shadow(0 0 20px rgba(249,115,22,.9))}}
@keyframes particleFloat{0%{transform:translate(0,0)}25%{transform:translate(var(--dx1),var(--dy1))}75%{transform:translate(var(--dx2),var(--dy2))}100%{transform:translate(0,0)}}
.scene{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
.scene-in{animation:fadeIn .6s ease both}
.scene-out{animation:fadeOut .4s ease both}
.fu1{animation:fadeUp .7s ease .05s both}
.fu2{animation:fadeUp .7s ease .2s both}
.fu3{animation:fadeUp .7s ease .35s both}
.fu4{animation:fadeUp .7s ease .5s both}
.fu5{animation:fadeUp .7s ease .65s both}
.mono{font-family:'JetBrains Mono',monospace}
.syne{font-family:'Syne',sans-serif}
.click-hint{position:fixed;bottom:36px;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:rgba(255,255,255,.25);display:flex;align-items:center;gap:8px;cursor:pointer;transition:color .2s}
.click-hint:hover{color:rgba(255,255,255,.5)}
.nav-dot{width:7px;height:7px;border-radius:50%;border:none;cursor:pointer;padding:0;transition:all .3s ease}
.srow{transition:background .15s;border-radius:8px;cursor:pointer}
.srow:hover{background:${T.lineSoft}}
`;

// ── PARTICLE CANVAS ────────────────────────────────────────────
function Particles({ color = "255,255,255", opacity = .12, count = 70, connect = true, explode = false }) {
  const ref = useRef(null);
  const state = useRef({ pts: [], raf: null, exploding: false });

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const W = c.width, H = c.height;

    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6,
      r: Math.random() * 2 + .8, o: Math.random() * .5 + .1,
    }));
    state.current.pts = pts;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (connect) {
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 110) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${color},${.05 * (1 - d / 110)})`;
              ctx.lineWidth = .6;
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.o * opacity * 8})`;
        ctx.fill();
      });
    }

    function tick() {
      pts.forEach(p => {
        if (state.current.exploding) {
          p.vx *= 1.15; p.vy *= 1.15; p.o -= .015;
        } else {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
      });
      draw();
      state.current.raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(state.current.raf);
  }, []);

  useEffect(() => {
    if (explode) state.current.exploding = true;
  }, [explode]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

// ── TYPE WRITER ────────────────────────────────────────────────
function TypeLine({ text, delay = 0, color = T.white, size = "clamp(18px,2.2vw,28px)", bold = false, onDone }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setShown(text.slice(0, ++i));
        if (i >= text.length) { clearInterval(iv); setDone(true); onDone && onDone(); }
      }, 38);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  return (
    <div style={{
      fontFamily: "'Syne',sans-serif",
      fontSize: size, fontWeight: bold ? 800 : 400,
      color, lineHeight: 1.3, minHeight: "1.4em",
    }}>
      {shown}
      {!done && <span style={{ animation: "blink .7s ease infinite", marginLeft: 2, color: T.orange }}>|</span>}
    </div>
  );
}

// ── CIRCUIT ────────────────────────────────────────────────────
function Circuit({ step }) {
  const stages = [
    { label: "Internal Test",   sub: "You + dev · iterate",    color: T.blue   },
    { label: "30-Member Pilot", sub: "Controlled group",       color: T.blue   },
    { label: "Formal Intake",   sub: "Packaging · Eng",        color: "#94A3B8"},
    { label: "Go / No-Go",      sub: "All leads sign-off",     color: T.orange },
    { label: "Ring Deploy",     sub: "98K devices",            color: T.green  },
  ];
  return (
    <div style={{ position: "relative", padding: "8px 0 60px" }}>
      <div style={{ position: "absolute", top: 29, left: 28, right: 28, height: 3, background: "rgba(255,255,255,.08)", borderRadius: 2 }}>
        <div style={{
          height: "100%", background: T.orange, borderRadius: 2,
          width: `${Math.max(0, Math.min(step / (stages.length - 1), 1)) * 100}%`,
          transition: "width .6s cubic-bezier(.22,1,.36,1)",
          boxShadow: `0 0 12px ${T.orange}`,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${100 / stages.length}%` }}>
            <div style={{
              width: 58, height: 58, borderRadius: "50%", marginBottom: 14,
              background: step >= i ? s.color : "rgba(255,255,255,.06)",
              border: `2.5px solid ${step >= i ? s.color : "rgba(255,255,255,.15)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .5s ease",
              boxShadow: step >= i ? `0 0 20px ${s.color}80` : "none",
              animation: step === i ? "pulse 1.5s ease infinite" : "none",
            }}>
              {step >= i ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="22">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "rgba(255,255,255,.3)", fontWeight: 500 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <div style={{ textAlign: "center", opacity: step >= i ? 1 : .3, transition: "opacity .5s ease" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "12px", fontWeight: 700, color: T.white, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: "rgba(255,255,255,.4)" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GAUGE ─────────────────────────────────────────────────────
function Gauge({ value, color }) {
  const r = 34, circ = 2 * Math.PI * r;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84">
      <circle cx="42" cy="42" r={r} stroke={`${color}20`} strokeWidth="8" fill="none" />
      <circle cx="42" cy="42" r={r} stroke={color} strokeWidth="8" fill="none"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
        strokeLinecap="round" transform="rotate(-90 42 42)"
        style={{ transition: "stroke-dashoffset .8s ease", animation: "fadeIn .3s ease" }}
      />
      <text x="42" y="46" textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize="16" fill={color}>{value}</text>
    </svg>
  );
}

// ── COUNTER ───────────────────────────────────────────────────
function Counter({ target, duration = 2000, color = T.orange, size = "clamp(56px,8vw,120px)" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  const fmt = (n) => {
    if (n >= 1000000) return "$" + (n / 1000000).toFixed(0) + "M";
    if (n >= 1000) return n.toLocaleString();
    return n.toString();
  };

  return (
    <div style={{
      fontFamily: "'Syne',sans-serif", fontWeight: 800,
      fontSize: size, color, lineHeight: 1,
      letterSpacing: "-0.04em",
      animation: "countUp .5s ease both",
    }}>
      {fmt(val)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCENES
// ═══════════════════════════════════════════════════════════════

// SCENE 0 — ENTRY
function SceneEntry({ onNext }) {
  const [phase, setPhase] = useState(0);
  const [explode, setExplode] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 3800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const handle = () => {
    if (phase < 2) return;
    setExplode(true);
    setTimeout(onNext, 600);
  };

  return (
    <div className="scene" style={{ background: T.white, cursor: phase >= 2 ? "pointer" : "default" }} onClick={handle}>
      <Particles color="13,27,42" opacity={1} count={80} explode={explode} />

      {/* Orange top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, height: 4,
        background: T.orange,
        width: phase >= 1 ? "100%" : "0%",
        transition: "width 1.4s cubic-bezier(.22,1,.36,1)",
        boxShadow: `0 0 16px ${T.orange}80`,
        zIndex: 10,
      }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720, padding: "0 48px" }}>
        <div style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(40px,6vw,84px)",
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: T.navy,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "none" : "translateY(32px)",
          transition: "opacity .9s ease .2s, transform .9s ease .2s",
          marginBottom: 12,
        }}>
          I spent my first weeks<br />asking{" "}
          <span style={{ color: T.orange }}>questions.</span>
        </div>

        <div style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(40px,6vw,84px)",
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: T.navy,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "none" : "translateY(32px)",
          transition: "opacity .9s ease, transform .9s ease",
          marginBottom: 56,
        }}>
          What I found<br />
          <span style={{ color: T.orange }}>changed everything.</span>
        </div>

        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity .6s ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#94A3B8", letterSpacing: ".2em", animation: "blink 2s ease infinite" }}>
            CLICK TO ENTER
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" width="16">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: "#94A3B8", letterSpacing: ".16em", opacity: phase >= 2 ? 1 : 0, transition: "opacity .6s ease 1s", zIndex: 2 }}>
        VISHNU PRATAP KUMAR · DELL TECHNOLOGIES · SCA
      </div>
    </div>
  );
}

// SCENE 1 — CHAOS (words type through particles)
function SceneChaos({ onNext }) {
  const lines = [
    { text: "100,000 employees.", size: "clamp(28px,3.5vw,52px)", bold: true  },
    { text: "12,000 software titles.", size: "clamp(28px,3.5vw,52px)", bold: true  },
    { text: "Zero visibility.", size: "clamp(32px,4vw,60px)", bold: true, color: T.orange },
    { text: "This is what I walked into.", size: "clamp(18px,2vw,28px)", bold: false, color: "rgba(255,255,255,.5)" },
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const delays = [400, 1800, 3200, 4600];
    const timers = delays.map((d, i) => setTimeout(() => setShown(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene" style={{ background: T.navy, cursor: "pointer" }} onClick={onNext}>
      <Particles color="255,255,255" opacity={1} count={90} connect={true} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 680, padding: "0 48px", display: "flex", flexDirection: "column", gap: 20 }}>
        {lines.map((l, i) => (
          <div key={i} style={{
            opacity: shown > i ? 1 : 0,
            transform: shown > i ? "none" : "translateY(20px)",
            transition: "opacity .6s ease, transform .6s ease",
            minHeight: "1.4em",
          }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: l.size, fontWeight: l.bold ? 800 : 400, color: l.color || T.white, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {l.text}
            </span>
          </div>
        ))}
      </div>
      <div className="click-hint" style={{ opacity: shown >= 4 ? 1 : 0, transition: "opacity .5s ease" }}>
        CLICK TO CONTINUE →
      </div>
    </div>
  );
}

// SCENE 2 — DISCOVERIES (fade in/out each)
const discoveries = [
  { num: "01", title: "Everything was everywhere.", body: "Employees bounced between 4–5 people to get one answer.\nNo owner. No process. Pure chaos by design.", color: T.orange },
  { num: "02", title: "Nobody knew the next step.", body: "Zero visibility into where a request was\nor who was supposed to act on it.", color: "#60A5FA" },
  { num: "03", title: "Compliance was invisible.", body: "Most employees had no idea if their software was licensed.\nRisk was growing silently — untracked, unenforced.", color: "#34D399" },
  { num: "04", title: "A tech giant.\nRunning manually.", body: "The biggest surprise: Dell — a global technology company —\nmanaged software on manual processes with week-long delays.", color: "#FBBF24" },
];

function SceneDiscoveries({ onNext }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const advance = () => {
    if (idx < discoveries.length - 1) {
      setVisible(false);
      setTimeout(() => { setIdx(i => i + 1); setVisible(true); }, 350);
    } else {
      onNext();
    }
  };

  const d = discoveries[idx];

  return (
    <div className="scene" style={{ background: T.navyMid, cursor: "pointer" }} onClick={advance}>
      <Particles color="255,255,255" opacity={.6} count={40} connect={false} />

      {/* Progress dots */}
      <div style={{ position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
        {discoveries.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? 24 : 7, height: 7, borderRadius: 4,
            background: i === idx ? d.color : "rgba(255,255,255,.15)",
            transition: "all .3s ease",
          }} />
        ))}
      </div>

      <div style={{
        position: "relative", zIndex: 2,
        textAlign: "center", maxWidth: 760, padding: "0 60px",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: "opacity .35s ease, transform .35s ease",
      }}>
        {/* Big number */}
        <div style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(80px,14vw,180px)",
          fontWeight: 800, lineHeight: 1,
          color: d.color,
          opacity: .15,
          letterSpacing: "-0.04em",
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}>
          {d.num}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Label */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: d.color, letterSpacing: ".2em", marginBottom: 28, opacity: .8 }}>
            DISCOVERY {d.num} OF 04
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(32px,4.5vw,64px)",
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: T.white,
            marginBottom: 28,
            whiteSpace: "pre-line",
          }}>
            {d.title}
          </h2>

          {/* Body */}
          <p style={{
            fontSize: "clamp(14px,1.6vw,20px)",
            color: "rgba(255,255,255,.55)",
            lineHeight: 1.75,
            whiteSpace: "pre-line",
            maxWidth: 560,
            margin: "0 auto",
          }}>
            {d.body}
          </p>
        </div>
      </div>

      <div className="click-hint">
        {idx < discoveries.length - 1 ? `${idx + 2} OF 4  →` : "THE SOLUTION →"}
      </div>
    </div>
  );
}

// SCENE 3 — $400M moment
function SceneProgram({ onNext }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 3600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className="scene" style={{ background: T.white, cursor: "pointer" }} onClick={onNext}>

      {/* Full screen counter */}
      {phase < 2 && (
        <div style={{ textAlign: "center", zIndex: 2, animation: "fadeIn .4s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#94A3B8", letterSpacing: ".2em", marginBottom: 28 }}>
            CIO INITIATIVE · PROJECTED SAVINGS
          </div>
          {phase >= 1 && <Counter target={400000000} duration={2200} />}
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,1.8vw,22px)",
            fontWeight: 600, color: "#94A3B8", marginTop: 20,
            opacity: phase >= 1 ? 1 : 0, transition: "opacity .5s ease 2s",
          }}>
            in ITAM savings
          </div>
        </div>
      )}

      {/* Program reveal */}
      {phase >= 2 && (
        <div style={{ maxWidth: 900, padding: "0 64px", width: "100%", zIndex: 2, animation: "fadeIn .6s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#94A3B8", letterSpacing: ".18em", marginBottom: 20, animation: "fadeUp .5s ease both" }}>
            THE PROGRAM
          </div>
          <h1 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(28px,3.8vw,58px)",
            fontWeight: 800, lineHeight: 1.08,
            letterSpacing: "-0.025em", color: T.navy,
            marginBottom: 48,
            animation: "fadeUp .6s ease .1s both",
          }}>
            Three workstreams nobody connected.{" "}
            <span style={{ color: T.orange }}>One program</span>{" "}
            that became the CIO initiative.
          </h1>

          {/* Three workstreams */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 36 }}>
            {[
              { color: T.blue,   label: "Software Catalog",      meta: "AI search · RAG/LLM\n365K assets",           num: "01" },
              { color: T.red,    label: "Compliance Agent",       meta: "Silent removal · AI\n98K endpoints",          num: "02" },
              { color: T.green,  label: "Deployment Automation",  meta: "Camunda workflow\n5K+ requests · 45d→15min", num: "03" },
            ].map((w, i) => (
              <div key={i} style={{
                padding: "22px 24px",
                background: T.white,
                border: `1.5px solid ${T.line}`,
                borderTop: `4px solid ${w.color}`,
                borderRadius: 12,
                animation: `fadeUp .5s ease ${.2 + i * .12}s both`,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: w.color, letterSpacing: ".14em", marginBottom: 10 }}>
                  {w.num}
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "15px", fontWeight: 700, color: T.navy, marginBottom: 6 }}>{w.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: "#94A3B8", lineHeight: 1.6, whiteSpace: "pre-line" }}>{w.meta}</div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          {phase >= 3 && (
            <div style={{ display: "flex", gap: 40, animation: "fadeUp .5s ease .1s both" }}>
              {[
                { val: "100K+", label: "Users reached", color: T.navy },
                { val: "70%",   label: "Cycle time reduced", color: T.orange },
                { val: "4 yrs", label: "Zero escalations", color: T.green },
                { val: "20K",   label: "Monthly active users", color: T.blue },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(22px,2.8vw,36px)", fontWeight: 800, color: m.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{m.val}</div>
                  <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="click-hint" style={{ color: "#94A3B8" }}>
        CLICK TO CONTINUE →
      </div>
    </div>
  );
}

// SCENE 4 — BUILT (dark, circuit)
function SceneBuilt({ onNext }) {
  const [step, setStep] = useState(-1);
  const [crisis, setCrisis] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(0), 400),
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 1900),
      setTimeout(() => setStep(4), 2400),
      setTimeout(() => setShowMetrics(true), 3000),
      setTimeout(() => setCrisis(true), 3800),
      setTimeout(() => setResolved(true), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene" style={{ background: T.navy, cursor: "pointer" }} onClick={onNext}>
      <Particles color="255,255,255" opacity={.4} count={50} connect={false} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, padding: "0 60px", width: "100%" }}>

        <div className="fu1" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: T.orange, letterSpacing: ".18em", marginBottom: 16 }}>
          RISK INTELLIGENCE — BUILT FROM ZERO
        </div>

        <div className="fu2" style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,3.5vw,54px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em", color: T.white }}>
            First of its kind.{" "}
            <span style={{ color: T.orange }}>No precedent. No team.</span>{" "}
            Just a process that worked.
          </h1>
        </div>

        {/* Circuit */}
        <Circuit step={step} />

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, opacity: showMetrics ? 1 : 0, transition: "opacity .6s ease" }}>
          {[
            { val: "95%+", label: "Removal efficiency", color: T.green  },
            { val: "98K",  label: "Global endpoints",   color: T.blue   },
            { val: "100K+",label: "Removals done",      color: T.orange },
            { val: "< 2d", label: "Crisis resolved",    color: "#FBBF24"},
          ].map((m, i) => (
            <div key={i} style={{
              padding: "16px 18px", borderRadius: 10, textAlign: "center",
              background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.08)",
              animation: `fadeUp .4s ease ${i * .08}s both`,
            }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "28px", fontWeight: 800, color: m.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,.35)", marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Crisis */}
        <div style={{
          padding: "14px 20px", borderRadius: 10,
          background: resolved ? "rgba(4,120,87,.12)" : crisis ? "rgba(185,28,28,.12)" : "rgba(255,255,255,.04)",
          border: `1.5px solid ${resolved ? T.green + "40" : crisis ? T.red + "40" : "rgba(255,255,255,.08)"}`,
          borderLeft: `4px solid ${resolved ? T.green : crisis ? T.red : "rgba(255,255,255,.1)"}`,
          transition: "all .6s ease",
          opacity: showMetrics ? 1 : 0,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", letterSpacing: ".14em", marginBottom: 6,
            color: resolved ? T.green : crisis ? T.red : "rgba(255,255,255,.2)", transition: "color .5s" }}>
            {resolved ? "POST-LAUNCH CRISIS — RESOLVED IN < 2 DAYS" : crisis ? "POST-LAUNCH CRISIS — ACTIVE" : "POST-LAUNCH STATUS"}
          </div>
          {crisis && (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", lineHeight: 1.6, animation: "fadeIn .4s ease" }}>
              {resolved
                ? "Auto-restart issue identified, patched, and deployed to all 98K devices in under 2 days. Three simultaneous response tracks: engineering, leadership, users."
                : "Silent removal triggered auto-restarts across 98K endpoints. Three simultaneous response tracks initiated immediately."}
            </div>
          )}
        </div>
      </div>

      <div className="click-hint">
        CLICK TO CONTINUE →
      </div>
    </div>
  );
}

// SCENE 5 — VISION (white, dashboard)
const SUPPLIERS = [
  { name:"Supplier Alpha",  country:"Taiwan",  tier:"T1", cat:"Semiconductors", score:87, status:"high",   signal:"Credit downgraded Q1 2026",         action:"Schedule exec review",         trend:"↑" },
  { name:"Supplier Beta",   country:"Malaysia",tier:"T2", cat:"PCB Assembly",   score:52, status:"medium", signal:"Delivery SLA declining 3 months",   action:"Monitor monthly — flag if <90%",trend:"↓" },
  { name:"Supplier Gamma",  country:"China",   tier:"T1", cat:"Display Panels", score:91, status:"high",   signal:"Single source — no alternate",      action:"Qualify alternate by Q3",       trend:"↑" },
  { name:"Supplier Delta",  country:"Mexico",  tier:"T1", cat:"Logistics",      score:21, status:"low",    signal:"All SLAs met — no adverse signals", action:"Routine quarterly review",      trend:"→" },
  { name:"Supplier Epsilon",country:"India",   tier:"T2", cat:"Cable Assembly", score:44, status:"medium", signal:"RBA audit overdue 6 weeks",         action:"Confirm audit date this week",  trend:"→" },
];
const SC = {
  high:   { bg:T.redLt,   color:T.red,   border:`${T.red}30`   },
  medium: { bg:T.amberLt, color:T.amber, border:`${T.amber}30` },
  low:    { bg:T.greenLt, color:T.green, border:`${T.green}30` },
};

function SceneVision() {
  const [active, setActive] = useState(null);
  return (
    <div className="scene" style={{ background: T.white, overflowY: "auto", alignItems: "flex-start" }}>
      <div style={{ width: "100%", maxWidth: 1040, padding: "64px 64px 80px", margin: "0 auto" }}>

        <div className="fu1" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:24, height:2, background:T.green, borderRadius:1 }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:T.green, letterSpacing:".16em" }}>ILLUSTRATIVE · DUMMY DATA</span>
          </div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#94A3B8", padding:"3px 10px", borderRadius:4, border:`1px solid ${T.line}` }}>PROACTIVE RISK MONITORING</span>
        </div>

        <div className="fu2" style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px,3vw,46px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.02em", color:T.navy }}>
            What proactive risk monitoring looks like{" "}
            <span style={{ color:T.green }}>when it's built for the person who has to act.</span>
          </h1>
        </div>

        {/* Summary cards */}
        <div className="fu3" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { val:"2", label:"High Risk",   note:"↑ 1 vs last week", color:T.red   },
            { val:"2", label:"Medium Risk", note:"unchanged",         color:T.amber },
            { val:"1", label:"Low Risk",    note:"↓ 1 resolved",      color:T.green },
            { val:"3", label:"Actions Due", note:"this week",         color:T.blue  },
          ].map((s,i) => (
            <div key={i} style={{ background:T.white, border:`1.5px solid ${T.line}`, borderRadius:12, padding:"16px 18px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"38px", fontWeight:800, color:s.color, lineHeight:1, letterSpacing:"-0.02em" }}>{s.val}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"11px", fontWeight:700, color:T.navy, marginTop:4 }}>{s.label}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#94A3B8", marginTop:3 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="fu4" style={{ background:T.white, border:`1.5px solid ${T.line}`, borderRadius:12, overflow:"hidden", marginBottom:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 90px 2fr 2.5fr 100px", gap:12, padding:"10px 20px", background:T.lineSoft, borderBottom:`1px solid ${T.line}` }}>
            {["SUPPLIER","TIER","RISK","SIGNAL","ACTION","STATUS"].map((h,i) => (
              <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#94A3B8", letterSpacing:".1em" }}>{h}</div>
            ))}
          </div>
          {SUPPLIERS.map((s,i) => (
            <div key={i}>
              <div className="srow"
                onClick={() => setActive(active===i?null:i)}
                style={{ display:"grid", gridTemplateColumns:"2fr 1fr 90px 2fr 2.5fr 100px", gap:12, padding:"11px 20px", background:active===i?T.orangeLt:T.white, borderBottom:i<SUPPLIERS.length-1?`1px solid ${T.lineSoft}`:"none" }}>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:600, color:T.navy }}>{s.name}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#94A3B8", marginTop:1 }}>{s.country} · {s.cat}</div>
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#94A3B8", paddingTop:2 }}>{s.tier}</div>
                <div>
                  <div style={{ height:3, background:T.lineSoft, borderRadius:2, marginBottom:4, width:56 }}>
                    <div style={{ width:`${s.score}%`, height:"100%", background:SC[s.status].color, borderRadius:2, transition:"width .6s ease" }} />
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:SC[s.status].color, fontWeight:600 }}>{s.score} {s.trend}</span>
                </div>
                <div style={{ fontSize:"12px", color:"#475569", lineHeight:1.4 }}>{s.signal}</div>
                <div style={{ fontSize:"12px", color:"#94A3B8", fontStyle:"italic", lineHeight:1.4 }}>{s.action}</div>
                <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:20, background:SC[s.status].bg, color:SC[s.status].color, border:`1px solid ${SC[s.status].border}`, alignSelf:"center" }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:SC[s.status].color, display:"inline-block" }} />
                  {s.status}
                </span>
              </div>
              {active===i && (
                <div style={{ background:T.orangeLt, padding:"14px 20px 16px", borderBottom:`1px solid ${T.line}`, animation:"fadeUp .2s ease both", display:"grid", gridTemplateColumns:"1fr 1fr 84px", gap:20, alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#94A3B8", marginBottom:4 }}>RISK SIGNAL</div>
                    <div style={{ fontSize:"13px", color:SC[s.status].color, fontWeight:500 }}>{s.signal}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#94A3B8", marginBottom:4 }}>ACTION</div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:T.navy }}>{s.action}</div>
                  </div>
                  <Gauge value={s.score} color={SC[s.status].color} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Principles */}
        <div className="fu5" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ background:T.greenLt, border:`1.5px solid ${T.green}25`, borderRadius:10, padding:"18px 20px", borderLeft:`4px solid ${T.green}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.green, letterSpacing:".12em", marginBottom:8 }}>THE PRINCIPLE</div>
            <p style={{ fontSize:"13px", color:"#475569", lineHeight:1.7 }}>Leading indicators, not news articles. Structured signals, not internet noise. Built for the analyst who acts — not the engineer who builds.</p>
          </div>
          <div style={{ background:T.orangeLt, border:`1.5px solid ${T.orange}25`, borderRadius:10, padding:"18px 20px", borderLeft:`4px solid ${T.orange}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:T.orange, letterSpacing:".12em", marginBottom:8 }}>THE COMMITMENT</div>
            <p style={{ fontSize:"13px", color:"#475569", lineHeight:1.7 }}>I don't describe what I'd build. I build a version of it. This took an afternoon. The real one starts with SCA's data and the analysts who use it every day.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
const SCENES = [SceneEntry, SceneChaos, SceneDiscoveries, SceneProgram, SceneBuilt, SceneVision];

export default function App() {
  const [scene, setScene] = useState(0);
  const next = () => setScene(s => Math.min(s + 1, SCENES.length - 1));
  const Scene = SCENES[scene];

  return (
    <>
      <style>{CSS}</style>
      {/* Progress bar */}
      {scene > 0 && (
        <div style={{ position:"fixed", top:0, left:0, right:0, height:3, background:"rgba(255,255,255,.1)", zIndex:300 }}>
          <div style={{ height:"100%", background:T.orange, width:`${(scene/(SCENES.length-1))*100}%`, transition:"width .5s ease", boxShadow:`0 0 10px ${T.orange}` }} />
        </div>
      )}
      {/* Back button */}
      {scene > 1 && (
        <button onClick={() => setScene(s => s - 1)} style={{
          position:"fixed", bottom:32, right:32, zIndex:300,
          background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)",
          color:"rgba(255,255,255,.5)", padding:"8px 16px", borderRadius:8,
          fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", letterSpacing:".12em",
          cursor:"pointer", backdropFilter:"blur(8px)",
          display: scene === 5 ? "none" : "block",
        }}>
          ← BACK
        </button>
      )}
      <div key={scene} style={{ position:"fixed", inset:0, animation:"fadeIn .4s ease" }}>
        <Scene onNext={next} />
      </div>
    </>
  );
}
