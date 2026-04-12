export const CHARACTERS = [
  {
    name: "Moses", emoji: "🪨", period: "1526–1406 BC", role: "Prophet, Lawgiver", color: "#FFE066",
    description: "Leader of the Exodus and receiver of the Ten Commandments",
    appearances: [
      { book: "Exodus", chapter: 2, verse: 10, event: "Birth and adoption by Pharaoh's daughter", type: "birth" },
      { book: "Exodus", chapter: 3, verse: 1, event: "Burning bush — God calls Moses", type: "calling" },
      { book: "Exodus", chapter: 14, verse: 21, event: "Parting of the Red Sea", type: "miracle" },
      { book: "Exodus", chapter: 20, verse: 1, event: "Receives the Ten Commandments on Mount Sinai", type: "covenant" },
      { book: "Numbers", chapter: 20, verse: 11, event: "Strikes the rock at Meribah (disobedience)", type: "failure" },
      { book: "Deuteronomy", chapter: 34, verse: 5, event: "Death of Moses on Mount Nebo", type: "death" },
    ],
    keyVerse: { book: "Hebrews", chapter: 11, verse: 24, text: "By faith Moses refused to be known as the son of Pharaoh's daughter." }
  },
  {
    name: "David", emoji: "👑", period: "1040–970 BC", role: "King, Psalmist", color: "#B5C8FF",
    description: "The shepherd king who defeated Goliath and wrote many Psalms",
    appearances: [
      { book: "1 Samuel", chapter: 16, verse: 13, event: "Anointed as king by Samuel", type: "calling" },
      { book: "1 Samuel", chapter: 17, verse: 49, event: "Defeats Goliath with a sling and stone", type: "victory" },
      { book: "2 Samuel", chapter: 5, verse: 3, event: "Crowned king over all Israel in Hebron", type: "coronation" },
      { book: "2 Samuel", chapter: 11, verse: 4, event: "Sin with Bathsheba", type: "failure" },
      { book: "Psalms", chapter: 51, verse: 1, event: "Psalm of repentance after sin with Bathsheba", type: "repentance" },
      { book: "1 Kings", chapter: 2, verse: 10, event: "Death of David after reigning 40 years", type: "death" },
    ],
    keyVerse: { book: "Acts", chapter: 13, verse: 22, text: "I have found David son of Jesse, a man after my own heart." }
  },
  {
    name: "Abraham", emoji: "⭐", period: "2166–1991 BC", role: "Father of Faith", color: "#FFC785",
    description: "Called by God to leave his homeland and become the father of all believers",
    appearances: [
      { book: "Genesis", chapter: 12, verse: 1, event: "Called by God to leave Ur of the Chaldeans", type: "calling" },
      { book: "Genesis", chapter: 15, verse: 18, event: "God makes covenant with Abram", type: "covenant" },
      { book: "Genesis", chapter: 17, verse: 5, event: "Name changed from Abram to Abraham", type: "transformation" },
      { book: "Genesis", chapter: 21, verse: 3, event: "Birth of Isaac — the son of promise", type: "miracle" },
      { book: "Genesis", chapter: 22, verse: 10, event: "Offers Isaac on Mount Moriah; God provides a ram", type: "test" },
      { book: "Genesis", chapter: 25, verse: 8, event: "Abraham dies at 175 years old, full of years", type: "death" },
    ],
    keyVerse: { book: "Genesis", chapter: 15, verse: 6, text: "Abram believed the LORD, and he credited it to him as righteousness." }
  },
  {
    name: "Jesus", emoji: "✝️", period: "4 BC – 33 AD", role: "Son of God, Savior", color: "#FFE066",
    description: "The central figure of Christianity — God incarnate who died and rose again for the world",
    appearances: [
      { book: "Matthew", chapter: 1, verse: 25, event: "Birth in Bethlehem — 'Immanuel, God with us'", type: "birth" },
      { book: "Luke", chapter: 2, verse: 49, event: "Teaching in the Temple at age 12", type: "teaching" },
      { book: "Matthew", chapter: 3, verse: 17, event: "Baptism by John — 'This is my beloved Son'", type: "calling" },
      { book: "Matthew", chapter: 4, verse: 1, event: "Temptation in the wilderness for 40 days", type: "test" },
      { book: "John", chapter: 2, verse: 9, event: "First miracle — water to wine at Cana", type: "miracle" },
      { book: "Matthew", chapter: 5, verse: 1, event: "Sermon on the Mount — Beatitudes", type: "teaching" },
      { book: "John", chapter: 11, verse: 44, event: "Raises Lazarus from the dead after 4 days", type: "miracle" },
      { book: "Matthew", chapter: 26, verse: 26, event: "The Last Supper — institution of Communion", type: "covenant" },
      { book: "Luke", chapter: 23, verse: 46, event: "Crucifixion and death on the cross", type: "death" },
      { book: "Matthew", chapter: 28, verse: 6, event: "Resurrection on the third day", type: "resurrection" },
      { book: "Acts", chapter: 1, verse: 9, event: "Ascension into heaven in a cloud", type: "ascension" },
    ],
    keyVerse: { book: "John", chapter: 1, verse: 14, text: "The Word became flesh and made his dwelling among us." }
  },
  {
    name: "Paul", emoji: "📜", period: "5–67 AD", role: "Apostle, Missionary", color: "#A8EDCA",
    description: "Former persecutor turned missionary who wrote much of the New Testament",
    appearances: [
      { book: "Acts", chapter: 7, verse: 58, event: "Present at Stephen's stoning (known as Saul)", type: "early" },
      { book: "Acts", chapter: 9, verse: 5, event: "Dramatic conversion on the road to Damascus", type: "calling" },
      { book: "Acts", chapter: 13, verse: 2, event: "First missionary journey commissioned by the Spirit", type: "mission" },
      { book: "Acts", chapter: 16, verse: 25, event: "Imprisoned in Philippi — sings hymns at midnight", type: "trial" },
      { book: "Acts", chapter: 17, verse: 22, event: "Preaches at Mars Hill in Athens to Greek philosophers", type: "teaching" },
      { book: "Acts", chapter: 28, verse: 30, event: "Under house arrest in Rome, still preaching", type: "imprisonment" },
    ],
    keyVerse: { book: "Philippians", chapter: 4, verse: 13, text: "I can do all this through him who gives me strength." }
  },
  {
    name: "Mary", emoji: "🌸", period: "~18 BC – ~54 AD", role: "Mother of Jesus", color: "#F9C0CB",
    description: "The young woman chosen by God to bear the Messiah — a model of faithful obedience",
    appearances: [
      { book: "Luke", chapter: 1, verse: 38, event: "Receives announcement from angel Gabriel", type: "calling" },
      { book: "Luke", chapter: 1, verse: 46, event: "Sings the Magnificat — her song of praise", type: "worship" },
      { book: "Luke", chapter: 2, verse: 7, event: "Gives birth to Jesus in Bethlehem", type: "birth" },
      { book: "John", chapter: 2, verse: 5, event: "Prompts Jesus's first miracle at Cana wedding", type: "miracle" },
      { book: "John", chapter: 19, verse: 26, event: "Stands at the cross during Jesus's crucifixion", type: "suffering" },
      { book: "Acts", chapter: 1, verse: 14, event: "In the upper room with the disciples praying", type: "community" },
    ],
    keyVerse: { book: "Luke", chapter: 1, verse: 38, text: "Behold the handmaid of the Lord; be it unto me according to thy word." }
  },
  {
    name: "Elijah", emoji: "🔥", period: "900–850 BC", role: "Prophet of Fire", color: "#FF9500",
    description: "Fiery prophet who confronted Baal worship and was taken to heaven in a chariot of fire",
    appearances: [
      { book: "1 Kings", chapter: 17, verse: 1, event: "Announces 3-year drought to wicked King Ahab", type: "prophecy" },
      { book: "1 Kings", chapter: 17, verse: 14, event: "Miracle of the widow's endless flour and oil", type: "miracle" },
      { book: "1 Kings", chapter: 18, verse: 38, event: "Calls down fire from heaven on Mount Carmel", type: "miracle" },
      { book: "1 Kings", chapter: 19, verse: 5, event: "Fed by an angel in the wilderness after fleeing Jezebel", type: "provision" },
      { book: "1 Kings", chapter: 19, verse: 12, event: "God speaks in the still small voice at Mount Horeb", type: "revelation" },
      { book: "2 Kings", chapter: 2, verse: 11, event: "Taken to heaven in a whirlwind and chariot of fire", type: "ascension" },
    ],
    keyVerse: { book: "1 Kings", chapter: 18, verse: 21, text: "How long will you waver between two opinions? If the LORD is God, follow him." }
  },
  {
    name: "Solomon", emoji: "💎", period: "990–931 BC", role: "King, Wise Man", color: "#D4B8FF",
    description: "Israel's wisest king who built the Temple and authored Proverbs, Ecclesiastes, and Song of Solomon",
    appearances: [
      { book: "1 Kings", chapter: 1, verse: 39, event: "Anointed as king at Gihon spring by Zadok", type: "coronation" },
      { book: "1 Kings", chapter: 3, verse: 12, event: "God appears in a dream and grants Solomon wisdom", type: "calling" },
      { book: "1 Kings", chapter: 6, verse: 1, event: "Begins building the magnificent Temple in Jerusalem", type: "achievement" },
      { book: "1 Kings", chapter: 10, verse: 1, event: "Queen of Sheba visits, astonished by Solomon's wisdom", type: "fame" },
      { book: "1 Kings", chapter: 11, verse: 3, event: "Turns away from God due to foreign wives and idols", type: "failure" },
      { book: "1 Kings", chapter: 11, verse: 43, event: "Death of Solomon; kingdom divides under Rehoboam", type: "death" },
    ],
    keyVerse: { book: "Proverbs", chapter: 1, verse: 7, text: "The fear of the LORD is the beginning of wisdom." }
  },
  {
    name: "Daniel", emoji: "🦁", period: "620–530 BC", role: "Prophet, Statesman", color: "#80E5D4",
    description: "Faithful prophet in Babylon who interpreted dreams and survived the lion's den",
    appearances: [
      { book: "Daniel", chapter: 1, verse: 8, event: "Refuses the king's food to remain ceremonially pure", type: "faithfulness" },
      { book: "Daniel", chapter: 2, verse: 48, event: "Interprets Nebuchadnezzar's dream; elevated to ruler", type: "miracle" },
      { book: "Daniel", chapter: 3, verse: 25, event: "Three friends (Shadrach, Meshach, Abednego) in the fiery furnace", type: "miracle" },
      { book: "Daniel", chapter: 5, verse: 24, event: "Interprets the writing on the wall for Belshazzar", type: "prophecy" },
      { book: "Daniel", chapter: 6, verse: 22, event: "Survives the lion's den after refusing to stop praying", type: "miracle" },
      { book: "Daniel", chapter: 9, verse: 3, event: "Daniel's great prayer of confession and intercession", type: "prayer" },
    ],
    keyVerse: { book: "Daniel", chapter: 6, verse: 10, text: "He prayed three times a day, just as he had always done." }
  },
  {
    name: "Ruth", emoji: "🌾", period: "~1100 BC", role: "Faithful Foreigner", color: "#A8EDCA",
    description: "Moabite woman whose loyalty to Naomi became a story of faithfulness, love, and redemption",
    appearances: [
      { book: "Ruth", chapter: 1, verse: 16, event: "'Where you go I will go' — Ruth's pledge to Naomi", type: "calling" },
      { book: "Ruth", chapter: 2, verse: 3, event: "Gleans in Boaz's fields; finds favor with him", type: "provision" },
      { book: "Ruth", chapter: 3, verse: 9, event: "Asks Boaz to be her kinsman-redeemer", type: "faith" },
      { book: "Ruth", chapter: 4, verse: 13, event: "Marries Boaz; becomes ancestor of King David and Jesus", type: "redemption" },
    ],
    keyVerse: { book: "Ruth", chapter: 1, verse: 16, text: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God." }
  },
];

export const EVENT_TYPES = {
  birth: { color: "#FFE066", label: "Birth" },
  calling: { color: "#A8EDCA", label: "Calling" },
  miracle: { color: "#B5C8FF", label: "Miracle" },
  covenant: { color: "#FFC785", label: "Covenant" },
  failure: { color: "#FF9500", label: "Failure/Trial" },
  death: { color: "#9a8a6a", label: "Death" },
  coronation: { color: "#FFE066", label: "Coronation" },
  victory: { color: "#80E5D4", label: "Victory" },
  repentance: { color: "#F9C0CB", label: "Repentance" },
  transformation: { color: "#D4B8FF", label: "Transformation" },
  test: { color: "#FFB3A7", label: "Test" },
  prophecy: { color: "#B5C8FF", label: "Prophecy" },
  provision: { color: "#A8EDCA", label: "Provision" },
  revelation: { color: "#FFE066", label: "Revelation" },
  ascension: { color: "#D4B8FF", label: "Ascension" },
  teaching: { color: "#80E5D4", label: "Teaching" },
  worship: { color: "#F9C0CB", label: "Worship" },
  suffering: { color: "#FFB3A7", label: "Suffering" },
  community: { color: "#A8EDCA", label: "Community" },
  imprisonment: { color: "#9a8a6a", label: "Imprisonment" },
  mission: { color: "#B5C8FF", label: "Mission" },
  early: { color: "#c0aa88", label: "Early Life" },
  resurrection: { color: "#FFE066", label: "Resurrection" },
  achievement: { color: "#D4B8FF", label: "Achievement" },
  fame: { color: "#FFC785", label: "Fame" },
  faithfulness: { color: "#A8EDCA", label: "Faithfulness" },
  prayer: { color: "#F9C0CB", label: "Prayer" },
  faith: { color: "#B5C8FF", label: "Faith" },
  redemption: { color: "#A8EDCA", label: "Redemption" },
};
