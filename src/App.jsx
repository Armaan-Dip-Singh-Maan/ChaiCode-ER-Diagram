import { useEffect, useState } from "react";
import ERDiagram from "./ERDiagram.jsx";
import FitnessCoachingERDiagram from "./FitnessCoachingERDiagram.jsx";

const TABS = [
  { id: "thrift", label: "Instagram Thrift Store" },
  { id: "fitness", label: "Fitness Coaching (ChaiCode)" },
];

export default function App() {
  const [tab, setTab] = useState(() => {
    if (typeof window === "undefined") return "thrift";
    const h = window.location.hash.replace(/^#/, "");
    return h === "fitness" ? "fitness" : "thrift";
  });

  useEffect(() => {
    window.location.hash = tab === "fitness" ? "fitness" : "thrift";
    document.title =
      tab === "fitness"
        ? "ER Diagram — Online Fitness Coaching Platform"
        : "ER Diagram — Instagram Thrift & Handmade Store";
  }, [tab]);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      setTab(h === "fitness" ? "fitness" : "thrift");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div style={{ background: "#020812", minHeight: "100vh" }}>
      <nav
        style={{
          display: "flex",
          gap: 0,
          padding: "0 16px",
          background: "#0a0f1e",
          borderBottom: "1px solid #1e293b",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                padding: "12px 18px",
                border: "none",
                borderBottom: active ? "2px solid #60a5fa" : "2px solid transparent",
                background: active ? "rgba(30,58,138,0.25)" : "transparent",
                color: active ? "#e2e8f0" : "#64748b",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
      {tab === "thrift" ? <ERDiagram /> : <FitnessCoachingERDiagram />}
    </div>
  );
}
