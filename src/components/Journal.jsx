import { useState, useEffect } from "react";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: "", verse: "", text: "", reflection: "", prayer: "" });
  const [showForm, setShowForm] = useState(false);
  const [activeEntry, setActiveEntry] = useState(null);
  const [searchJournal, setSearchJournal] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bibleJournal");
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

  function saveEntry() {
    if (!newEntry.text.trim()) return;
    const entry = { ...newEntry, id: Date.now(), timestamp: Date.now() };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("bibleJournal", JSON.stringify(updated));
    setNewEntry({ title: "", verse: "", text: "", reflection: "", prayer: "" });
    setShowForm(false);
    setActiveEntry(entry.id);
  }

  function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("bibleJournal", JSON.stringify(updated));
    if (activeEntry === id) setActiveEntry(null);
  }

  function shareEntry(entry) {
    const text = `📖 ${entry.verse ? entry.verse + "\n\n" : ""}${entry.text}${entry.reflection ? "\n\n💭 Reflection: " + entry.reflection : ""}${entry.prayer ? "\n\n🙏 Prayer: " + entry.prayer : ""}`;
    navigator.clipboard.writeText(text);
  }

  const filtered = entries.filter(e =>
    !searchJournal ||
    e.title?.toLowerCase().includes(searchJournal.toLowerCase()) ||
    e.text.toLowerCase().includes(searchJournal.toLowerCase()) ||
    e.verse?.toLowerCase().includes(searchJournal.toLowerCase())
  );

  const active = entries.find(e => e.id === activeEntry);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#FFE066,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          📖 Verse Journal
        </h2>
        <p style={{ color: "#5A4030", fontStyle: "italic" }}>Annotate verses with personal notes, reflections, and prayers</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => { setShowForm(!showForm); setActiveEntry(null); }}
          style={{ padding: "10px 22px", background: "linear-gradient(135deg,#FFE066,#FFC020)", border: "none", borderRadius: 10, color: "#1a0800", fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.9rem", boxShadow: "0 3px 14px rgba(255,200,50,0.3)" }}
        >
          ✏️ New Entry
        </button>
        <div style={{ flex: 1, position: "relative", minWidth: 160 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
          <input value={searchJournal} onChange={e => setSearchJournal(e.target.value)} placeholder="Search journal..."
            style={{ width: "100%", padding: "10px 12px 10px 38px", background: "rgba(255,255,255,0.90)", border: "1.5px solid rgba(255,220,100,0.25)", borderRadius: 10, color: "#1A1240", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif" }} />
        </div>
        <span style={{ fontSize: "0.8rem", color: "#7a6a50" }}>{entries.length} entr{entries.length === 1 ? "y" : "ies"}</span>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.84)", border: "1.5px solid rgba(255,220,100,0.3)", borderRadius: 16, padding: "22px 24px", marginBottom: 24, animation: "fadeIn 0.3s ease" }}>
          <h4 style={{ color: "#FFE066", margin: "0 0 18px", fontSize: "1rem" }}>📝 New Journal Entry</h4>
          {[
            { key: "title", placeholder: "Entry title (optional)...", label: "Title" },
            { key: "verse", placeholder: "e.g. John 3:16 — 'For God so loved the world...'", label: "Verse Reference" },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.72rem", color: "#FFE066", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 6 }}>{field.label}</label>
              <input
                value={newEntry[field.key]}
                onChange={e => setNewEntry(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 8, color: "#1A1240", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif" }}
              />
            </div>
          ))}
          {[
            { key: "text", placeholder: "What did this verse speak to you today?", label: "Note / Insight", rows: 4 },
            { key: "reflection", placeholder: "How does this apply to your life right now?", label: "Personal Reflection", rows: 3 },
            { key: "prayer", placeholder: "Write a prayer response to this verse...", label: "Prayer", rows: 3 },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.72rem", color: "#FFE066", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 6 }}>{field.label}</label>
              <textarea
                value={newEntry[field.key]}
                onChange={e => setNewEntry(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                rows={field.rows}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 8, color: "#1A1240", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif", resize: "vertical" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveEntry} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#FFE066,#FFC020)", border: "none", borderRadius: 8, color: "#1a0800", fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
              💾 Save Entry
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 18px", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#6A5A40", cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Entries Layout */}
      {entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.6 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>📔</div>
          <p style={{ color: "#8a7a60", fontStyle: "italic", fontSize: "1rem" }}>Your journal is empty. Click "New Entry" to begin recording your reflections.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: active ? "280px 1fr" : "1fr", gap: 16 }}>
          {/* Entry List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(entry => {
              const isActive = activeEntry === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setActiveEntry(isActive ? null : entry.id)}
                  style={{
                    padding: "14px 16px", background: isActive ? "rgba(255,220,100,0.1)" : "rgba(255,255,255,0.82)",
                    border: `1px solid ${isActive ? "rgba(255,220,100,0.4)" : "rgba(255,255,255,0.88)"}`,
                    borderLeft: `4px solid ${isActive ? "#FFE066" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 12, cursor: "pointer", transition: "all 0.18s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {entry.title && <div style={{ color: isActive ? "#FFE066" : "#c0aa88", fontWeight: 700, fontSize: "0.9rem", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.title}</div>}
                      {entry.verse && <div style={{ color: "#6A5A40", fontSize: "0.76rem", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📖 {entry.verse}</div>}
                      <div style={{ color: "#7a6a50", fontSize: "0.78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.text.substring(0, 70)}{entry.text.length > 70 ? "..." : ""}</div>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#5a4a30", whiteSpace: "nowrap" }}>{formatDate(entry.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Entry Detail */}
          {active && (
            <div style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 16, padding: "24px", animation: "fadeIn 0.25s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  {active.title && <h3 style={{ color: "#FFE066", margin: "0 0 4px", fontSize: "1.15rem" }}>{active.title}</h3>}
                  <div style={{ color: "#7a6a50", fontSize: "0.78rem" }}>{formatDate(active.timestamp)}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => shareEntry(active)} style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "5px 12px", fontSize: "0.75rem", color: "#4A3828", cursor: "pointer" }}>📤 Share</button>
                  <button onClick={() => deleteEntry(active.id)} style={{ background: "rgba(255,70,70,0.1)", border: "1px solid rgba(255,70,70,0.3)", borderRadius: 6, padding: "5px 12px", fontSize: "0.75rem", color: "#ff8a8a", cursor: "pointer" }}>🗑️</button>
                </div>
              </div>
              {active.verse && (
                <div style={{ padding: "10px 14px", background: "rgba(255,220,100,0.08)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 8, marginBottom: 16, color: "#c0aa88", fontSize: "0.9rem", fontStyle: "italic" }}>
                  📖 {active.verse}
                </div>
              )}
              {active.text && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: "0.7rem", color: "#FFE066", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Note</div>
                  <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.8, fontSize: "0.93rem" }}>{active.text}</p>
                </div>
              )}
              {active.reflection && (
                <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(181,200,255,0.07)", borderRadius: 10, borderLeft: "3px solid #B5C8FF" }}>
                  <div style={{ fontSize: "0.7rem", color: "#B5C8FF", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Personal Reflection</div>
                  <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.8, fontSize: "0.9rem" }}>{active.reflection}</p>
                </div>
              )}
              {active.prayer && (
                <div style={{ padding: "12px 16px", background: "rgba(168,237,202,0.07)", borderRadius: 10, borderLeft: "3px solid #A8EDCA" }}>
                  <div style={{ fontSize: "0.7rem", color: "#A8EDCA", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Prayer</div>
                  <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.8, fontSize: "0.9rem", fontStyle: "italic" }}>{active.prayer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
