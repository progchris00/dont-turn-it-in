import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { CloudUpload, X, FileText, Loader2, Send } from 'lucide-react'
import { useSubmitAssignment } from '@/hooks/useSubmitAssignment'
import { truncateFileName } from '@/utils'
import { ALLOWED_FILE_TYPES } from '@/constants'
import type { Assignment, Submission } from '@/types'

interface UploadFormProps {
  assignment: Assignment
  onClose:    () => void
  onSuccess:  (submission: Submission) => void
}

export function UploadForm({ assignment, onClose, onSuccess }: UploadFormProps) {
  const [studentName, setStudentName] = useState('')
  const [file, setFile]               = useState<File | null>(null)
  const [dragging, setDragging]       = useState(false)
  const inputRef                      = useRef<HTMLInputElement>(null)
  const { submit, loading, error }    = useSubmitAssignment()

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleSubmit = async () => {
    if (!studentName.trim() || !file) return
    const result = await submit({ assignmentId: assignment.id, studentName, file })
    if (result) onSuccess(result)
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Submit Assignment</h2>
            <p className="text-sm text-gray-500 mt-0.5">{assignment.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Student Name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your name for your submission…"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
        />

        {/* Drop Zone */}
        <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">Attach File</label>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors py-10
            ${dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-surface-muted'}`}
        >
          {file ? (
            <>
              <FileText className="w-8 h-8 text-brand-600" />
              <span className="text-sm font-medium text-gray-700">{truncateFileName(file.name)}</span>
              <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </>
          ) : (
            <>
              <CloudUpload className="w-9 h-9 text-gray-300" />
              <p className="text-sm text-gray-500">Drop files here or click to upload</p>
              <p className="text-xs text-gray-400">Supports {ALLOWED_FILE_TYPES.join(', ').toUpperCase()}</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !studentName.trim() || !file}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? 'Submitting…' : 'Submit Assignment'}
        </button>
      </div>
    </div>
  )
}
