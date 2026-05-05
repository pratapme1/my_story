import { useState, useEffect, useRef, useCallback } from "react";

// ── TOKENS ────────────────────────────────────────────────────
const T = {
  white: "#FFFFFF", offwhite: "#FAFAF8", cream: "#F7F4EE",
  navy: "#0D1B2A", navySoft: "#1E3048", navyFade: "#5A6F85",
  orange: "#F97316", orangeLt: "#FFF4ED", orangeMd: "#FED7AA",
  blue: "#1D4ED8", blueLt: "#EFF6FF",
  green: "#047857", greenLt: "#F0FDF4",
  red: "#B91C1C", redLt: "#FEF2F2",
  amber: "#B45309", amberLt: "#FFFBEB",
  line: "#E2E8F0", lineSoft: "#F1F5F9",
};

// ── GLOBAL CSS ────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
body{background:${T.white};font-family:'Inter',sans-serif;color:${T.navy};-webkit-font-smoothing:antialiased}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeLeft{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.6}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.3)}50%{box-shadow:0 0 0 10px rgba(249,115,22,0)}}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes drawH{from{width:0}to{width:100%}}
@keyframes drawV{from{height:0}to{height:100%}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes orbitA{0%{transform:translate(0,0)}50%{transform:translate(12px,-8px)}100%{transform:translate(0,0)}}
@keyframes orbitB{0%{transform:translate(0,0)}50%{transform:translate(-10px,10px)}100%{transform:translate(0,0)}}
@keyframes orbitC{0%{transform:translate(0,0)}50%{transform:translate(8px,12px)}100%{transform:translate(0,0)}}
@keyframes mergeA{0%{transform:translate(-80px,-40px)}100%{transform:translate(0,0)}}
@keyframes mergeB{0%{transform:translate(80px,-40px)}100%{transform:translate(0,0)}}
@keyframes mergeC{0%{transform:translate(0,80px)}100%{transform:translate(0,0)}}
@keyframes ripple{0%{transform:scale(.8);opacity:.8}100%{transform:scale(2.8);opacity:0}}
@keyframes slideR{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes nodeFloat{0%,100%{transform:translate(0,0)}33%{transform:translate(4px,-6px)}66%{transform:translate(-4px,4px)}}
.fu1{animation:fadeUp .55s ease .1s both}
.fu2{animation:fadeUp .55s ease .22s both}
.fu3{animation:fadeUp .55s ease .34s both}
.fu4{animation:fadeUp .55s ease .46s both}
.fu5{animation:fadeUp .55s ease .58s both}
.su{animation:scaleIn .45s cubic-bezier(.22,1,.36,1) both}
.screen{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden}
.screen::-webkit-scrollbar{display:none}
.nav-btn{position:fixed;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:${T.white};border:1.5px solid ${T.line};display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:200;box-shadow:0 2px 8px rgba(0,0,0,.08);transition:all .2s}
.nav-btn:hover{border-color:${T.orange};color:${T.orange};transform:translateY(-50%) scale(1.08)}
.card{background:${T.white};border:1.5px solid ${T.line};border-radius:12px;transition:box-shadow .2s,border-color .2s}
.card:hover{box-shadow:0 6px 20px rgba(0,0,0,.07);border-color:${T.orange}50}
.tag{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.14em;padding:3px 9px;border-radius:4px;font-weight:500}
.pill{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px}
.srow{transition:background .15s;border-radius:8px;cursor:pointer}
.srow:hover{background:${T.lineSoft}}
`;

// ── SVG ICONS ─────────────────────────────────────────────────
const Ic = {
  arr:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  chk:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  warn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  shld: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  rkt:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>,
  db:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  trd:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ── PARTICLES CANVAS (Entry) ──────────────────────────────────
function ParticleCanvas({ explode }) {
  const ref = useRef(null);
  const state = useRef({ particles: [], raf: null, exploding: false });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const N = 80;

    const particles = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      r: Math.random() * 2.5 + 1,
      opacity: Math.random() * .4 + .1,
    }));
    state.current.particles = particles;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(13,27,42,${.06 * (1 - dist / 120)})`;
            ctx.lineWidth = .8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,27,42,${p.opacity})`;
        ctx.fill();
      });
    }

    function tick() {
      particles.forEach(p => {
        if (state.current.exploding) {
          p.vx *= 1.12; p.vy *= 1.12;
          p.opacity -= .012;
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

// ── CHAOS NETWORK (Screen 1) ──────────────────────────────────
function ChaosNetwork() {
  const nodes = [
    { id: "emp1",  label: "Employee A",       x: 15, y: 30, type: "person" },
    { id: "emp2",  label: "Employee B",       x: 15, y: 65, type: "person" },
    { id: "help",  label: "Helpdesk",         x: 38, y: 18, type: "system" },
    { id: "it1",   label: "IT Team 1",        x: 60, y: 35, type: "team"   },
    { id: "it2",   label: "IT Team 2",        x: 55, y: 68, type: "team"   },
    { id: "unk",   label: "Unknown Owner",    x: 80, y: 25, type: "lost"   },
    { id: "tick",  label: "Ticket System",    x: 75, y: 55, type: "system" },
    { id: "mgr",   label: "Manager",          x: 38, y: 80, type: "person" },
    { id: "nxt",   label: "?? Next Step ??",  x: 85, y: 78, type: "lost"   },
  ];
  const edges = [
    ["emp1","help"],["emp1","it1"],["help","it1"],["help","unk"],
    ["it1","it2"],["it1","unk"],["it2","tick"],["it2","nxt"],
    ["emp2","mgr"],["emp2","it2"],["mgr","it1"],["mgr","help"],
    ["tick","unk"],["unk","nxt"],["help","mgr"],
  ];
  const typeStyle = {
    person: { bg: "#EFF6FF", border: T.blue,   color: T.blue   },
    system: { bg: "#F0FDF4", border: T.green,  color: T.green  },
    team:   { bg: "#FFF4ED", border: T.orange, color: T.orange },
    lost:   { bg: "#FEF2F2", border: T.red,    color: T.red,   dashed: true },
  };
  return (
    <div style={{ position: "relative", width: "100%", height: "260px" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {edges.map(([a, b], i) => {
          const na = nodes.find(n => n.id === a);
          const nb = nodes.find(n => n.id === b);
          return (
            <line key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={T.red} strokeWidth=".4" opacity=".25"
              strokeDasharray={typeStyle[na.type].dashed || typeStyle[nb.type].dashed ? "1.5" : "none"}
              style={{ animation: `fadeIn .4s ease ${i * .06}s both` }}
            />
          );
        })}
        {nodes.map((n, i) => {
          const st = typeStyle[n.type];
          const animName = ["nodeFloat", "orbitA", "orbitB", "orbitC"][i % 4];
          return (
            <g key={i} style={{
              animation: `${animName} ${3 + i * .4}s ease-in-out ${i * .2}s infinite`,
            }}>
              <circle cx={n.x} cy={n.y} r="5.5" fill={st.bg} stroke={st.border} strokeWidth=".6"
                style={{ filter: n.type === "lost" ? `drop-shadow(0 0 2px ${T.red}60)` : "none" }} />
              <text x={n.x} y={n.y + .5} textAnchor="middle" dominantBaseline="middle"
                fontSize="2.2" fontFamily="Inter" fill={st.color} fontWeight="600">
                {n.label.length > 10 ? n.label.slice(0, 9) + "…" : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── MERGE ANIMATION (Screen 2) ────────────────────────────────
function MergeViz({ merged }) {
  const circles = [
    { color: T.blue,   icon: Ic.db,   label: "Catalog",    anim: "mergeA" },
    { color: T.red,    icon: Ic.shld, label: "Compliance", anim: "mergeB" },
    { color: T.green,  icon: Ic.rkt,  label: "Automation", anim: "mergeC" },
  ];
  return (
    <div style={{ position: "relative", height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!merged ? (
        <div style={{ position: "relative", width: 240, height: 200 }}>
          {circles.map((c, i) => (
            <div key={i} style={{
              position: "absolute",
              left: i === 0 ? 0 : i === 1 ? "auto" : "50%",
              right: i === 1 ? 0 : "auto",
              top: i === 2 ? "auto" : 20,
              bottom: i === 2 ? 0 : "auto",
              transform: i === 2 ? "translateX(-50%)" : "none",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `${c.color}18`, border: `2.5px solid ${c.color}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 4,
                animation: `${["orbitA","orbitB","orbitC"][i]} ${2.5 + i*.3}s ease-in-out infinite`,
              }}>
                <div style={{ width: 22, color: c.color }}>{c.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: c.color, fontWeight: 600 }}>{c.label}</div>
              </div>
            </div>
          ))}
          {/* Dashed connecting lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 240 200">
            <line x1="80" y1="60" x2="160" y2="60" stroke={T.line} strokeWidth="1.5" strokeDasharray="4" />
            <line x1="40" y1="100" x2="120" y2="160" stroke={T.line} strokeWidth="1.5" strokeDasharray="4" />
            <line x1="200" y1="100" x2="120" y2="160" stroke={T.line} strokeWidth="1.5" strokeDasharray="4" />
          </svg>
        </div>
      ) : (
        <div style={{ textAlign: "center", animation: "scaleIn .6s cubic-bezier(.22,1,.36,1) both" }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.orangeLt}, ${T.white})`,
            border: `3px solid ${T.orange}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: `0 0 0 8px ${T.orange}15, 0 0 0 16px ${T.orange}08`,
            animation: "glow 2s ease infinite",
          }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "28px", fontWeight: 800, color: T.orange, lineHeight: 1 }}>$400M</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "8px", color: T.navyFade, marginTop: 3 }}>SAVINGS</div>
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "13px", fontWeight: 700, color: T.navy }}>CIO Software Modernisation</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
            {[T.blue, T.red, T.green].map((c, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CIRCUIT (Screen 3) ────────────────────────────────────────
function Circuit({ step }) {
  const stages = [
    { label: "Internal Test",    sub: "You + dev",      color: T.blue   },
    { label: "30-Member Pilot",  sub: "Controlled",     color: T.blue   },
    { label: "Formal Intake",    sub: "Pkg · Eng",      color: T.navySoft },
    { label: "Go / No-Go",       sub: "All leads",      color: T.orange },
    { label: "Ring Deploy",      sub: "98K devices",    color: T.green  },
  ];
  return (
    <div style={{ position: "relative", paddingTop: 8 }}>
      {/* Track */}
      <div style={{ position: "absolute", top: 27, left: 24, right: 24, height: 3, background: "rgba(255,255,255,.12)", borderRadius: 2 }}>
        <div style={{
          height: "100%", background: T.orange, borderRadius: 2,
          width: `${Math.min(step / (stages.length - 1) * 100, 100)}%`,
          transition: "width .5s ease",
          boxShadow: `0 0 8px ${T.orange}80`,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${100 / stages.length}%` }}>
            <div style={{
              width: 54, height: 54, borderRadius: "50%",
              background: step >= i ? s.color : "rgba(255,255,255,.1)",
              border: `2.5px solid ${step >= i ? s.color : "rgba(255,255,255,.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 10,
              transition: "all .4s ease",
              boxShadow: step >= i ? `0 0 16px ${s.color}60` : "none",
            }}>
              {step >= i ? (
                <div style={{ width: 22, color: "#fff" }}>{Ic.chk}</div>
              ) : (
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "rgba(255,255,255,.4)", fontWeight: 500 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
              )}
            </div>
            <div style={{
              textAlign: "center",
              opacity: step >= i ? 1 : .4,
              transition: "opacity .4s ease",
            }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "11px", fontWeight: 700, color: "#fff", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "8px", color: "rgba(255,255,255,.5)" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RISK GAUGE ────────────────────────────────────────────────
function Gauge({ value, color }) {
  const r = 32, circ = 2 * Math.PI * r;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} stroke={`${color}20`} strokeWidth="7" fill="none" />
      <circle cx="40" cy="40" r={r} stroke={color} strokeWidth="7" fill="none"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset .8s ease", animation: "fadeIn .4s ease both" }}
      />
      <text x="40" y="44" textAnchor="middle" fontFamily="Syne" fontWeight="800" fontSize="16" fill={color}>{value}</text>
    </svg>
  );
}

// ── LABEL ─────────────────────────────────────────────────────
function Lbl({ children, color = T.orange, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 24, height: 2, background: color, borderRadius: 1 }} />
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color, letterSpacing: ".16em", fontWeight: 500 }}>
        {children}
      </span>
    </div>
  );
}

// ── DOTS NAV ──────────────────────────────────────────────────
function Dots({ cur, total, onGo, dark }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 200 }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onGo(i)} style={{
          width: i === cur ? 22 : 7, height: 7, borderRadius: 4,
          background: i === cur ? T.orange : (dark ? "rgba(255,255,255,.3)" : T.line),
          border: "none", cursor: "pointer", padding: 0,
          transition: "all .3s ease",
        }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 0 — ENTRY
// ═══════════════════════════════════════════════════════════════
function Entry({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1900);
    const t3 = setTimeout(() => setPhase(3), 3300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const handleClick = () => {
    if (phase < 2) return;
    setExplode(true);
    setTimeout(onEnter, 700);
  };

  return (
    <div onClick={handleClick} style={{
      position: "fixed", inset: 0, background: T.white,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: phase >= 2 ? "pointer" : "default", overflow: "hidden",
    }}>
      <ParticleCanvas explode={explode} />

      {/* Orange top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, height: 4,
        background: `linear-gradient(90deg, ${T.orange}, #FB923C)`,
        width: phase >= 1 ? "100%" : "0%",
        transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
        boxShadow: `0 0 12px ${T.orange}60`,
      }} />

      {/* Statement */}
      <div style={{ maxWidth: 680, textAlign: "center", padding: "0 40px", position: "relative", zIndex: 1 }}>
        <h1 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(36px,5.5vw,76px)",
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: "-0.025em", color: T.navy,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(28px)",
          transition: "opacity .9s ease .2s, transform .9s ease .2s",
          marginBottom: 8,
        }}>
          I spent my first weeks<br />asking <span style={{ color: T.orange }}>questions.</span>
        </h1>
        <h1 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(36px,5.5vw,76px)",
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: "-0.025em", color: T.navy,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(28px)",
          transition: "opacity .9s ease, transform .9s ease",
          marginBottom: 52,
        }}>
          What I found<br /><span style={{ color: T.orange }}>changed everything.</span>
        </h1>

        {/* CTA */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity .6s ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "11px", color: T.navyFade, letterSpacing: ".15em",
            animation: phase >= 3 ? "blink 2s ease infinite" : "none",
          }}>
            CLICK ANYWHERE TO ENTER
          </div>
          <div style={{ width: 16, color: T.orange }}>{Ic.arr}</div>
        </div>
      </div>

      {/* Author */}
      <div style={{
        position: "absolute", bottom: 28,
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: "9px", color: T.navyFade, letterSpacing: ".14em",
        opacity: phase >= 2 ? 1 : 0, transition: "opacity .6s ease 1.2s",
      }}>
        VISHNU PRATAP KUMAR · DELL TECHNOLOGIES SCA
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 1 — DISCOVERY (warm white, chaos network)
// ═══════════════════════════════════════════════════════════════
function Discovery() {
  return (
    <div style={{ minHeight: "100vh", background: T.cream, display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 80px 80px" }}>
      <div className="fu1"><Lbl>BEFORE ANYTHING WAS BUILT</Lbl></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        {/* Left: headline + discoveries */}
        <div>
          <div className="fu2">
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3vw,46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.02em", marginBottom: 32 }}>
              Nobody knew what<br />Dell had,{" "}
              <span style={{ color: T.orange }}>who was using it,</span>{" "}
              or what risk it created.
            </h1>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { num: "01", color: T.red,    title: "Everything was everywhere",       body: "4–5 people to get one answer. No single owner. Pure chaos." },
              { num: "02", color: T.amber,  title: "Nobody knew the next step",       body: "Zero visibility. The process existed only in people's heads." },
              { num: "03", color: T.blue,   title: "Compliance was invisible",        body: "Most didn't know if their software was even licensed. Risk grew silently." },
              { num: "04", color: T.orange, title: "A tech giant running manually",   body: "Dell — a technology company — run on manual processes and week-long delays." },
            ].map((d, i) => (
              <div key={i} className={`fu${i + 3}`} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: `${d.color}18`, border: `1.5px solid ${d.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: d.color, fontWeight: 600,
                }}>
                  {d.num}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700, color: T.navy, marginBottom: 3 }}>{d.title}</div>
                  <div style={{ fontSize: "12px", color: T.navyFade, lineHeight: 1.65 }}>{d.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: chaos network */}
        <div className="fu3 su" style={{
          background: T.white, border: `1.5px solid ${T.line}`,
          borderRadius: 16, padding: "28px 24px",
          boxShadow: "0 8px 32px rgba(0,0,0,.06)",
        }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.red, letterSpacing: ".14em", marginBottom: 12, textAlign: "center" }}>
            THE REAL STATE — ANIMATED
          </div>
          <ChaosNetwork />
          <div style={{
            marginTop: 16, padding: "10px 14px",
            background: T.redLt, borderRadius: 8,
            fontSize: "12px", color: T.red, textAlign: "center", fontStyle: "italic",
          }}>
            Every node is a person. Every line is a broken handoff.
          </div>
        </div>
      </div>

      {/* Pull quote */}
      <div className="fu5" style={{ marginTop: 36, borderLeft: `4px solid ${T.orange}`, paddingLeft: 20 }}>
        <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "17px", fontWeight: 600, fontStyle: "italic", color: T.navySoft }}>
          "The problem was not missing technology. It was missing clarity."
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 2 — PROGRAM (clean white, merge animation)
// ═══════════════════════════════════════════════════════════════
function Program() {
  const [merged, setMerged] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMerged(true), 1200); return () => clearTimeout(t); }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.white, display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 80px 80px" }}>
      <div className="fu1"><Lbl>THE PROGRAM</Lbl></div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 56, alignItems: "center" }}>
        {/* Left */}
        <div>
          <div className="fu2">
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3vw,48px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 32 }}>
              Three workstreams<br />nobody connected.{" "}
              <span style={{ color: T.orange }}>One program</span>{" "}
              that became the CIO initiative.
            </h1>
          </div>

          {/* Three workstream rows */}
          <div className="fu3" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {[
              { color: T.blue,  icon: Ic.db,   label: "Software Catalog",       meta: "AI search · 365K assets · RAG/LLM" },
              { color: T.red,   icon: Ic.shld, label: "Compliance Agent",        meta: "Silent removal · 98K endpoints · First of its kind" },
              { color: T.green, icon: Ic.rkt,  label: "Deployment Automation",  meta: "Camunda workflow · 5K+ requests · 45d → 15min" },
            ].map((w, i) => (
              <div key={i} className="card" style={{
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                borderLeft: `4px solid ${w.color}`,
                animation: `fadeLeft .5s ease ${.1 + i * .15}s both`,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${w.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 20, color: w.color }}>{w.icon}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700 }}>{w.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, marginTop: 2 }}>{w.meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="fu4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { val: "100K+", label: "Users reached",        color: T.blue   },
              { val: "70%",   label: "Cycle time reduced",   color: T.green  },
              { val: "4 yrs", label: "Zero escalations",     color: T.orange },
              { val: "20K",   label: "Monthly active users", color: T.navy   },
            ].map((m, i) => (
              <div key={i} className="card" style={{ padding: "16px 18px" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "30px", fontWeight: 800, color: m.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{m.val}</div>
                <div style={{ fontSize: "11px", color: T.navyFade, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: merge animation */}
        <div className="fu3 su">
          <div style={{ background: T.lineSoft, border: `1.5px solid ${T.line}`, borderRadius: 16, padding: "28px", textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, letterSpacing: ".14em", marginBottom: 16 }}>
              {merged ? "ALIGNED INTO ONE" : "THREE SEPARATE STREAMS"}
            </div>
            <MergeViz merged={merged} />
            <div style={{ marginTop: 16, fontSize: "12px", color: T.navySoft, fontStyle: "italic", lineHeight: 1.6 }}>
              {merged
                ? "ServiceNow took 3 quarters to replicate what was already built."
                : "Each workstream was drifting. No connection. No shared outcome."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 3 — AGENT (dark navy, circuit animation)
// ═══════════════════════════════════════════════════════════════
function Agent() {
  const [step, setStep] = useState(-1);
  const [crisis, setCrisis] = useState(false);
  useEffect(() => {
    const intervals = [0, 600, 1200, 1800, 2400].map((delay, i) =>
      setTimeout(() => setStep(i), delay + 400)
    );
    const t = setTimeout(() => setCrisis(true), 3200);
    return () => { intervals.forEach(clearTimeout); clearTimeout(t); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.navy, display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 80px 80px" }}>
      <div className="fu1"><Lbl color={T.orange}>RISK INTELLIGENCE — BUILT FROM ZERO</Lbl></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
        {/* Left */}
        <div>
          <div className="fu2">
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,2.8vw,44px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.white, marginBottom: 16 }}>
              First of its kind.<br />
              <span style={{ color: T.orange }}>No precedent.<br />No team.</span><br />
              Just a process that worked.
            </h1>
          </div>
          <div className="fu3" style={{ fontSize: "14px", color: "rgba(255,255,255,.6)", lineHeight: 1.75, marginBottom: 32 }}>
            An AI agent that silently detected and removed unauthorized software from Dell Windows devices. 5-stage governance — designed from scratch.
          </div>

          {/* Metrics */}
          <div className="fu4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { val: "95%+", label: "Removal efficiency", color: T.green  },
              { val: "98K",  label: "Global endpoints",   color: T.blue   },
              { val: "100K+",label: "Removals done",      color: T.orange },
              { val: "< 2d", label: "Crisis resolved",    color: "#FBBF24"},
            ].map((m, i) => (
              <div key={i} style={{
                padding: "16px 18px", borderRadius: 10,
                background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.1)",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "28px", fontWeight: 800, color: m.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{m.val}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,.4)", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Crisis */}
          <div className="fu5" style={{
            padding: "16px 18px", borderRadius: 10,
            background: crisis ? `${T.red}18` : "rgba(255,255,255,.04)",
            border: `1.5px solid ${crisis ? T.red + "50" : "rgba(255,255,255,.1)"}`,
            borderLeft: `4px solid ${crisis ? T.red : "rgba(255,255,255,.1)"}`,
            transition: "all .5s ease",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: crisis ? T.red : "rgba(255,255,255,.3)", letterSpacing: ".14em", marginBottom: 8, transition: "color .5s" }}>
              POST-LAUNCH CRISIS {crisis ? "— RESOLVED < 2 DAYS" : ""}
            </div>
            {crisis && (
              <>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.7)", lineHeight: 1.6, marginBottom: 10, animation: "fadeIn .4s ease" }}>
                  Silent removal triggered auto-restarts across all 98K devices. Three simultaneous tracks:
                </div>
                {[
                  ["Engineering", "Root cause in hours — not days"],
                  ["Leadership",  "VP updated every 4 hours"],
                  ["Users",       "Communication out within 1 hour"],
                ].map(([who, what], i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, animation: `fadeUp .4s ease ${i * .1}s both` }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: 10, color: "#fff" }}>{Ic.chk}</div>
                    </div>
                    <div><span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono',monospace", color: T.green }}>{who} — </span><span style={{ fontSize: "12px", color: "rgba(255,255,255,.6)" }}>{what}</span></div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right: circuit */}
        <div className="fu3 su" style={{ paddingTop: 8 }}>
          <div style={{ background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: "rgba(255,255,255,.35)", letterSpacing: ".14em", marginBottom: 24 }}>
              GOVERNANCE — DESIGNED FROM SCRATCH
            </div>
            <Circuit step={step} />
            <div style={{ marginTop: 28, padding: "14px 16px", background: "rgba(249,115,22,.1)", border: `1.5px solid ${T.orange}30`, borderRadius: 8 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.orange, marginBottom: 6, letterSpacing: ".12em" }}>THE PARALLEL</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", lineHeight: 1.65, fontStyle: "italic" }}>
                Detect signal → govern the response → act at scale → measure outcome. This is the same architecture supplier risk monitoring needs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 4 — VISION (bright white, live dashboard)
// ═══════════════════════════════════════════════════════════════
const SUPPLIERS = [
  { name: "Supplier Alpha",   country: "Taiwan",   tier: "T1", cat: "Semiconductors", score: 87, status: "high",   signal: "Credit downgraded Q1 2026",          action: "Schedule exec review",         trend: "↑" },
  { name: "Supplier Beta",    country: "Malaysia", tier: "T2", cat: "PCB Assembly",    score: 52, status: "medium", signal: "Delivery SLA declining 3 months",    action: "Monitor monthly — flag if <90%",trend: "↓" },
  { name: "Supplier Gamma",   country: "China",    tier: "T1", cat: "Display Panels",  score: 91, status: "high",   signal: "Single source — no alternate",       action: "Qualify alternate by Q3",       trend: "↑" },
  { name: "Supplier Delta",   country: "Mexico",   tier: "T1", cat: "Logistics",       score: 21, status: "low",    signal: "All SLAs met — no adverse signals",  action: "Routine quarterly review",      trend: "→" },
  { name: "Supplier Epsilon", country: "India",    tier: "T2", cat: "Cable Assembly",  score: 44, status: "medium", signal: "RBA audit overdue 6 weeks",          action: "Confirm audit date this week",  trend: "→" },
];
const SC = {
  high:   { bg: T.redLt,   color: T.red,   border: `${T.red}30`   },
  medium: { bg: T.amberLt, color: T.amber, border: `${T.amber}30` },
  low:    { bg: T.greenLt, color: T.green, border: `${T.green}30` },
};

function Vision() {
  const [active, setActive] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: T.white, display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 80px 80px" }}>
      <div className="fu1" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Lbl color={T.green}>ILLUSTRATIVE · DUMMY DATA</Lbl>
        <span className="tag" style={{ background: T.greenLt, color: T.green, border: `1px solid ${T.green}30` }}>PROACTIVE RISK MONITORING</span>
      </div>

      <div className="fu2" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(22px,2.8vw,42px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          What proactive risk monitoring looks like{" "}
          <span style={{ color: T.green }}>when it's built for the person who has to act.</span>
        </h1>
      </div>

      {/* Summary */}
      <div className="fu3" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { val: "2", label: "High Risk",   note: "↑ 1 vs last week", color: T.red   },
          { val: "2", label: "Medium Risk", note: "unchanged",         color: T.amber },
          { val: "1", label: "Low Risk",    note: "↓ 1 resolved",      color: T.green },
          { val: "3", label: "Actions Due", note: "this week",         color: T.blue  },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "38px", fontWeight: 800, color: s.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.val}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "11px", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, marginTop: 3 }}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="fu4" style={{ background: T.white, border: `1.5px solid ${T.line}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 90px 2fr 2.5fr 100px", gap: 12, padding: "10px 20px", background: T.lineSoft, borderBottom: `1px solid ${T.line}` }}>
          {["SUPPLIER", "TIER", "RISK", "SIGNAL", "ACTION", "STATUS"].map((h, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, letterSpacing: ".1em" }}>{h}</div>
          ))}
        </div>
        {SUPPLIERS.map((s, i) => (
          <div key={i}>
            <div className="srow"
              onClick={() => setActive(active === i ? null : i)}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 90px 2fr 2.5fr 100px", gap: 12, padding: "11px 20px", background: active === i ? T.orangeLt : T.white, borderBottom: i < SUPPLIERS.length - 1 ? `1px solid ${T.lineSoft}` : "none" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, marginTop: 1 }}>{s.country} · {s.cat}</div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: T.navyFade, paddingTop: 2 }}>{s.tier}</div>
              <div>
                <div style={{ height: 3, background: T.lineSoft, borderRadius: 2, marginBottom: 4, width: 56 }}>
                  <div style={{ width: `${s.score}%`, height: "100%", background: SC[s.status].color, borderRadius: 2, transition: "width .6s ease" }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: SC[s.status].color, fontWeight: 600 }}>{s.score} {s.trend}</span>
              </div>
              <div style={{ fontSize: "12px", color: T.navySoft, lineHeight: 1.4 }}>{s.signal}</div>
              <div style={{ fontSize: "12px", color: T.navyFade, fontStyle: "italic", lineHeight: 1.4 }}>{s.action}</div>
              <span className="pill" style={{ background: SC[s.status].bg, color: SC[s.status].color, border: `1px solid ${SC[s.status].border}`, alignSelf: "center" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: SC[s.status].color, display: "inline-block" }} />
                {s.status}
              </span>
            </div>
            {active === i && (
              <div style={{ background: T.orangeLt, padding: "14px 20px 16px", borderBottom: `1px solid ${T.line}`, animation: "fadeUp .2s ease both", display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 20, alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, marginBottom: 4 }}>RISK SIGNAL</div>
                  <div style={{ fontSize: "13px", color: SC[s.status].color, fontWeight: 500 }}>{s.signal}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.navyFade, marginBottom: 4 }}>ACTION</div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{s.action}</div>
                </div>
                <Gauge value={s.score} color={SC[s.status].color} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Principles */}
      <div className="fu5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: T.greenLt, border: `1.5px solid ${T.green}25`, borderRadius: 10, padding: "16px 20px", borderLeft: `4px solid ${T.green}` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.green, letterSpacing: ".12em", marginBottom: 8 }}>THE PRINCIPLE</div>
          <p style={{ fontSize: "13px", color: T.navySoft, lineHeight: 1.65 }}>Leading indicators, not news articles. Structured signals, not internet noise. Built for the analyst who acts.</p>
        </div>
        <div style={{ background: T.orangeLt, border: `1.5px solid ${T.orange}25`, borderRadius: 10, padding: "16px 20px", borderLeft: `4px solid ${T.orange}` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: T.orange, letterSpacing: ".12em", marginBottom: 8 }}>THE COMMITMENT</div>
          <p style={{ fontSize: "13px", color: T.navySoft, lineHeight: 1.65 }}>I don't describe what I'd build. I build a version of it. This took an afternoon. The real one starts with SCA's data.</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
const SCREENS = [Discovery, Program, Agent, Vision];

export default function App() {
  const [entered, setEntered] = useState(false);
  const [idx, setIdx] = useState(0);
  const go = (i) => { if (i >= 0 && i < SCREENS.length) setIdx(i); };
  const Screen = SCREENS[idx];

  return (
    <>
      <style>{CSS}</style>
      {!entered ? (
        <Entry onEnter={() => setEntered(true)} />
      ) : (
        <>
          {/* Progress bar */}
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: T.lineSoft, zIndex: 300 }}>
            <div style={{ height: "100%", background: T.orange, width: `${((idx + 1) / SCREENS.length) * 100}%`, transition: "width .4s ease", boxShadow: `0 0 8px ${T.orange}60` }} />
          </div>

          {/* Nav arrows */}
          {idx > 0 && (
            <button className="nav-btn" onClick={() => go(idx - 1)} style={{ left: 16, color: T.navyFade }}>
              <div style={{ width: 18 }}>{Ic.arrL}</div>
            </button>
          )}
          {idx < SCREENS.length - 1 && (
            <button className="nav-btn" onClick={() => go(idx + 1)} style={{ right: 16, color: T.navyFade }}>
              <div style={{ width: 18 }}>{Ic.arr}</div>
            </button>
          )}

          {/* Dots */}
          <Dots cur={idx} total={SCREENS.length} onGo={go} dark={idx === 2} />

          {/* Screen */}
          <div className="screen" key={idx}><Screen /></div>
        </>
      )}
    </>
  );
}
