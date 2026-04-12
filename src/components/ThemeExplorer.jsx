import { useState } from "react";
import { THEMES } from "../data/themes";

function highlightText(text, query) {
  if (!query || query.length < 2) return text;
  try {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: "linear-gradient(120deg,#FFE066,#FFB347)", color: "#1a0a00", borderRadius: 3, padding: "0 2px", fontWeight: 700 }}>{part}</mark>
      ) : part
    );
  } catch { return text; }
}

export default function ThemeExplorer({ onSearchVerse }) {
  const [activeTheme, setActiveTheme] = useState(null);
  const [filter, setFilter] = useState("");
  const [expandedVerse, setExpandedVerse] = useState(null);
  const [copied, setCopied] = useState(null);

  const filteredThemes = filter
    ? THEMES.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()) || t.description.toLowerCase().includes(filter.toLowerCase()) || t.keywords?.some(k => k.includes(filter.toLowerCase())))
    : THEMES;

  function copyVerse(verse, idx) {
    navigator.clipboard.writeText(`"${verse.text}" — ${verse.book} ${verse.chapter}:${verse.verse}`);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#FFE066,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          🎨 Theme Explorer
        </h2>
        <p style={{ color: "#b8a88a", fontStyle: "italic" }}>Browse Bible verses grouped by life's greatest themes</p>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 24, position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter themes..."
          style={{ width: "100%", padding: "12px 14px 12px 42px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,220,100,0.25)", borderRadius: 12, color: "#e8dcc8", fontSize: "0.95rem", outline: "none", fontFamily: "Georgia, serif" }}
        />
      </div>

      {/* Theme Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
        {filteredThemes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(activeTheme?.id === theme.id ? null : theme)}
            style={{
              background: activeTheme?.id === theme.id ? theme.bgColor : "rgba(255,255,255,0.03)",
              border: `2px solid ${activeTheme?.id === theme.id ? theme.color : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16, padding: "20px", cursor: "pointer", textAlign: "left",
              transition: "all 0.2s", fontFamily: "Georgia, serif",
              boxShadow: activeTheme?.id === theme.id ? `0 4px 24px ${theme.color}30` : "none",
              transform: activeTheme?.id === theme.id ? "scale(1.02)" : "scale(1)",
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{theme.icon}</div>
            <div style={{ color: theme.color, fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{theme.name}</div>
            <div style={{ color: "#8a7a60", fontSize: "0.82rem" }}>{theme.description}</div>
            <div style={{ marginTop: 10, color: "#5a4a30", fontSize: "0.75rem" }}>{theme.verses.length} verses</div>
          </button>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div style={{ textAlign: "center", color: "#6a5a40", padding: "40px 0", fontStyle: "italic" }}>No themes match your filter.</div>
      )}

      {/* Active Theme Verses */}
      {activeTheme && (
        <div style={{ animation: "fadeIn 0.35s ease" }}>
          <div style={{
            background: activeTheme.bgColor, border: `2px solid ${activeTheme.color}50`,
            borderRadius: 20, padding: "24px 28px", marginBottom: 24, borderLeft: `6px solid ${activeTheme.color}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: "2rem" }}>{activeTheme.icon}</span>
              <div>
                <h3 style={{ color: activeTheme.color, margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>{activeTheme.name}</h3>
                <p style={{ color: "#b0a080", margin: 0, fontSize: "0.9rem" }}>{activeTheme.description}</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {activeTheme.verses.map((verse, i) => {
              const isExpanded = expandedVerse === i;
              return (
                <div key={i} style={{
                  background: isExpanded ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isExpanded ? activeTheme.color + "50" : "rgba(255,255,255,0.08)"}`,
                  borderLeft: `4px solid ${activeTheme.color}`,
                  borderRadius: 14, padding: "18px 22px", transition: "all 0.22s"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <span style={{
                      background: activeTheme.color + "22", color: activeTheme.color,
                      border: `1px solid ${activeTheme.color}40`, borderRadius: 8,
                      padding: "4px 12px", fontSize: "0.8rem", fontWeight: 700, fontFamily: "monospace"
                    }}>
                      {verse.book} {verse.chapter}:{verse.verse}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => onSearchVerse && onSearchVerse(verse.book)}
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 10px", fontSize: "0.72rem", color: "#b0a080", cursor: "pointer", fontFamily: "Georgia, serif" }}
                      >🔍 Search</button>
                      <button
                        onClick={() => copyVerse(verse, i)}
                        style={{ background: copied === i ? "rgba(168,237,202,0.2)" : "rgba(255,255,255,0.08)", border: `1px solid ${copied === i ? "#A8EDCA" : "rgba(255,255,255,0.15)"}`, borderRadius: 6, padding: "4px 10px", fontSize: "0.72rem", color: copied === i ? "#A8EDCA" : "#b0a080", cursor: "pointer", fontFamily: "Georgia, serif" }}
                      >{copied === i ? "✓ Copied" : "📋 Copy"}</button>
                      <button
                        onClick={() => setExpandedVerse(isExpanded ? null : i)}
                        style={{ background: "none", border: "none", color: "#6a5a40", cursor: "pointer", fontSize: "0.75rem", fontFamily: "Georgia, serif" }}
                      >{isExpanded ? "▲ hide" : "▼ context"}</button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.85, color: "#ddd0b0", fontStyle: "italic" }}>
                    "{highlightText(verse.text, filter)}"
                  </p>
                  {isExpanded && verse.context && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 8, fontSize: "0.86rem", color: "#9a8a6a", borderTop: `2px solid ${activeTheme.color}30`, animation: "fadeIn 0.2s ease" }}>
                      <span style={{ color: activeTheme.color, fontWeight: 700 }}>✦ Context: </span>{verse.context}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
        <h4 style={{ color: "#7a6a50", fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>All Themes</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setActiveTheme(t)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: "0.8rem", background: activeTheme?.id === t.id ? t.bgColor : "rgba(255,255,255,0.04)", border: `1px solid ${activeTheme?.id === t.id ? t.color : "rgba(255,255,255,0.1)"}`, color: activeTheme?.id === t.id ? t.color : "#8a7a60", cursor: "pointer", fontFamily: "Georgia, serif" }}>
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
