import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Header from './components/Header'
import ImageUpload from './components/ImageUpload'
import GenerateButton from './components/GenerateButton'
import ResultDisplay from './components/ResultDisplay'
import Toast from './components/Toast'
import AuthForm from './components/AuthForm'
import { useSession } from './auth/useSession'
import { blendImages } from './api/blend'

export default function App() {
  const { session, loading: sessionLoading } = useSession()
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url)
    }
  }, [result])

  async function handleGenerate() {
    if (!image1 || !image2) {
      setError('Please upload both images before generating.')
      return
    }
    setLoading(true)
    setError(null)
    if (result?.url) {
      URL.revokeObjectURL(result.url)
      setResult(null)
    }
    try {
      const next = await blendImages(image1, image2)
      setResult(next)
    } catch (e) {
      if (e.code === 'ERR_NETWORK') {
        setError('Ensure your local n8n instance is running on port 5678.')
      } else if (e.response?.status) {
        setError(`Webhook returned ${e.response.status}. Check the n8n workflow.`)
      } else {
        setError(`Request failed: ${e.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!result?.url) return
    const ext = (result.mime?.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
    const a = document.createElement('a')
    a.href = result.url
    a.download = `blend-result.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const canGenerate = Boolean(image1 && image2)
  const userName = session?.user?.user_metadata?.name ?? ''

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {sessionLoading ? (
        <div className="flex min-h-screen items-center justify-center text-neutral-400">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : !session ? (
        <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
          <AuthForm />
        </main>
      ) : (
        <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 sm:py-16">
          <Header userName={userName} />

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ImageUpload
              label="Base Person / Model"
              hint="Slot 1"
              file={image1}
              onFile={setImage1}
              onError={setError}
            />
            <ImageUpload
              label="Garment / Clothing"
              hint="Slot 2"
              file={image2}
              onFile={setImage2}
              onError={setError}
            />
          </section>

          <GenerateButton
            disabled={!canGenerate}
            loading={loading}
            onClick={handleGenerate}
          />

          <ResultDisplay
            url={result?.url}
            mime={result?.mime}
            loading={loading}
            onDownload={handleDownload}
          />

          <footer className="pt-4 text-center text-xs text-neutral-600">
            POSTs to <code className="text-neutral-500">localhost:5678</code> as
            multipart/form-data · response handled as blob
          </footer>
        </main>
      )}

      <Toast message={error} onClose={() => setError(null)} />
    </div>
  )
}
