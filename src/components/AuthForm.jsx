import { useState } from 'react'
import { Loader2, LogIn, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const isSignup = mode === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) throw error
        if (!data.session) {
          setInfo('Check your inbox to confirm your email, then sign in.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414]/70 p-6 shadow-xl backdrop-blur">
        <div className="mb-5 flex items-center justify-center gap-1 rounded-full border border-[#2a2a2a] bg-[#0a0a0a] p-1 text-xs">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              !isSignup
                ? 'bg-[#1f1f1f] text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              isSignup
                ? 'bg-[#1f1f1f] text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign up
          </button>
        </div>

        <h2 className="text-center text-xl font-semibold text-white">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-1 text-center text-xs text-neutral-400">
          {isSignup
            ? 'Sign up to start blending images.'
            : 'Sign in to continue to the studio.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          {isSignup && (
            <Field
              label="Name"
              type="text"
              value={name}
              onChange={setName}
              autoComplete="name"
              required
            />
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={6}
          />

          {error && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-200">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isSignup ? (
              <UserPlus size={14} />
            ) : (
              <LogIn size={14} />
            )}
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, ...rest }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-300">
      <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
      />
    </label>
  )
}
