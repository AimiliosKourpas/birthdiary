'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteAccountPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    const res = await fetch('/api/profile/delete', {
      method: 'DELETE',
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-pink-50 rounded-xl shadow-lg border border-pink-300">
      <h1 className="text-3xl font-bold mb-6 text-pink-700 flex items-center gap-2">
        <span role="img" aria-label="warning">
          ⚠️
        </span>
        Delete Account
      </h1>

      <p className="mb-6 text-pink-600 leading-relaxed">
        This action will <strong className="text-red-600">permanently delete</strong> your account and all your memories stored in BirthDiary. 
        Please be certain before you proceed.
      </p>

      <p className="mb-4 text-sm text-pink-700">
        To confirm, please type <strong className="font-mono text-pink-800">DELETE</strong> in the box below:
      </p>

      <input
        type="text"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
        placeholder="Type DELETE to confirm"
        className="w-full mb-6 px-4 py-3 border border-pink-300 rounded-lg text-lg font-mono placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {error && (
        <p className="mb-4 text-center text-red-600 font-semibold">
          {error}
        </p>
      )}

      <button
        onClick={handleDelete}
        disabled={loading || confirmationText !== 'DELETE'}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          confirmationText === 'DELETE' && !loading
            ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
            : 'bg-red-300 cursor-not-allowed'
        }`}
      >
        {loading ? 'Deleting...' : 'Delete My Account'}
      </button>
    </div>
  )
}
