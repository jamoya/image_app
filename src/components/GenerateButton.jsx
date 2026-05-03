import { Loader2, Sparkles } from 'lucide-react'

export default function GenerateButton({ disabled, loading, onClick }) {
  const isDisabled = disabled || loading
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-base font-semibold tracking-wide transition-all duration-200
        ${
          isDisabled
            ? 'cursor-not-allowed bg-[#1a1a1a] text-neutral-500 ring-1 ring-[#2a2a2a]'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_24px_-6px_rgba(120,80,255,0.6)] hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_36px_-6px_rgba(120,80,255,0.8)] active:scale-[0.99]'
        }
      `}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing AI...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate
          </>
        )}
      </span>
      {!isDisabled && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </button>
  )
}
