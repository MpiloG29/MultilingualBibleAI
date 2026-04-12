// Cross-references keyed by "book_chapter_verse" (lowercase, no spaces)
// Links OT prophecies to NT fulfillments and parallel passages
export const CROSS_REFS = {
  "john_3_16": [
    { book: "Romans", chapter: 5, verse: 8, text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.", note: "God's love proven in the cross" },
    { book: "Genesis", chapter: 22, verse: 2, text: "Take your son, your only son, whom you love—Isaac.", note: "Foreshadow: Abraham offering his 'only son'" },
    { book: "Isaiah", chapter: 53, verse: 5, text: "But he was pierced for our transgressions, he was crushed for our iniquities.", note: "OT Prophecy of the suffering servant" },
    { book: "1 John", chapter: 4, verse: 9, text: "This is how God showed his love among us: He sent his one and only Son into the world that we might live through him.", note: "God's love shown by sending His Son" },
  ],
  "isaiah_7_14": [
    { book: "Matthew", chapter: 1, verse: 23, text: "The virgin will conceive and give birth to a son, and they will call him Immanuel.", note: "NT Fulfillment: Virgin birth of Jesus" },
  ],
  "micah_5_2": [
    { book: "Matthew", chapter: 2, verse: 6, text: "But you, Bethlehem, in the land of Judah, are by no means least among the rulers of Judah; for out of you will come a ruler who will shepherd my people Israel.", note: "NT Fulfillment: Jesus born in Bethlehem" },
  ],
  "psalms_22_1": [
    { book: "Matthew", chapter: 27, verse: 46, text: "My God, my God, why have you forsaken me?", note: "NT Fulfillment: Jesus's cry from the cross" },
  ],
  "psalms_22_18": [
    { book: "John", chapter: 19, verse: 24, text: "They divided my clothes among them and cast lots for my garment.", note: "NT Fulfillment: Soldiers gambled for Jesus's garments" },
  ],
  "hebrews_11_1": [
    { book: "Romans", chapter: 1, verse: 17, text: "For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last.", note: "The righteous live by faith" },
    { book: "James", chapter: 2, verse: 17, text: "In the same way, faith by itself, if it is not accompanied by action, is dead.", note: "Faith must produce works" },
    { book: "2 Corinthians", chapter: 5, verse: 7, text: "For we live by faith, not by sight.", note: "Walking in what we cannot see" },
  ],
  "john_14_6": [
    { book: "Acts", chapter: 4, verse: 12, text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.", note: "Jesus is the only Savior" },
    { book: "1 Timothy", chapter: 2, verse: 5, text: "For there is one God and one mediator between God and mankind, the man Christ Jesus.", note: "One mediator between God and man" },
    { book: "Psalms", chapter: 16, verse: 11, text: "You make known to me the path of life; you will fill me with joy in your presence.", note: "OT parallel: God shows the path of life" },
  ],
  "psalms_23_1": [
    { book: "John", chapter: 10, verse: 11, text: "I am the good shepherd. The good shepherd lays down his life for the sheep.", note: "NT fulfillment: Jesus is the Good Shepherd" },
    { book: "Ezekiel", chapter: 34, verse: 23, text: "I will place over them one shepherd, my servant David, and he will tend them.", note: "OT Prophecy of the one shepherd" },
    { book: "Hebrews", chapter: 13, verse: 20, text: "Now may the God of peace, who through the blood of the eternal covenant brought back from the dead our Lord Jesus, that great Shepherd of the sheep.", note: "Jesus: the great Shepherd" },
  ],
  "genesis_1_1": [
    { book: "John", chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", note: "NT echo: Jesus (the Word) was there at creation" },
    { book: "Colossians", chapter: 1, verse: 16, text: "For in him all things were created: things in heaven and on earth, visible and invisible.", note: "All things created through Christ" },
    { book: "Hebrews", chapter: 11, verse: 3, text: "By faith we understand that the universe was formed at God's command.", note: "Creation required faith to understand" },
  ],
  "isaiah_53_5": [
    { book: "1 Peter", chapter: 2, verse: 24, text: "He himself bore our sins in his body on the cross, so that we might die to sins and live for righteousness; by his wounds you have been healed.", note: "NT fulfillment: Jesus bore our sins" },
    { book: "Romans", chapter: 4, verse: 25, text: "He was delivered over to death for our sins and was raised to life for our justification.", note: "Death and resurrection for our sake" },
  ],
  "malachi_4_5": [
    { book: "Matthew", chapter: 11, verse: 14, text: "And if you are willing to accept it, he is the Elijah who was to come.", note: "NT fulfillment: John the Baptist as 'Elijah'" },
  ],
  "1corinthians_13_4": [
    { book: "1 John", chapter: 4, verse: 8, text: "Whoever does not love does not know God, because God is love.", note: "God is the source and definition of love" },
    { book: "Romans", chapter: 13, verse: 10, text: "Love does no harm to a neighbor. Therefore love is the fulfillment of the law.", note: "Love fulfills the entire law" },
    { book: "John", chapter: 13, verse: 34, text: "A new command I give you: Love one another. As I have loved you, so you must love one another.", note: "Jesus's new commandment to love" },
  ],
  "philippians_4_13": [
    { book: "Psalms", chapter: 28, verse: 7, text: "The LORD is my strength and my shield; my heart trusts in him, and he helps me.", note: "God as strength — OT parallel" },
    { book: "Isaiah", chapter: 40, verse: 31, text: "But those who hope in the LORD will renew their strength.", note: "Strength renewed by waiting on God" },
  ],
  "jeremiah_29_11": [
    { book: "Romans", chapter: 8, verse: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", note: "God works all things for good" },
    { book: "Psalms", chapter: 139, verse: 16, text: "All the days ordained for me were written in your book before one of them came to be.", note: "God knows our days before they begin" },
  ],
};

export function getCrossRefs(book, chapter, verse) {
  const key = `${book.toLowerCase().replace(/\s+/g, "")}_${chapter}_${verse}`;
  return CROSS_REFS[key] || null;
}
