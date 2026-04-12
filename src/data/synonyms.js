export const SYNONYMS = {
  love: ["charity", "agape", "affection", "compassion", "grace", "mercy", "kindness", "beloved"],
  faith: ["belief", "trust", "hope", "confidence", "assurance", "conviction"],
  sin: ["iniquity", "transgression", "wickedness", "evil", "ungodliness", "trespass"],
  prayer: ["intercession", "supplication", "petition", "worship", "devotion", "praise"],
  salvation: ["redemption", "deliverance", "atonement", "forgiveness", "justification"],
  wisdom: ["knowledge", "understanding", "discernment", "prudence", "counsel", "insight"],
  peace: ["rest", "shalom", "comfort", "serenity", "tranquility", "stillness"],
  forgiveness: ["mercy", "pardon", "grace", "reconciliation", "absolution"],
  joy: ["gladness", "rejoicing", "delight", "happiness", "blessing", "thanksgiving"],
  strength: ["power", "might", "courage", "boldness", "fortitude", "perseverance"],
  light: ["truth", "revelation", "glory", "illumination", "lamp", "radiance"],
  darkness: ["shadow", "evil", "night", "blindness", "ignorance"],
  life: ["eternity", "resurrection", "spirit", "breath", "living"],
  death: ["grave", "mortality", "perish", "destruction", "end", "departure"],
  hope: ["expectation", "anticipation", "trust", "assurance"],
  heaven: ["paradise", "kingdom", "eternal life", "glory", "celestial"],
  righteousness: ["justice", "holiness", "purity", "uprightness", "goodness", "virtue"],
  shepherd: ["pastor", "guide", "leader", "provider", "protector", "guardian"],
  water: ["river", "spring", "living water", "fountain", "stream", "rain"],
  bread: ["food", "manna", "sustenance", "provision", "nourishment"],
  fear: ["reverence", "awe", "dread", "respect", "trembling"],
  blessing: ["favor", "grace", "gift", "prosperity", "abundance"],
  suffering: ["trials", "tribulation", "affliction", "persecution", "hardship"],
  obedience: ["submission", "compliance", "faithfulness", "devotion", "surrender"],
  covenant: ["promise", "agreement", "testament", "oath", "vow"],
  glory: ["honor", "majesty", "splendor", "praise", "exaltation"],
  humility: ["meekness", "lowliness", "submission", "gentleness", "modesty"],
  justice: ["righteousness", "fairness", "equity", "judgment", "vindication"],
  holy: ["sacred", "divine", "consecrated", "sanctified", "pure"],
  spirit: ["soul", "breath", "wind", "ghost", "inner man"],
  resurrection: ["rising", "new life", "eternal life", "immortality"],
  church: ["assembly", "congregation", "body of Christ", "ekklesia", "fellowship"],
  baptism: ["immersion", "washing", "cleansing", "initiation"],
  prophet: ["seer", "messenger", "spokesman", "proclaimer", "visionary"],
  king: ["ruler", "sovereign", "lord", "monarch", "authority"],
  priest: ["mediator", "intercessor", "minister", "Levite"],
};

export function getSynonyms(term) {
  const lower = term.toLowerCase();
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return { key, synonyms: syns };
    }
    if (syns.some(s => lower === s || lower.includes(s))) {
      return { key, synonyms: [key, ...syns.filter(s => s !== lower)] };
    }
  }
  return null;
}
