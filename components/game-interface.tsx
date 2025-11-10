"use client"

import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { ArrowLeft, Eye, EyeOff, RefreshCw } from "lucide-react"

import type { DocumentSymbolMap } from "@/lib/word-symbol-system"
import { Button } from "@/components/ui/button"

const gameTitles: Record<string, string> = {
  flashcards: "Symbol Flashcards",
  match: "Symbol Match",
  shuffle: "Quick Shuffle Quiz",
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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
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
      </div>
    </div>
  )
}
