import { useState } from "react";

const EW = 268, AH = 22, HH = 42, PAD = 8;
const getH = (n) => HH + n * AH + PAD * 2;

const RAW = [
  {
    id: "Building", x: 400, y: 28, hue: "#1e3a8a", light: "#60a5fa",
    attrs: [
      { name: "building_id", tag: "PK", type: "SERIAL" },
      { name: "building_code", type: "VARCHAR(40)" },
      { name: "building_name", type: "VARCHAR(255)" },
      { name: "address", type: "TEXT" },
      { name: "timezone", type: "VARCHAR(64)" },
    ],
  },
  {
    id: "ServiceZone", x: 16, y: 228, hue: "#0f766e", light: "#2dd4bf",
    attrs: [
      { name: "zone_id", tag: "PK", type: "SERIAL" },
      { name: "building_id", tag: "FK", type: "BIGINT" },
      { name: "zone_code", type: "VARCHAR(40)" },
      { name: "zone_name", type: "VARCHAR(120)" },
      { name: "description", type: "TEXT" },
    ],
  },
  {
    id: "Floor", x: 312, y: 228, hue: "#7c2d12", light: "#fb923c",
    attrs: [
      { name: "floor_id", tag: "PK", type: "SERIAL" },
      { name: "building_id", tag: "FK", type: "BIGINT" },
      { name: "floor_number", type: "INT" },
      { name: "floor_label", type: "VARCHAR(80)" },
      { name: "sort_order", type: "INT" },
    ],
  },
  {
    id: "ElevatorShaft", x: 700, y: 228, hue: "#4c1d95", light: "#a78bfa",
    attrs: [
      { name: "shaft_id", tag: "PK", type: "SERIAL" },
      { name: "building_id", tag: "FK", type: "BIGINT" },
      { name: "shaft_label", type: "VARCHAR(80)" },
      { name: "notes", type: "TEXT" },
    ],
  },
  {
    id: "Elevator", x: 312, y: 448, hue: "#14532d", light: "#4ade80",
    attrs: [
      { name: "elevator_id", tag: "PK", type: "SERIAL" },
      { name: "building_id", tag: "FK", type: "BIGINT" },
      { name: "shaft_id", tag: "FK", type: "BIGINT" },
      { name: "zone_id", tag: "FK", type: "BIGINT" },
      { name: "car_label", type: "VARCHAR(40)" },
      { name: "model_number", type: "VARCHAR(80)" },
      { name: "capacity_kg", type: "INT" },
      { name: "commissioned_at", type: "TIMESTAMP" },
    ],
  },
  {
    id: "ElevatorFloorService", x: 16, y: 448, hue: "#78350f", light: "#fbbf24", isJunction: true,
    attrs: [
      { name: "map_id", tag: "PK", type: "SERIAL" },
      { name: "elevator_id", tag: "FK", type: "BIGINT" },
      { name: "floor_id", tag: "FK", type: "BIGINT" },
    ],
  },
  {
    id: "ElevatorLiveState", x: 700, y: 448, hue: "#0c4a6e", light: "#38bdf8",
    attrs: [
      { name: "elevator_id", tag: "PK", type: "BIGINT" },
      { name: "operational_status", type: "VARCHAR(32)" },
      { name: "current_floor_id", tag: "FK", type: "BIGINT" },
      { name: "last_event_at", type: "TIMESTAMP" },
    ],
  },
  {
    id: "PlatformUser", x: 16, y: 708, hue: "#3730a3", light: "#818cf8",
    attrs: [
      { name: "user_id", tag: "PK", type: "SERIAL" },
      { name: "external_ref", type: "VARCHAR(120)" },
      { name: "display_name", type: "VARCHAR(255)" },
      { name: "contact_phone", type: "VARCHAR(24)" },
    ],
  },
  {
    id: "FloorRequest", x: 312, y: 708, hue: "#831843", light: "#f472b6",
    attrs: [
      { name: "request_id", tag: "PK", type: "SERIAL" },
      { name: "origin_floor_id", tag: "FK", type: "BIGINT" },
      { name: "destination_floor_id", tag: "FK", type: "BIGINT" },
      { name: "requested_by_user_id", tag: "FK", type: "BIGINT" },
      { name: "requested_at", type: "TIMESTAMP" },
      { name: "request_status", type: "VARCHAR(32)" },
    ],
  },
  {
    id: "RideAssignment", x: 700, y: 708, hue: "#1e3a8a", light: "#93c5fd",
    attrs: [
      { name: "assignment_id", tag: "PK", type: "SERIAL" },
      { name: "request_id", tag: "FK", type: "BIGINT" },
      { name: "elevator_id", tag: "FK", type: "BIGINT" },
      { name: "assigned_at", type: "TIMESTAMP" },
      { name: "released_at", type: "TIMESTAMP" },
      { name: "assignment_status", type: "VARCHAR(24)" },
    ],
  },
  {
    id: "RideTripLog", x: 312, y: 948, hue: "#581c87", light: "#c084fc",
    attrs: [
      { name: "trip_id", tag: "PK", type: "SERIAL" },
      { name: "assignment_id", tag: "FK", type: "BIGINT" },
      { name: "elevator_id", tag: "FK", type: "BIGINT" },
      { name: "departure_floor_id", tag: "FK", type: "BIGINT" },
      { name: "arrival_floor_id", tag: "FK", type: "BIGINT" },
      { name: "departed_at", type: "TIMESTAMP" },
      { name: "arrived_at", type: "TIMESTAMP" },
      { name: "duration_seconds", type: "INT" },
    ],
  },
  {
    id: "MaintenanceRecord", x: 700, y: 948, hue: "#064e3b", light: "#34d399",
    attrs: [
      { name: "maintenance_id", tag: "PK", type: "SERIAL" },
      { name: "elevator_id", tag: "FK", type: "BIGINT" },
      { name: "scheduled_start", type: "TIMESTAMP" },
      { name: "actual_start", type: "TIMESTAMP" },
      { name: "actual_end", type: "TIMESTAMP" },
      { name: "maintenance_type", type: "VARCHAR(32)" },
      { name: "work_status", type: "VARCHAR(24)" },
      { name: "description", type: "TEXT" },
      { name: "technician_ref", type: "VARCHAR(120)" },
    ],
  },
];

function buildEM() {
  const em = {};
  RAW.forEach((e) => {
    const h = getH(e.attrs.length);
    em[e.id] = {
      ...e, h, right: e.x + EW, bottom: e.y + h, cx: e.x + EW / 2, cy: e.y + h / 2,
    };
  });
  return em;
}

const el = (x1, y1, x2, y2) => {
  const mx = Math.round((x1 + x2) / 2);
  return `M ${x1},${y1} H ${mx} V ${y2} H ${x2}`;
};

export default function SmartElevatorERDiagram() {
  const [hovered, setHovered] = useState(null);
  const em = buildEM();
  const {
    Building: Bld, ServiceZone: Zone, Floor: Flr, ElevatorShaft: Shaft,
    Elevator: Elev, ElevatorFloorService: EFS, ElevatorLiveState: Live,
    PlatformUser: Usr, FloorRequest: Req, RideAssignment: Asgn,
    RideTripLog: Trip, MaintenanceRecord: Maint,
  } = em;

  const entities = RAW.map((r) => em[r.id]);

  const connections = [
    {
      d: `M ${Bld.cx},${Bld.bottom} V ${260} H ${Zone.cx} V ${Zone.y}`,
      c1: { x: Bld.cx + 5, y: Bld.bottom + 10, v: "1" },
      cN: { x: Zone.cx + 5, y: Zone.y - 6, v: "N" },
      rel: { x: 120, y: 248, t: "zones" },
      color: "#60a5fa",
    },
    {
      d: `M ${Bld.cx},${Bld.bottom} V ${260} H ${Flr.cx} V ${Flr.y}`,
      c1: { x: Bld.cx - 14, y: Bld.bottom + 22, v: "1" },
      cN: { x: Flr.cx - 6, y: Flr.y - 6, v: "N" },
      rel: { x: 360, y: 248, t: "floors" },
      color: "#60a5fa",
    },
    {
      d: `M ${Bld.cx},${Bld.bottom} V ${260} H ${Shaft.cx} V ${Shaft.y}`,
      c1: { x: Bld.cx - 24, y: Bld.bottom + 10, v: "1" },
      cN: { x: Shaft.cx + 5, y: Shaft.y - 6, v: "N" },
      rel: { x: 620, y: 248, t: "shafts" },
      color: "#60a5fa",
    },
    {
      d: `M ${Bld.cx},${Bld.bottom} V ${380} H ${Elev.cx} V ${Elev.y}`,
      c1: { x: Bld.cx + 16, y: Bld.bottom + 10, v: "1" },
      cN: { x: Elev.cx + 5, y: Elev.y - 6, v: "N" },
      rel: { x: 500, y: 400, t: "elevators" },
      color: "#60a5fa",
    },
    {
      d: el(Zone.right, Zone.cy, Elev.x, Elev.cy),
      c1: { x: Zone.right + 6, y: Zone.cy - 4, v: "1" },
      cN: { x: Elev.x - 4, y: Elev.cy - 4, v: "N", ta: "end" },
      rel: { x: (Zone.right + Elev.x) / 2 - 36, y: Math.min(Zone.cy, Elev.cy) - 14, t: "bank" },
      color: "#2dd4bf",
    },
    {
      d: el(Shaft.right, Shaft.cy, Elev.x + EW, Elev.cy),
      c1: { x: Shaft.right + 6, y: Shaft.cy - 4, v: "1" },
      cN: { x: Elev.right + 4, y: Elev.cy - 4, v: "1", ta: "end" },
      rel: { x: (Shaft.right + Elev.right) / 2 - 40, y: Math.min(Shaft.cy, Elev.cy) - 14, t: "one car" },
      color: "#a78bfa",
    },
    {
      d: el(Flr.right, Flr.cy - 10, EFS.x, EFS.cy - 10),
      c1: { x: Flr.right + 6, y: Flr.cy - 14, v: "1" },
      cN: { x: EFS.x - 4, y: EFS.cy - 14, v: "N", ta: "end" },
      rel: { x: (Flr.right + EFS.x) / 2 - 28, y: Flr.cy - 28, t: "served by" },
      color: "#fb923c",
    },
    {
      d: el(EFS.right, EFS.cy + 8, Elev.x, Elev.cy + 8),
      c1: { x: EFS.right + 6, y: EFS.cy + 4, v: "N" },
      cN: { x: Elev.x - 4, y: Elev.cy + 4, v: "1", ta: "end" },
      rel: { x: (EFS.right + Elev.x) / 2 - 22, y: Elev.cy + 20, t: "serves" },
      color: "#fbbf24",
    },
    {
      d: el(Flr.right, Flr.cy + 14, Req.x, Req.cy + 14),
      c1: { x: Flr.right + 6, y: Flr.cy + 10, v: "1" },
      cN: { x: Req.x - 4, y: Req.cy + 10, v: "N", ta: "end" },
      rel: { x: (Flr.right + Req.x) / 2 - 40, y: Flr.cy + 26, t: "origin / dest" },
      color: "#fb923c",
      dash: "4 4",
    },
    {
      d: el(Usr.right, Usr.cy, Req.x, Req.cy),
      c1: { x: Usr.right + 6, y: Usr.cy - 4, v: "1" },
      cN: { x: Req.x - 4, y: Req.cy - 4, v: "N", ta: "end" },
      rel: { x: (Usr.right + Req.x) / 2 - 18, y: Math.min(Usr.cy, Req.cy) - 14, t: "raises" },
      color: "#818cf8",
    },
    {
      d: el(Req.right, Req.cy, Asgn.x, Asgn.cy),
      c1: { x: Req.right + 6, y: Req.cy - 4, v: "1" },
      cN: { x: Asgn.x - 4, y: Asgn.cy - 4, v: "0..1", ta: "end" },
      rel: { x: (Req.right + Asgn.x) / 2 - 36, y: Math.min(Req.cy, Asgn.cy) - 14, t: "allocates" },
      color: "#f472b6",
    },
    {
      d: el(Elev.right, Elev.cy + 18, Asgn.x, Asgn.cy - 18),
      c1: { x: Elev.right + 6, y: Elev.cy + 14, v: "1" },
      cN: { x: Asgn.x - 4, y: Asgn.cy - 22, v: "N", ta: "end" },
      rel: { x: (Elev.right + Asgn.x) / 2 - 28, y: Elev.cy + 52, t: "handles" },
      color: "#4ade80",
    },
    {
      d: el(Asgn.cx, Asgn.bottom, Trip.cx, Trip.y),
      c1: { x: Asgn.cx + 5, y: Asgn.bottom + 10, v: "0..1" },
      cN: { x: Trip.cx + 5, y: Trip.y - 6, v: "1" },
      rel: { x: Asgn.cx + 14, y: (Asgn.bottom + Trip.y) / 2, t: "trip log" },
      color: "#93c5fd",
      dash: "5 4",
    },
    {
      d: `M ${Elev.cx},${Elev.bottom} V ${860} H ${Trip.cx} V ${Trip.y}`,
      c1: { x: Elev.cx + 5, y: Elev.bottom + 10, v: "1" },
      cN: { x: Trip.cx + 5, y: Trip.y - 6, v: "N" },
      rel: { x: 520, y: 860, t: "runs" },
      color: "#4ade80",
      dash: "4 4",
    },
    {
      d: `M ${Flr.cx},${Flr.bottom} V ${880} H ${Trip.cx} V ${Trip.y}`,
      c1: { x: Flr.cx + 5, y: Flr.bottom + 10, v: "1" },
      cN: { x: Trip.cx - 8, y: Trip.y - 6, v: "N" },
      rel: { x: 200, y: 880, t: "dep / arr floors" },
      color: "#fb923c",
      dash: "3 5",
    },
    {
      d: el(Elev.right, Elev.cy - 18, Live.x, Live.cy - 18),
      c1: { x: Elev.right + 6, y: Elev.cy - 22, v: "1" },
      cN: { x: Live.x - 4, y: Live.cy - 22, v: "1", ta: "end" },
      rel: { x: (Elev.right + Live.x) / 2 - 36, y: Elev.cy - 38, t: "live status" },
      color: "#38bdf8",
    },
    {
      d: el(Flr.right, Flr.cy - 28, Live.x, Live.cy + 24),
      c1: { x: Flr.right + 6, y: Flr.cy - 32, v: "1" },
      cN: { x: Live.x - 4, y: Live.cy + 20, v: "0..1", ta: "end" },
      rel: { x: 620, y: 400, t: "current floor" },
      color: "#38bdf8",
      dash: "4 4",
    },
    {
      d: el(Elev.cx, Elev.bottom, Maint.x, Maint.y),
      c1: { x: Elev.cx + 5, y: Elev.bottom + 10, v: "1" },
      cN: { x: Maint.cx + 5, y: Maint.y - 6, v: "N" },
      rel: { x: Elev.cx + 14, y: (Elev.bottom + Maint.y) / 2, t: "maintenance" },
      color: "#34d399",
    },
  ];

  const SVG_W = 1180, SVG_H = 1240;

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
            <rect x={e.x + EW - 78} y={e.y + 8} width={72} height={13} rx={3} fill="rgba(0,0,0,0.5)" />
            <text x={e.x + EW - 42} y={e.y + 18.5} fill="#fed7aa" fontSize={8} textAnchor="middle" fontFamily="monospace" fontWeight="700">M:N MAP</text>
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
      title: "Building vs movement data",
      hue: "#1e40af",
      pts: [
        "Building, Floor, Shaft, and Elevator hold configuration (what exists, capacity, commissioned date).",
        "RideTripLog stores completed movement for analytics; operational_status lives on ElevatorLiveState, not on Elevator.",
        "Pending demand: FloorRequest.request_status; no RideAssignment row until dispatch.",
      ],
    },
    {
      title: "Many-to-many floors",
      hue: "#78350f",
      pts: [
        "ElevatorFloorService is the junction: one elevator serves many floors; one floor can be served by many elevators.",
        "Use this table for dispatch rules (which cars may stop at which landings).",
      ],
    },
    {
      title: "Request → assignment → trip",
      hue: "#831843",
      pts: [
        "FloorRequest captures hall/car calls; optional PlatformUser and nullable destination.",
        "RideAssignment.request_id is UNIQUE: at most one allocation per request; elevator_id shows which car took it.",
        "RideTripLog.assignment_id UNIQUE ties one analytics row to that allocation when the move completes.",
      ],
    },
    {
      title: "Maintenance & disable",
      hue: "#064e3b",
      pts: [
        "MaintenanceRecord rows append over time (history is never overwritten).",
        "Set ElevatorLiveState to OUT_OF_SERVICE or MAINTENANCE while work is active; configuration on Elevator stays intact.",
      ],
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
            Smart Elevator Control (LiftGrid-style)
          </h1>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 11.5 }}>
            Web Dev Cohort 2026 · multi-building · requests, assignments, trip logs, live state, maintenance · PK/FK &amp; cardinalities
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { c: "#fbbf24", t: "PK  Primary Key" },
            { c: "#60a5fa", t: "FK  Foreign Key" },
            { c: "#94a3b8", t: "Dashed  optional / analytics" },
          ].map((l) => (
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
              <pattern id="dotElev" width={22} height={22} patternUnits="userSpaceOnUse">
                <circle cx={1.5} cy={1.5} r={0.9} fill="#0d1f38" />
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#dotElev)" />

            <text x={16} y={212} fill="rgba(96,165,250,0.22)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>STRUCTURE · ZONES · FLOORS · SHAFTS</text>
            <line x1={12} y1={420} x2={1168} y2={420} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={16} y={434} fill="rgba(74,222,128,0.2)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>CARS · SERVICE MAP · LIVE STATE</text>
            <line x1={12} y1={680} x2={1168} y2={680} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={16} y={694} fill="rgba(244,114,182,0.2)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>REQUESTS &amp; DISPATCH</text>
            <line x1={12} y1={920} x2={1168} y2={920} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={16} y={934} fill="rgba(192,132,252,0.2)" fontSize={9.5} fontFamily="monospace" letterSpacing={3}>ANALYTICS &amp; MAINTENANCE</text>

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
          ↕ scroll diagram · dashed = optional FK or operational overlay
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(252px, 1fr))", gap: 12 }}>
          {notes.map((n) => (
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
            <span style={{ color: "#334155", fontSize: 10.5, fontFamily: "monospace" }}>12 entities</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#0a1628" }}>
                  {["Entity", "Role", "PK", "FKs (summary)", "Purpose"].map((h) => (
                    <th key={h} style={{ padding: "7px 12px", color: "#475569", textAlign: "left", fontFamily: "monospace", fontSize: 9.5, fontWeight: 600, borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Building", "Site", "building_id", "—", "Tower / mall / hospital on the platform"],
                  ["ServiceZone", "Bank", "zone_id", "building_id", "Elevator bank grouping"],
                  ["Floor", "Level", "floor_id", "building_id", "Landings in a building"],
                  ["ElevatorShaft", "Physical", "shaft_id", "building_id", "Vertical hoistway"],
                  ["Elevator", "Car config", "elevator_id", "building_id, shaft_id, zone_id", "Static car metadata; no ride telemetry"],
                  ["ElevatorFloorService", "Junction", "map_id", "elevator_id, floor_id", "Which floors each car may serve"],
                  ["ElevatorLiveState", "Runtime", "elevator_id", "current_floor_id", "Idle / moving / maintenance / OOS"],
                  ["PlatformUser", "Actor", "user_id", "—", "Optional identity for requests"],
                  ["FloorRequest", "Demand", "request_id", "origin, destination, user", "Hall or car call"],
                  ["RideAssignment", "Dispatch", "assignment_id", "request_id, elevator_id", "One allocation per request (unique request_id)"],
                  ["RideTripLog", "Analytics", "trip_id", "assignment, elevator, floors", "Completed move for reporting"],
                  ["MaintenanceRecord", "Ops", "maintenance_id", "elevator_id", "Append-only maintenance history"],
                ].map(([name, role, pk, fks, purpose], i) => (
                  <tr key={name} style={{ background: i % 2 ? "#060d1a" : "#040a14" }}>
                    <td style={{ padding: "7px 12px", color: RAW.find((r) => r.id === name)?.light || "#94a3b8", fontFamily: "monospace", fontWeight: 600, fontSize: 10.5 }}>{name}</td>
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
            <li>Rides today: filter <code style={{ color: "#64748b" }}>RideTripLog</code> by <code style={{ color: "#64748b" }}>arrived_at</code> date + <code style={{ color: "#64748b" }}>elevator_id</code>.</li>
            <li>Busiest car: count <code style={{ color: "#64748b" }}>RideAssignment</code> or trips per <code style={{ color: "#64748b" }}>elevator_id</code>.</li>
            <li>Pending requests: <code style={{ color: "#64748b" }}>FloorRequest.request_status = PENDING</code> with no assignment row.</li>
            <li>Cars inside building: filter <code style={{ color: "#64748b" }}>Elevator</code> by <code style={{ color: "#64748b" }}>building_id</code>; live position from <code style={{ color: "#64748b" }}>ElevatorLiveState</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
