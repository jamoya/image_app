import { LogOut, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Header({ userName }) {
  return (
    <header className="relative flex flex-col items-center gap-3 text-center">
      {userName != null && (
        <div className="absolute right-0 top-0 flex items-center gap-3 text-xs text-neutral-400">
          <span>
            Hi, <span className="text-neutral-200">{userName || 'there'}</span>
          </span>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-1 rounded-full border border-[#2a2a2a] bg-[#141414]/70 px-3 py-1 text-neutral-300 transition hover:border-[#3a3a3a] hover:text-white"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      )}
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
