"use client"

import type { DocumentSymbolMap } from "@/lib/word-symbol-system"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface WordSymbolReferenceProps {
  symbolMap: DocumentSymbolMap
  onBack: () => void
}

export function WordSymbolReference({ symbolMap, onBack }: WordSymbolReferenceProps) {
  if (Object.keys(symbolMap).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Button onClick={onBack} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Visual Symbol Library</h1>
            <p className="text-slate-600">Upload a document to generate your personal symbol dictionary</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Your Visual Symbol Dictionary</h1>
        <p className="text-slate-600 mb-8">
          Each unique word in your document has been assigned a unique symbol and color. Use this reference guide to
          memorize the associations for all games.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(symbolMap).map(([word, data]) => (
            <div
              key={word}
              className="p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2"
              style={{
                backgroundColor: data.backgroundColor,
                borderColor: data.color,
              }}
            >
              <div className="text-4xl">{data.symbol}</div>
              <div className="text-sm font-bold text-center" style={{ color: data.color }}>
                {word}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-3">How to Use This System</h2>
          <ul className="text-blue-800 space-y-2">
            <li>• Each word in your document has a unique symbol and color</li>
            <li>• Memorize these associations - they appear in all games</li>
            <li>• Use this reference before playing games to build visual memory</li>
            <li>• The more you connect symbols to words, the better you'll remember them</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
