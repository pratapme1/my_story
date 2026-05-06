import React from 'react';

const T = {
  gold:  "#C9A96E",
  cream: "#EDE9E0",
  muted: "rgba(237,233,224,.42)",
  blue:  "#60A5FA",
  green: "#34D399",
  red:   "#F87171",
  amber: "#FCD34D",
};

export function NodeIcon({ type, color }) {
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

export function KnowledgeGraph({ phase = 5 }) {
  const CX = 430, CY = 245, CR = 68;
  const OX = 950, OY = 245;
  const EDGE_START_X = 210;
  
  const chaos = [
    { x:62,  y:60,  m:"3,000+",  s:"INCIDENTS / QTR",     color:T.red,   icon:"alert",     d:0   },
    { x:44,  y:160, m:"2 WEEKS", s:"MANUAL BUILD TIME",   color:T.amber, icon:"clock",     d:90  },
    { x:74,  y:255, m:"ZERO",    s:"SOFTWARE VISIBILITY", color:T.red,   icon:"eye",       d:180 },
    { x:44,  y:350, m:"EMAIL",   s:"CHAINS / REQUEST",    color:T.amber, icon:"mail",      d:270 },
    { x:68,  y:440, m:"45 DAYS", s:"AVG INTAKE TIME",     color:T.amber, icon:"hourglass", d:360 },
  ];

  const insights = [
    { x:614, y:135, label:"No software home",    color:T.blue,  d:0   },
    { x:614, y:255, label:"Removal = confusion", color:T.gold,  d:220 },
    { x:614, y:375, label:"Intake unstructured", color:T.green, d:440 },
  ];

  return (
    <svg viewBox="0 0 1060 490" width="100%" style={{ overflow:"visible", display:"block", marginTop: 20 }}>
      <defs>
        <radialGradient id="srchGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
        </radialGradient>
        <filter id="glo" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="gloXs" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Atmospheric rings */}
      {[90, 175, 265].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="rgba(201,169,110,.05)" strokeWidth={1} strokeDasharray={i % 2 === 0 ? "none" : `${r * 0.25} ${r * 0.12}`}/>
      ))}

      {chaos.map((n, i) => {
        const isTop = n.m === "3,000+";
        return (
          <g key={i} style={{ opacity: phase >= 1 ? 1 : 0, transition: `opacity 0.5s ease ${n.d}ms` }}>
            <g transform={`translate(${n.x}, ${n.y})`} opacity={isTop ? 1 : .75}>
              <NodeIcon type={n.icon} color={n.color}/>
            </g>
            <text x={n.x + 18} y={n.y - (isTop ? 8 : 5)} textAnchor="start" fontFamily="IBM Plex Mono" fontSize={isTop ? 22 : 14} fontWeight={isTop ? 700 : 400} fill={n.color} filter={isTop ? "url(#gloXs)" : undefined}>{n.m}</text>
            <text x={n.x + 18} y={n.y + (isTop ? 14 : 10)} textAnchor="start" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={1} fill="rgba(237,233,224,.28)">{n.s}</text>
            
            {phase >= 2 && (
              <path 
                d={`M ${EDGE_START_X} ${n.y} C ${(EDGE_START_X + CX - CR) / 2 + 30} ${n.y} ${(EDGE_START_X + CX - CR) / 2 + 30} ${CY} ${CX - CR} ${CY}`} 
                fill="none" 
                stroke={`${n.color}90`} 
                strokeWidth={n.m === "3,000+" ? 1.5 : 1}
                strokeDasharray={400}
                strokeDashoffset={400}
                style={{ animation: `drawPth 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${n.d}ms forwards` }}
              />
            )}
          </g>
        );
      })}

      {phase >= 3 && (
        <g style={{ animation: "fade 0.5s ease both" }}>
          <circle cx={CX} cy={CY} r={CR * 2.4} fill="url(#srchGlow)" style={{ animation: "pulseGlow 4s infinite alternate" }} />
          <circle cx={CX} cy={CY} r={CR} fill="rgba(10,8,6,.97)" stroke={T.gold} strokeWidth={2} filter="url(#glo)"/>
          <text x={CX} y={CY - 11} textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight={700} fontSize={24} fill={T.gold}>60 DAYS</text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={8} letterSpacing={2.5} fill="rgba(201,169,110,.55)">FIELD RESEARCH</text>
        </g>
      )}

      {phase >= 4 && insights.map((ins, i) => (
        <g key={i}>
          <path 
            d={`M ${CX + CR} ${CY} C ${CX + CR + 80} ${CY} ${ins.x - 60} ${ins.y} ${ins.x} ${ins.y}`} 
            fill="none" 
            stroke={`${ins.color}80`} 
            strokeWidth={1.4} 
            strokeDasharray={450}
            strokeDashoffset={450}
            style={{ animation: `drawPth 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${ins.d}ms forwards` }}
          />
          <circle cx={ins.x} cy={ins.y} r={5} fill="rgba(10,8,6,.97)" stroke={ins.color} strokeWidth={1.8} style={{ animation: `fade 0.3s ease ${ins.d + 550}ms both` }} />
          <g style={{ animation: `fade 0.4s ease ${ins.d + 600}ms both` }}>
            <rect x={ins.x + 12} y={ins.y - 24} width={200} height={48} rx={6} fill={`${ins.color}15`} stroke={`${ins.color}45`} strokeWidth={1}/>
            <rect x={ins.x + 12} y={ins.y - 24} width={3.5} height={48} rx={2} fill={ins.color} filter="url(#gloXs)"/>
            <text x={ins.x + 26} y={ins.y + 8} textAnchor="start" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize={22} fill={ins.color}>{ins.label}</text>
          </g>
        </g>
      ))}

      {phase >= 5 && (
        <g>
          {insights.map((ins, i) => (
            <path key={i} d={`M ${ins.x + 212} ${ins.y} C 880 ${ins.y} 890 ${OY} ${OX - 66} ${OY}`} fill="none" stroke={`${T.gold}40`} strokeWidth={1} strokeDasharray={400} strokeDashoffset={400} style={{ animation: `drawPth 0.7s ease ${i * 80}ms forwards` }} />
          ))}
          <circle cx={OX} cy={OY} r={60} fill="rgba(10,8,6,.97)" stroke={T.gold} strokeWidth={2} style={{ animation: "fade 0.5s ease 0.4s both" }} filter="url(#glo)"/>
          <text x={OX} y={OY - 18} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={8} letterSpacing={2.5} fill="rgba(237,233,224,.38)" style={{ animation: "fade 0.4s ease 0.55s both" }}>ONE PLATFORM</text>
          <text x={OX} y={OY + 8} textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight={700} fontSize={28} fill={T.gold} filter="url(#gloXs)" style={{ animation: "fade 0.5s ease 0.6s both" }}>$400M</text>
          <text x={OX} y={OY + 26} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={1.5} fill="rgba(237,233,224,.3)" style={{ animation: "fade 0.4s ease 0.7s both" }}>CIO VISION</text>
        </g>
      )}
    </svg>
  );
}

export function ProofConstellation({ phase = 5 }) {
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
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
        </radialGradient>
        <filter id="proofGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {[120, 205].map((r, i) => (
        <ellipse key={r} cx="384" cy="232" rx={r} ry={r * .45} fill="none" stroke="rgba(237,233,224,.04)" strokeWidth="1" strokeDasharray={i === 1 ? "5 9" : "none"} />
      ))}

      {paths.map((p, i) => p.live && (
        <path key={i} d={p.d} fill="none" stroke={`${p.color}90`} strokeWidth="1.4" strokeDasharray="720" strokeDashoffset="720" style={{ animation:`drawPth 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms forwards` }} />
      ))}

      {phase >= 1 && <circle cx="385" cy="206" r="104" fill="url(#proofHub)" style={{ animation: "pulseGlow 3.5s ease-in-out infinite" }} />}

      {nodes.map((n, i) => n.live && (
        <g key={i} style={{ animation: `nodeIn 0.45s ease ${n.hub ? 0 : i * 70}ms both` }}>
          <circle cx={n.x} cy={n.y} r={n.hub ? 54 : 34} fill={n.hub ? "rgba(10,8,6,.96)" : "rgba(10,8,6,.86)"} stroke={n.color} strokeWidth={n.hub ? 2 : 1.4} filter="url(#proofGlow)" />
          <text x={n.x} y={n.y - 3} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={n.hub ? 10 : 8} fontWeight="500" letterSpacing={n.hub ? 1.8 : .9} fill={n.color}>{n.label}</text>
          <text x={n.x} y={n.y + 15} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={n.hub ? 6.7 : 6.4} letterSpacing={.35} fill="rgba(237,233,224,.38)">{n.sub}</text>
        </g>
      ))}
      
      {phase >= 5 && (
        <g style={{ animation: "fade 0.5s ease both" }}>
          <rect x="244" y="430" width="280" height="34" rx="17" fill="rgba(52,211,153,.08)" stroke="rgba(52,211,153,.4)" />
          <text x="384" y="452" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="2" fill={T.green}>WORKING PROOF → EXECUTIVE TRUST</text>
        </g>
      )}
    </svg>
  );
}

export function BuildHubDiagram({ phase = 3 }) {
  const streams = [
    { y:66, label:"CATALOG", color:T.gold, live: phase >= 1 },
    { y:136, label:"DEPLOY", color:T.blue, live: phase >= 2 },
    { y:206, label:"REMOVE", color:T.green, live: phase >= 3 },
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
          <path d={`M 84 ${s.y} C 180 ${s.y} 224 136 285 136`} fill="none" stroke={`${s.color}90`} strokeWidth="1.3" strokeDasharray="430" strokeDashoffset="430" style={{ animation:`drawPth 0.75s ease ${i * 130}ms forwards` }} />
          <circle cx="84" cy={s.y} r="32" fill="rgba(10,8,6,.88)" stroke={s.color} strokeWidth="1.5" filter="url(#buildGlow)" />
          <text x="84" y={s.y + 4} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8" letterSpacing="1" fill={s.color}>{s.label}</text>
        </g>
      ))}
      <g style={{ animation: "nodeIn 0.45s ease both" }}>
        <circle cx="302" cy="136" r="62" fill="rgba(10,8,6,.96)" stroke={T.cream} strokeWidth="1.5" filter="url(#buildGlow)" />
        <circle cx="302" cy="136" r="82" fill="none" stroke="rgba(201,169,110,.25)" strokeDasharray="4 7" />
        <text x="302" y="124" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="2" fill={T.gold}>CENTER</text>
        <text x="302" y="144" textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight="700" fontSize="22" fill={T.cream}>POC</text>
        <text x="302" y="160" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="6.5" letterSpacing=".8" fill="rgba(237,233,224,.36)">VP · ENG · SEC · OPS</text>
      </g>
      {phase >= 3 && (
        <g style={{ animation: "fade 0.5s ease 0.3s both" }}>
          <path d="M 370 136 C 430 136 454 112 504 94" fill="none" stroke="rgba(201,169,110,.8)" strokeWidth="1.2" />
          <path d="M 370 136 C 430 136 454 160 504 182" fill="none" stroke="rgba(52,211,153,.8)" strokeWidth="1.2" />
          <circle cx="510" cy="94" r="26" fill="rgba(10,8,6,.86)" stroke={T.gold} filter="url(#buildGlow)" />
          <circle cx="510" cy="182" r="26" fill="rgba(10,8,6,.86)" stroke={T.green} filter="url(#buildGlow)" />
          <text x="510" y="91" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="7" fill={T.gold}>VISION</text>
          <text x="510" y="101" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="5.5" fill="rgba(237,233,224,.38)">12K→1K</text>
          <text x="510" y="179" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="7" fill={T.green}>FIXED</text>
          <text x="510" y="189" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="5.5" fill="rgba(237,233,224,.38)">14s→3s</text>
        </g>
      )}
    </svg>
  );
}

export function WorkstreamSignal({ color }) {
  return (
    <svg viewBox="0 0 220 54" width="100%" height="54" style={{ display:"block", margin:"10px 0 6px" }}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          {i > 0 && <path d={`M ${i * 50 - 11} 27 L ${i * 50 + 6} 27`} stroke="rgba(237,233,224,.18)" strokeWidth="1" />}
          <rect x={i * 50 + 6} y="14" width="34" height="26" rx="5" fill={`${color}15`} stroke={`${color}90`} strokeWidth="1" />
          <circle cx={i * 50 + 23} cy="27" r={i === 3 ? 5 : 3} fill={i === 3 ? color : `${color}90`} />
        </g>
      ))}
      <path d="M 174 27 C 190 27 196 16 210 16" fill="none" stroke={`${color}80`} strokeWidth="1.2" />
      <path d="M 174 27 C 190 27 196 38 210 38" fill="none" stroke={`${color}55`} strokeWidth="1.2" />
    </svg>
  );
}

export function Gauge({ value, color }) {
  const r = 28, c = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <defs>
        <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="36" cy="36" r={r} stroke={`${color}22`} strokeWidth="6" fill="none" />
      <circle cx="36" cy="36" r={r} stroke={color} strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} strokeLinecap="round" transform="rotate(-90 36 36)" filter="url(#gaugeGlow)" style={{ animation: "drawPth 1s ease-out forwards" }} />
      <text x="36" y="40" textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight="700" fontSize="16" fill={color} filter="url(#gaugeGlow)">{value}</text>
    </svg>
  );
}
