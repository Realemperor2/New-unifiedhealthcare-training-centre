'use client'

import { useState } from 'react'

export default function HealthScan() {
  const [scanning, setScanning] = useState(false)

  const startScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      // In a real app, this would trigger an API call and update the health data
    }, 3000)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Health Scan</h3>
      <button
        onClick={startScan}
        disabled={scanning}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {scanning ? 'Scanning...' : 'Start Scan'}
      </button>
    </div>
  )
}

