export interface CrosswordCell {
  letter: string
  number?: number
  isBlack: boolean
  acrossClueNum?: number
  downClueNum?: number
}

export interface PlacedWord {
  word: string
  clueNumber: number
  direction: "across" | "down"
  row: number
  col: number
}

export interface CrosswordData {
  grid: CrosswordCell[][]
  placedWords: PlacedWord[]
  rows: number
  cols: number
}

const GRID_SIZE = 30

function createEmptyGrid(): string[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""))
}

function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: "across" | "down",
): boolean {
  const dr = direction === "down" ? 1 : 0
  const dc = direction === "across" ? 1 : 0
  const len = word.length

  // Check bounds
  if (row + dr * (len - 1) >= GRID_SIZE || col + dc * (len - 1) >= GRID_SIZE) return false
  if (row < 0 || col < 0) return false

  // Check cell before the word (should be empty)
  const beforeR = row - dr
  const beforeC = col - dc
  if (beforeR >= 0 && beforeC >= 0 && grid[beforeR][beforeC] !== "") return false

  // Check cell after the word (should be empty)
  const afterR = row + dr * len
  const afterC = col + dc * len
  if (afterR < GRID_SIZE && afterC < GRID_SIZE && grid[afterR][afterC] !== "") return false

  for (let i = 0; i < len; i++) {
    const r = row + dr * i
    const c = col + dc * i
    const cell = grid[r][c]

    if (cell !== "" && cell !== word[i]) {
      return false // Conflict
    }

    if (cell === "") {
      // Check perpendicular neighbors (should not create unintended adjacencies)
      if (direction === "across") {
        // Check above and below
        const above = r > 0 ? grid[r - 1][c] : ""
        const below = r < GRID_SIZE - 1 ? grid[r + 1][c] : ""
        if (above !== "" || below !== "") return false
      } else {
        // Check left and right
        const left = c > 0 ? grid[r][c - 1] : ""
        const right = c < GRID_SIZE - 1 ? grid[r][c + 1] : ""
        if (left !== "" || right !== "") return false
      }
    }
  }

  return true
}

function placeWord(grid: string[][], word: string, row: number, col: number, direction: "across" | "down"): void {
  const dr = direction === "down" ? 1 : 0
  const dc = direction === "across" ? 1 : 0
  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i][col + dc * i] = word[i]
  }
}

function findIntersections(
  grid: string[][],
  word: string,
  placed: PlacedWord[],
): { row: number; col: number; direction: "across" | "down" }[] {
  const results: { row: number; col: number; direction: "across" | "down" }[] = []

  for (const existing of placed) {
    const existDir = existing.direction
    const newDir: "across" | "down" = existDir === "across" ? "down" : "across"

    for (let ei = 0; ei < existing.word.length; ei++) {
      for (let wi = 0; wi < word.length; wi++) {
        if (existing.word[ei] === word[wi]) {
          let newRow: number, newCol: number

          if (existDir === "across") {
            // Existing word is horizontal, new word goes vertical
            const intersectRow = existing.row
            const intersectCol = existing.col + ei
            newRow = intersectRow - wi
            newCol = intersectCol
          } else {
            // Existing word is vertical, new word goes horizontal
            const intersectRow = existing.row + ei
            const intersectCol = existing.col
            newRow = intersectRow
            newCol = intersectCol - wi
          }

          if (canPlaceWord(grid, word, newRow, newCol, newDir)) {
            results.push({ row: newRow, col: newCol, direction: newDir })
          }
        }
      }
    }
  }

  return results
}

export function generateCrossword(words: string[]): CrosswordData {
  // Clean and sort words: longest first, uppercase, only alpha characters
  const cleanWords = words
    .map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))
    .filter((w) => w.length >= 2)
    .sort((a, b) => b.length - a.length)
    .slice(0, 20) // Limit to 20 words for performance

  if (cleanWords.length === 0) {
    return { grid: [], placedWords: [], rows: 0, cols: 0 }
  }

  const grid = createEmptyGrid()
  const placed: PlacedWord[] = []

  // Place first word horizontally in the center
  const firstWord = cleanWords[0]
  const startRow = Math.floor(GRID_SIZE / 2)
  const startCol = Math.floor((GRID_SIZE - firstWord.length) / 2)
  placeWord(grid, firstWord, startRow, startCol, "across")
  placed.push({ word: firstWord, clueNumber: 0, row: startRow, col: startCol, direction: "across" })

  // Try to place remaining words
  for (let i = 1; i < cleanWords.length; i++) {
    const word = cleanWords[i]
    const intersections = findIntersections(grid, word, placed)

    if (intersections.length > 0) {
      // Pick the first valid intersection
      const spot = intersections[0]
      placeWord(grid, word, spot.row, spot.col, spot.direction)
      placed.push({ word, clueNumber: 0, row: spot.row, col: spot.col, direction: spot.direction })
    }
  }

  // Find bounding box
  let minRow = GRID_SIZE,
    maxRow = 0,
    minCol = GRID_SIZE,
    maxCol = 0
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== "") {
        minRow = Math.min(minRow, r)
        maxRow = Math.max(maxRow, r)
        minCol = Math.min(minCol, c)
        maxCol = Math.max(maxCol, c)
      }
    }
  }

  // Add 1 cell padding
  minRow = Math.max(0, minRow - 1)
  maxRow = Math.min(GRID_SIZE - 1, maxRow + 1)
  minCol = Math.max(0, minCol - 1)
  maxCol = Math.min(GRID_SIZE - 1, maxCol + 1)

  const rows = maxRow - minRow + 1
  const cols = maxCol - minCol + 1

  // Adjust placed word positions relative to bounding box
  for (const pw of placed) {
    pw.row -= minRow
    pw.col -= minCol
  }

  // Assign clue numbers
  // Collect all start positions and sort by row then col
  const startPositions = new Map<string, { across: boolean; down: boolean }>()
  for (const pw of placed) {
    const key = `${pw.row},${pw.col}`
    if (!startPositions.has(key)) {
      startPositions.set(key, { across: false, down: false })
    }
    const entry = startPositions.get(key)!
    if (pw.direction === "across") entry.across = true
    if (pw.direction === "down") entry.down = true
  }

  const sortedKeys = Array.from(startPositions.keys()).sort((a, b) => {
    const [ar, ac] = a.split(",").map(Number)
    const [br, bc] = b.split(",").map(Number)
    if (ar !== br) return ar - br
    return ac - bc
  })

  const clueNumberMap = new Map<string, number>()
  let clueNum = 1
  for (const key of sortedKeys) {
    clueNumberMap.set(key, clueNum++)
  }

  for (const pw of placed) {
    const key = `${pw.row},${pw.col}`
    pw.clueNumber = clueNumberMap.get(key) ?? 0
  }

  // Build final grid
  const finalGrid: CrosswordCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: "", isBlack: true })),
  )

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const letter = grid[r + minRow][c + minCol]
      if (letter !== "") {
        finalGrid[r][c] = { letter, isBlack: false }
      }
    }
  }

  // Set clue numbers and word references on cells
  for (const pw of placed) {
    const dr = pw.direction === "down" ? 1 : 0
    const dc = pw.direction === "across" ? 1 : 0
    for (let i = 0; i < pw.word.length; i++) {
      const r = pw.row + dr * i
      const c = pw.col + dc * i
      if (r < rows && c < cols) {
        if (i === 0) {
          finalGrid[r][c].number = pw.clueNumber
        }
        if (pw.direction === "across") {
          finalGrid[r][c].acrossClueNum = pw.clueNumber
        } else {
          finalGrid[r][c].downClueNum = pw.clueNumber
        }
      }
    }
  }

  return { grid: finalGrid, placedWords: placed, rows, cols }
}
