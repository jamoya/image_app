import { Download, ImageIcon, Loader2 } from 'lucide-react'

export default function ResultDisplay({ url, mime, loading, onDownload }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium tracking-wide text-neutral-200">
          Result
        </h2>
        {url && !loading && (
          <span className="text-xs text-neutral-500">{mime}</span>
        )}
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl border border-[#333] bg-[#141414] ${
          loading ? 'animate-pulse' : ''
        }`}
      >
        <div className="flex min-h-[420px] w-full items-center justify-center">
          {url && !loading ? (
            <img
              src={url}
              alt="Generated result"
              className="max-h-[640px] w-full object-contain"
            />
          ) : loading ? (
            <div className="flex flex-col items-center gap-4 text-neutral-400">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-xl" />
                <Loader2
                  size={28}
                  className="absolute inset-0 m-auto animate-spin text-purple-300"
                />
              </div>
              <span className="text-sm">Blending pixels…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 px-8 py-16 text-neutral-500">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f1f]">
                <ImageIcon size={22} />
              </div>
              <p className="text-sm">Generated Result will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {url && !loading && (
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 self-end rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-[#444] hover:bg-[#1c1c1c]"
        >
          <Download size={16} />
          Download Result
        </button>
      )}
    </section>
  )
}
