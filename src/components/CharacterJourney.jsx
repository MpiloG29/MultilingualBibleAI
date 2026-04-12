import { useState } from "react";
import { CHARACTERS, EVENT_TYPES } from "../data/characters";

export default function CharacterJourney({ onSearchVerse }) {
  const [selected, setSelected] = useState(CHARACTERS[3]); // Jesus by default
  const [hoveredEvent, setHoveredEvent] = useState(null);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#FFE066,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          👤 Character Journey Maps
        </h2>
        <p style={{ color: "#b8a88a", fontStyle: "italic" }}>Visual timelines showing where and when key figures appear across Scripture</p>
      </div>

      {/* Character Selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28, justifyContent: "center" }}>
        {CHARACTERS.map(char => (
          <button
            key={char.name}
            onClick={() => setSelected(char)}
            style={{
              padding: "10px 18px", borderRadius: 24, cursor: "pointer", fontFamily: "Georgia, serif",
              background: selected?.name === char.name ? `${char.color}22` : "rgba(255,255,255,0.04)",
              border: `2px solid ${selected?.name === char.name ? char.color : "rgba(255,255,255,0.1)"}`,
              color: selected?.name === char.name ? char.color : "#9a8a6a",
              fontWeight: selected?.name === char.name ? 700 : 400,
              transition: "all 0.2s", fontSize: "0.88rem"
            }}
          >
            {char.emoji} {char.name}
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ animation: "fadeIn 0.35s ease" }}>
          {/* Character Header */}
          <div style={{
            background: `${selected.color}18`, border: `2px solid ${selected.color}40`,
            borderRadius: 20, padding: "24px 28px", marginBottom: 28,
            borderLeft: `6px solid ${selected.color}`, display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap"
          }}>
            <div style={{ fontSize: "3.5rem", lineHeight: 1 }}>{selected.emoji}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: selected.color, fontSize: "1.5rem", fontWeight: 700, margin: "0 0 4px" }}>{selected.name}</h3>
              <div style={{ color: "#9a8a6a", fontSize: "0.85rem", marginBottom: 6 }}>{selected.role} · {selected.period}</div>
              <p style={{ color: "#c8b890", margin: 0, lineHeight: 1.7, fontSize: "0.95rem" }}>{selected.description}</p>
            </div>
            <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.05)", borderRadius: 12, borderLeft: `3px solid ${selected.color}`, minWidth: 160 }}>
              <div style={{ fontSize: "0.7rem", color: "#7a6a50", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Key Verse</div>
              <div style={{ fontSize: "0.78rem", color: selected.color, fontWeight: 700, marginBottom: 4 }}>{selected.keyVerse.book} {selected.keyVerse.chapter}:{selected.keyVerse.verse}</div>
              <div style={{ fontSize: "0.78rem", color: "#b0a080", fontStyle: "italic", lineHeight: 1.5 }}>"{selected.keyVerse.text}"</div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ position: "relative", marginLeft: 20 }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: 16, top: 0, bottom: 0,
              width: 3, background: `linear-gradient(to bottom, ${selected.color}, ${selected.color}22)`,
              borderRadius: 3, zIndex: 0
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {selected.appearances.map((event, i) => {
                const typeInfo = EVENT_TYPES[event.type] || { color: "#9a8a6a", label: event.type };
                const isHovered = hoveredEvent === i;
                return (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "flex-start", gap: 20, position: "relative", paddingBottom: 20 }}
                    onMouseEnter={() => setHoveredEvent(i)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {/* Timeline node */}
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      background: isHovered ? typeInfo.color : `${typeInfo.color}33`,
                      border: `3px solid ${typeInfo.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", zIndex: 1, transition: "all 0.2s",
                      boxShadow: isHovered ? `0 0 14px ${typeInfo.color}60` : "none",
                      marginLeft: -2
                    }}>
                      {i + 1}
                    </div>

                    {/* Event card */}
                    <div style={{
                      flex: 1, background: isHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isHovered ? typeInfo.color + "50" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 14, padding: "16px 20px", transition: "all 0.22s",
                      transform: isHovered ? "translateX(4px)" : "translateX(0)",
                      cursor: "pointer"
                    }}
                    onClick={() => onSearchVerse && onSearchVerse(event.book)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                        <span style={{
                          background: typeInfo.color + "22", color: typeInfo.color,
                          border: `1px solid ${typeInfo.color}40`, borderRadius: 20,
                          padding: "2px 10px", fontSize: "0.72rem", fontWeight: 700
                        }}>{typeInfo.label}</span>
                        <span style={{ color: selected.color, fontSize: "0.78rem", fontFamily: "monospace", fontWeight: 700 }}>
                          {event.book} {event.chapter}:{event.verse}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#c8b890", fontSize: "0.92rem", lineHeight: 1.6 }}>{event.event}</p>
                      {isHovered && (
                        <div style={{ marginTop: 8, fontSize: "0.76rem", color: "#7a6a50", fontStyle: "italic" }}>Click to search this passage →</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Type Legend */}
          <div style={{ marginTop: 28, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
            <div style={{ fontSize: "0.7rem", color: "#7a6a50", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Event Types</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(EVENT_TYPES).filter(([key]) => selected.appearances.some(a => a.type === key)).map(([key, val]) => (
                <span key={key} style={{ padding: "3px 10px", borderRadius: 12, fontSize: "0.72rem", background: val.color + "18", color: val.color, border: `1px solid ${val.color}30` }}>
                  {val.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
