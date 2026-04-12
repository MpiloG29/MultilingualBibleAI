import { useState } from "react";
import { TREES } from "../data/genealogy";

const EDGE_COLORS = { parent: "#FFE066", spouse: "#F9C0CB", ancestor: "#B5C8FF" };
const EDGE_DASH = { parent: "none", spouse: "4,3", ancestor: "2,2" };

export default function FamilyTree({ onSearchVerse }) {
  const treeKeys = Object.keys(TREES);
  const [activeTree, setActiveTree] = useState(treeKeys[1]); // patriarchs by default
  const [hoveredNode, setHoveredNode] = useState(null);

  const tree = TREES[activeTree];

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, background: "linear-gradient(90deg,#FFE066,#FFC857)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
          👨‍👩‍👦 Family Tree of Biblical Characters
        </h2>
        <p style={{ color: "#b8a88a", fontStyle: "italic" }}>Genealogical charts tracing the families and lineages of Scripture</p>
      </div>

      {/* Tree Selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center", flexWrap: "wrap" }}>
        {treeKeys.map(key => (
          <button key={key} onClick={() => setActiveTree(key)} style={{
            padding: "10px 20px", borderRadius: 24, cursor: "pointer", fontFamily: "Georgia, serif",
            background: activeTree === key ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.04)",
            border: `2px solid ${activeTree === key ? "#FFE066" : "rgba(255,255,255,0.12)"}`,
            color: activeTree === key ? "#FFE066" : "#9a8a6a", fontWeight: activeTree === key ? 700 : 400, fontSize: "0.88rem"
          }}>
            {TREES[key].name}
          </button>
        ))}
      </div>

      {/* Tree description */}
      <div style={{ textAlign: "center", marginBottom: 24, color: "#9a8a6a", fontSize: "0.88rem", fontStyle: "italic" }}>
        {tree.description}
      </div>

      {/* SVG Tree */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,220,100,0.15)", borderRadius: 16, padding: "20px 10px", overflowX: "auto" }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", minWidth: 500, height: "auto", minHeight: 400 }}>
          {/* Edges */}
          {tree.edges.map((edge, i) => {
            const from = tree.nodes.find(n => n.id === edge.from);
            const to = tree.nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const color = EDGE_COLORS[edge.type] || "#9a8a6a";
            const dash = EDGE_DASH[edge.type] || "none";
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            return (
              <g key={i}>
                {edge.type === "spouse" ? (
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="0.5" strokeDasharray={dash} opacity={0.6} />
                ) : (
                  <path
                    d={`M ${from.x} ${from.y + 3} C ${from.x} ${my + 2}, ${to.x} ${my - 2}, ${to.x} ${to.y - 3}`}
                    stroke={color} strokeWidth="0.4" fill="none" strokeDasharray={dash} opacity={0.5}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {tree.nodes.map(node => {
            const isHovered = hoveredNode === node.id;
            return (
              <g
                key={node.id}
                onClick={() => onSearchVerse && onSearchVerse(node.name.replace(" / Israel", "").replace(" → Joseph", ""))}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Node circle */}
                <circle
                  cx={node.x} cy={node.y} r={isHovered ? 5 : 4}
                  fill={isHovered ? "rgba(255,224,102,0.3)" : "rgba(255,255,255,0.08)"}
                  stroke={isHovered ? "#FFE066" : "rgba(255,220,100,0.4)"}
                  strokeWidth={isHovered ? 1 : 0.6}
                  style={{ transition: "all 0.15s" }}
                />
                {/* Emoji */}
                <text x={node.x} y={node.y + 1.5} textAnchor="middle" fontSize="5" style={{ userSelect: "none" }}>
                  {node.emoji}
                </text>
                {/* Name */}
                <text x={node.x} y={node.y + 7.5} textAnchor="middle" fontSize="2.2" fill={isHovered ? "#FFE066" : "#c0aa88"} fontWeight={isHovered ? "bold" : "normal"}>
                  {node.name}
                </text>
                {/* Reference */}
                <text x={node.x} y={node.y + 10} textAnchor="middle" fontSize="1.6" fill="#7a6a50">
                  {node.ref}
                </text>

                {/* Tooltip on hover */}
                {isHovered && node.note && (
                  <g>
                    <rect
                      x={node.x - 18} y={node.y - 18}
                      width="36" height="10" rx="2"
                      fill="rgba(26,18,64,0.95)" stroke="rgba(255,220,100,0.4)" strokeWidth="0.4"
                    />
                    <text x={node.x} y={node.y - 11} textAnchor="middle" fontSize="1.8" fill="#c0aa88">
                      {node.note.length > 38 ? node.note.substring(0, 38) + "..." : node.note}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
        {Object.entries(EDGE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "#8a7a60" }}>
            <svg width="24" height="8">
              <line x1="0" y1="4" x2="24" y2="4" stroke={color} strokeWidth="1.5" strokeDasharray={EDGE_DASH[type]} />
            </svg>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
        <div style={{ fontSize: "0.78rem", color: "#7a6a50", fontStyle: "italic" }}>Click any node to search Scripture</div>
      </div>

      {/* Node details list */}
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {tree.nodes.map(node => (
          <div
            key={node.id}
            onClick={() => onSearchVerse && onSearchVerse(node.name.replace(" / Israel", "").replace(" → Joseph", ""))}
            style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: "1.4rem" }}>{node.emoji}</span>
              <div>
                <div style={{ color: "#FFE066", fontWeight: 700, fontSize: "0.88rem" }}>{node.name}</div>
                <div style={{ color: "#7a6a50", fontSize: "0.72rem" }}>{node.ref}</div>
              </div>
            </div>
            {node.note && <div style={{ color: "#9a8a6a", fontSize: "0.78rem", lineHeight: 1.5 }}>{node.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
