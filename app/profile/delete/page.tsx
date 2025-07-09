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

    // Redirect after deletion
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Delete Account</h1>
      <p className="mb-4 text-sm text-red-600">
        This will permanently delete your account and all associated data.
        <br />
        To confirm, type <strong className="font-mono">DELETE</strong> below.
      </p>

      <input
        type="text"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        placeholder="Type DELETE to confirm"
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleDelete}
        disabled={loading || confirmationText !== 'DELETE'}
        className={`w-full px-4 py-2 rounded text-white ${
          confirmationText === 'DELETE' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Deleting...' : 'Delete My Account'}
      </button>
    </div>
  )
}
