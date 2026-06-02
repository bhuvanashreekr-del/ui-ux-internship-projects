import { useState } from "react";

const patients = [
  { id: "P-0091", name: "Meera Nair", age: 62, gender: "F", ward: "Cardiology", status: "Critical", bp: "158/96", spo2: 91, hr: 108, temp: "38.4°C", lastSeen: "10 min ago", alerts: ["High BP", "Low SpO2"], doctor: "Dr. Sharma" },
  { id: "P-0092", name: "Rajesh Kumar", age: 45, gender: "M", ward: "General", status: "Stable", bp: "122/80", spo2: 98, hr: 76, temp: "37.1°C", lastSeen: "1 hr ago", alerts: [], doctor: "Dr. Priya" },
  { id: "P-0093", name: "Sunita Devi", age: 70, gender: "F", ward: "Nephrology", status: "Watch", bp: "140/88", spo2: 95, hr: 84, temp: "37.8°C", lastSeen: "30 min ago", alerts: ["Elevated BP"], doctor: "Dr. Anand" },
  { id: "P-0094", name: "Arjun Mehta", age: 31, gender: "M", ward: "Ortho", status: "Stable", bp: "118/76", spo2: 99, hr: 68, temp: "36.9°C", lastSeen: "2 hrs ago", alerts: [], doctor: "Dr. Nair" },
];

const records = {
  "P-0091": {
    history: [
      { date: "02 Jun 2026", note: "Patient complained of chest tightness. BP elevated. ECG ordered.", by: "Dr. Sharma" },
      { date: "01 Jun 2026", note: "Admitted via ER. Hypertensive crisis. Started IV labetalol.", by: "Dr. Priya" },
      { date: "28 May 2026", note: "Outpatient visit — BP 148/92. Amlodipine 10mg prescribed.", by: "Dr. Sharma" },
    ],
    medications: [
      { name: "Amlodipine", dose: "10mg", freq: "Once daily", route: "Oral", status: "Active" },
      { name: "Labetalol IV", dose: "200mg", freq: "PRN", route: "IV", status: "Active" },
      { name: "Aspirin", dose: "75mg", freq: "Once daily", route: "Oral", status: "Active" },
    ],
    labs: [
      { test: "CBC", result: "WBC: 11.2 K/µL", flag: "High", date: "02 Jun" },
      { test: "BMP", result: "Creatinine: 1.1 mg/dL", flag: "Normal", date: "02 Jun" },
      { test: "ECG", result: "LVH pattern noted", flag: "Abnormal", date: "01 Jun" },
      { test: "Chest X-Ray", result: "Mild cardiomegaly", flag: "Abnormal", date: "01 Jun" },
    ],
  },
};

const vitalsHistory = [
  { time: "06:00", bp: 162, spo2: 89, hr: 112 },
  { time: "09:00", bp: 158, spo2: 91, hr: 108 },
  { time: "12:00", bp: 154, spo2: 93, hr: 102 },
  { time: "15:00", bp: 150, spo2: 94, hr: 98 },
  { time: "18:00", bp: 148, spo2: 95, hr: 94 },
  { time: "21:00", bp: 145, spo2: 96, hr: 90 },
];

const maxBP = Math.max(...vitalsHistory.map(v => v.bp));
const minBP = Math.min(...vitalsHistory.map(v => v.bp));

export default function EHRDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const rec = records[selectedPatient.id] || { history: [], medications: [], labs: [] };

  const statusColor = {
    Critical: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.3)" },
    Watch: { bg: "rgba(251,146,60,0.12)", text: "#fb923c", border: "rgba(251,146,60,0.3)" },
    Stable: { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  };

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      background: "#f0f4f8",
      minHeight: "100vh",
      color: "#1e293b",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .tab-btn { padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; background: transparent; color: #64748b; }
        .tab-btn.active { background: #fff; color: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .patient-row { padding: 12px 14px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; margin-bottom: 6px; background: #fff; }
        .patient-row:hover { border-color: #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .patient-row.active { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .vital-card { background: #fff; border-radius: 10px; padding: 14px 18px; border: 1px solid #e2e8f0; }
        .tag { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .alert-pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); display: inline-flex; align-items: center; gap: 4px; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #0ea5e9, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏥</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", letterSpacing: "-0.01em" }}>MediCore EHR</div>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em" }}>PATIENT MANAGEMENT SYSTEM</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>1</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Critical</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c" }}>1</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Watch</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399" }}>2</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Stable</div>
          </div>
          <div style={{ width: 1, height: 32, background: "#e2e8f0" }}></div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>DS</div>
        </div>
      </div>

      <div style={{ padding: "20px 28px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>

        {/* Patient List */}
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10 }}>PATIENTS ON FLOOR · 4</div>
          {patients.map(p => (
            <div key={p.id} className={`patient-row ${selectedPatient.id === p.id ? "active" : ""}`} onClick={() => { setSelectedPatient(p); setActiveTab("overview"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{p.name}</div>
                <span className="tag" style={{
                  background: statusColor[p.status].bg,
                  color: statusColor[p.status].text,
                  border: `1px solid ${statusColor[p.status].border}`,
                }}>{p.status}</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{p.age}y {p.gender} · {p.ward} · {p.doctor}</div>
              {p.alerts.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.alerts.map(a => <span key={a} className="alert-pill">⚠ {a}</span>)}
                </div>
              )}
              {p.alerts.length === 0 && <div style={{ fontSize: 11, color: "#34d399" }}>✓ No active alerts</div>}
            </div>
          ))}
        </div>

        {/* Patient Detail */}
        <div>
          {/* Patient Header Card */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg, #0ea5e9, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", fontWeight: 700 }}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: "#0f172a" }}>{selectedPatient.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{selectedPatient.id} · {selectedPatient.age}y {selectedPatient.gender} · {selectedPatient.ward}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Attending: {selectedPatient.doctor} · Last assessed {selectedPatient.lastSeen}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span className="tag" style={{
                  padding: "6px 16px", fontSize: 13,
                  background: statusColor[selectedPatient.status].bg,
                  color: statusColor[selectedPatient.status].text,
                  border: `1px solid ${statusColor[selectedPatient.status].border}`,
                  borderRadius: 8,
                }}>{selectedPatient.status}</span>
                {selectedPatient.alerts.length > 0 && selectedPatient.alerts.map(a => (
                  <span key={a} className="alert-pill">⚠ {a}</span>
                ))}
              </div>
            </div>

            {/* Vitals Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { label: "Blood Pressure", value: selectedPatient.bp, unit: "mmHg", icon: "🩺", alert: selectedPatient.status === "Critical" },
                { label: "SpO₂", value: `${selectedPatient.spo2}%`, unit: "oxygen", icon: "💧", alert: selectedPatient.spo2 < 95 },
                { label: "Heart Rate", value: `${selectedPatient.hr}`, unit: "bpm", icon: "❤️", alert: selectedPatient.hr > 100 },
                { label: "Temperature", value: selectedPatient.temp, unit: "", icon: "🌡️", alert: parseFloat(selectedPatient.temp) > 38 },
              ].map(v => (
                <div key={v.label} className="vital-card" style={{ borderColor: v.alert ? "rgba(239,68,68,0.3)" : "#e2e8f0", background: v.alert ? "rgba(239,68,68,0.04)" : "#fff" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>{v.icon} {v.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: v.alert ? "#ef4444" : "#0f172a", fontFamily: "'IBM Plex Mono', monospace" }}>{v.value}</div>
                  <div style={{ fontSize: 11, color: v.alert ? "#f87171" : "#94a3b8" }}>{v.alert ? "⚠ Out of range" : v.unit || "Normal"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "#e2e8f0", borderRadius: 8, padding: 4, marginBottom: 16, width: "fit-content" }}>
            {["overview", "records", "medications", "labs"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>BP TREND — TODAY</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                  {vitalsHistory.map((v, i) => (
                    <div key={v.time} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: "100%", borderRadius: "3px 3px 0 0",
                        height: `${((v.bp - minBP + 10) / (maxBP - minBP + 20)) * 75}px`,
                        background: v.bp > 150 ? "linear-gradient(180deg, #ef4444, #dc2626)" : v.bp > 140 ? "linear-gradient(180deg, #fb923c, #ea580c)" : "linear-gradient(180deg, #34d399, #10b981)",
                        transition: "height 0.5s",
                      }}></div>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{v.time}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#64748b" }}>
                  <span>Peak: {maxBP} mmHg</span>
                  <span style={{ color: "#34d399" }}>Trending ↓</span>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>QUICK SUMMARY</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Ward</span><span style={{ fontWeight: 500 }}>{selectedPatient.ward}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Attending</span><span style={{ fontWeight: 500 }}>{selectedPatient.doctor}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Last Assessed</span><span style={{ fontWeight: 500 }}>{selectedPatient.lastSeen}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: selectedPatient.alerts.length > 0 ? "rgba(239,68,68,0.06)" : "#f0fdf4", borderRadius: 6, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Active Alerts</span>
                    <span style={{ fontWeight: 600, color: selectedPatient.alerts.length > 0 ? "#ef4444" : "#34d399" }}>
                      {selectedPatient.alerts.length > 0 ? selectedPatient.alerts.join(", ") : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "records" && (
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>CLINICAL NOTES</div>
              {rec.history.length > 0 ? rec.history.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? "#3b82f6" : "#e2e8f0", border: "2px solid", borderColor: i === 0 ? "#3b82f6" : "#cbd5e1", flexShrink: 0, marginTop: 3 }}></div>
                    {i < rec.history.length - 1 && <div style={{ width: 1, flex: 1, background: "#e2e8f0", marginTop: 4 }}></div>}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{h.date} · {h.by}</div>
                    <div style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6, background: "#f8fafc", borderRadius: 6, padding: "10px 14px" }}>{h.note}</div>
                  </div>
                </div>
              )) : <div style={{ color: "#94a3b8", fontSize: 13, padding: "20px 0", textAlign: "center" }}>No records available for this patient.</div>}
            </div>
          )}

          {activeTab === "medications" && (
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>CURRENT MEDICATIONS</div>
              {rec.medications.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                      {["Medication", "Dose", "Frequency", "Route", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rec.medications.map((m, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px", fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{m.name}</td>
                        <td style={{ padding: "12px", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", color: "#334155" }}>{m.dose}</td>
                        <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{m.freq}</td>
                        <td style={{ padding: "12px", fontSize: 13, color: "#475569" }}>{m.route}</td>
                        <td style={{ padding: "12px" }}><span className="tag" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div style={{ color: "#94a3b8", fontSize: 13, padding: "20px 0", textAlign: "center" }}>No medications on record.</div>}
            </div>
          )}

          {activeTab === "labs" && (
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>LAB RESULTS</div>
              {rec.labs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {rec.labs.map((l, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: `1px solid ${l.flag === "Normal" ? "#e2e8f0" : l.flag === "High" ? "rgba(251,146,60,0.3)" : "rgba(239,68,68,0.2)"}` }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 2 }}>{l.test}</div>
                        <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'IBM Plex Mono', monospace" }}>{l.result}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="tag" style={{
                          background: l.flag === "Normal" ? "rgba(52,211,153,0.12)" : l.flag === "High" ? "rgba(251,146,60,0.12)" : "rgba(239,68,68,0.12)",
                          color: l.flag === "Normal" ? "#34d399" : l.flag === "High" ? "#fb923c" : "#ef4444",
                          border: `1px solid ${l.flag === "Normal" ? "rgba(52,211,153,0.3)" : l.flag === "High" ? "rgba(251,146,60,0.3)" : "rgba(239,68,68,0.3)"}`,
                        }}>{l.flag}</span>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{l.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div style={{ color: "#94a3b8", fontSize: 13, padding: "20px 0", textAlign: "center" }}>No lab results available.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
