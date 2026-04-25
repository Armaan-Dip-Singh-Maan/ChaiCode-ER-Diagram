import { useState } from "react";

const EW = 268, AH = 22, HH = 42, PAD = 8;
const getH = (n) => HH + n * AH + PAD * 2;

const RAW = [
  {
    id: "Department", x: 16, y: 44, hue: "#0f766e", light: "#2dd4bf",
    attrs: [
      { name: "department_id", tag: "PK", type: "SERIAL" },
      { name: "name", type: "VARCHAR(120)" },
      { name: "floor_wing", type: "VARCHAR(80)" },
      { name: "phone", type: "VARCHAR(20)" },
    ]
  },
  {
    id: "Specialty", x: 312, y: 44, hue: "#7c2d12", light: "#fb923c",
    attrs: [
      { name: "specialty_id", tag: "PK", type: "SERIAL" },
      { name: "name", type: "VARCHAR(120)" },
      { name: "description", type: "TEXT" },
    ]
  },
  {
    id: "Doctor", x: 608, y: 44, hue: "#14532d", light: "#4ade80",
    attrs: [
      { name: "doctor_id", tag: "PK", type: "SERIAL" },
      { name: "department_id", tag: "FK", type: "BIGINT" },
      { name: "specialty_id", tag: "FK", type: "BIGINT" },
      { name: "full_name", type: "VARCHAR(255)" },
      { name: "license_no", type: "VARCHAR(64)" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "phone", type: "VARCHAR(20)" },
      { name: "is_active", type: "BOOLEAN" },
    ]
  },
  {
    id: "Patient", x: 16, y: 318, hue: "#3730a3", light: "#818cf8",
    attrs: [
      { name: "patient_id", tag: "PK", type: "SERIAL" },
      { name: "full_name", type: "VARCHAR(255)" },
      { name: "date_of_birth", type: "DATE" },
      { name: "gender", type: "VARCHAR(20)" },
      { name: "phone", type: "VARCHAR(20)" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "address", type: "TEXT" },
      { name: "emergency_contact", type: "VARCHAR(255)" },
    ]
  },
  {
    id: "Appointment", x: 312, y: 318, hue: "#1e3a8a", light: "#60a5fa",
    attrs: [
      { name: "appointment_id", tag: "PK", type: "SERIAL" },
      { name: "patient_id", tag: "FK", type: "BIGINT" },
      { name: "doctor_id", tag: "FK", type: "BIGINT" },
      { name: "scheduled_start", type: "TIMESTAMP" },
      { name: "scheduled_end", type: "TIMESTAMP" },
      { name: "status", type: "VARCHAR(30)" },
      { name: "reason_for_visit", type: "TEXT" },
      { name: "notes", type: "TEXT" },
    ]
  },
  {
    id: "Consultation", x: 608, y: 318, hue: "#831843", light: "#f472b6",
    attrs: [
      { name: "consultation_id", tag: "PK", type: "SERIAL" },
      { name: "appointment_id", tag: "FK", type: "BIGINT" },
      { name: "patient_id", tag: "FK", type: "BIGINT" },
      { name: "doctor_id", tag: "FK", type: "BIGINT" },
      { name: "visit_at", type: "TIMESTAMP" },
      { name: "chief_complaint", type: "TEXT" },
      { name: "diagnosis_notes", type: "TEXT" },
      { name: "visit_status", type: "VARCHAR(30)" },
    ]
  },
  {
    id: "DiagnosticTest", x: 16, y: 592, hue: "#0c4a6e", light: "#38bdf8",
    attrs: [
      { name: "diagnostic_test_id", tag: "PK", type: "SERIAL" },
      { name: "code", type: "VARCHAR(40)" },
      { name: "name", type: "VARCHAR(255)" },
      { name: "description", type: "TEXT" },
      { name: "unit_price", type: "DECIMAL(10,2)" },
      { name: "typical_turnaround_h", type: "INT" },
    ]
  },
  {
    id: "TestOrder", x: 312, y: 592, hue: "#78350f", light: "#fbbf24", isJunction: true,
    attrs: [
      { name: "test_order_id", tag: "PK", type: "SERIAL" },
      { name: "consultation_id", tag: "FK", type: "BIGINT" },
      { name: "diagnostic_test_id", tag: "FK", type: "BIGINT" },
      { name: "ordered_at", type: "TIMESTAMP" },
      { name: "priority", type: "VARCHAR(20)" },
      { name: "order_status", type: "VARCHAR(30)" },
      { name: "instructions", type: "TEXT" },
    ]
  },
  {
    id: "Report", x: 608, y: 592, hue: "#581c87", light: "#c084fc",
    attrs: [
      { name: "report_id", tag: "PK", type: "SERIAL" },
      { name: "test_order_id", tag: "FK", type: "BIGINT" },
      { name: "patient_id", tag: "FK", type: "BIGINT" },
      { name: "findings", type: "TEXT" },
      { name: "conclusion", type: "TEXT" },
      { name: "file_url", type: "VARCHAR(500)" },
      { name: "report_status", type: "VARCHAR(30)" },
      { name: "released_at", type: "TIMESTAMP" },
      { name: "lab_technician", type: "VARCHAR(255)" },
    ]
  },
  {
    id: "Payment", x: 312, y: 866, hue: "#064e3b", light: "#34d399",
    attrs: [
      { name: "payment_id", tag: "PK", type: "SERIAL" },
      { name: "patient_id", tag: "FK", type: "BIGINT" },
      { name: "appointment_id", tag: "FK", type: "BIGINT" },
      { name: "consultation_id", tag: "FK", type: "BIGINT" },
      { name: "amount", type: "DECIMAL(10,2)" },
      { name: "payment_for", type: "VARCHAR(40)" },
      { name: "method", type: "VARCHAR(40)" },
      { name: "status", type: "VARCHAR(30)" },
      { name: "paid_at", type: "TIMESTAMP" },
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

export default function ClinicERDiagram() {
  const [hovered, setHovered] = useState(null);
  const em = buildEM();
  const {
    Department: Dept, Specialty: Spec, Doctor: Doc, Patient: Pat,
    Appointment: Appt, Consultation: Con, DiagnosticTest: DT,
    TestOrder: TO, Report: Rep, Payment: Pay
  } = em;

  const entities = RAW.map(r => em[r.id]);

  const connections = [
    {
      d: el(Dept.right, Dept.cy, Doc.x, Doc.cy),
      c1: { x: Dept.right + 6, y: Dept.cy - 4, v: "1" },
      cN: { x: Doc.x - 4, y: Doc.cy - 4, v: "N", ta: "end" },
      rel: { x: (Dept.right + Doc.x) / 2 - 20, y: Math.min(Dept.cy, Doc.cy) - 11, t: "employs" },
      color: "#2dd4bf"
    },
    {
      d: el(Spec.right, Spec.cy, Doc.x, Doc.cy),
      c1: { x: Spec.right + 6, y: Spec.cy - 4, v: "1" },
      cN: { x: Doc.x - 4, y: Doc.cy - 4, v: "N", ta: "end" },
      rel: { x: (Spec.right + Doc.x) / 2 - 18, y: Math.min(Spec.cy, Doc.cy) - 11, t: "classifies" },
      color: "#fb923c"
    },
    {
      d: el(Pat.right, Pat.cy, Appt.x, Appt.cy),
      c1: { x: Pat.right + 6, y: Pat.cy - 4, v: "1" },
      cN: { x: Appt.x - 4, y: Appt.cy - 4, v: "N", ta: "end" },
      rel: { x: (Pat.right + Appt.x) / 2 - 14, y: Math.min(Pat.cy, Appt.cy) - 11, t: "books" },
      color: "#818cf8"
    },
    {
      d: el(Appt.right, Appt.cy, Doc.x, Doc.cy),
      c1: { x: Appt.right + 6, y: Appt.cy - 4, v: "N" },
      cN: { x: Doc.x - 4, y: Doc.cy - 4, v: "1", ta: "end" },
      rel: { x: (Appt.right + Doc.x) / 2 - 28, y: Math.min(Appt.cy, Doc.cy) - 11, t: "with doctor" },
      color: "#4ade80"
    },
    {
      d: `M ${Pat.right},${Pat.cy + 12} H ${420} V ${Con.cy + 12} H ${Con.x}`,
      c1: { x: Pat.right + 6, y: Pat.cy + 12, v: "1" },
      cN: { x: Con.x - 4, y: Con.cy + 12, v: "N", ta: "end" },
      rel: { x: 400, y: Con.cy + 26, t: "visited as" },
      color: "#818cf8"
    },
    {
      d: `M ${Doc.cx},${Doc.bottom} V ${Con.y}`,
      c1: { x: Doc.cx + 5, y: Doc.bottom + 12, v: "1" },
      cN: { x: Con.cx + 5, y: Con.y - 6, v: "N" },
      rel: { x: Doc.cx + 12, y: (Doc.bottom + Con.y) / 2, t: "conducts" },
      color: "#4ade80"
    },
    {
      d: el(Appt.right, Appt.cy, Con.x, Con.cy),
      c1: { x: Appt.right + 6, y: Appt.cy - 4, v: "0..1" },
      cN: { x: Con.x - 4, y: Con.cy - 4, v: "1", ta: "end" },
      rel: { x: (Appt.right + Con.x) / 2 - 28, y: Math.min(Appt.cy, Con.cy) - 11, t: "fulfills" },
      color: "#60a5fa",
      dash: "5 4"
    },
    {
      d: `M ${Con.cx},${Con.bottom} V ${(Con.bottom + TO.y) / 2} H ${TO.cx} V ${TO.y}`,
      c1: { x: Con.cx + 5, y: Con.bottom + 12, v: "1" },
      cN: { x: TO.cx + 5, y: TO.y - 6, v: "N" },
      rel: { x: Con.cx + 8, y: (Con.bottom + TO.y) / 2, t: "prescribes" },
      color: "#f472b6"
    },
    {
      d: el(DT.right, DT.cy, TO.x, TO.cy),
      c1: { x: DT.right + 6, y: DT.cy - 4, v: "1" },
      cN: { x: TO.x - 4, y: TO.cy - 4, v: "N", ta: "end" },
      rel: { x: (DT.right + TO.x) / 2 - 18, y: Math.min(DT.cy, TO.cy) - 11, t: "ordered as" },
      color: "#38bdf8"
    },
    {
      d: el(TO.right, TO.cy, Rep.x, Rep.cy),
      c1: { x: TO.right + 6, y: TO.cy - 4, v: "1" },
      cN: { x: Rep.x - 4, y: Rep.cy - 4, v: "1", ta: "end" },
      rel: { x: (TO.right + Rep.x) / 2 - 22, y: Math.min(TO.cy, Rep.cy) - 11, t: "produces" },
      color: "#fbbf24"
    },
    {
      d: `M ${Pat.cx},${Pat.bottom} V ${720} H ${Rep.cx} V ${Rep.y}`,
      c1: { x: Pat.cx + 5, y: Pat.bottom + 12, v: "1" },
      cN: { x: Rep.cx + 5, y: Rep.y - 6, v: "N" },
      rel: { x: 380, y: 720, t: "receives copy" },
      color: "#818cf8",
      dash: "4 4"
    },
    {
      d: `M ${Pat.cx},${Pat.bottom} V ${820} H ${Pay.cx} V ${Pay.y}`,
      c1: { x: Pat.cx + 5, y: Pat.bottom + 12, v: "1" },
      cN: { x: Pay.cx + 5, y: Pay.y - 6, v: "N" },
      rel: { x: 200, y: 820, t: "pays" },
      color: "#34d399"
    },
    {
      d: `M ${Appt.cx},${Appt.bottom} V ${780} H ${Pay.cx} V ${Pay.y}`,
      c1: { x: Appt.cx + 5, y: Appt.bottom + 12, v: "0..1" },
      cN: { x: Pay.cx - 8, y: Pay.y - 6, v: "N" },
      rel: { x: 420, y: 780, t: "booking fee" },
      color: "#60a5fa",
      dash: "4 4"
    },
    {
      d: `M ${Con.cx},${Con.bottom} V ${820} H ${Pay.cx} V ${Pay.y}`,
      c1: { x: Con.cx + 5, y: Con.bottom + 12, v: "0..1" },
      cN: { x: Pay.cx + 8, y: Pay.y - 6, v: "N" },
      rel: { x: 620, y: 820, t: "visit / tests" },
      color: "#f472b6",
      dash: "4 4"
    },
  ];

  const SVG_W = 1180, SVG_H = 1180;

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
            <text x={e.x + EW - 38} y={e.y + 18.5} fill="#fed7aa" fontSize={8} textAnchor="middle" fontFamily="monospace" fontWeight="700">LINE ITEM</text>
          </g>
        )}

        <text x={e.x + EW / 2} y={e.y + 27}
          fill="white" fontSize={12} fontWeight="700"
          textAnchor="middle" fontFamily="'JetBrains Mono', 'Fira Code', monospace">
          {e.id}
        </text>

        <line x1={e.x} y1={e.y + HH} x2={e.x + EW} y2={e.y + HH}
          stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {e.attrs.map((a, i) => {
          const ay = e.y + HH + PAD + i * AH;
          const isPK = a.tag === "PK", isFK = a.tag === "FK";
          const textX = e.x + (a.tag ? 28 : 9);
          const textLen = a.name.length * 6.5;
          const typeStr = a.type || "";
          return (
            <g key={a.name}>
              {i > 0 && <line x1={e.x + 5} y1={ay} x2={e.x + EW - 5} y2={ay} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />}
              {isPK && <rect x={e.x + 1} y={ay + 1} width={EW - 2} height={AH - 2} rx={2} fill="rgba(251,191,36,0.09)" />}
              {isFK && <rect x={e.x + 1} y={ay + 1} width={EW - 2} height={AH - 2} rx={2} fill="rgba(96,165,250,0.06)" />}
              {a.tag && (
                <text x={e.x + 7} y={ay + 14.5}
                  fill={isPK ? "#fbbf24" : "#60a5fa"}
                  fontSize={8} fontFamily="monospace" fontWeight="800">
                  {a.tag}
                </text>
              )}
              <text x={textX} y={ay + 14.5}
                fill={isPK ? "#fef3c7" : isFK ? "#bae6fd" : "#94a3b8"}
                fontSize={10} fontFamily="'JetBrains Mono', monospace">
                {a.name}
              </text>
              {isPK && (
                <line x1={textX} y1={ay + 16} x2={textX + textLen} y2={ay + 16}
                  stroke="#fef3c7" strokeWidth={0.8} opacity={0.7} />
              )}
              {typeStr && (
                <text
                  x={e.x + EW - 6}
                  y={ay + 14.5}
                  fill="#475569"
                  fontSize={7}
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
      title: "Appointment vs consultation",
      hue: "#1e3a8a",
      pts: [
        "Appointment = scheduled intent (booked / confirmed / cancelled / no-show).",
        "Consultation = actual clinical encounter; optional appointment_id for walk-ins (NULL).",
        "At most one Consultation per Appointment when the visit happens; no row if cancelled/no-show.",
      ]
    },
    {
      title: "Diagnostics & reports",
      hue: "#78350f",
      pts: [
        "DiagnosticTest = catalog (price, code, turnaround).",
        "TestOrder = line item: one Consultation can prescribe many tests (1:N).",
        "Report 1:1 with TestOrder; patient_id on Report speeds patient history queries.",
      ]
    },
    {
      title: "Specialty & department",
      hue: "#14532d",
      pts: [
        "Specialty is its own entity so names stay consistent and reports can group by specialty.",
        "Department groups doctors physically (OPD wing); doctor belongs to one dept + one specialty (adjust to M:N later if needed).",
      ]
    },
    {
      title: "Payments",
      hue: "#064e3b",
      pts: [
        "payment_for distinguishes booking deposit vs visit vs diagnostics.",
        "appointment_id and consultation_id nullable: pay before visit, after visit, or only for tests.",
        "Multiple Payment rows per patient over time (N).",
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
        background: "linear-gradient(160deg, #0f172a 0%, #060d1a 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "18px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: "#334155", letterSpacing: 3, marginBottom: 4 }}>DATABASE DESIGN · ER DIAGRAM</div>
          <h1 style={{ margin: 0, fontSize: 18, color: "#e2e8f0", fontWeight: 800, letterSpacing: -0.5 }}>
            Clinic Appointment &amp; Diagnostics Platform
          </h1>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 11.5 }}>
            Web Dev Cohort 2026 · 10 entities · scheduling, visits, test orders, reports, payments · PK/FK &amp; cardinalities
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { c: "#fbbf24", t: "PK  Primary Key" },
            { c: "#60a5fa", t: "FK  Foreign Key" },
            { c: "#94a3b8", t: "Dashed  optional / copy link" },
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

      <div style={{ padding: "18px 22px" }}>
        <div style={{
          overflowX: "auto", overflowY: "auto",
          border: "1px solid #1e293b", borderRadius: 12,
          background: "#020c1b",
          maxHeight: "70vh",
        }}>
          <svg width={SVG_W} height={SVG_H} style={{ display: "block" }}>
            <defs>
              <pattern id="dotClinic" width={22} height={22} patternUnits="userSpaceOnUse">
                <circle cx={1.5} cy={1.5} r={0.9} fill="#0d1f38" />
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#dotClinic)" />

            <text x={16} y={32} fill="rgba(45,212,191,0.2)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>ORGANIZATION &amp; STAFF</text>
            <line x1={12} y1={300} x2={1168} y2={300} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={16} y={314} fill="rgba(96,165,250,0.2)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>SCHEDULING &amp; VISITS</text>
            <line x1={12} y1={574} x2={1168} y2={574} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={16} y={588} fill="rgba(251,191,36,0.18)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>LAB ORDERS &amp; REPORTS</text>
            <line x1={12} y1={848} x2={1168} y2={848} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={16} y={862} fill="rgba(52,211,153,0.2)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>BILLING</text>

            {connections.map((conn, i) => (
              <g key={i}>
                <path d={conn.d} fill="none" stroke={conn.color} strokeWidth={1.25} opacity={0.4} strokeDasharray={conn.dash || "5 3"} />
                <text x={conn.c1.x} y={conn.c1.y} fill={conn.color} fontSize={10.5} fontFamily="monospace" fontWeight="700" textAnchor={conn.c1.ta || "start"}>{conn.c1.v}</text>
                <text x={conn.cN.x} y={conn.cN.y} fill={conn.color} fontSize={10.5} fontFamily="monospace" fontWeight="700" textAnchor={conn.cN.ta || "start"}>{conn.cN.v}</text>
                <rect x={conn.rel.x - 2} y={conn.rel.y - 10} width={conn.rel.t.length * 5.6 + 6} height={13} rx={3} fill="#020812" />
                <text x={conn.rel.x + 1} y={conn.rel.y} fill="#2d3f55" fontSize={8} fontFamily="system-ui" fontStyle="italic">{conn.rel.t}</text>
              </g>
            ))}

            {entities.map(renderEntity)}
          </svg>
        </div>

        <p style={{ color: "#334155", fontSize: 10.5, textAlign: "center", margin: "6px 0 16px", fontFamily: "monospace" }}>
          ↕ scroll diagram · dashed = optional FK or informational link
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(252px, 1fr))", gap: 12 }}>
          {notes.map(n => (
            <div key={n.title} style={{
              background: "#060d1a", border: `1px solid ${n.hue}`,
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 12, marginBottom: 8 }}>{n.title}</div>
              <ul style={{ margin: 0, paddingLeft: 15 }}>
                {n.pts.map((p, j) => (
                  <li key={j} style={{ color: "#475569", fontSize: 11, marginBottom: 4, lineHeight: 1.45 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, background: "#060d1a", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#94a3b8", fontSize: 11.5, fontWeight: 700 }}>Entity summary</span>
            <span style={{ color: "#334155", fontSize: 10.5, fontFamily: "monospace" }}>10 entities</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#0a1628" }}>
                  {["Entity", "Role", "PK", "FKs (summary)", "Purpose"].map(h => (
                    <th key={h} style={{ padding: "7px 12px", color: "#475569", textAlign: "left", fontFamily: "monospace", fontSize: 9.5, fontWeight: 600, borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Department", "Org", "department_id", "—", "Clinic unit / wing"],
                  ["Specialty", "Reference", "specialty_id", "—", "Doctor specialization catalog"],
                  ["Doctor", "Staff", "doctor_id", "department_id, specialty_id", "Treating physician"],
                  ["Patient", "Person", "patient_id", "—", "Demographics & contact"],
                  ["Appointment", "Schedule", "appointment_id", "patient_id, doctor_id", "Booked slot & status"],
                  ["Consultation", "Visit", "consultation_id", "appointment_id, patient_id, doctor_id", "Actual encounter; walk-in if appointment null"],
                  ["DiagnosticTest", "Catalog", "diagnostic_test_id", "—", "Test definition & pricing"],
                  ["TestOrder", "Line item", "test_order_id", "consultation_id, diagnostic_test_id", "Prescribed test instance"],
                  ["Report", "Artifact", "report_id", "test_order_id, patient_id", "Findings linked to order & patient"],
                  ["Payment", "Billing", "payment_id", "patient_id, appointment_id, consultation_id", "Charges tied to booking and/or visit"],
                ].map(([name, role, pk, fks, purpose], i) => (
                  <tr key={name} style={{ background: i % 2 ? "#060d1a" : "#040a14" }}>
                    <td style={{ padding: "7px 12px", color: RAW.find(r => r.id === name)?.light || "#94a3b8", fontFamily: "monospace", fontWeight: 600, fontSize: 10.5 }}>{name}</td>
                    <td style={{ padding: "7px 12px", color: "#64748b", fontSize: 9.5 }}>{role}</td>
                    <td style={{ padding: "7px 12px", color: "#fbbf24", fontFamily: "monospace", fontSize: 9.5 }}>{pk}</td>
                    <td style={{ padding: "7px 12px", color: "#60a5fa", fontFamily: "monospace", fontSize: 9.5 }}>{fks}</td>
                    <td style={{ padding: "7px 12px", color: "#334155", fontSize: 10.5 }}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: "12px 14px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10 }}>
          <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>Scenario coverage</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 10.5, lineHeight: 1.55 }}>
            <li>Reschedule / cancel: update <code style={{ color: "#64748b" }}>Appointment.status</code>; no <code style={{ color: "#64748b" }}>Consultation</code> if no-show.</li>
            <li>Walk-in: insert <code style={{ color: "#64748b" }}>Consultation</code> with <code style={{ color: "#64748b" }}>appointment_id</code> NULL.</li>
            <li>Multiple tests in one visit: multiple <code style={{ color: "#64748b" }}>TestOrder</code> rows, one <code style={{ color: "#64748b" }}>Report</code> each.</li>
            <li>Report later: <code style={{ color: "#64748b" }}>Report.released_at</code> after <code style={{ color: "#64748b" }}>TestOrder.ordered_at</code>.</li>
            <li>Payment split: separate <code style={{ color: "#64748b" }}>Payment</code> rows with <code style={{ color: "#64748b" }}>payment_for</code> + optional FKs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
