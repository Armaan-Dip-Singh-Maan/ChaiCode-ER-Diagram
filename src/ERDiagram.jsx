import { useState } from "react";

const EW = 232, AH = 23, HH = 44, PAD = 9;
const getH = (n) => HH + n * AH + PAD * 2;

const RAW = [
  {
    id: "Customer", x: 18, y: 52, hue: "#3730a3", light: "#818cf8",
    attrs: [
      { name: "customer_id", tag: "PK" },
      { name: "full_name" },
      { name: "email" },
      { name: "phone" },
      { name: "instagram_handle" },
      { name: "whatsapp_number" },
      { name: "delivery_address" },
      { name: "created_at" },
    ]
  },
  {
    id: "Order", x: 332, y: 52, hue: "#1e3a8a", light: "#60a5fa",
    attrs: [
      { name: "order_id", tag: "PK" },
      { name: "customer_id", tag: "FK" },
      { name: "order_date" },
      { name: "total_amount" },
      { name: "order_notes" },
      { name: "created_at" },
    ]
  },
  {
    id: "Payment", x: 692, y: 52, hue: "#064e3b", light: "#34d399",
    attrs: [
      { name: "payment_id", tag: "PK" },
      { name: "order_id", tag: "FK" },
      { name: "amount_paid" },
      { name: "payment_method" },
      { name: "payment_status" },
      { name: "payment_date" },
      { name: "transaction_ref" },
    ]
  },
  {
    id: "OrderItem", x: 332, y: 410, hue: "#78350f", light: "#fbbf24", isJunction: true,
    attrs: [
      { name: "order_item_id", tag: "PK" },
      { name: "order_id", tag: "FK" },
      { name: "product_id", tag: "FK" },
      { name: "quantity" },
      { name: "unit_price" },
      { name: "selected_size" },
      { name: "selected_color" },
    ]
  },
  {
    id: "Shipping", x: 692, y: 410, hue: "#7f1d1d", light: "#f87171",
    attrs: [
      { name: "shipping_id", tag: "PK" },
      { name: "order_id", tag: "FK" },
      { name: "recipient_name" },
      { name: "shipping_address" },
      { name: "city" },
      { name: "pincode" },
      { name: "courier_name" },
      { name: "tracking_number" },
      { name: "shipping_status" },
      { name: "shipped_date" },
      { name: "delivered_date" },
    ]
  },
  {
    id: "Product", x: 332, y: 840, hue: "#0c4a6e", light: "#38bdf8",
    attrs: [
      { name: "product_id", tag: "PK" },
      { name: "name" },
      { name: "description" },
      { name: "base_price" },
      { name: "category" },
      { name: "product_type" },
      { name: "image_url" },
      { name: "created_at" },
    ]
  },
  {
    id: "ThriftedDetail", x: 18, y: 840, hue: "#431407", light: "#fb923c",
    attrs: [
      { name: "thrift_detail_id", tag: "PK" },
      { name: "product_id", tag: "FK" },
      { name: "brand" },
      { name: "size" },
      { name: "color" },
      { name: "condition" },
      { name: "is_available" },
    ]
  },
  {
    id: "HandmadeDetail", x: 692, y: 840, hue: "#3b0764", light: "#c084fc",
    attrs: [
      { name: "handmade_detail_id", tag: "PK" },
      { name: "product_id", tag: "FK" },
      { name: "material" },
      { name: "is_made_to_order" },
      { name: "production_time_days" },
    ]
  },
  {
    id: "Inventory", x: 692, y: 1148, hue: "#042f2e", light: "#2dd4bf",
    attrs: [
      { name: "inventory_id", tag: "PK" },
      { name: "product_id", tag: "FK" },
      { name: "size_variant" },
      { name: "color_variant" },
      { name: "quantity_available" },
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
  const { Customer: C, Order: O, Payment: P, OrderItem: OI,
    Shipping: S, Product: PR, ThriftedDetail: TD,
    HandmadeDetail: HD, Inventory: INV } = em;

  const entities = RAW.map(r => em[r.id]);

  const connections = [
    {
      d: el(C.right, C.cy, O.x, O.cy),
      c1: { x: C.right + 6, y: C.cy - 4, v: "1" },
      cN: { x: O.x - 4, y: O.cy - 4, v: "N", ta: "end" },
      rel: { x: (C.right + O.x) / 2 - 20, y: Math.min(C.cy, O.cy) - 11, t: "places" },
      color: "#818cf8"
    },
    {
      d: el(O.right, O.cy, P.x, P.cy),
      c1: { x: O.right + 6, y: O.cy - 4, v: "1" },
      cN: { x: P.x - 4, y: P.cy - 4, v: "1", ta: "end" },
      rel: { x: (O.right + P.x) / 2 - 18, y: Math.min(O.cy, P.cy) - 11, t: "has payment" },
      color: "#34d399"
    },
    {
      d: `M ${O.cx},${O.bottom} V ${OI.y}`,
      c1: { x: O.cx + 5, y: O.bottom + 12, v: "1" },
      cN: { x: OI.cx + 5, y: OI.y - 6, v: "N" },
      rel: { x: O.cx + 8, y: (O.bottom + OI.y) / 2, t: "contains" },
      color: "#fbbf24"
    },
    {
      d: `M ${O.right},${O.y + O.h * 0.72} H ${672} V ${S.cy} H ${S.x}`,
      c1: { x: O.right + 5, y: O.y + O.h * 0.72 - 7, v: "1" },
      cN: { x: S.x - 5, y: S.cy - 5, v: "1", ta: "end" },
      rel: { x: 678, y: (O.y + O.h * 0.72 + S.cy) / 2, t: "ships via" },
      color: "#f87171"
    },
    {
      d: `M ${OI.cx},${OI.bottom} V ${PR.y}`,
      c1: { x: OI.cx + 5, y: OI.bottom + 12, v: "N" },
      cN: { x: PR.cx + 5, y: PR.y - 6, v: "1" },
      rel: { x: OI.cx + 8, y: (OI.bottom + PR.y) / 2, t: "refers to" },
      color: "#38bdf8"
    },
    {
      d: el(TD.right, TD.cy, PR.x, PR.cy),
      c1: { x: TD.right + 6, y: TD.cy - 4, v: "1" },
      cN: { x: PR.x - 4, y: PR.cy - 4, v: "0..1", ta: "end" },
      rel: { x: (TD.right + PR.x) / 2 - 16, y: Math.min(TD.cy, PR.cy) - 11, t: "extends" },
      color: "#fb923c"
    },
    {
      d: el(PR.right, PR.cy, HD.x, HD.cy),
      c1: { x: PR.right + 6, y: PR.cy - 4, v: "1" },
      cN: { x: HD.x - 4, y: HD.cy - 4, v: "0..1", ta: "end" },
      rel: { x: (PR.right + HD.x) / 2 - 16, y: Math.min(PR.cy, HD.cy) - 11, t: "extends" },
      color: "#c084fc"
    },
    {
      d: `M ${PR.cx},${PR.bottom} V ${1110} H ${INV.cx} V ${INV.y}`,
      c1: { x: PR.cx + 5, y: PR.bottom + 12, v: "1" },
      cN: { x: INV.cx + 5, y: INV.y - 6, v: "N" },
      rel: { x: (PR.cx + INV.cx) / 2 + 10, y: 1103, t: "stocked in" },
      color: "#2dd4bf"
    },
  ];

  const SVG_W = 950, SVG_H = 1365;

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
            <text x={e.x + EW - 38} y={e.y + 18.5} fill="#fed7aa" fontSize={8} textAnchor="middle" fontFamily="monospace" fontWeight="700">JUNCTION</text>
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
                fill={isPK ? "#fef3c7" : isFK ? "#bae6fd" : "#64748b"}
                fontSize={10.5} fontFamily="'JetBrains Mono', monospace">
                {a.name}
              </text>
              {isPK && (
                <line x1={textX} y1={ay + 17} x2={textX + textLen} y2={ay + 17}
                  stroke="#fef3c7" strokeWidth={0.8} opacity={0.7} />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const notes = [
    {
      title: "🧵 Thrift vs Handmade",
      hue: "#78350f",
      pts: [
        "product_type in Product differentiates the two",
        "ThriftedDetail: unique piece with is_available bool",
        "HandmadeDetail: batch/MTO with material & lead time",
        "Inventory only for handmade (size/color variants)",
        "Thrift uses is_available instead of stock count",
      ]
    },
    {
      title: "🛒 Many-to-Many Orders",
      hue: "#1e3a8a",
      pts: [
        "OrderItem is the junction — Order × Product",
        "unit_price frozen at time of order (price safety)",
        "selected_size & selected_color captured per item",
        "One order can mix thrifted + handmade products",
      ]
    },
    {
      title: "💳 Payment & Shipping",
      hue: "#064e3b",
      pts: [
        "Payment is 1:1 with Order per purchase",
        "payment_status: pending → paid / failed / refunded",
        "Shipping is 1:1 with Order for delivery tracking",
        "shipping_status: not_shipped → packed → shipped → delivered",
        "tracking_number for WhatsApp status updates",
      ]
    },
    {
      title: "📦 Inventory Design",
      hue: "#042f2e",
      pts: [
        "Each row = one (size, color) variant of a product",
        "quantity_available tracks exact stock per variant",
        "Handmade only — thrift stock is boolean is_available",
        "Supports batch restock by inserting/updating rows",
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
            Instagram Thrift &amp; Handmade Store
          </h1>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 12 }}>
            9 entities · 8 relationships · Products, Orders, Payments, Shipping &amp; Inventory
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { c: "#fbbf24", t: "PK  Primary Key" },
            { c: "#60a5fa", t: "FK  Foreign Key" },
            { c: "#fbbf24", bg: "#78350f", t: "Junction Table" },
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

            <text x={18} y={36} fill="rgba(96,165,250,0.15)" fontSize={10} fontFamily="monospace" letterSpacing={3}>ORDER MANAGEMENT LAYER</text>
            <line x1={14} y1={806} x2={936} y2={806} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 5" />
            <text x={18} y={824} fill="rgba(56,189,248,0.15)" fontSize={10} fontFamily="monospace" letterSpacing={3}>PRODUCT CATALOG LAYER</text>

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
            <span style={{ color: "#334155", fontSize: 11, fontFamily: "monospace" }}>9 entities · 3 FKs in OrderItem</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead>
                <tr style={{ background: "#0a1628" }}>
                  {["Entity", "Type", "Attrs", "Primary Key", "Foreign Keys", "Purpose"].map(h => (
                    <th key={h} style={{ padding: "8px 13px", color: "#475569", textAlign: "left", fontFamily: "monospace", fontSize: 10, fontWeight: 600, borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Customer", "Core", "8", "customer_id", "—", "Buyer contact & delivery info"],
                  ["Order", "Core", "6", "order_id", "customer_id", "Customer purchase record"],
                  ["Payment", "Core", "7", "payment_id", "order_id", "Payment status per order (1:1)"],
                  ["Shipping", "Core", "11", "shipping_id", "order_id", "Delivery & tracking per order (1:1)"],
                  ["OrderItem", "Junction", "7", "order_item_id", "order_id, product_id", "Order ↔ Product many-to-many bridge"],
                  ["Product", "Core", "8", "product_id", "—", "Unified catalog for both types"],
                  ["ThriftedDetail", "Extension", "7", "thrift_detail_id", "product_id", "Brand, condition, single-item availability"],
                  ["HandmadeDetail", "Extension", "5", "handmade_detail_id", "product_id", "Material, MTO flag, production time"],
                  ["Inventory", "Stock", "5", "inventory_id", "product_id", "Variant-level stock (handmade only)"],
                ].map(([name, type, attrs, pk, fks, purpose], i) => (
                  <tr key={name} style={{ background: i % 2 ? "#060d1a" : "#040a14" }}>
                    <td style={{ padding: "8px 13px", color: RAW.find(r => r.id === name)?.light || "#94a3b8", fontFamily: "monospace", fontWeight: 600, fontSize: 11 }}>{name}</td>
                    <td style={{ padding: "8px 13px" }}>
                      <span style={{
                        background: type === "Junction" ? "rgba(120,53,15,0.25)" : type === "Extension" ? "rgba(30,58,138,0.25)" : type === "Stock" ? "rgba(4,47,46,0.3)" : "#1e293b",
                        color: type === "Junction" ? "#fbbf24" : type === "Extension" ? "#60a5fa" : type === "Stock" ? "#2dd4bf" : "#64748b",
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
