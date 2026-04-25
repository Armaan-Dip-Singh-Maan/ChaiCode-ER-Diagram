import { useEffect, useState } from "react";
import ERDiagram from "./ERDiagram.jsx";
import FitnessCoachingERDiagram from "./FitnessCoachingERDiagram.jsx";
import ClinicERDiagram from "./ClinicERDiagram.jsx";
import SmartElevatorERDiagram from "./SmartElevatorERDiagram.jsx";

const TABS = [
  { id: "thrift", label: "Instagram Thrift Store" },
  { id: "fitness", label: "Fitness Coaching (ChaiCode)" },
  { id: "clinic", label: "Clinic & Diagnostics (2026)" },
  { id: "elevator", label: "Smart Elevator (2026)" },
];

export default function App() {
  const parseHash = () => {
    const h = window.location.hash.replace(/^#/, "");
    if (h === "fitness" || h === "fitfitness") return "fitness";
    if (h === "clinic") return "clinic";
    if (h === "elevator") return "elevator";
    return "thrift";
  };

  const [tab, setTab] = useState(() => {
    if (typeof window === "undefined") return "thrift";
    return parseHash();
  });

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "thrift";
    }
    const onHash = () => {
      setTab(parseHash());
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title =
      tab === "fitness"
        ? "ER Diagram — Online Fitness Coaching Platform"
        : tab === "clinic"
          ? "ER Diagram — Clinic Appointment & Diagnostics"
          : tab === "elevator"
            ? "ER Diagram — Smart Elevator Control Platform"
            : "ER Diagram — Instagram Thrift & Handmade Store";
  }, [tab]);

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
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                window.location.hash = t.id;
              }}
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
      {tab === "thrift" && <ERDiagram key="thrift" />}
      {tab === "fitness" && <FitnessCoachingERDiagram key="fitness" />}
      {tab === "clinic" && <ClinicERDiagram key="clinic" />}
      {tab === "elevator" && <SmartElevatorERDiagram key="elevator" />}
    </div>
  );
}
