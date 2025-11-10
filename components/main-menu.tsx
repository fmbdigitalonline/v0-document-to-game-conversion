"use client"

import { Sparkles, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"

type MainMenuProps = {
  onStartWithDocument: () => void
  onViewReference: () => void
}

export function MainMenu({ onStartWithDocument, onViewReference }: MainMenuProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="grid gap-10 p-10 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
              <Sparkles className="w-4 h-4" />
              Transform your documents into games
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Learn faster with <span className="text-blue-600">visual memory games</span>
            </h1>
            <p className="text-lg text-slate-600">
              Upload any text and watch it turn into interactive experiences that help you retain information using symbols,
              colors and playful challenges.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={onStartWithDocument} className="bg-blue-600 hover:bg-blue-700">
                <UploadCloud className="w-4 h-4 mr-2" />
                Start with your document
              </Button>
              <Button onClick={onViewReference} variant="outline">
                View symbol reference
              </Button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">What you'll get:</p>
              <ul className="space-y-1">
                <li>• Automatic symbol dictionary for key terms</li>
                <li>• Multiple games to reinforce memory and understanding</li>
                <li>• A playful way to revisit your notes or study material</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-violet-500 opacity-90">
              &nbsp;
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-700/10 via-white/5 to-white/20 p-8 text-white">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Powered by visual cues</p>
                <p className="text-xl font-semibold leading-relaxed">
                  Symbols and colors create neural anchors that make recall effortless.
                </p>
              </div>
              <div className="space-y-3 text-sm text-blue-100/90">
                <p>• Tailored symbol library</p>
                <p>• Engage multiple learning styles</p>
                <p>• Track comprehension through play</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
