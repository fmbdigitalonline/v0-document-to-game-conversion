"use client"

import { BrainCircuit, LayoutDashboard, Shuffle } from "lucide-react"

import type { DocumentSymbolMap } from "@/lib/word-symbol-system"
import { Button } from "@/components/ui/button"

type GameSelectorProps = {
  documentText: string
  symbolMap: DocumentSymbolMap
  onSelectGame: (gameId: string) => void
  onBack: () => void
}

const games = [
  {
    id: "flashcards",
    title: "Symbol Flashcards",
    description: "Cycle through each word and reveal its symbol pairing.",
    icon: BrainCircuit,
  },
  {
    id: "match",
    title: "Symbol Match",
    description: "Match the symbol to the original word and build recognition.",
    icon: LayoutDashboard,
  },
  {
    id: "shuffle",
    title: "Quick Shuffle Quiz",
    description: "See a random symbol and guess which word it represents.",
    icon: Shuffle,
  },
] as const

export function GameSelector({ documentText, symbolMap, onSelectGame, onBack }: GameSelectorProps) {
  const hasSymbols = Object.keys(symbolMap).length > 0
  const wordCount = documentText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Choose your game</h1>
            <p className="text-slate-600">
              {hasSymbols
                ? "Select a mode to reinforce the connections between words and symbols."
                : "Upload a document first to generate the symbol library."}
            </p>
          </div>
          <Button variant="ghost" onClick={onBack}>
            Back to menu
          </Button>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Document size:</span> {wordCount} words
            </p>
            <p>
              <span className="font-semibold text-slate-800">Unique symbol entries:</span> {Object.keys(symbolMap).length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {games.map((game) => {
            const Icon = game.icon
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => hasSymbols && onSelectGame(game.id)}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                disabled={!hasSymbols}
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-50 p-3 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">{game.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{game.description}</p>
                <span className="mt-auto inline-flex items-center pt-6 text-sm font-medium text-blue-600">
                  Play now →
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
