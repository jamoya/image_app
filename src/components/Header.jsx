import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414]/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-400">
        <Sparkles size={12} className="text-purple-400" />
        Virtual Try-On Studio
      </div>
      <h1 className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
        AI Image Blender
      </h1>
      <p className="max-w-xl text-sm text-neutral-400">
        Upload a base person and a garment. We'll blend them into a single,
        photorealistic try-on result.
      </p>
    </header>
  )
}
