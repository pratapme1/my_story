import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import { KnowledgeGraph, ProofConstellation, BuildHubDiagram, WorkstreamSignal } from './components/SVGs';

// ── TOKENS ────────────────────────────────────────────────────────
const T = {
  gold:  "#C9A96E", goldA: "rgba(201,169,110,.12)",
  cream: "#EDE9E0",
  muted: "rgba(237,233,224,.58)",
  faint: "rgba(237,233,224,.12)",
  ghost: "rgba(237,233,224,.05)",
  blue:  "#60A5FA",
  green: "#34D399",
  red:   "#F87171",
  amber: "#FCD34D",
  line:  "rgba(237,233,224,.09)",
};

// ── CSS ───────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,300;1,700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html,body,#root { height:100%; overflow:hidden; }
body { background:#000; color:#EDE9E0; font-family:system-ui,sans-serif; -webkit-font-smoothing:antialiased; }

.serif { font-family:'Cormorant Garamond',serif; }
.mono  { font-family:'IBM Plex Mono',monospace; }

.lbl {
  font-family:'IBM Plex Mono',monospace;
  font-size:clamp(7.5px,.85vw,10px); letter-spacing:.2em; text-transform:uppercase;
  color:rgba(237,233,224,.34);
}
.gold-lbl {
  font-family:'IBM Plex Mono',monospace; font-size:clamp(7.5px,.85vw,9.5px);
  letter-spacing:.22em; text-transform:uppercase; color:#C9A96E;
  display:flex; align-items:center; gap:8px; margin-bottom:10px;
}
.gold-lbl::before {
  content:''; width:4px; height:4px; border-radius:50%;
  background:#C9A96E; display:inline-block; flex-shrink:0;
}

/* Cinematic letterbox */
.lb { position:fixed; left:0; right:0; height:36px; background:#000; z-index:1000; pointer-events:none; }
.lb-t { top:0; }
.lb-b { bottom:0; }

/* Film grain */
.grain {
  position:fixed; inset:0; pointer-events:none; z-index:999; opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px 180px; mix-blend-mode:overlay;
}

/* Scene wrappers */
.scene {
  position:fixed; inset:36px 0; overflow:hidden;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.scene-scroll {
  position:fixed; inset:36px 0; overflow-y:auto; overflow-x:hidden;
  display:flex; flex-direction:column; align-items:center;
}

/* Content constraint — prevents stretching on large displays */
.inner {
  width:100%; max-width:min(1340px,100%);
  margin:0 auto;
  padding:clamp(16px,3vh,40px) clamp(20px,3.5vw,48px);
}

/* Responsive grids */
.grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(12px,1.6vw,18px); }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:clamp(12px,1.8vw,16px); }

@media (max-width:960px)  { .grid-3 { grid-template-columns:1fr 1fr; } }
@media (max-width:640px)  { .grid-3,.grid-2 { grid-template-columns:1fr; } }

/* SCA mapping table */
.sca-row {
  display:grid;
  grid-template-columns:clamp(130px,16%,190px) 1fr clamp(110px,14%,150px);
  gap:clamp(10px,1.5vw,18px);
  align-items:start;
}
@media (max-width:860px) {
  .sca-row { grid-template-columns:clamp(110px,16%,160px) 1fr; }
  .sca-impact { display:none; }
}

/* Glass card */
.card {
  background:rgba(6,6,10,.84); backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  border:1px solid rgba(237,233,224,.1); border-radius:8px;
  padding:clamp(14px,1.8vw,22px); position:relative; overflow:hidden;
  box-shadow:0 16px 40px rgba(0,0,0,.55);
  transition:opacity .45s ease, transform .45s ease;
}

@keyframes fade    { from{opacity:0} to{opacity:1} }
@keyframes rise    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes growX   { from{width:0} to{width:100%} }
@keyframes scaleIn { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes drawPth { to{stroke-dashoffset:0} }
@keyframes nodeIn  { from{opacity:0;transform:scale(.6)} to{opacity:1;transform:scale(1)} }
@keyframes pulseGlow { 0%,100%{opacity:.4} 50%{opacity:.85} }
@keyframes ringPulse { 0%,100%{box-shadow:0 0 20px rgba(201,169,110,.14),inset 0 0 16px rgba(201,169,110,.04)} 50%{box-shadow:0 0 44px rgba(201,169,110,.32),inset 0 0 24px rgba(201,169,110,.08)} }

.play-btn {
  width:72px; height:72px; border-radius:50%;
  border:1px solid rgba(201,169,110,.38);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:border-color .3s ease, transform .25s ease;
  animation:ringPulse 2.8s ease 0.5s infinite;
}
.play-btn:hover { border-color:rgba(201,169,110,.85); transform:scale(1.08); }
`;

// ── DECK METADATA ─────────────────────────────────────────────────
const MY_STORY_META = [
  { bg:'/bg-cinematic-open.png',  scrim:'linear-gradient(160deg,rgba(0,0,0,.5) 0%,rgba(8,5,2,.78) 100%)',         label:'OPEN'   },
  { bg:'/bg-story-search.png',    scrim:'linear-gradient(160deg,rgba(75,40,5,.26) 0%,rgba(0,0,0,.84) 100%)',       label:'SEARCH' },
  { bg:'/bg-story-prove.png',     scrim:'linear-gradient(160deg,rgba(15,35,90,.26) 0%,rgba(0,0,0,.86) 100%)',      label:'PROVE'  },
  { bg:'/bg-cinematic-build.png', scrim:'linear-gradient(160deg,rgba(5,12,70,.3) 0%,rgba(0,0,0,.84) 100%)',        label:'BUILD'  },
  { bg:'/bg-story-dash.png',      scrim:'linear-gradient(160deg,rgba(0,14,32,.42) 0%,rgba(0,0,0,.92) 100%)',       label:'SCA'    },
  { bg:'/bg-cinematic-open.png',  scrim:'linear-gradient(160deg,rgba(0,0,0,.62) 0%,rgba(8,5,2,.92) 100%)',         label:'END'    },
];

const SALES_GENIE_META = [
  { bg:'/bg-cinematic-open.png',  scrim:'linear-gradient(160deg,rgba(0,0,0,.52) 0%,rgba(8,5,2,.82) 100%)',         label:'OPEN'   },
  { bg:'/bg-story-search.png',    scrim:'linear-gradient(160deg,rgba(75,40,5,.2) 0%,rgba(0,0,0,.86) 100%)',        label:'SEARCH' },
  { bg:'/bg-story-prove.png',     scrim:'linear-gradient(160deg,rgba(15,35,90,.24) 0%,rgba(0,0,0,.88) 100%)',      label:'PROVE'  },
  { bg:'/bg-cinematic-build.png', scrim:'linear-gradient(160deg,rgba(5,46,34,.28) 0%,rgba(0,0,0,.88) 100%)',       label:'BUILD'  },
  { bg:'/bg-cinematic-open.png',  scrim:'linear-gradient(160deg,rgba(0,0,0,.62) 0%,rgba(8,5,2,.92) 100%)',         label:'END'    },
];

// ── PARTICLE ATMOSPHERE ───────────────────────────────────────────
function ParticleAtmosphere() {
  const count = 1000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i*3]   = (Math.random()-.5)*60;
      p[i*3+1] = (Math.random()-.5)*60;
      p[i*3+2] = (Math.random()-.5)*40;
    }
    return p;
  }, []);
  const ref = useRef();
  useFrame(s => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.013;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.007) * 0.05;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#EDE9E0" transparent opacity={0.3} sizeAttenuation/>
    </points>
  );
}

// ── FRAMER VARIANTS ───────────────────────────────────────────────
const stagger = {
  hidden:  { opacity:0 },
  visible: { opacity:1, transition:{ staggerChildren:.13, delayChildren:.05 } },
};
const fadeUp = {
  hidden:  { opacity:0, y:18 },
  visible: { opacity:1, y:0, transition:{ duration:.72, ease:[.22,1,.36,1] } },
};

// ── SCENE 1 — OPEN ────────────────────────────────────────────────
// "This is how I work." leads — then SEARCH / PROVE / BUILD reveal below it.
function SceneOpen({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),   // hook line
      setTimeout(() => setPh(2), 1000),  // separator
      setTimeout(() => setPh(3), 1700),  // SEARCH.
      setTimeout(() => setPh(4), 2350),  // PROVE.
      setTimeout(() => setPh(5), 3050),  // BUILD.
      setTimeout(() => setPh(6), 3900),  // → prompt
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const slide = (active) => ({
    display:'block',
    transform: active ? 'translateY(0)' : 'translateY(110%)',
    transition:'transform .82s cubic-bezier(.22,1,.36,1)',
  });

  return (
    <div className="scene" onClick={ph >= 5 ? onNext : undefined}
      style={{ cursor: ph >= 5 ? 'pointer' : 'default' }}>
      <div style={{ maxWidth: 'min(840px,100%)', width:'100%', padding:'0 clamp(24px,5vw,72px)', position:'relative', zIndex:5 }}>

        {/* Hook — "This is how I work." leads the narrative */}
        <div style={{
          overflow:'hidden', marginBottom: ph >= 2 ? 20 : 0,
          opacity: ph >= 1 ? 1 : 0, transition:'opacity .6s ease',
        }}>
          <div className="serif" style={{
            fontSize:'clamp(28px,4.2vw,58px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.25,
            animation: ph >= 1 ? 'rise .75s ease both' : 'none',
          }}>
            This is how I work.
          </div>
        </div>

        {/* Separator */}
        {ph >= 2 && (
          <div style={{
            height:1,
            background:`linear-gradient(to right,${T.gold},transparent)`,
            marginBottom:28,
            animation:'growX .7s cubic-bezier(.22,1,.36,1) both',
          }}/>
        )}

        {/* SEARCH / PROVE / BUILD — mask reveal per word */}
        <div className="serif" style={{
          fontSize:'clamp(52px,8vw,114px)', fontWeight:700,
          letterSpacing:'.03em', lineHeight:1.04, marginBottom:40,
        }}>
          {[
            { w:'SEARCH.', p:3, col:T.cream },
            { w:'PROVE.',  p:4, col:T.cream },
            { w:'BUILD.',  p:5, col:T.gold  },
          ].map(({w,p,col}) => (
            <div key={w} style={{ overflow:'hidden', display:'block' }}>
              <div style={{ color:col, ...slide(ph >= p) }}>{w}</div>
            </div>
          ))}
        </div>

        {ph >= 6 && (
          <div style={{ display:'flex', justifyContent:'flex-end', animation:'fade 1s ease both' }}>
            <div className="gold-lbl" style={{ cursor:'pointer' }}>CLICK → TO CONTINUE</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SCENE 2 — SEARCH ──────────────────────────────────────────────
function SceneSearch({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 350),
      setTimeout(() => setPh(2), 1000),
      setTimeout(() => setPh(3), 2800),
      setTimeout(() => setPh(4), 4800),
      setTimeout(() => setPh(5), 6600),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);
  const handle = () => ph >= 5 ? onNext() : setPh(p => Math.min(p+1,5));

  return (
    <div className="scene" onClick={handle}>
      <div className="inner" style={{ padding:'clamp(12px,2vh,32px) clamp(20px,3.5vw,48px)' }}>
        {ph >= 1 && (
          <div style={{ marginBottom:10, animation:'rise .5s ease both' }}>
            <div className="gold-lbl">01 // SEARCH · DISCOVERY</div>
            <div className="serif" style={{
              fontSize:'clamp(18px,2.4vw,32px)', fontWeight:300, fontStyle:'italic',
              color:T.cream, lineHeight:1.2,
            }}>
              I find what's broken before anyone tells me to look.
            </div>
          </div>
        )}
        <KnowledgeGraph phase={ph}/>
        <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}55,transparent)` }}/>
          <div className="lbl">{ph >= 5 ? 'CLICK FOR NEXT →' : 'CLICK TO REVEAL MORE →'}</div>
        </div>
      </div>
    </div>
  );
}

// ── SCENE 3 — PROVE ───────────────────────────────────────────────
function SceneProve({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 250),
      setTimeout(() => setPh(2), 900),
      setTimeout(() => setPh(3), 1700),
      setTimeout(() => setPh(4), 2500),
      setTimeout(() => setPh(5), 3300),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const items = [
    { tag:'CATALOG', title:'Live VP demo', detail:'Built the complete Software Catalog from scratch. Demoed it live to the VP. Earned development approval in under 60 days.', color:T.gold, show:ph>=2 },
    { tag:'AUTOMATION', title:'n8n + AI PoC', detail:'Used n8n + LLM to prove software intake could be fully automated. Built it in a weekend. Enterprise rollout approved.', color:T.blue, show:ph>=3 },
    { tag:'COMPLIANCE', title:'Silent removal at scale', detail:'Redesigned the Windows removal agent for server-controlled, silent removal across 100K+ endpoints — plus a Linux PoC.', color:T.green, show:ph>=4 },
  ];

  return (
    <div className="scene" onClick={onNext}>
      <div className="inner">
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ marginBottom:'clamp(16px,2.5vh,28px)' }}>
          <motion.div variants={fadeUp} className="gold-lbl">02 // PROVE · THE INVENTOR</motion.div>
          <motion.div variants={fadeUp} className="serif" style={{
            fontSize:'clamp(24px,3.6vw,50px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.12,
          }}>
            I don't ask for belief.<br/>I put proof on the table.
          </motion.div>
        </motion.div>

        <div className="grid-2" style={{ alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'clamp(10px,1.4vh,14px)' }}>
            {items.map((item, i) => (
              <div key={i} className="card" style={{
                opacity: item.show ? 1 : 0,
                transform: item.show ? 'translateX(0)' : 'translateX(-16px)',
                borderLeft:`4px solid ${item.color}`,
              }}>
                <div className="lbl" style={{ color:item.color, marginBottom:7 }}>{item.tag}</div>
                <div className="serif" style={{ fontSize:'clamp(16px,1.7vw,21px)', fontWeight:700, color:T.cream, marginBottom:8, lineHeight:1.2 }}>{item.title}</div>
                <div style={{ fontSize:'clamp(11px,1.2vw,13px)', color:T.muted, lineHeight:1.7 }}>{item.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ProofConstellation phase={ph}/>
          </div>
        </div>

        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:16, animation:'fade .6s ease both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>
      </div>
    </div>
  );
}

// ── SCENE 4 — BUILD ───────────────────────────────────────────────
function SceneBuild({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 400),
      setTimeout(() => setPh(2), 1200),
      setTimeout(() => setPh(3), 2000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const streams = [
    { title:'Software Catalog', kicker:'employee experience', color:T.gold,
      body:'One landing place for employees, SAM, owners, admins, and approvers.',
      metrics:[['3K→200','incidents'],['4K','approvals'],['14s→3s','search']] },
    { title:'Deploy Automation', kicker:'intake to deployment', color:T.blue,
      body:'Rebuilt intake from email into tracked workflow, then pushed full automation.',
      metrics:[['45d→1d','cycle time'],['70%','automated'],['n8n+AI','engine']] },
    { title:'Removal Agent', kicker:'compliance at scale', color:T.green,
      body:'Server-controlled silent removals. Windows and Linux. 98K global endpoints.',
      metrics:[['200K+','removed'],['98K','endpoints'],['3K+','titles']] },
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">
        <motion.div initial="hidden" animate="visible" variants={stagger}
          style={{ marginBottom:'clamp(16px,2.5vh,28px)', textAlign:'center' }}>
          <motion.div variants={fadeUp} className="gold-lbl" style={{ justifyContent:'center' }}>03 // BUILD · THE ARCHITECT</motion.div>
          <motion.div variants={fadeUp} className="serif" style={{
            fontSize:'clamp(24px,3.5vw,50px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.12,
          }}>
            Three parallel workstreams.<br/>Executed simultaneously.
          </motion.div>
        </motion.div>

        <div className="grid-3" style={{ marginBottom:'clamp(12px,1.8vh,18px)' }}>
          {streams.map((w, i) => (
            <div key={w.title} className="card" style={{
              borderTop:`4px solid ${w.color}`,
              opacity: ph >= i+1 ? 1 : 0,
              transform: ph >= i+1 ? 'translateY(0)' : 'translateY(18px)',
            }}>
              <div className="lbl" style={{ color:w.color, marginBottom:8 }}>{w.kicker}</div>
              <div className="serif" style={{ fontSize:'clamp(16px,1.8vw,22px)', fontWeight:700, lineHeight:1.1, marginBottom:10, color:T.cream }}>{w.title}</div>
              <WorkstreamSignal color={w.color}/>
              <p style={{ fontSize:'clamp(11px,1.2vw,13px)', color:T.muted, lineHeight:1.65, marginBottom:14, minHeight:44 }}>{w.body}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {w.metrics.map(([val, label]) => (
                  <div key={label}>
                    <div className="serif" style={{ fontSize:'clamp(13px,1.4vw,17px)', color:w.color, fontWeight:700, lineHeight:1 }}>{val}</div>
                    <div className="lbl" style={{ fontSize:7.5, marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ animation:'rise .6s ease .3s both' }}>
          <div className="grid-2" style={{ alignItems:'center' }}>
            <div>
              <div className="gold-lbl" style={{ marginBottom:10 }}>MY USP · END-TO-END OWNERSHIP</div>
              <div className="serif" style={{ fontSize:'clamp(18px,2.2vw,28px)', lineHeight:1.15, color:T.cream, fontWeight:700, marginBottom:12 }}>
                Single point of contact across VP, engineering, security, and operations.
              </div>
              <p style={{ fontSize:'clamp(11px,1.3vw,13.5px)', color:T.muted, lineHeight:1.65 }}>
                Drove prioritization, vision, issue fixes, approvals and delivery rhythm — including the critical search latency fix from 14 seconds to 3 seconds.
              </p>
            </div>
            <BuildHubDiagram phase={ph}/>
          </div>
        </div>

        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>
      </div>
    </div>
  );
}

// ── SCENE 5 — FIRST 90 DAYS ───────────────────────────────────────
// The closing argument: not a credentials recap — a concrete commitment.
// Three phases mirror the SEARCH → PROVE → BUILD arc shown in slides 2–4.
function SceneSCA() {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),
      setTimeout(() => setPh(2), 900),
      setTimeout(() => setPh(3), 1600),
      setTimeout(() => setPh(4), 2400),
      setTimeout(() => setPh(5), 3300),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const phases = [
    {
      num:'01', time:'Week 1 – 2', theme:'SEARCH', color:T.gold,
      title:'Listen before\nI touch anything.',
      bullets:[
        'Shadow every stakeholder — VP, engineering, security, ops',
        'Map all open gaps, fires, and pending blockers',
        'Understand the full SCA platform state end-to-end',
        'No opinions yet. Only observations and questions.',
      ],
      deliverable:'Gap map · stakeholder landscape · one priority hypothesis',
    },
    {
      num:'02', time:'Month 1', theme:'PROVE', color:T.blue,
      title:'Own one hard\nproblem. Ship it.',
      bullets:[
        'Pick the highest-impact open issue — data-backed',
        'Build a working fix, not a deck describing one',
        'Show it to stakeholders before asking for anything',
        'Use the proof to earn the next level of scope',
      ],
      deliverable:'One visible improvement live in production',
    },
    {
      num:'03', time:'Month 2 – 3', theme:'BUILD', color:T.green,
      title:'First platform\nproof point.',
      bullets:[
        'Deliver the first real SCA platform improvement',
        'Establish cross-functional delivery rhythm',
        'Align VP and engineering on a 6-month roadmap',
        'Measure the delta — show what changed and why',
      ],
      deliverable:'Shipped feature · aligned 6-month roadmap',
    },
  ];

  return (
    <div className="scene" style={{ cursor:'default' }}>
      <div className="inner">

        {/* Demo link */}
        <div className="card" style={{
          background:'rgba(201,169,110,.08)',
          border:'1px solid rgba(201,169,110,.3)',
          marginBottom:'clamp(14px,2vh,20px)',
          textAlign:'center',
        }}>
          <a
            href="https://sca-dashboard.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily:'IBM Plex Mono,monospace',
              fontSize:'clamp(9px,1vw,12px)',
              letterSpacing:'.18em',
              textTransform:'uppercase',
              color:T.gold,
              textDecoration:'none',
            }}
          >
            👉 LIVE DEMO: sca-dashboard.vercel.app
          </a>
        </div>

        {/* Header */}
        {ph >= 1 && (
          <div style={{ marginBottom:'clamp(16px,2.5vh,26px)', animation:'rise .6s ease both' }}>
            <div className="gold-lbl">04 // FOR · DELL SCA TPM</div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div className="serif" style={{
                fontSize:'clamp(26px,3.8vw,52px)', fontWeight:300, fontStyle:'italic',
                color:T.cream, lineHeight:1.1,
              }}>
                First 90 days.<br/><span style={{ color:T.gold }}>Applied. Not promised.</span>
              </div>
              <div className="lbl" style={{ lineHeight:1.9, textAlign:'right' }}>
                SEARCH → PROVE → BUILD<br/>same method. new context.
              </div>
            </div>
          </div>
        )}

        {/* Three phase cards */}
        <div className="grid-3" style={{ marginBottom:'clamp(12px,1.8vh,16px)' }}>
          {phases.map((p, i) => (
            <div key={i} className="card" style={{
              borderTop:`4px solid ${p.color}`,
              opacity: ph >= i+2 ? 1 : 0,
              transform: ph >= i+2 ? 'translateY(0)' : 'translateY(18px)',
            }}>
              {/* Ghost number */}
              <div className="serif" style={{
                position:'absolute', right:4, top:-10,
                fontSize:80, fontWeight:700, color:'rgba(237,233,224,.04)',
                lineHeight:1, userSelect:'none', pointerEvents:'none',
              }}>{p.num}</div>

              {/* Theme + timeframe */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div className="lbl" style={{ color:p.color }}>{p.theme}</div>
                <div className="mono" style={{ fontSize:'clamp(7.5px,.85vw,9px)', color:'rgba(237,233,224,.32)' }}>{p.time}</div>
              </div>

              {/* Title */}
              <div className="serif" style={{
                fontSize:'clamp(17px,1.9vw,23px)', fontWeight:700, color:T.cream,
                lineHeight:1.22, marginBottom:14, whiteSpace:'pre-line',
              }}>{p.title}</div>

              {/* Bullets */}
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                {p.bullets.map((b, j) => (
                  <li key={j} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ color:p.color, flexShrink:0, fontSize:8, marginTop:3, lineHeight:1 }}>▸</span>
                    <span style={{ fontSize:'clamp(10.5px,1.15vw,12.5px)', color:T.muted, lineHeight:1.68 }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Deliverable */}
              <div style={{ borderTop:`1px solid ${T.line}`, paddingTop:12, display:'flex', alignItems:'flex-start', gap:8 }}>
                <span style={{ color:p.color, fontSize:8, flexShrink:0, marginTop:2 }}>◆</span>
                <span style={{ fontSize:'clamp(10px,1.1vw,12px)', color:p.color, fontStyle:'italic', lineHeight:1.5 }}>{p.deliverable}</span>
              </div>
            </div>
          ))}
        </div>

        {/* The Ask — closing statement */}
        <div className="card" style={{
          background:`linear-gradient(135deg,rgba(201,169,110,.08),rgba(0,0,0,.5))`,
          borderColor:`rgba(201,169,110,.2)`,
          opacity: ph >= 5 ? 1 : 0, transition:'opacity .5s ease',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div className="serif" style={{
              fontSize:'clamp(17px,2.1vw,26px)', fontStyle:'italic',
              color:T.cream, lineHeight:1.5,
            }}>
              "Give me one hard problem.<br/>
              I'll come back in 30 days with proof."
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, justifyContent:'flex-end' }}>
                {['SEARCH','PROVE','BUILD'].map((w,i) => (
                  <React.Fragment key={w}>
                    {i > 0 && <span style={{ color:'rgba(237,233,224,.22)', fontSize:10 }}>→</span>}
                    <span className="serif" style={{
                      fontSize:'clamp(14px,1.6vw,19px)', fontWeight:700,
                      color: i===2 ? T.gold : T.cream,
                    }}>{w}.</span>
                  </React.Fragment>
                ))}
              </div>
              <div className="lbl" style={{ fontSize:7.5 }}>APPLIED TO SCA · NOT DESCRIBED</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── SALES GENIE — OPEN ────────────────────────────────────────────
function SalesGenieOpen({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),
      setTimeout(() => setPh(2), 1000),
      setTimeout(() => setPh(3), 1700),
      setTimeout(() => setPh(4), 2350),
      setTimeout(() => setPh(5), 3050),
      setTimeout(() => setPh(6), 3900),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const slide = (active) => ({
    display:'block',
    transform: active ? 'translateY(0)' : 'translateY(110%)',
    transition:'transform .82s cubic-bezier(.22,1,.36,1)',
  });

  return (
    <div className="scene" onClick={ph >= 5 ? onNext : undefined}
      style={{ cursor: ph >= 5 ? 'pointer' : 'default' }}>
      <div style={{ maxWidth:'min(920px,100%)', width:'100%', padding:'0 clamp(24px,5vw,72px)', position:'relative', zIndex:5 }}>
        <div style={{
          overflow:'hidden', marginBottom: ph >= 2 ? 20 : 0,
          opacity: ph >= 1 ? 1 : 0, transition:'opacity .6s ease',
        }}>
          <div className="serif" style={{
            fontSize:'clamp(28px,4.2vw,58px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.25,
            animation: ph >= 1 ? 'rise .75s ease both' : 'none',
          }}>
            Sales Genie. Agentic AI for CRM.
          </div>
          <div className="lbl" style={{ marginTop:10 }}>TEAM GENIEX · NEW HORIZONS 2025</div>
        </div>

        {ph >= 2 && (
          <div style={{
            height:1,
            background:`linear-gradient(to right,${T.gold},transparent)`,
            marginBottom:28,
            animation:'growX .7s cubic-bezier(.22,1,.36,1) both',
          }}/>
        )}

        <div className="serif" style={{
          fontSize:'clamp(52px,8vw,114px)', fontWeight:700,
          letterSpacing:'.03em', lineHeight:1.04, marginBottom:40,
        }}>
          {[
            { w:'SEARCH.', p:3, col:T.cream },
            { w:'PROVE.',  p:4, col:T.cream },
            { w:'BUILD.',  p:5, col:T.gold  },
          ].map(({w,p,col}) => (
            <div key={w} style={{ overflow:'hidden', display:'block' }}>
              <div style={{ color:col, ...slide(ph >= p) }}>{w}</div>
            </div>
          ))}
        </div>

        {ph >= 6 && (
          <div style={{ display:'flex', justifyContent:'flex-end', animation:'fade 1s ease both' }}>
            <div className="gold-lbl" style={{ cursor:'pointer' }}>CLICK → TO CONTINUE</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SALES GENIE — SEARCH ──────────────────────────────────────────
function SalesGenieSearch({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),
      setTimeout(() => setPh(2), 950),
      setTimeout(() => setPh(3), 1650),
      setTimeout(() => setPh(4), 2400),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const strategicPath = [
    'Reduce CRM administrative workload so teams can focus on strategic customer engagement.',
    'Align CRM operations with GBS transformation goals and elevate CRM in the commercial ecosystem.',
    'Define AI use cases, technical pathways, adoption guidelines, and scalable implementation practices.',
    'Move CRM teams from reactive work toward proactive customer value creation.',
  ];

  const preparation = [
    'Alignment with Project Owner',
    'Alignment with AI @ GBS Strategy',
    'Engagement with External Advisor Everest Group',
    'Engagement with Hub Heads / CRM Leaders',
  ];

  const interviewFocus = [
    'Understand current role',
    'Identify pain points and challenges',
    'Map current AI integrations',
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">
        <motion.div initial="hidden" animate="visible" variants={stagger}
          style={{ marginBottom:'clamp(16px,2.5vh,28px)' }}>
          <motion.div variants={fadeUp} className="gold-lbl">01 // SEARCH · CRM FRICTION</motion.div>
          <motion.div variants={fadeUp} className="serif" style={{
            fontSize:'clamp(24px,3.6vw,50px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.12,
          }}>
            Find the administrative load.<br/><span style={{ color:T.gold }}>Turn it into AI opportunity.</span>
          </motion.div>
        </motion.div>

        <div className="grid-2" style={{ alignItems:'stretch', marginBottom:'clamp(12px,1.8vh,16px)' }}>
          <div className="card" style={{
            borderTop:`4px solid ${T.gold}`,
            opacity: ph >= 1 ? 1 : 0,
            transform: ph >= 1 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.gold, marginBottom:8 }}>PURPOSE AND STRATEGIC PATH</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
              {strategicPath.map(item => (
                <li key={item} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                  <span style={{ color:T.gold, flexShrink:0, fontSize:8, marginTop:4 }}>▸</span>
                  <span style={{ fontSize:'clamp(11px,1.15vw,13px)', color:T.muted, lineHeight:1.65 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{
            borderTop:`4px solid ${T.green}`,
            opacity: ph >= 2 ? 1 : 0,
            transform: ph >= 2 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.green, marginBottom:10 }}>AI AGENT PROJECT PREPARATION</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {preparation.map((step, i) => (
                <div key={step} style={{ display:'grid', gridTemplateColumns:'24px 1fr', gap:9, alignItems:'center' }}>
                  <div className="mono" style={{
                    width:24, height:24, borderRadius:'50%', border:`1px solid ${T.green}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:T.green, fontSize:9,
                  }}>{i + 1}</div>
                  <div style={{ fontSize:'clamp(10.5px,1.1vw,12.5px)', color:T.muted, lineHeight:1.45 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{
          opacity: ph >= 3 ? 1 : 0,
          transform: ph >= 3 ? 'translateY(0)' : 'translateY(18px)',
        }}>
          <div className="grid-2" style={{ alignItems:'center' }}>
            <div>
              <div className="gold-lbl" style={{ marginBottom:10 }}>AI PLAYBOOK DESIGN · INTERVIEWS</div>
              <div className="serif" style={{
                fontSize:'clamp(20px,2.5vw,34px)', color:T.cream,
                lineHeight:1.15, fontWeight:700, marginBottom:10,
              }}>
                Use interviews to spot AI opportunities.
              </div>
              <p style={{ fontSize:'clamp(11px,1.2vw,13px)', color:T.muted, lineHeight:1.65 }}>
                Phase I starts by understanding CRM work directly from contributors, then translating repeated friction into use cases.
              </p>
            </div>
            <div style={{ display:'grid', gap:10 }}>
              {interviewFocus.map((item, i) => (
                <div key={item} style={{
                  border:`1px solid ${i === 1 ? 'rgba(201,169,110,.34)' : T.line}`,
                  borderRadius:7,
                  padding:'11px 12px',
                  background:i === 1 ? 'rgba(201,169,110,.07)' : 'rgba(237,233,224,.035)',
                }}>
                  <div className="lbl" style={{ color:i === 1 ? T.gold : 'rgba(237,233,224,.36)' }}>0{i + 1}</div>
                  <div style={{ color:T.cream, fontSize:'clamp(12px,1.25vw,14px)', lineHeight:1.45 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>
      </div>
    </div>
  );
}

// ── SALES GENIE — PROVE ───────────────────────────────────────────
function SalesGenieProve({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 250),
      setTimeout(() => setPh(2), 900),
      setTimeout(() => setPh(3), 1600),
      setTimeout(() => setPh(4), 2350),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const lifecycleRows = [
    ['AI use cases', 'Document CRM opportunities for agentic AI.'],
    ['Data assessments', 'Identify the source material each use case depends on.'],
    ['Agent behavior blueprint', 'Define how the AI agent should act within CRM workflows.'],
  ];

  const names = [
    'Agustina Gonzalez',
    'Gabriela Ruiz',
    'Nicole Tüzüner',
    'Swetha K',
    'Venkat Amble · Project Owner',
    'Jharana Mahanta · Coach',
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">
        <motion.div initial="hidden" animate="visible" variants={stagger}
          style={{ marginBottom:'clamp(16px,2.5vh,28px)' }}>
          <motion.div variants={fadeUp} className="gold-lbl">02 // PROVE · AI PLAYBOOK</motion.div>
          <motion.div variants={fadeUp} className="serif" style={{
            fontSize:'clamp(24px,3.6vw,50px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.12,
          }}>
            Phase I turns interviews<br/><span style={{ color:T.gold }}>into a usable playbook.</span>
          </motion.div>
        </motion.div>

        <div className="grid-3" style={{ marginBottom:'clamp(12px,1.8vh,16px)' }}>
          <div className="card" style={{
            borderTop:`4px solid ${T.gold}`,
            opacity: ph >= 1 ? 1 : 0,
            transform: ph >= 1 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.gold, marginBottom:10 }}>INTERVIEW MATERIAL</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[
                ['17+', 'meetings'],
                ['20+', 'hours material'],
                ['50+', 'alignment hours'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="serif" style={{ color:T.gold, fontWeight:700, fontSize:'clamp(24px,3vw,40px)', lineHeight:1 }}>{value}</div>
                  <div className="lbl" style={{ fontSize:7.5, marginTop:4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{
            borderTop:`4px solid ${T.blue}`,
            opacity: ph >= 2 ? 1 : 0,
            transform: ph >= 2 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.blue, marginBottom:10 }}>PHASE I OUTCOMES</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {lifecycleRows.map(([title, body]) => (
                <div key={title} style={{ borderTop:`1px solid ${T.line}`, paddingTop:9 }}>
                  <div className="serif" style={{ color:T.cream, fontSize:'clamp(15px,1.55vw,20px)', lineHeight:1.15 }}>{title}</div>
                  <div style={{ color:T.muted, fontSize:'clamp(10.5px,1.1vw,12.5px)', lineHeight:1.5, marginTop:4 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card" style={{
            borderTop:`4px solid ${T.green}`,
            opacity: ph >= 3 ? 1 : 0,
            transform: ph >= 3 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.green, marginBottom:10 }}>PROJECT GENIES</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:8 }}>
              {names.map((name, i) => (
                <div key={name} style={{
                  border:`1px solid ${T.line}`,
                  borderRadius:6,
                  padding:'9px 10px',
                  background:'rgba(237,233,224,.035)',
                }}>
                  <div className="serif" style={{ fontSize:'clamp(13px,1.35vw,17px)', color:i >= 4 ? T.gold : T.cream, lineHeight:1.15 }}>{name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{
          background:`linear-gradient(135deg,rgba(201,169,110,.08),rgba(0,0,0,.5))`,
          borderColor:`rgba(201,169,110,.22)`,
          opacity: ph >= 4 ? 1 : 0,
          transition:'opacity .5s ease',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
            <div>
              <div className="gold-lbl" style={{ marginBottom:8 }}>PHASE I</div>
              <div className="serif" style={{ fontSize:'clamp(20px,2.5vw,34px)', color:T.cream, lineHeight:1.18, fontWeight:700 }}>
                Defining the AI Agent Playbook.
              </div>
            </div>
            <div className="lbl" style={{ lineHeight:1.9, textAlign:'right' }}>
              interviews → outcomes<br/>use cases · data · behavior
            </div>
          </div>
        </div>

        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>
      </div>
    </div>
  );
}

// ── SALES GENIE — BUILD ───────────────────────────────────────────
function SalesGenieBuild({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),
      setTimeout(() => setPh(2), 900),
      setTimeout(() => setPh(3), 1600),
      setTimeout(() => setPh(4), 2400),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const lifecycleRows = [
    ['Pre-Sales', 'Engagement gaps & growth areas', 'Salesforce · GFB · iQuote · Intranet'],
    ['Pre-Sales', 'Customer context & negotiation readiness', 'Contracts · Calls · SOC · Salesforce'],
    ['Sales', 'Deal execution, follow-ups & contracting', 'Templates · Salesforce · SOC'],
    ['Post-Sales', 'Status transparency & quote automation', 'Salesforce · iQuote'],
    ['Post-Sales', 'Renewals & data quality', 'Regional datasets'],
  ];

  const nextSteps = [
    'Use cases',
    'Collaboration & Development with GBS DS team',
    'Validation of functionality',
    'Pilot demo and proper documentation',
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">
        <motion.div initial="hidden" animate="visible" variants={stagger}
          style={{ marginBottom:'clamp(16px,2.5vh,28px)' }}>
          <motion.div variants={fadeUp} className="gold-lbl">03 // BUILD · PILOT DEVELOPMENT</motion.div>
          <motion.div variants={fadeUp} className="serif" style={{
            fontSize:'clamp(24px,3.6vw,50px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.12,
          }}>
            Phase II builds the agent<br/><span style={{ color:T.gold }}>with the GBS DS team.</span>
          </motion.div>
        </motion.div>

        <div className="grid-3" style={{ marginBottom:'clamp(12px,1.8vh,16px)' }}>
          <div className="card" style={{
            borderTop:`4px solid ${T.gold}`,
            opacity: ph >= 1 ? 1 : 0,
            transform: ph >= 1 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.gold, marginBottom:10 }}>PILOT DEVELOPMENT</div>
            <div className="serif" style={{ fontSize:'clamp(17px,1.8vw,23px)', fontWeight:700, color:T.cream, lineHeight:1.15, marginBottom:10 }}>
              Develop the agent based on the AI Playbook.
            </div>
            <p style={{ fontSize:'clamp(10.5px,1.1vw,12.5px)', color:T.muted, lineHeight:1.65 }}>
              Collaboration and development with the GBS DS team turns use cases into a pilot agent.
            </p>
          </div>

          <div className="card" style={{
            borderTop:`4px solid ${T.blue}`,
            opacity: ph >= 2 ? 1 : 0,
            transform: ph >= 2 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.blue, marginBottom:10 }}>VALIDATION</div>
            <div className="serif" style={{ fontSize:'clamp(17px,1.8vw,23px)', fontWeight:700, color:T.cream, lineHeight:1.15, marginBottom:10 }}>
              Validate functionality.
            </div>
            <p style={{ fontSize:'clamp(10.5px,1.1vw,12.5px)', color:T.muted, lineHeight:1.65 }}>
              Confirm the pilot works against the identified use cases and required CRM data sources.
            </p>
          </div>

          <div className="card" style={{
            borderTop:`4px solid ${T.green}`,
            opacity: ph >= 2 ? 1 : 0,
            transform: ph >= 2 ? 'translateY(0)' : 'translateY(18px)',
          }}>
            <div className="lbl" style={{ color:T.green, marginBottom:10 }}>PILOT DEMO</div>
            <div className="serif" style={{ fontSize:'clamp(17px,1.8vw,23px)', fontWeight:700, color:T.cream, lineHeight:1.15, marginBottom:10 }}>
              Demonstrate to project owner and management.
            </div>
            <p style={{ fontSize:'clamp(10.5px,1.1vw,12.5px)', color:T.muted, lineHeight:1.65 }}>
              Package the pilot with proper documentation for the next project stage.
            </p>
          </div>
        </div>

        <div className="card" style={{
          marginBottom:'clamp(12px,1.8vh,16px)',
          opacity: ph >= 3 ? 1 : 0,
          transform: ph >= 3 ? 'translateY(0)' : 'translateY(18px)',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:16, flexWrap:'wrap', marginBottom:12 }}>
            <div className="lbl" style={{ color:T.gold }}>OUTCOMES · AI PLAYBOOK</div>
            <div className="lbl">CRM lifecycle · topic · key data sources</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {lifecycleRows.map(([stage, topic, sources]) => (
              <div key={`${stage}-${topic}`} className="sca-row" style={{
                borderTop:`1px solid ${T.line}`,
                paddingTop:8,
              }}>
                <div className="serif" style={{ color:T.gold, fontSize:'clamp(14px,1.45vw,18px)', lineHeight:1.2 }}>{stage}</div>
                <div style={{ color:T.cream, fontSize:'clamp(11px,1.1vw,13px)', lineHeight:1.5 }}>{topic}</div>
                <div className="sca-impact" style={{ color:T.muted, fontSize:'clamp(10px,1vw,12px)', lineHeight:1.5 }}>{sources}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{
          background:`linear-gradient(135deg,rgba(52,211,153,.08),rgba(0,0,0,.5))`,
          borderColor:'rgba(52,211,153,.25)',
          opacity: ph >= 4 ? 1 : 0,
          transition:'opacity .5s ease',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
            <div>
              <div className="gold-lbl" style={{ marginBottom:8 }}>WHERE WE ARE NOW</div>
              <div className="serif" style={{ fontSize:'clamp(19px,2.3vw,30px)', color:T.cream, lineHeight:1.18, fontWeight:700 }}>
                Phase II: AI Agent and prototype development.
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', justifyContent:'flex-end' }}>
              {nextSteps.map((step, i) => (
                <React.Fragment key={step}>
                  {i > 0 && <span style={{ color:'rgba(237,233,224,.22)', fontSize:11 }}>→</span>}
                  <span className="mono" style={{
                    color:i === nextSteps.length - 1 ? T.green : T.cream,
                    fontSize:'clamp(8.5px,.9vw,10.5px)',
                    letterSpacing:'.08em',
                    textTransform:'uppercase',
                    maxWidth:150,
                    lineHeight:1.35,
                  }}>{step}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>
      </div>
    </div>
  );
}

// ── SALES GENIE — CLOSE ───────────────────────────────────────────
function SalesGenieClose() {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 400),
      setTimeout(() => setPh(2), 1300),
      setTimeout(() => setPh(3), 2200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene">
      <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:28 }}>
        <div style={{
          overflow:'hidden',
          opacity: ph >= 1 ? 1 : 0, transition:'opacity .7s ease',
        }}>
          <div className="serif" style={{
            fontSize:'clamp(46px,7.8vw,104px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.05,
            animation: ph >= 1 ? 'rise .9s cubic-bezier(.22,1,.36,1) both' : 'none',
          }}>
            Thanks for your attention.
          </div>
        </div>

        {ph >= 2 && (
          <div style={{
            width:'clamp(80px,12vw,140px)', height:1,
            background:`linear-gradient(to right,transparent,${T.gold},transparent)`,
            transformOrigin:'center',
            animation:'scaleIn .8s cubic-bezier(.22,1,.36,1) both',
          }}/>
        )}

        {ph >= 3 && (
          <div style={{ animation:'rise .7s cubic-bezier(.22,1,.36,1) both' }}>
            <div className="gold-lbl" style={{ justifyContent:'center', marginBottom:8 }}>Q&A</div>
            <div className="lbl" style={{ letterSpacing:'.18em' }}>SALES GENIE · AGENTIC AI · TEAM GENIEX</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DECK SELECTOR ─────────────────────────────────────────────────
function DeckSelector({ onSelect }) {
  const decks = [
    {
      id:'story',
      label:'My Story',
      kicker:'DELL TECHNOLOGIES · SCA TPM',
      title:'Search. Prove. Build.',
      detail:'The original personal narrative and SCA TPM closing argument.',
      color:T.gold,
    },
    {
      id:'sales',
      label:'Sales Genie',
      kicker:'TEAM GENIEX · NEW HORIZONS 2025',
      title:'Agentic AI for CRM.',
      detail:'A Sales Genie project story built from the attached deck.',
      color:T.green,
    },
  ];

  return (
    <div className="scene">
      <div className="inner" style={{ maxWidth:'min(1080px,100%)' }}>
        <div style={{ marginBottom:'clamp(24px,4vh,44px)', animation:'rise .7s ease both' }}>
          <div className="gold-lbl">CHOOSE PRESENTATION</div>
          <div className="serif" style={{
            fontSize:'clamp(34px,5.6vw,78px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.04,
          }}>
            Select the story.
          </div>
        </div>

        <div className="grid-2">
          {decks.map(deck => (
            <button
              key={deck.id}
              type="button"
              className="card"
              onClick={() => onSelect(deck.id)}
              style={{
                textAlign:'left',
                cursor:'pointer',
                minHeight:230,
                borderTop:`4px solid ${deck.color}`,
                color:T.cream,
              }}
            >
              <div className="lbl" style={{ color:deck.color, marginBottom:16 }}>{deck.kicker}</div>
              <div className="serif" style={{
                fontSize:'clamp(28px,3.2vw,46px)', fontWeight:700,
                color:T.cream, lineHeight:1.08, marginBottom:14,
              }}>
                {deck.label}
              </div>
              <div className="serif" style={{
                fontSize:'clamp(18px,2vw,27px)', fontStyle:'italic',
                color:deck.color, lineHeight:1.15, marginBottom:18,
              }}>
                {deck.title}
              </div>
              <p style={{ fontSize:'clamp(11px,1.2vw,13.5px)', color:T.muted, lineHeight:1.65 }}>
                {deck.detail}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SCENE 0 — SPLASH (before presentation begins) ────────────────
function SceneSplash({ deck, onStart }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 500),
      setTimeout(() => setPh(2), 1300),
      setTimeout(() => setPh(3), 2200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const splash = deck === 'sales'
    ? {
      eyebrow:'SALES GENIE · AGENTIC AI',
      title:'Team GenieX',
      date:'NEW HORIZONS 2025',
    }
    : {
      eyebrow:'DELL TECHNOLOGIES · SCA TPM',
      title:'Vishnu Pratap Kumar',
      date:'MAY 2026',
    };

  return (
    <div className="scene">
      <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>

        <div style={{
          opacity: ph >= 1 ? 1 : 0, transition:'opacity .9s ease',
          animation: ph >= 1 ? 'rise .85s cubic-bezier(.22,1,.36,1) both' : 'none',
        }}>
          <div className="gold-lbl" style={{ justifyContent:'center', marginBottom:10 }}>
            {splash.eyebrow}
          </div>
          <div className="serif" style={{
            fontSize:'clamp(22px,2.6vw,34px)', color:T.cream,
            fontWeight:300, letterSpacing:'.06em', lineHeight:1.3,
          }}>
            {splash.title}
          </div>
          <div className="lbl" style={{ marginTop:8, letterSpacing:'.2em' }}>{splash.date}</div>
        </div>

        {ph >= 2 && (
          <div style={{
            width:100, height:1,
            background:`linear-gradient(to right,transparent,${T.gold},transparent)`,
            transformOrigin:'center',
            animation:'scaleIn .7s cubic-bezier(.22,1,.36,1) both',
          }}/>
        )}

        {ph >= 3 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:13, animation:'fade 1s ease both' }}>
            <div className="play-btn" onClick={onStart}>
              <div style={{
                width:0, height:0,
                borderTop:'12px solid transparent', borderBottom:'12px solid transparent',
                borderLeft:`20px solid ${T.gold}`,
                marginLeft:5,
              }}/>
            </div>
            <div className="lbl" style={{ letterSpacing:'.22em', fontSize:'clamp(7px,.8vw,9px)' }}>
              PRESS SPACE · OR CLICK TO BEGIN
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PROGRESS DOTS ─────────────────────────────────────────────────
function ProgressDots({ scene, meta }) {
  return (
    <div style={{
      position:'fixed', right:14, top:'50%', transform:'translateY(-50%)',
      zIndex:600, display:'flex', flexDirection:'column', alignItems:'flex-end',
    }}>
      {meta.map((m, i) => {
        const cur  = i === scene, past = i < scene;
        const dc   = cur ? T.gold : past ? 'rgba(201,169,110,.45)' : 'rgba(237,233,224,.13)';
        const tc   = cur ? T.gold : past ? 'rgba(201,169,110,.36)' : 'rgba(237,233,224,.1)';
        return (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
            {i > 0 && (
              <div style={{ width:1, height:24, marginRight:3.5, alignSelf:'flex-end',
                background: past||cur ? 'rgba(201,169,110,.28)' : 'rgba(237,233,224,.06)' }}/>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:6, letterSpacing:'.17em', textTransform:'uppercase', color:tc }}>{m.label}</div>
              <div style={{
                width:cur?8:5, height:cur?8:5, borderRadius:'50%', flexShrink:0,
                background: cur ? T.gold : past ? 'rgba(201,169,110,.45)' : 'transparent',
                border:`1px solid ${dc}`,
                boxShadow: cur ? `0 0 8px ${T.gold}88` : 'none',
                transition:'all .3s ease',
              }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── SCENE 7 — THANK YOU ───────────────────────────────────────────
function SceneClose() {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 400),
      setTimeout(() => setPh(2), 1300),
      setTimeout(() => setPh(3), 2200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene">
      <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:28 }}>

        <div style={{
          overflow:'hidden',
          opacity: ph >= 1 ? 1 : 0, transition:'opacity .7s ease',
        }}>
          <div className="serif" style={{
            fontSize:'clamp(52px,9vw,120px)', fontWeight:300, fontStyle:'italic',
            color:T.cream, lineHeight:1.05, letterSpacing:'-.01em',
            animation: ph >= 1 ? 'rise .9s cubic-bezier(.22,1,.36,1) both' : 'none',
          }}>
            Thank you.
          </div>
        </div>

        {ph >= 2 && (
          <div style={{
            width:'clamp(80px,12vw,140px)', height:1,
            background:`linear-gradient(to right,transparent,${T.gold},transparent)`,
            transformOrigin:'center',
            animation:'scaleIn .8s cubic-bezier(.22,1,.36,1) both',
          }}/>
        )}

        {ph >= 3 && (
          <div style={{ animation:'rise .7s cubic-bezier(.22,1,.36,1) both' }}>
            <div className="gold-lbl" style={{ justifyContent:'center', marginBottom:8 }}>VISHNU PRATAP KUMAR</div>
            <div className="lbl" style={{ letterSpacing:'.18em' }}>DELL TECHNOLOGIES · SCA TPM · MAY 2026</div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────
const MY_STORY_SCENES = [SceneOpen, SceneSearch, SceneProve, SceneBuild, SceneSCA, SceneClose];
const SALES_GENIE_SCENES = [SalesGenieOpen, SalesGenieSearch, SalesGenieProve, SalesGenieBuild, SalesGenieClose];

const DECKS = {
  story: { meta:MY_STORY_META, scenes:MY_STORY_SCENES },
  sales: { meta:SALES_GENIE_META, scenes:SALES_GENIE_SCENES },
};

export default function App() {
  const [deck]                = useState('sales');
  const [started, setStarted] = useState(false);
  const [scene, setScene]     = useState(0);
  const [cutting, setCutting] = useState(false);

  const cut = fn => {
    setCutting(true);
    setTimeout(() => { fn(); setCutting(false); }, 230);
  };
  const active = deck ? DECKS[deck] : DECKS.story;
  const handleStart = () => cut(() => setStarted(true));
  const next = () => cut(() => setScene(s => Math.min(s+1, active.scenes.length-1)));
  const prev = () => cut(() => setScene(s => Math.max(s-1, 0)));

  useEffect(() => {
    const h = e => {
      if (!deck) return;
      if (!started) {
        if (e.key===' '||e.key==='Enter') { e.preventDefault(); handleStart(); }
        return;
      }
      if (e.key==='ArrowRight'||e.key===' ') { e.preventDefault(); next(); }
      if (e.key==='ArrowLeft')               { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [deck, started, active]); // eslint-disable-line

  const Scene = active.scenes[scene];
  const meta  = started ? active.meta[scene] : active.meta[0];
  const chrome = 'rgba(237,233,224,.22)';

  return (
    <>
      <style>{CSS}</style>

      {/* Letterbox */}
      <div className="lb lb-t"/>
      <div className="lb lb-b"/>

      {/* Film grain */}
      <div className="grain"/>

      {/* Three.js particles */}
      <div style={{ position:'fixed', inset:0, zIndex:0 }}>
        <Canvas gl={{ antialias:false }}>
          <color attach="background" args={['#000']}/>
          <ParticleAtmosphere/>
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom luminanceThreshold={0.4} mipmapBlur intensity={0.7}/>
            <Vignette eskil={false} offset={0.1} darkness={0.78}/>
          </EffectComposer>
        </Canvas>
      </div>

      {/* Background image */}
      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        backgroundImage:`url(${meta.bg})`,
        backgroundSize:'cover', backgroundPosition:'center',
        opacity: !started ? 0.38 : meta.label==='BUILD' ? 0.52 : meta.label==='SCA' ? 0.42 : meta.label==='END' ? 0.35 : 0.62,
        transition:'opacity .6s ease',
      }}/>

      {/* Colored scrim */}
      <div style={{
        position:'fixed', inset:0, zIndex:2, pointerEvents:'none',
        background: started ? meta.scrim : 'linear-gradient(160deg,rgba(0,0,0,.72) 0%,rgba(8,5,2,.92) 100%)',
        transition:'background .5s ease',
      }}/>

      {/* Scene transition flash */}
      {cutting && <div style={{ position:'fixed', inset:0, zIndex:950, background:'#000', pointerEvents:'none' }}/>}

      {/* Splash or active scene */}
      {!started ? (
        <div key={`${deck}-splash`} style={{ position:'fixed', inset:'36px 0', zIndex:10, animation:'fade .5s ease' }}>
          <SceneSplash deck={deck} onStart={handleStart}/>
        </div>
      ) : (
        <div key={`${deck}-${scene}`} style={{ position:'fixed', inset:'36px 0', zIndex:10, animation:'fade .38s ease' }}>
          <Scene onNext={next}/>
        </div>
      )}

      {/* Progress — only after started */}
      {started && <ProgressDots scene={scene} meta={active.meta}/>}

      {/* Back — only after started */}
      {started && scene > 0 && (
        <button onClick={e => { e.stopPropagation(); prev(); }} style={{
          position:'fixed', bottom:44, left:40, zIndex:600, cursor:'pointer',
          background:'transparent', border:`1px solid ${chrome}`,
          color:chrome, padding:'5px 13px', borderRadius:4,
          fontFamily:"'IBM Plex Mono',monospace", fontSize:'9px',
          letterSpacing:'.16em', textTransform:'uppercase',
        }}>
          ← BACK
        </button>
      )}
    </>
  );
}
