"use client"

import type { FormEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, Check, Eye, EyeOff, RefreshCw } from "lucide-react"

import type { DocumentSymbolMap } from "@/lib/word-symbol-system"
import { generateCrossword, type CrosswordData, type PlacedWord } from "@/lib/crossword-generator"
import { Button } from "@/components/ui/button"

const gameTitles: Record<string, string> = {
  flashcards: "Symbol Flashcards",
  match: "Symbol Match",
  shuffle: "Quick Shuffle Quiz",
  crossword: "Crossword Puzzle",
}

type GameInterfaceProps = {
  gameId: string
  documentText: string
  symbolMap: DocumentSymbolMap
  onBack: () => void
}

export function GameInterface({ gameId, documentText, symbolMap, onBack }: GameInterfaceProps) {
  const entries = useMemo(() => Object.values(symbolMap), [symbolMap])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleNext = () => {
    if (entries.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % entries.length)
    setRevealed(false)
    setFeedback(null)
    setQuizAnswer("")
  }

  const handlePrev = () => {
    if (entries.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + entries.length) % entries.length)
    setRevealed(false)
    setFeedback(null)
    setQuizAnswer("")
  }

  const currentEntry = entries[currentIndex]

  const handleQuizSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentEntry) return

    const guess = quizAnswer.trim().toLowerCase()
    if (!guess) {
      setFeedback("Type your guess before checking.")
      return
    }

    const isCorrect = guess === currentEntry.word.toLowerCase()
    setFeedback(isCorrect ? "Correct!" : `Not quite. The correct word was "${currentEntry.word}".`)
    if (isCorrect) {
      setTimeout(() => {
        handleNext()
      }, 600)
    }
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">No symbols yet</h2>
          <p className="mt-3 text-slate-600">
            Upload a document first to generate the visual dictionary before playing games.
          </p>
          <Button className="mt-6" onClick={onBack}>
            Back to game selection
          </Button>
        </div>
      </div>
    )
  }

  const title = gameTitles[gameId] ?? "Game"

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600">{title}</p>
            <h1 className="text-4xl font-bold text-slate-900">{currentEntry.word}</h1>
            <p className="text-slate-500">Document length: {documentText.split(/\s+/).filter(Boolean).length} words</p>
          </div>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to games
          </Button>
        </div>

        {gameId === "flashcards" && currentEntry && (
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
            <div
              className="mx-auto flex h-48 w-full max-w-xl flex-col items-center justify-center rounded-2xl border-2 text-center shadow-inner"
              style={{
                color: currentEntry.color,
                backgroundColor: currentEntry.backgroundColor,
                borderColor: currentEntry.color,
              }}
            >
              <span className="text-6xl">{currentEntry.symbol}</span>
              {revealed ? (
                <span className="mt-4 text-2xl font-semibold">{currentEntry.word}</span>
              ) : (
                <span className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-600">Tap reveal</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={handlePrev} variant="outline">
                Previous
              </Button>
              <Button onClick={() => setRevealed((value) => !value)} className="bg-blue-600 hover:bg-blue-700">
                {revealed ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" /> Hide word
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" /> Reveal word
                  </>
                )}
              </Button>
              <Button onClick={handleNext} variant="outline">
                Next
              </Button>
            </div>
          </div>
        )}

        {gameId === "match" && currentEntry && (
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900 text-center">Match the symbol to the word</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div
                className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 text-center shadow-inner"
                style={{
                  color: currentEntry.color,
                  backgroundColor: currentEntry.backgroundColor,
                  borderColor: currentEntry.color,
                }}
              >
                <span className="text-6xl">{currentEntry.symbol}</span>
                <span className="mt-2 text-sm text-slate-600">Which word matches?</span>
              </div>
              <div className="grid gap-3">
                {entries.slice(0, 4).map((entry, index) => (
                  <button
                    key={`${entry.word}-${index}`}
                    type="button"
                    onClick={() => setFeedback(entry.word === currentEntry.word ? "Correct!" : "Try again.")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-700 transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    {entry.word}
                  </button>
                ))}
              </div>
            </div>
            {feedback && <p className="text-center text-sm font-medium text-blue-600">{feedback}</p>}
            <div className="flex items-center justify-center">
              <Button onClick={handleNext}>
                <RefreshCw className="mr-2 h-4 w-4" /> New round
              </Button>
            </div>
          </div>
        )}

        {gameId === "shuffle" && currentEntry && (
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
            <h2 className="text-2xl font-semibold text-center text-slate-900">Guess the word</h2>
            <div
              className="mx-auto flex h-40 w-full max-w-md flex-col items-center justify-center rounded-2xl border-2 text-center shadow-inner"
              style={{
                color: currentEntry.color,
                backgroundColor: currentEntry.backgroundColor,
                borderColor: currentEntry.color,
              }}
            >
              <span className="text-6xl">{currentEntry.symbol}</span>
              <span className="mt-2 text-sm text-slate-600">Which word does this represent?</span>
            </div>
            <form onSubmit={handleQuizSubmit} className="mx-auto flex w-full max-w-md flex-col gap-3">
              <input
                value={quizAnswer}
                onChange={(event) => setQuizAnswer(event.target.value)}
                placeholder="Type your guess"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Check answer
              </Button>
            </form>
            {feedback && <p className="text-center text-sm font-medium text-blue-600">{feedback}</p>}
            <div className="flex items-center justify-center">
              <Button onClick={handleNext} variant="outline">
                Skip symbol
              </Button>
            </div>
          </div>
        )}

        {gameId === "crossword" && (
          <CrosswordGame symbolMap={symbolMap} documentText={documentText} />
        )}
      </div>
    </div>
  )
}

// ─── Crossword Game Component ──────────────────────────────────────────────────

/**
 * Extract a contextual clue for a word from the document text.
 * Returns the sentence where the word appears, with the word replaced by blanks.
 */
function extractContextClue(word: string, documentText: string): string {
  const lowerText = documentText.toLowerCase()
  const lowerWord = word.toLowerCase()

  // Find sentences containing the word
  const sentences = documentText.match(/[^.!?\n]+[.!?\n]*/g) || [documentText]

  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (trimmed.toLowerCase().includes(lowerWord)) {
      // Replace the word with underscores, preserving the rest of the sentence as context
      const blanked = trimmed.replace(
        new RegExp(`\\b${lowerWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
        "_".repeat(word.length),
      )
      // Trim to a reasonable length
      if (blanked.length > 120) {
        // Find the blank position and show context around it
        const blankPos = blanked.indexOf("_".repeat(word.length))
        const start = Math.max(0, blankPos - 50)
        const end = Math.min(blanked.length, blankPos + word.length + 50)
        const slice = blanked.slice(start, end)
        return (start > 0 ? "..." : "") + slice.trim() + (end < blanked.length ? "..." : "")
      }
      return blanked
    }
  }

  // Fallback: search by word fragments in the full text
  const idx = lowerText.indexOf(lowerWord)
  if (idx !== -1) {
    const start = Math.max(0, idx - 40)
    const end = Math.min(documentText.length, idx + word.length + 40)
    let snippet = documentText.slice(start, end)
    snippet = snippet.replace(
      new RegExp(`\\b${lowerWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
      "_".repeat(word.length),
    )
    return (start > 0 ? "..." : "") + snippet.trim() + (end < documentText.length ? "..." : "")
  }

  return `${word.length} letters`
}

function CrosswordGame({ symbolMap, documentText }: { symbolMap: DocumentSymbolMap; documentText: string }) {
  const entries = useMemo(() => Object.values(symbolMap), [symbolMap])
  const words = useMemo(() => entries.map((e) => e.word), [entries])

  const crossword = useMemo(() => generateCrossword(words), [words])

  // Build context clues from the document text
  const contextClues = useMemo(() => {
    const clues: Record<string, string> = {}
    for (const pw of crossword.placedWords) {
      const originalWord = entries.find((e) => e.word.toUpperCase() === pw.word)?.word ?? pw.word
      clues[pw.word] = extractContextClue(originalWord, documentText)
    }
    return clues
  }, [crossword.placedWords, entries, documentText])

  // Pre-reveal one letter per word at a varying position (stable per crossword)
  const revealedCells = useMemo(() => {
    const cells = new Map<string, string>() // key: "row,col" -> letter
    for (let wi = 0; wi < crossword.placedWords.length; wi++) {
      const pw = crossword.placedWords[wi]
      // Pick a different position per word: spread across the word length
      const revealIndex = (wi * 3 + 1) % pw.word.length
      const dr = pw.direction === "down" ? 1 : 0
      const dc = pw.direction === "across" ? 1 : 0
      const r = pw.row + dr * revealIndex
      const c = pw.col + dc * revealIndex
      cells.set(`${r},${c}`, pw.word[revealIndex])
    }
    return cells
  }, [crossword])

  const [userGrid, setUserGrid] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [direction, setDirection] = useState<"across" | "down">("across")
  const [checked, setChecked] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [revealedWords, setRevealedWords] = useState<Set<string>>(new Set()) // "clueNumber-direction"
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  // Initialize user grid with pre-revealed letters
  useEffect(() => {
    if (crossword.rows > 0 && crossword.cols > 0) {
      const grid = Array.from({ length: crossword.rows }, () => Array(crossword.cols).fill(""))
      // Seed the revealed letters into the grid
      for (const [key, letter] of revealedCells) {
        const [r, c] = key.split(",").map(Number)
        grid[r][c] = letter
      }
      setUserGrid(grid)
      setChecked(false)
      setShowSolution(false)
      setCorrectCount(0)
    }
  }, [crossword, revealedCells])

  const wordMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const entry of entries) {
      map[entry.word.toUpperCase()] = entry.symbol
    }
    return map
  }, [entries])

  const acrossClues = useMemo(
    () =>
      crossword.placedWords
        .filter((w) => w.direction === "across")
        .sort((a, b) => a.clueNumber - b.clueNumber),
    [crossword],
  )

  const downClues = useMemo(
    () =>
      crossword.placedWords
        .filter((w) => w.direction === "down")
        .sort((a, b) => a.clueNumber - b.clueNumber),
    [crossword],
  )

  const selectedWordCells = useMemo(() => {
    if (!selectedCell) return new Set<string>()
    const cells = new Set<string>()
    const grid = crossword.grid
    const r = selectedCell.row
    const c = selectedCell.col
    if (r >= grid.length || c >= grid[0]?.length) return cells
    const cell = grid[r][c]
    if (cell.isBlack) return cells

    const clueNum = direction === "across" ? cell.acrossClueNum : cell.downClueNum
    if (!clueNum) {
      // Try the other direction
      const otherClue = direction === "across" ? cell.downClueNum : cell.acrossClueNum
      if (!otherClue) return cells
    }

    const activeClue = direction === "across" ? cell.acrossClueNum : cell.downClueNum
    if (activeClue) {
      const pw = crossword.placedWords.find(
        (w) => w.clueNumber === activeClue && w.direction === direction,
      )
      if (pw) {
        const dr = pw.direction === "down" ? 1 : 0
        const dc = pw.direction === "across" ? 1 : 0
        for (let i = 0; i < pw.word.length; i++) {
          cells.add(`${pw.row + dr * i},${pw.col + dc * i}`)
        }
      }
    }
    return cells
  }, [selectedCell, direction, crossword])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const cell = crossword.grid[row]?.[col]
      if (!cell || cell.isBlack) return

      if (selectedCell?.row === row && selectedCell?.col === col) {
        // Toggle direction on re-click
        setDirection((d) => (d === "across" ? "down" : "across"))
      } else {
        setSelectedCell({ row, col })
        // Auto-pick direction based on what clues exist for this cell
        if (cell.acrossClueNum && !cell.downClueNum) setDirection("across")
        else if (!cell.acrossClueNum && cell.downClueNum) setDirection("down")
      }

      const key = `${row},${col}`
      inputRefs.current.get(key)?.focus()
    },
    [selectedCell, crossword.grid],
  )

  const handleCellInput = useCallback(
    (row: number, col: number, value: string) => {
      if (showSolution) return
      // Don't allow editing pre-revealed hint cells or individually revealed words
      if (revealedCells.has(`${row},${col}`)) return
      if (revealedWordCells.has(`${row},${col}`)) return
      const letter = value.toUpperCase().replace(/[^A-Z]/g, "").slice(-1)
      setUserGrid((prev) => {
        const next = prev.map((r) => [...r])
        next[row][col] = letter
        return next
      })
      setChecked(false)

      // Auto-advance to next cell in direction, skipping revealed hint cells
      if (letter) {
        const dr = direction === "down" ? 1 : 0
        const dc = direction === "across" ? 1 : 0
        let nr = row + dr
        let nc = col + dc
        // Skip over pre-revealed cells
        while (
          nr < crossword.rows &&
          nc < crossword.cols &&
          !crossword.grid[nr][nc].isBlack &&
          revealedCells.has(`${nr},${nc}`)
        ) {
          nr += dr
          nc += dc
        }
        if (nr < crossword.rows && nc < crossword.cols && !crossword.grid[nr][nc].isBlack) {
          setSelectedCell({ row: nr, col: nc })
          const key = `${nr},${nc}`
          setTimeout(() => inputRefs.current.get(key)?.focus(), 0)
        }
      }
    },
    [direction, crossword, showSolution],
  )

  const handleKeyDown = useCallback(
    (row: number, col: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && userGrid[row]?.[col] === "") {
        // Move back
        const dr = direction === "down" ? 1 : 0
        const dc = direction === "across" ? 1 : 0
        const pr = row - dr
        const pc = col - dc
        if (pr >= 0 && pc >= 0 && !crossword.grid[pr]?.[pc]?.isBlack) {
          setSelectedCell({ row: pr, col: pc })
          setUserGrid((prev) => {
            const next = prev.map((r) => [...r])
            next[pr][pc] = ""
            return next
          })
          const key = `${pr},${pc}`
          setTimeout(() => inputRefs.current.get(key)?.focus(), 0)
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        setDirection((d) => (d === "across" ? "down" : "across"))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        moveFocus(row, col, 0, 1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        moveFocus(row, col, 0, -1)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        moveFocus(row, col, 1, 0)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        moveFocus(row, col, -1, 0)
      }
    },
    [direction, crossword, userGrid],
  )

  const moveFocus = useCallback(
    (row: number, col: number, dr: number, dc: number) => {
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < crossword.rows && nc >= 0 && nc < crossword.cols && !crossword.grid[nr][nc].isBlack) {
        setSelectedCell({ row: nr, col: nc })
        const key = `${nr},${nc}`
        setTimeout(() => inputRefs.current.get(key)?.focus(), 0)
      }
    },
    [crossword],
  )

  const handleCheck = useCallback(() => {
    let correct = 0
    for (const pw of crossword.placedWords) {
      const dr = pw.direction === "down" ? 1 : 0
      const dc = pw.direction === "across" ? 1 : 0
      let wordCorrect = true
      for (let i = 0; i < pw.word.length; i++) {
        const r = pw.row + dr * i
        const c = pw.col + dc * i
        if (userGrid[r]?.[c] !== pw.word[i]) {
          wordCorrect = false
          break
        }
      }
      if (wordCorrect) correct++
    }
    setCorrectCount(correct)
    setChecked(true)
  }, [crossword, userGrid])

  const handleReveal = useCallback(() => {
    setUserGrid(
      crossword.grid.map((row) => row.map((cell) => (cell.isBlack ? "" : cell.letter))),
    )
    setShowSolution(true)
    setChecked(false)
    setCorrectCount(crossword.placedWords.length)
    setRevealedWords(new Set(crossword.placedWords.map((pw) => `${pw.clueNumber}-${pw.direction}`)))
  }, [crossword])

  // Reveal a single word and fill its letters into the grid
  const handleRevealWord = useCallback(
    (pw: PlacedWord) => {
      const wordKey = `${pw.clueNumber}-${pw.direction}`
      setRevealedWords((prev) => new Set(prev).add(wordKey))
      setUserGrid((prev) => {
        const next = prev.map((r) => [...r])
        const dr = pw.direction === "down" ? 1 : 0
        const dc = pw.direction === "across" ? 1 : 0
        for (let i = 0; i < pw.word.length; i++) {
          next[pw.row + dr * i][pw.col + dc * i] = pw.word[i]
        }
        return next
      })
      setChecked(false)
    },
    [],
  )

  // Set of cells that belong to individually revealed words
  const revealedWordCells = useMemo(() => {
    const cells = new Set<string>()
    for (const pw of crossword.placedWords) {
      const wordKey = `${pw.clueNumber}-${pw.direction}`
      if (!revealedWords.has(wordKey)) continue
      const dr = pw.direction === "down" ? 1 : 0
      const dc = pw.direction === "across" ? 1 : 0
      for (let i = 0; i < pw.word.length; i++) {
        cells.add(`${pw.row + dr * i},${pw.col + dc * i}`)
      }
    }
    return cells
  }, [crossword.placedWords, revealedWords])

  const handleClueClick = useCallback(
    (pw: PlacedWord) => {
      setSelectedCell({ row: pw.row, col: pw.col })
      setDirection(pw.direction)
      const key = `${pw.row},${pw.col}`
      setTimeout(() => inputRefs.current.get(key)?.focus(), 0)
    },
    [],
  )

  const getCellStatus = useCallback(
    (row: number, col: number): "correct" | "incorrect" | "none" => {
      if (!checked) return "none"
      const cell = crossword.grid[row]?.[col]
      if (!cell || cell.isBlack) return "none"
      const userLetter = userGrid[row]?.[col] ?? ""
      if (!userLetter) return "none"
      return userLetter === cell.letter ? "correct" : "incorrect"
    },
    [checked, crossword, userGrid],
  )

  if (crossword.placedWords.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Not enough words for a crossword</h2>
        <p className="mt-3 text-slate-600">
          Upload a document with more diverse words to generate a crossword puzzle.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleCheck} className="bg-blue-600 text-white hover:bg-blue-700">
          <Check className="mr-2 h-4 w-4" /> Check answers
        </Button>
        <Button onClick={handleReveal} variant="outline">
          <Eye className="mr-2 h-4 w-4" /> Reveal solution
        </Button>
        {checked && (
          <span className="text-sm font-medium text-slate-700">
            {correctCount} / {crossword.placedWords.length} words correct
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Grid */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${crossword.cols}, 52px)`,
              gridTemplateRows: `repeat(${crossword.rows}, 52px)`,
              gap: "2px",
              backgroundColor: "#cbd5e1",
            }}
          >
            {crossword.grid.map((row, ri) =>
              row.map((cell, ci) => {
                if (cell.isBlack) {
                  return (
                    <div
                      key={`${ri}-${ci}`}
                      className="bg-slate-800"
                      style={{ width: 52, height: 52 }}
                    />
                  )
                }

                const cellKey = `${ri},${ci}`
                const isSelected = selectedCell?.row === ri && selectedCell?.col === ci
                const isHighlighted = selectedWordCells.has(cellKey)
                const isHintRevealed = revealedCells.has(cellKey)
                const isWordRevealed = revealedWordCells.has(cellKey)
                const status = getCellStatus(ri, ci)
                const displayLetter = showSolution ? cell.letter : (userGrid[ri]?.[ci] ?? "")
                const isCellLocked = isHintRevealed || isWordRevealed

                let bgColor = "#ffffff"
                if (isWordRevealed && !isHintRevealed) bgColor = "#e0e7ff" // soft indigo for word reveals
                else if (isHintRevealed && !checked) bgColor = "#fef9c3" // warm yellow for hint cells
                else if (status === "correct") bgColor = "#dcfce7"
                else if (status === "incorrect") bgColor = "#fee2e2"
                else if (isSelected) bgColor = "#bfdbfe"
                else if (isHighlighted) bgColor = "#eff6ff"

                return (
                  <div
                    key={`${ri}-${ci}`}
                    className="relative cursor-pointer"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: bgColor,
                      outline: isSelected ? "2px solid #2563eb" : "none",
                      outlineOffset: "-1px",
                    }}
                    onClick={() => handleCellClick(ri, ci)}
                  >
                    {cell.number && (
                      <span className="absolute top-1 left-1 text-xs leading-none font-semibold text-slate-500">
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current.set(`${ri},${ci}`, el)
                        else inputRefs.current.delete(`${ri},${ci}`)
                      }}
                      type="text"
                      value={displayLetter}
                      onChange={(e) => handleCellInput(ri, ci, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(ri, ci, e)}
                      onFocus={() => {
                        if (selectedCell?.row !== ri || selectedCell?.col !== ci) {
                          setSelectedCell({ row: ri, col: ci })
                        }
                      }}
                      maxLength={2}
                      readOnly={showSolution || isCellLocked}
                      className={`absolute inset-0 w-full h-full text-center font-mono text-xl font-bold bg-transparent outline-none uppercase select-none ${isCellLocked ? "text-indigo-700 caret-transparent" : "text-slate-900 caret-blue-600"} ${isHintRevealed ? "!text-amber-700" : ""}`}
                      style={{ padding: "12px 0 0 0" }}
                      aria-label={`Row ${ri + 1}, Column ${ci + 1}`}
                    />
                  </div>
                )
              }),
            )}
          </div>
        </div>

        {/* Clues */}
        <div className="flex flex-1 flex-col gap-6 xl:flex-row">
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-h-[600px] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Across</h3>
            <ul className="flex flex-col gap-2">
              {acrossClues.map((pw) => {
                const clueSymbol = wordMap[pw.word] ?? "?"
                const context = contextClues[pw.word] ?? ""
                const wordKey = `${pw.clueNumber}-${pw.direction}`
                const isWordRevealed = revealedWords.has(wordKey)
                return (
                  <li key={`a-${pw.clueNumber}`}>
                    <div className={`flex items-start gap-1 rounded-lg transition ${isWordRevealed ? "bg-indigo-50" : "hover:bg-blue-50"}`}>
                      <button
                        type="button"
                        onClick={() => handleClueClick(pw)}
                        className="flex-1 px-3 py-2.5 text-left text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 font-semibold text-blue-600">{pw.clueNumber}.</span>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">{clueSymbol}</span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                {pw.word.length} letters
                              </span>
                              {isWordRevealed && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                                  revealed
                                </span>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed text-slate-600 italic">
                              {'"'}{context}{'"'}
                            </p>
                          </div>
                        </div>
                      </button>
                      {!isWordRevealed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRevealWord(pw)
                          }}
                          className="shrink-0 self-center mr-2 rounded-md p-1.5 text-slate-400 transition hover:bg-blue-100 hover:text-blue-600"
                          title={`Reveal "${pw.word.toLowerCase()}"`}
                          aria-label={`Reveal word for clue ${pw.clueNumber} across`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Down</h3>
            <ul className="flex flex-col gap-2">
              {downClues.map((pw) => {
                const clueSymbol = wordMap[pw.word] ?? "?"
                const context = contextClues[pw.word] ?? ""
                const wordKey = `${pw.clueNumber}-${pw.direction}`
                const isWordRevealed = revealedWords.has(wordKey)
                return (
                  <li key={`d-${pw.clueNumber}`}>
                    <div className={`flex items-start gap-1 rounded-lg transition ${isWordRevealed ? "bg-indigo-50" : "hover:bg-blue-50"}`}>
                      <button
                        type="button"
                        onClick={() => handleClueClick(pw)}
                        className="flex-1 px-3 py-2.5 text-left text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 font-semibold text-blue-600">{pw.clueNumber}.</span>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">{clueSymbol}</span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                {pw.word.length} letters
                              </span>
                              {isWordRevealed && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                                  revealed
                                </span>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed text-slate-600 italic">
                              {'"'}{context}{'"'}
                            </p>
                          </div>
                        </div>
                      </button>
                      {!isWordRevealed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRevealWord(pw)
                          }}
                          className="shrink-0 self-center mr-2 rounded-md p-1.5 text-slate-400 transition hover:bg-blue-100 hover:text-blue-600"
                          title={`Reveal "${pw.word.toLowerCase()}"`}
                          aria-label={`Reveal word for clue ${pw.clueNumber} down`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
