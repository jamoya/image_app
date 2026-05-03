import { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

export default function Toast({ message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-red-500/30 bg-[#1a1010]/95 px-4 py-3 shadow-[0_8px_32px_-12px_rgba(255,80,80,0.5)] backdrop-blur">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
        <p className="flex-1 text-sm text-red-100">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-100"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
