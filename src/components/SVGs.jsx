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
  const CX = 430, CY = 255, CR = 68;
  const EDGE_START_X = 210;

  const clientNodes = [
    { x:55,  y:78,  label:"ZERO VISIBILITY", sub:"no software inventory",  color:T.red,   icon:"eye",       d:0   },
    { x:38,  y:183, label:"NO OWNERSHIP",    sub:"nothing assigned",       color:T.amber, icon:"alert",     d:90  },
    { x:55,  y:295, label:"MANUAL INTAKE",   sub:"email chains, no flow",  color:T.amber, icon:"hourglass", d:180 },
    { x:38,  y:400, label:"NO GOVERNANCE",   sub:"removal unstructured",   color:T.red,   icon:"mail",      d:270 },
  ];

  const serverQuestions = [
    { x:614, y:105, label:"OWNERSHIP",  sub:"who manages server software?",     color:T.blue,  d:0   },
    { x:614, y:215, label:"INVENTORY",  sub:"approved vs. actually installed?",  color:T.gold,  d:200 },
    { x:614, y:328, label:"REMOVAL",    sub:"governed or ad-hoc today?",         color:T.green, d:400 },
    { x:614, y:428, label:"POLICY",     sub:"who's accountable for drift?",      color:T.amber, d:580 },
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
      </defs>

      {/* Section labels */}
      {phase >= 1 && (
        <>
          <text x={130} y={24} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={2} fill="rgba(201,169,110,.8)" style={{ animation:"fade .6s ease both" }}>CLIENT · DONE</text>
          <text x={740} y={24} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={2} fill="rgba(96,165,250,.8)" style={{ animation:"fade .6s ease .5s both" }}>SERVER · OPEN</text>
        </>
      )}

      {/* Atmospheric rings */}
      {[90, 175].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="rgba(201,169,110,.05)" strokeWidth={1} strokeDasharray={i % 2 === 0 ? "none" : `${r * 0.25} ${r * 0.12}`}/>
      ))}

      {/* Client findings — left side */}
      {clientNodes.map((n, i) => (
        <g key={i} style={{ opacity: phase >= 1 ? 1 : 0, transition: `opacity 0.5s ease ${n.d}ms` }}>
          <g transform={`translate(${n.x}, ${n.y})`} opacity={0.82}>
            <NodeIcon type={n.icon} color={n.color}/>
          </g>
          <text x={n.x + 18} y={n.y - 3} textAnchor="start" fontFamily="IBM Plex Mono" fontSize={10} fontWeight={500} letterSpacing={0.8} fill={n.color}>{n.label}</text>
          <text x={n.x + 18} y={n.y + 12} textAnchor="start" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={0.5} fill="rgba(237,233,224,.65)">{n.sub}</text>
          {phase >= 2 && (
            <path
              d={`M ${EDGE_START_X} ${n.y} C ${(EDGE_START_X + CX - CR) / 2 + 30} ${n.y} ${(EDGE_START_X + CX - CR) / 2 + 30} ${CY} ${CX - CR} ${CY}`}
              fill="none" stroke={`${n.color}80`} strokeWidth={1}
              strokeDasharray={400} strokeDashoffset={400}
              style={{ animation: `drawPth 0.8s cubic-bezier(0.4,0,0.2,1) ${n.d}ms forwards` }}
            />
          )}
        </g>
      ))}

      {/* Center node */}
      {phase >= 2 && (
        <g style={{ animation: "fade 0.5s ease both" }}>
          <circle cx={CX} cy={CY} r={CR * 2.4} fill="url(#srchGlow)" style={{ animation: "pulseGlow 4s infinite alternate" }}/>
          <circle cx={CX} cy={CY} r={CR} fill="rgba(10,8,6,.97)" stroke={T.gold} strokeWidth={2} filter="url(#glo)"/>
          <text x={CX} y={CY - 13} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={2.5} fill="rgba(201,169,110,.45)">DISCOVERY</text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight={700} fontSize={26} fill={T.gold} filter="url(#gloXs)">SEARCH</text>
          <text x={CX} y={CY + 28} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={6.5} letterSpacing={1} fill="rgba(201,169,110,.28)">same method · new scope</text>
        </g>
      )}

      {/* Server discovery questions — right side */}
      {phase >= 3 && serverQuestions.map((q, i) => (
        <g key={i} style={{ animation: `fade 0.5s ease ${q.d}ms both` }}>
          <path
            d={`M ${CX + CR} ${CY} C ${CX + CR + 90} ${CY} ${q.x - 60} ${q.y} ${q.x} ${q.y}`}
            fill="none" stroke={`${q.color}65`} strokeWidth={1.2}
            strokeDasharray={450} strokeDashoffset={450}
            style={{ animation: `drawPth 0.8s cubic-bezier(0.4,0,0.2,1) ${q.d}ms forwards` }}
          />
          <circle cx={q.x} cy={q.y} r={4.5} fill="rgba(10,8,6,.97)" stroke={q.color} strokeWidth={1.6}/>
          <rect x={q.x + 14} y={q.y - 22} width={222} height={44} rx={5} fill={`${q.color}10`} stroke={`${q.color}38`} strokeWidth={1}/>
          <rect x={q.x + 14} y={q.y - 22} width={3} height={44} rx={1.5} fill={q.color} filter="url(#gloXs)"/>
          <text x={q.x + 28} y={q.y - 3} textAnchor="start" fontFamily="IBM Plex Mono" fontSize={9} fontWeight="500" letterSpacing={1.5} fill={q.color}>{q.label}</text>
          <text x={q.x + 28} y={q.y + 14} textAnchor="start" fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={0.4} fill="rgba(237,233,224,.72)">{q.sub}</text>
        </g>
      ))}
    </svg>
  );
}

export function ServerAdditions({ phase = 4 }) {
  const CY = 100, R = 40;

  const stages = [
    { x:130, label:"IMPACT",   color:T.gold,
      steps:["Blast radius assessed", "Dependency mapping"] },
    { x:383, label:"CAB GATE", color:T.amber,
      steps:["Formal change approval", "No removal without sign-off"] },
    { x:636, label:"CHANGE WINDOW",  color:T.blue,
      steps:["Scheduled windows only", "No business-hours impact"] },
    { x:889, label:"ROLLBACK", color:T.green,
      steps:["Plan documented + tested", "Immediate restore ready"] },
  ];

  return (
    <svg viewBox="0 0 1060 200" width="100%" style={{ display:"block", overflow:"visible" }}>
      <defs>
        <filter id="saglo" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sagloXs" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {stages.slice(0, -1).map((s, i) => phase >= i + 2 && (
        <path key={i}
          d={`M ${s.x + R} ${CY} L ${stages[i+1].x - R} ${CY}`}
          fill="none" stroke={`${stages[i+1].color}55`} strokeWidth={1.5}
          strokeDasharray={300} strokeDashoffset={300}
          style={{ animation:`drawPth 0.55s ease both` }}
        />
      ))}

      {stages.map((s, i) => {
        const words = s.label.split(' ');
        const multiLine = words.length > 1;
        return phase >= i + 1 && (
          <g key={i} style={{ animation:`nodeIn 0.45s ease both` }}>
            <circle cx={s.x} cy={CY} r={R * 1.9} fill={`${s.color}07`}
              style={{ animation:"pulseGlow 3.5s ease-in-out infinite" }}/>
            <circle cx={s.x} cy={CY} r={R} fill="rgba(10,8,6,.97)"
              stroke={s.color} strokeWidth={1.8} filter="url(#saglo)"/>
            <text x={s.x} y={CY - 8} textAnchor="middle"
              fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={1}
              fill={`${s.color}55`}>{String(i+1).padStart(2,'0')}</text>
            {multiLine ? (
              <>
                <text x={s.x} y={CY + 3} textAnchor="middle"
                  fontFamily="IBM Plex Mono" fontSize={8} fontWeight="500" letterSpacing={1.5}
                  fill={s.color} filter="url(#sagloXs)">{words[0]}</text>
                <text x={s.x} y={CY + 14} textAnchor="middle"
                  fontFamily="IBM Plex Mono" fontSize={8} fontWeight="500" letterSpacing={1.5}
                  fill={s.color} filter="url(#sagloXs)">{words[1]}</text>
              </>
            ) : (
              <text x={s.x} y={CY + 9} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize={9} fontWeight="500" letterSpacing={2}
                fill={s.color} filter="url(#sagloXs)">{s.label}</text>
            )}
            {s.steps.map((step, j) => (
              <text key={j} x={s.x} y={CY + R + 20 + j * 15}
                textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7.5}
                letterSpacing={0.3} fill="rgba(237,233,224,.72)">{step}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function GovernancePipeline({ phase = 6 }) {
  const CY = 100, R = 38;

  const stages = [
    { x:130, label:"DISCOVER", color:T.gold,
      steps:["SNOW agent pulls inventory", "Policy & target definition", "Servers tagged for removal"] },
    { x:383, label:"GOVERN",   color:T.blue,
      steps:["Owner notified + buffer", "Exception window open", "CAB approval gate"] },
    { x:636, label:"EXECUTE",  color:T.amber,
      steps:["Config pushed to server", "Event triggers agent", "Silent removal runs"] },
    { x:889, label:"VERIFY",   color:T.green,
      steps:["Post-removal scan", "Detailed logging", "License reclaimed to SAM"] },
  ];

  return (
    <svg viewBox="0 0 1060 215" width="100%" style={{ display:"block", overflow:"visible" }}>
      <defs>
        <filter id="pglo" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="pgloXs" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Connecting lines — draw when next stage appears */}
      {stages.slice(0, -1).map((s, i) => phase >= i + 2 && (
        <path key={i}
          d={`M ${s.x + R} ${CY} L ${stages[i+1].x - R} ${CY}`}
          fill="none" stroke={`${stages[i+1].color}55`} strokeWidth={1.5}
          strokeDasharray={300} strokeDashoffset={300}
          style={{ animation: `drawPth 0.55s ease both` }}
        />
      ))}

      {/* Stage nodes */}
      {stages.map((s, i) => phase >= i + 1 && (
        <g key={i} style={{ animation: `nodeIn 0.45s ease both` }}>
          <circle cx={s.x} cy={CY} r={R * 1.9} fill={`${s.color}07`}
            style={{ animation: "pulseGlow 3.5s ease-in-out infinite" }}/>
          <circle cx={s.x} cy={CY} r={R} fill="rgba(10,8,6,.97)"
            stroke={s.color} strokeWidth={1.8} filter="url(#pglo)"/>
          <text x={s.x} y={CY - 9} textAnchor="middle"
            fontFamily="IBM Plex Mono" fontSize={7} letterSpacing={1}
            fill={`${s.color}55`}>{String(i+1).padStart(2,'0')}</text>
          <text x={s.x} y={CY + 9} textAnchor="middle"
            fontFamily="IBM Plex Mono" fontSize={8.5} fontWeight="500" letterSpacing={2}
            fill={s.color} filter="url(#pgloXs)">{s.label}</text>
          {s.steps.map((step, j) => (
            <text key={j} x={s.x} y={CY + R + 20 + j * 16}
              textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7.5}
              letterSpacing={0.3} fill="rgba(237,233,224,.72)">{step}</text>
          ))}
        </g>
      ))}
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

// ── Icon helpers (plain functions, not React components) ─────────
const iconMonitor = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="-10" y="-8" width="20" height="14" rx="2"/>
    <line x1="0" y1="6" x2="0" y2="10"/>
    <line x1="-5" y1="10" x2="5" y2="10"/>
  </g>
);
const iconDatabase = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
    <ellipse cx="0" cy="-5" rx="10" ry="3.8"/>
    <path d="M-10,-5 L-10,5 A10,3.8 0 0,0 10,5 L10,-5"/>
    <path d="M-10,-1 A10,3.8 0 0,0 10,-1" strokeDasharray="3 2"/>
  </g>
);
const iconServer = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
    <rect x="-10" y="-9" width="20" height="8" rx="2"/>
    <rect x="-10" y="1" width="20" height="8" rx="2"/>
    <circle cx="-5.5" cy="-5" r="1.8" fill={c} stroke="none"/>
    <circle cx="-5.5" cy="5" r="1.8" fill={c} stroke="none"/>
    <line x1="-1" y1="-5" x2="6" y2="-5" strokeWidth="1.2"/>
    <line x1="-1" y1="5" x2="6" y2="5" strokeWidth="1.2"/>
  </g>
);
const iconApps = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <rect x="-9" y="-9" width="7" height="7" rx="1.5"/>
    <rect x="2" y="-9" width="7" height="7" rx="1.5"/>
    <rect x="-9" y="2" width="7" height="7" rx="1.5"/>
    <rect x="2" y="2" width="7" height="7" rx="1.5"/>
  </g>
);
const iconTable = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <rect x="-10" y="-8" width="20" height="16" rx="2"/>
    <line x1="-10" y1="-2" x2="10" y2="-2"/>
    <line x1="0" y1="-8" x2="0" y2="8"/>
  </g>
);
const iconQueue = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <line x1="-9" y1="-6" x2="9" y2="-6"/>
    <line x1="-9" y1="0" x2="9" y2="0"/>
    <line x1="-9" y1="6" x2="5" y2="6"/>
    <polyline points="6,3 10,6 6,9"/>
  </g>
);
const iconRobot = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <rect x="-9" y="-7" width="18" height="14" rx="3"/>
    <circle cx="-3.5" cy="-1.5" r="2.2" fill={c} stroke="none" opacity="0.75"/>
    <circle cx="3.5" cy="-1.5" r="2.2" fill={c} stroke="none" opacity="0.75"/>
    <path d="M-3,4 Q0,6.5 3,4" strokeWidth="1.3"/>
    <line x1="0" y1="-7" x2="0" y2="-11"/>
    <circle cx="0" cy="-12.5" r="1.8" fill={c} stroke="none"/>
  </g>
);
const iconBrain = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <path d="M0,-9 C-6,-9 -10,-5 -10,0 C-10,5 -6,9 0,9 C6,9 10,5 10,0 C10,-5 6,-9 0,-9"/>
    <line x1="0" y1="-9" x2="0" y2="9" strokeDasharray="2 2"/>
    <line x1="-6" y1="-4" x2="6" y2="-4" strokeWidth="1.1"/>
    <line x1="-8" y1="1" x2="8" y2="1" strokeWidth="1.1"/>
    <line x1="-6" y1="5" x2="6" y2="5" strokeWidth="1.1"/>
  </g>
);
const iconShield = (c) => (
  <g fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0,-10 L9,-6 L9,2 C9,7 5,11 0,13 C-5,11 -9,7 -9,2 L-9,-6 Z"/>
    <line x1="0" y1="-3" x2="0" y2="4" strokeWidth="2"/>
    <circle cx="0" cy="7" r="1.5" fill={c} stroke="none"/>
  </g>
);

export function ISRAArchitecture({ phase = 6 }) {
  // Zone y bounds — taller layout for readability
  const DY1=0,   DY2=182;          // Dashboard
  const G1Y1=182, G1Y2=272;        // Gap 1
  const SY1=272, SY2=454;          // Supabase
  const G2Y1=454, G2Y2=544;        // Gap 2
  const AY1=544, AY2=700;          // Agent (156px — plenty of room)

  const DCY = (DY1+DY2)/2 + 6;    // Dashboard box center y
  const SCY = (SY1+SY2)/2 + 4;    // Supabase box center y
  const ACY = (AY1+AY2)/2;        // Agent center y (for arrow alignment)

  const BOX_H = 104;

  // Draws a component box with icon + labels
  const box = (cx, cy, w, color, label, sub, iconFn, pill) => {
    const bx = cx - w/2, by = cy - BOX_H/2;
    const ix = bx + 40, iy = cy;
    const tx = bx + 72;
    return (
      <g>
        <rect x={bx} y={by} width={w} height={BOX_H} rx={9}
          fill="rgba(4,4,8,.90)" stroke={`${color}30`} strokeWidth={1}/>
        <rect x={bx} y={by} width={w} height={BOX_H} rx={9}
          fill={`${color}06`}/>
        <circle cx={ix} cy={iy} r={22} fill={`${color}14`}
          style={{ animation:"pulseGlow 3.2s ease-in-out infinite" }}/>
        <g transform={`translate(${ix},${iy})`}>{iconFn(color)}</g>
        <text x={tx} y={cy-10} fontFamily="IBM Plex Mono" fontSize={11}
          fontWeight="500" letterSpacing={1.6} fill={color}>{label}</text>
        <text x={tx} y={cy+8} fontFamily="IBM Plex Mono" fontSize={9}
          fill="rgba(237,233,224,.6)">{sub}</text>
        {pill && (
          <text x={tx} y={cy+24} fontFamily="IBM Plex Mono" fontSize={8.5}
            fill={`${color}60`} letterSpacing={0.4}>{pill}</text>
        )}
      </g>
    );
  };

  // Zone band background + label row
  const zone = (y1, y2, color, label, tech) => (
    <g>
      <rect x={8} y={y1+3} width={1004} height={y2-y1-6} rx={12}
        fill={`${color}05`} stroke={`${color}25`} strokeWidth={1}/>
      <text x={26} y={y1+24} fontFamily="IBM Plex Mono" fontSize={11}
        fontWeight="600" letterSpacing={2.5} fill={color} opacity={0.9}>{label}</text>
      <text x={994} y={y1+24} textAnchor="end" fontFamily="IBM Plex Mono"
        fontSize={9} fill="rgba(237,233,224,.28)" letterSpacing={0.6}>{tech}</text>
    </g>
  );

  // Bidirectional animated connection between zones
  const conn = (y1, y2, cDown, cUp, label) => {
    const mx = 510, lx = mx-16, rx = mx+16, h = y2-y1;
    const midy = (y1+y2)/2;
    return (
      <g style={{ animation:"fade .5s ease both" }}>
        <line x1={lx} y1={y1} x2={lx} y2={y2}
          stroke={`${cDown}38`} strokeWidth={1.2} strokeDasharray="5 3"/>
        <polygon points={`${lx-5},${y2-11} ${lx+5},${y2-11} ${lx},${y2-2}`}
          fill={`${cDown}85`}/>
        <line x1={rx} y1={y1} x2={rx} y2={y2}
          stroke={`${cUp}38`} strokeWidth={1.2} strokeDasharray="5 3"/>
        <polygon points={`${rx-5},${y1+11} ${rx+5},${y1+11} ${rx},${y1+2}`}
          fill={`${cUp}85`}/>
        {/* Downward particle — starts at y1, fades in/out to avoid jarring jump */}
        <circle cx={lx} cy={y1} r={5} fill={cDown}>
          <animateMotion dur="1.8s" repeatCount="indefinite" path={`M0,0 L0,${h}`}/>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        {/* Upward particle — starts at y2, fades in/out */}
        <circle cx={rx} cy={y2} r={5} fill={cUp}>
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.9s" path={`M0,0 L0,${-h}`}/>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="1.8s" begin="0.9s" repeatCount="indefinite"/>
        </circle>
        <rect x={mx-88} y={midy-12} width={176} height={24} rx={5}
          fill="rgba(4,4,8,.96)" stroke="rgba(237,233,224,.12)" strokeWidth={1}/>
        <text x={mx} y={midy+5} textAnchor="middle" fontFamily="IBM Plex Mono"
          fontSize={9} fill="rgba(237,233,224,.5)" letterSpacing={0.6}>{label}</text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 1020 700" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display:"block" }}>
      <defs>
        <filter id="israglo" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── DASHBOARD ── */}
      {phase >= 1 && (
        <g style={{ animation:"nodeIn .55s ease both" }}>
          {zone(DY1, DY2, T.blue, "DASHBOARD", "Next.js · Vercel · Supabase Realtime")}
          {box(175, DCY, 278, T.blue, "APPS",  "Software inventory · Active filter",  iconApps,    null)}
          {box(510, DCY, 278, T.blue, "FLEET", "Endpoint status · Health monitoring", iconMonitor, null)}
          {box(845, DCY, 278, T.blue, "LOGS",  "Removal history · Live execution",    iconTable,   null)}
        </g>
      )}

      {/* ── CONNECTION 1: Dashboard ↔ Supabase ── */}
      {phase >= 2 && conn(G1Y1, G1Y2, T.blue, T.green, "REST API · Supabase Realtime")}

      {/* ── SUPABASE ── */}
      {phase >= 3 && (
        <g style={{ animation:"nodeIn .55s ease both" }}>
          {zone(SY1, SY2, T.green, "SUPABASE", "PostgreSQL · Row Level Security")}
          {box(175, SCY, 284, T.green, "isra.inventory",     "Software artifacts per endpoint",  iconDatabase, "isra.inventory")}
          {box(510, SCY, 284, T.green, "isra.endpoints",     "Registered server machines",       iconServer,   "isra.endpoints")}
          {box(845, SCY, 290, T.green, "isra.removal_tasks", "Job queue · Execution history",    iconQueue,    "isra.removal_tasks")}
        </g>
      )}

      {/* ── CONNECTION 2: Supabase ↔ Agent ── */}
      {phase >= 4 && conn(G2Y1, G2Y2, T.gold, T.gold, "Push inventory · Pull removal jobs")}

      {/* ── ISRA AGENT ── */}
      {phase >= 5 && (
        <g style={{ animation:"nodeIn .55s ease both" }}>
          {zone(AY1, AY2, T.gold, "ISRA AGENT", "")}
          {/* Tech stack subtitle — kept left to avoid Policy Engine overlap */}
          <text x={26} y={AY1+38} fontFamily="IBM Plex Mono" fontSize={8}
            fill={`${T.gold}50`} letterSpacing={1}>
            Python · FastAPI · systemd · .deb / .rpm
          </text>

          {/* Pipeline steps — start at AY1+44 to clear zone label row */}
          {[
            { cx:88,  w:128, label:"COLLECT",      sub:"apt · snap · pip · npm",  color:T.gold,  icon:iconRobot },
            { cx:258, w:148, label:"INTELLIGENCE",  sub:"Normalize · AI analysis", color:T.gold,  icon:iconBrain },
            { cx:438, w:128, label:"PLAN",          sub:"Build removal plan",      color:T.blue,  icon:iconApps  },
            { cx:598, w:118, label:"RUN",           sub:"Execute commands",        color:T.gold,  icon:iconServer},
            { cx:758, w:128, label:"VERIFY",        sub:"Confirm removal",         color:T.green, icon:iconTable },
          ].map((s, i, arr) => {
            const by = AY1 + 44, bh = AY2 - AY1 - 56;
            const bx = s.cx - s.w/2;
            const iconY = AY1 + 70;
            const labelY = AY1 + 98;
            const subY   = AY1 + 112;
            const arrowY = AY1 + 44 + bh/2;
            return (
              <g key={s.label}>
                <rect x={bx} y={by} width={s.w} height={bh} rx={8}
                  fill="rgba(4,4,8,.90)" stroke={`${s.color}32`} strokeWidth={1}/>
                <rect x={bx} y={by} width={s.w} height={bh} rx={8}
                  fill={`${s.color}07`}/>
                <circle cx={s.cx} cy={iconY} r={18} fill={`${s.color}16`}
                  style={{ animation:"pulseGlow 3.2s ease-in-out infinite" }}/>
                <g transform={`translate(${s.cx},${iconY})`}>{s.icon(s.color)}</g>
                <text x={s.cx} y={labelY} textAnchor="middle" fontFamily="IBM Plex Mono"
                  fontSize={10} fontWeight="500" letterSpacing={1.5} fill={s.color}>{s.label}</text>
                <text x={s.cx} y={subY} textAnchor="middle" fontFamily="IBM Plex Mono"
                  fontSize={8} fill="rgba(237,233,224,.55)">{s.sub}</text>
                {i < arr.length-1 && (
                  <g>
                    <line x1={s.cx+s.w/2+2} y1={arrowY} x2={arr[i+1].cx-arr[i+1].w/2-10} y2={arrowY}
                      stroke={`${T.gold}60`} strokeWidth={1.5} strokeDasharray="4 3"
                      style={{ animation:"arrowMove .8s linear infinite" }}/>
                    <polygon
                      points={`${arr[i+1].cx-arr[i+1].w/2-14},${arrowY-5} ${arr[i+1].cx-arr[i+1].w/2-4},${arrowY} ${arr[i+1].cx-arr[i+1].w/2-14},${arrowY+5}`}
                      fill={`${T.gold}85`}/>
                  </g>
                )}
              </g>
            );
          })}

          {/* Policy Engine — aligned with pipeline boxes */}
          {phase >= 6 && (
            <g style={{ animation:"nodeIn .45s ease both" }}>
              <rect x={900} y={AY1+44} width={112} height={AY2-AY1-56} rx={8}
                fill="rgba(248,113,113,.08)" stroke={`${T.red}40`} strokeWidth={1}/>
              <g transform={`translate(${956},${AY1+70})`}>{iconShield(T.red)}</g>
              <text x={956} y={AY1+98} textAnchor="middle" fontFamily="IBM Plex Mono"
                fontSize={9} fontWeight="500" letterSpacing={1.4} fill={T.red}>POLICY</text>
              <text x={956} y={AY1+110} textAnchor="middle" fontFamily="IBM Plex Mono"
                fontSize={9} fontWeight="500" letterSpacing={1.4} fill={T.red}>ENGINE</text>
              <text x={956} y={AY1+124} textAnchor="middle" fontFamily="IBM Plex Mono"
                fontSize={7.5} fill="rgba(248,113,113,.6)">kernel · libc · glibc</text>
            </g>
          )}
        </g>
      )}
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
