"use client"

import { useState } from "react"
import { DocumentUpload } from "@/components/document-upload"
import { MainMenu } from "@/components/main-menu"
import { GameSelector } from "@/components/game-selector"
import { GameInterface } from "@/components/game-interface"
import { WordSymbolReference } from "@/components/word-symbol-reference"
import { generateWordSymbolMap, type DocumentSymbolMap } from "@/lib/word-symbol-system"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"menu" | "upload" | "games" | "reference">("menu")
  const [documentText, setDocumentText] = useState("")
  const [symbolMap, setSymbolMap] = useState<DocumentSymbolMap>({})
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const handleDocumentReady = (text: string) => {
    const newSymbolMap = generateWordSymbolMap(text)
    setDocumentText(text)
    setSymbolMap(newSymbolMap)
    setCurrentScreen("games")
  }

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
  }

  const handleBackToMenu = () => {
    setCurrentScreen("menu")
    setSelectedGame(null)
    setDocumentText("")
    setSymbolMap({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentScreen === "menu" && (
        <MainMenu
          onStartWithDocument={() => setCurrentScreen("upload")}
          onViewReference={() => setCurrentScreen("reference")}
        />
      )}

      {currentScreen === "upload" && <DocumentUpload onDocumentReady={handleDocumentReady} onBack={handleBackToMenu} />}

      {currentScreen === "games" && !selectedGame && (
        <GameSelector
          documentText={documentText}
          symbolMap={symbolMap}
          onSelectGame={handleGameSelect}
          onBack={handleBackToMenu}
        />
      )}

      {currentScreen === "games" && selectedGame && (
        <GameInterface
          gameId={selectedGame}
          documentText={documentText}
          symbolMap={symbolMap}
          onBack={() => setSelectedGame(null)}
        />
      )}

      {currentScreen === "reference" && <WordSymbolReference symbolMap={symbolMap} onBack={handleBackToMenu} />}
    </div>
  )
}
