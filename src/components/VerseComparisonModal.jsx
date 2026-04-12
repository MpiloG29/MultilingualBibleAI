import { useState } from "react";

// Multi-translation data for key verses
const TRANSLATION_DATA = {
  "john_3_16": {
    KJV: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    NIV: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    ESV: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    NKJV: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
    NLT: "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
    AMP: "For God so greatly loved and dearly prized the world, that He [even] gave His [One and] only begotten Son, so that whoever believes and trusts in Him [as Savior] shall not perish, but have eternal life.",
    MSG: "This is how much God loved the world: He gave his Son, his one and only Son. And this is why: so that no one need be destroyed; by believing in him, anyone can have a whole and lasting life.",
  },
  "philippians_4_13": {
    KJV: "I can do all things through Christ which strengtheneth me.",
    NIV: "I can do all this through him who gives me strength.",
    ESV: "I can do all things through him who strengthens me.",
    NKJV: "I can do all things through Christ who strengthens me.",
    NLT: "For I can do everything through Christ, who gives me strength.",
    AMP: "I can do all things [which He has called me to do] through Him who strengthens and empowers me [to fulfill His purpose—I am self-sufficient in Christ's sufficiency].",
    MSG: "Whatever I have, wherever I am, I can make it through anything in the One who makes me who I am.",
  },
  "psalms_23_1": {
    KJV: "The LORD is my shepherd; I shall not want.",
    NIV: "The LORD is my shepherd, I lack nothing.",
    ESV: "The LORD is my shepherd; I shall not want.",
    NKJV: "The LORD is my shepherd; I shall not want.",
    NLT: "The LORD is my shepherd; I have all that I need.",
    AMP: "The Lord is my Shepherd [to feed, to guide and to shield me], I shall not want.",
    MSG: "GOD, my shepherd! I don't need a thing.",
  },
  "jeremiah_29_11": {
    KJV: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    NIV: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
    ESV: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    NKJV: "For I know the thoughts that I think toward you, says the LORD, thoughts of peace and not of evil, to give you a future and a hope.",
    NLT: "For I know the plans I have for you, says the LORD. They are plans for good and not for disaster, to give you a future and a hope.",
    AMP: "For I know the plans and thoughts that I have for you, says the LORD, plans for peace and well-being and not for disaster, to give you a future and a hope.",
    MSG: "I know what I'm doing. I have it all planned out—plans to take care of you, not abandon you, plans to give you the future you hope for.",
  },
  "isaiah_40_31": {
    KJV: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    NIV: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    ESV: "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    NKJV: "But those who wait on the LORD shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.",
    NLT: "But those who trust in the LORD will find new strength. They will soar high on wings like eagles. They will run and not grow weary. They will walk and not faint.",
    AMP: "But those who wait for the LORD [who expect, look for, and hope in Him] will gain new strength and renew their power; they will lift up their wings [and rise up close to God] like eagles [rising toward the sun].",
    MSG: "But those who wait upon GOD get fresh strength. They spread their wings and soar like eagles, they run and don't get tired, they walk and don't lag behind.",
  },
  "proverbs_3_5": {
    KJV: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
    NIV: "Trust in the LORD with all your heart and lean not on your own understanding.",
    ESV: "Trust in the LORD with all your heart, and do not lean on your own understanding.",
    NKJV: "Trust in the LORD with all your heart, and lean not on your own understanding.",
    NLT: "Trust in the LORD with all your heart; do not depend on your own understanding.",
    AMP: "Trust in and rely confidently on the LORD with all your heart and do not rely on your own insight or understanding.",
    MSG: "Trust GOD from the bottom of your heart; don't try to figure out everything on your own.",
  },
};

const TRANSLATIONS = ["KJV", "NIV", "ESV", "NKJV", "NLT", "AMP", "MSG"];

const KEY_DIFF_NOTES = {
  "john_3_16": [
    { word: "only begotten / one and only / only", note: "The Greek word 'monogenes' means unique, one of a kind. KJV uses 'only begotten' (older theological term); modern translations say 'one and only' or 'only Son'." },
    { word: "believe / believes and trusts", note: "The AMP expands 'believes' to 'believes and trusts' to capture the Greek word's full meaning of active, ongoing trust." },
    { word: "everlasting / eternal / lasting", note: "The Greek 'aiōnios' means both 'eternal' in length and a quality of life from the age to come. MSG renders this as 'whole and lasting life.'" },
  ],
  "philippians_4_13": [
    { word: "I can do all things vs. all this", note: "NIV translates as 'all this' (within the context of contentment), while KJV and NKJV say 'all things' — a distinction Paul's full argument clarifies." },
    { word: "which strengtheneth / who strengthens", note: "All agree that Christ is the source; the syntax differs from KJV's older English to modern translations." },
  ],
  "psalms_23_1": [
    { word: "I shall not want / I lack nothing / I have all that I need", note: "'Want' in KJV means 'lack,' not 'desire.' NIV's 'lack nothing' and NLT's 'have all that I need' make this meaning clear to modern readers." },
  ],
};

export default function VerseComparisonModal({ verse, onClose }) {
  const [selectedTranslations, setSelectedTranslations] = useState(["KJV", "NIV", "ESV"]);
  const [showNotes, setShowNotes] = useState(true);

  if (!verse) return null;

  const key = `${verse.book.toLowerCase().replace(/\s+/g, "")}_${verse.chapter}_${verse.verse}`;
  const data = TRANSLATION_DATA[key];
  const notes = KEY_DIFF_NOTES[key];

  function toggleTranslation(t) {
    setSelectedTranslations(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  }

  const COLORS = { KJV: "#F5C518", NIV: "#27AE60", ESV: "#2980B9", NKJV: "#E8A020", NLT: "#C0392B", AMP: "#8E44AD", MSG: "#9B59B6" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div
        style={{ background: "linear-gradient(135deg,#060B28,#0D1545,#172060)", border: "1px solid rgba(255,220,100,0.3)", borderRadius: 20, padding: "28px 30px", maxWidth: 860, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ color: "#FFE066", margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>🔄 Cross-Translation Comparison</h3>
            <p style={{ color: "#9a8a6a", margin: "4px 0 0", fontSize: "0.88rem" }}>{verse.book} {verse.chapter}:{verse.verse}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", color: "#9a8a6a", cursor: "pointer", fontSize: "1rem" }}>✕</button>
        </div>

        {/* Translation Toggles */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {TRANSLATIONS.map(t => (
            <button key={t} onClick={() => toggleTranslation(t)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: "0.8rem", cursor: "pointer",
              background: selectedTranslations.includes(t) ? `${COLORS[t]}22` : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${selectedTranslations.includes(t) ? COLORS[t] : "rgba(255,255,255,0.1)"}`,
              color: selectedTranslations.includes(t) ? COLORS[t] : "#7a6a50",
              fontWeight: selectedTranslations.includes(t) ? 700 : 400
            }}>{t}</button>
          ))}
        </div>

        {data ? (
          <div>
            {/* Side-by-side or stacked translations */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
              {selectedTranslations.filter(t => data[t]).map(t => (
                <div key={t} style={{ padding: "16px 18px", background: `${COLORS[t]}10`, border: `1.5px solid ${COLORS[t]}40`, borderRadius: 14, borderTop: `4px solid ${COLORS[t]}` }}>
                  <div style={{ color: COLORS[t], fontWeight: 700, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: 10 }}>{t}</div>
                  <p style={{ color: "#ddd0b0", margin: 0, fontSize: "0.92rem", fontStyle: "italic", lineHeight: 1.85 }}>"{data[t]}"</p>
                </div>
              ))}
            </div>

            {/* Translation Notes */}
            {notes && (
              <div>
                <button onClick={() => setShowNotes(!showNotes)} style={{ background: "none", border: "none", color: "#9a8a6a", cursor: "pointer", fontSize: "0.82rem", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  {showNotes ? "▾" : "▸"} Key Translation Differences Explained
                </button>
                {showNotes && (
                  <div style={{ animation: "fadeIn 0.25s ease" }}>
                    {notes.map((note, i) => (
                      <div key={i} style={{ padding: "12px 16px", marginBottom: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10, borderLeft: "3px solid #FFE066" }}>
                        <div style={{ color: "#FFE066", fontWeight: 700, fontSize: "0.82rem", marginBottom: 5 }}>"{note.word}"</div>
                        <p style={{ color: "#9a8a6a", margin: 0, fontSize: "0.82rem", lineHeight: 1.65 }}>{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", opacity: 0.6 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📖</div>
            <p style={{ color: "#8a7a60", fontStyle: "italic" }}>
              Full translation comparison for {verse.book} {verse.chapter}:{verse.verse} is not yet in the local database.<br />
              <span style={{ fontSize: "0.85rem" }}>Try searching John 3:16, Philippians 4:13, Psalm 23:1, Jeremiah 29:11, Isaiah 40:31, or Proverbs 3:5.</span>
            </p>
            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
              <p style={{ color: "#ddd0b0", margin: 0, fontStyle: "italic" }}>"{verse.text}"</p>
              <div style={{ color: "#9a8a6a", fontSize: "0.78rem", marginTop: 6 }}>Current translation selected</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
