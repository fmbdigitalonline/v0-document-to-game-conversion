export interface WordSymbol {
  word: string
  symbol: string
  color: string
  backgroundColor: string
  icon: string
}

export interface DocumentSymbolMap {
  [word: string]: WordSymbol
}

// Comprehensive symbol/icon library for visual memory
const symbolLibrary = [
  { symbol: "🎯", icon: "target" },
  { symbol: "🔥", icon: "fire" },
  { symbol: "⭐", icon: "star" },
  { symbol: "🚀", icon: "rocket" },
  { symbol: "💎", icon: "diamond" },
  { symbol: "🏆", icon: "trophy" },
  { symbol: "🌟", icon: "sparkle" },
  { symbol: "⚡", icon: "lightning" },
  { symbol: "🎨", icon: "palette" },
  { symbol: "🎭", icon: "theater" },
  { symbol: "🎪", icon: "circus" },
  { symbol: "🎬", icon: "film" },
  { symbol: "🎸", icon: "guitar" },
  { symbol: "🎹", icon: "piano" },
  { symbol: "🎺", icon: "trumpet" },
  { symbol: "🎻", icon: "violin" },
  { symbol: "🎤", icon: "microphone" },
  { symbol: "🎧", icon: "headphones" },
  { symbol: "📚", icon: "books" },
  { symbol: "📖", icon: "book" },
  { symbol: "📝", icon: "notes" },
  { symbol: "✏️", icon: "pencil" },
  { symbol: "🖊️", icon: "pen" },
  { symbol: "🖍️", icon: "crayon" },
  { symbol: "🖌️", icon: "paintbrush" },
  { symbol: "🎓", icon: "graduation" },
  { symbol: "🏫", icon: "school" },
  { symbol: "🏛️", icon: "museum" },
  { symbol: "🏰", icon: "castle" },
  { symbol: "🌈", icon: "rainbow" },
  { symbol: "☀️", icon: "sun" },
  { symbol: "🌙", icon: "moon" },
  { symbol: "⭐", icon: "star-small" },
  { symbol: "💫", icon: "comet" },
  { symbol: "🌟", icon: "glowing-star" },
  { symbol: "🔮", icon: "crystal-ball" },
  { symbol: "🎁", icon: "gift" },
  { symbol: "🎀", icon: "ribbon" },
  { symbol: "🎊", icon: "confetti" },
  { symbol: "🎉", icon: "celebration" },
  { symbol: "🎈", icon: "balloon" },
  { symbol: "🎆", icon: "fireworks" },
  { symbol: "🎇", icon: "sparkler" },
  { symbol: "🌸", icon: "flower" },
  { symbol: "🌺", icon: "hibiscus" },
  { symbol: "🌻", icon: "sunflower" },
  { symbol: "🌷", icon: "tulip" },
  { symbol: "🌹", icon: "rose" },
  { symbol: "🥀", icon: "wilted-rose" },
]

const colorPalette = [
  { bg: "#FFE5E5", text: "#C91C1C" }, // Red
  { bg: "#FFF0E5", text: "#C2410C" }, // Orange
  { bg: "#FFFAE5", text: "#A16207" }, // Amber
  { bg: "#FFFCE5", text: "#854D0E" }, // Yellow
  { bg: "#E5F9E5", text: "#166534" }, // Green
  { bg: "#E5F7FF", text: "#0369A1" }, // Blue
  { bg: "#F0E5FF", text: "#6B21A8" }, // Purple
  { bg: "#FFE5F5", text: "#BE185D" }, // Pink
  { bg: "#E5F0FF", text: "#1E40AF" }, // Indigo
  { bg: "#E5FFF5", text: "#0D7377" }, // Teal
]

// Dutch articles (lidwoorden) to exclude from all game modes
const DUTCH_ARTICLES = ["de", "het", "een", "des", "den", "der"]

/**
 * Generate a unique symbol map for all words in a document
 * Each unique word gets a consistent symbol, color, and icon
 */
export function generateWordSymbolMap(text: string): DocumentSymbolMap {
  // Extract unique words from text
  const words = text.toLowerCase().match(/\b\w+\b/g) || []

  const uniqueWords = Array.from(new Set(words))
    .filter((word) => word.length > 1) // Filter out single-letter words
    .filter((word) => !DUTCH_ARTICLES.includes(word)) // Filter out Dutch articles (lidwoorden)
    .slice(0, 50) // Limit to first 50 unique words

  const symbolMap: DocumentSymbolMap = {}

  uniqueWords.forEach((word, index) => {
    const symbolIndex = index % symbolLibrary.length
    const colorIndex = index % colorPalette.length

    symbolMap[word] = {
      word,
      symbol: symbolLibrary[symbolIndex].symbol,
      icon: symbolLibrary[symbolIndex].icon,
      color: colorPalette[colorIndex].text,
      backgroundColor: colorPalette[colorIndex].bg,
    }
  })

  return symbolMap
}

/**
 * Get symbol for a word, with fallback for unknown words
 */
export function getWordSymbol(word: string, symbolMap: DocumentSymbolMap): WordSymbol {
  const cleanWord = word.toLowerCase()

  if (symbolMap[cleanWord]) {
    return symbolMap[cleanWord]
  }

  // Fallback for unknown words
  return {
    word: cleanWord,
    symbol: "📝",
    icon: "note",
    color: "#666666",
    backgroundColor: "#F3F4F6",
  }
}

/**
 * Replace words in text with their visual symbols
 */
export function renderWordWithSymbol(
  word: string,
  symbolMap: DocumentSymbolMap,
): { symbol: string; displayText: string; color: string; backgroundColor: string } {
  const wordSymbol = getWordSymbol(word, symbolMap)
  return {
    symbol: wordSymbol.symbol,
    displayText: word,
    color: wordSymbol.color,
    backgroundColor: wordSymbol.backgroundColor,
  }
}
