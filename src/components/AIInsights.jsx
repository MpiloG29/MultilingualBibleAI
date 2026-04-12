import { useState, useRef, useEffect } from "react";
import { CROSS_REFS, getCrossRefs } from "../data/crossReferences";

const EXAMPLE_QUESTIONS = [
  "Where does Jesus talk about forgiveness?",
  "What does the Bible say about anxiety?",
  "Which verses are about the Holy Spirit?",
  "Where is the story of David and Goliath?",
  "What does Proverbs say about wisdom?",
];

function CrossReferenceViewer({ verse, onSearch }) {
  const refs = verse ? getCrossRefs(verse.book, verse.chapter, verse.verse) : null;
  return refs ? (
    <div style={{ background: "rgba(181,200,255,0.08)", border: "1px solid rgba(181,200,255,0.25)", borderRadius: 14, padding: "16px 20px", marginTop: 12, animation: "fadeIn 0.3s ease" }}>
      <div style={{ fontSize: "0.72rem", color: "#2980B9", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12, fontWeight: 700 }}>
        🔗 Cross-References for {verse.book} {verse.chapter}:{verse.verse}
      </div>
      {refs.map((ref, i) => (
        <div key={i} style={{ padding: "10px 14px", marginBottom: 8, background: "rgba(255,255,255,0.84)", borderRadius: 10, borderLeft: "3px solid #2980B9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <button onClick={() => onSearch(ref.book)} style={{ background: "none", border: "none", color: "#2980B9", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", fontFamily: "Georgia, serif", padding: 0 }}>
              {ref.book} {ref.chapter}:{ref.verse} →
            </button>
          </div>
          <p style={{ color: "#3A2818", margin: "0 0 5px", fontSize: "0.88rem", fontStyle: "italic" }}>"{ref.text}"</p>
          <div style={{ color: "#8a7a60", fontSize: "0.76rem" }}>✦ {ref.note}</div>
        </div>
      ))}
    </div>
  ) : null;
}

export default function AIInsights({ translation, language, currentVerse, onSearch }) {
  const [apiKey, setApiKey] = useState(() => {
    try {
      // Prefer env variable (set in .env.local); fall back to user-entered key in localStorage
      return import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem("anthropicApiKey") || "";
    } catch { return ""; }
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState("");

  // Q&A Mode
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Summarizer
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);

  // Cross refs
  const [showCrossRefs, setShowCrossRefs] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("qa");

  const chatEndRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  function saveKey() {
    localStorage.setItem("anthropicApiKey", tempKey);
    setApiKey(tempKey);
    setShowKeyInput(false);
    setTempKey("");
  }

  async function callClaude(systemPrompt, userPrompt) {
    if (!apiKey) throw new Error("NO_KEY");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || "API error");
    }
    const data = await response.json();
    return data.content[0].text;
  }

  async function askQuestion() {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    setChatHistory(prev => [...prev, { role: "user", content: q }]);
    setChatLoading(true);
    try {
      const answer = await callClaude(
        `You are a knowledgeable Bible scholar. Answer questions about the Bible concisely and accurately. Cite specific book, chapter, and verse references. Keep answers under 200 words. Language: ${language?.label || "English"}. Translation preference: ${translation}.`,
        q
      );
      setChatHistory(prev => [...prev, { role: "assistant", content: answer }]);
    } catch (e) {
      if (e.message === "NO_KEY") {
        setChatHistory(prev => [...prev, { role: "error", content: "Please add your Anthropic API key to use AI features." }]);
      } else {
        setChatHistory(prev => [...prev, { role: "error", content: `Error: ${e.message}` }]);
      }
    }
    setChatLoading(false);
  }

  async function summarizeVerse() {
    if (!currentVerse) return;
    setSummarizing(true);
    setSummary(null);
    try {
      const text = await callClaude(
        `You are a Bible scholar providing clear explanations for general audiences. Language: ${language?.label || "English"}.`,
        `Please explain ${currentVerse.book} ${currentVerse.chapter}:${currentVerse.verse} in plain language (under 150 words). Text: "${currentVerse.text}". Cover: (1) what it means, (2) its historical context, (3) how it applies to life today.`
      );
      setSummary(text);
    } catch (e) {
      setSummary(e.message === "NO_KEY" ? "__NO_KEY__" : `Error: ${e.message}`);
    }
    setSummarizing(false);
  }

  const envKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;
  const noKey = !apiKey;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#F5C518,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          🤖 AI-Powered Insights
        </h2>
        <p style={{ color: "#5A4030", fontStyle: "italic" }}>Ask questions, get summaries, and explore cross-references</p>
      </div>

      {/* API Key Banner */}
      <div style={{ padding: "14px 18px", background: noKey ? "rgba(255,149,0,0.12)" : "rgba(168,237,202,0.1)", border: `1px solid ${noKey ? "rgba(255,149,0,0.35)" : "rgba(168,237,202,0.3)"}`, borderRadius: 12, marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: "1.2rem" }}>{noKey ? "🔑" : "✅"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: noKey ? "#FFC785" : "#27AE60", fontWeight: 700, fontSize: "0.88rem" }}>
            {noKey ? "Anthropic API Key Required" : "AI Features Active"}
          </div>
          <div style={{ color: "#8a7a60", fontSize: "0.78rem" }}>
            {noKey ? "Add your key to unlock Q&A Mode and Verse Summarizer. Cross-references work without a key." : `Key set${envKey ? " via .env.local" : ""} • Using claude-haiku-4-5-20251001 • ${language?.label || "English"}`}
          </div>
        </div>
        {!envKey && (
          <button
            onClick={() => { setShowKeyInput(!showKeyInput); setTempKey(apiKey); }}
            style={{ padding: "7px 16px", background: noKey ? "rgba(255,149,0,0.2)" : "rgba(168,237,202,0.15)", border: `1px solid ${noKey ? "rgba(255,149,0,0.4)" : "rgba(168,237,202,0.3)"}`, borderRadius: 8, color: noKey ? "#FFC785" : "#27AE60", cursor: "pointer", fontSize: "0.8rem" }}
          >{noKey ? "Add Key" : "Change Key"}</button>
        )}
      </div>

      {/* Key Input */}
      {showKeyInput && (
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.84)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 12, marginBottom: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontSize: "0.78rem", color: "#6A5A40", marginBottom: 10 }}>
            Get your API key at console.anthropic.com. Key is stored locally in your browser only.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="password"
              value={tempKey}
              onChange={e => setTempKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,220,100,0.25)", borderRadius: 8, color: "#1A1240", fontSize: "0.88rem", outline: "none", fontFamily: "monospace" }}
            />
            <button onClick={saveKey} style={{ padding: "10px 18px", background: "linear-gradient(135deg,#F5C518,#FFC020)", border: "none", borderRadius: 8, color: "#1a0800", fontWeight: 700, cursor: "pointer" }}>Save</button>
            {apiKey && <button onClick={() => { localStorage.removeItem("anthropicApiKey"); setApiKey(""); setShowKeyInput(false); }} style={{ padding: "10px 14px", background: "rgba(255,70,70,0.1)", border: "1px solid rgba(255,70,70,0.3)", borderRadius: 8, color: "#ff8a8a", cursor: "pointer", fontSize: "0.8rem" }}>Remove</button>}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "qa", label: "💬 Q&A Mode" },
          { key: "summarizer", label: "📋 Verse Summarizer" },
          { key: "crossrefs", label: "🔗 Cross-References" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "9px 20px", borderRadius: 20, cursor: "pointer", fontFamily: "Georgia, serif",
            background: activeTab === tab.key ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.84)",
            border: `2px solid ${activeTab === tab.key ? "#F5C518" : "rgba(255,255,255,0.1)"}`,
            color: activeTab === tab.key ? "#F5C518" : "#6A5A40", fontWeight: activeTab === tab.key ? 700 : 400, fontSize: "0.88rem"
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Q&A Mode */}
      {activeTab === "qa" && (
        <div>
          <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: "0.75rem", color: "#7a6a50", alignSelf: "center" }}>Try:</span>
            {EXAMPLE_QUESTIONS.map(q => (
              <button key={q} onClick={() => setQuestion(q)} style={{ padding: "5px 12px", borderRadius: 16, fontSize: "0.76rem", background: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.1)", color: "#6A5A40", cursor: "pointer", fontFamily: "Georgia, serif" }}>{q}</button>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "16px", marginBottom: 14, maxHeight: 380, overflowY: "auto" }}>
            {chatHistory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 20px", opacity: 0.5 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>💬</div>
                <p style={{ color: "#8a7a60", fontStyle: "italic", fontSize: "0.9rem" }}>Ask any question about the Bible and get an informed, referenced answer.</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} style={{
                  padding: "10px 14px", marginBottom: 10, borderRadius: 10,
                  background: msg.role === "user" ? "rgba(255,220,100,0.12)" : msg.role === "error" ? "rgba(255,70,70,0.1)" : "rgba(255,255,255,0.80)",
                  borderLeft: `3px solid ${msg.role === "user" ? "#F5C518" : msg.role === "error" ? "#ff8a8a" : "#27AE60"}`,
                  fontSize: "0.9rem", color: msg.role === "error" ? "#ff8a8a" : "#3A2818", lineHeight: 1.7
                }}>
                  <div style={{ fontSize: "0.7rem", color: msg.role === "user" ? "#F5C518" : "#27AE60", marginBottom: 4, fontWeight: 700 }}>
                    {msg.role === "user" ? "You" : msg.role === "error" ? "⚠️ Error" : "🤖 AI Scholar"}
                  </div>
                  {msg.content}
                </div>
              ))
            )}
            {chatLoading && (
              <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.84)", borderRadius: 10, borderLeft: "3px solid #27AE60", color: "#8a7a60", fontSize: "0.88rem", fontStyle: "italic" }}>
                Searching the Scriptures...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askQuestion()}
              placeholder="Ask a Bible question..."
              disabled={chatLoading}
              style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(255,220,100,0.25)", borderRadius: 10, color: "#1A1240", fontSize: "0.93rem", outline: "none", fontFamily: "Georgia, serif" }}
            />
            <button onClick={askQuestion} disabled={chatLoading || !question.trim()} style={{ padding: "12px 22px", background: chatLoading ? "rgba(255,220,100,0.1)" : "linear-gradient(135deg,#F5C518,#FFC020)", border: "none", borderRadius: 10, color: "#1a0800", fontWeight: 700, cursor: chatLoading ? "not-allowed" : "pointer", fontFamily: "Georgia, serif" }}>
              {chatLoading ? "..." : "Ask"}
            </button>
          </div>
          {chatHistory.length > 0 && (
            <button onClick={() => setChatHistory([])} style={{ marginTop: 8, background: "none", border: "none", color: "#6a5a40", cursor: "pointer", fontSize: "0.76rem" }}>Clear conversation</button>
          )}
        </div>
      )}

      {/* Verse Summarizer */}
      {activeTab === "summarizer" && (
        <div>
          {currentVerse ? (
            <div>
              <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.84)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 14, marginBottom: 16 }}>
                <div style={{ fontSize: "0.72rem", color: "#F5C518", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Selected Verse</div>
                <div style={{ color: "#F5C518", fontWeight: 700, marginBottom: 6 }}>{currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}</div>
                <p style={{ color: "#3A2818", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>"{currentVerse.text}"</p>
              </div>
              <button
                onClick={summarizeVerse}
                disabled={summarizing}
                style={{ padding: "11px 26px", background: summarizing ? "rgba(255,220,100,0.1)" : "linear-gradient(135deg,#F5C518,#FFC020)", border: "none", borderRadius: 10, color: "#1a0800", fontWeight: 700, cursor: summarizing ? "not-allowed" : "pointer", fontFamily: "Georgia, serif", marginBottom: 16, fontSize: "0.9rem" }}
              >{summarizing ? "Analyzing..." : "📋 Summarize This Verse"}</button>
              {summary && summary !== "__NO_KEY__" && (
                <div style={{ padding: "18px 22px", background: "rgba(168,237,202,0.08)", border: "1px solid rgba(168,237,202,0.25)", borderRadius: 14, animation: "fadeIn 0.3s ease" }}>
                  <div style={{ fontSize: "0.72rem", color: "#27AE60", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, fontWeight: 700 }}>AI Explanation</div>
                  <p style={{ color: "#3A2818", margin: 0, lineHeight: 1.85, fontSize: "0.93rem" }}>{summary}</p>
                </div>
              )}
              {summary === "__NO_KEY__" && (
                <div style={{ padding: "14px", background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.3)", borderRadius: 10, color: "#FFC785", fontSize: "0.88rem" }}>
                  Please add your Anthropic API key above to use the Verse Summarizer.
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px 20px", opacity: 0.6 }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📋</div>
              <p style={{ color: "#8a7a60", fontStyle: "italic" }}>Search for a verse on the Search tab, then click the AI button on a verse card to summarize it here.</p>
            </div>
          )}
        </div>
      )}

      {/* Cross-References */}
      {activeTab === "crossrefs" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "0.85rem", color: "#6A5A40", marginBottom: 16, lineHeight: 1.7 }}>
              Explore how Scripture references and fulfills itself — Old Testament prophecies pointing to New Testament fulfillment, and parallel passages that echo each other.
            </div>

            {currentVerse && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "0.72rem", color: "#F5C518", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Current Verse</div>
                <div style={{ padding: "12px 16px", background: "rgba(255,220,100,0.1)", border: "1px solid rgba(255,220,100,0.25)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ color: "#F5C518", fontWeight: 700 }}>{currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}</span>
                    <p style={{ color: "#4A3828", margin: "4px 0 0", fontSize: "0.84rem", fontStyle: "italic" }}>"{currentVerse.text?.substring(0, 80)}..."</p>
                  </div>
                  <button onClick={() => setShowCrossRefs(!showCrossRefs)} style={{ padding: "8px 16px", background: "rgba(181,200,255,0.15)", border: "1px solid rgba(181,200,255,0.3)", borderRadius: 8, color: "#2980B9", cursor: "pointer", fontSize: "0.82rem" }}>
                    🔗 Find Cross-References
                  </button>
                </div>
                {showCrossRefs && <CrossReferenceViewer verse={currentVerse} onSearch={onSearch} />}
              </div>
            )}

            <div>
              <div style={{ fontSize: "0.72rem", color: "#6A5A40", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Key Cross-Reference Collections</div>
              {Object.entries(CROSS_REFS).slice(0, 6).map(([key, refs]) => {
                const [book, ch, vs] = key.split("_");
                const bookName = book.charAt(0).toUpperCase() + book.slice(1);
                return (
                  <div key={key} style={{ marginBottom: 12, background: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.88)", borderRadius: 12, padding: "14px 18px" }}>
                    <div style={{ color: "#2980B9", fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 }}>
                      {bookName.replace("1corinthians", "1 Corinthians").replace("isaiah", "Isaiah").replace("micah", "Micah").replace("psalms", "Psalms").replace("genesis", "Genesis").replace("hebrews", "Hebrews").replace("john", "John").replace("jeremiah", "Jeremiah").replace("philippians", "Philippians")} {ch}:{vs}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {refs.map((ref, i) => (
                        <button key={i} onClick={() => onSearch && onSearch(ref.book)} style={{ padding: "4px 12px", borderRadius: 12, fontSize: "0.76rem", background: "rgba(181,200,255,0.1)", border: "1px solid rgba(181,200,255,0.2)", color: "#2980B9", cursor: "pointer" }}>
                          {ref.book} {ref.chapter}:{ref.verse}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
