'use client'

import { useState, useEffect } from 'react'
import HealthScan from './HealthScan'
import HealthMetrics from './HealthMetrics'
import HolographicBody from './HolographicBody'

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState(null)

  useEffect(() => {
    const fetchHealthData = async () => {
      // In a real app, this would be an API call
      const mockData = {
        heartRate: 75,
        bloodPressure: '120/80',
        temperature: 98.6,
        oxygenSaturation: 98,
      }
      setHealthData(mockData)
    }

    fetchHealthData()
    const interval = setInterval(fetchHealthData, 1800000) // 30 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Health Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HealthScan />
        {healthData && <HealthMetrics data={healthData} />}
        <HolographicBody />
      </div>
    </div>
  )
}

