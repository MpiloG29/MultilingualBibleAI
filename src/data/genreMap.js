// Functional color coding:
//   Law / Commandments  → Royal Blue  #2980B9
//   Narrative / History → Emerald     #27AE60
//   Wisdom / Poetry     → Gold        #F5C518
//   Prophecy            → Purple      #8E44AD
//   Gospel / Sacrifice  → Crimson     #C0392B
//   Epistle / Redemption→ Deep Red    #E53935
//   Apocalyptic         → Dark Purple #6C3483

export const GENRE_MAP = {
  // ── Law / Pentateuch ── Royal Blue
  "Genesis":      { genre: "Law", color: "#2980B9", icon: "📜", bg: "rgba(41,128,185,0.15)" },
  "Exodus":       { genre: "Law", color: "#2980B9", icon: "📜", bg: "rgba(41,128,185,0.15)" },
  "Leviticus":    { genre: "Law", color: "#2980B9", icon: "📜", bg: "rgba(41,128,185,0.15)" },
  "Numbers":      { genre: "Law", color: "#2980B9", icon: "📜", bg: "rgba(41,128,185,0.15)" },
  "Deuteronomy":  { genre: "Law", color: "#2980B9", icon: "📜", bg: "rgba(41,128,185,0.15)" },

  // ── History / Narrative ── Emerald Green
  "Joshua":       { genre: "Narrative", color: "#27AE60", icon: "⚔️", bg: "rgba(39,174,96,0.15)" },
  "Judges":       { genre: "Narrative", color: "#27AE60", icon: "⚔️", bg: "rgba(39,174,96,0.15)" },
  "Ruth":         { genre: "Narrative", color: "#27AE60", icon: "🌾", bg: "rgba(39,174,96,0.15)" },
  "1 Samuel":     { genre: "Narrative", color: "#27AE60", icon: "⚔️", bg: "rgba(39,174,96,0.15)" },
  "2 Samuel":     { genre: "Narrative", color: "#27AE60", icon: "⚔️", bg: "rgba(39,174,96,0.15)" },
  "1 Kings":      { genre: "Narrative", color: "#27AE60", icon: "👑", bg: "rgba(39,174,96,0.15)" },
  "2 Kings":      { genre: "Narrative", color: "#27AE60", icon: "👑", bg: "rgba(39,174,96,0.15)" },
  "1 Chronicles": { genre: "Narrative", color: "#27AE60", icon: "📚", bg: "rgba(39,174,96,0.15)" },
  "2 Chronicles": { genre: "Narrative", color: "#27AE60", icon: "📚", bg: "rgba(39,174,96,0.15)" },
  "Ezra":         { genre: "Narrative", color: "#27AE60", icon: "📚", bg: "rgba(39,174,96,0.15)" },
  "Nehemiah":     { genre: "Narrative", color: "#27AE60", icon: "🏗️", bg: "rgba(39,174,96,0.15)" },
  "Esther":       { genre: "Narrative", color: "#27AE60", icon: "👸", bg: "rgba(39,174,96,0.15)" },

  // ── Wisdom / Poetry ── Gold
  "Job":              { genre: "Wisdom", color: "#F5C518", icon: "💡", bg: "rgba(245,197,24,0.15)" },
  "Psalms":           { genre: "Poetry",  color: "#F5C518", icon: "🎵", bg: "rgba(245,197,24,0.15)" },
  "Psalm":            { genre: "Poetry",  color: "#F5C518", icon: "🎵", bg: "rgba(245,197,24,0.15)" },
  "Proverbs":         { genre: "Wisdom",  color: "#F5C518", icon: "💡", bg: "rgba(245,197,24,0.15)" },
  "Ecclesiastes":     { genre: "Wisdom",  color: "#F5C518", icon: "💡", bg: "rgba(245,197,24,0.15)" },
  "Song of Solomon":  { genre: "Poetry",  color: "#F5C518", icon: "❤️", bg: "rgba(245,197,24,0.15)" },

  // ── Major Prophets ── Deep Purple
  "Isaiah":      { genre: "Prophecy", color: "#8E44AD", icon: "🔮", bg: "rgba(142,68,173,0.15)" },
  "Jeremiah":    { genre: "Prophecy", color: "#8E44AD", icon: "🔮", bg: "rgba(142,68,173,0.15)" },
  "Lamentations":{ genre: "Prophecy", color: "#8E44AD", icon: "😢", bg: "rgba(142,68,173,0.15)" },
  "Ezekiel":     { genre: "Prophecy", color: "#8E44AD", icon: "🔮", bg: "rgba(142,68,173,0.15)" },
  "Daniel":      { genre: "Prophecy", color: "#8E44AD", icon: "🔮", bg: "rgba(142,68,173,0.15)" },

  // ── Minor Prophets ── Soft Purple / Violet
  "Hosea":     { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Joel":      { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Amos":      { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Obadiah":   { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Jonah":     { genre: "Prophecy", color: "#9B59B6", icon: "🐋", bg: "rgba(155,89,182,0.15)" },
  "Micah":     { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Nahum":     { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Habakkuk":  { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Zephaniah": { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Haggai":    { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Zechariah": { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },
  "Malachi":   { genre: "Prophecy", color: "#9B59B6", icon: "📣", bg: "rgba(155,89,182,0.15)" },

  // ── Gospels ── Crimson / Sacrifice
  "Matthew": { genre: "Gospel", color: "#C0392B", icon: "✝️", bg: "rgba(192,57,43,0.15)" },
  "Mark":    { genre: "Gospel", color: "#C0392B", icon: "✝️", bg: "rgba(192,57,43,0.15)" },
  "Luke":    { genre: "Gospel", color: "#C0392B", icon: "✝️", bg: "rgba(192,57,43,0.15)" },
  "John":    { genre: "Gospel", color: "#C0392B", icon: "✝️", bg: "rgba(192,57,43,0.15)" },

  // ── NT History ── Emerald
  "Acts": { genre: "Narrative", color: "#27AE60", icon: "⚡", bg: "rgba(39,174,96,0.15)" },

  // ── Epistles / Redemption ── Deep Red
  "Romans":          { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "1 Corinthians":   { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "2 Corinthians":   { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Galatians":       { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Ephesians":       { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Philippians":     { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Colossians":      { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "1 Thessalonians": { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "2 Thessalonians": { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "1 Timothy":       { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "2 Timothy":       { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Titus":           { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Philemon":        { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Hebrews":         { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "James":           { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "1 Peter":         { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "2 Peter":         { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "1 John":          { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "2 John":          { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "3 John":          { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },
  "Jude":            { genre: "Epistle", color: "#E53935", icon: "📝", bg: "rgba(229,57,53,0.15)" },

  // ── Apocalyptic ── Dark Purple
  "Revelation": { genre: "Apocalyptic", color: "#6C3483", icon: "🔥", bg: "rgba(108,52,131,0.18)" },
};

export function getGenre(bookName) {
  return GENRE_MAP[bookName] || { genre: "Scripture", color: "#A0826D", icon: "📖", bg: "rgba(160,130,109,0.12)" };
}
