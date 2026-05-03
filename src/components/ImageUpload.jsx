import { useEffect, useMemo, useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024

export default function ImageUpload({ label, hint, file, onFile, onError }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function pickFiles(list) {
    if (!list || list.length === 0) return
    const f = list[0]
    if (!ALLOWED_TYPES.includes(f.type)) {
      onError?.(`Unsupported file type. Use PNG, JPEG, or WEBP.`)
      return
    }
    if (f.size > MAX_BYTES) {
      const mb = (MAX_BYTES / (1024 * 1024)).toFixed(0)
      onError?.(`File is too large. Max ${mb} MB.`)
      return
    }
    onFile(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    pickFiles(e.dataTransfer.files)
  }

  function onChange(e) {
    pickFiles(e.target.files)
    e.target.value = ''
  }

  function clear(e) {
    e.stopPropagation()
    onFile(null)
  }

  const borderClass = dragOver
    ? 'border-blue-500/70 bg-blue-500/5'
    : file
    ? 'border-[#2a2a2a]'
    : 'border-[#333] hover:border-[#555]'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium tracking-wide text-neutral-200">
          {label}
        </span>
        {hint && (
          <span className="text-xs text-neutral-500">{hint}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`group relative w-full aspect-square overflow-hidden rounded-2xl border border-dashed bg-[#141414] transition-colors ${borderClass}`}
      >
        {file ? (
          <>
            <img
              src={previewUrl}
              alt={file.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              role="button"
              tabIndex={0}
              onClick={clear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') clear(e)
              }}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-neutral-100 backdrop-blur-sm transition-colors hover:bg-red-500/80"
              aria-label="Remove image"
            >
              <X size={18} />
            </span>
            <div className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-4 py-3 text-left text-xs text-neutral-300">
              {file.name}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-neutral-400">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f1f] text-neutral-300 transition-colors group-hover:bg-[#272727]">
              <Upload size={22} />
            </div>
            <div className="text-sm font-medium text-neutral-300">
              Drop image or click to browse
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <ImageIcon size={12} />
              PNG, JPG, WEBP
            </div>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={onChange}
        className="hidden"
      />
    </div>
  )
}
