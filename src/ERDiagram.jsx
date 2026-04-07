import { useState } from "react";

/** Wider boxes so attribute name + SQL type fit on one row */
const EW = 270, AH = 23, HH = 44, PAD = 9;
const getH = (n) => HH + n * AH + PAD * 2;

/** PostgreSQL-style types — compact labels */
const RAW = [
  {
    id: "User", x: 18, y: 52, hue: "#3730a3", light: "#818cf8",
    attrs: [
      { name: "user_id", tag: "PK", type: "SERIAL" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "full_name", type: "VARCHAR(255)" },
      { name: "phone", type: "VARCHAR(30)" },
      { name: "created_at", type: "TIMESTAMP" },
      { name: "is_active", type: "BOOLEAN" },
    ]
  },
  {
    id: "Trainer", x: 365, y: 52, hue: "#1e3a8a", light: "#60a5fa",
    attrs: [
      { name: "trainer_id", tag: "PK", type: "SERIAL" },
      { name: "user_id", tag: "FK", type: "BIGINT" },
      { name: "bio", type: "TEXT" },
      { name: "specialization", type: "VARCHAR(150)" },
      { name: "is_accepting_clients", type: "BOOLEAN" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "Client", x: 712, y: 52, hue: "#064e3b", light: "#34d399",
    attrs: [
      { name: "client_id", tag: "PK", type: "SERIAL" },
      { name: "user_id", tag: "FK", type: "BIGINT" },
      { name: "goal_summary", type: "TEXT" },
      { name: "timezone", type: "VARCHAR(64)" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "Plan", x: 365, y: 318, hue: "#0c4a6e", light: "#38bdf8",
    attrs: [
      { name: "plan_id", tag: "PK", type: "SERIAL" },
      { name: "trainer_id", tag: "FK", type: "BIGINT" },
      { name: "title", type: "VARCHAR(200)" },
      { name: "description", type: "TEXT" },
      { name: "duration_weeks", type: "INT" },
      { name: "price_cents", type: "BIGINT" },
      { name: "plan_kind", type: "VARCHAR(40)" },
      { name: "includes_live_sessions", type: "BOOLEAN" },
      { name: "workout_diet_abstract", type: "TEXT" },
    ]
  },
  {
    id: "Subscription", x: 200, y: 628, hue: "#78350f", light: "#fbbf24", isJunction: true,
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
    id: "Payment", x: 530, y: 628, hue: "#7f1d1d", light: "#f87171",
    attrs: [
      { name: "payment_id", tag: "PK", type: "SERIAL" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "amount_cents", type: "BIGINT" },
      { name: "currency", type: "CHAR(3)" },
      { name: "status", type: "VARCHAR(30)" },
      { name: "paid_at", type: "TIMESTAMP" },
      { name: "provider_ref", type: "VARCHAR(120)" },
    ]
  },
  {
    id: "Session", x: 18, y: 938, hue: "#431407", light: "#fb923c",
    attrs: [
      { name: "session_id", tag: "PK", type: "SERIAL" },
      { name: "trainer_id", tag: "FK", type: "BIGINT" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "scheduled_start", type: "TIMESTAMPTZ" },
      { name: "scheduled_end", type: "TIMESTAMPTZ" },
      { name: "session_type", type: "VARCHAR(40)" },
      { name: "status", type: "VARCHAR(30)" },
      { name: "meeting_url", type: "VARCHAR(500)" },
    ]
  },
  {
    id: "CheckIn", x: 365, y: 938, hue: "#3b0764", light: "#c084fc",
    attrs: [
      { name: "check_in_id", tag: "PK", type: "SERIAL" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "submitted_at", type: "TIMESTAMPTZ" },
      { name: "period_label", type: "VARCHAR(40)" },
      { name: "client_report", type: "TEXT" },
      { name: "adherence_self_score", type: "SMALLINT" },
      { name: "photo_urls", type: "TEXT" },
    ]
  },
  {
    id: "ProgressEntry", x: 712, y: 628, hue: "#042f2e", light: "#2dd4bf",
    attrs: [
      { name: "progress_id", tag: "PK", type: "SERIAL" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "recorded_at", type: "DATE" },
      { name: "weight_kg", type: "DECIMAL(5,2)" },
      { name: "body_measurements", type: "JSONB" },
      { name: "notes", type: "TEXT" },
      { name: "source", type: "VARCHAR(30)" },
    ]
  },
  {
    id: "TrainerNote", x: 712, y: 938, hue: "#4c1d95", light: "#a78bfa",
    attrs: [
      { name: "note_id", tag: "PK", type: "SERIAL" },
      { name: "trainer_id", tag: "FK", type: "BIGINT" },
      { name: "client_id", tag: "FK", type: "BIGINT" },
      { name: "subscription_id", tag: "FK", type: "BIGINT" },
      { name: "content", type: "TEXT" },
      { name: "created_at", type: "TIMESTAMPTZ" },
      { name: "visibility", type: "VARCHAR(20)" },
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

export default function ERDiagram() {
  const [hovered, setHovered] = useState(null);
  const em = buildEM();
  const U = em.User, T = em.Trainer, C = em.Client, Pl = em.Plan,
    Sub = em.Subscription, Pay = em.Payment, Ses = em.Session,
    CI = em.CheckIn, PE = em.ProgressEntry, TN = em.TrainerNote;

  const entities = RAW.map(r => em[r.id]);

  const connections = [
    {
      d: el(U.right, U.cy, T.x, T.cy),
      c1: { x: U.right + 6, y: U.cy - 4, v: "1" },
      cN: { x: T.x - 4, y: T.cy - 4, v: "0..1", ta: "end" },
      rel: { x: (U.right + T.x) / 2 - 28, y: Math.min(U.cy, T.cy) - 11, t: "trainer profile" },
      color: "#818cf8"
    },
    {
      d: el(U.right, U.cy, C.x, C.cy),
      c1: { x: U.right + 6, y: U.cy - 4, v: "1" },
      cN: { x: C.x - 4, y: C.cy - 4, v: "0..1", ta: "end" },
      rel: { x: (U.right + C.x) / 2 - 22, y: Math.min(U.cy, C.cy) - 11, t: "client profile" },
      color: "#34d399"
    },
    {
      d: `M ${T.cx},${T.bottom} V ${Pl.y}`,
      c1: { x: T.cx + 5, y: T.bottom + 12, v: "1" },
      cN: { x: Pl.cx + 5, y: Pl.y - 6, v: "N" },
      rel: { x: T.cx + 10, y: (T.bottom + Pl.y) / 2, t: "creates / sells" },
      color: "#38bdf8"
    },
    {
      d: `M ${C.cx},${C.bottom} V ${Sub.cy} H ${Sub.right}`,
      c1: { x: C.cx + 5, y: C.bottom + 12, v: "1" },
      cN: { x: Sub.right + 5, y: Sub.cy - 4, v: "N", ta: "start" },
      rel: { x: (C.cx + Sub.cx) / 2, y: (C.bottom + Sub.cy) / 2 - 6, t: "enrolls" },
      color: "#fbbf24"
    },
    {
      d: `M ${Pl.cx},${Pl.bottom} V ${Sub.cy} H ${Sub.x}`,
      c1: { x: Pl.cx + 5, y: Pl.bottom + 12, v: "1" },
      cN: { x: Sub.x - 5, y: Sub.cy - 4, v: "N", ta: "end" },
      rel: { x: Pl.cx - 35, y: (Pl.bottom + Sub.cy) / 2, t: "instance of" },
      color: "#fbbf24"
    },
    {
      d: `M ${T.cx},${T.bottom + 80} V ${Sub.cy} H ${Sub.x}`,
      c1: { x: T.cx - 12, y: T.bottom + 50, v: "1" },
      cN: { x: Sub.x - 5, y: Sub.cy + 12, v: "N", ta: "end" },
      rel: { x: T.x - 8, y: Sub.cy - 50, t: "assigned coach" },
      color: "#60a5fa"
    },
    {
      d: el(Sub.right, Sub.cy, Pay.x, Pay.cy),
      c1: { x: Sub.right + 6, y: Sub.cy - 4, v: "1" },
      cN: { x: Pay.x - 4, y: Pay.cy - 4, v: "N", ta: "end" },
      rel: { x: (Sub.right + Pay.x) / 2 - 22, y: Math.min(Sub.cy, Pay.cy) - 11, t: "paid via" },
      color: "#f87171"
    },
    {
      d: `M ${Sub.cx},${Sub.bottom} V ${Ses.cy} H ${Ses.right}`,
      c1: { x: Sub.cx - 12, y: Sub.bottom + 12, v: "1" },
      cN: { x: Ses.right + 4, y: Ses.cy - 4, v: "0..N", ta: "start" },
      rel: { x: Sub.cx - 45, y: (Sub.bottom + Ses.cy) / 2, t: "scopes (opt.)" },
      color: "#fb923c"
    },
    {
      d: `M ${T.cx},${T.bottom + 120} V ${Ses.cy} H ${Ses.x}`,
      c1: { x: T.cx - 18, y: T.bottom + 90, v: "1" },
      cN: { x: Ses.x - 5, y: Ses.cy - 4, v: "N", ta: "end" },
      rel: { x: T.x - 5, y: Ses.cy - 28, t: "conducts" },
      color: "#fb923c"
    },
    {
      d: `M ${C.cx},${C.bottom + 40} V ${Ses.cy} H ${Ses.x}`,
      c1: { x: C.cx + 5, y: C.bottom + 28, v: "1" },
      cN: { x: Ses.x - 5, y: Ses.cy + 14, v: "N", ta: "end" },
      rel: { x: C.cx + 14, y: Ses.cy - 36, t: "books / attends" },
      color: "#fb923c"
    },
    {
      d: `M ${Sub.cx},${Sub.bottom} V ${CI.cy} H ${CI.x}`,
      c1: { x: Sub.cx + 8, y: Sub.bottom + 12, v: "1" },
      cN: { x: CI.x - 5, y: CI.cy - 4, v: "N", ta: "end" },
      rel: { x: (Sub.cx + CI.cx) / 2 - 15, y: (Sub.bottom + CI.cy) / 2 + 8, t: "weekly check-ins" },
      color: "#c084fc"
    },
    {
      d: `M ${C.cx},${C.bottom + 60} V ${CI.cy} H ${CI.x}`,
      c1: { x: C.cx + 5, y: C.bottom + 48, v: "1" },
      cN: { x: CI.x - 5, y: CI.cy + 12, v: "N", ta: "end" },
      rel: { x: C.cx + 20, y: CI.cy + 22, t: "submits" },
      color: "#c084fc"
    },
    {
      d: el(Sub.right, Sub.cy + 35, PE.x, PE.cy),
      c1: { x: Sub.right + 6, y: Sub.cy + 28, v: "1" },
      cN: { x: PE.x - 4, y: PE.cy - 4, v: "N", ta: "end" },
      rel: { x: (Sub.right + PE.x) / 2 - 18, y: PE.cy - 28, t: "progress under" },
      color: "#2dd4bf"
    },
    {
      d: `M ${C.right},${C.cy + 40} H ${PE.x} V ${PE.y}`,
      c1: { x: C.right + 6, y: C.cy + 32, v: "1" },
      cN: { x: PE.cx + 5, y: PE.y - 6, v: "N" },
      rel: { x: (C.right + PE.x) / 2, y: PE.cy - 52, t: "logs" },
      color: "#2dd4bf"
    },
    {
      d: `M ${T.cx},${T.bottom + 160} V ${TN.cy} H ${TN.x}`,
      c1: { x: T.cx + 5, y: T.bottom + 140, v: "1" },
      cN: { x: TN.x - 5, y: TN.cy - 4, v: "N", ta: "end" },
      rel: { x: T.cx - 25, y: TN.cy - 30, t: "writes" },
      color: "#a78bfa"
    },
    {
      d: `M ${C.right},${C.cy + 80} V ${TN.cy} H ${TN.x}`,
      c1: { x: C.right + 6, y: C.cy + 72, v: "1" },
      cN: { x: TN.x - 5, y: TN.cy + 12, v: "N", ta: "end" },
      rel: { x: (C.right + TN.x) / 2 - 10, y: TN.cy + 24, t: "about" },
      color: "#a78bfa"
    },
    {
      d: `M ${Sub.cx},${Sub.bottom} V ${TN.cy - 20} H ${TN.cx} V ${TN.y}`,
      c1: { x: Sub.cx - 15, y: Sub.bottom + 8, v: "0..1" },
      cN: { x: TN.cx + 5, y: TN.y - 6, v: "N" },
      rel: { x: Sub.cx + 120, y: TN.y - 28, t: "context" },
      color: "#a78bfa"
    },
  ];

  const SVG_W = 1000, SVG_H = 1280;

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

        {e.isJunction && (
          <g>
            <rect x={e.x + EW - 70} y={e.y + 8} width={64} height={13} rx={3} fill="rgba(0,0,0,0.5)" />
            <text x={e.x + EW - 38} y={e.y + 18.5} fill="#fed7aa" fontSize={8} textAnchor="middle" fontFamily="monospace" fontWeight="700">ENROLLMENT</text>
          </g>
        )}

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
      title: "Coaching vs plans vs sessions vs check-ins",
      hue: "#78350f",
      pts: [
        "Plan = sellable program template; Subscription = a client’s dated enrollment in that plan.",
        "Session = scheduled calendar event (consultation, live call, etc.); optional subscription link.",
        "CheckIn = async weekly (or periodic) client report — not a calendar session.",
        "TrainerNote is private coach feedback, stored separately from CheckIn and ProgressEntry.",
      ]
    },
    {
      title: "Workouts & diet (abstract)",
      hue: "#0c4a6e",
      pts: [
        "plan_kind + workout_diet_abstract on Plan keeps the ER diagram practical.",
        "Detailed day-by-day workouts/diets can be separate tables later without changing core coaching relationships.",
        "includes_live_sessions supports hybrid: routine-only vs live components.",
      ]
    },
    {
      title: "Payments & many clients per plan",
      hue: "#7f1d1d",
      pts: [
        "Many clients can subscribe to the same Plan; each row in Subscription is one enrollment with start/end.",
        "Payment links to Subscription (1:N) for renewals, partial payments, or refunds as separate rows.",
        "assigned_trainer_id supports teams where the selling coach differs from the coach of record.",
      ]
    },
    {
      title: "Progress separation",
      hue: "#042f2e",
      pts: [
        "ProgressEntry holds weight, measurements JSON — never merged into User or Client as fixed columns.",
        "CheckIn captures narrative + photos; ProgressEntry captures structured metrics.",
        "Both optionally tie to subscription_id for reporting per coaching stint.",
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
        background: "linear-gradient(160deg, #0a0f1e 0%, #060d1a 100%)",
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
            10 entities · trainers, clients, plans, subscriptions, sessions, check-ins, progress, payments & coach notes · PK/FK on diagram
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { c: "#fbbf24", t: "PK  Primary Key" },
            { c: "#60a5fa", t: "FK  Foreign Key" },
            { c: "#fbbf24", bg: "#78350f", t: "Enrollment hub" },
            { c: "#475569", t: "Types  SERIAL, JSONB, TIMESTAMPTZ, …" },
          ].map(l => (
            <div key={l.t} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 6, padding: "5px 11px",
            }}>
              <div style={{ width: 8, height: 8, background: l.bg || l.c, borderRadius: 2, border: l.bg ? `1.5px solid ${l.c}` : "none", flexShrink: 0 }} />
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
              <pattern id="dot" width={22} height={22} patternUnits="userSpaceOnUse">
                <circle cx={1.5} cy={1.5} r={0.9} fill="#0d1f38" />
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#dot)" />

            <text x={18} y={36} fill="rgba(96,165,250,0.15)" fontSize={10} fontFamily="monospace" letterSpacing={3}>IDENTITY &amp; ROLES</text>
            <line x1={14} y1={286} x2={986} y2={286} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={18} y={304} fill="rgba(56,189,248,0.15)" fontSize={10} fontFamily="monospace" letterSpacing={3}>PROGRAMS &amp; COMMERCE</text>
            <line x1={14} y1={596} x2={986} y2={596} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={18} y={614} fill="rgba(167,139,250,0.15)" fontSize={10} fontFamily="monospace" letterSpacing={3}>SESSIONS, CHECK-INS &amp; PROGRESS</text>

            {connections.map((conn, i) => (
              <g key={i}>
                <path d={conn.d} fill="none" stroke={conn.color} strokeWidth={1.3} opacity={0.38} strokeDasharray="5 3" />
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
            <span style={{ color: "#334155", fontSize: 11, fontFamily: "monospace" }}>10 entities · Subscription is the enrollment hub</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead>
                <tr style={{ background: "#0a1628" }}>
                  {["Entity", "Role", "Attrs", "Primary Key", "Foreign Keys", "Purpose"].map(h => (
                    <th key={h} style={{ padding: "8px 13px", color: "#475569", textAlign: "left", fontFamily: "monospace", fontSize: 10, fontWeight: 600, borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["User", "Identity", "6", "user_id", "—", "Login & contact; not mixed with progress"],
                  ["Trainer", "Role", "6", "trainer_id", "user_id", "Coach profile; one trainer : many clients via plans/subs"],
                  ["Client", "Role", "5", "client_id", "user_id", "Trainee profile; goals & timezone"],
                  ["Plan", "Catalog", "9", "plan_id", "trainer_id", "Sellable program; abstract workout/diet text"],
                  ["Subscription", "Enrollment", "8", "subscription_id", "client_id, plan_id, assigned_trainer_id", "Which client, which plan, start/end, status"],
                  ["Payment", "Billing", "7", "payment_id", "subscription_id", "Charges/refunds; 1:N per subscription"],
                  ["Session", "Scheduling", "9", "session_id", "trainer_id, client_id, subscription_id?", "Consultations & live calls; sub optional"],
                  ["CheckIn", "Async", "8", "check_in_id", "client_id, subscription_id", "Weekly reports; separate from Session"],
                  ["ProgressEntry", "Metrics", "8", "progress_id", "client_id, subscription_id", "Weight & measurements; isolated from User"],
                  ["TrainerNote", "Feedback", "7", "note_id", "trainer_id, client_id, subscription_id?", "Coach notes distinct from check-ins"],
                ].map(([name, type, attrs, pk, fks, purpose], i) => (
                  <tr key={name} style={{ background: i % 2 ? "#060d1a" : "#040a14" }}>
                    <td style={{ padding: "8px 13px", color: RAW.find(r => r.id === name)?.light || "#94a3b8", fontFamily: "monospace", fontWeight: 600, fontSize: 11 }}>{name}</td>
                    <td style={{ padding: "8px 13px" }}>
                      <span style={{
                        background: type === "Enrollment" ? "rgba(120,53,15,0.25)" : type === "Role" ? "rgba(30,58,138,0.25)" : type === "Metrics" ? "rgba(4,47,46,0.3)" : "#1e293b",
                        color: type === "Enrollment" ? "#fbbf24" : type === "Role" ? "#60a5fa" : type === "Metrics" ? "#2dd4bf" : "#64748b",
                        borderRadius: 4, padding: "2px 7px", fontSize: 10, fontFamily: "monospace",
                      }}>{type}</span>
                    </td>
                    <td style={{ padding: "8px 13px", color: "#475569", textAlign: "center" }}>{attrs}</td>
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
