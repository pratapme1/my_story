import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import { KnowledgeGraph, GovernancePipeline, ServerAdditions, ISRAArchitecture } from './components/SVGs';

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

.serif { font-family:'Cormorant Garamond',serif; text-shadow:0 1px 14px rgba(0,0,0,.9),0 3px 32px rgba(0,0,0,.65); }
.mono  { font-family:'IBM Plex Mono',monospace; text-shadow:0 1px 8px rgba(0,0,0,.85); }

.lbl {
  font-family:'IBM Plex Mono',monospace;
  font-size:clamp(7.5px,.85vw,10px); letter-spacing:.2em; text-transform:uppercase;
  color:rgba(237,233,224,.55); text-shadow:0 1px 8px rgba(0,0,0,.9);
}
.gold-lbl {
  font-family:'IBM Plex Mono',monospace; font-size:clamp(7.5px,.85vw,9.5px);
  letter-spacing:.22em; text-transform:uppercase; color:#C9A96E;
  display:flex; align-items:center; gap:8px; margin-bottom:10px;
  text-shadow:0 1px 8px rgba(0,0,0,.9);
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

/* Glass card */
.card {
  background:rgba(4,4,8,.92); backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
  border:1px solid rgba(237,233,224,.13); border-radius:8px;
  padding:clamp(14px,1.8vw,22px); position:relative; overflow:hidden;
  box-shadow:0 16px 48px rgba(0,0,0,.7);
  transition:opacity .45s ease, transform .45s ease;
}

@keyframes fade    { from{opacity:0} to{opacity:1} }
@keyframes rise    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes growX   { from{width:0} to{width:100%} }
@keyframes scaleIn { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes drawPth  { to{stroke-dashoffset:0} }
@keyframes arrowMove { to{stroke-dashoffset:-14} }
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

// ── SCENE METADATA ────────────────────────────────────────────────
const META = [
  { bg:'/bg-cinematic-open.png',  scrim:'linear-gradient(160deg,rgba(0,0,0,.5) 0%,rgba(8,5,2,.78) 100%)',         label:'OPEN'   },
  { bg:'/bg-story-search.png',    scrim:'linear-gradient(160deg,rgba(75,40,5,.44) 0%,rgba(0,0,0,.92) 100%)',       label:'SEARCH' },
  { bg:'/bg-story-prove.png',     scrim:'linear-gradient(160deg,rgba(15,35,90,.44) 0%,rgba(0,0,0,.94) 100%)',      label:'PROVE'  },
  { bg:'/bg-cinematic-build.png', scrim:'linear-gradient(160deg,rgba(5,12,70,.46) 0%,rgba(0,0,0,.94) 100%)',       label:'BUILD'  },
  { bg:'/bg-cinematic-build.png', scrim:'linear-gradient(160deg,rgba(5,12,70,.52) 0%,rgba(0,0,0,.96) 100%)',       label:'ISRA'   },
  { bg:'/bg-story-dash.png',      scrim:'linear-gradient(160deg,rgba(0,14,32,.42) 0%,rgba(0,0,0,.92) 100%)',       label:'PLAN'   },
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
      setTimeout(() => setPh(1), 350),   // header + client nodes
      setTimeout(() => setPh(2), 1100),  // center node + paths from client
      setTimeout(() => setPh(3), 2400),  // server questions stagger in
      setTimeout(() => setPh(4), 4200),  // all questions visible
      setTimeout(() => setPh(5), 5000),  // click hint
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
      setTimeout(() => setPh(1), 300),   // header + DISCOVER
      setTimeout(() => setPh(2), 1000),  // GOVERN
      setTimeout(() => setPh(3), 1800),  // EXECUTE
      setTimeout(() => setPh(4), 2600),  // VERIFY
      setTimeout(() => setPh(5), 3500),  // scale stats
      setTimeout(() => setPh(6), 4400),  // web app cards
      setTimeout(() => setPh(7), 5400),  // LIVE NOW banner
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const webApp = [
    { title:'ADMIN VIEW',  color:T.gold,
      items:['Campaign management','Bulk removal control','Policy configuration','Exception approvals'] },
    { title:'OWNER VIEW',  color:T.blue,
      items:['Scheduled removals','Raise exception + justification','Self-service cleanup','Removal history'] },
    { title:'MONITORING',  color:T.green,
      items:['Real-time status','Detailed logging','Audit trail','License reclamation'] },
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">

        {ph >= 1 && (
          <div style={{ marginBottom:'clamp(10px,1.8vh,18px)', animation:'rise .5s ease both' }}>
            <div className="gold-lbl">02 // PROVE · BUILT AT SCALE</div>
            <div className="serif" style={{
              fontSize:'clamp(22px,3.2vw,44px)', fontWeight:300, fontStyle:'italic',
              color:T.cream, lineHeight:1.12,
            }}>
              Execution is easy.<br/>Governance — ownership, exceptions, verification — is what breaks at scale.
            </div>
          </div>
        )}

        <GovernancePipeline phase={ph}/>

        {ph >= 5 && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            gap:'clamp(20px,3.5vw,52px)', flexWrap:'wrap',
            margin:'clamp(8px,1.4vh,14px) 0', animation:'fade .5s ease both',
          }}>
            {[['98K','endpoints'],['200K+','removals'],['3K+','software titles'],['Windows + Linux','RHEL · Ubuntu']].map(([val, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div className="serif" style={{ fontSize:'clamp(17px,2vw,26px)', color:T.gold, fontWeight:700, lineHeight:1 }}>{val}</div>
                <div className="lbl" style={{ marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {ph >= 6 && (
          <div className="grid-3" style={{ animation:'rise .6s ease both' }}>
            {webApp.map((w, i) => (
              <div key={i} className="card" style={{ borderTop:`3px solid ${w.color}` }}>
                <div className="gold-lbl" style={{ color:w.color, marginBottom:10 }}>{w.title}</div>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
                  {w.items.map((item, j) => (
                    <li key={j} style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
                      <span style={{ color:w.color, flexShrink:0, fontSize:7, marginTop:3, lineHeight:1 }}>▸</span>
                      <span style={{ fontSize:'clamp(10px,1.1vw,12px)', color:T.muted, lineHeight:1.65 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {ph >= 7 && (
          <div className="card" style={{
            borderTop:`3px solid ${T.green}`,
            background:`linear-gradient(135deg,rgba(52,211,153,.06),rgba(0,0,0,.5))`,
            borderColor:`rgba(52,211,153,.22)`,
            marginTop:'clamp(8px,1.4vh,12px)',
            animation:'rise .6s ease both',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="gold-lbl" style={{ color:T.green, marginBottom:10 }}>LIVE NOW</div>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
                  {[
                    'Linux removal agent and demo-ready',
                    'Server dashboard built and demo-ready',
                  ].map((item, i) => (
                    <li key={i} style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
                      <span style={{ color:T.green, flexShrink:0, fontSize:7, marginTop:3, lineHeight:1 }}>▸</span>
                      <span style={{ fontSize:'clamp(10px,1.1vw,12px)', color:T.muted, lineHeight:1.65 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="https://isra-sage.vercel.app/" target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'9px 20px', flexShrink:0,
                  border:`1px solid rgba(52,211,153,.45)`,
                  borderRadius:4, color:T.green,
                  fontFamily:"'IBM Plex Mono',monospace",
                  fontSize:'clamp(8px,.9vw,10px)',
                  letterSpacing:'.18em', textTransform:'uppercase',
                  textDecoration:'none',
                  background:'rgba(52,211,153,.07)',
                  transition:'background .2s ease, border-color .2s ease',
                }}>
                OPEN DEMO →
              </a>
            </div>
          </div>
        )}

        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
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
      setTimeout(() => setPh(1), 300),   // header + IMPACT
      setTimeout(() => setPh(2), 1000),  // CAB GATE
      setTimeout(() => setPh(3), 1700),  // WINDOWS
      setTimeout(() => setPh(4), 2400),  // ROLLBACK
      setTimeout(() => setPh(5), 3300),  // agent lifecycle cards
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const agentLifecycle = [
    { tag:'DEVELOP', color:T.blue,
      title:'Governance layer, not a new tool',
      detail:'Linux agent already built for RHEL + Ubuntu. Wraps SNOW, Ansible, Tanium, SCCM, and native package managers. Enforces policy, ownership, and audit. Extends — does not replace — what already runs.' },
    { tag:'VALIDATE', color:T.amber,
      title:'Staging + sign-off',
      detail:'Test on non-production servers first. Review with server ops and change advisory before any production ring. No expansion without documented approval.' },
    { tag:'DEPLOY', color:T.green,
      title:'Ring-based deployment',
      detail:'PoC (5 servers) → Pilot ring → Full production. Sign-off required at each expansion. Rollback plan active throughout.' },
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">

        {ph >= 1 && (
          <div style={{ marginBottom:'clamp(10px,1.8vh,18px)', animation:'rise .5s ease both' }}>
            <div className="gold-lbl">03 // BUILD · THE PLATFORM</div>
            <div className="serif" style={{
              fontSize:'clamp(22px,3.2vw,44px)', fontWeight:300, fontStyle:'italic',
              color:T.cream, lineHeight:1.12,
            }}>
              Same governance. New environment. Higher stakes.<br/>
              <span style={{ fontSize:'clamp(14px,1.7vw,22px)', color:T.green }}>Linux agent live · Demo-ready.</span>
            </div>
          </div>
        )}

        <ServerAdditions phase={ph}/>

        {ph >= 5 && (
          <div className="grid-3" style={{ marginTop:'clamp(10px,1.8vh,16px)', animation:'rise .6s ease both' }}>
            {agentLifecycle.map((a, i) => (
              <div key={i} className="card" style={{ borderTop:`3px solid ${a.color}` }}>
                <div className="lbl" style={{ color:a.color, marginBottom:8 }}>{a.tag}</div>
                <div className="serif" style={{
                  fontSize:'clamp(15px,1.7vw,20px)', fontWeight:700,
                  color:T.cream, marginBottom:8, lineHeight:1.2,
                }}>{a.title}</div>
                <p style={{ fontSize:'clamp(10px,1.1vw,12px)', color:T.muted, lineHeight:1.65 }}>{a.detail}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>
      </div>
    </div>
  );
}

// ── SCENE 5 — FIRST 90 DAYS ───────────────────────────────────────
function ScenePlan({ onNext }) {
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
      num:'01', time:'Days 1 – 30', theme:'MAP IT', color:T.gold,
      title:'Understand before\nI touch anything.',
      bullets:[
        'Audit server software landscape — installed vs. approved',
        'Shadow server ops, CAB, and security stakeholders',
        'Align scope with the ongoing SNOW SAM Pro migration',
        'Identify top 3 governance gaps — ownership, inventory, or policy drift',
      ],
      deliverable:'Server risk map · top 3 gaps · SNOW alignment confirmed',
    },
    {
      num:'02', time:'Days 31 – 60', theme:'PROVE IT', color:T.blue,
      title:'Demo what\'s built.\nRun the first PoC.',
      bullets:[
        'Demo existing Linux agent + dashboard to server stakeholders',
        'Pick highest-risk gap — run DISCOVER → VERIFY end-to-end',
        'PoC on 5 servers: impact assessed, CAB approved, change window respected',
        'Feed results into SNOW migration — removal data validates discovery accuracy',
      ],
      deliverable:'Live pipeline on 5 servers · dashboard demo · SNOW data validated',
    },
    {
      num:'03', time:'Days 61 – 90', theme:'SCALE IT', color:T.green,
      title:'Full estate.\nProduction-ready.',
      bullets:[
        'Expand to full server estate — ring-based rollout',
        'Dashboard + monitoring live for all stakeholders',
        'Governance playbook documented — repeatable without me',
        'SNOW migration: server removal data integrated into SAM Pro',
      ],
      deliverable:'Production-ready platform · SNOW-integrated · playbook complete',
    },
  ];

  return (
    <div className="scene-scroll" onClick={onNext}>
      <div className="inner">

        {/* Header */}
        {ph >= 1 && (
          <div style={{ marginBottom:'clamp(16px,2.5vh,26px)', animation:'rise .6s ease both' }}>
            <div className="gold-lbl">04 // SERVER PLATFORM · COMMITMENT</div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <div className="serif" style={{
                  fontSize:'clamp(26px,3.8vw,52px)', fontWeight:300, fontStyle:'italic',
                  color:T.cream, lineHeight:1.08,
                }}>
                  First 90 days.
                </div>
                <div className="serif" style={{
                  fontSize:'clamp(18px,2.4vw,32px)', fontWeight:300, fontStyle:'italic',
                  color:T.gold, lineHeight:1.1, marginTop:4,
                }}>
                  Map it. Prove it. Scale it.
                </div>
              </div>
              <div className="lbl" style={{ lineHeight:1.9, textAlign:'right' }}>
                SEARCH → PROVE → BUILD<br/>same method. new platform.
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
              transition:'opacity .5s ease, transform .5s ease',
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
              "Removal is where we start.<br/>
              Prevention is where we go.<br/>
              The governance layer is the same — built once, extended."
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
              <div className="lbl" style={{ fontSize:7.5 }}>APPLIED TO SERVERS · NOT DESCRIBED</div>
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

// ── SCENE 0 — SPLASH (before presentation begins) ────────────────
function SceneSplash({ onStart }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 500),
      setTimeout(() => setPh(2), 1300),
      setTimeout(() => setPh(3), 2200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene">
      <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>

        <div style={{
          opacity: ph >= 1 ? 1 : 0, transition:'opacity .9s ease',
          animation: ph >= 1 ? 'rise .85s cubic-bezier(.22,1,.36,1) both' : 'none',
        }}>
          <div className="gold-lbl" style={{ justifyContent:'center', marginBottom:10 }}>
            DELL TECHNOLOGIES · SERVER PLATFORM
          </div>
          <div className="serif" style={{
            fontSize:'clamp(22px,2.6vw,34px)', color:T.cream,
            fontWeight:300, letterSpacing:'.06em', lineHeight:1.3,
          }}>
            Vishnu Pratap Kumar
          </div>
          <div className="lbl" style={{ marginTop:8, letterSpacing:'.2em' }}>MAY 2026</div>
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
function ProgressDots({ scene }) {
  return (
    <div style={{
      position:'fixed', right:14, top:'50%', transform:'translateY(-50%)',
      zIndex:600, display:'flex', flexDirection:'column', alignItems:'flex-end',
    }}>
      {META.map((m, i) => {
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

// ── SCENE 6 — THANK YOU ───────────────────────────────────────────
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
            <div className="lbl" style={{ letterSpacing:'.18em' }}>DELL TECHNOLOGIES · SERVER PLATFORM · MAY 2026</div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── SCENE 5 — ISRA ARCHITECTURE ──────────────────────────────────
function SceneISRA({ onNext }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setPh(1), 300),
      setTimeout(() => setPh(2), 900),
      setTimeout(() => setPh(3), 1700),
      setTimeout(() => setPh(4), 2500),
      setTimeout(() => setPh(5), 3200),
      setTimeout(() => setPh(6), 3900),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene" onClick={onNext} style={{ cursor:'pointer' }}>
      <div className="inner" style={{
        padding:'clamp(10px,2vh,20px) clamp(20px,3.5vw,48px)',
        height:'100%', display:'flex', flexDirection:'column',
      }}>

        {ph >= 1 && (
          <div style={{ marginBottom:'clamp(6px,1vh,12px)', flexShrink:0, animation:'rise .5s ease both' }}>
            <div className="gold-lbl">ISRA · SYSTEM ARCHITECTURE</div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div className="serif" style={{ fontSize:'clamp(16px,2vw,28px)', fontWeight:300, fontStyle:'italic', color:T.cream, lineHeight:1.12 }}>
                The stack behind the agent.
              </div>
              <div className="lbl" style={{ lineHeight:1.9, textAlign:'right', fontSize:'clamp(6.5px,.72vw,8px)' }}>
                PYTHON · NEXT.JS · SUPABASE<br/>RHEL · UBUNTU · ORACLE LINUX
              </div>
            </div>
          </div>
        )}

        <div style={{ flex:1, minHeight:0, display:'flex', alignItems:'center', overflow:'hidden' }}>
          <ISRAArchitecture phase={ph}/>
        </div>

        <div style={{ marginTop:6, flexShrink:0, display:'flex', alignItems:'center', gap:16, animation:'fade .5s ease .5s both' }}>
          <div style={{ height:1, flex:1, background:`linear-gradient(to right,${T.gold}60,transparent)` }}/>
          <div className="lbl">CLICK TO CONTINUE →</div>
        </div>

      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────
const SCENES = [SceneOpen, SceneSearch, SceneProve, SceneBuild, SceneISRA, ScenePlan, SceneClose];

export default function App() {
  const [started, setStarted] = useState(false);
  const [scene, setScene]     = useState(0);
  const [cutting, setCutting] = useState(false);

  const cut = fn => {
    setCutting(true);
    setTimeout(() => { fn(); setCutting(false); }, 230);
  };
  const handleStart = () => cut(() => setStarted(true));
  const next = () => cut(() => setScene(s => Math.min(s+1, SCENES.length-1)));
  const prev = () => cut(() => setScene(s => Math.max(s-1, 0)));

  useEffect(() => {
    const h = e => {
      if (!started) {
        if (e.key===' '||e.key==='Enter') { e.preventDefault(); handleStart(); }
        return;
      }
      if (e.key==='ArrowRight'||e.key===' ') { e.preventDefault(); next(); }
      if (e.key==='ArrowLeft')               { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [started]); // eslint-disable-line

  const Scene = SCENES[scene];
  const meta  = started ? META[scene] : META[0];
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
        opacity: !started ? 0.38 : scene===0 ? 0.58 : scene===3 ? 0.42 : scene===4 ? 0.32 : scene===6 ? 0.32 : 0.38,
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
        <div key="splash" style={{ position:'fixed', inset:'36px 0', zIndex:10, animation:'fade .5s ease' }}>
          <SceneSplash onStart={handleStart}/>
        </div>
      ) : (
        <div key={scene} style={{ position:'fixed', inset:'36px 0', zIndex:10, animation:'fade .38s ease' }}>
          <Scene onNext={next}/>
        </div>
      )}

      {/* Progress — only after started */}
      {started && <ProgressDots scene={scene}/>}

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
