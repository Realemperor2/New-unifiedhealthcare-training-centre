'use client'

import { useState } from 'react'

export default function HealthReports({ data }) {
  const [sharing, setSharing] = useState(false)

  const shareReport = async () => {
    setSharing(true)
    // Simulating API call to share report
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSharing(false)
    alert('Report shared successfully!')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Health Reports</h3>
      <button
        onClick={shareReport}
        disabled={sharing}
        className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 disabled:bg-green-300 transition duration-300"
      >
        {sharing ? 'Sharing...' : 'Share Report'}
      </button>
    </div>
  )
}

