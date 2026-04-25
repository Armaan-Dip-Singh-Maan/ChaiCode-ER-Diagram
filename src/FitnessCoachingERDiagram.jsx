import { useState } from "react";

const EW = 270, AH = 23, HH = 44, PAD = 9;
const getH = (n) => HH + n * AH + PAD * 2;

const RAW = [
  {
    id: "User", x: 18, y: 52, hue: "#3730a3", light: "#818cf8",
    attrs: [
      { name: "user_id", tag: "PK", type: "SERIAL" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "full_name", type: "VARCHAR(255)" },
      { name: "phone", type: "VARCHAR(20)" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "Trainer", x: 308, y: 52, hue: "#14532d", light: "#4ade80",
    attrs: [
      { name: "trainer_id", tag: "PK", type: "SERIAL" },
      { name: "user_id", tag: "FK", type: "BIGINT" },
      { name: "bio", type: "TEXT" },
      { name: "specialties", type: "VARCHAR(255)" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "Client", x: 598, y: 52, hue: "#0c4a6e", light: "#38bdf8",
    attrs: [
      { name: "client_id", tag: "PK", type: "SERIAL" },
      { name: "user_id", tag: "FK", type: "BIGINT" },
      { name: "goals", type: "TEXT" },
      { name: "timezone", type: "VARCHAR(50)" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "Plan", x: 18, y: 268, hue: "#713f12", light: "#fbbf24",
    attrs: [
      { name: "plan_id", tag: "PK", type: "SERIAL" },
      { name: "trainer_id", tag: "FK", type: "BIGINT" },
      { name: "title", type: "VARCHAR(255)" },
      { name: "plan_kind", type: "VARCHAR(50)" },
      { name: "plan_price", type: "DECIMAL(10,2)" },
      { name: "duration_weeks", type: "INT" },
      { name: "workout_diet_abstract", type: "TEXT" },
    ]
  },
  {
    id: "Subscription", x: 378, y: 268, hue: "#1e3a8a", light: "#60a5fa",
    attrs: [
      { name: "subscription_id", tag: "PK", type: "SERIAL" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "plan_id", tag: "FK", type: "BIGINT" },
      { name: "assigned_trainer_id", tag: "FK", type: "BIGINT" },
      { name: "start_date", type: "DATE" },
      { name: "end_date", type: "DATE" },
      { name: "status", type: "VARCHAR(30)" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "Payment", x: 738, y: 268, hue: "#064e3b", light: "#34d399",
    attrs: [
      { name: "payment_id", tag: "PK", type: "SERIAL" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "amount", type: "DECIMAL(10,2)" },
      { name: "paid_at", type: "TIMESTAMP" },
      { name: "payment_method", type: "VARCHAR(50)" },
      { name: "payment_status", type: "VARCHAR(30)" },
    ]
  },
  {
    id: "Session", x: 18, y: 548, hue: "#7f1d1d", light: "#f87171",
    attrs: [
      { name: "session_id", tag: "PK", type: "SERIAL" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "trainer_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "scheduled_at", type: "TIMESTAMP" },
      { name: "session_type", type: "VARCHAR(50)" },
      { name: "status", type: "VARCHAR(30)" },
    ]
  },
  {
    id: "CheckIn", x: 378, y: 548, hue: "#581c87", light: "#c084fc",
    attrs: [
      { name: "check_in_id", tag: "PK", type: "SERIAL" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "submitted_at", type: "TIMESTAMP" },
      { name: "week_number", type: "INT" },
      { name: "report_text", type: "TEXT" },
    ]
  },
  {
    id: "ProgressEntry", x: 18, y: 838, hue: "#042f2e", light: "#2dd4bf",
    attrs: [
      { name: "progress_id", tag: "PK", type: "SERIAL" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "recorded_at", type: "TIMESTAMP" },
      { name: "weight_kg", type: "DECIMAL(5,2)" },
      { name: "body_measurements", type: "JSONB" },
      { name: "notes", type: "TEXT" },
    ]
  },
  {
    id: "TrainerNote", x: 448, y: 838, hue: "#3b0764", light: "#e879f9",
    attrs: [
      { name: "note_id", tag: "PK", type: "SERIAL" },
      { name: "trainer_id", tag: "FK", type: "BIGINT" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "body", type: "TEXT" },
      { name: "visibility", type: "VARCHAR(30)" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
];

function buildEM() {
  const em = {};
  RAW.forEach(e => {
    const h = getH(e.attrs.length);
    em[e.id] = { ...e, h, right: e.x + EW, bottom: e.y + h, cx: e.x + EW / 2, cy: e.y + h / 2 };
  });
  return em;
}

const el = (x1, y1, x2, y2) => {
  const mx = Math.round((x1 + x2) / 2);
  return `M ${x1},${y1} H ${mx} V ${y2} H ${x2}`;
};

export default function FitnessCoachingERDiagram() {
  const [hovered, setHovered] = useState(null);
  const em = buildEM();
  const {
    User: U, Trainer: T, Client: Cl, Plan: P, Subscription: Sub,
    Payment: Pay, Session: Ses, CheckIn: CI, ProgressEntry: PE, TrainerNote: TN
  } = em;

  const entities = RAW.map(r => em[r.id]);

  const connections = [
    {
      d: el(U.right, U.cy, T.x, T.cy),
      c1: { x: U.right + 6, y: U.cy - 4, v: "1" },
      cN: { x: T.x - 4, y: T.cy - 4, v: "0..1", ta: "end" },
      rel: { x: (U.right + T.x) / 2 - 28, y: Math.min(U.cy, T.cy) - 11, t: "has profile" },
      color: "#818cf8"
    },
    {
      d: `M ${U.right},${U.cy} V ${320} H ${Cl.x} V ${Cl.cy}`,
      c1: { x: U.right + 5, y: U.cy - 4, v: "1" },
      cN: { x: Cl.x - 4, y: Cl.cy - 4, v: "0..1", ta: "end" },
      rel: { x: 430, y: 310, t: "has profile" },
      color: "#38bdf8"
    },
    {
      d: `M ${T.cx},${T.bottom} V ${(T.bottom + P.y) / 2} H ${P.cx} V ${P.y}`,
      c1: { x: T.cx + 5, y: T.bottom + 12, v: "1" },
      cN: { x: P.cx + 5, y: P.y - 6, v: "N" },
      rel: { x: T.cx + 8, y: (T.bottom + P.y) / 2, t: "creates" },
      color: "#4ade80"
    },
    {
      d: el(P.right, P.cy, Sub.x, Sub.cy),
      c1: { x: P.right + 6, y: P.cy - 4, v: "1" },
      cN: { x: Sub.x - 4, y: Sub.cy - 4, v: "N", ta: "end" },
      rel: { x: (P.right + Sub.x) / 2 - 22, y: Math.min(P.cy, Sub.cy) - 11, t: "enrolled as" },
      color: "#fbbf24"
    },
    {
      d: `M ${Cl.cx},${Cl.bottom} V ${(Cl.bottom + Sub.y) / 2} H ${Sub.cx} V ${Sub.y}`,
      c1: { x: Cl.cx + 5, y: Cl.bottom + 12, v: "1" },
      cN: { x: Sub.cx + 5, y: Sub.y - 6, v: "N" },
      rel: { x: Sub.cx + 12, y: (Cl.bottom + Sub.y) / 2, t: "enrolls" },
      color: "#38bdf8"
    },
    {
      d: `M ${T.cx},${T.bottom} V ${Sub.y - 18} H ${Sub.cx} V ${Sub.y}`,
      c1: { x: T.cx + 5, y: T.bottom + 12, v: "1" },
      cN: { x: Sub.cx - 8, y: Sub.y - 6, v: "N" },
      rel: { x: 320, y: Sub.y - 36, t: "assigned to" },
      color: "#4ade80"
    },
    {
      d: el(Sub.right, Sub.cy, Pay.x, Pay.cy),
      c1: { x: Sub.right + 6, y: Sub.cy - 4, v: "1" },
      cN: { x: Pay.x - 4, y: Pay.cy - 4, v: "N", ta: "end" },
      rel: { x: (Sub.right + Pay.x) / 2 - 18, y: Math.min(Sub.cy, Pay.cy) - 11, t: "paid by" },
      color: "#34d399"
    },
    {
      d: `M ${Cl.cx},${Cl.bottom} V ${420} H ${Ses.cx} V ${Ses.y}`,
      c1: { x: Cl.cx + 5, y: Cl.bottom + 12, v: "1" },
      cN: { x: Ses.cx + 5, y: Ses.y - 6, v: "N" },
      rel: { x: 420, y: 430, t: "books" },
      color: "#f87171"
    },
    {
      d: `M ${T.cx},${T.bottom} V ${470} H ${Ses.cx} V ${Ses.y}`,
      c1: { x: T.cx + 5, y: T.bottom + 12, v: "1" },
      cN: { x: Ses.cx - 8, y: Ses.y - 6, v: "N" },
      rel: { x: 250, y: 470, t: "hosts" },
      color: "#4ade80"
    },
    {
      d: `M ${Sub.cx},${Sub.bottom} V ${Ses.y}`,
      c1: { x: Sub.cx + 5, y: Sub.bottom + 12, v: "0..1" },
      cN: { x: Ses.cx + 5, y: Ses.y - 6, v: "N" },
      rel: { x: Sub.cx + 14, y: (Sub.bottom + Ses.y) / 2, t: "context" },
      color: "#60a5fa",
      dash: "4 4"
    },
    {
      d: `M ${Sub.cx},${Sub.bottom} V ${CI.y}`,
      c1: { x: Sub.cx - 8, y: Sub.bottom + 12, v: "0..1" },
      cN: { x: CI.cx + 5, y: CI.y - 6, v: "N" },
      rel: { x: Sub.cx + 12, y: (Sub.bottom + CI.y) / 2, t: "for plan" },
      color: "#60a5fa",
      dash: "4 4"
    },
    {
      d: `M ${Cl.cx},${Cl.bottom} V ${500} H ${CI.cx} V ${CI.y}`,
      c1: { x: Cl.cx + 5, y: Cl.bottom + 12, v: "1" },
      cN: { x: CI.cx + 5, y: CI.y - 6, v: "N" },
      rel: { x: 520, y: 500, t: "submits" },
      color: "#c084fc"
    },
    {
      d: `M ${Cl.cx},${Cl.bottom} V ${720} H ${PE.cx} V ${PE.y}`,
      c1: { x: Cl.cx + 5, y: Cl.bottom + 12, v: "1" },
      cN: { x: PE.cx + 5, y: PE.y - 6, v: "N" },
      rel: { x: 400, y: 720, t: "tracks" },
      color: "#2dd4bf"
    },
    {
      d: `M ${T.cx},${T.bottom} V ${780} H ${TN.cx} V ${TN.y}`,
      c1: { x: T.cx + 5, y: T.bottom + 12, v: "1" },
      cN: { x: TN.cx - 8, y: TN.y - 6, v: "N" },
      rel: { x: 280, y: 780, t: "writes" },
      color: "#e879f9"
    },
    {
      d: `M ${Cl.cx},${Cl.bottom} V ${760} H ${TN.cx} V ${TN.y}`,
      c1: { x: Cl.cx + 5, y: Cl.bottom + 12, v: "1" },
      cN: { x: TN.cx + 8, y: TN.y - 6, v: "N" },
      rel: { x: 620, y: 760, t: "about" },
      color: "#38bdf8"
    },
  ];

  const SVG_W = 1100, SVG_H = 1165;

  const renderEntity = (e) => {
    const isHov = hovered === e.id;
    return (
      <g key={e.id} onMouseEnter={() => setHovered(e.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "default" }}>
        <rect x={e.x + 3} y={e.y + 3} width={EW} height={e.h} rx={7} fill="rgba(0,0,0,0.55)" />
        <rect x={e.x} y={e.y} width={EW} height={e.h} rx={7}
          fill="#060d1a"
          stroke={isHov ? e.light : e.hue}
          strokeWidth={isHov ? 2 : 1.5}
        />
        <rect x={e.x} y={e.y} width={EW} height={HH} rx={7} fill={e.hue} />
        <rect x={e.x} y={e.y + HH - 7} width={EW} height={7} fill={e.hue} />

        <text x={e.x + EW / 2} y={e.y + 29}
          fill="white" fontSize={12.5} fontWeight="700"
          textAnchor="middle" fontFamily="'JetBrains Mono', 'Fira Code', monospace">
          {e.id}
        </text>

        <line x1={e.x} y1={e.y + HH} x2={e.x + EW} y2={e.y + HH}
          stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {e.attrs.map((a, i) => {
          const ay = e.y + HH + PAD + i * AH;
          const isPK = a.tag === "PK", isFK = a.tag === "FK";
          const textX = e.x + (a.tag ? 29 : 10);
          const textLen = a.name.length * 6.7;
          const typeStr = a.type || "";
          return (
            <g key={a.name}>
              {i > 0 && <line x1={e.x + 5} y1={ay} x2={e.x + EW - 5} y2={ay} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />}
              {isPK && <rect x={e.x + 1} y={ay + 1} width={EW - 2} height={AH - 2} rx={2} fill="rgba(251,191,36,0.09)" />}
              {isFK && <rect x={e.x + 1} y={ay + 1} width={EW - 2} height={AH - 2} rx={2} fill="rgba(96,165,250,0.06)" />}
              {a.tag && (
                <text x={e.x + 7} y={ay + 15.5}
                  fill={isPK ? "#fbbf24" : "#60a5fa"}
                  fontSize={8.5} fontFamily="monospace" fontWeight="800">
                  {a.tag}
                </text>
              )}
              <text x={textX} y={ay + 15.5}
                fill={isPK ? "#fef3c7" : isFK ? "#bae6fd" : "#94a3b8"}
                fontSize={10.5} fontFamily="'JetBrains Mono', monospace">
                {a.name}
              </text>
              {isPK && (
                <line x1={textX} y1={ay + 17} x2={textX + textLen} y2={ay + 17}
                  stroke="#fef3c7" strokeWidth={0.8} opacity={0.7} />
              )}
              {typeStr && (
                <text
                  x={e.x + EW - 7}
                  y={ay + 15.5}
                  fill="#475569"
                  fontSize={7.5}
                  fontFamily="'JetBrains Mono', monospace"
                  textAnchor="end"
                >
                  {typeStr}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const notes = [
    {
      title: "Identity vs coaching roles",
      hue: "#3730a3",
      pts: [
        "User holds login/contact; Trainer and Client each reference user_id (0..1 each).",
        "Separates authentication from coach/client business profiles.",
      ]
    },
    {
      title: "Plans, subscriptions & payments",
      hue: "#713f12",
      pts: [
        "Plan is catalog; Subscription is enrollment with start/end, status, assigned_trainer_id.",
        "Many clients can subscribe to the same plan; one client can have many subscriptions over time.",
        "Payment is 1:N from Subscription for renewals, partial payments, or refund rows.",
      ]
    },
    {
      title: "Sessions vs check-ins",
      hue: "#7f1d1d",
      pts: [
        "Session = scheduled calendar events (consult, live call); optional subscription_id for context.",
        "CheckIn = async weekly/async reports — different entity from Session.",
      ]
    },
    {
      title: "Progress & trainer notes",
      hue: "#042f2e",
      pts: [
        "ProgressEntry stores metrics (weight_kg, body_measurements JSON) — not merged into User.",
        "TrainerNote is separate from CheckIn; optional subscription_id ties feedback to an enrollment.",
      ]
    },
  ];

  return (
    <div style={{ background: "#020812", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #020812; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
      `}</style>

      <div style={{
        background: "linear-gradient(160deg, #0a1f14 0%, #060d1a 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: "#334155", letterSpacing: 3, marginBottom: 4 }}>DATABASE DESIGN · ER DIAGRAM</div>
          <h1 style={{ margin: 0, fontSize: 19, color: "#e2e8f0", fontWeight: 800, letterSpacing: -0.5 }}>
            Online Fitness Coaching Platform
          </h1>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 12 }}>
            10 entities · subscriptions, sessions, check-ins, progress &amp; payments · PK/FK labels &amp; cardinalities
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { c: "#fbbf24", t: "PK  Primary Key" },
            { c: "#60a5fa", t: "FK  Foreign Key" },
            { c: "#60a5fa", t: "Optional FK  dashed line" },
            { c: "#475569", t: "Types  SERIAL, JSONB, …" },
          ].map(l => (
            <div key={l.t} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 6, padding: "5px 11px",
            }}>
              <div style={{ width: 8, height: 8, background: l.c, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>{l.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{
          overflowX: "auto", overflowY: "auto",
          border: "1px solid #1e293b", borderRadius: 12,
          background: "#020c1b",
          maxHeight: "72vh",
        }}>
          <svg width={SVG_W} height={SVG_H} style={{ display: "block" }}>
            <defs>
              <pattern id="dotFit" width={22} height={22} patternUnits="userSpaceOnUse">
                <circle cx={1.5} cy={1.5} r={0.9} fill="#0d1f38" />
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#dotFit)" />

            <text x={18} y={36} fill="rgba(74,222,128,0.2)" fontSize={10} fontFamily="monospace" letterSpacing={3}>IDENTITY &amp; ROLES</text>
            <line x1={14} y1={248} x2={1086} y2={248} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={18} y={262} fill="rgba(251,191,36,0.18)" fontSize={10} fontFamily="monospace" letterSpacing={3}>PLANS &amp; COMMERCE</text>
            <line x1={14} y1={528} x2={1086} y2={528} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={18} y={542} fill="rgba(248,113,113,0.18)" fontSize={10} fontFamily="monospace" letterSpacing={3}>SESSIONS &amp; CHECK-INS</text>
            <line x1={14} y1={818} x2={1086} y2={818} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={18} y={832} fill="rgba(45,212,191,0.18)" fontSize={10} fontFamily="monospace" letterSpacing={3}>PROGRESS &amp; NOTES</text>

            {connections.map((conn, i) => (
              <g key={i}>
                <path d={conn.d} fill="none" stroke={conn.color} strokeWidth={1.3} opacity={0.38} strokeDasharray={conn.dash || "5 3"} />
                <text x={conn.c1.x} y={conn.c1.y} fill={conn.color} fontSize={11} fontFamily="monospace" fontWeight="700" textAnchor={conn.c1.ta || "start"}>{conn.c1.v}</text>
                <text x={conn.cN.x} y={conn.cN.y} fill={conn.color} fontSize={11} fontFamily="monospace" fontWeight="700" textAnchor={conn.cN.ta || "start"}>{conn.cN.v}</text>
                <rect x={conn.rel.x - 2} y={conn.rel.y - 10} width={conn.rel.t.length * 5.8 + 6} height={13} rx={3} fill="#020812" />
                <text x={conn.rel.x + 1} y={conn.rel.y} fill="#2d3f55" fontSize={8.5} fontFamily="system-ui" fontStyle="italic">{conn.rel.t}</text>
              </g>
            ))}

            {entities.map(renderEntity)}
          </svg>
        </div>

        <p style={{ color: "#1e293b", fontSize: 11, textAlign: "center", margin: "6px 0 18px", fontFamily: "monospace" }}>
          ↕ scroll to view full diagram
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(258px, 1fr))", gap: 14 }}>
          {notes.map(n => (
            <div key={n.title} style={{
              background: "#060d1a", border: `1px solid ${n.hue}`,
              borderRadius: 10, padding: "13px 15px",
            }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 12.5, marginBottom: 9 }}>{n.title}</div>
              <ul style={{ margin: 0, paddingLeft: 15 }}>
                {n.pts.map((p, i) => (
                  <li key={i} style={{ color: "#475569", fontSize: 11.5, marginBottom: 5, lineHeight: 1.45 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, background: "#060d1a", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "11px 16px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>Entity Summary</span>
            <span style={{ color: "#334155", fontSize: 11, fontFamily: "monospace" }}>10 entities</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead>
                <tr style={{ background: "#0a1628" }}>
                  {["Entity", "Role", "Primary Key", "Foreign Keys", "Purpose"].map(h => (
                    <th key={h} style={{ padding: "8px 13px", color: "#475569", textAlign: "left", fontFamily: "monospace", fontSize: 10, fontWeight: 600, borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["User", "Identity", "user_id", "—", "Core account / contact"],
                  ["Trainer", "Role", "trainer_id", "user_id", "Coach profile"],
                  ["Client", "Role", "client_id", "user_id", "Client profile"],
                  ["Plan", "Catalog", "plan_id", "trainer_id", "Sellable program / consultation package"],
                  ["Subscription", "Enrollment", "subscription_id", "client_id, plan_id, assigned_trainer_id", "Active enrollment & dates"],
                  ["Payment", "Commerce", "payment_id", "subscription_id", "Payments & renewals (1:N)"],
                  ["Session", "Scheduling", "session_id", "client_id, trainer_id, subscription_id", "Scheduled consultations / live calls"],
                  ["CheckIn", "Reporting", "check_in_id", "client_id, subscription_id", "Weekly/async check-in reports"],
                  ["ProgressEntry", "Metrics", "progress_id", "client_id", "Weight & measurements (not on User)"],
                  ["TrainerNote", "Feedback", "note_id", "trainer_id, client_id, subscription_id", "Private coach notes"],
                ].map(([name, role, pk, fks, purpose], i) => (
                  <tr key={name} style={{ background: i % 2 ? "#060d1a" : "#040a14" }}>
                    <td style={{ padding: "8px 13px", color: RAW.find(r => r.id === name)?.light || "#94a3b8", fontFamily: "monospace", fontWeight: 600, fontSize: 11 }}>{name}</td>
                    <td style={{ padding: "8px 13px", color: "#64748b", fontSize: 10, fontFamily: "monospace" }}>{role}</td>
                    <td style={{ padding: "8px 13px", color: "#fbbf24", fontFamily: "monospace", fontSize: 10.5 }}>{pk}</td>
                    <td style={{ padding: "8px 13px", color: "#60a5fa", fontFamily: "monospace", fontSize: 10 }}>{fks}</td>
                    <td style={{ padding: "8px 13px", color: "#334155", fontSize: 11 }}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
