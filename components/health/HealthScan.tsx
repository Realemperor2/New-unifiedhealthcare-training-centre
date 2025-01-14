'use client'

import { useState } from 'react'

export default function HealthScan({ onScanComplete }) {
  const [scanning, setScanning] = useState(false)

  const startScan = async () => {
    setScanning(true)
    try {
      const response = await fetch('/api/health-scan', { method: 'POST' })
      const data = await response.json()
      onScanComplete(data)
    } catch (error) {
      console.error('Scan failed:', error)
    }
    setScanning(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Health Scan</h3>
      <button
        onClick={startScan}
        disabled={scanning}
        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition duration-300"
      >
        {scanning ? 'Scanning...' : 'Start Scan'}
      </button>
    </div>
  )
}

