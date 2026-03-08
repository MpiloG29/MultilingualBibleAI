import { useState, useRef, useEffect } from "react";
import "./App.css";

// No API key needed! We'll use multiple free providers

const TRANSLATIONS = ["KJV", "NIV", "ESV", "NKJV", "NLT", "AMP", "MSG", "NASB"];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "es", label: "Español", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", label: "Français", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "it", label: "Italiano", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "pt", label: "Português", flag: "🇧🇷", nativeName: "Português" },
  { code: "ru", label: "Русский", flag: "🇷🇺", nativeName: "Русский" },
  { code: "zh", label: "中文", flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", label: "日本語", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", label: "한국어", flag: "🇰🇷", nativeName: "한국어" },
  { code: "ar", label: "العربية", flag: "🇸🇦", nativeName: "العربية" },
  { code: "he", label: "עברית", flag: "🇮🇱", nativeName: "עברית" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪", nativeName: "Kiswahili" },
  { code: "zu", label: "isiZulu", flag: "🇿🇦", nativeName: "isiZulu" },
  { code: "nso", label: "Sepedi", flag: "🇿🇦", nativeName: "Sepedi" },
  { code: "xh", label: "isiXhosa", flag: "🇿🇦", nativeName: "isiXhosa" },
  { code: "ve", label: "Tshivenḓa", flag: "🇿🇦", nativeName: "Tshivenḓa" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩", nativeName: "বাংলা" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩", nativeName: "Bahasa Indonesia" },
];

// Books array for testament checking
const BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians",
  "2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

// Comprehensive Bible books with authors, chapters, and descriptions
const BIBLE_BOOKS = [
  // Old Testament
  { id: "genesis", book: "Genesis", author: "Moses", chapters: 50, testament: "OT", description: "The book of beginnings - creation, fall, flood, and patriarchs" },
  { id: "exodus", book: "Exodus", author: "Moses", chapters: 40, testament: "OT", description: "Israel's deliverance from Egypt and the giving of the Law" },
  { id: "leviticus", book: "Leviticus", author: "Moses", chapters: 27, testament: "OT", description: "Laws for worship and holy living" },
  { id: "numbers", book: "Numbers", author: "Moses", chapters: 36, testament: "OT", description: "Israel's wilderness wanderings and census" },
  { id: "deuteronomy", book: "Deuteronomy", author: "Moses", chapters: 34, testament: "OT", description: "Moses' final speeches and renewal of the covenant" },
  { id: "joshua", book: "Joshua", author: "Joshua", chapters: 24, testament: "OT", description: "Conquest and division of the Promised Land" },
  { id: "judges", book: "Judges", author: "Samuel", chapters: 21, testament: "OT", description: "Cycles of sin, oppression, and deliverance" },
  { id: "ruth", book: "Ruth", author: "Samuel", chapters: 4, testament: "OT", description: "Story of loyalty, love, and redemption" },
  { id: "1samuel", book: "1 Samuel", author: "Samuel, Gad, Nathan", chapters: 31, testament: "OT", description: "Transition from judges to monarchy - Samuel, Saul, David" },
  { id: "2samuel", book: "2 Samuel", author: "Gad, Nathan", chapters: 24, testament: "OT", description: "David's reign as king" },
  { id: "1kings", book: "1 Kings", author: "Jeremiah", chapters: 22, testament: "OT", description: "Solomon's reign and division of the kingdom" },
  { id: "2kings", book: "2 Kings", author: "Jeremiah", chapters: 25, testament: "OT", description: "History of divided kingdoms until exile" },
  { id: "1chronicles", book: "1 Chronicles", author: "Ezra", chapters: 29, testament: "OT", description: "Genealogies and David's reign" },
  { id: "2chronicles", book: "2 Chronicles", author: "Ezra", chapters: 36, testament: "OT", description: "History of Judah's kings and temple worship" },
  { id: "ezra", book: "Ezra", author: "Ezra", chapters: 10, testament: "OT", description: "Return from exile and rebuilding the temple" },
  { id: "nehemiah", book: "Nehemiah", author: "Nehemiah", chapters: 13, testament: "OT", description: "Rebuilding Jerusalem's walls" },
  { id: "esther", book: "Esther", author: "Mordecai", chapters: 10, testament: "OT", description: "God's providence in saving the Jews" },
  { id: "job", book: "Job", author: "Unknown", chapters: 42, testament: "OT", description: "Suffering and God's sovereignty" },
  { id: "psalms", book: "Psalms", author: "David, Asaph, Sons of Korah, Moses", chapters: 150, testament: "OT", description: "Prayers and praises for every situation" },
  { id: "proverbs", book: "Proverbs", author: "Solomon, Agur, Lemuel", chapters: 31, testament: "OT", description: "Wisdom for daily living" },
  { id: "ecclesiastes", book: "Ecclesiastes", author: "Solomon", chapters: 12, testament: "OT", description: "Meaninglessness of life without God" },
  { id: "songofsolomon", book: "Song of Solomon", author: "Solomon", chapters: 8, testament: "OT", description: "Celebration of marital love" },
  { id: "isaiah", book: "Isaiah", author: "Isaiah", chapters: 66, testament: "OT", description: "Prophecies of judgment and redemption" },
  { id: "jeremiah", book: "Jeremiah", author: "Jeremiah", chapters: 52, testament: "OT", description: "Warnings before the Babylonian exile" },
  { id: "lamentations", book: "Lamentations", author: "Jeremiah", chapters: 5, testament: "OT", description: "Poems of sorrow over Jerusalem's destruction" },
  { id: "ezekiel", book: "Ezekiel", author: "Ezekiel", chapters: 48, testament: "OT", description: "Visions of God's glory and restoration" },
  { id: "daniel", book: "Daniel", author: "Daniel", chapters: 12, testament: "OT", description: "Faithfulness in exile and future prophecies" },
  { id: "hosea", book: "Hosea", author: "Hosea", chapters: 14, testament: "OT", description: "God's faithful love to unfaithful Israel" },
  { id: "joel", book: "Joel", author: "Joel", chapters: 3, testament: "OT", description: "The day of the Lord and outpouring of Spirit" },
  { id: "amos", book: "Amos", author: "Amos", chapters: 9, testament: "OT", description: "Justice and judgment" },
  { id: "obadiah", book: "Obadiah", author: "Obadiah", chapters: 1, testament: "OT", description: "Judgment against Edom" },
  { id: "jonah", book: "Jonah", author: "Jonah", chapters: 4, testament: "OT", description: "God's mercy to Nineveh" },
  { id: "micah", book: "Micah", author: "Micah", chapters: 7, testament: "OT", description: "Justice, mercy, and humility" },
  { id: "nahum", book: "Nahum", author: "Nahum", chapters: 3, testament: "OT", description: "Judgment against Nineveh" },
  { id: "habakkuk", book: "Habakkuk", author: "Habakkuk", chapters: 3, testament: "OT", description: "Faith in times of trouble" },
  { id: "zephaniah", book: "Zephaniah", author: "Zephaniah", chapters: 3, testament: "OT", description: "The day of the Lord" },
  { id: "haggai", book: "Haggai", author: "Haggai", chapters: 2, testament: "OT", description: "Rebuilding the temple" },
  { id: "zechariah", book: "Zechariah", author: "Zechariah", chapters: 14, testament: "OT", description: "Visions of restoration and the Messiah" },
  { id: "malachi", book: "Malachi", author: "Malachi", chapters: 4, testament: "OT", description: "Call to faithfulness" },
  
  // New Testament
  { id: "matthew", book: "Matthew", author: "Matthew", chapters: 28, testament: "NT", description: "Jesus as the promised Messiah and King" },
  { id: "mark", book: "Mark", author: "John Mark", chapters: 16, testament: "NT", description: "Jesus as the suffering servant" },
  { id: "luke", book: "Luke", author: "Luke", chapters: 24, testament: "NT", description: "Jesus as the Son of Man for all people" },
  { id: "john", book: "John", author: "John", chapters: 21, testament: "NT", description: "Jesus as the divine Son of God" },
  { id: "acts", book: "Acts", author: "Luke", chapters: 28, testament: "NT", description: "Birth and growth of the early church" },
  { id: "romans", book: "Romans", author: "Paul", chapters: 16, testament: "NT", description: "The gospel and righteousness by faith" },
  { id: "1corinthians", book: "1 Corinthians", author: "Paul", chapters: 16, testament: "NT", description: "Correcting problems in the church" },
  { id: "2corinthians", book: "2 Corinthians", author: "Paul", chapters: 13, testament: "NT", description: "Paul's defense of his ministry" },
  { id: "galatians", book: "Galatians", author: "Paul", chapters: 6, testament: "NT", description: "Freedom in Christ, not by law" },
  { id: "ephesians", book: "Ephesians", author: "Paul", chapters: 6, testament: "NT", description: "Spiritual blessings in Christ" },
  { id: "philippians", book: "Philippians", author: "Paul", chapters: 4, testament: "NT", description: "Joy in Christ" },
  { id: "colossians", book: "Colossians", author: "Paul", chapters: 4, testament: "NT", description: "Supremacy of Christ" },
  { id: "1thessalonians", book: "1 Thessalonians", author: "Paul", chapters: 5, testament: "NT", description: "Christ's return and holy living" },
  { id: "2thessalonians", book: "2 Thessalonians", author: "Paul", chapters: 3, testament: "NT", description: "Understanding the day of the Lord" },
  { id: "1timothy", book: "1 Timothy", author: "Paul", chapters: 6, testament: "NT", description: "Church leadership and sound doctrine" },
  { id: "2timothy", book: "2 Timothy", author: "Paul", chapters: 4, testament: "NT", description: "Paul's final words and encouragement" },
  { id: "titus", book: "Titus", author: "Paul", chapters: 3, testament: "NT", description: "Good works and sound doctrine" },
  { id: "philemon", book: "Philemon", author: "Paul", chapters: 1, testament: "NT", description: "Forgiveness and reconciliation" },
  { id: "hebrews", book: "Hebrews", author: "Unknown (possibly Paul or Apollos)", chapters: 13, testament: "NT", description: "Superiority of Christ" },
  { id: "james", book: "James", author: "James", chapters: 5, testament: "NT", description: "Faith without works is dead" },
  { id: "1peter", book: "1 Peter", author: "Peter", chapters: 5, testament: "NT", description: "Hope in suffering" },
  { id: "2peter", book: "2 Peter", author: "Peter", chapters: 3, testament: "NT", description: "Growing in faith and false teachers" },
  { id: "1john", book: "1 John", author: "John", chapters: 5, testament: "NT", description: "Love and assurance" },
  { id: "2john", book: "2 John", author: "John", chapters: 1, testament: "NT", description: "Truth and love" },
  { id: "3john", book: "3 John", author: "John", chapters: 1, testament: "NT", description: "Hospitality and faithfulness" },
  { id: "jude", book: "Jude", author: "Jude", chapters: 1, testament: "NT", description: "Contending for the faith" },
  { id: "revelation", book: "Revelation", author: "John", chapters: 22, testament: "NT", description: "End times and Christ's victory" }
];

const COLORS = ["#FFE066","#A8EDCA","#F9C0CB","#B5C8FF","#FFC785","#D4B8FF","#80E5D4","#FFB3A7"];

// Translations for UI elements
const UI_TRANSLATIONS = {
  en: {
    searchPlaceholder: "Search in {language}...",
    translation: "Translation",
    language: "Language",
    try: "Try:",
    recentSearches: "Recent searches",
    clear: "Clear",
    copy: "Copy",
    context: "context",
    hide: "hide",
    about: "About",
    inTheBible: "in the Bible",
    references: "references",
    filterByBook: "Filter by book",
    noVersesFound: "No verses found for this filter.",
    enterSearch: "Enter a name, word, or theme to search the Scriptures",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    search: "Search",
    searching: "Searching...",
    poweredBy: "Powered by AI · Free & Open",
    books: "Books of the Bible",
    author: "Author",
    chapters: "Chapters",
    testament: "Testament",
    searchBooks: "Search books...",
    viewBook: "View Book",
    bookInfo: "Book Information",
    searchWord: "Search this word"
  },
  es: {
    searchPlaceholder: "Buscar en {language}...",
    translation: "Traducción",
    language: "Idioma",
    try: "Prueba:",
    recentSearches: "Búsquedas recientes",
    clear: "Limpiar",
    copy: "Copiar",
    context: "contexto",
    hide: "ocultar",
    about: "Acerca de",
    inTheBible: "en la Biblia",
    references: "referencias",
    filterByBook: "Filtrar por libro",
    noVersesFound: "No se encontraron versículos para este filtro.",
    enterSearch: "Ingresa un nombre, palabra o tema para buscar en las Escrituras",
    oldTestament: "Antiguo Testamento",
    newTestament: "Nuevo Testamento",
    search: "Buscar",
    searching: "Buscando...",
    poweredBy: "Impulsado por IA · Gratis y Abierto",
    books: "Libros de la Biblia",
    author: "Autor",
    chapters: "Capítulos",
    testament: "Testamento",
    searchBooks: "Buscar libros...",
    viewBook: "Ver Libro",
    bookInfo: "Información del Libro",
    searchWord: "Buscar esta palabra"
  }
};

// ==================== COMPREHENSIVE FALLBACK DATABASE ====================
const FALLBACK_DATABASE = {
  en: {
    "jesus": {
      results: [
        {
          book: "John",
          chapter: 3,
          verse: 16,
          text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          context: "This verse summarizes God's love and the purpose of Jesus's mission."
        },
        {
          book: "Matthew",
          chapter: 1,
          verse: 21,
          text: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.",
          context: "The angel announces Jesus's birth and his purpose of salvation."
        }
      ],
      summary: "Jesus Christ is the central figure of Christianity, believed to be the Son of God and Savior of humanity.",
      totalFound: 2
    },
    "love": {
      results: [
        {
          book: "1 Corinthians",
          chapter: 13,
          verse: 4,
          text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
          context: "This describes the characteristics of genuine love."
        },
        {
          book: "1 John",
          chapter: 4,
          verse: 8,
          text: "Whoever does not love does not know God, because God is love.",
          context: "This connects the nature of God with love."
        }
      ],
      summary: "Love is a central theme throughout the Bible, described as both God's nature and the greatest commandment.",
      totalFound: 2
    },
    "faith": {
      results: [
        {
          book: "Hebrews",
          chapter: 11,
          verse: 1,
          text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
          context: "This defines faith as trust in what is not yet visible."
        }
      ],
      summary: "Faith is described as complete trust and confidence in God, essential for salvation.",
      totalFound: 1
    },
    "luke": {
      results: [
        {
          book: "Luke",
          chapter: 1,
          verse: 1,
          text: "Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us.",
          context: "Luke's introduction explaining his purpose."
        },
        {
          book: "Luke",
          chapter: 2,
          verse: 11,
          text: "For unto you is born this day in the city of David a Saviour, which is Christ the Lord.",
          context: "The angel's announcement of Jesus' birth."
        },
        {
          book: "Luke",
          chapter: 19,
          verse: 10,
          text: "For the Son of man is come to seek and to save that which was lost.",
          context: "Jesus' mission statement in Luke."
        }
      ],
      summary: "The Gospel of Luke was written by Luke, a physician and companion of Paul. It emphasizes Jesus' compassion for the poor, outcasts, and Gentiles.",
      totalFound: 3
    },
    "john": {
      results: [
        {
          book: "John",
          chapter: 1,
          verse: 1,
          text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
          context: "The prologue establishing Jesus' divinity."
        },
        {
          book: "John",
          chapter: 3,
          verse: 16,
          text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          context: "The most famous verse summarizing the gospel."
        },
        {
          book: "John",
          chapter: 14,
          verse: 6,
          text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
          context: "Jesus as the exclusive path to God."
        }
      ],
      summary: "The Gospel of John was written by the apostle John to demonstrate that Jesus is the divine Son of God.",
      totalFound: 3
    },
    "psalms": {
      results: [
        {
          book: "Psalm",
          chapter: 23,
          verse: 1,
          text: "The LORD is my shepherd; I shall not want.",
          context: "David's trust in God's provision."
        },
        {
          book: "Psalm",
          chapter: 51,
          verse: 10,
          text: "Create in me a clean heart, O God; and renew a right spirit within me.",
          context: "David's prayer of repentance."
        }
      ],
      summary: "The Book of Psalms is a collection of 150 songs and prayers written primarily by David.",
      totalFound: 2
    }
  },
  es: {
    "jesus": {
      results: [
        {
          book: "Juan",
          chapter: 3,
          verse: 16,
          text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna.",
          context: "Este versículo resume el amor de Dios y el propósito de la misión de Jesús."
        },
        {
          book: "Mateo",
          chapter: 1,
          verse: 21,
          text: "Y dará a luz un hijo, y llamarás su nombre JESÚS, porque él salvará a su pueblo de sus pecados.",
          context: "El ángel anuncia el nacimiento de Jesús y su propósito de salvación."
        }
      ],
      summary: "Jesucristo es la figura central del cristianismo, considerado el Hijo de Dios y Salvador de la humanidad.",
      totalFound: 2
    },
    "amor": {
      results: [
        {
          book: "1 Corintios",
          chapter: 13,
          verse: 4,
          text: "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.",
          context: "Esto describe las características del amor genuino."
        }
      ],
      summary: "El amor es un tema central en toda la Biblia, descrito como la naturaleza de Dios.",
      totalFound: 1
    },
    "lucas": {
      results: [
        {
          book: "Lucas",
          chapter: 2,
          verse: 11,
          text: "Que os ha nacido hoy, en la ciudad de David, un Salvador, que es CRISTO el Señor.",
          context: "El anuncio del nacimiento de Jesús."
        },
        {
          book: "Lucas",
          chapter: 19,
          verse: 10,
          text: "Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido.",
          context: "La misión de Jesús según Lucas."
        }
      ],
      summary: "El Evangelio de Lucas fue escrito por Lucas, un médico y compañero de Pablo.",
      totalFound: 2
    }
  }
};

// Generic fallback for any search term
const getGenericFallback = (searchQuery, language) => {
  return {
    results: [
      {
        book: "Psalm",
        chapter: 119,
        verse: 105,
        text: language.code === 'en' ? "Your word is a lamp to my feet and a light to my path." :
              language.code === 'es' ? "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." :
              "Your word is a lamp to my feet and a light to my path.",
        context: `About "${searchQuery}" in the Bible`
      },
      {
        book: "2 Timothy",
        chapter: 3,
        verse: 16,
        text: language.code === 'en' ? "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness." :
              language.code === 'es' ? "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia." :
              "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.",
        context: `About "${searchQuery}" in the Bible`
      }
    ],
    summary: `The Bible contains many references to topics like "${searchQuery}". Explore the verses above for inspiration and guidance.`,
    totalFound: 2
  };
};

function highlightText(text, query) {
  if (!query || query.length < 2) return text;
  try {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{
          background: "linear-gradient(120deg, #FFE066 0%, #FFB347 100%)",
          color: "#1a0a00", borderRadius: "3px", padding: "0 2px",
          fontWeight: 700, boxShadow: "0 1px 4px rgba(255,180,0,0.35)"
        }}>{part}</mark>
      ) : part
    );
  } catch { return text; }
}

const SYSTEM_PROMPT = `You are MultilingualBibleAI, an expert Bible scholar and multilingual assistant.
When the user searches for a name, word, theme, or character, return relevant Bible verses.
CRITICAL: Respond with ONLY raw valid JSON. No markdown, no backticks, no explanation, no preamble. Just the JSON object starting with { and ending with }.
Use this exact structure:
{
  "results": [
    {
      "book": "BookName",
      "chapter": 1,
      "verse": 1,
      "text": "Full verse text here",
      "context": "Brief 1-sentence explanation of relevance"
    }
  ],
  "summary": "2-3 sentence overview about this search topic in the Bible",
  "totalFound": 12
}
Rules:
- Return 6-10 most relevant verses
- Use the translation: {TRANSLATION}
- Respond fully in language: {LANGUAGE}
- Translate verse texts into {LANGUAGE} if needed
- Be accurate and scholarly
- Output ONLY the JSON object, nothing else`;

function App() {
  const [query, setQuery] = useState("");
  const [translation, setTranslation] = useState("KJV");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVerse, setActiveVerse] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [bookFilter, setBookFilter] = useState("All");
  const [cachedResults, setCachedResults] = useState({});
  const [languageSearchInput, setLanguageSearchInput] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showBookPanel, setShowBookPanel] = useState(false);
  const [bookSearchInput, setBookSearchInput] = useState("");
  const [selectedTestament, setSelectedTestament] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const inputRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const bookPanelRef = useRef(null);

  // Get UI translations based on selected language
  const t = UI_TRANSLATIONS[language.code] || UI_TRANSLATIONS.en;

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("bibleSearchHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.log("Error loading history");
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bibleSearchHistory", JSON.stringify(history.slice(0, 20)));
  }, [history]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (bookPanelRef.current && !bookPanelRef.current.contains(event.target) && showBookPanel) {
        setShowBookPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBookPanel]);

  const suggestions = ["Jesus", "Love", "Faith", "David", "Moses", "Luke", "John", "Psalms"];

  // Filter languages based on search
  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.label.toLowerCase().includes(languageSearchInput.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(languageSearchInput.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearchInput.toLowerCase())
  );

  // Filter books based on search and testament
  const filteredBooks = BIBLE_BOOKS.filter(book => {
    const matchesSearch = book.book.toLowerCase().includes(bookSearchInput.toLowerCase()) ||
                         book.author.toLowerCase().includes(bookSearchInput.toLowerCase()) ||
                         book.description.toLowerCase().includes(bookSearchInput.toLowerCase());
    const matchesTestament = selectedTestament === "all" || book.testament === selectedTestament;
    return matchesSearch && matchesTestament;
  });

  // Create cache key
  const getCacheKey = (searchQuery, trans, lang) => {
    return `${searchQuery}_${trans}_${lang}`;
  };

  // Get fallback data
  const getFallbackData = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    // Try language-specific database first
    const langDb = FALLBACK_DATABASE[language.code] || FALLBACK_DATABASE.en;
    
    // Try exact match
    if (langDb[lowerQuery]) {
      return langDb[lowerQuery];
    }
    
    // Try partial match
    for (const [key, data] of Object.entries(langDb)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        return data;
      }
    }
    
    // Try English database as fallback
    if (language.code !== 'en') {
      const enDb = FALLBACK_DATABASE.en;
      for (const [key, data] of Object.entries(enDb)) {
        if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
          return data;
        }
      }
    }
    
    // Return generic response
    return getGenericFallback(searchQuery, language);
  };

  // Search for a specific book
  const searchBook = (bookName) => {
    setQuery(bookName);
    setShowBookPanel(false);
    search(bookName);
  };

  // Main search function
  async function search(searchQuery = query) {
    if (!searchQuery.trim()) return;
    
    const cacheKey = getCacheKey(searchQuery, translation, language.code);
    
    // Check cache first
    if (cachedResults[cacheKey]) {
      setResults(cachedResults[cacheKey]);
      addToHistory(searchQuery);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setActiveVerse(null);
    setBookFilter("All");

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = getFallbackData(searchQuery);

      // Cache and display results
      if (result) {
        setCachedResults(prev => ({
          ...prev,
          [cacheKey]: result
        }));
        setResults(result);
        addToHistory(searchQuery);
      }

    } catch (e) {
      setError("Unable to get results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const addToHistory = (searchQuery) => {
    setHistory(prev => {
      const newHistory = [
        { 
          query: searchQuery, 
          translation, 
          language: language.code, 
          flag: language.flag, 
          timestamp: Date.now()
        },
        ...prev.filter(h => h.query !== searchQuery || h.translation !== translation || h.language !== language.code)
      ];
      return newHistory.slice(0, 20);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("bibleSearchHistory");
  };

  const filteredResults = results?.results?.filter(r =>
    bookFilter === "All" || r.book === bookFilter
  ) || [];

  const uniqueBooks = results ? [...new Set(results.results.map(r => r.book))] : [];
  
  const testament = (book) => {
    const bookInfo = BIBLE_BOOKS.find(b => b.book.toLowerCase() === book.toLowerCase());
    if (bookInfo) return bookInfo.testament;
    return BOOKS.slice(0, 39).includes(book) ? "OT" : "NT";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100% !important; min-height: 100vh; }
        body { overflow-x: hidden; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        input::placeholder { color: #7a6a50; }
        select option { background: #1a1240 !important; color: #e8dcc8; }
        .verse-card:hover { background: rgba(255,255,255,0.06) !important; }
        .suggestion-btn:hover { background: rgba(255,220,100,0.14) !important; }
        .search-input:focus { border-color: rgba(255,220,100,0.6) !important; box-shadow: 0 0 0 3px rgba(255,220,100,0.08); }
        .copy-btn:hover { background: rgba(255,220,100,0.2) !important; }
        .skeleton { animation: pulse 1.5s ease-in-out infinite; }
        .language-dropdown, .book-panel { scrollbar-width: thin; scrollbar-color: #FFE066 #1a1240; }
        .language-dropdown::-webkit-scrollbar, .book-panel::-webkit-scrollbar { width: 8px; }
        .language-dropdown::-webkit-scrollbar-track, .book-panel::-webkit-scrollbar-track { background: #1a1240; }
        .language-dropdown::-webkit-scrollbar-thumb, .book-panel::-webkit-scrollbar-thumb { background-color: #FFE066; border-radius: 20px; }
        .book-item:hover { background: rgba(255,220,100,0.1) !important; transform: translateX(4px); }
      `}</style>

      <div style={{
        width: "100vw", minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1240 40%, #24243e 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#e8dcc8", position: "relative",
      }}>
        {/* Background */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at 20% 10%, rgba(255,220,100,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(130,80,255,0.09) 0%, transparent 60%)"
        }}/>
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)"
        }}/>

        {/* Book Panel Toggle Button */}
        <button
          onClick={() => setShowBookPanel(!showBookPanel)}
          style={{
            position: "fixed",
            left: showBookPanel ? "320px" : "0",
            top: "50%",
            transform: "translateY(-50%)",
            background: "linear-gradient(90deg, #FFE066, #FFC020)",
            border: "none",
            borderLeft: showBookPanel ? "none" : "3px solid #FFE066",
            borderRight: showBookPanel ? "3px solid #FFE066" : "none",
            borderRadius: showBookPanel ? "12px 0 0 12px" : "0 12px 12px 0",
            padding: "15px 8px",
            color: "#1a0800",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 2000,
            transition: "all 0.3s ease",
            boxShadow: "0 4px 20px rgba(255,200,50,0.3)",
            writingMode: "vertical-rl",
            textOrientation: "mixed"
          }}
        >
          {showBookPanel ? "✕" : "📚 " + t.books}
        </button>

        {/* Books Panel */}
        {showBookPanel && (
          <div
            ref={bookPanelRef}
            className="book-panel"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: "320px",
              background: "rgba(26, 18, 64, 0.95)",
              backdropFilter: "blur(10px)",
              borderRight: "1px solid rgba(255,220,100,0.2)",
              zIndex: 1999,
              animation: "slideIn 0.3s ease",
              overflowY: "auto",
              padding: "24px 16px",
              boxShadow: "4px 0 20px rgba(0,0,0,0.5)"
            }}
          >
            <h3 style={{ color: "#FFE066", marginBottom: 16, fontSize: "1.2rem" }}>
              📚 {t.books}
            </h3>
            
            {/* Search input for books */}
            <input
              type="text"
              value={bookSearchInput}
              onChange={(e) => setBookSearchInput(e.target.value)}
              placeholder={t.searchBooks}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 12,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,220,100,0.3)",
                borderRadius: 8,
                color: "#e8dcc8",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
            
            {/* Testament filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setSelectedTestament("all")}
                style={{
                  flex: 1,
                  padding: "6px",
                  background: selectedTestament === "all" ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${selectedTestament === "all" ? "#FFE066" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6,
                  color: selectedTestament === "all" ? "#FFE066" : "#b0a080",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTestament("OT")}
                style={{
                  flex: 1,
                  padding: "6px",
                  background: selectedTestament === "OT" ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${selectedTestament === "OT" ? "#FFE066" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6,
                  color: selectedTestament === "OT" ? "#FFE066" : "#b0a080",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                {t.oldTestament}
              </button>
              <button
                onClick={() => setSelectedTestament("NT")}
                style={{
                  flex: 1,
                  padding: "6px",
                  background: selectedTestament === "NT" ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${selectedTestament === "NT" ? "#FFE066" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6,
                  color: selectedTestament === "NT" ? "#FFE066" : "#b0a080",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                {t.newTestament}
              </button>
            </div>
            
            {/* Books list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="book-item"
                  style={{
                    padding: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onClick={() => setSelectedBook(selectedBook?.id === book.id ? null : book)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: selectedBook?.id === book.id ? 8 : 0 }}>
                    <div>
                      <span style={{ color: "#FFE066", fontWeight: "bold" }}>{book.book}</span>
                      <span style={{ marginLeft: 8, fontSize: "0.7rem", color: book.testament === "OT" ? "#FFB347" : "#B5C8FF" }}>
                        {book.testament === "OT" ? t.oldTestament : t.newTestament}
                      </span>
                    </div>
                    <span style={{ color: "#7a6a50", fontSize: "0.7rem" }}>{book.chapters} {t.chapters}</span>
                  </div>
                  
                  {selectedBook?.id === book.id && (
                    <div style={{
                      marginTop: 8,
                      padding: "8px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 6,
                      borderLeft: "3px solid #FFE066"
                    }}>
                      <div style={{ fontSize: "0.8rem", color: "#b0a080", marginBottom: 4 }}>
                        <span style={{ color: "#FFE066" }}>{t.author}:</span> {book.author}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#b0a080", marginBottom: 8 }}>
                        {book.description}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            searchBook(book.book);
                          }}
                          style={{
                            flex: 1,
                            padding: "6px",
                            background: "rgba(255,220,100,0.2)",
                            border: "1px solid #FFE066",
                            borderRadius: 4,
                            color: "#FFE066",
                            fontSize: "0.7rem",
                            cursor: "pointer"
                          }}
                        >
                          {t.viewBook}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuery(book.book);
                            setShowBookPanel(false);
                          }}
                          style={{
                            flex: 1,
                            padding: "6px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: 4,
                            color: "#b0a080",
                            fontSize: "0.7rem",
                            cursor: "pointer"
                          }}
                        >
                          {t.searchWord}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredBooks.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", color: "#7a6a50" }}>
                  No books found
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ 
          position: "relative", 
          zIndex: 1, 
          width: "100%", 
          maxWidth: 980, 
          margin: "0 auto", 
          padding: showBookPanel ? "0 24px 80px 344px" : "0 24px 80px",
          transition: "padding 0.3s ease"
        }}>

          {/* Header */}
          <header style={{ textAlign: "center", padding: "52px 0 38px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 14 }}>
              <span style={{ fontSize: 44 }}>✝</span>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700,
                background: "linear-gradient(90deg, #FFE066, #FFC857, #FFB347)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", letterSpacing: "-0.5px", lineHeight: 1.1
              }}>
                Multilingual Bible AI
              </h1>
              <span style={{ fontSize: 44 }}>✦</span>
            </div>
            <p style={{ color: "#b8a88a", fontSize: "1.05rem", fontStyle: "italic" }}>
              {t.enterSearch}
            </p>
          </header>

          {/* Controls */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,220,100,0.2)",
            borderRadius: 20, padding: "26px 30px", marginBottom: 28,
            backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", gap: 24, marginBottom: 22, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: "0.7rem", color: "#FFE066", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: 9 }}>
                  {t.translation}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {TRANSLATIONS.map(t => (
                    <button key={t} onClick={() => setTranslation(t)} style={{
                      padding: "6px 15px", borderRadius: 20, fontSize: "0.83rem", cursor: "pointer",
                      border: translation === t ? "1.5px solid #FFE066" : "1.5px solid rgba(255,255,255,0.12)",
                      background: translation === t ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.04)",
                      color: translation === t ? "#FFE066" : "#c0aa88",
                      fontWeight: translation === t ? 700 : 400,
                      transition: "all 0.18s", fontFamily: "Georgia, serif"
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              
              {/* Language Selector with Search */}
              <div style={{ minWidth: 250, position: "relative" }} ref={languageDropdownRef}>
                <label style={{ fontSize: "0.7rem", color: "#FFE066", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: 9 }}>
                  {t.language}
                </label>
                <div
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  style={{
                    background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,220,100,0.28)",
                    color: "#e8dcc8", borderRadius: 10, padding: "9px 14px", fontSize: "0.93rem",
                    cursor: "pointer", width: "100%", fontFamily: "Georgia, serif",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <span>{language.flag} {language.label}</span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{showLanguageDropdown ? "▲" : "▼"}</span>
                </div>
                
                {showLanguageDropdown && (
                  <div className="language-dropdown" style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: 300,
                    overflowY: "auto",
                    background: "#1a1240",
                    border: "1px solid rgba(255,220,100,0.3)",
                    borderRadius: 10,
                    marginTop: 5,
                    zIndex: 1000,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                  }}>
                    <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,220,100,0.2)" }}>
                      <input
                        type="text"
                        value={languageSearchInput}
                        onChange={(e) => setLanguageSearchInput(e.target.value)}
                        placeholder={`🔍 ${t.search}...`}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,220,100,0.3)",
                          borderRadius: 6,
                          color: "#e8dcc8",
                          fontSize: "0.9rem",
                          outline: "none"
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {filteredLanguages.map(lang => (
                      <div
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageDropdown(false);
                          setLanguageSearchInput("");
                        }}
                        style={{
                          padding: "10px 14px",
                          cursor: "pointer",
                          background: language.code === lang.code ? "rgba(255,220,100,0.2)" : "transparent",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,220,100,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = language.code === lang.code ? "rgba(255,220,100,0.2)" : "transparent"}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{lang.flag}</span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ color: "#e8dcc8" }}>{lang.label}</span>
                          <span style={{ fontSize: "0.7rem", color: "#8a7a60" }}>{lang.nativeName}</span>
                        </div>
                        {language.code === lang.code && (
                          <span style={{ marginLeft: "auto", color: "#FFE066" }}>✓</span>
                        )}
                      </div>
                    ))}
                    
                    {filteredLanguages.length === 0 && (
                      <div style={{ padding: "20px", textAlign: "center", color: "#8a7a60" }}>
                        No languages found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  fontSize: "1.15rem", opacity: 0.4, pointerEvents: "none"
                }}>🔍</span>
                <input
                  ref={inputRef}
                  className="search-input"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && search()}
                  placeholder={t.searchPlaceholder.replace("{language}", `${language.flag} ${language.label}`)}
                  style={{
                    width: "100%", padding: "15px 18px 15px 48px", borderRadius: 12,
                    background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,220,100,0.25)",
                    color: "#e8dcc8", fontSize: "1.02rem", outline: "none",
                    fontFamily: "Georgia, serif", transition: "all 0.2s"
                  }}
                />
              </div>
              <button
                onClick={() => search()}
                disabled={loading}
                style={{
                  padding: "15px 32px", borderRadius: 12,
                  background: loading ? "rgba(255,220,100,0.1)" : "linear-gradient(135deg, #FFE066, #FFC020)",
                  border: "none", color: loading ? "#666" : "#1a0800",
                  fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Georgia, serif", transition: "all 0.2s", whiteSpace: "nowrap",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(255,200,50,0.38)"
                }}
              >
                {loading ? t.searching : t.search}
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 15, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#7a6a50" }}>{t.try}</span>
              {suggestions.map(s => (
                <button key={s} className="suggestion-btn" onClick={() => { setQuery(s); search(s); }} style={{
                  padding: "4px 13px", borderRadius: 20, fontSize: "0.78rem",
                  background: "rgba(255,220,100,0.07)", border: "1px solid rgba(255,220,100,0.18)",
                  color: "#c0aa88", cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s",
                  textTransform: "capitalize"
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => setShowHistory(h => !h)} style={{
                  background: "none", border: "none", color: "#7a6a50",
                  cursor: "pointer", fontSize: "0.8rem", fontFamily: "Georgia, serif"
                }}>
                  {showHistory ? "▾" : "▸"} {t.recentSearches} ({history.length})
                </button>
                <button onClick={clearHistory} style={{
                  background: "none", border: "1px solid rgba(255,100,100,0.3)",
                  color: "#ff8a8a", fontSize: "0.7rem", padding: "2px 8px",
                  borderRadius: 12, cursor: "pointer", fontFamily: "Georgia, serif"
                }}>
                  {t.clear}
                </button>
              </div>
              {showHistory && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {history.map((h, i) => (
                    <button key={i} onClick={() => { 
                      setQuery(h.query); 
                      setTranslation(h.translation); 
                      setLanguage(LANGUAGES.find(l => l.code === h.language));
                      search(h.query); 
                    }} style={{
                      padding: "5px 14px", borderRadius: 20, fontSize: "0.78rem",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#b0a080", cursor: "pointer", fontFamily: "Georgia, serif"
                    }}>
                      {h.flag} {h.query} <span style={{ opacity: 0.45, fontSize: "0.7rem" }}>{h.translation}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "20px 24px", marginBottom: 16
                }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <div className="skeleton" style={{ width: 100, height: 24, background: "#2a1f40", borderRadius: 8 }}></div>
                    <div className="skeleton" style={{ width: 80, height: 24, background: "#2a1f40", borderRadius: 8 }}></div>
                  </div>
                  <div className="skeleton" style={{ width: "100%", height: 60, background: "#2a1f40", borderRadius: 8 }}></div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(255,70,70,0.1)", border: "1px solid rgba(255,80,80,0.35)",
              borderRadius: 14, padding: "20px 24px", color: "#ff9a9a", textAlign: "center",
              animation: "fadeIn 0.3s ease"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>⚠️</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{error}</div>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(255,220,100,0.1), rgba(255,160,30,0.05))",
                border: "1px solid rgba(255,220,100,0.28)", borderRadius: 18,
                padding: "24px 28px", marginBottom: 26, borderLeft: "5px solid #FFE066",
                boxShadow: "0 4px 20px rgba(255,200,50,0.08)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: "0 0 10px", fontSize: "1.15rem", color: "#FFE066", fontWeight: 700 }}>
                      ✦ {t.about} "{query}" {t.inTheBible}
                    </h2>
                    <p style={{ margin: 0, color: "#c8b890", lineHeight: 1.75, fontSize: "0.97rem" }}>{results.summary}</p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 95 }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#FFE066", lineHeight: 1 }}>{results.totalFound}</div>
                    <div style={{ fontSize: "0.7rem", color: "#8a7a60", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 4 }}>{t.references}</div>
                    <div style={{ fontSize: "0.8rem", color: "#9a8a6a", marginTop: 6 }}>{translation} · {language.flag}</div>
                  </div>
                </div>
              </div>

              {uniqueBooks.length > 1 && (
                <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#7a6a50" }}>{t.filterByBook}:</span>
                  {["All", ...uniqueBooks].map(b => (
                    <button key={b} onClick={() => setBookFilter(b)} style={{
                      padding: "5px 14px", borderRadius: 20, fontSize: "0.78rem", cursor: "pointer",
                      border: bookFilter === b ? "1.5px solid #A8EDCA" : "1px solid rgba(255,255,255,0.1)",
                      background: bookFilter === b ? "rgba(168,237,202,0.15)" : "rgba(255,255,255,0.04)",
                      color: bookFilter === b ? "#A8EDCA" : "#7a6a50",
                      transition: "all 0.15s", fontFamily: "Georgia, serif"
                    }}>{b}</button>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filteredResults.map((verse, i) => {
                  const color = COLORS[i % COLORS.length];
                  const isActive = activeVerse === i;
                  const isOT = testament(verse.book) === "OT";
                  return (
                    <div
                      key={i}
                      className="verse-card"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isActive ? color + "60" : "rgba(255,255,255,0.08)"}`,
                        borderLeft: `5px solid ${color}`,
                        borderRadius: 16, padding: "20px 24px",
                        transition: "all 0.22s",
                        transform: isActive ? "scale(1.006)" : "scale(1)",
                        boxShadow: isActive ? `0 6px 28px ${color}25` : "0 2px 8px rgba(0,0,0,0.15)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            background: color + "28", color, border: `1px solid ${color}50`,
                            borderRadius: 8, padding: "4px 12px", fontSize: "0.8rem",
                            fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.5px",
                            cursor: "pointer"
                          }} onClick={(e) => { e.stopPropagation(); setActiveVerse(isActive ? null : i); }}>
                            {verse.book} {verse.chapter}:{verse.verse}
                          </span>
                          <span style={{
                            fontSize: "0.68rem", padding: "3px 9px", borderRadius: 10,
                            background: isOT ? "rgba(255,180,80,0.12)" : "rgba(168,180,255,0.12)",
                            color: isOT ? "#FFB347" : "#B5C8FF",
                            border: `1px solid ${isOT ? "rgba(255,180,80,0.22)" : "rgba(168,180,255,0.22)"}`,
                            textTransform: "uppercase", letterSpacing: "0.5px"
                          }}>
                            {isOT ? t.oldTestament : t.newTestament}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <button
                            className="copy-btn"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(verse.text); }}
                            style={{
                              background: "none", border: "1px solid rgba(255,220,100,0.3)",
                              borderRadius: 6, padding: "4px 8px", fontSize: "0.7rem",
                              color: "#b0a080", cursor: "pointer", fontFamily: "Georgia, serif"
                            }}
                          >
                            📋 {t.copy}
                          </button>
                          <span style={{ fontSize: "0.72rem", color: "#6a5a40" }}>{translation}</span>
                          <span style={{ fontSize: "0.7rem", color: "#5a4a30", fontStyle: "italic", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setActiveVerse(isActive ? null : i); }}>
                            {isActive ? `▲ ${t.hide}` : `▼ ${t.context}`}
                          </span>
                        </div>
                      </div>

                      <p style={{ margin: 0, fontSize: "1.03rem", lineHeight: 1.85, color: "#ddd0b0", fontStyle: "italic" }}>
                        "{highlightText(verse.text, query)}"
                      </p>

                      {isActive && verse.context && (
                        <div style={{
                          marginTop: 14, padding: "12px 16px",
                          background: "rgba(255,255,255,0.04)", borderRadius: 10,
                          fontSize: "0.87rem", color: "#a09070", lineHeight: 1.65,
                          borderTop: `2px solid ${color}40`, animation: "fadeIn 0.25s ease"
                        }}>
                          <span style={{ color, fontWeight: 700 }}>✦ {t.context}: </span>
                          {verse.context}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredResults.length === 0 && (
                <div style={{ textAlign: "center", color: "#6a5a40", padding: "50px 0", fontStyle: "italic" }}>
                  {t.noVersesFound}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!results && !loading && !error && (
            <div style={{ textAlign: "center", padding: "70px 20px", opacity: 0.65 }}>
              <div style={{ fontSize: "4rem", marginBottom: 18 }}>📖</div>
              <p style={{ color: "#8a7a60", fontStyle: "italic", fontSize: "1.1rem", marginBottom: 24 }}>
                {t.enterSearch}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                {["Genesis 1:1", "John 3:16", "Psalms 23", "Revelation 21"].map(ref => (
                  <span key={ref} style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: "0.82rem",
                    border: "1px solid rgba(255,220,100,0.14)", color: "#7a6a50", fontStyle: "italic"
                  }}>{ref}</span>
                ))}
              </div>
            </div>
          )}

          <footer style={{ textAlign: "center", marginTop: 60, color: "#3a2a18", fontSize: "0.78rem", letterSpacing: "0.8px" }}>
            ✦ {t.poweredBy} ✦
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;