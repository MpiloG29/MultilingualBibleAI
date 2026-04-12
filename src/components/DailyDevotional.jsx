import { useState } from "react";
import { DEVOTIONALS, getTodaysDevotion } from "../data/devotionals";

export default function DailyDevotional({ language, onSearch }) {
  const today = getTodaysDevotion();
  const [selected, setSelected] = useState(today);
  const [activeSection, setActiveSection] = useState("reflection");
  const [copied, setCopied] = useState(false);

  function shareDevotional() {
    const text = `📖 ${selected.mainVerse.book} ${selected.mainVerse.chapter}:${selected.mainVerse.verse}\n\n"${selected.mainVerse.text}"\n\n💭 ${selected.reflection}\n\n🙏 ${selected.prayer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const isToday = selected.id === today.id;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#FFE066,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          🌅 Daily Multilingual Devotional
        </h2>
        <p style={{ color: "#5A4030", fontStyle: "italic" }}>AI-curated daily readings with verses, reflections, and prayer</p>
        {isToday && (
          <span style={{ display: "inline-block", marginTop: 8, padding: "4px 14px", background: "rgba(255,220,100,0.15)", border: "1px solid rgba(255,220,100,0.3)", borderRadius: 20, fontSize: "0.78rem", color: "#FFE066" }}>
            ✦ Today's Devotional — {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </span>
        )}
      </div>

      {/* Featured Devotional */}
      <div style={{
        background: `${selected.color}18`, border: `2px solid ${selected.color}40`,
        borderRadius: 20, padding: "28px 30px", marginBottom: 24,
        boxShadow: `0 8px 32px ${selected.color}18`
      }}>
        {/* Theme Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ fontSize: "2.8rem" }}>{selected.icon}</span>
          <div>
            <h3 style={{ color: selected.color, margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>{selected.theme}</h3>
            <div style={{ color: "#8a7a60", fontSize: "0.8rem", marginTop: 2 }}>{language?.flag || "🌍"} {language?.label || "English"}</div>
          </div>
          <button
            onClick={shareDevotional}
            style={{ marginLeft: "auto", padding: "8px 16px", background: copied ? "rgba(168,237,202,0.2)" : "rgba(255,255,255,0.88)", border: `1px solid ${copied ? "#A8EDCA" : "rgba(255,255,255,0.15)"}`, borderRadius: 8, color: copied ? "#A8EDCA" : "#4A3828", cursor: "pointer", fontSize: "0.8rem", fontFamily: "Georgia, serif" }}
          >{copied ? "✓ Copied!" : "📤 Share"}</button>
        </div>

        {/* Main Verse */}
        <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.90)", borderRadius: 14, borderLeft: `5px solid ${selected.color}`, marginBottom: 16 }}>
          <div style={{ fontSize: "0.72rem", color: selected.color, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8, fontWeight: 700 }}>
            Main Verse — {selected.mainVerse.book} {selected.mainVerse.chapter}:{selected.mainVerse.verse}
          </div>
          <p style={{ color: "#1A1240", margin: 0, fontSize: "1.08rem", fontStyle: "italic", lineHeight: 1.85 }}>
            "{selected.mainVerse.text}"
          </p>
        </div>

        {/* Support Verse */}
        {selected.supportVerse && (
          <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.82)", borderRadius: 10, borderLeft: `3px solid ${selected.color}60`, marginBottom: 16 }}>
            <div style={{ fontSize: "0.7rem", color: "#8a7a60", marginBottom: 5 }}>{selected.supportVerse.book} {selected.supportVerse.chapter}:{selected.supportVerse.verse}</div>
            <p style={{ color: "#4A3828", margin: 0, fontSize: "0.88rem", fontStyle: "italic", lineHeight: 1.7 }}>"{selected.supportVerse.text}"</p>
          </div>
        )}

        {/* Section Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { key: "reflection", label: "💭 Reflection", color: selected.color },
            { key: "prayer", label: "🙏 Prayer", color: "#A8EDCA" },
            { key: "application", label: "⚡ Application", color: "#FFB3A7" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              style={{
                padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontFamily: "Georgia, serif",
                background: activeSection === tab.key ? `${tab.color}22` : "rgba(255,255,255,0.84)",
                border: `1.5px solid ${activeSection === tab.key ? tab.color : "rgba(255,255,255,0.1)"}`,
                color: activeSection === tab.key ? tab.color : "#8a7a60", fontSize: "0.84rem"
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Active Section Content */}
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.84)", borderRadius: 12, animation: "fadeIn 0.25s ease", minHeight: 80 }}>
          {activeSection === "reflection" && (
            <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.85, fontSize: "0.95rem" }}>{selected.reflection}</p>
          )}
          {activeSection === "prayer" && (
            <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.85, fontSize: "0.95rem", fontStyle: "italic" }}>{selected.prayer}</p>
          )}
          {activeSection === "application" && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "1.5rem" }}>⚡</span>
              <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.85, fontSize: "0.95rem" }}>{selected.application}</p>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => onSearch && onSearch(selected.mainVerse.book)}
          style={{ marginTop: 16, padding: "9px 22px", background: `${selected.color}22`, border: `1px solid ${selected.color}50`, borderRadius: 8, color: selected.color, cursor: "pointer", fontSize: "0.84rem", fontFamily: "Georgia, serif" }}
        >
          🔍 Search more from {selected.mainVerse.book}
        </button>
      </div>

      {/* Devotional Selector */}
      <div>
        <h4 style={{ color: "#7a6a50", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>All Devotionals</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {DEVOTIONALS.map(devo => {
            const isActive = selected.id === devo.id;
            const isTodayDevo = devo.id === today.id;
            return (
              <button
                key={devo.id}
                onClick={() => { setSelected(devo); setActiveSection("reflection"); }}
                style={{
                  padding: "12px 14px", background: isActive ? `${devo.color}18` : "rgba(255,255,255,0.82)",
                  border: `1.5px solid ${isActive ? devo.color + "60" : "rgba(0,0,0,0.07)"}`,
                  borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: "Georgia, serif", transition: "all 0.18s",
                  position: "relative"
                }}
              >
                {isTodayDevo && (
                  <div style={{ position: "absolute", top: -4, right: 8, fontSize: "0.62rem", color: "#FFE066", background: "rgba(255,224,102,0.2)", padding: "1px 6px", borderRadius: 8, border: "1px solid rgba(255,224,102,0.3)" }}>TODAY</div>
                )}
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{devo.icon}</div>
                <div style={{ color: isActive ? devo.color : "#c0aa88", fontWeight: isActive ? 700 : 400, fontSize: "0.84rem", lineHeight: 1.4 }}>{devo.theme}</div>
                <div style={{ color: "#6a5a40", fontSize: "0.74rem", marginTop: 4 }}>{devo.mainVerse.book} {devo.mainVerse.chapter}:{devo.mainVerse.verse}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
