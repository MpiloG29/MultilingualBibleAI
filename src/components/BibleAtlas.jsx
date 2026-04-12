import { useState } from "react";
import { LOCATIONS } from "../data/locations";

const TYPE_COLORS = {
  city: "#FFE066", water: "#80E5D4", mountain: "#A8EDCA",
  region: "#FFC785", island: "#B5C8FF",
};
const TYPE_ICONS = {
  city: "🏛️", water: "💧", mountain: "⛰️", region: "🗺️", island: "🏝️",
};

export default function BibleAtlas({ onSearchVerse }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = LOCATIONS.filter(loc => {
    const matchesType = filter === "all" || loc.type === filter;
    const matchesSearch = !search || loc.name.toLowerCase().includes(search.toLowerCase()) || loc.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#FFE066,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          🗺️ Bible Atlas
        </h2>
        <p style={{ color: "#b8a88a", fontStyle: "italic" }}>Interactive map of key biblical locations and their stories</p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search locations..."
            style={{ width: "100%", padding: "10px 12px 10px 38px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,220,100,0.25)", borderRadius: 10, color: "#e8dcc8", fontSize: "0.9rem", outline: "none", fontFamily: "Georgia, serif" }} />
        </div>
        {["all", "city", "water", "mountain", "region", "island"].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "8px 14px", borderRadius: 20, fontSize: "0.8rem", cursor: "pointer", fontFamily: "Georgia, serif",
            background: filter === t ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${filter === t ? "#FFE066" : "rgba(255,255,255,0.1)"}`,
            color: filter === t ? "#FFE066" : "#8a7a60"
          }}>{TYPE_ICONS[t] || "🗺️"} {t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* SVG Map */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 16, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: "0.7rem", color: "#7a6a50", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, textAlign: "center" }}>
            Ancient Near East & Mediterranean World
          </div>
          <svg viewBox="0 0 100 80" style={{ width: "100%", border: "1px solid rgba(255,220,100,0.1)", borderRadius: 10, background: "rgba(0,20,60,0.6)" }}>
            {/* Water bodies (simple shapes) */}
            <ellipse cx="36" cy="42" rx="6" ry="14" fill="rgba(128,229,212,0.2)" stroke="rgba(128,229,212,0.4)" strokeWidth="0.3" />
            <text x="32" y="44" fontSize="2.5" fill="rgba(128,229,212,0.5)">Med</text>
            <text x="32" y="47" fontSize="2.5" fill="rgba(128,229,212,0.5)">Sea</text>
            {/* Nile River rough */}
            <path d="M 40,65 Q 41,58 40,52 Q 40,49 41,47" stroke="rgba(128,229,212,0.3)" strokeWidth="0.8" fill="none" strokeDasharray="1,1" />
            {/* Jordan River rough */}
            <path d="M 53,32 Q 53,37 53,43 Q 53,47 53,52" stroke="rgba(128,229,212,0.3)" strokeWidth="0.5" fill="none" strokeDasharray="0.5,0.5" />

            {/* Region labels */}
            <text x="46" y="44" fontSize="2" fill="rgba(255,224,102,0.25)" fontStyle="italic">Israel</text>
            <text x="38" y="57" fontSize="2" fill="rgba(255,199,133,0.2)" fontStyle="italic">Egypt</text>
            <text x="67" y="45" fontSize="2" fill="rgba(255,199,133,0.2)" fontStyle="italic">Babylon</text>

            {/* Location dots */}
            {filtered.map((loc, i) => {
              const color = TYPE_COLORS[loc.type] || "#c0aa88";
              const isSelected = selected?.name === loc.name;
              const isHigh = loc.importance === "critical" || loc.importance === "high";
              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : loc)} style={{ cursor: "pointer" }}>
                  <circle
                    cx={loc.x} cy={loc.y}
                    r={isSelected ? 2.2 : isHigh ? 1.6 : 1.1}
                    fill={isSelected ? color : color + "99"}
                    stroke={color}
                    strokeWidth={isSelected ? 0.8 : 0.4}
                    opacity={isSelected ? 1 : 0.75}
                  >
                    <title>{loc.name}</title>
                  </circle>
                  {(isHigh || isSelected) && (
                    <text
                      x={loc.x + 2} y={loc.y + 0.8}
                      fontSize={isSelected ? 2.4 : 1.9}
                      fill={isSelected ? color : color + "cc"}
                      fontWeight={isSelected ? "bold" : "normal"}
                    >{loc.name}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <span key={type} style={{ fontSize: "0.7rem", color, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Location Detail / List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto" }}>
          {selected ? (
            <div style={{ animation: "fadeIn 0.25s ease" }}>
              <div style={{
                background: `${TYPE_COLORS[selected.type]}18`,
                border: `2px solid ${TYPE_COLORS[selected.type]}50`,
                borderRadius: 16, padding: "20px 22px", marginBottom: 14
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <h3 style={{ color: TYPE_COLORS[selected.type], margin: "0 0 4px", fontSize: "1.3rem" }}>{selected.emoji} {selected.name}</h3>
                    <span style={{ fontSize: "0.75rem", color: "#7a6a50", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 8 }}>{selected.type}</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#7a6a50", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
                </div>
                <p style={{ color: "#c8b890", margin: "0 0 14px", lineHeight: 1.7, fontSize: "0.92rem" }}>{selected.description}</p>
                <div>
                  <div style={{ fontSize: "0.7rem", color: TYPE_COLORS[selected.type], textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8, fontWeight: 700 }}>Biblical Events</div>
                  {selected.events.map((ev, i) => (
                    <div key={i} style={{ padding: "6px 10px", marginBottom: 6, background: "rgba(255,255,255,0.04)", borderRadius: 8, borderLeft: `3px solid ${TYPE_COLORS[selected.type]}60`, fontSize: "0.84rem", color: "#b0a080" }}>
                      • {ev}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onSearchVerse && onSearchVerse(selected.name)}
                  style={{ marginTop: 14, padding: "8px 18px", background: `${TYPE_COLORS[selected.type]}22`, border: `1px solid ${TYPE_COLORS[selected.type]}`, borderRadius: 8, color: TYPE_COLORS[selected.type], cursor: "pointer", fontSize: "0.82rem", fontFamily: "Georgia, serif" }}
                >
                  🔍 Search "{selected.name}" in Scripture
                </button>
              </div>
            </div>
          ) : null}

          {/* Scrollable list */}
          {filtered.map((loc, i) => {
            const color = TYPE_COLORS[loc.type] || "#c0aa88";
            const isSelected = selected?.name === loc.name;
            return (
              <div
                key={i}
                onClick={() => setSelected(isSelected ? null : loc)}
                style={{
                  padding: "12px 16px", background: isSelected ? `${color}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isSelected ? color + "50" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 12
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{loc.emoji || TYPE_ICONS[loc.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: isSelected ? color : "#c0aa88", fontWeight: isSelected ? 700 : 400, fontSize: "0.88rem" }}>{loc.name}</div>
                  <div style={{ color: "#7a6a50", fontSize: "0.74rem", marginTop: 2 }}>{loc.description.substring(0, 60)}...</div>
                </div>
                <span style={{ fontSize: "0.7rem", color, background: color + "18", padding: "2px 8px", borderRadius: 8 }}>{loc.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
