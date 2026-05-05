import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { KnowledgeGraph, ProofConstellation, BuildHubDiagram, WorkstreamSignal, Gauge } from './components/SVGs';

// ── TOKENS & STYLES ──────────────────────────────────────────────
const T = {
  gold:  "#C9A96E",
  cream: "#EDE9E0",
  muted: "rgba(237,233,224,.7)",
  blue:  "#60A5FA",
  green: "#34D399",
  red:   "#F87171",
  amber: "#FCD34D",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,300;1,700&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  * { box-sizing: border-box; }
  body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; color: ${T.cream}; overflow: hidden; font-family: -apple-system, sans-serif; }
  #root { width: 100%; height: 100%; }

  .serif { font-family: 'Cormorant Garamond', serif; }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  
  .lbl { font-family: 'IBM Plex Mono', monospace; font-size: clamp(9px, 1vw, 11px); font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.muted}; }
  
  .section-container {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: clamp(20px, 5vw, 60px);
    position: relative;
  }

  .content-wrapper {
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    position: relative;
    /* Added subtle text shadow to all text to guarantee pop against bright images */
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  }

  /* Responsive Story UI Cards - Heavy dark glass for contrast */
  .dashboard-card {
    background: rgba(8, 8, 10, 0.85); /* Much darker background for contrast */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(237, 233, 224, 0.15);
    padding: clamp(20px, 3vw, 32px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    color: ${T.cream};
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  }
  
  /* Responsive Grids */
  .grid-responsive {
    display: grid;
    gap: clamp(16px, 3vw, 40px);
  }
  .grid-3-col {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  .grid-2-col {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .hud-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(48px, 6vw, 90px);
    font-weight: 700;
    line-height: 0.9;
    letter-spacing: -0.02em;
  }

  /* Mask Reveal Container */
  .mask-container {
    overflow: hidden;
    display: inline-block;
  }

  .bg-image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;
    pointer-events: none;
    /* Removed the harsh mask that made corners pitch black */
  }

  /* Heavy dark gradient overlay to ensure text legibility on ANY background */
  .scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%);
    z-index: 2;
    pointer-events: none;
  }

  /* SVG & Particle Animations */
  @keyframes drawPth {
    to { stroke-dashoffset: 0; }
  }
  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes nodeIn {
    0% { opacity: 0; transform: scale(0.6); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pulseGlow {
    0% { opacity: 0.4; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.4; transform: scale(0.95); }
  }
`;

// ── PARTICLE ATMOSPHERE ──────────────────────────────────────────
function ParticleAtmosphere() {
  const count = 1500;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 80;     // x
      p[i * 3 + 1] = (Math.random() - 0.5) * 80; // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 80; // z
    }
    return p;
  }, [count]);

  const pointsRef = useRef();
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#EDE9E0" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ── HEAVY LINEAR TRACKING CAMERA ─────────────────────────────────
function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    const zOffset = scroll.offset * -200; // Deep linear push
    camera.position.lerp(new THREE.Vector3(0, 0, zOffset + 10), 0.05);
  });
  
  return null;
}

// ── CINEMATIC ANIMATION VARIANTS ─────────────────────────────────
const maskReveal = {
  hidden: { y: "100%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

// ── SCENES ───────────────────────────────────────────────────────

function Scene1_Open() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const [ph, setPh] = useState(0);

  useEffect(() => {
    if (isInView) {
      const ts = [setTimeout(() => setPh(1), 200), setTimeout(() => setPh(2), 600), setTimeout(() => setPh(3), 1200)];
      return () => ts.forEach(clearTimeout);
    } else {
      setPh(0);
    }
  }, [isInView]);

  return (
    <div className="section-container" ref={ref}>
      <div className="bg-image" style={{ backgroundImage: "url(/bg-story-search.png)", opacity: 0.7 }} />
      <div className="scrim" />
      <motion.div className="content-wrapper" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        
        <motion.div variants={fadeInUp} className="lbl" style={{ color: T.gold, marginBottom: 24 }}>
          THE NARRATIVE
        </motion.div>
        
        <div className="serif" style={{ fontSize: "clamp(50px, 8vw, 110px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.1, color: T.cream }}>
          <div className="mask-container"><motion.div variants={maskReveal} style={{ color: ph >= 1 ? T.cream : "transparent", transition: "color 0.5s" }}>SEARCH.</motion.div></div><br/>
          <div className="mask-container"><motion.div variants={maskReveal} style={{ color: ph >= 2 ? T.cream : "transparent", transition: "color 0.5s" }}>PROVE.</motion.div></div><br/>
          <div className="mask-container"><motion.div variants={maskReveal} style={{ color: ph >= 3 ? T.gold : "transparent", transition: "color 0.5s" }}>BUILD.</motion.div></div>
        </div>
        
        <motion.div variants={fadeInUp} style={{ marginTop: 40, opacity: ph >= 3 ? 1 : 0, transition: "opacity 1s ease 0.5s" }}>
          <div className="lbl" style={{ marginBottom: 8 }}>Dell SCA TPM Interview</div>
          <div className="mono" style={{ fontSize: "12px", color: T.muted }}>Scroll to unearth the story ↓</div>
        </motion.div>

      </motion.div>
    </div>
  );
}

function Scene2_Search() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const [ph, setPh] = useState(0);

  useEffect(() => {
    if (isInView) {
      const ts = [setTimeout(() => setPh(1), 300), setTimeout(() => setPh(2), 1100), setTimeout(() => setPh(3), 2000), setTimeout(() => setPh(4), 2800), setTimeout(() => setPh(5), 3800)];
      return () => ts.forEach(clearTimeout);
    } else {
      setPh(0);
    }
  }, [isInView]);

  return (
    <div className="section-container" ref={ref}>
      <div className="bg-image" style={{ backgroundImage: "url(/bg-story-search.png)", opacity: 0.8 }} />
      <div className="scrim" />
      <motion.div className="content-wrapper" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} style={{ width: "100%", maxWidth: 1100 }}>
        
        <motion.div variants={fadeInUp} style={{ marginBottom: 40, borderLeft: `3px solid ${T.gold}`, paddingLeft: 20 }}>
          <div className="lbl" style={{ color: T.gold, marginBottom: 16 }}>01 // THE DETECTIVE</div>
          <div className="serif" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, fontStyle: "italic", color: T.cream, lineHeight: 1.1 }}>
            I find what's broken before<br/>anyone tells me to look.
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <KnowledgeGraph phase={ph} />
        </motion.div>
        
      </motion.div>
    </div>
  );
}

function Scene3_Prove() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const [ph, setPh] = useState(0);

  useEffect(() => {
    if (isInView) {
      const ts = [setTimeout(() => setPh(1), 200), setTimeout(() => setPh(2), 800), setTimeout(() => setPh(3), 1600), setTimeout(() => setPh(4), 2400), setTimeout(() => setPh(5), 3200)];
      return () => ts.forEach(clearTimeout);
    } else {
      setPh(0);
    }
  }, [isInView]);

  return (
    <div className="section-container" ref={ref}>
      <div className="bg-image" style={{ backgroundImage: "url(/bg-story-prove.png)", opacity: 0.9 }} />
      <div className="scrim" />
      <motion.div className="content-wrapper" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} style={{ width: "100%", maxWidth: 1200 }}>
        
        <motion.div variants={fadeInUp} style={{ marginBottom: 40 }}>
          <div className="lbl" style={{ color: T.gold, marginBottom: 16 }}>02 // THE INVENTOR</div>
          <div className="serif" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, fontStyle: "italic", color: T.cream, lineHeight: 1.05 }}>
            I don't ask for belief.<br/>I put proof on the table.
          </div>
        </motion.div>

        <div className="grid-responsive grid-2-col" style={{ alignItems: "center" }}>
          
          <div className="grid-responsive" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
            {[
              { tag: "CATALOG", title: "Live VP demo", detail: "Built the complete end experience for the Software Catalog platform, demoed it live, and earned development approval in <2 months.", color: T.gold, show: ph >= 2 },
              { tag: "AUTOMATION", title: "n8n + AI PoC", detail: "Built an n8n demo using AI, RAG, and existing data to prove software intake could move to automated workflow.", color: T.blue, show: ph >= 3 },
              { tag: "AGENTS", title: "Silent removal at scale", detail: "Redesigned the Windows removal agent for server-controlled removals across 100K+ endpoints, plus a Linux PoC.", color: T.green, show: ph >= 4 },
            ].map((item, i) => (
              <div key={i} className="dashboard-card" style={{ 
                opacity: item.show ? 1 : 0, 
                transform: item.show ? "translateX(0)" : "translateX(-20px)",
                borderLeft: `4px solid ${item.color}`,
              }}>
                <div className="lbl" style={{ color: item.color, marginBottom: 8, fontWeight: 700 }}>{item.tag}</div>
                <div className="serif" style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: 700, marginBottom: 8, color: T.cream }}>{item.title}</div>
                <div style={{ fontSize: "clamp(12px, 1.5vw, 14px)", color: T.muted, lineHeight: 1.6 }}>{item.detail}</div>
              </div>
            ))}
          </div>

          <div>
            <ProofConstellation phase={ph} />
          </div>

        </div>

      </motion.div>
    </div>
  );
}

function Scene4_Build() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const [ph, setPh] = useState(0);

  useEffect(() => {
    if (isInView) {
      const ts = [setTimeout(() => setPh(1), 400), setTimeout(() => setPh(2), 1200), setTimeout(() => setPh(3), 2000)];
      return () => ts.forEach(clearTimeout);
    } else {
      setPh(0);
    }
  }, [isInView]);

  const workstreams = [
    { title:"Software Catalog", kicker:"employee experience", color:T.gold, body:"One landing place for employees, SAM, software owners, admins and approvers.", metrics:[ ["5K→200", "incidents"], ["4K", "approvals"] ] },
    { title:"Deploy Automation", kicker:"intake to deployment", color:T.blue, body:"Rebuilt the intake path from email into tracked workflow, then pushed automation.", metrics:[ ["45d→1d", "cycle time"], ["70%", "automated"] ] },
    { title:"Removal Agent", kicker:"risk action at scale", color:T.green, body:"Scheduled, server-controlled silent removals for Windows and Linux endpoints.", metrics:[ ["200K+", "removed"], ["3K+", "titles"] ] },
  ];

  return (
    <div className="section-container" ref={ref}>
      <div className="bg-image" style={{ backgroundImage: "url(/bg-story-build.png)", opacity: 1 }} />
      <div className="scrim" />
      <motion.div className="content-wrapper" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} style={{ width: "100%", maxWidth: 1200 }}>
        
        <motion.div variants={fadeInUp} style={{ marginBottom: 40, textAlign: "center" }}>
          <div className="lbl" style={{ color: T.gold, marginBottom: 16 }}>03 // THE ARCHITECT</div>
          <div className="serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, fontStyle: "italic", color: T.cream, lineHeight: 1.1 }}>
            Three parallel workstreams.<br/>Executed simultaneously.
          </div>
        </motion.div>

        <div className="grid-responsive grid-3-col" style={{ marginBottom: 40 }}>
          {workstreams.map((w, i) => (
            <div key={w.title} className="dashboard-card" style={{ 
              borderTop: `4px solid ${w.color}`,
              opacity: ph >= i + 1 ? 1 : 0,
              transform: ph >= i + 1 ? "translateY(0)" : "translateY(20px)",
            }}>
              <div className="lbl" style={{ color: w.color, marginBottom: 12, fontWeight: 700 }}>{w.kicker}</div>
              <div className="serif" style={{ fontSize: "clamp(22px, 2.5vw, 26px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16, color: T.cream }}>{w.title}</div>
              <WorkstreamSignal color={w.color} />
              <p style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: T.muted, lineHeight: 1.6, minHeight: 60, marginBottom: 24 }}>{w.body}</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {w.metrics.map(([val, label]) => (
                  <div key={label}>
                    <div className="serif" style={{ fontSize: "clamp(20px, 3vw, 28px)", lineHeight: 1, color: w.color, fontWeight: 700, marginBottom: 4 }}>{val}</div>
                    <div className="lbl" style={{ fontSize: "9px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="dashboard-card">
          <div className="grid-responsive grid-2-col" style={{ alignItems: "center" }}>
            <div>
              <div className="lbl" style={{ color: T.gold, marginBottom: 12 }}>MY USP · END TO END OWNERSHIP</div>
              <div className="serif" style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.1, color: T.cream, fontWeight: 700, marginBottom: 16 }}>
                Single point of contact across VP, engineering, security, and operations.
              </div>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: T.muted, lineHeight: 1.6 }}>
                I drove prioritization, vision, issue fixes, approvals and delivery rhythm, including the critical search latency fix from 14 seconds to 3 seconds.
              </p>
            </div>
            <BuildHubDiagram phase={ph} />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

function Scene5_Dashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const [active, setActive] = useState(null);
  
  const SUPPLIERS = [
    { name:"Supplier Alpha",   country:"Taiwan",   tier:"T1", cat:"Semiconductors", score:87, status:"HIGH",   signal:"Credit downgraded Q1 2026",         action:"Schedule exec review",          trend:"↑", color: T.red },
    { name:"Supplier Beta",    country:"Malaysia", tier:"T2", cat:"PCB Assembly",   score:52, status:"MED", signal:"Delivery SLA declining 3 months",   action:"Monitor monthly — flag if <90%", trend:"↓", color: T.amber },
    { name:"Supplier Gamma",   country:"China",    tier:"T1", cat:"Display Panels", score:91, status:"HIGH",   signal:"Single source — no alternate",      action:"Qualify alternate by Q3",        trend:"↑", color: T.red },
  ];

  return (
    <div className="section-container" ref={ref}>
      <div className="bg-image" style={{ backgroundImage: "url(/bg-story-dash.png)", opacity: 0.9 }} />
      <div className="scrim" />
      <motion.div className="content-wrapper" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} style={{ width: "100%", maxWidth: 1200 }}>
        
        <motion.div variants={fadeInUp} style={{ marginBottom: 40 }}>
          <div className="lbl" style={{ color: T.gold, marginBottom: 16 }}>04 // THE APPLICATION</div>
          <div className="serif" style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 300, fontStyle: "italic", color: T.cream, lineHeight: 1.1 }}>
            I applied how I work<br/>
            <span style={{ color: T.gold }}>to your context.</span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="dashboard-card" style={{ padding: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, padding: "16px 24px", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
             <div className="lbl">SUPPLIER RISK DASHBOARD (MOCK)</div>
          </div>
          {SUPPLIERS.map((s, i) => (
            <div key={i}>
              <div style={{ 
                display: "flex", flexWrap: "wrap", gap: "clamp(12px, 2vw, 24px)", padding: "16px 24px", 
                borderBottom: i < SUPPLIERS.length - 1 ? `1px solid rgba(255,255,255,0.05)` : "none", 
                alignItems: "center", cursor: "pointer", 
                background: active === i ? "rgba(201,169,110,0.05)" : "transparent",
              }} onClick={() => setActive(active === i ? null : i)}>
                <div style={{ flex: "1 1 150px" }}>
                  <div style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700, color: T.cream }}>{s.name}</div>
                  <div className="mono" style={{ fontSize: "10px", color: T.muted, marginTop: 4 }}>{s.country} · {s.cat}</div>
                </div>
                <div style={{ flex: "2 1 200px", fontSize: "clamp(12px, 1.5vw, 14px)", color: T.cream, lineHeight: 1.5 }}>{s.signal}</div>
                <div style={{ flex: "0 0 auto" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }}></span>
                    {s.status}
                  </span>
                </div>
              </div>
              
              {active === i && (
                <div style={{ background: "rgba(0,0,0,0.4)", padding: "24px", borderBottom: `1px solid rgba(255,255,255,0.05)`, display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div className="lbl" style={{ marginBottom: 8, color: T.gold }}>RECOMMENDED EXECUTIVE ACTION</div>
                    <div className="serif" style={{ fontSize:"clamp(18px, 2.5vw, 22px)", fontWeight:700, color: T.gold, lineHeight:1.3 }}>{s.action}</div>
                  </div>
                  <div style={{ transformOrigin: "right center" }}>
                    <Gauge value={s.score} color={s.color} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}

// ── ROOT EXPORT ──────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Canvas gl={{ antialias: false }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 10, 80]} />
          
          <ScrollControls pages={6.5} damping={0.25} distance={1.2}>
            <CameraRig />
            <ParticleAtmosphere />
            
            <group>
              <mesh position={[0, -15, -100]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[400, 800, 40, 80]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
              </mesh>
            </group>
            
            <EffectComposer disableNormalPass multisampling={4}>
              <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1} />
              <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} />
              <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>

            <Scroll html style={{ width: "100%", height: "100%" }}>
              <Scene1_Open />
              <Scene2_Search />
              <Scene3_Prove />
              <Scene4_Build />
              <Scene5_Dashboard />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </>
  );
}
