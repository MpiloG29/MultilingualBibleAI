import { useState, useRef, useEffect } from "react";
import "./App.css";

// Data
import { getSynonyms } from "./data/synonyms";
import { getGenre } from "./data/genreMap";
import { getContext } from "./data/historicalContext";
import { getCrossRefs } from "./data/crossReferences";

// Components
import ThemeExplorer from "./components/ThemeExplorer";
import CharacterJourney from "./components/CharacterJourney";
import BibleAtlas from "./components/BibleAtlas";
import FamilyTree from "./components/FamilyTree";
import Journal from "./components/Journal";
import DailyDevotional from "./components/DailyDevotional";
import AIInsights from "./components/AIInsights";
import VerseComparisonModal from "./components/VerseComparisonModal";
import AudioPlayer from "./components/AudioPlayer";

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

const BIBLE_BOOKS = [
  { id: "genesis", book: "Genesis", author: "Moses", chapters: 50, testament: "OT", description: "The book of beginnings — creation, fall, flood, and patriarchs" },
  { id: "exodus", book: "Exodus", author: "Moses", chapters: 40, testament: "OT", description: "Israel's deliverance from Egypt and the giving of the Law" },
  { id: "leviticus", book: "Leviticus", author: "Moses", chapters: 27, testament: "OT", description: "Laws for worship and holy living" },
  { id: "numbers", book: "Numbers", author: "Moses", chapters: 36, testament: "OT", description: "Israel's wilderness wanderings and census" },
  { id: "deuteronomy", book: "Deuteronomy", author: "Moses", chapters: 34, testament: "OT", description: "Moses' final speeches and renewal of the covenant" },
  { id: "joshua", book: "Joshua", author: "Joshua", chapters: 24, testament: "OT", description: "Conquest and division of the Promised Land" },
  { id: "judges", book: "Judges", author: "Samuel", chapters: 21, testament: "OT", description: "Cycles of sin, oppression, and deliverance" },
  { id: "ruth", book: "Ruth", author: "Samuel", chapters: 4, testament: "OT", description: "Story of loyalty, love, and redemption" },
  { id: "1samuel", book: "1 Samuel", author: "Samuel, Gad, Nathan", chapters: 31, testament: "OT", description: "Transition from judges to monarchy — Samuel, Saul, David" },
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

// Verse card accent colors follow the functional palette
const COLORS = ["#F5C518","#2980B9","#27AE60","#8E44AD","#C0392B","#9B59B6","#E53935","#D4A96A"];

const UI_TRANSLATIONS = {
  en: {
    searchPlaceholder: "Search in {language}...",
    translation: "Translation", language: "Language", try: "Try:",
    recentSearches: "Recent searches", clear: "Clear", copy: "Copy",
    context: "context", hide: "hide", about: "About", inTheBible: "in the Bible",
    references: "references", filterByBook: "Filter by book",
    noVersesFound: "No verses found for this filter.",
    enterSearch: "Enter a name, word, or theme to search the Scriptures",
    oldTestament: "Old Testament", newTestament: "New Testament",
    search: "Search", searching: "Searching...",
    poweredBy: "Powered by AI · Free & Open",
    books: "Books", author: "Author", chapters: "Chapters", testament: "Testament",
    searchBooks: "Search books...", viewBook: "View Book", bookInfo: "Book Information",
    searchWord: "Search this word", synonymsFor: "Related searches for",
    historicalNote: "Historical Context", crossRefs: "Cross-References",
    compare: "Compare", narrate: "Read Aloud", journal: "Journal",
    share: "Share", aiSummary: "AI Summary",
  },
  es: {
    searchPlaceholder: "Buscar en {language}...",
    translation: "Traducción", language: "Idioma", try: "Prueba:",
    recentSearches: "Búsquedas recientes", clear: "Limpiar", copy: "Copiar",
    context: "contexto", hide: "ocultar", about: "Acerca de", inTheBible: "en la Biblia",
    references: "referencias", filterByBook: "Filtrar por libro",
    noVersesFound: "No se encontraron versículos para este filtro.",
    enterSearch: "Ingresa un nombre, palabra o tema para buscar en las Escrituras",
    oldTestament: "Antiguo Testamento", newTestament: "Nuevo Testamento",
    search: "Buscar", searching: "Buscando...",
    poweredBy: "Impulsado por IA · Gratis y Abierto",
    books: "Libros", author: "Autor", chapters: "Capítulos", testament: "Testamento",
    searchBooks: "Buscar libros...", viewBook: "Ver Libro", bookInfo: "Información del Libro",
    searchWord: "Buscar esta palabra", synonymsFor: "Búsquedas relacionadas",
    historicalNote: "Contexto Histórico", crossRefs: "Referencias Cruzadas",
    compare: "Comparar", narrate: "Leer en voz alta", journal: "Diario",
    share: "Compartir", aiSummary: "Resumen IA",
  }
};

const FALLBACK_DATABASE = {
  en: {
    "jesus": {
      results: [
        { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", context: "This verse summarizes God's love and the purpose of Jesus's mission." },
        { book: "Matthew", chapter: 1, verse: 21, text: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.", context: "The angel announces Jesus's birth and his purpose of salvation." },
        { book: "John", chapter: 14, verse: 6, text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", context: "Jesus declares himself to be the exclusive path to God." },
        { book: "Luke", chapter: 19, verse: 10, text: "For the Son of man is come to seek and to save that which was lost.", context: "Jesus summarizes his own mission on earth." },
      ],
      summary: "Jesus Christ is the central figure of Christianity, believed to be the Son of God and Savior of humanity.",
      totalFound: 4
    },
    "love": {
      results: [
        { book: "1 Corinthians", chapter: 13, verse: 4, text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", context: "This describes the characteristics of genuine love." },
        { book: "1 John", chapter: 4, verse: 8, text: "Whoever does not love does not know God, because God is love.", context: "This connects the nature of God with love." },
        { book: "John", chapter: 15, verse: 13, text: "Greater love has no one than this: to lay down one's life for one's friends.", context: "Jesus defines the greatest expression of love." },
        { book: "Romans", chapter: 8, verse: 38, text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.", context: "Nothing can separate us from God's love." },
      ],
      summary: "Love is a central theme throughout the Bible, described as both God's nature and the greatest commandment.",
      totalFound: 4
    },
    "faith": {
      results: [
        { book: "Hebrews", chapter: 11, verse: 1, text: "Now faith is the substance of things hoped for, the evidence of things not seen.", context: "This defines faith as trust in what is not yet visible." },
        { book: "Romans", chapter: 10, verse: 17, text: "So then faith comes by hearing, and hearing by the word of God.", context: "Faith grows through encountering God's Word." },
        { book: "James", chapter: 2, verse: 17, text: "Even so faith, if it has no works, is dead, being alone.", context: "Faith without action is not genuine faith." },
        { book: "Ephesians", chapter: 2, verse: 8, text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", context: "Salvation comes by grace through faith, not works." },
      ],
      summary: "Faith is described as complete trust and confidence in God, essential for salvation and the Christian life.",
      totalFound: 4
    },
    "hope": {
      results: [
        { book: "Romans", chapter: 15, verse: 13, text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.", context: "God himself is the source of all hope." },
        { book: "Jeremiah", chapter: 29, verse: 11, text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.", context: "God's plans for his people include hope and a future." },
        { book: "Isaiah", chapter: 40, verse: 31, text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", context: "Waiting on God renews our strength." },
      ],
      summary: "Hope in the Bible is confident expectation in God's promises, not merely wishful thinking.",
      totalFound: 3
    },
    "peace": {
      results: [
        { book: "Philippians", chapter: 4, verse: 7, text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", context: "God's peace surpasses human comprehension." },
        { book: "John", chapter: 14, verse: 27, text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.", context: "Jesus gives a peace the world cannot offer." },
        { book: "Isaiah", chapter: 26, verse: 3, text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.", context: "A steadfast mind focused on God leads to perfect peace." },
      ],
      summary: "The Bible describes peace (Hebrew: shalom) as wholeness, completeness, and God's presence.",
      totalFound: 3
    },
    "wisdom": {
      results: [
        { book: "Proverbs", chapter: 1, verse: 7, text: "The fear of the LORD is the beginning of wisdom: but fools despise wisdom and instruction.", context: "True wisdom starts with reverence for God." },
        { book: "James", chapter: 1, verse: 5, text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.", context: "God is generous in giving wisdom to those who ask." },
        { book: "Colossians", chapter: 2, verse: 3, text: "In whom are hidden all the treasures of wisdom and knowledge.", context: "All wisdom is found in Christ." },
      ],
      summary: "Biblical wisdom is the application of God's truth to daily life, beginning with reverence for God.",
      totalFound: 3
    },
    "prayer": {
      results: [
        { book: "Philippians", chapter: 4, verse: 6, text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", context: "Prayer is the antidote to anxiety." },
        { book: "Matthew", chapter: 7, verse: 7, text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", context: "Jesus promises that persistent prayer is answered." },
        { book: "James", chapter: 5, verse: 16, text: "The prayer of a righteous person is powerful and effective.", context: "Righteous prayer has great power." },
        { book: "1 Thessalonians", chapter: 5, verse: 17, text: "Pray without ceasing.", context: "Prayer should be a constant state of communion with God." },
      ],
      summary: "Prayer is the means by which believers communicate with God — in praise, petition, and intercession.",
      totalFound: 4
    },
    "grace": {
      results: [
        { book: "Ephesians", chapter: 2, verse: 8, text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", context: "Grace is God's unearned gift of salvation." },
        { book: "2 Corinthians", chapter: 12, verse: 9, text: "My grace is sufficient for you, for my power is made perfect in weakness.", context: "God's grace sustains us in our weakness." },
        { book: "Romans", chapter: 5, verse: 8, text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.", context: "Grace given while we were undeserving." },
      ],
      summary: "Grace is God's unmerited favor — the foundation of Christian salvation.",
      totalFound: 3
    },
    "forgiveness": {
      results: [
        { book: "1 John", chapter: 1, verse: 9, text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", context: "Confession leads to God's complete forgiveness." },
        { book: "Psalms", chapter: 103, verse: 12, text: "As far as the east is from the west, so far has he removed our transgressions from us.", context: "God removes our sins completely." },
        { book: "Colossians", chapter: 3, verse: 13, text: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.", context: "Forgive others as God has forgiven us." },
      ],
      summary: "Forgiveness is a central theme — God's forgiveness of us and our call to forgive others.",
      totalFound: 3
    },
    "salvation": {
      results: [
        { book: "Romans", chapter: 10, verse: 9, text: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved.", context: "The way of salvation." },
        { book: "Acts", chapter: 4, verse: 12, text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.", context: "Salvation is exclusively through Jesus." },
        { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", context: "God's salvation through his Son." },
      ],
      summary: "Salvation is God's rescue of humanity from sin and death through Jesus Christ.",
      totalFound: 3
    },
    "strength": {
      results: [
        { book: "Philippians", chapter: 4, verse: 13, text: "I can do all this through him who gives me strength.", context: "Paul's declaration of Christ-given strength." },
        { book: "Isaiah", chapter: 40, verse: 31, text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles.", context: "God renews the strength of those who wait on him." },
        { book: "Psalms", chapter: 46, verse: 1, text: "God is our refuge and strength, an ever-present help in trouble.", context: "God himself is our strength." },
      ],
      summary: "Strength in Scripture comes from God, not our own abilities or resources.",
      totalFound: 3
    },
    "luke": {
      results: [
        { book: "Luke", chapter: 1, verse: 1, text: "Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us.", context: "Luke's introduction explaining his purpose in writing." },
        { book: "Luke", chapter: 2, verse: 11, text: "For unto you is born this day in the city of David a Saviour, which is Christ the Lord.", context: "The angel's announcement of Jesus' birth." },
        { book: "Luke", chapter: 19, verse: 10, text: "For the Son of man is come to seek and to save that which was lost.", context: "Jesus' mission statement in Luke." },
        { book: "Luke", chapter: 15, verse: 7, text: "I say unto you, that likewise joy shall be in heaven over one sinner that repenteth, more than over ninety and nine just persons, which need no repentance.", context: "Heaven celebrates when lost are found." },
      ],
      summary: "The Gospel of Luke was written by Luke, a physician and companion of Paul, emphasizing Jesus' compassion for all people.",
      totalFound: 4
    },
    "john": {
      results: [
        { book: "John", chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", context: "The prologue establishing Jesus' divinity." },
        { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", context: "The most famous verse summarizing the gospel." },
        { book: "John", chapter: 14, verse: 6, text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", context: "Jesus as the exclusive path to God." },
        { book: "John", chapter: 11, verse: 25, text: "Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.", context: "Jesus claims to be the source of resurrection." },
      ],
      summary: "The Gospel of John was written by the apostle John to demonstrate that Jesus is the divine Son of God.",
      totalFound: 4
    },
    "psalms": {
      results: [
        { book: "Psalm", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want.", context: "David's trust in God's provision and care." },
        { book: "Psalm", chapter: 51, verse: 10, text: "Create in me a clean heart, O God; and renew a right spirit within me.", context: "David's prayer of repentance after sinning with Bathsheba." },
        { book: "Psalm", chapter: 119, verse: 105, text: "Your word is a lamp to my feet and a light to my path.", context: "The illuminating power of God's Word." },
        { book: "Psalm", chapter: 46, verse: 10, text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.", context: "God's call to rest and trust in His sovereignty." },
      ],
      summary: "The Book of Psalms is a collection of 150 songs and prayers written primarily by David.",
      totalFound: 4
    },
    "david": {
      results: [
        { book: "1 Samuel", chapter: 17, verse: 45, text: "Then said David to the Philistine, Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts, the God of the armies of Israel.", context: "David confronts Goliath in God's name." },
        { book: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want.", context: "David's most beloved psalm of trust." },
        { book: "Acts", chapter: 13, verse: 22, text: "I have found David the son of Jesse, a man after mine own heart, which shall fulfil all my will.", context: "God's description of David." },
      ],
      summary: "David was Israel's greatest king, poet, musician, and a man described as 'after God's own heart.'",
      totalFound: 3
    },
    "moses": {
      results: [
        { book: "Exodus", chapter: 3, verse: 14, text: "And God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.", context: "God reveals his name to Moses at the burning bush." },
        { book: "Deuteronomy", chapter: 34, verse: 10, text: "And there arose not a prophet since in Israel like unto Moses, whom the LORD knew face to face.", context: "Moses' unique relationship with God." },
        { book: "Hebrews", chapter: 11, verse: 24, text: "By faith Moses, when he had grown up, refused to be known as the son of Pharaoh's daughter.", context: "Moses's faith-driven choice." },
      ],
      summary: "Moses was the great prophet and lawgiver who led Israel out of Egypt and received God's Law on Mount Sinai.",
      totalFound: 3
    },
    "genesis": {
      results: [
        { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heavens and the earth.", context: "The opening verse of Scripture — God is the Creator of all things." },
        { book: "Genesis", chapter: 1, verse: 27, text: "So God created mankind in his own image, in the image of God he created them; male and female he created them.", context: "Humanity is uniquely made in God's image, the pinnacle of creation." },
        { book: "Genesis", chapter: 3, verse: 15, text: "And I will put enmity between you and the woman, and between your offspring and hers; he will crush your head, and you will strike his heel.", context: "The first prophecy of a Savior — God's promise of redemption immediately after the fall." },
        { book: "Genesis", chapter: 12, verse: 2, text: "I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing.", context: "God's covenant with Abraham — the foundation of the nation of Israel." },
        { book: "Genesis", chapter: 50, verse: 20, text: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.", context: "Joseph's declaration of God's sovereign purpose through suffering." },
      ],
      summary: "Genesis is the book of beginnings — creation, the fall, the flood, the Tower of Babel, and the stories of the patriarchs Abraham, Isaac, Jacob, and Joseph.",
      totalFound: 5
    },
    "exodus": {
      results: [
        { book: "Exodus", chapter: 3, verse: 14, text: "God said to Moses, 'I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you.'", context: "God reveals his personal name (YHWH) to Moses at the burning bush." },
        { book: "Exodus", chapter: 14, verse: 14, text: "The LORD will fight for you; you need only to be still.", context: "Moses reassures Israel as Pharaoh's army pursues them at the Red Sea." },
        { book: "Exodus", chapter: 20, verse: 2, text: "I am the LORD your God, who brought you out of Egypt, out of the land of slavery.", context: "The preamble to the Ten Commandments — God's identity and saving act." },
        { book: "Exodus", chapter: 33, verse: 14, text: "The LORD replied, 'My Presence will go with you, and I will give you rest.'", context: "God promises his continual presence with Moses and Israel." },
      ],
      summary: "Exodus tells the story of God's deliverance of Israel from Egyptian slavery through Moses, the giving of the Law at Sinai, and the building of the Tabernacle.",
      totalFound: 4
    },
    "matthew": {
      results: [
        { book: "Matthew", chapter: 5, verse: 3, text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.", context: "The opening of the Beatitudes from Jesus's Sermon on the Mount." },
        { book: "Matthew", chapter: 6, verse: 33, text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", context: "Jesus's call to prioritize God's kingdom above earthly concerns." },
        { book: "Matthew", chapter: 11, verse: 28, text: "Come to me, all you who are weary and burdened, and I will give you rest.", context: "Jesus's open invitation to find rest in him." },
        { book: "Matthew", chapter: 28, verse: 19, text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.", context: "The Great Commission — Jesus's final command to his disciples." },
        { book: "Matthew", chapter: 1, verse: 23, text: "The virgin will conceive and give birth to a son, and they will call him Immanuel (which means 'God with us').", context: "Fulfillment of Isaiah's prophecy at Jesus's birth." },
      ],
      summary: "Matthew presents Jesus as the promised Messiah and King of Israel, written primarily for a Jewish audience to show Jesus fulfills Old Testament prophecy.",
      totalFound: 5
    },
    "mark": {
      results: [
        { book: "Mark", chapter: 1, verse: 15, text: "The time has come. The kingdom of God has come near. Repent and believe the good news!", context: "Jesus's first recorded sermon — a call to repentance and faith." },
        { book: "Mark", chapter: 10, verse: 45, text: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.", context: "Jesus defines his mission as servant-leadership and sacrifice." },
        { book: "Mark", chapter: 12, verse: 30, text: "Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength.", context: "Jesus names the greatest commandment." },
        { book: "Mark", chapter: 16, verse: 6, text: "Don't be alarmed. You are looking for Jesus the Nazarene, who was crucified. He has risen! He is not here.", context: "The angel announces Jesus's resurrection to the women at the tomb." },
      ],
      summary: "Mark is the shortest and most action-packed Gospel, presenting Jesus as the suffering servant, written for a Gentile audience emphasizing what Jesus did.",
      totalFound: 4
    },
    "acts": {
      results: [
        { book: "Acts", chapter: 1, verse: 8, text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.", context: "Jesus's final words before his ascension — the mission of the church." },
        { book: "Acts", chapter: 2, verse: 4, text: "All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them.", context: "Pentecost — the birth of the church through the outpouring of the Holy Spirit." },
        { book: "Acts", chapter: 2, verse: 38, text: "Peter replied, 'Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins. And you will receive the gift of the Holy Spirit.'", context: "Peter's call to repentance on the day of Pentecost." },
        { book: "Acts", chapter: 4, verse: 12, text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.", context: "Peter's bold declaration before the Sanhedrin." },
      ],
      summary: "Acts records the birth and rapid expansion of the early church through the power of the Holy Spirit, following the apostles' witness from Jerusalem to Rome.",
      totalFound: 4
    },
    "romans": {
      results: [
        { book: "Romans", chapter: 1, verse: 16, text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.", context: "Paul's thesis statement for the entire letter to the Romans." },
        { book: "Romans", chapter: 3, verse: 23, text: "For all have sinned and fall short of the glory of God.", context: "Paul establishes the universal need for salvation." },
        { book: "Romans", chapter: 5, verse: 8, text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.", context: "The foundation of the gospel — grace given while we were undeserving." },
        { book: "Romans", chapter: 8, verse: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", context: "God's sovereign goodness working through all circumstances." },
        { book: "Romans", chapter: 12, verse: 2, text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", context: "Paul's call to living sacrifice and renewed thinking." },
      ],
      summary: "Romans is Paul's most systematic presentation of the gospel — sin, justification by faith, sanctification, and God's plan for Israel and the Gentiles.",
      totalFound: 5
    },
    "proverbs": {
      results: [
        { book: "Proverbs", chapter: 1, verse: 7, text: "The fear of the LORD is the beginning of wisdom; fools despise wisdom and instruction.", context: "The foundational principle of the entire book of Proverbs." },
        { book: "Proverbs", chapter: 3, verse: 5, text: "Trust in the LORD with all your heart and lean not on your own understanding.", context: "A call to complete reliance on God rather than human reasoning." },
        { book: "Proverbs", chapter: 4, verse: 23, text: "Above all else, guard your heart, for everything you do flows from it.", context: "The heart is the wellspring of all of life's actions and decisions." },
        { book: "Proverbs", chapter: 22, verse: 6, text: "Start children off on the way they should go, and even when they are old they will not turn from it.", context: "The lasting impact of early spiritual training." },
        { book: "Proverbs", chapter: 31, verse: 30, text: "Charm is deceptive, and beauty is fleeting; but a woman who fears the LORD is to be praised.", context: "The conclusion of Proverbs on true worth." },
      ],
      summary: "Proverbs is a collection of wise sayings on godly living, written mainly by Solomon. It covers topics from work and relationships to integrity and the fear of God.",
      totalFound: 5
    },
    "isaiah": {
      results: [
        { book: "Isaiah", chapter: 9, verse: 6, text: "For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.", context: "One of the clearest messianic prophecies in the Old Testament." },
        { book: "Isaiah", chapter: 40, verse: 31, text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", context: "A promise of supernatural strength for those who wait on God." },
        { book: "Isaiah", chapter: 41, verse: 10, text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", context: "God's personal reassurance of his presence and power." },
        { book: "Isaiah", chapter: 53, verse: 5, text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.", context: "The suffering servant passage — a profound prophecy of Christ's atonement." },
        { book: "Isaiah", chapter: 55, verse: 8, text: "For my thoughts are not your thoughts, neither are your ways my ways, declares the LORD.", context: "God's transcendence over human reasoning and understanding." },
      ],
      summary: "Isaiah is the most quoted Old Testament book in the New Testament, filled with prophecies of judgment and redemption, including vivid portraits of the coming Messiah.",
      totalFound: 5
    },
    "revelation": {
      results: [
        { book: "Revelation", chapter: 1, verse: 8, text: "I am the Alpha and the Omega, says the Lord God, who is, and who was, and who is to come, the Almighty.", context: "God's declaration of his eternal nature and sovereign authority." },
        { book: "Revelation", chapter: 3, verse: 20, text: "Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me.", context: "Jesus's personal invitation to intimate relationship." },
        { book: "Revelation", chapter: 21, verse: 4, text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.", context: "God's promise of the new creation where all suffering ends." },
        { book: "Revelation", chapter: 21, verse: 1, text: "Then I saw a new heaven and a new earth, for the first heaven and the first earth had passed away, and there was no longer any sea.", context: "John's vision of the ultimate restoration of all creation." },
        { book: "Revelation", chapter: 22, verse: 20, text: "He who testifies to these things says, 'Yes, I am coming soon.' Amen. Come, Lord Jesus.", context: "The final prayer of Scripture — longing for Christ's return." },
      ],
      summary: "Revelation is the final book of the Bible, a prophetic vision given to the apostle John, revealing Christ's ultimate victory over evil and the glorious future of God's people.",
      totalFound: 5
    },
    "daniel": {
      results: [
        { book: "Daniel", chapter: 1, verse: 8, text: "But Daniel resolved not to defile himself with the royal food and wine, and he asked the chief official for permission not to defile himself this way.", context: "Daniel's commitment to integrity in a pagan culture." },
        { book: "Daniel", chapter: 3, verse: 17, text: "If we are thrown into the blazing furnace, the God we serve is able to deliver us from it, and he will deliver us from Your Majesty's hand.", context: "Shadrach, Meshach, and Abednego's bold declaration of faith before Nebuchadnezzar." },
        { book: "Daniel", chapter: 6, verse: 10, text: "Now when Daniel learned that the decree had been published, he went home to his upstairs room where the windows opened toward Jerusalem. Three times a day he got down on his knees and prayed.", context: "Daniel's uncompromising prayer life in defiance of the king's decree." },
        { book: "Daniel", chapter: 12, verse: 3, text: "Those who are wise will shine like the brightness of the heavens, and those who lead many to righteousness, like the stars for ever and ever.", context: "The reward of faithful servants in the resurrection." },
      ],
      summary: "Daniel tells the story of a young Jewish man who remained faithful to God in Babylonian exile, rising to great influence while receiving profound prophetic visions of future kingdoms.",
      totalFound: 4
    },
    "ephesians": {
      results: [
        { book: "Ephesians", chapter: 2, verse: 8, text: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.", context: "The clearest statement of salvation by grace through faith in Scripture." },
        { book: "Ephesians", chapter: 2, verse: 10, text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.", context: "Believers are God's masterpiece, created with divine purpose." },
        { book: "Ephesians", chapter: 4, verse: 32, text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.", context: "Paul's call to mutual forgiveness modeled on God's forgiveness." },
        { book: "Ephesians", chapter: 6, verse: 11, text: "Put on the full armor of God, so that you can take your stand against the devil's schemes.", context: "The beginning of Paul's famous description of spiritual warfare." },
      ],
      summary: "Ephesians celebrates the believer's spiritual blessings in Christ, the unity of the church, and how the gospel transforms every area of life including marriage, family, and work.",
      totalFound: 4
    },
    "galatians": {
      results: [
        { book: "Galatians", chapter: 2, verse: 20, text: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God.", context: "Paul's declaration of union with Christ — the heart of Christian identity." },
        { book: "Galatians", chapter: 5, verse: 22, text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.", context: "The character produced by the Holy Spirit in a believer's life." },
        { book: "Galatians", chapter: 3, verse: 28, text: "There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus.", context: "The radical equality of all believers in Christ." },
        { book: "Galatians", chapter: 6, verse: 9, text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", context: "Encouragement to persevere in faithful service." },
      ],
      summary: "Galatians is Paul's passionate defense of the gospel of grace against those who added works to faith for salvation, proclaiming freedom in Christ.",
      totalFound: 4
    },
    "psalm": {
      results: [
        { book: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd, I lack nothing.", context: "David's expression of complete trust in God's provision and care." },
        { book: "Psalms", chapter: 46, verse: 10, text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.", context: "God's call to rest in his sovereignty amid chaos." },
        { book: "Psalms", chapter: 119, verse: 105, text: "Your word is a lamp for my feet, a light on my path.", context: "Scripture as the guide for daily living." },
        { book: "Psalms", chapter: 91, verse: 1, text: "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.", context: "The security and protection found in God's presence." },
        { book: "Psalms", chapter: 139, verse: 14, text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", context: "A declaration of God's intimate knowledge in creating each person." },
      ],
      summary: "The Psalms are 150 songs and prayers that cover the full range of human emotion — praise, lament, thanksgiving, and trust — written primarily by David for Israel's worship.",
      totalFound: 5
    },
  },
  es: {
    "jesus": {
      results: [
        { book: "Juan", chapter: 3, verse: 16, text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna.", context: "Este versículo resume el amor de Dios y el propósito de la misión de Jesús." },
        { book: "Mateo", chapter: 1, verse: 21, text: "Y dará a luz un hijo, y llamarás su nombre JESÚS, porque él salvará a su pueblo de sus pecados.", context: "El ángel anuncia el nacimiento de Jesús y su propósito de salvación." }
      ],
      summary: "Jesucristo es la figura central del cristianismo, considerado el Hijo de Dios y Salvador de la humanidad.",
      totalFound: 2
    },
    "amor": {
      results: [
        { book: "1 Corintios", chapter: 13, verse: 4, text: "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.", context: "Esto describe las características del amor genuino." }
      ],
      summary: "El amor es un tema central en toda la Biblia, descrito como la naturaleza de Dios.",
      totalFound: 1
    },
    "lucas": {
      results: [
        { book: "Lucas", chapter: 2, verse: 11, text: "Que os ha nacido hoy, en la ciudad de David, un Salvador, que es CRISTO el Señor.", context: "El anuncio del nacimiento de Jesús." },
        { book: "Lucas", chapter: 19, verse: 10, text: "Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido.", context: "La misión de Jesús según Lucas." }
      ],
      summary: "El Evangelio de Lucas fue escrito por Lucas, un médico y compañero de Pablo.",
      totalFound: 2
    }
  }
};

const getGenericFallback = (searchQuery, language) => ({
  results: [
    { book: "Psalm", chapter: 119, verse: 105, text: language.code === "en" ? "Your word is a lamp to my feet and a light to my path." : language.code === "es" ? "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." : "Your word is a lamp to my feet and a light to my path.", context: `About "${searchQuery}" in the Bible` },
    { book: "2 Timothy", chapter: 3, verse: 16, text: language.code === "en" ? "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness." : language.code === "es" ? "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia." : "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.", context: `About "${searchQuery}" in the Bible` }
  ],
  summary: `The Bible contains many references to "${searchQuery}". Explore the verses above for inspiration and guidance.`,
  totalFound: 2
});

function highlightText(text, query) {
  if (!query || query.length < 2) return text;
  try {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: "linear-gradient(120deg,#F5C518 0%,#FFB347 100%)", color: "#1a0a00", borderRadius: "3px", padding: "0 2px", fontWeight: 700, boxShadow: "0 1px 4px rgba(255,180,0,0.35)" }}>{part}</mark>
      ) : part
    );
  } catch { return text; }
}

const TABS = [
  { id: "search", label: "🔍 Search", shortLabel: "Search" },
  { id: "themes", label: "🎨 Themes", shortLabel: "Themes" },
  { id: "characters", label: "👤 Characters", shortLabel: "Characters" },
  { id: "atlas", label: "🗺️ Atlas", shortLabel: "Atlas" },
  { id: "family", label: "👨‍👩‍👦 Family Tree", shortLabel: "Family" },
  { id: "journal", label: "📖 Journal", shortLabel: "Journal" },
  { id: "devotional", label: "🌅 Devotional", shortLabel: "Devotional" },
  { id: "ai", label: "🤖 AI Insights", shortLabel: "AI" },
];

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [query, setQuery] = useState("");
  const [translation, setTranslation] = useState("KJV");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVerse, setActiveVerse] = useState(null);
  const [selectedVerseForAI, setSelectedVerseForAI] = useState(null);
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
  const [synonymInfo, setSynonymInfo] = useState(null);
  const [expandedHistCtx, setExpandedHistCtx] = useState(null);
  const [expandedCrossRefs, setExpandedCrossRefs] = useState(null);
  const [comparisonVerse, setComparisonVerse] = useState(null);
  const [showAudioForVerse, setShowAudioForVerse] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const inputRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const bookPanelRef = useRef(null);
  const bookPanelToggleRef = useRef(null);

  const t = UI_TRANSLATIONS[language.code] || UI_TRANSLATIONS.en;

  useEffect(() => {
    const saved = localStorage.getItem("bibleSearchHistory");
    if (saved) { try { setHistory(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("bibleSearchHistory", JSON.stringify(history.slice(0, 20)));
  }, [history]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target)) setShowLanguageDropdown(false);
      if (bookPanelRef.current && !bookPanelRef.current.contains(e.target) && !bookPanelToggleRef.current?.contains(e.target) && showBookPanel) setShowBookPanel(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBookPanel]);

  const suggestions = ["Jesus", "Love", "Faith", "Hope", "Peace", "David", "Moses", "Luke", "John", "Psalms"];
  const filteredLanguages = LANGUAGES.filter(lang => lang.label.toLowerCase().includes(languageSearchInput.toLowerCase()) || lang.nativeName.toLowerCase().includes(languageSearchInput.toLowerCase()) || lang.code.toLowerCase().includes(languageSearchInput.toLowerCase()));
  const filteredBooks = BIBLE_BOOKS.filter(book => {
    const matchesSearch = book.book.toLowerCase().includes(bookSearchInput.toLowerCase()) || book.author.toLowerCase().includes(bookSearchInput.toLowerCase()) || book.description.toLowerCase().includes(bookSearchInput.toLowerCase());
    return matchesSearch && (selectedTestament === "all" || book.testament === selectedTestament);
  });

  const getFallbackData = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    const langDb = FALLBACK_DATABASE[language.code] || FALLBACK_DATABASE.en;
    if (langDb[lowerQuery]) return langDb[lowerQuery];
    for (const [key, data] of Object.entries(langDb)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) return data;
    }
    if (language.code !== "en") {
      const enDb = FALLBACK_DATABASE.en;
      for (const [key, data] of Object.entries(enDb)) {
        if (lowerQuery.includes(key) || key.includes(lowerQuery)) return data;
      }
    }
    return getGenericFallback(searchQuery, language);
  };

  const searchBook = (bookName) => { setQuery(bookName); setShowBookPanel(false); search(bookName); };

  async function search(searchQuery = query) {
    if (!searchQuery.trim()) return;
    const cacheKey = `${searchQuery}_${translation}_${language.code}`;
    if (cachedResults[cacheKey]) { setResults(cachedResults[cacheKey]); addToHistory(searchQuery); setSynonymInfo(getSynonyms(searchQuery)); return; }
    setLoading(true); setError(null); setResults(null); setActiveVerse(null); setBookFilter("All");
    setSynonymInfo(getSynonyms(searchQuery));
    try {
      await new Promise(r => setTimeout(r, 500));
      const result = getFallbackData(searchQuery);
      if (result) { setCachedResults(prev => ({ ...prev, [cacheKey]: result })); setResults(result); addToHistory(searchQuery); }
    } catch { setError("Unable to get results. Please try again."); }
    finally { setLoading(false); }
  }

  const addToHistory = (searchQuery) => {
    setHistory(prev => {
      const newHistory = [{ query: searchQuery, translation, language: language.code, flag: language.flag, timestamp: Date.now() }, ...prev.filter(h => h.query !== searchQuery || h.translation !== translation || h.language !== language.code)];
      return newHistory.slice(0, 20);
    });
  };

  const clearHistory = () => { setHistory([]); localStorage.removeItem("bibleSearchHistory"); };
  const filteredResults = results?.results?.filter(r => bookFilter === "All" || r.book === bookFilter) || [];
  const uniqueBooks = results ? [...new Set(results.results.map(r => r.book))] : [];
  const testament = (book) => { const info = BIBLE_BOOKS.find(b => b.book.toLowerCase() === book.toLowerCase()); return info ? info.testament : (BOOKS.slice(0, 39).includes(book) ? "OT" : "NT"); };

  function copyVerse(verse, idx) {
    navigator.clipboard.writeText(`"${verse.text}" — ${verse.book} ${verse.chapter}:${verse.verse} (${translation})`);
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  }

  function shareVerse(verse) {
    const text = `📖 ${verse.book} ${verse.chapter}:${verse.verse} (${translation})\n\n"${verse.text}"\n\nShared via Multilingual Bible AI`;
    navigator.clipboard.writeText(text);
  }

  function goToAI(verse) {
    setSelectedVerseForAI(verse);
    setActiveTab("ai");
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100% !important; min-height: 100vh; }
        body { overflow-x: hidden; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: #A0907A; }
        textarea::placeholder { color: #A0907A; }
        select option { background: #FAF6EE !important; color: #1A1240; }
        .verse-card:hover { background: rgba(255,255,255,0.95) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.10) !important; }
        .suggestion-btn:hover { background: rgba(245,197,24,0.18) !important; }
        .search-input:focus { border-color: rgba(245,197,24,0.8) !important; box-shadow: 0 0 0 3px rgba(245,197,24,0.12); }
        .copy-btn:hover { background: rgba(245,197,24,0.2) !important; }
        .skeleton { animation: pulse 1.5s ease-in-out infinite; }
        .language-dropdown, .book-panel { scrollbar-width: thin; scrollbar-color: #F5C518 #FAF6EE; }
        .language-dropdown::-webkit-scrollbar, .book-panel::-webkit-scrollbar { width: 8px; }
        .language-dropdown::-webkit-scrollbar-track, .book-panel::-webkit-scrollbar-track { background: #FAF6EE; }
        .language-dropdown::-webkit-scrollbar-thumb, .book-panel::-webkit-scrollbar-thumb { background-color: #F5C518; border-radius: 20px; }
        .book-item:hover { background: rgba(245,197,24,0.10) !important; transform: translateX(4px); }
        .tab-btn:hover { background: rgba(245,197,24,0.10) !important; }
        .nav-scroll { scrollbar-width: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }
        .verse-action:hover { background: rgba(0,0,0,0.06) !important; }
      `}</style>

      <div style={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg,#FEFCF7 0%,#FAF6EE 50%,#F5EDD8 100%)", fontFamily: "'Georgia','Times New Roman',serif", color: "#1A1240", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 15% 10%,rgba(245,197,24,0.10) 0%,transparent 55%),radial-gradient(ellipse at 85% 85%,rgba(142,68,173,0.07) 0%,transparent 55%),radial-gradient(ellipse at 50% 50%,rgba(41,128,185,0.04) 0%,transparent 70%)" }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(0,0,0,0.018) 60px,rgba(0,0,0,0.018) 61px)" }} />

        {/* Book Panel Toggle */}
        <button ref={bookPanelToggleRef} onClick={() => setShowBookPanel(!showBookPanel)} style={{ position: "fixed", left: showBookPanel ? "320px" : "0", top: "50%", transform: "translateY(-50%)", background: "linear-gradient(90deg,#F5C518,#E8A020)", border: "none", borderLeft: showBookPanel ? "none" : "3px solid #F5C518", borderRight: showBookPanel ? "3px solid #F5C518" : "none", borderRadius: showBookPanel ? "12px 0 0 12px" : "0 12px 12px 0", padding: "15px 8px", color: "#1a0800", fontWeight: "bold", cursor: "pointer", zIndex: 2000, transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(255,200,50,0.3)", writingMode: "vertical-rl", textOrientation: "mixed" }}>
          {showBookPanel ? "✕" : "📚 " + t.books}
        </button>

        {/* Books Panel */}
        {showBookPanel && (
          <div ref={bookPanelRef} className="book-panel" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "320px", background: "rgba(254,252,247,0.98)", backdropFilter: "blur(12px)", borderRight: "1px solid rgba(245,197,24,0.35)", zIndex: 1999, animation: "slideIn 0.3s ease", overflowY: "auto", padding: "24px 16px", boxShadow: "4px 0 20px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#F5C518", marginBottom: 16, fontSize: "1.2rem" }}>📚 {t.books}</h3>
            <input type="text" value={bookSearchInput} onChange={e => setBookSearchInput(e.target.value)} placeholder={t.searchBooks} style={{ width: "100%", padding: "10px 12px", marginBottom: 12, background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,220,100,0.3)", borderRadius: 8, color: "#1A1240", fontSize: "0.9rem", outline: "none" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[["all","All"], ["OT", t.oldTestament], ["NT", t.newTestament]].map(([val, label]) => (
                <button key={val} onClick={() => setSelectedTestament(val)} style={{ flex: 1, padding: "6px", background: selectedTestament === val ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.80)", border: `1px solid ${selectedTestament === val ? "#F5C518" : "rgba(0,0,0,0.09)"}`, borderRadius: 6, color: selectedTestament === val ? "#F5C518" : "#4A3828", cursor: "pointer", fontSize: "0.78rem" }}>{label}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredBooks.map(book => (
                <div key={book.id} className="book-item" style={{ padding: "12px", background: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.80)", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }} onClick={() => setSelectedBook(selectedBook?.id === book.id ? null : book)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: selectedBook?.id === book.id ? 8 : 0 }}>
                    <div><span style={{ color: "#F5C518", fontWeight: "bold" }}>{book.book}</span><span style={{ marginLeft: 8, fontSize: "0.7rem", color: book.testament === "OT" ? "#FFB347" : "#B5C8FF" }}>{book.testament === "OT" ? t.oldTestament : t.newTestament}</span></div>
                    <span style={{ color: "#7a6a50", fontSize: "0.7rem" }}>{book.chapters} {t.chapters}</span>
                  </div>
                  {selectedBook?.id === book.id && (
                    <div style={{ padding: "8px", background: "rgba(255,255,255,0.80)", borderRadius: 6, borderLeft: "3px solid #F5C518" }}>
                      <div style={{ fontSize: "0.8rem", color: "#4A3828", marginBottom: 4 }}><span style={{ color: "#F5C518" }}>{t.author}:</span> {book.author}</div>
                      <div style={{ fontSize: "0.8rem", color: "#4A3828", marginBottom: 8 }}>{book.description}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={e => { e.stopPropagation(); searchBook(book.book); }} style={{ flex: 1, padding: "6px", background: "rgba(255,220,100,0.2)", border: "1px solid #F5C518", borderRadius: 4, color: "#F5C518", fontSize: "0.7rem", cursor: "pointer" }}>{t.viewBook}</button>
                        <button onClick={e => { e.stopPropagation(); setQuery(book.book); setShowBookPanel(false); }} style={{ flex: 1, padding: "6px", background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4, color: "#4A3828", fontSize: "0.7rem", cursor: "pointer" }}>{t.searchWord}</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1000, margin: "0 auto", padding: showBookPanel ? "0 24px 80px 344px" : "0 24px 80px", transition: "padding 0.3s ease" }}>

          {/* Header */}
          <header style={{ textAlign: "center", padding: "40px 0 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 10 }}>
              <span style={{ fontSize: 38 }}>✝</span>
              <h1 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 700, background: "linear-gradient(90deg,#F5C518,#E8A020,#C0392B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                Multilingual Bible AI
              </h1>
              <span style={{ fontSize: 38 }}>✦</span>
            </div>
            <p style={{ color: "#5A4030", fontSize: "0.95rem", fontStyle: "italic" }}>{t.enterSearch}</p>
          </header>

          {/* Navigation Tabs */}
          <div className="nav-scroll" style={{ display: "flex", gap: 5, marginBottom: 28, overflowX: "auto", padding: "6px", background: "rgba(255,255,255,0.82)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.88)" }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className="tab-btn"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 15px", borderRadius: 11, cursor: "pointer", fontFamily: "Georgia, serif",
                  background: activeTab === tab.id ? "rgba(255,220,100,0.18)" : "transparent",
                  border: `1.5px solid ${activeTab === tab.id ? "rgba(255,220,100,0.5)" : "transparent"}`,
                  color: activeTab === tab.id ? "#F5C518" : "#7a6a50",
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  whiteSpace: "nowrap", fontSize: "0.83rem", transition: "all 0.18s",
                  boxShadow: activeTab === tab.id ? "0 2px 12px rgba(255,220,100,0.15)" : "none",
                  flexShrink: 0,
                }}
              >{tab.label}</button>
            ))}
          </div>

          {/* ===== SEARCH TAB ===== */}
          {activeTab === "search" && (
            <div>
              {/* Controls */}
              <div style={{ background: "rgba(255,255,255,0.84)", border: "1px solid rgba(255,220,100,0.2)", borderRadius: 20, padding: "22px 26px", marginBottom: 24, backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <div style={{ display: "flex", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ fontSize: "0.7rem", color: "#F5C518", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{t.translation}</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {TRANSLATIONS.map(tr => (
                        <button key={tr} onClick={() => setTranslation(tr)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: "0.82rem", cursor: "pointer", border: translation === tr ? "1.5px solid #F5C518" : "1.5px solid rgba(255,255,255,0.12)", background: translation === tr ? "rgba(255,220,100,0.2)" : "rgba(255,255,255,0.84)", color: translation === tr ? "#F5C518" : "#c0aa88", fontWeight: translation === tr ? 700 : 400, transition: "all 0.18s", fontFamily: "Georgia, serif" }}>{tr}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ minWidth: 240, position: "relative" }} ref={languageDropdownRef}>
                    <label style={{ fontSize: "0.7rem", color: "#F5C518", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{t.language}</label>
                    <div onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} style={{ background: "rgba(0,0,0,0.07)", border: "1.5px solid rgba(255,220,100,0.28)", color: "#1A1240", borderRadius: 10, padding: "9px 14px", fontSize: "0.92rem", cursor: "pointer", width: "100%", fontFamily: "Georgia, serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{language.flag} {language.label}</span>
                      <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{showLanguageDropdown ? "▲" : "▼"}</span>
                    </div>
                    {showLanguageDropdown && (
                      <div className="language-dropdown" style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 280, overflowY: "auto", background: "#FAF6EE", border: "1px solid rgba(255,220,100,0.3)", borderRadius: 10, marginTop: 5, zIndex: 1000, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,220,100,0.2)" }}>
                          <input type="text" value={languageSearchInput} onChange={e => setLanguageSearchInput(e.target.value)} placeholder="Search languages..." style={{ width: "100%", padding: "7px 10px", background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,220,100,0.3)", borderRadius: 6, color: "#1A1240", fontSize: "0.88rem", outline: "none" }} onClick={e => e.stopPropagation()} />
                        </div>
                        {filteredLanguages.map(lang => (
                          <div key={lang.code} onClick={() => { setLanguage(lang); setShowLanguageDropdown(false); setLanguageSearchInput(""); }} style={{ padding: "10px 14px", cursor: "pointer", background: language.code === lang.code ? "rgba(255,220,100,0.2)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.80)", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,220,100,0.1)"} onMouseLeave={e => e.currentTarget.style.background = language.code === lang.code ? "rgba(255,220,100,0.2)" : "transparent"}>
                            <span style={{ fontSize: "1.1rem" }}>{lang.flag}</span>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ color: "#1A1240" }}>{lang.label}</span>
                              <span style={{ fontSize: "0.7rem", color: "#8a7a60" }}>{lang.nativeName}</span>
                            </div>
                            {language.code === lang.code && <span style={{ marginLeft: "auto", color: "#F5C518" }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <span style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", opacity: 0.4, pointerEvents: "none" }}>🔍</span>
                    <input ref={inputRef} className="search-input" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder={t.searchPlaceholder.replace("{language}", `${language.flag} ${language.label}`)} style={{ width: "100%", padding: "14px 16px 14px 46px", borderRadius: 12, background: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(255,220,100,0.25)", color: "#1A1240", fontSize: "1rem", outline: "none", fontFamily: "Georgia, serif", transition: "all 0.2s" }} />
                  </div>
                  <button onClick={() => search()} disabled={loading} style={{ padding: "14px 28px", borderRadius: 12, background: loading ? "rgba(255,220,100,0.1)" : "linear-gradient(135deg,#F5C518,#E8A020)", border: "none", color: loading ? "#666" : "#1a0800", fontWeight: 700, fontSize: "0.97rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s", whiteSpace: "nowrap", boxShadow: loading ? "none" : "0 4px 20px rgba(255,200,50,0.38)" }}>
                    {loading ? t.searching : t.search}
                  </button>
                </div>

                <div style={{ display: "flex", gap: 7, marginTop: 13, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.74rem", color: "#7a6a50" }}>{t.try}</span>
                  {suggestions.map(s => (
                    <button key={s} className="suggestion-btn" onClick={() => { setQuery(s); search(s); }} style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.77rem", background: "rgba(255,220,100,0.07)", border: "1px solid rgba(255,220,100,0.18)", color: "#c0aa88", cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s", textTransform: "capitalize" }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Synonym Suggestions */}
              {synonymInfo && results && (
                <div style={{ padding: "12px 18px", background: "rgba(181,200,255,0.08)", border: "1px solid rgba(181,200,255,0.2)", borderRadius: 12, marginBottom: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", animation: "slideDown 0.3s ease" }}>
                  <span style={{ fontSize: "0.78rem", color: "#B5C8FF", fontWeight: 700 }}>🔗 {t.synonymsFor} "{synonymInfo.key}":</span>
                  {synonymInfo.synonyms.slice(0, 6).map(syn => (
                    <button key={syn} onClick={() => { setQuery(syn); search(syn); }} style={{ padding: "3px 11px", borderRadius: 14, fontSize: "0.76rem", background: "rgba(181,200,255,0.12)", border: "1px solid rgba(181,200,255,0.25)", color: "#B5C8FF", cursor: "pointer", fontFamily: "Georgia, serif" }}>{syn}</button>
                  ))}
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setShowHistory(h => !h)} style={{ background: "none", border: "none", color: "#7a6a50", cursor: "pointer", fontSize: "0.8rem", fontFamily: "Georgia, serif" }}>
                      {showHistory ? "▾" : "▸"} {t.recentSearches} ({history.length})
                    </button>
                    <button onClick={clearHistory} style={{ background: "none", border: "1px solid rgba(255,100,100,0.3)", color: "#ff8a8a", fontSize: "0.7rem", padding: "2px 8px", borderRadius: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>{t.clear}</button>
                  </div>
                  {showHistory && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
                      {history.map((h, i) => (
                        <button key={i} onClick={() => { setQuery(h.query); setTranslation(h.translation); setLanguage(LANGUAGES.find(l => l.code === h.language)); search(h.query); }} style={{ padding: "4px 13px", borderRadius: 20, fontSize: "0.77rem", background: "rgba(255,255,255,0.80)", border: "1px solid rgba(0,0,0,0.09)", color: "#4A3828", cursor: "pointer", fontFamily: "Georgia, serif" }}>
                          {h.flag} {h.query} <span style={{ opacity: 0.45, fontSize: "0.7rem" }}>{h.translation}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div style={{ animation: "fadeIn 0.4s ease" }}>
                  {[1,2,3].map(n => (
                    <div key={n} style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: "20px 24px", marginBottom: 14 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <div className="skeleton" style={{ width: 100, height: 22, background: "#E8E0D0", borderRadius: 8 }} />
                        <div className="skeleton" style={{ width: 80, height: 22, background: "#E8E0D0", borderRadius: 8 }} />
                      </div>
                      <div className="skeleton" style={{ width: "100%", height: 56, background: "#E8E0D0", borderRadius: 8 }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ background: "rgba(255,70,70,0.1)", border: "1px solid rgba(255,80,80,0.35)", borderRadius: 14, padding: "18px 22px", color: "#ff9a9a", textAlign: "center", animation: "fadeIn 0.3s ease" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>⚠️</div>
                  <div style={{ fontWeight: 600 }}>{error}</div>
                </div>
              )}

              {/* Results */}
              {results && !loading && (
                <div style={{ animation: "fadeIn 0.4s ease" }}>
                  {/* Summary */}
                  <div style={{ background: "linear-gradient(135deg,rgba(255,220,100,0.1),rgba(255,160,30,0.05))", border: "1px solid rgba(255,220,100,0.28)", borderRadius: 18, padding: "22px 26px", marginBottom: 22, borderLeft: "5px solid #F5C518", boxShadow: "0 4px 20px rgba(255,200,50,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#F5C518", fontWeight: 700 }}>✦ {t.about} "{query}" {t.inTheBible}</h2>
                        <p style={{ margin: 0, color: "#3A2818", lineHeight: 1.75, fontSize: "0.95rem" }}>{results.summary}</p>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 90 }}>
                        <div style={{ fontSize: "2rem", fontWeight: 700, color: "#F5C518", lineHeight: 1 }}>{results.totalFound}</div>
                        <div style={{ fontSize: "0.68rem", color: "#8a7a60", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 3 }}>{t.references}</div>
                        <div style={{ fontSize: "0.78rem", color: "#6A5A40", marginTop: 5 }}>{translation} · {language.flag}</div>
                      </div>
                    </div>
                  </div>

                  {/* Book Filter */}
                  {uniqueBooks.length > 1 && (
                    <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.74rem", color: "#7a6a50" }}>{t.filterByBook}:</span>
                      {["All", ...uniqueBooks].map(b => (
                        <button key={b} onClick={() => setBookFilter(b)} style={{ padding: "4px 13px", borderRadius: 20, fontSize: "0.77rem", cursor: "pointer", border: bookFilter === b ? "1.5px solid #A8EDCA" : "1px solid rgba(0,0,0,0.09)", background: bookFilter === b ? "rgba(168,237,202,0.15)" : "rgba(255,255,255,0.84)", color: bookFilter === b ? "#A8EDCA" : "#7a6a50", transition: "all 0.15s", fontFamily: "Georgia, serif" }}>{b}</button>
                      ))}
                    </div>
                  )}

                  {/* Verse Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {filteredResults.map((verse, i) => {
                      const color = COLORS[i % COLORS.length];
                      const isActive = activeVerse === i;
                      const isOT = testament(verse.book) === "OT";
                      const genre = getGenre(verse.book);
                      const histCtx = getContext(verse.book);
                      const crossRefs = getCrossRefs(verse.book, verse.chapter, verse.verse);
                      const hasHistCtx = expandedHistCtx === i;
                      const hasCrossRefs = expandedCrossRefs === i;
                      const hasAudio = showAudioForVerse === i;

                      return (
                        <div key={i} className="verse-card" style={{ background: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.82)", border: `1px solid ${isActive ? color + "60" : "rgba(0,0,0,0.07)"}`, borderLeft: `5px solid ${color}`, borderRadius: 16, padding: "18px 22px", transition: "all 0.22s", transform: isActive ? "scale(1.005)" : "scale(1)", boxShadow: isActive ? `0 6px 28px ${color}25` : "0 2px 8px rgba(0,0,0,0.15)" }}>

                          {/* Card Header */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                              <span style={{ background: color + "28", color, border: `1px solid ${color}50`, borderRadius: 8, padding: "4px 11px", fontSize: "0.79rem", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.5px", cursor: "pointer" }} onClick={() => setActiveVerse(isActive ? null : i)}>
                                {verse.book} {verse.chapter}:{verse.verse}
                              </span>
                              <span style={{ fontSize: "0.67rem", padding: "3px 8px", borderRadius: 10, background: isOT ? "rgba(255,180,80,0.12)" : "rgba(168,180,255,0.12)", color: isOT ? "#FFB347" : "#B5C8FF", border: `1px solid ${isOT ? "rgba(255,180,80,0.22)" : "rgba(168,180,255,0.22)"}`, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {isOT ? t.oldTestament : t.newTestament}
                              </span>
                              {/* Genre badge */}
                              <span style={{ fontSize: "0.67rem", padding: "3px 8px", borderRadius: 10, background: genre.bg, color: genre.color, border: `1px solid ${genre.color}30` }}>
                                {genre.icon} {genre.genre}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: "0.7rem", color: "#6a5a40", fontFamily: "monospace", letterSpacing: "0.5px" }}>{translation}</span>
                              <span style={{ fontSize: "0.7rem", color: "#5a4a30", fontStyle: "italic", cursor: "pointer", userSelect: "none" }} onClick={e => { e.stopPropagation(); setActiveVerse(isActive ? null : i); }}>
                                {isActive ? `▲ ${t.hide}` : `▼ ${t.context}`}
                              </span>
                            </div>
                          </div>

                          {/* Verse Text */}
                          <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.9, color: "#2A1820", fontStyle: "italic" }}>
                            "{highlightText(verse.text, query)}"
                          </p>

                          {/* Action Bar */}
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
                            {[
                              { icon: copiedIdx === i ? "✓" : "📋", label: copiedIdx === i ? "Copied!" : t.copy, action: () => copyVerse(verse, i), active: copiedIdx === i, ac: "#A8EDCA" },
                              { icon: "📤", label: t.share, action: () => shareVerse(verse), active: false, ac: "#F5C518" },
                              { icon: "🔄", label: t.compare, action: () => setComparisonVerse(verse), active: false, ac: "#F5C518" },
                              { icon: "🔊", label: t.narrate, action: () => setShowAudioForVerse(hasAudio ? null : i), active: hasAudio, ac: "#F5C518" },
                              { icon: "🤖", label: t.aiSummary, action: () => goToAI(verse), active: selectedVerseForAI === verse, ac: "#D4B8FF" },
                            ].map((btn, bi) => (
                              <button key={bi} className="verse-action" onClick={e => { e.stopPropagation(); btn.action(); }} style={{ background: btn.active ? `${btn.ac}22` : "rgba(255,255,255,0.80)", border: `1px solid ${btn.active ? btn.ac + "60" : "rgba(0,0,0,0.09)"}`, borderRadius: 8, padding: "5px 12px", fontSize: "0.77rem", color: btn.active ? btn.ac : "#4A3828", cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                                {btn.icon} {btn.label}
                              </button>
                            ))}
                            {crossRefs && (
                              <button className="verse-action" onClick={e => { e.stopPropagation(); setExpandedCrossRefs(hasCrossRefs ? null : i); }} style={{ background: hasCrossRefs ? "rgba(181,200,255,0.18)" : "rgba(255,255,255,0.80)", border: `1px solid ${hasCrossRefs ? "#B5C8FF60" : "rgba(0,0,0,0.09)"}`, borderRadius: 8, padding: "5px 12px", fontSize: "0.77rem", color: hasCrossRefs ? "#B5C8FF" : "#4A3828", cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s" }}>
                                🔗 {t.crossRefs}
                              </button>
                            )}
                            {histCtx && (
                              <button className="verse-action" onClick={e => { e.stopPropagation(); setExpandedHistCtx(hasHistCtx ? null : i); }} style={{ background: hasHistCtx ? "rgba(128,229,212,0.18)" : "rgba(255,255,255,0.80)", border: `1px solid ${hasHistCtx ? "#80E5D460" : "rgba(0,0,0,0.09)"}`, borderRadius: 8, padding: "5px 12px", fontSize: "0.77rem", color: hasHistCtx ? "#80E5D4" : "#4A3828", cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s" }}>
                                🏛️ {t.historicalNote}
                              </button>
                            )}
                          </div>

                          {/* Context */}
                          {isActive && verse.context && (
                            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,0.84)", borderRadius: 10, fontSize: "0.86rem", color: "#5A4030", lineHeight: 1.65, borderTop: `2px solid ${color}40`, animation: "fadeIn 0.25s ease" }}>
                              <span style={{ color, fontWeight: 700 }}>✦ {t.context}: </span>{verse.context}
                            </div>
                          )}

                          {/* Audio Player */}
                          {hasAudio && (
                            <div style={{ marginTop: 12, animation: "fadeIn 0.25s ease" }}>
                              <AudioPlayer verse={verse} language={language} />
                            </div>
                          )}

                          {/* Cross-References */}
                          {hasCrossRefs && crossRefs && (
                            <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(181,200,255,0.07)", border: "1px solid rgba(181,200,255,0.2)", borderRadius: 12, animation: "fadeIn 0.25s ease" }}>
                              <div style={{ fontSize: "0.7rem", color: "#B5C8FF", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, fontWeight: 700 }}>🔗 Cross-References</div>
                              {crossRefs.map((ref, ri) => (
                                <div key={ri} style={{ padding: "8px 12px", marginBottom: 6, background: "rgba(255,255,255,0.84)", borderRadius: 8, borderLeft: "3px solid #B5C8FF" }}>
                                  <button onClick={() => { setQuery(ref.book); search(ref.book); }} style={{ background: "none", border: "none", color: "#B5C8FF", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem", padding: 0, fontFamily: "Georgia, serif" }}>{ref.book} {ref.chapter}:{ref.verse}</button>
                                  <p style={{ color: "#4A3828", margin: "3px 0", fontSize: "0.84rem", fontStyle: "italic" }}>"{ref.text?.substring(0, 100)}..."</p>
                                  <div style={{ color: "#7a6a50", fontSize: "0.76rem" }}>✦ {ref.note}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Historical Context */}
                          {hasHistCtx && histCtx && (
                            <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(128,229,212,0.06)", border: "1px solid rgba(128,229,212,0.2)", borderRadius: 12, animation: "fadeIn 0.25s ease" }}>
                              <div style={{ fontSize: "0.7rem", color: "#80E5D4", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, fontWeight: 700 }}>🏛️ Historical Context</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                                {[["Period", histCtx.period], ["Culture", histCtx.culture], ["Empire", histCtx.empire], ["Geography", histCtx.geography]].map(([label, val]) => (
                                  <div key={label} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.84)", borderRadius: 6 }}>
                                    <div style={{ fontSize: "0.68rem", color: "#80E5D4", marginBottom: 2 }}>{label}</div>
                                    <div style={{ fontSize: "0.78rem", color: "#4A3828" }}>{val}</div>
                                  </div>
                                ))}
                              </div>
                              <p style={{ color: "#6A5A40", margin: 0, fontSize: "0.82rem", lineHeight: 1.65 }}>{histCtx.notes}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {filteredResults.length === 0 && <div style={{ textAlign: "center", color: "#6a5a40", padding: "40px 0", fontStyle: "italic" }}>{t.noVersesFound}</div>}
                </div>
              )}

              {/* Empty State */}
              {!results && !loading && !error && (
                <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.65 }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: 14 }}>📖</div>
                  <p style={{ color: "#8a7a60", fontStyle: "italic", fontSize: "1.05rem", marginBottom: 20 }}>{t.enterSearch}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                    {["Genesis 1:1","John 3:16","Psalms 23","Revelation 21"].map(ref => (
                      <span key={ref} style={{ padding: "5px 14px", borderRadius: 20, fontSize: "0.82rem", border: "1px solid rgba(255,220,100,0.14)", color: "#7a6a50", fontStyle: "italic" }}>{ref}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 28, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    {[{id:"themes",label:"🎨 Explore Themes"},{id:"characters",label:"👤 Character Journeys"},{id:"atlas",label:"🗺️ Bible Atlas"},{id:"devotional",label:"🌅 Today's Devotional"}].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "8px 18px", borderRadius: 20, fontSize: "0.82rem", background: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.12)", color: "#6A5A40", cursor: "pointer", fontFamily: "Georgia, serif" }}>{tab.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== OTHER TABS ===== */}
          {activeTab === "themes" && <ThemeExplorer onSearchVerse={q => { setQuery(q); search(q); setActiveTab("search"); }} />}
          {activeTab === "characters" && <CharacterJourney onSearchVerse={q => { setQuery(q); search(q); setActiveTab("search"); }} />}
          {activeTab === "atlas" && <BibleAtlas onSearchVerse={q => { setQuery(q); search(q); setActiveTab("search"); }} />}
          {activeTab === "family" && <FamilyTree onSearchVerse={q => { setQuery(q); search(q); setActiveTab("search"); }} />}
          {activeTab === "journal" && <Journal />}
          {activeTab === "devotional" && <DailyDevotional language={language} onSearch={q => { setQuery(q); search(q); setActiveTab("search"); }} />}
          {activeTab === "ai" && <AIInsights translation={translation} language={language} currentVerse={selectedVerseForAI} onSearch={q => { setQuery(q); search(q); setActiveTab("search"); }} />}

          <footer style={{ textAlign: "center", marginTop: 50, color: "#3a2a18", fontSize: "0.76rem", letterSpacing: "0.8px" }}>
            ✦ {t.poweredBy} ✦
          </footer>
        </div>
      </div>

      {/* Verse Comparison Modal */}
      {comparisonVerse && <VerseComparisonModal verse={comparisonVerse} onClose={() => setComparisonVerse(null)} />}
    </>
  );
}

export default App;
