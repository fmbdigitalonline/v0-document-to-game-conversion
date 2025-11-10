"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useRef, useState } from "react"
import { ArrowLeft, FileText, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"

type DocumentUploadProps = {
  onDocumentReady: (text: string) => void
  onBack: () => void
}

export function DocumentUpload({ onDocumentReady, onBack }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [documentText, setDocumentText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes("text")) {
      setError("Please upload a plain text file.")
      return
    }

    try {
      const text = await file.text()
      setDocumentText(text)
      setError(null)
    } catch (err) {
      console.error("Failed to read file", err)
      setError("We couldn't read that file. Please try another document.")
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanedText = documentText.trim()
    if (!cleanedText) {
      setError("Add some text or upload a document before continuing.")
      return
    }

    setError(null)
    onDocumentReady(cleanedText)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Upload your document</h2>
              <p className="text-sm text-slate-500">We'll transform it into a visual learning experience.</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onBack} className="text-slate-600">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to menu
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid gap-2">
            <label htmlFor="document-text" className="text-sm font-medium text-slate-700">
              Paste your document text
            </label>
            <textarea
              id="document-text"
              value={documentText}
              onChange={(event) => setDocumentText(event.target.value)}
              placeholder="Paste or type the text you want to turn into games..."
              className="min-h-[220px] w-full rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-800 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-800">Prefer to upload?</p>
                <p>Select a .txt file and we'll extract the contents automatically.</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="ml-auto"
            >
              Choose file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Continue to games
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
