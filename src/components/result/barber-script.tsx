"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BarberScript({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-muted/30 rounded-md p-4 border border-white/5 relative group">
      <div className="absolute top-2 right-2">
        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/10" onClick={copyToClipboard}>
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
        </Button>
      </div>
      <div className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-line pr-6">
        <span className="text-accent/50 block mb-2 text-[10px] uppercase tracking-widest">Technical Instructions</span>
        {content}
      </div>
    </div>
  )
}
