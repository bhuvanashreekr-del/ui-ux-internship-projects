import { useState, useEffect } from "react";

const decisions = [
  {
    id: "D-1042",
    type: "Loan Approval",
    outcome: "Denied",
    confidence: 87,
    timestamp: "Today, 10:32 AM",
    user: "Rahul M., Age 29",
    factors: [
      { label: "Credit Score", value: 610, impact: -38, direction: "negative", weight: "High" },
      { label: "Monthly Income", value: "₹42,000", impact: +22, direction: "positive", weight: "High" },
      { label: "Existing Debt", value: "₹1.2L", impact: -29, direction: "negative", weight: "Medium" },
      { label: "Employment Duration", value: "8 months", impact: -15, direction: "negative", weight: "Medium" },
      { label: "Payment History", value: "2 missed", impact: -20, direction: "negative", weight: "High" },
    ],
    modelPath: ["Input Layer", "Risk Scoring", "Policy Filter", "Final Decision"],
    explanation: "The model denied this application primarily due to a below-threshold credit score combined with recent missed payments. Despite a stable income, the debt-to-income ratio exceeded the 35% policy limit.",
  },
  {
    id: "D-1043",
    type: "Insurance Claim",
    outcome: "Approved",
    confidence: 94,
    timestamp: "Today, 11:15 AM",
    user: "Priya S., Age 34",
    factors: [
      { label: "Claim History", value: "Clean", impact: +35, direction: "positive", weight: "High" },
      { label: "Policy Age", value: "4 years", impact: +28, direction: "positive", weight: "Medium" },
      { label: "Claim Amount", value: "₹85,000", impact: -10, direction: "negative", weight: "Low" },
      { label: "Documentation", value: "Complete", impact: +22, direction: "positive", weight: "High" },
      { label: "Risk Zone", value: "Zone B", impact: +8, direction: "positive", weight: "Low" },
    ],
    modelPath: ["Input Layer", "Fraud Detection", "Policy Validation", "Final Decision"],
    explanation: "Strong claim history and complete documentation pushed this claim well above approval threshold. The relatively high claim amount had minor negative weight but was offset by a 4-year policy tenure.",
  },
  {
    id: "D-1044",
    type: "Credit Limit",
    outcome: "Increased",
    confidence: 78,
    timestamp: "Today, 12:44 PM",
    user: "Arun K., Age 41",
    factors: [
      { label: "Spending Pattern", value: "Consistent", impact: +30, direction: "positive", weight: "High" },
      { label: "Credit Utilization", value: "28%", impact: +20, direction: "positive", weight: "Medium" },
      { label: "Income Growth", value: "+12% YoY", impact: +18, direction: "positive", weight: "Medium" },
      { label: "Late Payments", value: "1 (6mo ago)", impact: -15, direction: "negative", weight: "Low" },
      { label: "Account Age", value: "6 years", impact: +25, direction: "positive", weight: "High" },
    ],
    modelPath: ["Input Layer", "Behavior Analysis", "Risk Scoring", "Final Decision"],
    explanation: "Long account tenure and healthy credit utilization drove the upgrade. One late payment 6 months ago had minimal impact given the otherwise strong profile and consistent spending patterns.",
  },
];

const timelineData = [
  { time: "09:00", decisions: 12, flagged: 2 },
  { time: "10:00", decisions: 28, flagged: 5 },
  { time: "11:00", decisions: 35, flagged: 3 },
  { time: "12:00", decisions: 42, flagged: 7 },
  { time: "13:00", decisions: 31, flagged: 4 },
  { time: "14:00", decisions: 19, flagged: 1 },
];

export default function XAIDashboard() {
  const [selected, setSelected] = useState(decisions[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [animFactors, setAnimFactors] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    setAnimFactors(false);
    const t = setTimeout(() => setAnimFactors(true), 100);
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= selected.modelPath.length - 1) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 500);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [selected]);

  const maxDecisions = Math.max(...timelineData.map(d => d.decisions));

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#0a0e1a",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #2a3a5c; border-radius: 2px; }
        .card { background: #111827; border: 1px solid #1e2d47; border-radius: 12px; }
        .glow-green { box-shadow: 0 0 20px rgba(52,211,153,0.15); }
        .glow-red { box-shadow: 0 0 20px rgba(239,68,68,0.15); }
        .glow-blue { box-shadow: 0 0 20px rgba(59,130,246,0.15); }
        .decision-row { cursor: pointer; padding: 12px 16px; border-radius: 8px; border: 1px solid transparent; transition: all 0.2s; margin-bottom: 8px; }
        .decision-row:hover { border-color: #2a3a5c; background: #161f30; }
        .decision-row.active { border-color: #3b82f6; background: #162036; }
        .factor-bar { height: 6px; border-radius: 3px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; transition: all 0.4s; border: 2px solid #1e2d47; }
        .step-line { flex: 1; height: 2px; transition: background 0.4s; }
        .stat-card { padding: 16px 20px; border-radius: 10px; border: 1px solid #1e2d47; background: #111827; }
        .tag { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#0d1424", borderBottom: "1px solid #1e2d47", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔍</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#f1f5f9" }}>XAI Monitor</div>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.08em" }}>AI EXPLAINABILITY DASHBOARD</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }}></div>
          <span style={{ fontSize: 12, color: "#64748b" }}>Live · FinTech Model v2.4</span>
        </div>
      </div>

      <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>

        {/* Left: Decision List */}
        <div>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em", marginBottom: 12 }}>RECENT DECISIONS</div>
          {decisions.map(d => (
            <div key={d.id} className={`decision-row ${selected.id === d.id ? "active" : ""}`} onClick={() => setSelected(d)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{d.id}</span>
                <span className="tag" style={{
                  background: d.outcome === "Denied" ? "rgba(239,68,68,0.15)" : "rgba(52,211,153,0.15)",
                  color: d.outcome === "Denied" ? "#f87171" : "#34d399"
                }}>{d.outcome}</span>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: "#e2e8f0", marginBottom: 4 }}>{d.type}</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{d.user} · {d.timestamp}</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 3, background: "#1e2d47", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.confidence}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", borderRadius: 2 }}></div>
                </div>
                <span style={{ fontSize: 11, color: "#64748b" }}>{d.confidence}%</span>
              </div>
            </div>
          ))}

          {/* Stats */}
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Today", value: "148", sub: "decisions" },
              { label: "Flagged", value: "22", sub: "for review" },
              { label: "Avg Conf.", value: "86%", sub: "accuracy" },
              { label: "Models", value: "3", sub: "active" },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#f1f5f9" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label} {s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Decision Header */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#f1f5f9", marginBottom: 4 }}>{selected.type}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{selected.user} · {selected.timestamp}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="tag" style={{
                  fontSize: 13, padding: "6px 16px",
                  background: selected.outcome === "Denied" ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.2)",
                  color: selected.outcome === "Denied" ? "#f87171" : "#34d399",
                  border: `1px solid ${selected.outcome === "Denied" ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.3)"}`,
                  borderRadius: 6,
                }}>{selected.outcome}</span>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Confidence: {selected.confidence}%</div>
              </div>
            </div>

            {/* Model Path */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em", marginBottom: 10 }}>DECISION PATHWAY</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {selected.modelPath.map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", flex: i < selected.modelPath.length - 1 ? 1 : "none" }}>
                    <div className="step-dot" style={{
                      background: i <= activeStep ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "#1e2d47",
                      borderColor: i <= activeStep ? "#3b82f6" : "#1e2d47",
                      color: i <= activeStep ? "#fff" : "#475569",
                    }}>{i + 1}</div>
                    <div style={{ fontSize: 10, color: i <= activeStep ? "#94a3b8" : "#334155", marginLeft: 6, marginRight: 6, whiteSpace: "nowrap" }}>{step}</div>
                    {i < selected.modelPath.length - 1 && (
                      <div className="step-line" style={{ background: i < activeStep ? "#3b82f6" : "#1e2d47", marginRight: 6 }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0d1424", border: "1px solid #1e2d47", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
              💡 {selected.explanation}
            </div>
          </div>

          {/* Factor Impact */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em", marginBottom: 16 }}>FEATURE IMPACT BREAKDOWN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {selected.factors.map((f, i) => (
                <div key={f.label} style={{ animationDelay: `${i * 100}ms` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, color: "#e2e8f0" }}>{f.label}</span>
                      <span className="tag" style={{
                        background: f.weight === "High" ? "rgba(59,130,246,0.15)" : "rgba(100,116,139,0.15)",
                        color: f.weight === "High" ? "#60a5fa" : "#64748b",
                        fontSize: 10,
                      }}>{f.weight}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{f.value}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: f.direction === "positive" ? "#34d399" : "#f87171", minWidth: 40, textAlign: "right" }}>
                        {f.direction === "positive" ? "+" : ""}{f.impact}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "#1e2d47", borderRadius: 3, overflow: "hidden" }}>
                    <div className="factor-bar" style={{
                      width: animFactors ? `${Math.abs(f.impact)}%` : "0%",
                      background: f.direction === "positive"
                        ? "linear-gradient(90deg, #10b981, #34d399)"
                        : "linear-gradient(90deg, #ef4444, #f87171)",
                      transitionDelay: `${i * 80}ms`,
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em", marginBottom: 16 }}>DECISION VOLUME — TODAY</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {timelineData.map((d, i) => (
                <div key={d.time} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
                  onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  <div style={{ position: "relative", width: "100%", height: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 2 }}>
                    {hoveredBar === i && (
                      <div style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", background: "#1e2d47", border: "1px solid #2a3a5c", borderRadius: 4, padding: "3px 8px", fontSize: 11, whiteSpace: "nowrap", color: "#e2e8f0" }}>
                        {d.decisions} decisions · {d.flagged} flagged
                      </div>
                    )}
                    <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: "rgba(239,68,68,0.5)", height: `${(d.flagged / maxDecisions) * 60}px`, transition: "height 0.3s" }}></div>
                    <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: "linear-gradient(180deg, #3b82f6, #1d4ed8)", height: `${((d.decisions - d.flagged) / maxDecisions) * 60}px`, transition: "height 0.3s" }}></div>
                  </div>
                  <span style={{ fontSize: 10, color: "#475569" }}>{d.time}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "#3b82f6" }}></div>
                <span style={{ fontSize: 11, color: "#64748b" }}>Normal</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(239,68,68,0.5)" }}></div>
                <span style={{ fontSize: 11, color: "#64748b" }}>Flagged</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
