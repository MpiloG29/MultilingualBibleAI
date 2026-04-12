import { useState, useRef, useEffect, useCallback } from "react";

const MUSIC_MODES = [
  { id: "none", label: "No Music", icon: "🔇" },
  { id: "meditation", label: "Meditation", icon: "🧘" },
  { id: "worship", label: "Worship", icon: "🎵" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "ambient", label: "Ambient", icon: "🌌" },
];

// Web Audio API tone generators for ambient sounds
function createAmbientTone(audioCtx, type, freq, gain = 0.03) {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  return { osc, gainNode };
}

function createMeditationMusic(audioCtx) {
  // Gentle drone-like meditation tones (Solfeggio-inspired)
  const nodes = [];
  const freqs = [174, 285, 396, 417, 528, 639, 741, 852, 963];
  freqs.forEach((f, i) => {
    const node = createAmbientTone(audioCtx, "sine", f, 0.012);
    // Slow vibrato
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.08 + i * 0.01;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 1.5;
    lfo.connect(lfoGain);
    lfoGain.connect(node.osc.frequency);
    lfo.start();
    nodes.push(node, { osc: lfo, gainNode: lfoGain });
  });
  return nodes;
}

function createWorshipMusic(audioCtx) {
  // Simple chord: C major (C-E-G) with overtones
  const chord = [261.63, 329.63, 392.0, 523.25, 659.26];
  return chord.map((f, i) => createAmbientTone(audioCtx, "triangle", f, 0.015 - i * 0.002));
}

function createNatureMusic(audioCtx) {
  // Brown noise + soft tones
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 200;
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.08;
  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noise.start();
  // Also add soft tones
  const tones = [130.81, 196.0, 261.63].map(f => createAmbientTone(audioCtx, "sine", f, 0.008));
  return [{ osc: noise, gainNode, isSource: true }, ...tones];
}

function createAmbientMusic(audioCtx) {
  // Space-like pads
  const freqs = [55, 82.41, 110, 164.81, 220];
  return freqs.map((f, i) => {
    const node = createAmbientTone(audioCtx, "sine", f, 0.02);
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.008;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(node.osc.frequency);
    lfo.start();
    return node;
  });
}

export default function AudioPlayer({ verse, language }) {
  const [musicMode, setMusicMode] = useState("none");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [voiceRate, setVoiceRate] = useState(0.85);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const audioCtxRef = useRef(null);
  const audioNodesRef = useRef([]);

  useEffect(() => {
    function loadVoices() {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    }
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, []);

  const stopMusic = useCallback(() => {
    audioNodesRef.current.forEach(({ osc, gainNode, isSource }) => {
      try {
        if (gainNode) {
          gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtxRef.current?.currentTime || 0);
          gainNode.gain.exponentialRampToValueAtTime(0.001, (audioCtxRef.current?.currentTime || 0) + 0.5);
        }
        if (isSource) setTimeout(() => { try { osc.stop(); } catch {} }, 600);
        else setTimeout(() => { try { osc.stop(); } catch {} }, 600);
      } catch {}
    });
    audioNodesRef.current = [];
    setTimeout(() => {
      try { audioCtxRef.current?.close(); } catch {}
      audioCtxRef.current = null;
    }, 700);
  }, []);

  function startMusic(mode) {
    stopMusic();
    if (mode === "none") { setIsPlaying(false); return; }
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      let nodes = [];
      if (mode === "meditation") nodes = createMeditationMusic(ctx);
      else if (mode === "worship") nodes = createWorshipMusic(ctx);
      else if (mode === "nature") nodes = createNatureMusic(ctx);
      else if (mode === "ambient") nodes = createAmbientMusic(ctx);
      audioNodesRef.current = nodes;
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio error:", e);
    }
  }

  function toggleMusic(mode) {
    if (musicMode === mode && isPlaying) {
      stopMusic();
      setMusicMode("none");
      setIsPlaying(false);
    } else {
      setMusicMode(mode);
      startMusic(mode);
    }
  }

  useEffect(() => {
    if (audioCtxRef.current) {
      audioNodesRef.current.forEach(({ gainNode }) => {
        if (gainNode) {
          try { gainNode.gain.setValueAtTime(volume * 0.06, audioCtxRef.current.currentTime); } catch {}
        }
      });
    }
  }, [volume]);

  function speakVerse(text) {
    if (!text || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceRate;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    if (selectedVoice) utterance.voice = availableVoices.find(v => v.name === selectedVoice);
    else {
      const langCode = language?.code || "en";
      const preferred = availableVoices.find(v => v.lang.startsWith(langCode));
      if (preferred) utterance.voice = preferred;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  useEffect(() => {
    return () => {
      stopMusic();
      speechSynthesis.cancel();
    };
  }, [stopMusic]);

  const langVoices = availableVoices.filter(v => v.lang.startsWith(language?.code || "en"));
  const otherVoices = availableVoices.filter(v => !v.lang.startsWith(language?.code || "en")).slice(0, 5);

  return (
    <div style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ fontSize: "0.72rem", color: "#FFE066", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16, fontWeight: 700 }}>
        🎧 Audio & Immersion
      </div>

      {/* Narration */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: "0.78rem", color: "#6A5A40", marginBottom: 10 }}>AI Narration (Text-to-Speech)</div>
        {verse ? (
          <div>
            <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.84)", borderRadius: 8, marginBottom: 10, fontSize: "0.82rem", color: "#4A3828", fontStyle: "italic", lineHeight: 1.6 }}>
              "{verse.text?.substring(0, 120)}{verse.text?.length > 120 ? "..." : ""}"
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakVerse(verse.text)}
                style={{
                  padding: "9px 20px", background: isSpeaking ? "rgba(168,237,202,0.2)" : "rgba(255,255,255,0.88)",
                  border: `1.5px solid ${isSpeaking ? "#A8EDCA" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 10, color: isSpeaking ? "#A8EDCA" : "#c0aa88", cursor: "pointer",
                  fontSize: "0.85rem", fontFamily: "Georgia, serif", transition: "all 0.2s"
                }}
              >{isSpeaking ? "⏸ Stop Reading" : "▶ Read Aloud"}</button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.74rem", color: "#7a6a50" }}>Speed:</span>
                <input type="range" min="0.5" max="1.5" step="0.05" value={voiceRate}
                  onChange={e => setVoiceRate(parseFloat(e.target.value))}
                  style={{ width: 80, accentColor: "#FFE066" }} />
                <span style={{ fontSize: "0.74rem", color: "#6A5A40" }}>{voiceRate.toFixed(2)}x</span>
              </div>
            </div>

            {/* Voice Selector */}
            {(langVoices.length > 0 || otherVoices.length > 0) && (
              <div>
                <div style={{ fontSize: "0.74rem", color: "#7a6a50", marginBottom: 6 }}>Voice ({language?.label || "English"}):</div>
                <select
                  value={selectedVoice || ""}
                  onChange={e => setSelectedVoice(e.target.value || null)}
                  style={{ background: "rgba(254,252,247,0.97)", border: "1px solid rgba(255,220,100,0.3)", borderRadius: 6, color: "#1A1240", padding: "6px 10px", fontSize: "0.8rem", outline: "none", maxWidth: 280 }}
                >
                  <option value="">Auto-select voice</option>
                  {langVoices.length > 0 && (
                    <optgroup label={`${language?.label || "English"} voices`}>
                      {langVoices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                    </optgroup>
                  )}
                  {otherVoices.length > 0 && (
                    <optgroup label="Other voices">
                      {otherVoices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                    </optgroup>
                  )}
                </select>
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: "#6a5a40", fontSize: "0.84rem", fontStyle: "italic" }}>Search for and select a verse on the Search tab to read it aloud.</div>
        )}
      </div>

      {/* Music Modes */}
      <div>
        <div style={{ fontSize: "0.78rem", color: "#6A5A40", marginBottom: 10 }}>🎵 Verse-to-Music Mode (Ambient Background)</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {MUSIC_MODES.map(mode => {
            const active = musicMode === mode.id && isPlaying;
            return (
              <button
                key={mode.id}
                onClick={() => toggleMusic(mode.id)}
                style={{
                  padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "Georgia, serif",
                  background: active ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.84)",
                  border: `1.5px solid ${active ? "#FFE066" : "rgba(255,255,255,0.1)"}`,
                  color: active ? "#FFE066" : "#8a7a60", fontSize: "0.82rem",
                  animation: active ? "pulse 2s ease-in-out infinite" : "none"
                }}
              >
                {mode.icon} {mode.label} {active ? "●" : ""}
              </button>
            );
          })}
        </div>

        {isPlaying && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "0.78rem", color: "#7a6a50" }}>🔊 Volume:</span>
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{ width: 100, accentColor: "#FFE066" }} />
            <span style={{ fontSize: "0.74rem", color: "#6A5A40" }}>{Math.round(volume * 100)}%</span>
          </div>
        )}

        <p style={{ color: "#5a4a30", fontSize: "0.74rem", margin: 0, fontStyle: "italic" }}>
          Generated with Web Audio API — no external files needed. Best experienced with headphones.
        </p>
      </div>
    </div>
  );
}
